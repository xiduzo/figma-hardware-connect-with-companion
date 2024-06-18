import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';

// Heavily inspired by https://web.dev/serial/ and
// https://github.com/PabloMarozzi/Web-Serial-Monitor/blob/master/index.js
export function useWebSerial(onData: (data: string) => void | Promise<void>) {
  const [isConnected, setIsConnected] = useState(false)
  const port = useRef<SerialPort | null>(null);
  const reader = useRef<ReadableStreamDefaultReader<string> | null>(null);
  const inputStream = useRef<ReadableStream | null>(null);
  const inputDone = useRef<Promise<void> | null>(null);
  const outputStream = useRef<WritableStream | null>(null);
  const outputDone = useRef<Promise<void> | null>(null);

  const readLoop = useCallback(() => {
    reader.current?.read().then(({ value, done }) => {
      if (value) {
        void onData(value)
      }
      if (done) {
        reader.current?.releaseLock()
      }
      requestAnimationFrame(readLoop)
    }).catch(console.error)
  }, [onData])

  const disconnect = useCallback(async () => {
    if (!port.current) return

    if (reader.current) {
      await reader.current.cancel().catch(console.error)
      reader.current = null
      await inputDone.current?.catch(console.error)
      inputDone.current = null
    }

    if (outputStream.current) {
      await outputStream.current.getWriter().close().catch(console.error)
      outputStream.current = null
      await outputDone.current?.catch(console.error)
      outputDone.current = null
    }

    await port.current.close().catch(console.error)
    port.current = null
    setIsConnected(false)
  }, [])

  const connect = useCallback(async (baudRate: number) => {
    const newPort = await navigator.serial.requestPort().catch((error: unknown) => {
      console.warn("failed to request port", { error })
    })
    if (!newPort) return

    port.current = newPort

    try {
      await newPort.open({ baudRate })

      // Receive
      const decoder = new TextDecoderStream();
      inputDone.current = newPort.readable.pipeTo(decoder.writable)
      inputStream.current = decoder.readable.pipeThrough(new TransformStream(new LineBreakTransformer()))
      reader.current = inputStream.current.getReader()

      // Send
      const encoder = new TextEncoderStream()
      outputDone.current = encoder.readable.pipeTo(newPort.writable as WritableStream<Uint8Array>)
      outputStream.current = encoder.writable

      void readLoop()
      setIsConnected(true)
    } catch (error) {
      console.warn("Unable to open open", { error })
      toast.warn(`Unable to open port at ${baudRate} baud`)
    }

    return () => disconnect()
  }, [disconnect, readLoop])

  const send = useCallback((data: string) => {
    if (port.current) return

    const writer = outputStream.current?.getWriter()
    if (!writer) return

    writer.write(data).catch(console.error)
    writer.releaseLock()
  }, [])

  return { connect, send, disconnect, isConnected }
}

class LineBreakTransformer {
  #container = '';

  transform(chunk: string, controller: TransformStreamDefaultController) {
    this.#container += chunk;
    const lines = this.#container.split('\n');
    this.#container = lines.pop() ?? '';
    lines.forEach(line => controller.enqueue(line));
  }

  flush(controller: TransformStreamDefaultController) {
    controller.enqueue(this.#container);
  }
}
