#pragma once
#include <Arduino.h>
#include <FS.h>
#include <SD.h>
#include <ArduinoHttpClient.h>
#include <WiFi.h>

#include "config/WiFiConfig.h"

#define API_HOST "0.0.0.0"  // Change this to the IP address where the NestJS API is running.
#define API_PORT 3000       // This is the port where the NestJS API is running.

/**
 * @brief This is the short name of the file where audio data is persisted.
 *
 */
#ifndef WAV_FILE_NAME
#define WAV_FILE_NAME "tmp.wav"
#endif

#ifndef AUDIO_FILE_BOUNDARY
/**
 * @brief Request Boundary
 * Used in the HTTP POST request to define
 * the boundary of the request body.
 *
 */
#define AUDIO_FILE_BOUNDARY "AudioFileBoundary"
#endif

#ifndef API_ENDPOINT_HELLO
/**
 * @brief Test API
 * In case you want to test a call/response to the NestJS API.
 */
#define API_ENDPOINT_HELLO "/hello-world"
#endif

#ifndef API_ENDPOINT_MFILE
/**
 * @brief Destination For Files
 * Set this to whatever your API endpoint is.
 */
#define API_ENDPOINT_MFILE "/mfile"
#endif

///////please enter your sensitive data in the Secret tab/arduino_secrets.h
char ssid[] = SECRET_SSID;  // your network SSID (name)
char pass[] = SECRET_PASS;  // your network password (use for WPA, or use as key for WEP)

int status = WL_IDLE_STATUS;
IPAddress server(ipaddr_addr(API_HOST));
WiFiClient wifi;
HttpClient client = HttpClient(wifi, server, API_PORT);

/**
 * @brief Generic Session ID
 *
 * In the event an audio recording is broken up
 * into multiple files, they may be stitched back
 * together later with a common `sessionId`.
 *
 * Currently it's just using `millis()`, but should
 * most likely use a time-stamp in combination with
 * the device's MAC address.
 *
 * @code{.cpp}
 * String s(ESP.getEfuseMac());
 * client.sendHeader("Device-ID", s);
 * @endcode
 *
 */
ulong sessionId;

long timezone = -7;
byte daysavetime = 1;

#ifdef CREATE_TEST_FILE
void writeTestFile() {
    File file = SD.open("/testFile.txt", FILE_WRITE);
    const char* tmp = "This is a test text file.";
    file.println(tmp);
    file.close();

    file = SD.open("/testFile.txt", FILE_READ);
    String txt = file.readString();
    file.close();
    Serial.println("\n===> Sample File Contains:");
    Serial.println(txt);
}
#endif

/**
 * @brief WiFi Status
 * Print some short info about the WiFi connection.
 */
void printWifiStatus() {
    // print the SSID of the network you're attached to:
    Serial.print("SSID: ");
    Serial.println(WiFi.SSID());

    // print your board's IP address:
    IPAddress ip = WiFi.localIP();
    Serial.print("IP Address: ");
    Serial.println(ip);

    // print the received signal strength:
    long rssi = WiFi.RSSI();
    Serial.print("signal strength (RSSI):");
    Serial.print(rssi);
    Serial.println(" dBm\n");
}

/**
 * @brief Print Connection Status
 * Write the connection info to the output. Will return
 * `false` if the connection failed. This is used
 * to simply get an update in the Serial monitor.
 *
 * @return true
 * @return false
 */
bool _printConnectionStatus() {
    // attempt to connect to Wifi network:
    Serial.print("\tStatus: ");
    Serial.print(status);
    Serial.print("\t");
    switch (status) {
        case WL_IDLE_STATUS:
            Serial.println("...idling, please hold.");
            break;
        case WL_NO_SSID_AVAIL:
            Serial.println("Cannot find the SSID.");
            break;
        case WL_SCAN_COMPLETED:
            Serial.println("Scan Completed.");
            break;
        case WL_CONNECTED:
            Serial.println("WL_CONNECTED");
            return true;
            break;
        case WL_CONNECT_FAILED:
            Serial.println("WL_CONNECT_FAILED");
            break;
        case WL_CONNECTION_LOST:
            Serial.println("WL_CONNECTION_LOST");
            break;
        case WL_DISCONNECTED:
            Serial.println("WL_DISCONNECTED");
            break;
        default:
            Serial.println("=== BUMMER ==> Could not find a code for that.");
            break;
    }
    return false;
}

/**
 * @brief Set the Current Time
 * This function updates the system time to the
 * current network time.
 */
void setWiFiTime() {
    configTime(3600 * timezone, daysavetime * 3600, "time.nist.gov", "0.pool.ntp.org", "1.pool.ntp.org");
    struct tm tmstruct;
    delay(2000);
    tmstruct.tm_year = 0;
    getLocalTime(&tmstruct, 5000);
    Serial.printf("\nNow is : %d-%02d-%02d %02d:%02d:%02d\n", (tmstruct.tm_year) + 1900, (tmstruct.tm_mon) + 1, tmstruct.tm_mday, tmstruct.tm_hour, tmstruct.tm_min, tmstruct.tm_sec);
}

