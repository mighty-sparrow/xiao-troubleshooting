import { Controller, Get, Logger, UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { HardwareInfo } from './hello-world.entity';
import { BC } from 'src/shared/logging/bash.colors';

@Controller('hello-world')
@ApiTags('Hello Node World!')
@UseFilters(new HttpExceptionFilter())
export class HelloWorldController {
  private readonly logger: Logger;

  constructor(private configService: ConfigService) {
    this.logger = new Logger(HelloWorldController.name);
    this.logger.debug(
      `${BC.red}Starting ${BC.rst}${HelloWorldController.name}${BC.rst}`,
    );
  }

  @ApiOperation({
    summary: 'Get a Response From the Server',
    description:
      'Simple API to test a response from the browser. The object in the response contains hardware details where the service is running.',
  })
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          arch: { type: 'string', example: 'x64' },
          hostname: { type: 'string', example: 'raspberrypi.local' },
          machine: { type: 'string', example: 'x86_64' },
          platform: { type: 'string', example: 'darwin' },
          version: {
            type: 'string',
            example:
              'Darwin Kernel Version 23.2.0: Wed Nov 15 21:54:10 PST 2023; root:xnu-10002.61.3~2/RELEASE_X86_64',
          },
          user: {
            type: 'object',
            properties: {
              username: { type: 'string', example: 'pi' },
              homedir: { type: 'string', example: '/home/pi' },
              shell: { type: 'string', example: '/bin/zsh' },
              uid: { type: 'number', example: '501' },
            },
          },
        },
      },
    },
  })
  @Get()
  findAll() {
    const m = new HardwareInfo();
    this.logger.debug('Sucessfully returning a value');
    this.logger.debug(m);
    return m;
  }
}
