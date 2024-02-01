<div style="text-align:center;">
<img src="../icon.svg" width="100" alt="The Best Ideas Stand Out"/>
</div>

# Overview

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.8.

> # Prerequisites 
> Do this before running the application.
> ## Proxy Configuration
> Prior to building and running, you will need to update the `./src/proxy.conf.json` file.
>
> Get your local IP address (or wherever the `xiao-firmware` app is running) and update the file with it. For example, replace `[YOUR IP ADDRESS HERE]` with your IP Address:
>  ```json
>  {
>   "/api/*": {
>     "target": "http://[YOUR IP ADDRESS HERE]:3000",
>     "secure": false,
>     "pathRewrite": {
>       "^/api": ""
>     },
>     "changeOrigin": false,
>     "logLevel": "debug"
>   }
> }
>  ```
> Otherwise your Angular app will not communicate with the APIs

## Development server

Run `yarn run watch` to start the application and ensure there are live updates as you make changes. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