/**
 * @brief Reset the Session
 * Resetting the session ID to differentiate session attempts in
 * the MongoDB collections.
 *
 */
void _resetSession() {
    sessionId = 0;
    Serial.println("...reset the session\n");
}

/**
 * @brief HTTP Status
 * Method for reading the HTTP
 * response and printing it to the console.
 *
 * @param hc HttpClient The client used to send
 * the request.
 */
void readResponse() {
    // read the status code and body of the response
    int statusCode = client.responseStatusCode();
    String response = client.responseBody();
    client.stop();
    Serial.print("Response Status Code: ");
    Serial.println(statusCode);
    Serial.println("Response Body:");
    Serial.println(response);
    _resetSession();
}

/**
 * @brief Hello World
 * This is a simple API call to validate the connection.
 * Nothing is stored on the server and a simple JSON
 * response is sent back.
 *
 */
void helloWorldRequest() {
    Serial.println("Sending a 'Hello World' request\n");

    client.get(API_ENDPOINT_HELLO);
    while (!client.available())
        ;
    Serial.println("Received a response...");
    readResponse();
}

/**
 * @brief Upload File
 * This is the process by which the recorded audio is uploaded to
 * a REST API.
 *
 * @param fName The name of the file to upload.
 */
void uploadFile(const char& fName) {
    try {
        if (sessionId == 0) sessionId = millis();

        char head[128];
        sprintf(head, "--%s\r\nContent-Disposition: form-data; name=\"file\"; filename=\"%s\"\r\n\r\n", AUDIO_FILE_BOUNDARY, fName);

        char tail[64];
        sprintf(tail, "\r\n--%s--\r\n", AUDIO_FILE_BOUNDARY);

        Serial.println("\n========> Begin Request\n");

        client.beginRequest();
        client.post(API_ENDPOINT_MFILE);
        client.connectionKeepAlive();
        client.sendHeader("Connection", "keep-alive");
        client.sendHeader("Accept", "*/*");
        client.sendHeader("SessionID", sessionId);

        char path[sizeof(fName) + 1];
        sprintf(path, "/%s", fName);
        File file = SD.open(path, FILE_READ);
        const size_t fLen = file.size();

        client.sendHeader("Content-Length", String(fLen));
        client.sendHeader("Content-Type", "multipart/form-data; boundary=" AUDIO_FILE_BOUNDARY);
        client.println(head);
        client.beginBody();

        /**
         * @brief Echos of Previous Failure...
         * This was a copy of something similar to what I
         * tried initially. I'm not sure how everyone could
         * post a snippet and say "works for me"...when it
         * definitely doesn't.
         */
        char* pBuffer;  // Declare a pointer to your buffer.
        // File myFile = SD.open(F("fileName.txt"));  // Open file for reading.
        if (file) {
            // unsigned int fileSize = file.size();    // Get the file size.
            pBuffer = new char[fLen + 1];
            Serial.printf("File Len:  %d\n", fLen);
            // pBuffer = (char*)malloc(fLen + 1);                 // Allocate memory for the file and a terminating null char.
            file.readBytes(pBuffer, fLen);  // Read the file into the buffer.
            file.flush();
            pBuffer[fLen] = '\0';  // Add the terminating null char.
            // client.write((const uint8_t*)pBuffer, fLen + 1);  // Print the file to the serial monitor.
            client.print(pBuffer);
            file.close();  // Close the file.
        }
        // *** Use the buffer as needed here. ***
        free(pBuffer);

        Serial.println("========> Ending Request\n");
        client.println(tail);
        client.endRequest();
        while (!client.available())
            ;
        readResponse();
    } catch (...) {
        Serial.println("\n\tThere was a problem transmitting audio.\n");
        _resetSession();
    }
}

/**
 * @brief Configure WiFi
 * Runs through the basic process of connecting to a
 * WiFi network.
 */
void WiFiSetup() {
    while (!Serial) {
        ;  // wait for serial port to connect. Needed for native USB port only
    }
    Serial.println("Connecting to WiFi...");

    WiFi.begin(ssid, pass);
    while (WiFi.status() != WL_CONNECTED) {
        Serial.println();
        Serial.print("Attempting to connect with SSID and Password: ");
        Serial.print(ssid);
        Serial.print("\t");
        Serial.println(pass);
        if (_printConnectionStatus()) {
            Serial.println("Continuing from here.");
        } else {
            // wait 1/2 second before retrying...
            delay(500);
        }
    }
    Serial.println();
    Serial.println("=========== Connected to wifi ===========");
    setWiFiTime();
    printWifiStatus();
}
