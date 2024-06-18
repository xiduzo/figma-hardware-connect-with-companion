import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Text, Title } from "~/common/components";
import { Navigation } from "../_components/Navigation";

export default async function Page() {
  return (
    <>
      <Navigation />

      <main className="space-y-5 pb-6">
        <section>
          <Title as="h2" className="pb-2 text-xl">
            Figma hardware bridge
          </Title>
          <Text>
            In order to send or receive data the{" "}
            <a
              target="_blank"
              className="underline"
              href="https://www.figma.com/community/plugin/1373258770799080545/figma-hardware-bridge"
            >
              Figma hardware bridge plugin
            </a>{" "}
            needs to be openend your Figma file.
          </Text>
          <Text className="pt-2">
            Serial data should be structured as <code>{`<TOPIC><VALUE>`}</code>
          </Text>
        </section>

        <section className="space-y-1">
          <Title as="h2" className="pb-2 text-xl">
            Sending data
          </Title>
          <Text>
            To send data, copy the <code>set variale topic</code>.
          </Text>
          <Title as="h3" className="pt-3 text-lg">
            Examples:
          </Title>
          <Text>
            In the exampels we will be using{" "}
            <code>fhb/jaquelyn-the-naked-mockingbird/VariableID:117:7/set</code>{" "}
            as the <code>TOPIC</code>.
          </Text>
          <Title as="h4" className="py-2">
            Arduino:
          </Title>
          <SyntaxHighlighter language="cpp" style={a11yDark}>
            {`void setup() {
  Serial.begin(9600); // Set baud rate
}

void loop() {
  int currentValue = analogRead(A0); // read the input on analog pin 0:

  Serial.print("fhb/jaquelyn-the-naked-mockingbird/VariableID:117:7/set"); // use the TOPIC
  Serial.println(currentValue); // println marks the end of the value
  delay(100);  // delay in between reads for stability
}`}
          </SyntaxHighlighter>
        </section>
        <section>
          <Title as="h2" className="mb-2 text-xl">
            Receiving data
          </Title>
          <Text>
            To receive data, copy the <code>get variale topic</code>.
          </Text>
          <Title as="h3" className="pt-3 text-lg">
            Examples:
          </Title>
          <Text>
            In the exampels we will be using{" "}
            <code>fhb/jaquelyn-the-naked-mockingbird/VariableID:117:7/get</code>{" "}
            as the <code>TOPIC</code>.
          </Text>
          <Title as="h4" className="py-2">
            Arduino:
          </Title>
          <Text>
            ⚠️ The following example code is not yet tested, just some dummy
            chatGPT 💩 for now
          </Text>
          <SyntaxHighlighter language="cpp" style={a11yDark}>
            {`void setup() {
  Serial.begin(9600); // Set baud rate
}

void loop() {
  char buffer[256];
  int bytesRead = 0;

  // Read data from serial
  while (Serial.available() > 0) {
    char inChar = Serial.read();
    if (inChar == '\\n') {
      buffer[bytesRead] = '\\0';
      break;
    }
    buffer[bytesRead++] = inChar;
  }

  Serial.println(buffer);

  delay(100);  // delay in between reads for stability
}`}
          </SyntaxHighlighter>
        </section>
      </main>
    </>
  );
}
