
<div style="text-align:center;">
<img src="../icon.svg" width="100" alt="The Best Ideas Stand Out"/>
</div>

# Overview
Provides API for uploading audio content. This code was derived from the [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Configurations
I know I don't manage my configuration files in the same way as others, but it works. I like it. Sorry if it's annoying to any _out-of-the-box_ devs out there.

Make the following configuration changes prior to running on your hardware.
| Configuration | File | Notes |
| ------------- | ---- | ----- |
| `DATABASE_HOST` | `src/config/.env` | This is your MongoDB host. |
| `DATABASE_PORT` | `src/config/.env` | This is your MongoDB port. |

Everything else there is pretty much placeholder. Like I mentioned earlier, this was slimmed down from a slightly larger PoC.

# Getting Started

## Installation

```bash
$ yarn install
```

## Running the app
The environment variable `NODE_ENV` is set in the startup script. You can see this in the `package.json` file where I added `NODE_ENV=...` to the beginning of each script.

```bash
# Run and watch with `debug` configuration settings
$ yarn run start:debug

# Run and watch with `development` settings.
$ yarn run start:dev

```
# Confirmation
| Notes | Image |
| ----- | ----- |
| When the application starts up, you should see your settings in the output. Of course, if the settings weren't correct, it wouldn't start at all. | <img src='Screenshot - startup.png' /> |
| Once it's up and running, you should see the Swagger API docs at [`http://localhost:3000/api`](http://localhost:3000/api).| <img src='Screenshot - Swagger.png' /> |

