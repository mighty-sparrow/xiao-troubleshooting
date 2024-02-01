import {
  Controller,
  Get,
  Param,
  Delete,
  Req,
  UseFilters,
  Logger,
  Post,
  StreamableFile,
  Res,
  Body,
  Put,
} from '@nestjs/common';
import { MFileService } from './mfile.service';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { IMFile } from 'src/shared/mfile.interface';
import { MFile } from './mfile.entity';
import { BC } from 'src/shared/logging/bash.colors';

type Request = FastifyRequest;
type Response = FastifyReply;

@Controller('mfile')
@ApiTags('MongoDB File Management')
@UseFilters(new HttpExceptionFilter())
export class MFileController {
  private readonly logger: Logger;

  constructor(
    private readonly audioStreamService: MFileService,
    private configService: ConfigService,
  ) {
    this.logger = new Logger(MFileController.name);
    this.logger.debug(
      `${BC.red}Starting ${BC.rst}${MFileController.name}: ${
        BC.bg_blue
      }${this.configService.get<string>(
        'mongoConfig.databases.recordings.name',
      )}${BC.rst}`,
    );
  }

  @ApiOperation({
    summary: 'Upload a file.',
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: { type: 'string', format: 'binary', required: ['true'] },
            },
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    schema: {
      properties: {
        id: {
          type: 'string',
          example: '5e2b4cb75876c93e38b6e6aa',
        },
      },
    },
  })
  @Post()
  upload(@Req() request: Request): Promise<{ id: string }> {
    return this.audioStreamService.upload(request);
  }

  @ApiOperation({
    summary: 'Find all uploaded files.',
  })
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '5e2b447e4aadb800bccfb339' },
          length: { type: 'number', example: 730416 },
          chunkSize: { type: 'number', example: 261120 },
          uploadDate: { type: 'Date', example: '2020-01-24T19:24:46.366Z' },
          filename: { type: 'string', example: 'IMG_0359.jpeg' },
          md5: { type: 'string', example: 'ba230f0322784443c84ffbc5b6160c30' },
          contentType: { type: 'string', example: 'image/jpeg' },
        },
      },
    },
  })
  @Get()
  findAllFiles() {
    return this.audioStreamService.findAll();
  }

  @ApiOperation({ summary: 'Download a File.' })
  @Get(':id')
  downloadFile(
    @Param('id') id: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    return this.audioStreamService.download(id, request, response);
  }

  @ApiOperation({
    summary: 'Update a File',
  })
  @ApiOkResponse({ description: 'Updated recording successfully.' })
  @ApiNotFoundResponse({ description: 'Could not find recording.' })
  @ApiUnprocessableEntityResponse({
    description: 'Could not update recording.',
  })
  @Put(':id')
  public update(
    @Param('id') id: string,
    @Body() recording: MFile,
  ): Promise<IMFile> {
    return this.audioStreamService.update(id, recording);
  }

  @ApiOperation({ summary: 'Delete a file.' })
  @ApiOkResponse({
    schema: {
      properties: {
        _id: {
          type: 'string',
          example: '5e2b4cb75876c93e38b6e6aa',
        },
      },
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.audioStreamService.remove(id);
  }

  @ApiOperation({ summary: 'Delete all recordings in the database.' })
  @Delete()
  clear() {
    return this.audioStreamService.removeAll();
  }
}
