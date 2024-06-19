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

ℹ️ Although the plugin allows for a wide range of values to be sent and tries it best to map it to a Figma value. It is best to stick to the Figma value format to prevent any issues.

### Color

Color values only accept RGB(A) and HEX values.

⚠️ when setting the color value using `rgb` format all values **up untill** 1 will be multiplied by 255. `Alpha` values **up untill** 1 will be multiplied by 100. All values after are used as is.

| Set value                       | Figma value | Opacity |
| ------------------------------- | ----------- | ------- |
| `#00`                           | `#000000`   | `100%`  |
| `#FF`                           | `#FFFFFF`   | `100%`  |
| `#000`                          | `#000000`   | `100%`  |
| `#000000`                       | `#000000`   | `100%`  |
| `#00000050`                     | `#000000`   | `50%`   |
| `#00000000`                     | `#000000`   | `0%`    |
| `"{"r":0,"g":0,"b":0,"a":1}"`   | `#000000`   | `100%`  |
| `"{"r":0,"g":0,"b":0,"a":0}"`   | `#000000`   | `0%`    |
| `"{"r":0,"g":0,"b":0}"`         | `#000000`   | `100%`  |
| `"{"r":1,"g":1,"b":1}"`         | `#FFFFFF`   | `100%`  |
| `"{"r":255,"g":255,"b":255}"`   | `#FFFFFF`   | `100%`  |
| `"{"r":1,"g":0.8,"b":0}"`       | `#FFCC00`   | `100%`  |
| `"{"r":255,"g":204,"b":0}"`     | `#FFCC00`   | `100%`  |
| `"{"r":0,"g":0,"b":0,"a":0.5}"` | `#000000`   | `50%`   |
| `"{"r":0,"g":0,"b":0,"a":90}"`  | `#000000`   | `90%`   |

| Figma value         | Opacity | Get value                       |
| ------------------- | ------- | ------------------------------- |
| HEX `#000000`       | `100%`  | `"{"r":0,"g":0,"b":0,"a":1}"`   |
| HEX`#000000`        | `50%`   | `"{"r":0,"g":0,"b":0,"a":0.5}"` |
| HEX `#000000`       | `0%`    | `"{"r":0,"g":0,"b":0,"a":0}"`   |
| HEX `#FFCC00`       | `100%`  | `"{"r":1,"g":0.8,"b":0,"a":1}"` |
| RGB `255, 255, 255` | `100%`  | `"{"r":1,"g":1,"b":1,"a":1}"`   |

### Number

| Set value   | Figma value |
| ----------- | ----------- |
| `1`         | `1`         |
| `1.0`       | `1`         |
| `1.1`       | `1.1`       |
| `"1"`       | `1`         |
| `"1.0"`     | `1`         |
| `"1.1"`     | `1.1`       |
| `1.2345678` | `1.23`      |
| `1.5555555` | `1.56`      |

| Figma value | Get value |
| ----------- | --------- |
| `1`         | `"1"`     |
| `1.0`       | `"1"`     |
| `1.1`       | `"1.1"`   |
| `1.23`      | `"1.23"`  |
| `1.2345678` | `"1.23"`  |
| `1.5555555` | `"1.56"`  |

### String

All strings will be send and received as is.

### Boolean

| Set value | Figma value |
| --------- | ----------- |
| `false`   | `false`     |
| `true`    | `true`      |
| `"true"`  | `true`      |
| `1`       | `true`      |
| `"1"`     | `true`      |
| `"yes"`   | `true`      |
| `"on"`    | `true`      |
| `"si"`    | `true`      |

| Figma value | Get value |
| ----------- | --------- |
| `true`      | `"true"`  |
| `false`     | `"false"` |
