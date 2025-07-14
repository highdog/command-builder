# beyerdynamic App Bluetooth Protocol Specification

<p align="center">Version 1.9.5</p>

* [beyerdynamic App Bluetooth Protocol Specification](#beyerdynamic-app-bluetooth-protocol-specification)
    * [Overview](#overview)
    * [1. Bluetooth Transports](#1-bluetooth-transports)
        * [1.1. GATT over BLE Requirements](#11-gatt-over-ble-requirements)
        * [1.2. RFCOMM Requirements](#12-rfcomm-requirements)
        * [1.3. iAP2 Requirements](#13-iap2-requirements)
    * [2. Protocol Definition](#2-protocol-definition)
        * [2.1. RFCOMM Protocol Definition](#21-rfcomm-protocol-definition)
            * [2.1.1. Message Header](#211-message-header)
                * [2.1.1.1 SOF Flag](#2111-sof-flag)
                * [2.1.1.2 Version](#2112-version)
                * [2.1.1.3 Flags](#2113-flags)
                * [2.1.1.4 Payload Length](#2114-payload-length)
                * [2.1.1.5 Vendor ID](#2115-vendor-id)
                * [2.1.1.6 Feature ID](#2116-feature-id)
                * [2.1.1.7 Packet type](#2117-packet-type)
                * [2.1.1.8 Command ID](#2118-command-id)
            * [2.1.2. Message Payload](#212-message-payload)
            * [2.1.3. Checksum](#213-checksum)
        * [2.2. GATT over BLE Protocol Definition](#22-gatt-over-ble-protocol-definition)
            * [2.2.1. Message Header](#221-message-header)
                * [2.2.1.1 Vendor ID](#2211-vendor-id)
                * [2.2.1.2 Feature ID](#2212-feature-id)
                * [2.2.1.3 Packet type](#2213-packet-type)
                * [2.2.1.4 Command ID](#2214-command-id)
        * [2.3. Protocol Definition for QCC Platform](#23-protocol-definition-for-qcc-platform)
    * [3. Message Definition](#3-message-definition)
        * [0x00 Get Device Type](#0x00-get-device-type)
        * [0x19 Get Device MAC Address](#0x19-get-device-mac-address)
        * [0x01 Register Notification Listeners](#0x01-register-notification-listeners)
        * [0x02 Get Serial Number](#0x02-get-serial-number)
        * [0x03 Get Feature Version](#0x03-get-feature-version)
        * [0x06 Get Battery Level](#0x06-get-battery-level)
        * [0x07 Get Bluetooth Led Configurations](#0x07-get-bluetooth-led-configurations)
        * [0x08 Set Bluetooth Led Configurations](#0x08-set-bluetooth-led-configurations)
        * [0x09 Get LE Configurations](#0x09-get-le-configurations)
        * [0x0A Set LE Configurations](#0x0A-set-le-configurations)
        * [0x14 Get Firmware Version](#0x14-get-firmware-version)
        * [0x15 Get Earbuds Color](#0x15-get-earbuds-color)
        * [0x16 Set Earbuds Color](#0x16-set-earbuds-color)
        * [0x17 Get Peripheral States](#0x17-get-peripheral-states)
        * [0x41 Get Remaining Battery Time](#0x41-get-remaining-battery-time)
        * [0x44 Get Equalizer Mode](#0x44-get-equalizer-mode)
            * [Equalizer mode v1 payload:](#equalizer-mode-v1-payload)
            * [Equalizer mode v2 payload:](#equalizer-mode-v2-payload)
        * [0x45 Set Equalizer Mode](#0x45-set-equalizer-mode)
        * [0x46 Get User Equalizer Configuration](#0x46-get-user-equalizer-configuration)
            * [User equalizer configuration v3 payload:](#user-equalizer-configuration-v3-payload)
            * [User equalizer configuration v2 payload:](#user-equalizer-configuration-v2-payload)
            * [User equalizer configuration v1 payload:](#user-equalizer-configuration-v1-payload)
            * [Using platform SDKs for EQ configuration (Airoha, QCC):](#using-platform-sdks-for-eq-configuration-airoha-qcc)
        * [0x47 Set User Equalizer Configuration](#0x47-set-user-equalizer-configuration)
        * [0x48 Trigger Media Button](#0x48-trigger-media-button)
        * [0x49 Play Status](#0x49-play-status)
        * [0x4A Get Device Name](#0x4a-get-device-name)
        * [0x4B Set Device Name](#0x4b-set-device-name)
        * [0x4C Get Auto Shutdown Time](#0x4c-get-auto-shutdown-time)
        * [0x4D Set Auto Shutdown Time](#0x4d-set-auto-shutdown-time)
        * [0x4E Get Selected Voice Assistant Mode](#0x4e-get-selected-voice-assistant-mode)
        * [0x4F Set Selected Voice Assistant Mode](#0x4f-set-selected-voice-assistant-mode)
        * [0x59 Get Custom Keys](#0x59-get-custom-keys)
            * [Custom Keys v2 payload:](#custom-keys-v2-payload)
            * [Custom Keys v1 payload:](#custom-keys-v1-payload)
        * [0x5A Set Custom Keys](#0x5a-set-custom-keys)
        * [0x5B Get Prompt Language](#0x5b-get-prompt-language)
        * [0x5C Set Prompt Language](#0x5c-set-prompt-language)
        * [0x5E Get Prompt Sound State](#0x5e-get-prompt-sound-state)
        * [0x5F Set Prompt Sound State](#0x5f-set-prompt-sound-state)
        * [0x66 Get Enabled Voice Prompts](#0x66-get-enabled-voice-prompts)
        * [0x67 Set Enabled Voice Prompts](#0x67-set-enabled-voice-prompts)
        * [0x57 Get Voice Prompts Volume Level](#0x57-get-voice-prompts-volume-level)
        * [0x58 Set Voice Prompts Volume Level](#0x58-set-voice-prompts-volume-level)
        * [0x60 Get ANC Mode](#0x60-get-anc-mode)
        * [0x61 Set ANC Mode](#0x61-set-anc-mode)
        * [0x30 Get Non-Adaptive ANC Level](#0x30-get-non-adaptive-anc-level)
        * [0x31 Set Non-Adaptive ANC Level](#0x31-set-non-adaptive-anc-level)
        * [0x32 Get ANC Transparency Gain](#0x32-get-anc-transparency-gain)
        * [0x33 Set ANC Transparency Gain](#0x33-set-anc-transparency-gain)
        * [0x34 Get ANC Wind Noise Detection Mode](#0x34-get-anc-wind-noise-detection-mode)
        * [0x35 Set ANC Wind Noise Detection Mode](#0x35-set-anc-wind-noise-detection-mode)
        * [0x36 Get Adaptive ANC Level](#0x36-get-adaptive-anc-level)
        * [0x37 Get ANC On Mode](#0x37-get-anc-on-mode)
        * [0x38 Set ANC On Mode](#0x38-set-anc-on-mode)
        * [0x62 Get Low Latency Mode](#0x62-get-low-latency-mode)
        * [0x63 Set Low Latency Mode](#0x63-set-low-latency-mode)
        * [0x64 Get Wearing Detection Configuration](#0x64-get-wearing-detection-configuration)
        * [0x65 Set Wearing Detection Configuration](#0x65-set-wearing-detection-configuration)
        * [0x68 Get LED Brightness](#0x68-get-led-brightness)
        * [0x69 Set LED Brightness](#0x69-set-led-brightness)
        * [0x70 Get Sidetone Mode](#0x70-get-sidetone-mode)
        * [0x71 Set Sidetone Mode](#0x71-set-sidetone-mode)
        * [0x72 Get Sidetone Gain](#0x72-get-sidetone-gain)
        * [0x73 Set Sidetone Gain](#0x73-set-sidetone-gain)
        * [0x7C Get Dolby Atmos Config](#0x7c-get-dolby-atmos-config)
        * [0x7D Set Dolby Atmos Config](#0x7d-set-dolby-atmos-config)
        * [0x7E Get Audio Codecs Configurations](#0x7e-get-audio-codecs-configurations)
        * [0x7F Set Audio Codecs Configurations](#0x7f-set-audio-codecs-configurations)
        * [0x5D Factory Reset](#0x5d-factory-reset)
        * [0x20 Get Usage Statistics](#0x20-get-usage-statistics)
        * [0x21 Reset Usage Statistics](#0x21-reset-usage-statistics)
        * [Error Payload](#error-payload)
    * [4. Firmware Over-the-Air Updates (FOTA)](#4-firmware-over-the-air-updates-fota)
    * [5. Example Package Flow](#5-example-package-flow)
        * [5.1. GetBatteryLevel command](#51-getbatterylevel-command)
        * [5.2. GetBatteryLevel changed notification](#52-getbatterylevel-changed-notification)
        * [5.3. GetBatteryLevel earbud disconnected notification](#53-getbatterylevel-earbud-disconnected-notification)
    * [6. Statistics Item Types](#6-statistics-item-types)
        * [0x00 Total Runtime](#0x00-total-runtime)
        * [0x01 Power On Events](#0x01-power-on-events)
        * [0x02 Music Playback Time](#0x02-music-playback-time)
        * [0x03 Voice Call Time](#0x03-voice-call-time)
        * [0x04 Error Counter Total](#0x04-error-counter-total)
        * [0x05 Accepted Calls Counter](#0x05-accepted-calls-counter)
        * [0x06 Button Presses Counter](#0x06-button-presses-counter)
        * [0x07 Volume Level Lifetime Average](#0x07-volume-level-lifetime-average)
        * [0x08 Time Multipoint Mode Used](#0x08-time-multipoint-mode-used)
        * [0x09 Time ANC Mode Used](#0x09-time-anc-mode-used)
        * [0x0A Time Low Latency Mode Used](#0x0a-time-low-latency-mode-used)
        * [0x0B Error Information](#0x0b-error-information)
    * [7. Testing](#7-testing)
        * [Android](#android)
            * [Overview](#overview-1)
            * [Connecting to a Device](#connecting-to-a-device)
            * [Testing Commands](#testing-commands)
            * [FOTA](#fota)
            * [Extracting App Logs](#extracting-app-logs)
            * [Copying OTA Files to Main User-Facing App](#copying-ota-files-to-main-user-facing-app)

## Overview

This document is the communication protocol between beyerdynamic mobile apps and headphones over Bluetooth.

The purpose of this document is to define the common protocol that can be reused between different headphone models
without reinventing the wheel for every earbud model.

**IMPORTANT!!!** The Messages marked as Mandatory must be implemented in every beyerdynamic earbuds model.

## 1. Bluetooth Transports

The protocol supports three Bluetooth transports:

- GATT over Bluetooth Low Energy (BLE)
- Bluetooth RFCOMM (Android only)
- Apple MFI iAP2 (iOS only)

### 1.1. GATT over BLE Requirements

If beyerdynamic earbuds choose BLE to communicate with app, then they are required to support the following GATT
services and characteristics:

QCC platform:

| **Description**         | **UUID**                                 | **Properties** | **Permissions** | **Notes**                 |
|-------------------------|------------------------------------------|----------------|-----------------|---------------------------|
| Advertise Service       | 7BF0                                     |                |                 |                           |
| beyerdynamic Service    | 54943f52-bdfd-48a0-855**a**-3b5471a6b4ab |                |                 |                           |
| Command Characteristic  | 00001101-D102-11E1-9B23-00025B00A5A5     | NA             | NA              | Gaia SDK command channel  |
| Response Characteristic | 00001102-D102-11E1-9B23-00025B00A5A5     | NA             | NA              | Gaia SDK response channel |
| Data Characteristic     | 00001103-D102-11E1-9B23-00025B00A5A5     | NA             | NA              | Gaia SDK data channel     |

The Command Characteristic, the Response Characteristic and the Data Characteristic are defined by the Gaia SDK.

Airoha platform:

| **Description**                     | **UUID**                                 | **Properties** | **Permissions** | **Notes**                                                                            |
|-------------------------------------|------------------------------------------|----------------|-----------------|--------------------------------------------------------------------------------------|
| Advertise Service                   | 7BF0                                     |                |                 |                                                                                      |
| beyerdynamic Custom Command Service | 54943f52-bdfd-48a0-855**a**-3b5471a6b4ab |                |                 |                                                                                      |
| Custom Command Characteristic       | 78DB4F9**1**-DDF7-4A83-92E9-3CE422C89975 | Write          | Encrypted       | beyerdynamic custom command data transfer from a mobile phone to an accessory device |
| Custom Command Characteristic       | 78DB4F9**2**-DDF7-4A83-92E9-3CE422C89975 | Read, Notify   | Encrypted       | beyerdynamic custom command data transfer from an accessory device to a mobile phone |
| OTA Service                         | 54943f52-bdfd-48a0-855**b**-3b5471a6b4ab |
| OTA Characteristic                  | 43484152-2DAB-3**2**41-6972-6F6861424C45 | NA             | NA              | OTA data transfer from a mobile phone to an accessory device                         |
| OTA Characteristic                  | 43484152-2DAB-3**1**41-6972-6F6861424C45 | NA             | NA              | OTA data transfer from an accessory device to a mobile phone                         |

The OTA Characteristics are defined by the Airoha SDK.

Realtek platform:

| **Description**                     | **UUID**                                 | **Properties** | **Permissions** | **Notes**                                                                            |
|-------------------------------------|------------------------------------------|----------------|-----------------|--------------------------------------------------------------------------------------|
| Advertise Service                   | 7BF0                                     |                |                 |                                                                                      |
| beyerdynamic Custom Command Service | 54943f52-bdfd-48a0-855**a**-3b5471a6b4ab |                |                 |                                                                                      |
| Custom Command Characteristic       | 78DB4F9**1**-DDF7-4A83-92E9-3CE422C89975 | Write          | Encrypted       | beyerdynamic custom command data transfer from a mobile phone to an accessory device |
| Custom Command Characteristic       | 78DB4F9**2**-DDF7-4A83-92E9-3CE422C89975 | Read, Notify   | Encrypted       | beyerdynamic custom command data transfer from an accessory device to a mobile phone |

BES platform:

| **Description**                     | **UUID**                                 | **Properties** | **Permissions** | **Notes**                                                                            |
|-------------------------------------|------------------------------------------|----------------|-----------------|--------------------------------------------------------------------------------------|
| Advertise Service                   | 7BF0                                     |                |                 |                                                                                      |
| beyerdynamic Custom Command Service | 54943f52-bdfd-48a0-855**a**-3b5471a6b4ab |                |                 |                                                                                      |
| Custom Command Characteristic       | 78DB4F9**1**-DDF7-4A83-92E9-3CE422C89975 | Write          | Encrypted       | beyerdynamic custom command data transfer from a mobile phone to an accessory device |
| Custom Command Characteristic       | 78DB4F9**2**-DDF7-4A83-92E9-3CE422C89975 | Read, Notify   | Encrypted       | beyerdynamic custom command data transfer from an accessory device to a mobile phone |
| OTA Command Characteristic       | 78DB4F9**3**-DDF7-4A83-92E9-3CE422C89975 | Write, Notify   | NA       | BES OTA command data transfer between an accessory device and a mobile phone |


Device should advertise its MAC ADDRESS within the 6 bytes to 11 bytes of the kCBAdvDataManufacturerData. App will check
this MAC ADDRESS to determine if the device is a beyerdynamic device. This MAC ADDRESS should as same as the MAC ADDRESS which reported by A2DP.
Please always report the same MAC ADDRESS to the app, for example: even after a master-slave switch, the reported MAC ADDRESS should not change.

The following is an example. The part underlined in red is the MAC address:

<img src="assets/BLE-MAC-Address_Example.png" alt="drawing" width="200"/>

**IMPORTANT!!!**  If the device hasn't connected to mobile phone via A2DP, device should not start the BLE advertisement.

> TODO: We should consider a 16-bit Advertise Service UUID from Bluetooth SIG

### 1.2. RFCOMM Requirements

Beyerdynamic device that wants to exchange data over RFCOMM shall support one of the following RFCOMM channel UUID:

- If your device uses GAIA library: `54943f52-bd0d-48a0-855a-3b5471a6b4ab`
- Otherwise: `54943f52-bdfd-48a0-855a-3b5471a6b4ab`

This UUID is used for the main communication channel between the mobile app and the device
to change settings, get battery level, etc.

**Important:** RFCOMM messages might be grouped together in a single packet by Android sometimes
when multiple messages are sent soon after previous. In this case, the device will receive a byte array
that contains multiple messages with their own header, payload, etc.
The device should be able to handle this and separate messages from each other.
Use the payload length to identify where a message ends.

UUIDs for OTA libraries:

- WUQI OTA lib: `00001101-0000-1000-8000-00805f9b34fb`
- Airoha SDK: `7b46e8de-5a7e-4512-be0d-863aeaa3312b`
- GAIA / QCC: `54943f52-bd0d-48a0-855a-3b5471a6b4ab`
- Realtek: `60ea72e7-3bb8-4035-8d66-6272120f1bac`
- BES: `54943f52-bdfd-48a0-855a-3b5471a6b4ab`

### 1.3. iAP2 Requirements

Beyerdynamic devices must be MFi certified and implement the iAP protocol in order to use RFCOMM on iOS. The device
shall use the External Accessory (EA) protocol name `com.beyerdynamic.headphones`.

For platforms where bundle identifier cannot be equal to the protocol name, the protocol name can be changed to `com.beyerdynamic.headphones.deviceName`.

## 2. Protocol Definition

Below you can find the protocol definition for the communication between the mobile app and the device:

- [RFCOMM Protocol Definition](#21-rfcomm-protocol-definition)
- [GATT over BLE Protocol Definition](#22-gatt-over-ble-protocol-definition)

The protocol is defined as a series of messages that can be sent between the mobile app and the device.

Note that for some platforms we might use a separate format. For example, for QCC platforms, we use GAIA client.
See [2.3. Protocol Definition for QCC Platform](#23-protocol-definition-for-qcc-platform) for more details.

### 2.1. RFCOMM Protocol Definition

RFCOMM beyerdynamic messages consist of 3 parts:

1. Header (8-9 bytes)
2. Optional payload (variable length)
3. Optional checksum (1 byte)

**Important:** RFCOMM messages might be grouped together in a single packet by Android sometimes
when multiple messages are sent soon after previous. In this case, the device will receive a byte array
that contains multiple messages, with each message having its own header, payload and checksum.
The device should be able to handle this and separate messages from each other.
Use the payload length and SOF flag to identify where a message ends and another message begins.

#### 2.1.1. Message Header

The message header is composed of 8 or 9 bytes that help identify and decode a message.
Each field is stored as Big Endian.

| **Parameter**  | **Size**    | **Description**                                                                     |
|----------------|-------------|-------------------------------------------------------------------------------------|
| SOF Flag       | 8-bit       | This is a constant 0xFF value. Used to identify the start of a new message.         |
| Version        | 8-bit       | The version of the protocol. The current version is 4.                              |
| Flags          | 8-bit       | Bit fields to exchange metadata.                                                    |
| Payload Length | 8 or 16-bit | Length of the message payload in bytes. 8 vs 16 bit length is controlled by a flag. |
| Vendor ID      | 16-bit      | Constant 0x2E50 for now.                                                            |
| Feature ID     | 7-bit       | Constant 0x11 for now.                                                              |
| Packet Type    | 2-bit       | Whether it is a command, a response, a notification, etc.                           |
| Command ID     | 7-bit       | Identifier of a specific message command (i.e. GetBatteryLevel).                    |

##### 2.1.1.1 SOF Flag

Type: uint8

Every message should begin with 0xFF.

If a message doesn't start with 0xFF, bytes are skipped until 0xFF is found.
The message then starts from that found 0xFF.

##### 2.1.1.2 Version

Type: uint8

This is primarily for future compatibility. For now, only version `4` is supported.

##### 2.1.1.3 Flags

Type: uint8 byte mask

Bits are counted from the least significant bit.

A value of `1` for that bit means it's set. `0` means not set.

| **Bit index** | **Name**         | **Description**                                                                                                                                                       |
|---------------|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0             | CHECKSUM         | The flag is raised when the frame contains a checksum.                                                                                                                |
| 1             | LENGTH_EXTENSION | The flag is raised when the frame uses the length extension: two bytes to represent the payload length. If not set, payload length should be represented as one byte. |
| 2-7           |                  | Reserved                                                                                                                                                              |

Example:

- `0b00000000` - No flags are set.
- `0b00000001` - CHECKSUM flag is set.
- `0b00000010` - LENGTH_EXTENSION flag is set.
- `0b00000011` - Both CHECKSUM and LENGTH_EXTENSION flags are set.

##### 2.1.1.4 Payload Length

Type: uint8 or uint16

uint8 is used by default.
But if LENGTH_EXTENSION [flag](#2113-flags) is set, then uint16 is used instead and this header parameter occupies 2
bytes.

The size of the payload in this packet. Measured in bytes.

Payload length can be zero, meaning this packet has an empty payload.

##### 2.1.1.5 Vendor ID

Type: uint16

This is a constant 0x2E50 for now.

##### 2.1.1.6 Feature ID

Type: 7 bits

This is a constant 0x11 for now.

It is recommended to read 2 bytes at once.
And then take the most significant 7 bits of the first byte as Feature ID.
The least significant bit of the first byte and the most significant bit of the second byte is Packet Type.
The remaining 7 least significant bits of the second byte is Command ID.
7+2+7 = 16 bits = 2 bytes.

##### 2.1.1.7 Packet type

Type: 2 bits

| **Value** | **Name**     | **Description**                                                                                            |
|-----------|--------------|------------------------------------------------------------------------------------------------------------|
| 0x00      | COMMAND      | A COMMAND is expected to be sent from mobile side to the device.                                           |
| 0x01      | NOTIFICATION | A NOTIFICATION is expected to be sent from the device to the mobile side as a spontaneous message.         |
| 0x02      | RESPONSE     | A RESPONSE is expected to be sent from the device to the mobile side as a successful answer to a COMMAND.  |
| 0x03      | ERROR        | An ERROR is expected to be sent from the device to the mobile side as an unsuccessful answer to a COMMAND. |

It is recommended to read 2 bytes at once.
And then take the most significant 7 bits of the first byte as Feature ID.
The least significant bit of the first byte and the most significant bit of the second byte is Packet Type.
The remaining 7 least significant bits of the second byte is Command ID.
7+2+7 = 16 bits = 2 bytes.

See [5. Example Package Flow](#5-example-package-flow) for an example of how each packet type is used.

##### 2.1.1.8 Command ID

Type: 7 bits

Signals the type of the command or notification sent between mobile side and the device.

See [3. Message Definition](#3-message-definition) for possible command ID values.

It is recommended to read 2 bytes at once.
And then take the most significant 7 bits of the first byte as Feature ID.
The least significant bit of the first byte and the most significant bit of the second byte is Packet Type.
The remaining 7 least significant bits of the second byte is Command ID.
7+2+7 = 16 bits = 2 bytes.

#### 2.1.2. Message Payload

Type: binary (variable length)

Every message should contain a payload that has length equal to the one set in [payload length](#2114-payload-length).

Payload length can be zero, meaning this packet has an empty payload.

See [3. Message Definition](#3-message-definition) for acceptable message payload formats for each Command ID.

#### 2.1.3. Checksum

Type: absent or uint8

Checksum should be present only if CHECKSUM [flag](#2113-flags) is set.

Checksum is calculated by doing bitwise XOR for each byte within header+payload.
header+payload is all bytes in the packet except the last checksum byte.

If checksum does not match, the packet should be ignored.

```java
if (hasChecksum) {
    result[frameLength - 1] = calculateChecksum(result, frameLength - 1);
}

private byte calculateChecksum(byte[] source, int length) {
    byte check = 0;
    for (int i = 0; i < length; i++) {
        check ^= source[i];
    }
    return check;
}
```

Most earbuds don't need checksums. It is needed primarily if your device has reliability issues,
like BT transmission issues, accidentally sending several BT packets simultaneously,
missing bytes, etc. Please let us know if your device needs a checksum.

Checksum in device→mobile packets is always checked if it is present.

### 2.2. GATT over BLE Protocol Definition

BLE beyerdynamic messages consist of 2 parts:

1. Header (4 bytes)
2. Optional payload (variable length)

#### 2.2.1. Message Header

The message header is composed of 4 bytes that help identify and decode a message.

| **Parameter** | **Size** | **Description**                                                  |
|---------------|----------|------------------------------------------------------------------|
| Vendor ID     | 16-bit   | Constant 0x2E50 for now.                                         |
| Feature ID    | 7-bit    | Constant 0x11 for now.                                           |
| Packet Type   | 2-bit    | Whether it is a command, a response, a notification, etc.        |
| Command ID    | 7-bit    | Identifier of a specific message command (i.e. GetBatteryLevel). |


##### 2.2.1.1 Vendor ID

Type: uint16

This is a constant 0x2E50 for now.

##### 2.2.1.2 Feature ID

Type:  7 bits

This is a constant 0x11 for now.

##### 2.2.1.3 Packet type

Type: 2 bits

| **Value** | **Name**     | **Description**                                                                                            |
|-----------|--------------|------------------------------------------------------------------------------------------------------------|
| 0x00      | COMMAND      | A COMMAND is expected to be sent from mobile side to the device.                                           |
| 0x01      | NOTIFICATION | A NOTIFICATION is expected to be sent from the device to the mobile side as a spontaneous message.         |
| 0x02      | RESPONSE     | A RESPONSE is expected to be sent from the device to the mobile side as a successful answer to a COMMAND.  |
| 0x03      | ERROR        | An ERROR is expected to be sent from the device to the mobile side as an unsuccessful answer to a COMMAND. |

##### 2.2.1.4 Command ID

Type: 7 bits

Signals the type of the command or notification sent between mobile side and the device.

See [3. Message Definition](#3-message-definition) for possible command ID values.

### 2.3. Protocol Definition for QCC Platform

We use GAIA client for QCC platforms. Please use GAIA's protocol for QCC platforms, but use the same
vendor ID, feature ID, command IDs and payload formats as defined in this document under
[2.1. RFCOMM Protocol Definition](#21-rfcomm-protocol-definition) and
[2.2. GATT over BLE Protocol Definition](#22-gatt-over-ble-protocol-definition).

The firmware should also support the critical commands that GAIA uses internally, like GET_API_VERSION.

## 3. Message Definition

### 0x00 Get Device Type

Command ID: 0x00

This message allows getting this device model type.
It is used to identify the device model.
The app will use this information to show/hide features that are not supported by the device.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Empty                           | Get device type. Mobile→device                 |
| RESPONSE        | Device type response payload    | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

Device type response payload:

| **Byte Index** | **Type** | **Description**  |
|----------------|----------|------------------|
| 0              | uint8    | Device type enum |

Device type enum values:

| **Value** | **Name**    | **Description** |
|-----------|-------------|-----------------|
| 0x00      | VERIO_100   |                 |
| 0x01      | VERIO_200   |                 |
| 0x02      | VERIO_300   |                 |
| 0x03      | AVENTHO_300 |                 |

### 0x19 Get Device MAC Address

Command ID: 0x19

This message allows retrieving device's MAC address.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Empty                           | Get MAC address. Mobile→device                 |
| RESPONSE        | MAC address response payload    | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

MAC address response payload for earbuds:

| **Byte Index** | **Type**       | **Description**                                                                                                                                                                   |
|----------------|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0-5            | uint (48 bits) | MAC address of the left earbud in numerical representation. [How to convert 🔗](https://stackoverflow.com/questions/42081560/how-to-convert-a-mac-address-to-long-in-javascript)  |
| 6-11           | uint (48 bits) | MAC address of the right earbud in numerical representation. [How to convert 🔗](https://stackoverflow.com/questions/42081560/how-to-convert-a-mac-address-to-long-in-javascript) |

MAC address response payload for headset:

| **Byte Index** | **Type**       | **Description**                                                                                                                                               |
|----------------|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0-5            | uint (48 bits) | MAC address in numerical representation. [How to convert 🔗](https://stackoverflow.com/questions/42081560/how-to-convert-a-mac-address-to-long-in-javascript) |

### 0x01 Register Notification Listeners

Command ID: 0x01

This message allows notifying the device to register listeners for notifications
(i.e. battery level, play status, etc.).
It is primarily intended for QCC platforms that use GAIA client.

If your firmware platform doesn't require this command,
then please register listeners automatically upon connection without this command.
Let us know if you require this command for your platform.

| **Packet Type** | **Payload**                        | **Notes**                                           |
|-----------------|------------------------------------|-----------------------------------------------------|
| COMMAND         | Register listeners request payload | Register listeners for notifications. Mobile→device |
| RESPONSE        | Empty                              | Successful response for COMMAND. Device→mobile      |
| ERROR           | [Error payload](#error-payload)    | Error response for COMMAND. Device→mobile           |

Register listeners request payload: constant `0x11`

### 0x02 Get Serial Number

Command ID: 0x02

This message allows retrieving device serial number.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Empty                           | Get serial number. Mobile→device               |
| RESPONSE        | Serial number response payload  | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

Serial number response payload for earbuds:

| **Byte Index** | **Type**     | **Description**                                                         |
|----------------|--------------|-------------------------------------------------------------------------|
| 0-15           | UTF-8 string | Serial number of left earbud. Or all zeros if left earbud is offline.   |
| 16-31          | UTF-8 string | Serial number of right earbud. Or all zeros if right earbud is offline. |

Serial number response payload for headset:

| **Byte Index** | **Type**     | **Description**           |
|----------------|--------------|---------------------------|
| 0-15           | UTF-8 string | Serial number of headset. |

### 0x03 Get Feature Version

Command ID: 0x03

This message allows checking the feature set version of the device.
This command is intended to be used if you plan to add support for new features after launch.
Mobile apps can use this command to check if the device supports the new feature.

| **Packet Type** | **Payload**                      | **Notes**                                      |
|-----------------|----------------------------------|------------------------------------------------|
| COMMAND         | Empty                            | Get feature version. Mobile→device             |
| RESPONSE        | Feature version response payload | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload)  | Error response for COMMAND. Device→mobile      |

Feature version response payload:

| **Byte Index** | **Type** | **Description**               |
|----------------|----------|-------------------------------|
| 0              | uint8    | Feature version of the device |

Initial version should start from 0. If a new feature is added, increment the version number.
Please tell us what each feature version adds/changes.

### 0x06 Get Battery Level

**Mandatory**

Command ID: 0x06

This message allows retrieving device battery level.

| **Packet Type** | **Payload**                     | **Notes**                                                                                        |
|-----------------|---------------------------------|--------------------------------------------------------------------------------------------------|
| COMMAND         | Empty                           | Get battery level. Mobile→device                                                                 |
| RESPONSE        | Battery level response payload  | Successful response for COMMAND. Device→mobile                                                   |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                        |
| NOTIFICATION    | Battery level response payload  | Device→mobile notification whenever battery level changes or when an earbud goes offline/online. |

Battery level response payload for earbuds:

| **Byte Index** | **Type** | **Description**                                                                         |
|----------------|----------|-----------------------------------------------------------------------------------------|
| 0              | uint8    | Battery level of left earbud. Between 0 and 100, or 0xFF if left earbud is offline.     |
| 1              | uint8    | Battery level of right earbud. Between 0 and 100, or 0xFF if right earbud is offline.   |
| 2              | uint8    | Battery level of charging case. Between 0 and 100, or 0xFF if charging case is offline. |

Battery level response payload for headset:

| **Byte Index** | **Type** | **Description**                                  |
|----------------|----------|--------------------------------------------------|
| 0              | uint8    | Battery level of the headset. Between 0 and 100. |

**Note:** Mobile side uses GetBatteryLevel command to figure out what earbuds are connected.
Make sure to send a notification message with the battery level whenever an earbud piece goes offline/online.

See [5. Example Package Flow](#5-example-package-flow) for an example of GetBatteryLevel command.


### 0x07 Get Bluetooth Led Configurations

Command ID: 0x07

Default value: On

This message allows getting the current bluetooth led configurations on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                             |
|-----------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| COMMAND         | Empty.                          | Get current bluetooth led configurations. Mobile→device                                                                           |
| RESPONSE        | Bluetooth led configurations payload.       | Successful response for COMMAND. Device→mobile                                                                        |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                             |
| NOTIFICATION    | Bluetooth led configurations payload.       | Device→mobile notification whenever bluetooth led configurations changes outside of app, i.e. by using touch gestures on earbuds. |

Bluetooth led configurations payload:

| **Byte Index** | **Type** | **Description**              |
|----------------|----------|------------------------------|
| 0              | uint8    | Bluetooth led configurations enum value. |

Bluetooth led configurations enum values:

| **Value** | **Name**  | **Description**                                           |
|-----------|-----------|-----------------------------------------------------------|
| 0x00      | On    | Bluetooth led is on.                                  |
| 0x01      | Off | Bluetooth led is off.                                     |

### 0x08 Set Bluetooth Led Configurations

Command ID: 0x08

This message allows setting the current Bluetooth led configurations on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                         |
|-----------------|---------------------------------|---------------------------------------------------------------------------------------------------|
| COMMAND         | Bluetooth led configurations payload.       | Set Bluetooth led configurations. Mobile→device                                                               |
| RESPONSE        | Bluetooth led configurations payload.       | Bluetooth led configurations set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                         |

See [0x07 Get Bluetooth Led Configurations](#0x07-get-bluetooth-led-configurations) for bluetooth led configurations payload specification.

### 0x09 Get LE Configurations

Command ID: 0x09

Default values:

- GOOGLE_FAST_PAIR: ON
- LE_AUDIO: OFF


This message allows getting the current LE configurations on the device.
This represents configurations that device might i.e. enable google fast pairing or disable LE audio.

| **Packet Type** | **Payload**                     | **Notes**                                                  |
|-----------------|---------------------------------|------------------------------------------------------------|
| COMMAND         | Empty.                          | Get current LE configurations. Mobile→device |
| RESPONSE        | LE configurations payload.      | Successful response for COMMAND. Device→mobile             |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                  |

LE configurations payload:

| **Bit Index**          | **Type**    | **Description**                                           |
|------------------------|-------------|-----------------------------------------------------------|
| 0                    | uint 1 bit | Enabled status enum for the GOOGLE_FAST_PAIR   |
| 1                    | uint 1 bit | Enabled status enum for the LE_AUDIO  |
| 000000               | uint 6 bit | Placeholder  |



LE configurations status values:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x0       | ON       |                 |
| 0x1       | OFF      |                 |


If the device does not support the specified configurations, it should respond OFF.

Example:

Consider binary payload `00000001`. In this payload from left to right:

- `000000__` - placeholder 
- `______0_` - LE audio (OFF)
- `_______1` - Google fast pair (ON)


### 0x0A Set LE Configurations

Command ID: 0x0A

This message allows setting the current LE configurations on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                             |
|-----------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| COMMAND         | LE configuration payload.      | Set LE configuration. Mobile→device                                                                    |
| RESPONSE        | LE configuration payload.      | LE configuration configuration set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                             |

See [0x09 Get LE Configurations](#0x09-get-le-configurations) for LE configurations payload specification.



### 0x14 Get Firmware Version

**Mandatory**

Command ID: 0x14

This message allows retrieving device firmware version.

| **Packet Type** | **Payload**                       | **Notes**                                      |
|-----------------|-----------------------------------|------------------------------------------------|
| COMMAND         | Empty                             | Get firmware version. Mobile→device            |
| RESPONSE        | Firmware version response payload | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload)   | Error response for COMMAND. Device→mobile      |

Firmware version response payload for earbuds:

| **Byte Index** | **Type** | **Description**                                                               |
|----------------|----------|-------------------------------------------------------------------------------|
| 0              | uint8    | Major firmware version of left earbud. Or 0x00 if left earbud is offline.     |
| 1              | uint8    | Minor firmware version of left earbud. Or 0x00 if left earbud is offline.     |
| 2              | uint8    | Patch firmware version of left earbud. Or 0x00 if left earbud is offline.     |
| 3              | uint8    | Major firmware version of right earbud. Or 0x00 if right earbud is offline.   |
| 4              | uint8    | Minor firmware version of right earbud. Or 0x00 if right earbud is offline.   |
| 5              | uint8    | Patch firmware version of right earbud. Or 0x00 if right earbud is offline.   |
| 6              | uint8    | Major firmware version of charging case. Or 0x00 if charging case is offline. |
| 7              | uint8    | Minor firmware version of charging case. Or 0x00 if charging case is offline. |
| 8              | uint8    | Patch firmware version of charging case. Or 0x00 if charging case is offline. |

Firmware version response payload for headset:

| **Byte Index** | **Type** | **Description**                    |
|----------------|----------|------------------------------------|
| 0              | uint8    | Major firmware version of headset. |
| 1              | uint8    | Minor firmware version of headset. |
| 2              | uint8    | Patch firmware version of headset. |

Each firmware version is represented as three numbers: major, minor, and patch.
If an earbud is offline, the firmware version should be 0.0.0.
Earbuds should respond with actual numbers, not with ASCII strings containing ASCII numbers.

Examples for earbuds:

Consider payload `0x01 0x06 0x01 0x01 0x06 0x02 0x01 0x00 0x00`.
In this example, the firmware version is:

- For the left earbud - `1.6.1`
- For the right earbud - `1.6.2`
- For the charging case - `1.0.0`

For payload `0x01 0x06 0x01 0x00 0x00 0x00 0x00 0x00 0x00`:

- For the left earbud - `1.6.1`
- The right earbud is offline or no firmware version.
- The charging case is offline or no firmware version.

### 0x15 Get Earbuds Color

**Mandatory**

Command ID: 0x15

This message allows app to get the color of the device.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Empty                           | Get Earbuds color. Mobile→device               |
| RESPONSE        | Earbuds color payload           | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

Earbuds color payload:

| **Byte Index** | **Type** | **Description**          |
|----------------|----------|--------------------------|
| 0              | uint8    | The color of Earbuds     |
| 1              | uint8    | Online earbuds indicator |

The color of earbuds values:

| **Value** | **Name** | **Description**   |
|-----------|----------|-------------------|
| 0x00      | Color1   | earbuds is Color1 |
| 0x01      | Color2   | earbuds is Color2 |
| 0x02      | Color3   | earbuds is Color3 |
| 0x03      | Color4   | earbuds is Color4 |

Each ColorX value depends on the device model and should be agreed separately.

Online earbuds indicator:

| **Value** | **Description**                          |
|-----------|------------------------------------------|
| 0x01      | Left earbud online, right earbud offline |
| 0x02      | Right earbud online, left earbud offline |
| 0x03      | Both earbuds online                      |

### 0x16 Set Earbuds Color

Command ID: 0x16

This message allows app to change the color of the device.

This command is only for testing purposes and is available only in connection debugging apps.
Production Beyerdynamic apps don't use this command.

| **Packet Type** | **Payload**                        | **Notes**                                                                                   |
|-----------------|------------------------------------|---------------------------------------------------------------------------------------------|
| COMMAND         | Set earbuds color request payload  | Set earbuds color. Mobile→device. The command is applied only after the device is rebooted. |
| RESPONSE        | Set earbuds color response payload | Indicates whether applying the command was successful. Device→mobile                        |
| ERROR           | [Error payload](#error-payload)    | Error response for COMMAND. Device→mobile                                                   |

Set earbuds color request payload:

| **Byte Index** | **Type** | **Description**      |
|----------------|----------|----------------------|
| 0              | uint8    | The color of earbuds |

See [0x15 Get Earbuds Color](#0x15-get-earbuds-color) for the color of earbuds values. It is reused.

Set earbuds color response payload:

| **Byte Index** | **Type** | **Description** |
|----------------|----------|-----------------|
| 0              | uint8    | Result status   |

Result status values:

| **Value** | **Name** | **Description**                                    |
|-----------|----------|----------------------------------------------------|
| 0x00      | FAILED   | The operation failed for both left & right earbuds |
| 0x01      | LEFT     | Only the left earbud is set successfully           |
| 0x02      | RIGHT    | Only the right earbud is set successfully          |
| 0x03      | BOTH     | Both left and right earbuds are set successfully   |

### 0x17 Get Peripheral States

Command ID: 0x17

This message allows retrieving the connection status of different device peripherals or extensions.

| **Packet Type** | **Payload**                        | **Notes**                                                                                                           |
|-----------------|------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| COMMAND         | Empty                              | Get peripheral states. Mobile→device                                                                                |
| RESPONSE        | Peripheral states response payload | Successful response for COMMAND. Device→mobile. Should contain all supported peripherals, even if they are offline. |
| ERROR           | [Error payload](#error-payload)    | Error response for COMMAND. Device→mobile                                                                           |
| NOTIFICATION    | Peripheral states response payload | Device→mobile notification whenever peripheral states change. Can contain only the peripherals with changed states. |

Peripheral states response payload consists of an array of items:

| **Byte Index** | **Type**         | **Description** |
|----------------|------------------|-----------------|
| 0              | Peripherals item | Item 1          |
| 1              | Peripherals item | Item 2          |
| ...            | ...              | ...             |

Each peripherals item consists of a bit mask:

| **Bit Index** | **Type**    | **Description**        |
|---------------|-------------|------------------------|
| 0-5           | uint 5 bits | Peripheral type enum.  |
| 6-7           | uint 2 bits | Peripheral state enum. |

Peripheral type enum values:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x00      | DONGLE   |                 |

Peripheral state enum values:

| **Value** | **Name**     | **Description** |
|-----------|--------------|-----------------|
| 0x00      | DISCONNECTED |                 |
| 0x01      | CONNECTED    |                 |
| 0x02      |              | Reserved        |  
| 0x03      |              | Reserved        |

The response payload should contain all the peripheral types that are supported by the device.
The notification payload can contain only the peripherals with changed states.

Example:

Consider binary payload `00000001 00000100`. In this example, there are the following array items:

- `00000001` - item 1
- `00000100` - item 2

For item 1:

- `000000__` - Peripheral type enum is 0x00 (`DONGLE`).
- `______01` - Peripheral state enum is 0x01 (`CONNECTED`).

For item 2:

- `000001__` - Peripheral type enum is 0x01 (doesn't exist, just an example).
- `______00` - Peripheral state enum is 0x00 (`DISCONNECTED`).

### 0x41 Get Remaining Battery Time

Command ID: 0x41

This message allows retrieving remaining battery time.

| **Packet Type** | **Payload**                             | **Notes**                                                                                                 |
|-----------------|-----------------------------------------|-----------------------------------------------------------------------------------------------------------|
| COMMAND         | Empty                                   | Get remaining battery time. Mobile→device                                                                 |
| RESPONSE        | Remaining battery time response payload | Successful response for COMMAND. Device→mobile                                                            |
| ERROR           | [Error payload](#error-payload)         | Error response for COMMAND. Device→mobile                                                                 |
| NOTIFICATION    | Remaining battery time response payload | Device→mobile notification whenever remaining battery life changes or when an earbud goes offline/online. |

Remaining battery time response payload for earbuds:

| **Byte Index** | **Type** | **Description**                                                                           |
|----------------|----------|-------------------------------------------------------------------------------------------|
| 0              | uint8    | Remaining hours for left earbud. Or 0xFF if left earbud is offline.                       |
| 1              | uint8    | Remaining minutes for left earbud. Between 0 and 59. Or 0xFF if left earbud is offline.   |
| 2              | uint8    | Remaining hours for right earbud. Or 0xFF if right earbud is offline.                     |
| 3              | uint8    | Remaining minutes for right earbud. Between 0 and 59. Or 0xFF if right earbud is offline. |

Remaining battery time response payload for headset:

| **Byte Index** | **Type** | **Description**                      |
|----------------|----------|--------------------------------------|
| 0              | uint8    | Remaining hours.                     |
| 1              | uint8    | Remaining minutes. Between 0 and 59. |

If the remaining battery time is i.e. 3h 10m, the app will display as `3h`.
If 3h 40m, the app will show `3.5h`.
If battery time is less than 30 minutes, the app will then show the exact remaining time in minutes.
This is done on the app's side, so earbuds can simply return the exact time.

Examples for earbuds:

Consider payload `0x07 0x1E 0x07 0x00`.
(0x1E = 30 in decimal.)
In this example, the remaining battery time is:

- For the left earbud - 7 hours and 30 minutes.
- For the right earbud - 7 hours and 0 minutes.

For payload `0xFF 0xFF 0x00 0x34`:
(0x34 = 52 in decimal.)
In this example, the remaining battery time is:

- The left earbud is offline or not reachable.
- For the right earbud - 0 hours and 52 minutes. The app will show as `0.5h`.

### 0x44 Get Equalizer Mode

Command ID: 0x44

Default value: Off

This message allows retrieving current equalizer mode.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Empty                           | Get current equalizer mode. Mobile→device      |
| RESPONSE        | Equalizer mode response payload | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

##### Equalizer mode v1 payload:

This version doesn't support using different equalizer modes for music vs. gaming vs. ANC.

| **Byte Index** | **Type** | **Description**              |
|----------------|----------|------------------------------|
| 0              | uint8    | Current Equalizer mode enum. |

Equalizer mode enum:

| **Value** | **Name**      | **Description**                                                                                                                        |
|-----------|---------------|----------------------------------------------------------------------------------------------------------------------------------------|
| 0x00      | Off           | Equalizer is turned off.                                                                                                               |
| 0x01      | Rock          |                                                                                                                                        |
| 0x02      | Jazz          |                                                                                                                                        |
| 0x03      | Classical     |                                                                                                                                        |
| 0x04      | Pop           |                                                                                                                                        |
| 0x05      | User          | Custom user-created preset. [User equalizer configuration](#0x46-get-user-equalizer-configuration) is used as Equalizer configuration. |
| 0x06      | Bass Boost    |                                                                                                                                        |
| 0x07      | Smooth Treble |
| 0x08      | Loudness      |
| 0x09      | Neutral       |
| 0x0A      | Speech        |
| 0x0B      | Shooting        |
| 0x0C      | Battle Royal        |
| 0x0D      | Adventure        |
| 0x0E      | Racing        |
| 0x0F      | Strategy        |


##### Equalizer mode v2 payload:

This version supports using different equalizer modes for music vs. gaming vs. ANC.

The payload consists of an array:

| **Byte Index** | **Type**            | **Description** |
|----------------|---------------------|-----------------|
| 0-2            | Equalizer mode item | Item 1          |
| 3-5            | Equalizer mode item | Item 2          |
| ...            | ...                 | ...             |

Each equalizer mode item:

| **Byte Index** | **Type** | **Description**              |
|----------------|----------|------------------------------|
| 0              | uint8    | EQ type enum.                |
| 1-2            | uint16   | Current equalizer mode enum. |

EQ type enum values:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x00      | Music    |                 |
| 0x01      | Gaming   |                 |
| 0x02      | ANC      |                 |

Equalizer mode enum values for Music EQ:

Please see [Equalizer mode v1 payload](#equalizer-mode-v1-payload) for the music EQ enum values.
It is reused.

Equalizer mode enum values for Gaming EQ:

| **Value** | **Name** | **Description**                                                                                                                        |
|-----------|----------|----------------------------------------------------------------------------------------------------------------------------------------|
| 0x00      | Off      | Equalizer is turned off.                                                                                                               |
| 0x01      | User     | Custom user-created preset. [User equalizer configuration](#0x46-get-user-equalizer-configuration) is used as equalizer configuration. |
| Other     |          | Please see [Gaming EQ values](./eq-gaming-values.csv) for other values.                                                                |

Equalizer mode enum values for ANC EQ:

| **Value** | **Name** | **Description**                           |
|-----------|----------|-------------------------------------------|
| 0x00      | Off      | Equalizer is turned off.                  |
| TODO      | TODO     | Define the values for ANC equalizer mode. |

The response payload should contain only the EQ types that are supported by the device.

### 0x45 Set Equalizer Mode

Command ID: 0x45

This message allows changing current equalizer mode.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                      |
|-----------------|---------------------------------|----------------------------------------------------------------------------------------------------------------|
| COMMAND         | Equalizer mode payload          | Set current equalizer mode. Mobile→device                                                                      |
| RESPONSE        | Equalizer mode payload          | Equalizer mode set successfully. Response payload is the actual equalizer mode that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                      |

See [0x44 Get Equalizer Mode](#0x44-get-equalizer-mode) for equalizer mode payload specification.

The same equalizer mode payload version that is used for getting the equalizer mode should be used for setting the equalizer mode.

**Note for payload v2:**
The COMMAND request *can* include only the EQ types that are intended to be changed.
In this case, the RESPONSE payload should contain only the EQ types that were changed
with the COMMAND request.

### 0x46 Get User Equalizer Configuration

Command ID: 0x46

Default value: [0, 0, ..., 0] - Flat

This message allows changing current equalizer mode.

| **Packet Type** | **Payload**                          | **Notes**                                      |
|-----------------|--------------------------------------|------------------------------------------------|
| COMMAND         | Empty                                | Get current equalizer mode. Mobile→device      |
| RESPONSE        | User equalizer configuration payload | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload)      | Error response for COMMAND. Device→mobile      |

There are two versions of the user equalizer configuration payload.
Let us know which version of the payload your device supports.
v2 supports floating-point values, while v1 supports integers only.
v3 supports different user EQs for music vs. gaming vs. ANC.

It is also possible to use platform SDKs for EQ configuration on Airoha and QCC platforms,
but we recommend using Beyerdynamic protocol commands for EQ configuration if possible.

##### User equalizer configuration v3 payload:

The payload **consists of an array of *variable-length* items**:

| **Byte Index** | **Type**            | **Description** |
|----------------|---------------------|-----------------|
| 0 to S         | User EQ config item | Item 1          |
| (S+1) to K     | User EQ config item | Item 2          |
| (K+1) to M     | User EQ config item | Item 3          |
| ...            | ...                 | ...             |

Each user EQ config item:

| **Byte Index**   | **Type** | **Description**                            |
|------------------|----------|--------------------------------------------|
| 0                | uint8    | EQ type enum.                              |
| 1-2              | sint16   | Gain for the first band multiplied by 60.  |
| 3-4              | sint16   | Gain for the second band multiplied by 60. |
| ...              | ...      | ...                                        |
| (N\*2-1)..(N\*2) | sint16   | Gain for the Nth band multiplied by 60.    |

EQ type enum values:

Please see [Equalizer mode v2 payload](#equalizer-mode-v2-payload) for the EQ type enum values.
It is reused.

The number of bands (N) is device-specific.
It is hardcoded on both app and firmware side for each device model and should be agreed separately.
The number (N) can be different for each EQ type.

The gain is a 16-bit signed number.
The serialized value is 60 times the gain in decibels.
For example, a gain of +9.6 dB is represented by a serialized value of 576 (0x0240, 9.6×60).

The response payload should contain only the EQ types that are supported by the device.

##### User equalizer configuration v2 payload:

| **Byte Index**     | **Type** | **Description**                            |
|--------------------|----------|--------------------------------------------|
| 0..1               | sint16   | Gain for the first band multiplied by 60.  |
| 2..3               | sint16   | Gain for the second band multiplied by 60. |
| ...                | ...      | ...                                        |
| (N\*2-2)..(N\*2-1) | sint16   | Gain for the Nth band multiplied by 60.    |

The gain is a 16-bit signed number.
The serialized value is 60 times the gain in decibels.
For example, a gain of +9.6 dB is represented by a serialized value of 576 (0x0240, 9.6×60).

##### User equalizer configuration v1 payload:

| **Byte Index** | **Type** | **Description**           |
|----------------|----------|---------------------------|
| 0              | sint8    | Gain for the first band.  |
| 1              | sint8    | Gain for the second band. |
| ...            | ...      | ...                       |
| N-1            | sint8    | Gain for the Nth band.    |

##### Using platform SDKs for EQ configuration (Airoha, QCC):

It is preferred to use Beyerdynamic protocol commands for EQ configuration.
But if you can't support it, then you can use your platform's platform SDK for EQ configuration.
Please let the mobile team know if you can't support Beyerdynamic's EQ configuration protocol.

[0x44 Get Equalizer Mode](#0x44-get-equalizer-mode) and [0x45 Set Equalizer Mode](#0x45-set-equalizer-mode)
commands should still be used to change the equalizer mode on these platforms.

**Note for SPP on Airoha platforms:** Android app will send platform EQ commands via Beyerdynamic's
SPP connection on `54943f52-bdfd-48a0-855a-3b5471a6b4ab` UUID.
This means that the firmware will receive both BY protocol commands and platform EQ commands on the same SPP connection.
The firmware should handle both types of commands on the same SPP connection.
This is because most platforms don't support multiple SPP connections at the same time.

### 0x47 Set User Equalizer Configuration

Command ID: 0x47

This message allows changing current user equalizer configuration.

| **Packet Type** | **Payload**                          | **Notes**                                                                                                          |
|-----------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| COMMAND         | User equalizer configuration payload | Set current user equalizer configuration. Mobile→device                                                            |
| RESPONSE        | User equalizer configuration payload | Equalizer config set successfully. Response payload is the actual equalizer config that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload)      | Error response for COMMAND. Device→mobile                                                                          |

See [0x46 Get User Equalizer Configuration](#0x46-get-user-equalizer-configuration) for user equalizer
configuration payload specification.
The same payload version that you use for [0x46 Get User Equalizer Configuration](#0x46-get-user-equalizer-configuration)
should be used for [0x47 Set User Equalizer Configuration](#0x47-set-user-equalizer-configuration).
If you use your platform's SDK for EQ configuration, then you don't need to implement this command.

**Note for payload v3:**
The COMMAND request *can* include only the EQ types that are intended to be changed.
In this case, the RESPONSE payload should contain only the EQ types that were changed
with the COMMAND request.

### 0x48 Trigger Media Button

Command ID: 0x48

This message allows triggering headset to send media commands to the phone OS.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Trigger media button payload.   | Trigger media button. Mobile→device            |
| RESPONSE        | Empty                           | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

Trigger media button payload:

| **Byte Index** | **Type** | **Description**  |
|----------------|----------|------------------|
| 0              | uint8    | Media button ID. |

Media button IDs:

| **Value** | **Name**      | **Description**                     |
|-----------|---------------|-------------------------------------|
| 0x00      | PLAY_PAUSE    | Pause or resume music on the phone. |
| 0x01      | PREVIOUS_SONG | Skip to previous song.              |
| 0x02      | NEXT_SONG     | Skip to next song.                  |

### 0x49 Play Status

Command ID: 0x49

This message allows checking whether any music is playing from the phone to earbuds.

| **Packet Type** | **Payload**                     | **Notes**                                                |
|-----------------|---------------------------------|----------------------------------------------------------|
| COMMAND         | Empty.                          | Trigger media button. Mobile→device                      |
| RESPONSE        | Play status payload.            | Successful response for COMMAND. Device→mobile           |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                |
| NOTIFICATION    | Play status payload             | Device→mobile notification whenever play status changes. |

Play status payload:

| **Byte Index** | **Type** | **Description**   |
|----------------|----------|-------------------|
| 0              | uint8    | Play status enum. |

Play status enum:

| **Value** | **Name** | **Description**              |
|-----------|----------|------------------------------|
| 0x00      | PLAYING  | There is some music playing. |
| 0x01      | PAUSED   | No music is playing.         |

### 0x4A Get Device Name

**Mandatory**

Command ID: 0x4A

Default value: Device's factory Bluetooth name that is reported to OS.

This message allows getting the current device name.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Empty.                          | Get current device name. Mobile→device         |
| RESPONSE        | Device name payload.            | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

Device name payload:
UTF-8 variable-length string. No more than 31 characters.
Includes only the actual name without any null characters (0x00 or \0).

### 0x4B Set Device Name

**Mandatory**

Command ID: 0x4B

This message allows changing the current device name.

| **Packet Type** | **Payload**                     | **Notes**                                                                                         |
|-----------------|---------------------------------|---------------------------------------------------------------------------------------------------|
| COMMAND         | Device name payload             | Set current device name. Mobile→device                                                            |
| RESPONSE        | Device name payload             | Device name set successfully. Response payload is the actual name that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                         |

See [0x4A Get Device Name](#0x4a-get-device-name) for device name payload specification.

### 0x4C Get Auto Shutdown Time

Command ID: 0x4C

Default value: 0 (never)

This message allows getting the current device auto shutdown time.

| **Packet Type** | **Payload**                     | **Notes**                                            |
|-----------------|---------------------------------|------------------------------------------------------|
| COMMAND         | Empty.                          | Get current device auto shutdown time. Mobile→device |
| RESPONSE        | Auto shutdown time payload.     | Successful response for COMMAND. Device→mobile       |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile            |

Auto shutdown time payload:

| **Byte Index** | **Type**        | **Description**                                         |
|----------------|-----------------|---------------------------------------------------------|
| 0              | uint8 or uint16 | Idle shutdown time in minutes (0..360); 0 means "never" |

If the payload is 1 byte, then the value is limited to uint8 and 0..255 minutes;
If the payload is 2 bytes, then the value is uint16 and 0..360 minutes.

Support for uint8 is required.
Support for uint16 is optional if the device does not support more than 255 minutes.

### 0x4D Set Auto Shutdown Time

Command ID: 0x4D

This message allows changing current device auto shutdown time.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                  |
|-----------------|---------------------------------|------------------------------------------------------------------------------------------------------------|
| COMMAND         | Auto shutdown time payload.     | Set device shutdown time. Mobile→device                                                                    |
| RESPONSE        | Auto shutdown time payload.     | Device shutdown time set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                  |

See [0x4C Get Auto Shutdown Time](#0x4c-get-auto-shutdown-time) for shutdown time payload specification.

### 0x4E Get Selected Voice Assistant Mode

Command ID: 0x4E

Default value: DEFAULT

This message allows getting the current voice assistant mode.

| **Packet Type** | **Payload**                     | **Notes**                                       |
|-----------------|---------------------------------|-------------------------------------------------|
| COMMAND         | Empty.                          | Get current voice assistant mode. Mobile→device |
| RESPONSE        | Voice assistant mode payload.   | Successful response for COMMAND. Device→mobile  |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile       |

Voice assistant mode payload:

| **Byte Index** | **Type** | **Description**           |
|----------------|----------|---------------------------|
| 0              | uint8    | Voice assistant mode enum |

Voice assistant mode enum:

| **Value** | **Name** | **Description**                       |
|-----------|----------|---------------------------------------|
| 0x00      | DEFAULT  | OS assistant (Google Assistant, Siri) |
| 0x01      | NONE     | No voice assistant is selected        |

### 0x4F Set Selected Voice Assistant Mode

Command ID: 0x4F

This message allows changing current voice assistant mode.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                  |
|-----------------|---------------------------------|------------------------------------------------------------------------------------------------------------|
| COMMAND         | Voice assistant mode payload.   | Set voice assistant mode. Mobile→device                                                                    |
| RESPONSE        | Voice assistant mode payload.   | Voice assistant mode set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                  |

See [0x4E Get Selected Voice Assistant Mode](#0x4e-get-selected-voice-assistant-mode) for voice assistant mode
payload specification.

### 0x59 Get Custom Keys

Command ID: 0x59

Default value: should be agreed per device.

This message allows getting the current custom keys state.
Custom keys allows user to change what each button gesture (press or hold) does.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Empty.                          | Get current custom keys state. Mobile→device   |
| RESPONSE        | Custom keys payload.            | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

There are two versions of the custom keys payload.
Let us know which version of the payload your device supports.
v2 supports more action & triggers and is preferred.

##### Custom Keys v2 payload:

Custom keys payload consists of an array:

| **Byte Index** | **Type**         | **Description** |
|----------------|------------------|-----------------|
| 0-1            | Custom keys item | Item 1          |
| 2-3            | Custom keys item | Item 2          |
| ...            | ...              | ...             |

Each custom keys item:

| **Bit Index** | **Type**    | **Description**                       |
|---------------|-------------|---------------------------------------|
| 0-2           | uint 3 bits | Button location. Usually earbud side. |
| 3-7           | uint 5 bits | Button trigger type.                  |
| 8-15          | uint 8 bits | Button action.                        |

Button location values for earbuds:

| **Value** | **Name** | **Description**      |
|-----------|----------|----------------------|
| 0x00      | LEFT     | Left earbud or side  |
| 0x01      | RIGHT    | Right earbud or side |

Button location values for headsets:

| **Value** | **Name** | **Description**                    |
|-----------|----------|------------------------------------|
| 0x00      | MFB      | Multi-function button, main button |
| 0x01      | Volume+  | Volume up button                   |
| 0x02      | Volume-  | Volume down button                 |

Button trigger type values:

| **Value** | **Name**               | **Description**                   |
|-----------|------------------------|-----------------------------------|
| 0x00      | SINGLE_TAP             | Single short tap                  |
| 0x01      | DOUBLE_TAP             | Double short tap                  |
| 0x02      | TRIPLE_TAP             | Triple short tap                  |
| 0x03      | LONG_PRESS             | Single long press                 |
| 0x04      | SINGLE_THEN_LONG_PRESS | Single short tap, then long press |
| 0x05      | DOUBLE_THEN_LONG_PRESS | Double short tap, then long press |
| 0x06      | FOUR_TAP               | Four short tap                    |


Button action values:

| **Value** | **Name**                 | **Description**                       |
|-----------|--------------------------|---------------------------------------|
| 0x00      | NONE                     | Do nothing.                           |
| 0x01      | PLAY_PAUSE               | Pause or resume music on the phone.   |
| 0x02      | NEXT_SONG                | Skip to next song.                    |
| 0x03      | PREVIOUS_SONG            | Skip to previous song.                |
| 0x04      | VOICE_ASSISTANT          | Trigger voice assistant.              |
| 0x05      | VOLUME_UP                | Increase volume by 1 step.            |
| 0x06      | VOLUME_DOWN              | Decrease volume by 1 step.            |
| 0x07      | SWITCH_ANC_MODE          | Switch to the next ANC mode.          |
| 0x08      | SWITCH_TRANSPARENCY_MODE | Switch to the next transparency mode. |
| 0x09      | SWITCH_GAMING_MODE       | Switch to the next gaming mode.       |

Button location + button trigger type uniquely identifies the button.
Device should send only the button location + button trigger type that it supports.
Sending multiple button actions for the same button location + button trigger type is not supported.

What button actions are supported for each button, as well as what buttons and triggers are available,
should be agreed per device.

Example for earbuds:

Consider binary payload `00000000 00000001 00000011 00000110 00100000 00000001 00100011 00000101`.
In this payload from left to right:

- `00000000 00000001` - Custom keys item 1.
- `00000011 00000110` - Custom keys item 2.
- `00100000 00000001` - Custom keys item 3.
- `00100011 00000101` - Custom keys item 4.

For custom keys item 1:

- `000_____ ________` - Custom keys item 1 location (0x00, LEFT).
- `___00000 ________` - Custom keys item 1 trigger type (0x00, SINGLE_TAP).
- `________ 00000001` - Custom keys item 1 action (0x01, PLAY_PAUSE).

For custom keys item 2:

- `000_____ ________` - Custom keys item 2 location (0x00, LEFT).
- `___00011 ________` - Custom keys item 2 trigger type (0x03, LONG_PRESS).
- `________ 00000110` - Custom keys item 2 action (0x06, VOLUME_DOWN).

For custom keys item 3:

- `001_____ ________` - Custom keys item 3 location (0x01, RIGHT).
- `___00000 ________` - Custom keys item 3 trigger type (0x00, SINGLE_TAP).
- `________ 00000001` - Custom keys item 3 action (0x01, PLAY_PAUSE).

For custom keys item 4:

- `001_____ ________` - Custom keys item 4 location (0x01, RIGHT).
- `___00011 ________` - Custom keys item 4 trigger type (0x03, LONG_PRESS).
- `________ 00000101` - Custom keys item 4 action (0x05, VOLUME_UP).

##### Custom Keys v1 payload:

Custom keys payload for earbuds:

| **Bit Index** | **Type**      | **Description**                                                     |
|---------------|---------------|---------------------------------------------------------------------|
| 0-3           | uint (4 bits) | Left earbud single tap action. Or 0xFF if left earbud is offline.   |
| 4-7           | uint (4 bits) | Left earbud long press action. Or 0xFF if left earbud is offline.   |
| 8-11          | uint (4 bits) | Left earbud double tap action. Or 0xFF if left earbud is offline.   |
| 12-15         | uint (4 bits) | Left earbud triple tap action. Or 0xFF if left earbud is offline.   |
| 16-19         | uint (4 bits) | Right earbud single tap action. Or 0xFF if right earbud is offline. |
| 20-23         | uint (4 bits) | Right earbud long press action. Or 0xFF if right earbud is offline. |
| 24-27         | uint (4 bits) | Right earbud double tap action. Or 0xFF if right earbud is offline. |
| 28-31         | uint (4 bits) | Right earbud triple tap action. Or 0xFF if right earbud is offline. |

Custom keys payload for headset:

| **Bit Index** | **Type**      | **Description**    |
|---------------|---------------|--------------------|
| 0-3           | uint (4 bits) | Single tap action. |
| 4-7           | uint (4 bits) | Long press action. |
| 8-11          | uint (4 bits) | Double tap action. |
| 12-15         | uint (4 bits) | Triple tap action. |

Single tap actions enum:

| **Value** | **Name**   | **Description**                     |
|-----------|------------|-------------------------------------|
| 0x00      | PLAY_PAUSE | Pause or resume music on the phone. |
| 0x01      | NONE       | Do nothing.                         |

Long press actions enum:

| **Value** | **Name**        | **Description**          |
|-----------|-----------------|--------------------------|
| 0x00      | VOICE_ASSISTANT | Trigger voice assistant. |
| 0x01      | NONE            | Do nothing.              |
| 0x02      | VOLUME_UP       | Volume up.               |
| 0x03      | VOLUME_DOWN     | Volume down.             |

Double tap actions enum:

| **Value** | **Name**        | **Description**                                                                                   |
|-----------|-----------------|---------------------------------------------------------------------------------------------------|
| 0x00      | NEXT_SONG       | Skip to next song.                                                                                |
| 0x01      | PLAY_PAUSE      | Pause or resume music on the phone.                                                               |
| 0x02      | PREVIOUS_SONG   | Skip to previous song.                                                                            |
| 0x03      | NONE            | Do nothing.                                                                                       |
| 0x04      | VOICE_ASSISTANT | Trigger voice assistant.                                                                          |
| 0x05      | SWITCH_ANC_MODE | Switch ANC mode, the switch order is according to [ANC mode enum values](#0x60-get-anc-mode) loop |

Triple tap actions enum:

| **Value** | **Name**        | **Description**                                                                                   |
|-----------|-----------------|---------------------------------------------------------------------------------------------------|
| 0x00      | PREVIOUS_SONG   | Skip to previous song.                                                                            |
| 0x01      | PLAY_PAUSE      | Pause or resume music on the phone.                                                               |
| 0x02      | NEXT_SONG       | Skip to next song.                                                                                |
| 0x03      | NONE            | Do nothing.                                                                                       |
| 0x04      | VOICE_ASSISTANT | Trigger voice assistant.                                                                          |
| 0x05      | SWITCH_ANC_MODE | Switch ANC mode, the switch order is according to [ANC mode enum values](#0x60-get-anc-mode) loop |

What actions are supported for each tap/press should be agreed per device.

Example:

Consider binary payload `00000011 00100100 00010010 00000101`.
In this payload from left to right:

- `0000` - Left earbud single tap action (0x00, PLAY_PAUSE).
- `0011` - Left earbud long press action (0x03, VOLUME_DOWN).
- `0010` - Left earbud double tap action (0x02, PREVIOUS_SONG).
- `0100` - Left earbud triple tap action (0x04, VOICE_ASSISTANT).
- `0001` - Right earbud single tap action (0x01, NONE).
- `0010` - Right earbud long press action (0x02, VOLUME_UP).
- `0000` - Right earbud double tap action (0x00, NEXT_SONG).
- `0101` - Right earbud triple tap action (0x05, SWITCH_ANC_MODE).

### 0x5A Set Custom Keys

Command ID: 0x5A

This message allows setting the current custom keys state.
Custom keys allows user to change what each button press or hold does.

| **Packet Type** | **Payload**                     | **Notes**                                                                                               |
|-----------------|---------------------------------|---------------------------------------------------------------------------------------------------------|
| COMMAND         | Custom keys payload.            | Set custom keys state. Mobile→device                                                                    |
| RESPONSE        | Custom keys payload.            | Custom keys state set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                               |

See [0x59 Get Custom Keys](#0x59-get-custom-keys) for custom keys payload specification.
The same payload version that is used for getting custom keys should be used for setting custom keys.

### 0x5B Get Prompt Language

Command ID: 0x5B

Default value: ENGLISH

This message allows getting the current voice prompt language for the device.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Empty.                          | Get current prompt language. Mobile→device     |
| RESPONSE        | Prompt language payload.        | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

Prompt language payload:

| **Byte Index** | **Type** | **Description**             |
|----------------|----------|-----------------------------|
| 0              | uint8    | Prompt language enum value. |

Prompt language enum:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x01      | CHINESE  |                 |
| 0x02      | ENGLISH  |                 |
| 0x03      | GERMAN   |                 |

### 0x5C Set Prompt Language

Command ID: 0x5C

This message allows setting the current voice prompt language for the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                             |
|-----------------|---------------------------------|-------------------------------------------------------------------------------------------------------|
| COMMAND         | Prompt language payload.        | Set prompt language. Mobile→device                                                                    |
| RESPONSE        | Prompt language payload.        | Prompt language set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                             |

See [0x5B Get Prompt Language](#0x5b-get-prompt-language) for prompt language payload specification.

### 0x5E Get Prompt Sound State

Command ID: 0x5E

Default value: ON

This message allows getting the current on/off status of the beep function.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Empty.                          | Get current prompt sound state. Mobile→device  |
| RESPONSE        | Prompt state payload.           | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

Prompt state payload:

| **Byte Index** | **Type** | **Description**          |
|----------------|----------|--------------------------|
| 0              | uint8    | Prompt state enum value. |

Prompt state enum:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x00      | ON       |                 |
| 0x01      | OFF      |                 |

### 0x5F Set Prompt Sound State

Command ID: 0x5F

This message allows setting the current on/off status of the beep function.

| **Packet Type** | **Payload**                     | **Notes**                                                                                          |
|-----------------|---------------------------------|----------------------------------------------------------------------------------------------------|
| COMMAND         | Prompt state payload.           | Set prompt state. Mobile→device                                                                    |
| RESPONSE        | Prompt state payload.           | Prompt state set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                          |

See [0x5E Get Prompt Sound State](#0x5e-get-prompt-sound-state) for prompt state payload specification.

### 0x66 Get Enabled Voice Prompts

Command ID: 0x66

Default value: All prompts are enabled.

This message allows getting enabled voice prompts for the device.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Voice prompts batch index       | Get enabled voice prompts. Mobile→device       |
| RESPONSE        | Enabled voice prompts payload.  | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

Voice prompts batch index:

The BLE package size has limitations on some platforms. This value can be used to split a large package into several
batches.

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x00      | Index 0  |                 |
| 0x01      | Index 1  |                 |
| 0x02      | Index 2  |                 |

Enabled voice prompts payload:

| **Bit Index**          | **Type**    | **Description**                            |
|------------------------|-------------|--------------------------------------------|
| 0-7                    | uint 8 bits | Index of this voice prompts batch          |
| 8-13                   | uint 6 bits | ID of the first prompt type                |
| 14-15                  | uint 2 bits | Enabled status enum for first prompt type  |
| 16-21                  | uint 6 bits | ID of the second prompt type               |
| 22-23                  | uint 2 bits | Enabled status enum for second prompt type |
| ...                    | ...         | ...                                        |
| (N-1)*8 to (N-1)*8+5   | uint 6 bits | ID of the Nth prompt type                  |
| (N-1)*8+6 to (N-1)*8+7 | uint 2 bits | Enabled status enum for Nth prompt type    |

Bit index is counted from left to right (if viewed in binary).

If the device doesn't have many voice prompts, only index 0 will be used.
The number of indices should be agreed per device.
Please let us know if you need more than one index.

Enabled status enum values:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x00      | ON       |                 |
| 0x01      | OFF      |                 |
| 0x02      |          | Reserved        |
| 0x03      |          | Reserved        |

There are two versions of the prompt type IDs.
v1 is more specific and allows to toggle each prompt individually.
v2 is more generic and allows to toggle groups of prompts.

Prompt type IDs (v1, specific):

| **Value** | **Name**              | **Description**                                                             |
|-----------|-----------------------|-----------------------------------------------------------------------------|
| 0x00      | POWER_OFF             |                                                                             |
| 0x01      | POWER_ON              |                                                                             |
| 0x02      | BATTERY_LOW           |                                                                             |
| 0x03      | ANC_ON                |                                                                             |
| 0x04      | PASS_THROUGH          | Transparency mode                                                           |
| 0x05      | ANC_OFF               |                                                                             |
| 0x06      | PAIRING               | Entered pairing mode                                                        |
| 0x07      | CONNECTED             | Connection established                                                      |
| 0x08      | VOLUME_UP_MAX         | Volume has reached the maximum level while pressing on "volume up" button   |
| 0x09      | VOLUME_DOWN_MIN       | Volume has reached the minimum level while pressing on "volume down" button |
| 0x0A      | RINGTONE              |                                                                             |
| 0x0B      | SINGLE_TAP            | Feedback for button press                                                   |
| 0x0C      | DOUBLE_TAP            | Feedback for button press                                                   |
| 0x0D      | TRIPLE_TAP            | Feedback for button press                                                   |
| 0x0E      | EAR_CONNECTED         |                                                                             |
| 0x0F      | DOUBLE_PRESS_AND_HOLD | Feedback for button press                                                   |
| 0x10      | EAR_DISCONNECTED      |                                                                             |
| 0x11      | FOUR_TAP      |  Feedback for button press                                             
|

Prompt type IDs (v2, generalized):

| **Value** | **Name**             | **Description**                                                                                       |
|-----------|----------------------|-------------------------------------------------------------------------------------------------------|
| 0x01      | POWER_ON_OFF         | Device powers on or shuts down                                                                        |
| 0x02      | BATTERY_STATE        | Anything related to battery. Battery level, charging status, "low battery", etc.                      |
| 0x03      | BLUETOOTH_CONNECTION | Entered pairing mode, paired, connected/disconnected with BT device, failed pairing, multipoint, etc. |
| 0x04      | ANC                  | ANC state changes, transparency mode                                                                  |
| 0x05      | AUDIO_CODECS         | A2DP with AAC/aptX codec                                                                              |
| 0x06      | CONNECTION           | Connection established, disconnected. Alternative to BLUETOOTH_CONNECTION.                            |
| 0x07      | TRANSPARENCY_MODE    | Transparency state changes. Alternative to ANC if ANC is not supported.                               |

Please let us know what version of the prompt type IDs your device supports.
The same voice prompt IDs version should be used for all communication with the device.

Example (prompt type IDs v1):

Consider binary payload `00000000 00000001 00000101 00001001 00001100`. In this payload from left to right:

- `00000000` - index
- `00000001` - prompt 0 content
- `00000101` - prompt 1 content
- `00001001` - prompt 2 content
- `00001100` - prompt 3 content

Prompt 0 content:

- `000000__` - prompt 0 type (POWER_OFF)
- `______01` - prompt 0 status (OFF)

Prompt 1 content:

- `000001__` - prompt 1 type (POWER_ON)
- `______01` - prompt 1 status (OFF)

Prompt 2 content:

- `000010__` - prompt 2 type (BATTERY_LOW)
- `______01` - prompt 2 status (OFF)

Prompt 3 content:

- `000011__` - prompt 3 type (ANC_ON)
- `______00` - prompt 3 status (ON)

### 0x67 Set Enabled Voice Prompts

Command ID: 0x67

This message allows setting enabled voice prompts for the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                   |
|-----------------|---------------------------------|-------------------------------------------------------------------------------------------------------------|
| COMMAND         | Enabled voice prompts payload.  | Set enabled voice prompts. Mobile→device                                                                    |
| RESPONSE        | Enabled voice prompts payload.  | Enabled voice prompts set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                   |

See [0x66 Get Enabled Voice Prompts](#0x66-get-enabled-voice-prompts) for enabled voice prompts payload specification.

The COMMAND request *can* include only the configurations that are intended to be changed.
In this case, the RESPONSE payload should respond only with the voice prompts that were changed
in the COMMAND request.

The same voice prompt type IDs version that is used for getting enabled voice prompts
should be used for setting enabled voice prompts.

### 0x57 Get Voice Prompts Volume Level

Command ID: 0x57

Default value: maximum volume level on the device.

This message allows getting the current voice prompts volume level.

| **Packet Type** | **Payload**                     | **Notes**                                             |
|-----------------|---------------------------------|-------------------------------------------------------|
| COMMAND         | Empty.                          | Get current voice prompts volume level. Mobile→device |
| RESPONSE        | Voice prompts volume payload.   | Successful response for COMMAND. Device→mobile        |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile             |

Voice prompts volume payload for earbuds:

| **Byte Index** | **Type** | **Description**                                 |
|----------------|----------|-------------------------------------------------|
| 0              | uint8    | Voice prompts volume level of the left earbud.  |
| 1              | uint8    | Voice prompts volume level of the right earbud. |

Voice prompts volume payload for headset:

| **Byte Index** | **Type** | **Description**             |
|----------------|----------|-----------------------------|
| 0              | uint8    | Voice prompts volume level. |

Volume level range should be agreed per device.

### 0x58 Set Voice Prompts Volume Level

Command ID: 0x58

This message allows setting the current voice prompts volume level.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                        |
|-----------------|---------------------------------|------------------------------------------------------------------------------------------------------------------|
| COMMAND         | Voice prompts volume payload.   | Set voice prompts volume level. Mobile→device                                                                    |
| RESPONSE        | Voice prompts volume payload.   | Voice prompts volume level set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                        |

See [0x57 Get Voice Prompts Volume Level](#0x57-get-voice-prompts-volume-level) for voice prompts volume payload specification.

### 0x60 Get ANC Mode

Command ID: 0x60

Default value: OFF

This message allows getting the current ANC mode on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                      |
|-----------------|---------------------------------|----------------------------------------------------------------------------------------------------------------|
| COMMAND         | Empty.                          | Get current ANC mode. Mobile→device                                                                            |
| RESPONSE        | ANC mode payload.               | Successful response for COMMAND. Device→mobile                                                                 |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                      |
| NOTIFICATION    | ANC mode payload.               | Device→mobile notification whenever ANC mode changes outside of app (i.e. by using touch gestures on earbuds). |

ANC mode payload:

| **Byte Index** | **Type** | **Description**      |
|----------------|----------|----------------------|
| 0              | uint8    | ANC mode enum value. |

ANC mode enum values:

| **Value** | **Name**     | **Description**                       |
|-----------|--------------|---------------------------------------|
| 0x00      | OFF          | ANC is off.                           |
| 0x01      | TRANSPARENCY | ANC mode with transparency is active. |
| 0x02      | ON           | ANC is on.                            |

### 0x61 Set ANC Mode

Command ID: 0x61

This message allows setting the current ANC mode on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                      |
|-----------------|---------------------------------|------------------------------------------------------------------------------------------------|
| COMMAND         | ANC mode payload.               | Set ANC mode. Mobile→device                                                                    |
| RESPONSE        | ANC mode payload.               | ANC mode set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                      |

See [0x60 Get ANC Mode](#0x60-get-anc-mode) for ANC mode payload specification.

### 0x30 Get Non-Adaptive ANC Level

Command ID: 0x30

Default value: middle of the allowed value range on the device.

This message allows getting the current non-adaptive ANC level on the device.

If the device doesn't have *adaptive* ANC mode, this command is just "ANC level".

| **Packet Type** | **Payload**                     | **Notes**                                         |
|-----------------|---------------------------------|---------------------------------------------------|
| COMMAND         | Empty.                          | Get current non-adaptive ANC level. Mobile→device |
| RESPONSE        | ANC level payload.              | Successful response for COMMAND. Device→mobile    |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile         |

ANC level payload:

| **Byte Index** | **Type** | **Description**                           |
|----------------|----------|-------------------------------------------|
| 0              | uint8    | ANC level value. Higher value = more ANC. |

ANC value range should be agreed per device.

### 0x31 Set Non-Adaptive ANC Level

Command ID: 0x31

This message allows setting the current non-adaptive ANC level on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                    |
|-----------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| COMMAND         | ANC level payload.              | Set non-adaptive ANC level. Mobile→device                                                                    |
| RESPONSE        | ANC level payload.              | Non-adaptive ANC level set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                    |

See [0x30 Get Non-Adaptive ANC Level](#0x30-get-non-adaptive-anc-level) for ANC level payload specification.

### 0x32 Get ANC Transparency Gain

Command ID: 0x32

Default value: middle of the allowed value range on the device.

This message allows getting the current ANC transparency gain on the device.

| **Packet Type** | **Payload**                     | **Notes**                                        |
|-----------------|---------------------------------|--------------------------------------------------|
| COMMAND         | Empty.                          | Get current ANC transparency gain. Mobile→device |
| RESPONSE        | ANC transparency gain payload.  | Successful response for COMMAND. Device→mobile   |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile        |

ANC transparency gain payload:

| **Byte Index** | **Type** | **Description**                                                     |
|----------------|----------|---------------------------------------------------------------------|
| 0              | uint8    | ANC transparency gain value. Higher value = more transparency gain. |

Gain values range should be agreed per device.

### 0x33 Set ANC Transparency Gain

Command ID: 0x33

This message allows setting the current ANC transparency gain on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                   |
|-----------------|---------------------------------|-------------------------------------------------------------------------------------------------------------|
| COMMAND         | ANC transparency gain payload.  | Set ANC transparency gain. Mobile→device                                                                    |
| RESPONSE        | ANC transparency gain payload.  | ANC transparency gain set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                   |

See [0x32 Get ANC Transparency Gain](#0x32-get-anc-transparency-gain) for ANC transparency gain payload specification.

### 0x34 Get ANC Wind Noise Detection Mode

Command ID: 0x34

Default value: OFF

This message allows getting the current ANC wind noise detection mode on the device.

| **Packet Type** | **Payload**                       | **Notes**                                                |
|-----------------|-----------------------------------|----------------------------------------------------------|
| COMMAND         | Empty.                            | Get current ANC wind noise detection mode. Mobile→device |
| RESPONSE        | ANC wind noise detection payload. | Successful response for COMMAND. Device→mobile           |
| ERROR           | [Error payload](#error-payload)   | Error response for COMMAND. Device→mobile                |

ANC wind noise detection payload:

| **Byte Index** | **Type** | **Description**                |
|----------------|----------|--------------------------------|
| 0              | uint8    | ANC wind noise detection mode. |

ANC wind noise detection mode enum values:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x00      | ON       |                 |
| 0x01      | OFF      |                 |

### 0x35 Set ANC Wind Noise Detection Mode

Command ID: 0x35

This message allows setting the current ANC wind noise detection mode on the device.

| **Packet Type** | **Payload**                       | **Notes**                                                                                                           |
|-----------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------------|
| COMMAND         | ANC wind noise detection payload. | Set ANC wind noise detection mode. Mobile→device                                                                    |
| RESPONSE        | ANC wind noise detection payload. | ANC wind noise detection mode set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload)   | Error response for COMMAND. Device→mobile                                                                           |

See [0x84 Get ANC Wind Noise Detection Mode](#0x34-get-anc-wind-noise-detection-mode) for ANC wind noise detection
payload specification.

### 0x36 Get Adaptive ANC Level

Command ID: 0x36

Default value: MIDDLE

This message allows getting the current adaptive ANC level on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                          |
|-----------------|---------------------------------|----------------------------------------------------------------------------------------------------|
| COMMAND         | Empty.                          | Get current adaptive ANC level. Mobile→device                                                      |
| RESPONSE        | Adaptive ANC level payload.     | Successful response for COMMAND. Device→mobile                                                     |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                          |
| NOTIFICATION    | Adaptive ANC level payload.     | Device→mobile notification whenever ANC level changes (only while ANC On mode is set to ADAPTIVE). |

Adaptive ANC level payload:

| **Byte Index** | **Type** | **Description**          |
|----------------|----------|--------------------------|
| 0              | uint8    | Adaptive ANC level enum. |

Adaptive ANC level enum values:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x00      | HIGH     |                 |
| 0x01      | MIDDLE   |                 |
| 0x02      | LOW      |                 |

### 0x37 Get ANC On Mode

Command ID: 0x37

Default value: ADAPTIVE

This message allows getting whether the current ANC mode is adaptive or non-adaptive.
This value is active only if ANC mode is ON.

| **Packet Type** | **Payload**                     | **Notes**                                                |
|-----------------|---------------------------------|----------------------------------------------------------|
| COMMAND         | Empty.                          | Get current ANC on mode. Mobile→device                   |
| RESPONSE        | ANC on mode payload.            | Successful response for COMMAND. Device→mobile           |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                |
| NOTIFICATION    | ANC on mode payload.            | Device→mobile notification whenever ANC on mode changes. |

ANC on mode payload:

| **Byte Index** | **Type** | **Description**   |
|----------------|----------|-------------------|
| 0              | uint8    | ANC on mode enum. |

ANC on mode enum values:

| **Value** | **Name**     | **Description** |
|-----------|--------------|-----------------|
| 0x00      | NON_ADAPTIVE |                 |
| 0x01      | ADAPTIVE     |                 |

### 0x38 Set ANC On Mode

Command ID: 0x38

This message allows setting whether the current ANC mode is adaptive or non-adaptive.
This value is active only if ANC mode is ON.

| **Packet Type** | **Payload**                     | **Notes**                                                                                         |
|-----------------|---------------------------------|---------------------------------------------------------------------------------------------------|
| COMMAND         | ANC on mode payload.            | Set ANC on mode. Mobile→device                                                                    |
| RESPONSE        | ANC on mode payload.            | ANC on mode set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                         |

See [0x37 Get ANC On Mode](#0x37-get-anc-on-mode) for ANC on mode payload specification.

### 0x62 Get Low Latency Mode

Command ID: 0x62

Default value: NORMAL

This message allows getting the current low latency mode setting on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                             |
|-----------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| COMMAND         | Empty.                          | Get current low latency mode. Mobile→device                                                                           |
| RESPONSE        | Low latency mode payload.       | Successful response for COMMAND. Device→mobile                                                                        |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                             |
| NOTIFICATION    | Low latency mode payload.       | Device→mobile notification whenever low latency mode changes outside of app, i.e. by using touch gestures on earbuds. |

Low latency mode payload:

| **Byte Index** | **Type** | **Description**              |
|----------------|----------|------------------------------|
| 0              | uint8    | Low latency mode enum value. |

Low latency mode enum values:

| **Value** | **Name**  | **Description**                                           |
|-----------|-----------|-----------------------------------------------------------|
| 0x00      | NORMAL    | Low latency mode is off.                                  |
| 0x01      | GAME_MODE | Low latency mode is on. Earbuds are optimized for gaming. |

### 0x63 Set Low Latency Mode

Command ID: 0x63

This message allows setting the current low latency mode setting on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                         |
|-----------------|---------------------------------|---------------------------------------------------------------------------------------------------|
| COMMAND         | Low latency mode payload.       | Set low latency mode. Mobile→device                                                               |
| RESPONSE        | Low latency mode payload.       | Low latency set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                         |

See [0x62 Get Low Latency Mode](#0x62-get-low-latency-mode) for low latency mode payload specification.

### 0x64 Get Wearing Detection Configuration

Command ID: 0x64

Default values:

- AUTO_PAUSE_PLAY_MUSIC: ON
- AUTO_PAUSE_MUSIC: ON
- AUTO_PLAY_MUSIC: ON
- AUTO_HANG_UP_CALL: OFF
- AUTO_DISABLE_TOUCHPAD: ON
- AUTO_ANC_ON_OFF: ON
- AUTO_FUNCTIONS_ON_OFF: ON

This message allows getting the current wearing detection configuration on the device.
This represents configurations that device might i.e. pause music when earbuds are taken out of the ear,
or disable some functionalities when earbuds are not worn.

| **Packet Type** | **Payload**                     | **Notes**                                                  |
|-----------------|---------------------------------|------------------------------------------------------------|
| COMMAND         | Empty.                          | Get current wearing detection configuration. Mobile→device |
| RESPONSE        | Wearing detection payload.      | Successful response for COMMAND. Device→mobile             |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                  |

Wearing detection payload:

| **Bit Index**          | **Type**    | **Description**                                           |
|------------------------|-------------|-----------------------------------------------------------|
| 0-5                    | uint 6 bits | ID of the first wearing detection type                    |
| 6-7                    | uint 2 bits | Enabled status enum for the first wearing detection type  |
| 8-13                   | uint 6 bits | ID of the second wearing detection type                   |
| 14-15                  | uint 2 bits | Enabled status enum for the second wearing detection type |
| ...                    | ...         | ...                                                       |
| (N-1)*8 to (N-1)*8+5   | uint 6 bits | ID of the Nth wearing detection type                      |
| (N-1)*8+6 to (N-1)*8+7 | uint 2 bits | Enabled status enum for the Nth wearing detection type    |

Wearing detection types:

| **Value** | **Name**              | **Description**                                                                                                          |
|-----------|-----------------------|--------------------------------------------------------------------------------------------------------------------------|
| 0x00      | AUTO_PAUSE_PLAY_MUSIC | Auto pause music on out of ear. The device might also support resuming music when the earbuds are put back in the ear.   |
| 0x01      | AUTO_HANG_UP_CALL     | Auto hang up call on out of ear. The device might also support accepting calls when the earbuds are put back in the ear. |
| 0x02      | AUTO_DISABLE_TOUCHPAD | Auto disable touchpad on out of ear.                                                                                     |
| 0x03      | AUTO_PAUSE_MUSIC      | Auto pause music on out of ear. Variant of AUTO_PAUSE_PLAY_MUSIC that has separate pause and resume actions.             |
| 0x04      | AUTO_PLAY_MUSIC       | Auto resume music on in ear. Variant of AUTO_PAUSE_PLAY_MUSIC that has separate pause and resume actions.                |
| 0x05      | AUTO_FUNCTIONS_ON_OFF       | Enable or disable all automatic wearing detection functions. |
| 0x06      | AUTO_ANC_ON_OFF       | Automatically disable ANC when the device is detected out of the ear, and automatically enable ANC when inserted into the ear if the ANC function is enabled. |

Wearing detection status values:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x00      | ON       |                 |
| 0x01      | OFF      |                 |
| 0x02      |          | Reserved        |
| 0x03      |          | Reserved        |

The device should respond with all the configurations that are supported by the device.
Configurations not supported by the device should not be included in the response.

Example:

Consider binary payload `00000001 00000101 00001000`. In this payload from left to right:

- `00000001` - item 0 content
- `00000101` - item 1 content
- `00001000` - item 2 content

Item 0 content:

- `000000__` - wearing detection type 0 (AUTO_PAUSE_MUSIC)
- `______01` - wearing detection status for type 0 (OFF)

Item 1 content:

- `000001__` - wearing detection type 1 (AUTO_HANG_UP_CALL)
- `______01` - wearing detection status for type 1 (OFF)

Item 2 content:

- `000010__` - wearing detection type 2 (AUTO_DISABLE_TOUCHPAD)
- `______00` - wearing detection status for type 2 (ON)

### 0x65 Set Wearing Detection Configuration

Command ID: 0x65

This message allows setting the current wearing detection configuration on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                             |
|-----------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| COMMAND         | Wearing detection payload.      | Set wearing detection configuration. Mobile→device                                                                    |
| RESPONSE        | Wearing detection payload.      | Wearing detection configuration set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                             |

See [0x64 Get Wearing Detection Configuration](#0x64-get-wearing-detection-configuration) for wearing detection payload
specification.

The COMMAND request *can* include only the configurations that are intended to be changed.
In this case, the RESPONSE payload should respond only with the wearing detection types that were
in the COMMAND request.

### 0x68 Get LED Brightness

Command ID: 0x68

Default value: BRIGHT.

This message allows getting the current LED brightness setting on the device.

| **Packet Type** | **Payload**                     | **Notes**                                         |
|-----------------|---------------------------------|---------------------------------------------------|
| COMMAND         | Empty.                          | Get current LED brightness setting. Mobile→device |
| RESPONSE        | LED brightness payload.         | Successful response for COMMAND. Device→mobile    |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile         |

LED brightness payload:

| **Byte Index** | **Type** | **Description**            |
|----------------|----------|----------------------------|
| 0              | uint8    | LED brightness enum value. |

LED brightness enum values:

| **Value** | **Name**  | **Description**                    |
|-----------|-----------|------------------------------------|
| 0x00      | VERY_DARK | Use at night                       |
| 0x01      | MODERATE  |                                    |
| 0x02      | BRIGHT    | For bright environments / sunlight |

### 0x69 Set LED Brightness

Command ID: 0x69

This message allows setting the current LED brightness setting on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                        |
|-----------------|---------------------------------|------------------------------------------------------------------------------------------------------------------|
| COMMAND         | LED brightness payload.         | Set LED brightness setting. Mobile→device                                                                        |
| RESPONSE        | LED brightness payload.         | LED brightness setting changed successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                        |

See [0x68 Get LED Brightness](#0x68-get-led-brightness) for LED brightness payload specification.

### 0x70 Get Sidetone Mode

Command ID: 0x70

Default value: OFF

This message allows getting the current sidetone mode setting on the device.

| **Packet Type** | **Payload**                     | **Notes**                                        |
|-----------------|---------------------------------|--------------------------------------------------|
| COMMAND         | Empty.                          | Get current sidetone mode setting. Mobile→device |
| RESPONSE        | Sidetone mode payload.          | Successful response for COMMAND. Device→mobile   |
| NOTIFICATION    | Sidetone mode payload.  | Device→mobile notification whenever sidetone changes. |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile        |

Sidetone mode payload:

| **Byte Index** | **Type** | **Description**      |
|----------------|----------|----------------------|
| 0              | uint8    | Sidetone mode value. |

Sidetone mode enum values:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x00      | ON       |                 |
| 0x01      | OFF      |                 |

### 0x71 Set Sidetone Mode

Command ID: 0x71

This message allows setting the current sidetone mode setting on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                       |
|-----------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------|
| COMMAND         | Sidetone mode payload.          | Set sidetone mode setting. Mobile→device                                                                        |
| RESPONSE        | Sidetone mode payload.          | Sidetone mode setting changed successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                       |

See [0x70 Get Sidetone Mode](#0x70-get-sidetone-mode) for sidetone mode payload specification.

### 0x72 Get Sidetone Gain

Command ID: 0x72

Default value: middle of the allowed value range on the device.

This message allows getting the current sidetone gain setting on the device.

| **Packet Type** | **Payload**                     | **Notes**                                        |
|-----------------|---------------------------------|--------------------------------------------------|
| COMMAND         | Empty.                          | Get current sidetone gain setting. Mobile→device |
| RESPONSE        | Sidetone gain payload.          | Successful response for COMMAND. Device→mobile   |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile        |

Sidetone gain payload:

| **Byte Index** | **Type** | **Description**                                |
|----------------|----------|------------------------------------------------|
| 0              | uint8    | Sidetone gain value. Higher value = more gain. |

Gain values range should be agreed per device.

### 0x73 Set Sidetone Gain

Command ID: 0x73

This message allows setting the current sidetone gain setting on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                       |
|-----------------|---------------------------------|-----------------------------------------------------------------------------------------------------------------|
| COMMAND         | Sidetone gain payload.          | Set sidetone gain setting. Mobile→device                                                                        |
| RESPONSE        | Sidetone gain payload.          | Sidetone gain setting changed successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                       |

See [0x72 Get Sidetone Gain](#0x72-get-sidetone-gain) for sidetone gain payload specification.

### 0x7C Get Dolby Atmos Config

Command ID: 0x7C

Default value: OFF

This message allows checking whether Dolby Atmos features are enabled on the device.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Empty.                          | Get current Dolby Atmos config. Mobile→device  |
| RESPONSE        | Dolby Atmos config payload.     | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

Dolby Atmos config payload:

| **Bit Index**          | **Type**    | **Description**                            |
|------------------------|-------------|--------------------------------------------|
| 0-5                    | uint 6 bits | ID of the first Dolby Atmos feature        |
| 6-7                    | uint 2 bits | Enabled status enum for the first feature  |
| 8-13                   | uint 6 bits | ID of the second Dolby Atmos feature       |
| 14-15                  | uint 2 bits | Enabled status enum for the second feature |
| ...                    | ...         | ...                                        |
| (N-1)*8 to (N-1)*8+5   | uint 6 bits | ID of the Nth Dolby Atmos feature          |
| (N-1)*8+6 to (N-1)*8+7 | uint 2 bits | Enabled status enum for the Nth feature    |

Dolby Atmos feature type IDs:

| **Value** | **Name**           | **Description**                                                        |
|-----------|--------------------|------------------------------------------------------------------------|
| 0x00      | STEREO_VIRTUALIZER | Whether to enable or disable stereo virtualizer (part of Dolby Atmos). |
| 0x01      | HEAD_TRACKER       | Whether to enable or disable head tracking (part of Dolby Atmos).      | 

Enabled status values for type HEAD_TRACKER:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x00      | OFF      | Feature off     |
| 0x01      | ON       | Feature on      |

Enabled status values for type STEREO_VIRTUALIZER:

| **Value** | **Name** | **Description**                                     |
|-----------|----------|-----------------------------------------------------|
| 0x00      | OFF      | Stereo virtualizer off: mobile <-> device           |
| 0x01      | ON       | Stereo virtualizer on:    non-DAX mobile <-> device |
| 0x02      | ON_DAX   | Only room simulation on:  DAX mobile <-> device     |

Example:

Consider binary payload `00000010  00000101`. In this payload from left to right:

- `00000010` - item 0 content
- `00000101` - item 1 content

Item 0 content:

- `000000__` - Dolby Atmos feature type 0 (STEREO_VIRTUALIZER)
- `______10` - Dolby Atmos feature status for type 0 (ON_DAX)

Item 1 content:

- `000001__` - Dolby Atmos feature type 1 (HEAD_TRACKER)
- `______01` - Dolby Atmos feature status for type 1 (ON)

### 0x7D Set Dolby Atmos Config

Command ID: 0x7D

This message allows setting whether Dolby Atmos features are enabled on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                |
|-----------------|---------------------------------|----------------------------------------------------------------------------------------------------------|
| COMMAND         | Dolby Atmos config payload.     | Set Dolby Atmos config. Mobile→device                                                                    |
| RESPONSE        | Dolby Atmos config payload.     | Dolby Atmos config set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                |

See [0x7C Get Dolby Atmos Config](#0x7c-get-dolby-atmos-config) for Dolby Atmos config payload
specification.

### 0x7E Get Audio Codecs Configurations

Command ID: 0x7E

Default value: all ON.

This message allows getting the current audio codecs configurations on the device.

| **Packet Type** | **Payload**                     | **Notes**                                              |
|-----------------|---------------------------------|--------------------------------------------------------|
| COMMAND         | Empty.                          | Get current audio codecs configurations. Mobile→device |
| RESPONSE        | Audio codecs payload.           | Successful response for COMMAND. Device→mobile         |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile              |

Audio codecs payload:

| **Bit Index**          | **Type**    | **Description**                                     |
|------------------------|-------------|-----------------------------------------------------|
| 0-5                    | uint 6 bits | ID of the first audio codec type                    |
| 6-7                    | uint 2 bits | Enabled status enum for the first audio codec type  |
| 8-13                   | uint 6 bits | ID of the second audio codec type                   |
| 14-15                  | uint 2 bits | Enabled status enum for the second audio codec type |
| ...                    | ...         | ...                                                 |
| (N-1)*8 to (N-1)*8+5   | uint 6 bits | ID of the Nth audio codec type                      |
| (N-1)*8+6 to (N-1)*8+7 | uint 2 bits | Enabled status enum for the Nth audio codec type    |

Audio codec types:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x00      | LDAC     |                 |

Enabled status values:

| **Value** | **Name** | **Description** |
|-----------|----------|-----------------|
| 0x00      | ON       |                 |
| 0x01      | OFF      |                 |
| 0x02      |          | Reserved        |
| 0x03      |          | Reserved        |

The device should respond with all the configurations that are supported by the device.
Configurations not supported by the device should not be included in the response.

Example:

Consider binary payload `00000001`. In this payload from left to right:

- `00000001` - item 0 content

Item 0 content:

- `000000__` - audio codec type 0 (LDAC)
- `______01` - audio codec status for type 0 (OFF)

### 0x7F Set Audio Codecs Configurations

Command ID: 0x7F

This message allows setting the current audio codecs configurations on the device.

| **Packet Type** | **Payload**                     | **Notes**                                                                                                         |
|-----------------|---------------------------------|-------------------------------------------------------------------------------------------------------------------|
| COMMAND         | Audio codecs payload.           | Set audio codecs configurations. Mobile→device                                                                    |
| RESPONSE        | Audio codecs payload.           | Audio codecs configurations set successfully. Response payload is the actual data that was applied. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile                                                                         |

See [0x7E Get Audio Codecs Configurations](#0x7e-get-audio-codecs-configurations) for audio codecs payload
specification.

The COMMAND request *can* include only the configurations that are intended to be changed.
In this case, the RESPONSE payload should respond only with the audio codec types that were
in the COMMAND request.


### 0x5D Factory Reset

Command ID: 0x5D

This message allows doing a factory reset of the device.

| **Packet Type** | **Payload** | **Notes**                         |
|-----------------|-------------|-----------------------------------|
| COMMAND         | Empty       | Do a factory reset. Mobile→device |

### 0x20 Get Usage Statistics

Command ID: 0x20

This message allows getting all the statistics for the device for analytics purposes.

| **Packet Type** | **Payload**                     | **Notes**                                      |
|-----------------|---------------------------------|------------------------------------------------|
| COMMAND         | Statistics request payload.     | Get statistics. Mobile→device                  |
| RESPONSE        | Statistics response payload.    | Successful response for COMMAND. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile      |

Statistics request payload:

| **Byte Index** | **Type** | **Description**                                                              |
|----------------|----------|------------------------------------------------------------------------------|
| 0              | uint8    | Index. This value can be used to split a large package into several batches. |

Statistics response payload **consists of an array of *variable-length* items**:

| **Byte Index** | **Type**        | **Description**    |
|----------------|-----------------|--------------------|
| 0 to S         | Statistics item | Statistics item 1. |
| (S+1) to K     | Statistics item | Statistics item 2. |
| (K+1) to M     | Statistics item | Statistics item 3. |
| ...            | ...             | ...                |

In the payload table above, S, K, and M are used to represent the byte indexes where each statistics item ends.

Items can be in any order and can be missing if the device does not support the specific item type.
If the mobile does not support a specific item type, it should ignore that item.

Each statistics item:

| **Byte Index** | **Type**               | **Description**                                                     |
|----------------|------------------------|---------------------------------------------------------------------|
| 0              | uint8                  | Statistics item type.                                               |
| 1              | uint8                  | Statistics item content length (excluding type and length bytes). N |
| 2 to (N+1)     | variable-length binary | Statistics item content.                                            |

Statistics item content depends on the item type and is dynamic.
All statistics item types and their contents are described in [6. Statistics Item Types](#6-statistics-item-types).

Generic example for statistics payload structure:

Consider payload `0x00 04 00 00 10 E0 07 01 10 09 05 01 00 03 B8 C0`. In this payload:

| **Byte Index** | **Value**        | **Description**              |
|----------------|------------------|------------------------------|
| 0              | 0x00             | Statistics item 1's type.    |
| 1              | 0x04             | Statistics item 1's length.  |
| 2 to 5         | 0x00 00 10 E0    | Statistics item 1's content. |
| 6              | 0x07             | Statistics item 2's type.    |
| 7              | 0x01             | Statistics item 2's length.  |
| 8              | 0x10             | Statistics item 2's content. |
| 9              | 0x09             | Statistics item 3's type.    |
| 10             | 0x05             | Statistics item 3's length.  |
| 11 to 15       | 0x01 00 03 B8 C0 | Statistics item 3's content. |

Please note this is just a generic example to show the structure. The actual statistics item types and their
contents are described in [6. Statistics Item Types](#6-statistics-item-types).

### 0x21 Reset Usage Statistics

Command ID: 0x21

This message allows resetting all usage statistics on the device to the initial values.

| **Packet Type** | **Payload**                     | **Notes**                                        |
|-----------------|---------------------------------|--------------------------------------------------|
| COMMAND         | Empty                           | Reset usage statistics. Mobile→device            |
| RESPONSE        | Empty                           | Statistics was reset successfully. Device→mobile |
| ERROR           | [Error payload](#error-payload) | Error response for COMMAND. Device→mobile        |

### Error Payload

This is a common error payload for ERROR packet type.

| **Byte Index** | **Type** | **Description**    |
|----------------|----------|--------------------|
| 0              | uint8    | Error status enum. |

Error status enum:

| **Value** | **Name**               | **Description**                                                                     |
|-----------|------------------------|-------------------------------------------------------------------------------------|
| 0x00      | FEATURE_NOT_SUPPORTED  | An invalid Feature ID was specified.                                                |
| 0x01      | NOTIFICATION           | An invalid Command ID was specified.                                                |
| 0x02      | NOT_AUTHENTICATED      | The host is not authenticated to use a Command ID or control.                       |
| 0x03      | INSUFFICIENT_RESOURCES | The command was valid, but the device could not successfully carry out the command. |
| 0x04      | AUTHENTICATING         | The device is in the process of authenticating the host.                            |
| 0x05      | INVALID_PARAMETER      | An invalid parameter was used in the command.                                       |
| 0x06      | INCORRECT_STATE        | The device is not in the correct state to process the command.                      |
| 0x07      | IN_PROGRESS            | The command is in progress.                                                         |
| Other     | FEATURE_SPECIFIC       | An error that is specific to command or feature ID.                                 |

## 4. Firmware Over-the-Air Updates (FOTA)

FOTA depends very much on the device chipset, so it needs to be tailored per-platform.

For the OTA solutions of the following platforms, we still adopt the communication protocol header of this protocol:
- WUQI platform with IAP2
- BES platform with SPP and BLE

The OTA package format is almost the same as outlined in [2.1. RFCOMM Protocol Definition](#21-rfcomm-protocol-definition), with only the message header being slightly different, as compared to [2.2.1. Message Header](#221-message-header):

| **Parameter**  | **Size**    | **Description**                                                                     |
|----------------|-------------|-------------------------------------------------------------------------------------|
| SOF Flag       | 8-bit       | This is a constant 0xFF value. Used to identify the start of a new message.         |
| Version        | 8-bit       | The version of the protocol. The current version is 4.                              |
| Flags          | 8-bit       | Bit fields to exchange metadata.                                                    |
| Payload Length | 8 or 16-bit | Length of the message payload in bytes. 8 vs 16 bit length is controlled by a flag. |
| Vendor ID      | 16-bit      | Constant 0x2E50                                                                     |
| Feature ID     | 7-bit       | Constant *0x06* for OTA.                                                            |
| Reserve        | 1-bit       | 0x0                                                                                 |

You can think of the beyerdynamic protocol as an channel, and the chipset platform's OTA packages are encapsulated within this channel.

## 5. Example Package Flow

Below you can find an example package flow between mobile and earbuds for getting the battery level.

**Note:** This is an example for one of the messages. Please consult [3. Message Definition](#3-message-definition) for
the supported packet types and their payloads.

#### 5.1. GetBatteryLevel command

![](assets/GetBatteryLevel-success.png)

Mobile side can request the battery level of the earbuds by sending a GetBatteryLevel COMMAND message to the earbuds
at any time. This can be used when the mobile side connects to the product and needs to figure out the current battery
level and what earbuds are connected.

Once the earbuds receive a GetBatteryLevel COMMAND message, they should respond with a GetBatteryLevel RESPONSE message
containing the current battery level state.

If there is any error processing the COMMAND message, the earbuds should respond with a GetBatteryLevel ERROR message:

![](assets/GetBatteryLevel-error.png)

Mobile side has a timeout for waiting for a response. If the earbuds do not respond within the timeout, the mobile side
will assume the command failed and might retry the command.

#### 5.2. GetBatteryLevel changed notification

![](assets/GetBatteryLevel-changed.png)

If the battery level of the earbuds changes, the earbuds are supposed to send a GetBatteryLevel NOTIFICATION message
to the mobile side. Mobile side does not use periodic polling to figure out when the battery level changes.

#### 5.3. GetBatteryLevel earbud disconnected notification

![](assets/GetBatteryLevel-earbud-disconnected.png)

Same as [5.2. GetBatteryLevel changed notification](#52-getbatterylevel-changed-notification).
When an earbud piece goes offline or online, the earbuds are supposed to send a GetBatteryLevel NOTIFICATION message.

Mobile side uses GetBatteryLevel command to figure out what earbuds are connected, so it needs to know when this
changes.

## 6. Statistics Item Types

This section describes the statistics item types and their content for
the [0x20 Get Usage Statistics](#0x20-get-usage-statistics)
command.

### 0x00 Total Runtime

This item type represents the total runtime of the device.

Item type: 0x00

Content:

| **Byte Index** | **Type** | **Description**           |
|----------------|----------|---------------------------|
| 0-3            | uint32   | Total runtime in minutes. |

### 0x01 Power On Events

This item type represents the counter of how many times the device has been powered on.

Item type: 0x01

Content:

| **Byte Index** | **Type** | **Description**          |
|----------------|----------|--------------------------|
| 0-3            | uint32   | Power on events counter. |

### 0x02 Music Playback Time

This item type represents the total music playback time of the device.

Item type: 0x02

Content:

| **Byte Index** | **Type** | **Description**                 |
|----------------|----------|---------------------------------|
| 0-3            | uint32   | Music playback time in minutes. |

### 0x03 Voice Call Time

This item type represents the total voice call time with the device.

Item type: 0x03

Content:

| **Byte Index** | **Type** | **Description**             |
|----------------|----------|-----------------------------|
| 0-3            | uint32   | Voice call time in minutes. |

### 0x04 Error Counter Total

This item type represents the total error counter of the device.
This is the counter value of firmware panics.

Item type: 0x04

Content:

| **Byte Index** | **Type** | **Description** |
|----------------|----------|-----------------|
| 0-3            | uint32   | Panics counter. |

### 0x05 Accepted Calls Counter

This item type represents the total accepted calls counter on the device.

Item type: 0x05

Content:

| **Byte Index** | **Type** | **Description**         |
|----------------|----------|-------------------------|
| 0-3            | uint32   | Accepted calls counter. |

### 0x06 Button Presses Counter

This item type represents the total button presses counter on the device.

Item type: 0x06

Content:

| **Byte Index** | **Type** | **Description**         |
|----------------|----------|-------------------------|
| 0-3            | uint32   | Button presses counter. |

### 0x07 Volume Level Lifetime Average

This item type represents the lifetime average of the volume level on the device.

Item type: 0x07

Content:

| **Byte Index** | **Type** | **Description**                                                                      |
|----------------|----------|--------------------------------------------------------------------------------------|
| 0              | uint8    | Volume level lifetime average. Value range is the device's volume range (i.e. 0-32). |

### 0x08 Time Multipoint Mode Used

This item type represents the total time multipoint mode has been used on the device.

Item type: 0x08

Content:

| **Byte Index** | **Type** | **Description**                        |
|----------------|----------|----------------------------------------|
| 0-3            | uint32   | Time multipoint mode used. In minutes. |

### 0x09 Time ANC Mode Used

This item type represents the total time the device has been used in each ANC mode.

Item type: 0x09

Content **consists of an array**. Each array item consists of the time spent in a specific ANC mode.

Content:

| **Byte Index** | **Type**           | **Description** |
|----------------|--------------------|-----------------|
| 0-4            | Array item payload | Item 1          |
| 5-9            | Array item payload | Item 2          |
| ...            | ...                | ...             |

Array item payload:

| **Byte Index** | **Type** | **Description**                           |
|----------------|----------|-------------------------------------------|
| 0              | uint8    | [ANC mode enum value](#0x60-get-anc-mode) |
| 1-4            | uint32   | Time spent in the ANC mode. In minutes.   |

Divide content's length by 5 to get the number of array items.

Items can be in any order and can be missing if the device does not support the specific ANC mode.

Example:

Consider item content `0x00 00 00 10 E0 01 00 00 00 00 02 00 00 A8 C0`. In this content:

| **Byte Index** | **Value**   | **Description**                                                                              |
|----------------|-------------|----------------------------------------------------------------------------------------------|
| 0              | 0x00        | The first array item is about ANC mode with value 0x00 (OFF)                                 |
| 1-4            | 00 00 10 E0 | Time spent in the ANC mode OFF (from byte index 0). `0x00 00 10 E0`=4320 minutes (3 days).   |
| 5              | 0x01        | The second array item is about ANC mode with value 0x01 (TRANSPARENCY)                       |
| 6-9            | 00 00 00 00 | Time spent in the ANC mode TRANSPARENCY (from byte index 5). 0 minutes.                      |
| 10             | 0x02        | The third array item is about ANC mode with value 0x02 (ON)                                  |
| 11-14          | 00 00 A8 C0 | Time spent in the ANC mode ON (from byte index 10). `0x00 00 A8 C0`=43200 minutes (30 days). |

### 0x0A Time Low Latency Mode Used

This item type represents the total time the device has been used in low latency mode.

Item type: 0x0A

Content:

| **Byte Index** | **Type** | **Description**                             |
|----------------|----------|---------------------------------------------|
| 0-3            | uint32   | Time spent in low latency mode. In minutes. |

### 0x0B Error Information

This item type represents the error information of the device.
This is automatically generated system log if an error or crash happens.

Item type: 0x0B

Content **consists of an array**. Each array item consists of error ID + counter.

Content:

| **Byte Index** | **Type**           | **Description** |
|----------------|--------------------|-----------------|
| 0-4            | Array item payload | Item 1          |
| 5-9            | Array item payload | Item 2          |
| ...            | ...                | ...             |

Array item payload:

| **Byte Index** | **Type** | **Description**                                 |
|----------------|----------|-------------------------------------------------|
| 0              | uint8    | Error ID.                                       |
| 1-4            | uint32   | Counter how many times this error has happened. |

Divide content's length by 5 to get the number of array items.

Items can be in any order and can be skipped if the device has not encountered the specific error.

Error ID values:

| **Value** | **Name** | **Description**          |
|-----------|----------|--------------------------|
| 0x00      | Crash    | The firmware has crashed |

Example:

Consider payload `0x00 00 00 00 01 80 00 43 C0 02`. In this payload:

| **Byte Index** | **Value**   | **Description**                                           |
|----------------|-------------|-----------------------------------------------------------|
| 0              | 0x00        | First item describes error ID 0x00.                       |
| 1-4            | 00 00 00 01 | Error with ID 0x00 has happened 1 time.                   |
| 5              | 0x80        | Second item describes error ID 0x80.                      |
| 6-9            | 00 43 C0 02 | Error with ID 0x80 has happened 0x0043C002=4440066 times. |

## 7. Testing

To verify your implementation of the protocol, you can use our debug apps for testing Bluetooth connections:

### Android

#### Overview

Please contact us for the download link of the Beyerdynamic debug app.

From that link, install the latest APK by date in its name (i.e. `2024-05-08.apk`).

This app has 2 icons on the main screen launcher:

- **Beyerdynamic** - This is the main app that will be released to the public. It might not support your device yet.
- **BY: Debug Connection** - This is the debug app that you can use to test the connection.

Think of them as 2 separate apps within the same APK file.

#### Connecting to a Device

To connect to your device using the debug app, follow these steps:

1. Open the **BY: Debug Connection** app:

![Android Debug App](assets/Screenshot_20240508-205417.png)

2. Grant the necessary permissions if asked.

Now the app should scan for nearby Bluetooth devices and show them in the list.
Note that the app shows only devices that are connected to the phone via A2DP and/or HFP profiles.
If your device doesn't show up in the list, make sure it's connected to the phone via A2DP and/or HFP profiles.
At least one of those profiles should be connected for this device to the phone for it to show up in the list.

<img src="assets/Screenshot_20240508-205139.png" alt="drawing" width="200"/>

Once you see your Bluetooth device in the list:

1. Select the chipset type of your device. This is primarily used for deciding which OTA library to use.
2. Check the SPP UUID below Chipset type.
   This is the UUID that the app will use to connect to the device via SPP.
   Click on "Change" if you want to connect to a different UUID.
3. Click on the device in the list to connect to it.

Now the app should attempt to connect to the device via SPP on the selected UUID.

If the connection is successful, you should see the following screen:

<img src="assets/Screenshot_20240508-205700.png" alt="drawing" width="200"/>

If the connection is not successful, you will see a toast message with the error.
You will be redirected back to the devices list screen.
Please ensure you use the correct UUID for SPP and that the device can accept SPP connections on that UUID,
then try again.

#### Testing Commands

Once you are connected to the device, you will see the list of commands supported by this debug app.

To send a message with a specific command ID, click on the "Send" button next to that command ID.
The app might ask you to provide additional input if the command requires it.

Once a response from the device is received for that command ID,
it will be shown in the command ID card.
If there is an error parsing the response, the app will show an error message in place of the response.

The top half of the screen shows communication logs between the app and the device.
Think of it as a table with columns: Timestamp, Direction, Command ID, Packet Type, and Payload.
Direction '→' means the app sent the message to the device,
and '←' means the app received the message from the device.

You can disconnect from the device at any time by clicking on the "Disconnect" button at
the top of the command IDs list.

> If you believe the app does not send or parse commands correctly,
> please reach out to us. We will be happy to help you.

#### FOTA

The debug app also supports firmware OTA updates using chipset's OTA library.

To use FOTA:

1. Ensure the debug app is connected to your Bluetooth device and that you specified chipset type correctly.
2. Click on the "FOTA" button at the top of the commands list.
3. Select the firmware file you want to flash:

<img src="assets/Screenshot_20240508-210639.png" alt="drawing" width="200"/>

Once an OTA file is picked, the app will attempt to flash the firmware to the device.
The app will show the progress of the flashing process.

Once the OTA finishes, the app will either transition to Completed or Failed state.
Click on "Close" button to return back to previous screens.

If the OTA update process fails and you believe the issue is on app's side,
please also try the same OTA file with your platform's official app for FOTA to verify the issue.
You can find some official FOTA apps in the folder where you downloaded the BY debug app APK.
Please reach out to us if OTA works with the official app but not with the debug app.

#### Extracting App Logs

If you encounter any issues with the app, you can extract the app logs for debugging purposes.
To do this:

1. Open a file system browser app on your phone.
2. Navigate to:
    - Android 10+: `Documents/Beyerdynamic/`
    - Android 8-9: `Android/data/com.beyerdynamic.app/files/`

You should see multiple log files in this folder.
Each file contains logs for a specific app launch.
File name is the time (in UTC) when the app was launched.
Please send us the log file that corresponds to the app launch where you encountered the issue.

#### Copying OTA Files to Main User-Facing App

Once the main user-facing Beyerdynamic app adds support for your device model,
you can use it for testing with your device as well.

You can test OTA also in this app.
The app, by default, will download the OTA files from our server.
However, this server might have poor speed when accessed from China.

In this case, you can push your OTA files into the app storage manually and skip the download step.

**Note:** This works only in debug apps downloaded from the link we provide you.
It will not work if the app was downloaded from Play Store or if the app is for QA.

To push OTA files into the app storage:

1. Install `adb` onto your PC. Follow steps [here](https://www.xda-developers.com/install-adb-windows-macos-linux/)
   to install `adb` and configure your phone for USB debugging.
2. Make sure the debug app is installed on your phone.
3. Force-stop the BY app on your phone.
4. Open a terminal on your PC and run the following commands:

```bash
adb push <Path-To-OTA-file-on-PC> /data/local/tmp/<DeviceType>-<Version>.bin
adb shell run-as com.beyerdynamic.app rm -f files/ota/<DeviceType>-<Version>.bin
adb shell run-as com.beyerdynamic.app mkdir -p files/ota
adb shell run-as com.beyerdynamic.app cp /data/local/tmp/<DeviceType>-<Version>.bin files/ota
adb shell rm /data/local/tmp/<DeviceType>-<Version>.bin
```

Replace `<Path-To-OTA-file-on-PC>` with the path to the OTA file on your PC.
Replace `<Device-Type>` with the device model name as specified in [0x00 Get Device Type](#0x00-get-device-type).
Replace `<Version>` with the version name of the release as specified on the OTA files storage server.
I.e. `adb push /path/to/ota-file.bin /data/local/tmp/VERIO_100-1.5.0.bin`.

Some phones might throw an error that some commands are not found or are not allowed.
You can try a different phone in that case.

Now the OTA file is pushed into the app storage.
You can now open the BY app,
and the app should notify you that a new OTA update is available for your device.

Once OTA update finishes, the app will delete the OTA file from its storage,
so you will need to push the file again if you want to test the OTA update again.
