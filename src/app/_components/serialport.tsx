"use client";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  ConnectionIndicator,
  Icon,
  Select,
  Text,
} from "~/common/components";
import { TOPIC_PREFIX } from "~/common/constants";
import { useMqttClient } from "~/common/hooks";
import { api } from "~/trpc/react";
import { useWebSerial } from "../_hooks/useWebSerial";

// TODO
// See if we can bootload https://docs.arduino.cc/retired/hacking/software/FirmataLibrary/
// Resources:
// https://github.com/noopkat/avrgirl-arduino
// https://github.com/monteslu/j5-chrome/blob/29e916c96fa09268dd14faa3de5186b025f6e062/ui.js#L12
// https://github.com/blokdots
type Log = {
  timestamp: Date;
  topic: string;
  value: string;
  published?: boolean;
  type: "received" | "sent";
};
const LOG_CUTOFF = 5;
export function SerialPortComponent({ userId }: { userId?: string }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [baud, setBaud] = useState(9600);
  const { data } = api.figma.get.useQuery(undefined, {
    refetchInterval: 10000,
  });

  const { connect, publish, subscribe, isConnected } = useMqttClient();

  const handleData = useCallback(
    async (data: string) => {
      if (!userId) return;

      const regex = /(VariableID:\d+:\d+)(\/set)(.{1,})/;
      const match = data.match(regex);
      let topic = data;
      let sendValue = "";
      if (match) {
        const [, variableId, , value] = match;
        topic = `${TOPIC_PREFIX}/${userId}/${variableId}/set`;
        sendValue = value ?? "";
        await publish(topic, value ?? "");
      }

      setLogs((logs) =>
        [
          ...logs,
          {
            timestamp: new Date(),
            topic,
            value: sendValue,
            published: !!match,
            type: "sent",
          } satisfies Log,
        ].slice(-LOG_CUTOFF),
      );
    },
    [publish, userId],
  );

  const {
    connect: connectToSerial,
    disconnect: disconnectWebSerial,
    isConnected: isSerialConnected,
    send,
  } = useWebSerial(handleData);

  useEffect(() => {
    return connect();
  }, [connect]);

  useEffect(() => {
    return () => {
      void disconnectWebSerial();
    };
  }, [disconnectWebSerial]);

  useEffect(() => {
    data?.forEach((variable) => {
      subscribe(
        `${TOPIC_PREFIX}/${variable.uid}/${variable.id}/get`,
        (topic, message) => {
          send(topic + message.toString() + "\n")
            .then((send) => {
              setLogs((logs) =>
                [
                  ...logs,
                  {
                    timestamp: new Date(),
                    topic: topic,
                    value: message.toString(),
                    type: "received",
                    published: !!send,
                  } satisfies Log,
                ].slice(-LOG_CUTOFF),
              );
            })
            .catch(console.error);
        },
      );
    });
  }, [subscribe, data, send]);

  return (
    <section className="flex flex-col">
      <ConnectionIndicator isConnected={isConnected} className="mb-4">
        <Text>Figma plugin connection</Text>
      </ConnectionIndicator>
      <ButtonGroup className="mb-4">
        <Select
          value={baud}
          disabled={isSerialConnected}
          onChange={({ target }) => setBaud(Number(target.value))}
        >
          {[
            300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 74880, 115200,
            230400, 250000, 500000, 1000000, 2000000,
          ].map((value) => (
            <option value={value} key={value}>
              {value} baud
            </option>
          ))}
        </Select>
        {!isSerialConnected && (
          <Button onClick={() => connectToSerial(baud)}>Connect serial</Button>
        )}
        {isSerialConnected && (
          <Button onClick={disconnectWebSerial}>Disconnect serial</Button>
        )}
      </ButtonGroup>
      <section className="flex-grow overflow-scroll rounded-xl bg-gray-900 p-2 shadow-md">
        <ol className="space-y-1 divide-y divide-gray-800">
          {logs.map((log, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 overflow-x-hidden py-0.5"
            >
              {
                <Icon
                  icon={log.type === "sent" ? "ArrowUpIcon" : "ArrowDownIcon"}
                  dimmed
                  intent="info"
                />
              }
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
              <Text className="flex-grow">{log.topic}</Text>
              <Text>{log.value}</Text>
              {log.published && <Icon icon="SignalIcon" dimmed intent="info" />}
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
