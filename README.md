# Figma hardware bridge

This app allows you to connect hardware devices to Figma over serial.In order to send or receive data the [Figma hardware bridge plugin](https://www.figma.com/community/plugin/1373258770799080545/figma-hardware-bridge) needs to be openend your Figma file.

All Serial data is structured as `[TOPIC][VALUE]\n`.

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
This plugin supports all Figma variable data types.

### Color

### Number

### String

### Boolean



# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.
