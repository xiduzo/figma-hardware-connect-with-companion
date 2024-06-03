"use client";
import { useEffect, useState } from "react";
import { Button } from "~/common/components";
import { TOPIC_PREFIX } from "~/common/constants";
import { useMqttClient } from "~/common/hooks";

// TODO
// See if we can bootload https://docs.arduino.cc/retired/hacking/software/FirmataLibrary/
// Resources:
// https://github.com/noopkat/avrgirl-arduino
// https://github.com/monteslu/j5-chrome/blob/29e916c96fa09268dd14faa3de5186b025f6e062/ui.js#L12
// https://github.com/blokdots
export function SerialPortComponent({ userId }: { userId?: string }) {
  const [port, setPort] = useState<SerialPort | null>(null);

  const { connect, publish } = useMqttClient();

  useEffect(() => {
    connect();
  }, [connect]);

  function requestSerialPorts() {
    navigator.serial
      .requestPort()
      .then(async (port) => {
        setPort(port);
        await port.open({
          baudRate: 9600,
        });

        while (port.readable) {
          const reader = port.readable.getReader();
          let strToParse = "";

          try {
            while (true) {
              const result = await reader.read();
              const value = result.value as Uint8Array;
              if (result.done) {
                // Allow the serial port to be closed later.
                reader.releaseLock();
                break;
              }
              if (value) {
                const decoded = new TextDecoder().decode(value);
                strToParse += decoded;
                if (decoded.indexOf("\r\n")) {
                  // regex VariableID:1838:151=<anything>
                  const regex = /VariableID:(\d+):(\d+)=(.{1,})/;
                  const match = strToParse.match(regex);
                  if (match) {
                    const [, collection, id, value] = match;
                    const fullVariableId = `VariableID:${collection}:${id}`;
                    // dont mutate anything on the server,
                    // just use mqtt to send the values to the server
                    //
                    // send to MQTT here
                    if (value) {
                      console.log({ fullVariableId, value });
                      await publish(
                        `${TOPIC_PREFIX}/${userId}/${fullVariableId}`,
                        value,
                      );
                      await new Promise((resolve) => setTimeout(resolve, 200)); // throttle a little bit
                    }
                    strToParse = "";
                  }
                }
              }
            }
          } catch (error) {
            // TODO: Handle non-fatal read error.
          } finally {
            reader.releaseLock();
          }
        }
      })
      .catch(console.warn);
  }

  useEffect(() => {
    return () => {
      port?.close().catch(console.error);
    };
  }, [port]);

  return <Button onClick={requestSerialPorts}>Request Serial Port</Button>;
}
