# Figma hardware bridge

This app allows you to connect hardware devices to Figma over serial.In order to send or receive data the [Figma hardware bridge plugin](https://www.figma.com/community/plugin/1373258770799080545/figma-hardware-bridge) needs to be openend your Figma file.

All Serial data is structured as `[TOPIC][VALUE]\n`.

In this plugin we make the distinction between two types of topics:

1. `set variable topic` -- This topic is used to send data from Figma to your hardware device.
1. `get variable topic` -- This topic is used to receive data from your hardware device in Figma.

## Sending data

To send data, copy a `set variable topic` from the plugin or the companion app.

### Examples

#### Arduino

```cpp
// For sending data, make sure to have the set topic
const String TOPIC = "fhb/jaquelyn-the-naked-mockingbird/VariableID:117:7/set";

void setup() {
  Serial.begin(9600); // Set baud rate
}

void loop() {
  int currentValue = analogRead(A0); // read the input on analog pin 0:

  Serial.println(TOPIC + currentValue); // make sure to use a println to mark the end of the value

  delay(10);  // delay in between reads for stability
}
```

## Receiving data

To receive data, copy a `get variable topic` from the plugin or the companion app.

⚠️ Receiving data is only possible when updating the variables in your `local variables`. For now, Figma does not support updating variables from a preview or prototype.

### Examples

#### Arduino

```cpp
// For receiving data, make sure to have the get topic
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
}
```

## Available data types

This plugin supports all [Figma variable](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma) data types.

All data received from the plugin will be send as a string over serial. The serial device will need to parse the string to the correct data type.

### Color

For setting a color variable see [The Figma documentation for more](https://www.figma.com/plugin-docs/api/properties/figma-util-rgba/)

#### Get value
The get value of a color will always be a stringified [RGBA](https://www.figma.com/plugin-docs/api/RGB/#RGBA) object
