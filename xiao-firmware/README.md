
<div style="text-align:center;">
<img src="../icon.svg" width="100" alt="The Best Ideas Stand Out"/>
</div>

> # The Issue...
> This is presenting a problem when sending audio to the API. I can't quite find the right method for sending the _ENTIRE_ file. I only end up with a bunch of metadata and `[at best]` 5 bytes of data.<br/><br/>

# Overview
This firmware is intended to be deployed on the [Seeed Studio XIAO ESP32 S3 (Sense)](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/).

# Running/Testing the Code
Be mindful that the code won't execute unless and until a Serial connection is established. That is, unless you open something like [Serial Monitor](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-serial-monitor), by Microsoft.

# Configuration
If you are a weirdo and felt compelled to change anything from the default configurations in your server environment (the `xiao-app` directory), you'll want to be mindful of that. Ensure you use the same settings here as you did there.

| Setting | File | Notes |
| ------- | ---- | ----- |
| `SECRET_SSID` | `/src/config/WiFiConfig.h` | This should be the WiFi network name you're connecting everything to. |
| `SECRET_PASS` | `/src/config/WiFiConfig.h` | This should be the WiFi password of the network you're connecting everything to. |
| `API_HOST` | `/src/WiFiUtils.h` | Change this to the IP address where the NestJS API is running. |
| `API_PORT` | `/src/WiFiUtils.h` | This is the port where the NestJS API is running. |
| `API_ENDPOINT_MFILE` | `/src/WiFiUtils.h` | Set this to whatever your API endpoint is. If you are using the default settings, this should be something like `/mfile` |
| `RECORD_TIME` | `/src/main.cpp` | The length of time to record audio. |
| `HELLO_WORLD` | `/platformio.ini` | Provided as a build flag when using the `HELLO_WORLD` configuration. This will ensure a call is made to the `/hello-world` API. No audio is recorded when this flag is set. |
| `NO_WIFI` | `/platformio.ini` | Provided as a build flag when using the `NoWoFo` configuration. This will ensure NO calls are made to the API. In this case, only a WAV audio recording is made on the device.
| `ENV_ID` | `/platformio.ini` | Indicates which WiFi configuration to use. Use this number if you switch between WiFi networks and don't want to change code every time.<br/><br/>You can manage the multiple WiFi configurations in `/src/config/WiFiConfig.h`. There is an example already in place for you to modify and/or copy. |