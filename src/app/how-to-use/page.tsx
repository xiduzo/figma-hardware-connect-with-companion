import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Text, Title } from "~/common/components";
import { Navigation } from "../_components/Navigation";
import { Content } from "./_components/Content";

export default function Page() {
  return (
    <>
      <Navigation />
      <Content />

      <main className="space-y-7 pb-6">
        <section className="space-y-1">
          <Title className="pb-2 text-xl">Figma hardware bridge</Title>
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
            Serial data is structured as <code>{`<TOPIC><VALUE>\\n`}</code>
          </Text>
        </section>

        <section className="space-y-1">
          <Title as="h2" className="pb-2 text-xl">
            Available data types
          </Title>
          <Text></Text>
        </section>

        <section className="space-y-1">
          <Title as="h2" className="pb-2 text-xl">
            Sending data
          </Title>
          <Text>
            To send data, copy the <code>set variale topic</code>.
          </Text>
          <Title as="h3" className="pt-3 text-lg">
            Examples
          </Title>
          <Title as="h4" className="py-2">
            Arduino
          </Title>
          <SyntaxHighlighter language="arduino" style={a11yDark}>
            {`// For sending data, make sure to have the set topic
const String TOPIC = "fhb/jaquelyn-the-naked-mockingbird/VariableID:117:7/set";

void setup() {
  Serial.begin(9600); // Set baud rate
}

void loop() {
  int currentValue = analogRead(A0); // read the input on analog pin 0:

  Serial.println(TOPIC + currentValue); // make sure to use a println to mark the end of the value

  delay(10);  // delay in between reads for stability
}`}
          </SyntaxHighlighter>
        </section>

        <section className="space-y-1">
          <Title as="h2" className="mb-2 text-xl">
            Receiving data
          </Title>
          <Text>
            To receive data, copy the <code>get variale topic</code>.
          </Text>
          <Title as="h3" className="pt-3 text-lg">
            Examples
          </Title>
          <Title as="h4" className="py-2">
            Arduino
          </Title>
          <SyntaxHighlighter language="arduino" style={a11yDark}>
            {`// For receiving data, make sure to have the get topic
const String TOPIC = "fhb/jaquelyn-the-naked-mockingbird/VariableID:117:7/get";

void setup() {
  Serial.begin(9600); // Set baud rate
}

void loop() {
  while (Serial.available() > 0) {
    String serialMessage = Serial.readStringUntil('\\n'); // Read to the end of a line

    // Check if the message starts with your TOPIC
    if(serialMessage.startsWith(TOPIC)) {
      serialMessage.replace(TOPIC, ""); // Remove the TOPIC to get the value
      Serial.println(serialMessage); // serialMessage just contains the value now
    }
  }
}`}
          </SyntaxHighlighter>
        </section>
      </main>
    </>
  );
}
