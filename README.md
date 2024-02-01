<div
 style="text-align:center;">
<img src="icon.svg" width="100" alt="The Best Ideas Stand Out">
</div>

# Overview

The purpose of this repository is to illustrate an issue with HTTP `POST` method from a WiFi-enabled device. The device is meant to record audio and upload a file via a REST API. If this all seems like an overblown example, well...it is. But I only copied from documentation already written.

> [!TIP]
> Be sure to follow the instructions in the `README` files under each project's directory.

## High-Level Architecture
This system is using a WiFi-enabled device with a microphone to collect audio. I'm temporarily storing the audio to the onboard SD card before uploading.

For the software side of the implementation, I am trying to keep it lightweight while also learning something new (...so don't judge too harshly). The APIs are built upon and served up via the `MAN`&trade; stack. (...or, should it be the `NAM`&trade; stack? ....`nam` `nam` `nam`)

# Hardware
> [!IMPORTANT]
> --> This is where my problems lie, at the moment.
> 
The remote device has all the things built-in: MicroSD, WiFi and microphone. Specifically, this example targets the [Seeed Studio XIAO ESP32 S3 (Sense)](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/).

# APIs
I built some simple APIs which are well-documented via Swagger. As such, I'm not going to write it all out here. If you don't know what that is, it's okay. All you need to know is how to run the following things:
 1. Command-line.

Okay. Scratch that - you need to know how to use the one thing.

### <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" height="50" alt="Nest Logo" /> NestJS</a>
<details>
<summary>NestJS Handles the APIs</summary>
 
 NestJS handles the [API](https://www.google.com/search?q=API&sourceid=chrome&ie=UTF-8)s for managing content - you know? The basic [_CRUD_ operations](https://www.google.com/search?q=CRUD+operations&sourceid=chrome&ie=UTF-8) (**C**reate **R**ead **U**pdate .**D**elete)

 These methods are simple enough. I following some pretty standard practices in developing this. When it is up and running, you should find a Swagger-generated page with all the APIs at `http://localhost:3000/apis`.
</details>

### <a href="https://angular.dev" target="_blank"><img src="https://raw.githubusercontent.com/angular/angular/main/aio/src/assets/images/logos/angular/angular_renaissance.png" height="50" alt="Angular Logo"> Angular</a>

<details>
 
<summary>Created a simple UI for visualizing results.</summary>
 
* Home Page, with basic instructions/guide to using the subsequent pages
* List all recordings
* Listen to associated audio

I should also make note that I styled this with _Material_. You can see all that stuff on The [Angular Material](https://material.angular.io) site.

</details>

### <a href="https://mongodb.com" target="_blank"><img src="https://raw.githubusercontent.com/mongodb/mongo/master/docs/leaf.svg" height="50" alt="MongoDB Logo">MongoDB</a>

<details>
<summary>Persistance layer, obvy.</summary>
 
I am sure there will be arguments and challenges for using a database to store the actual files. Just know that we don't fully intend on keeping it this way. For now, it makes the most sense to use MongoDB for all of this.

</details>

# Getting Started
There is an assumption here that you, reader, understand how to install and run all the aforementioned software.

At a high-level, we're going to:
 1. Install Dependencies
 2. Build/Run the NestJS application
    * Optionally build/run the Angular UI
 3. Change IP and port for `localhost` proxy
    * Only necessary if you're running the Angular UI
 4. Install the firmware on your XIAO ESP32 S3
 5. Change configuration values in `xiaos3-playground` project
 6. Build and deploy firmware
 6. Open a Serial Monitor and watch the magic unfold.
