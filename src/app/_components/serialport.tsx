"use client";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Button, ButtonGroup, Icon, Text } from "~/common/components";
import { TOPIC_PREFIX } from "~/common/constants";
import { useMqttClient } from "~/common/hooks";
import { useWebSerial } from "../_hooks/useWebSerial";

// TODO
// See if we can bootload https://docs.arduino.cc/retired/hacking/software/FirmataLibrary/
// Resources:
// https://github.com/noopkat/avrgirl-arduino
// https://github.com/monteslu/j5-chrome/blob/29e916c96fa09268dd14faa3de5186b025f6e062/ui.js#L12
// https://github.com/blokdots
type Log = {
  timestamp: Date;
  message: string;
  published?: boolean;
};
const LOG_CUTOFF = 25;
export function SerialPortComponent({ userId }: { userId?: string }) {
  const [logs, setLogs] = useState<Log[]>([]);

  const { connect, publish } = useMqttClient();

  const handleData = useCallback(
    async (data: string) => {
      if (!userId) return;

      const regex = /(VariableID:\d+:\d+)(\/set)(.{1,})/;
      const match = data.match(regex);
      if (match) {
        const [, variableId, , value] = match;
        const topic = `${TOPIC_PREFIX}/${userId}/${variableId}/set`;
        await publish(topic, value ?? "");
      }

      setLogs((logs) =>
        [
          ...logs,
          {
            timestamp: new Date(),
            message: data,
            published: !!match,
          } satisfies Log,
        ].slice(-LOG_CUTOFF),
      );
    },
    [publish, userId],
  );

  const { connect: connectToSerial, disconnect: disconnectWebSerial } =
    useWebSerial(handleData);

  useEffect(() => {
    return connect();
  }, [connect]);

  useEffect(() => {
    console.log("disconnecting from hook");
    return () => {
      void disconnectWebSerial();
    };
  }, [disconnectWebSerial]);

  return (
    <section className="flex flex-col">
      <ButtonGroup className="mb-4">
        <Button onClick={() => connectToSerial(9600)}>
          Request Serial Port
        </Button>
        <Button onClick={disconnectWebSerial}>close port</Button>
      </ButtonGroup>
      <section className="flex-grow rounded-xl bg-gray-900 p-2 shadow-md">
        <ol className="space-y-1 divide-y divide-gray-800">
          {logs.map((log, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 overflow-x-hidden py-0.5"
            >
              <Text dimmed className="flex">
                {`${format(log.timestamp, "HH:mm:ss:SSS")}`
                  .split("")
                  .map((letter, index) => (
                    <Text
                      as="span"
                      className={
                        letter === ":" ? "w-1 text-center" : "w-2 text-center"
                      }
                      key={index}
                    >
                      {letter}
                    </Text>
                  ))}
              </Text>
              <Text dimmed>-</Text>
              <Text>{log.message}</Text>
              {log.published && <Icon icon="SignalIcon" dimmed intent="info" />}
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
