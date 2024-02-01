import {
  HttpException,
  HttpStatus,
  ImATeapotException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
  ServiceUnavailableException,
  StreamableFile,
} from '@nestjs/common';
import { IMFile } from 'src/shared/mfile.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ObjectId } from 'bson';
import { Model, isObjectIdOrHexString, mongo } from 'mongoose';
import { MFile } from './mfile.entity';
import { MFileMetadata } from 'src/shared/mfile.metadata.entity';
import { ConfigService } from '@nestjs/config';

type Request = FastifyRequest;
type Response = FastifyReply;

@Injectable()
export class MFileService {
  private readonly bucket: mongo.GridFSBucket;
  private readonly logger = new Logger(MFileService.name);

  constructor(
    @InjectModel('fs.files', 'cxnRecordings')
    private fileModel: Model<IMFile>,
    private configService: ConfigService,
  ) {
    this.logger.debug(
      `Starting ${MFileService.name}: ${this.configService.get(
        'mongoConfig.databases.recordings.name',
      )}`,
    );
    this.bucket = new mongo.GridFSBucket(this.fileModel.db.db);
  }

  async upload(request: Request): Promise<{ id: string }> {
    const data = await request.file();
    return new Promise((resolve, reject) => {
      try {
        const id = new ObjectId();
        const file = data.file;
        const mData = new MFileMetadata();
        mData.encoding = data.encoding;
        mData.fieldname = data.fieldname;
        mData.mimetype = data.mimetype;
        mData.type = data.type;
        mData.headers = request.headers;
        const uploadStream = this.bucket.openUploadStreamWithId(
          id,
          data.filename,
          {
            contentType: request.headers['content-type'],
            metadata: mData,
          },
        );

        file.on('end', () => {
          resolve({
            id: uploadStream.id.toString(),
          });
        });

        file.pipe(uploadStream);
      } catch (e) {
        console.error(e);
        reject(new ServiceUnavailableException());
      }
    });
  }

  async remove(id: string): Promise<{ _id: string }[]> {
    this.logger.debug(`Deleting recording with id: ${id}`);
    if (!isObjectIdOrHexString(id)) {
      throw new NotAcceptableException('The ID is not a valid MongoDB ID.');
    }
    try {
      const _id = new ObjectId(id);
      return this.bucket.delete(_id).then(() => {
        return [{ _id: id }];
      });
    } catch (err) {
      throw new NotFoundException(`File with id "${id}" was not found.`);
    }
  }

  async download(
    id: string,
    request: Request,
    response: Response,
  ): Promise<StreamableFile> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new HttpException(
          'Invalid Record ID',
          HttpStatus.UNPROCESSABLE_ENTITY,
          {
            cause: new Error('Does not pass basic validation rules'),
          },
        );
      }

      const oId = new ObjectId(id);
      const fileInfo = await this.fileModel.findOne({ _id: id }).exec();

      if (!fileInfo) {
        throw new HttpException('Record Not Found', HttpStatus.NOT_FOUND, {
          cause: new Error('Could not locate the audio in the database.'),
        });
      }

      if (request.headers.range) {
        const range = request.headers.range.substring(6).split('-');
        const start = parseInt(range[0], 10);
        const end = parseInt(range[1], 10) || null;
        const readstream = this.bucket.openDownloadStream(oId, {
          start,
          end,
        });

        response.status(206);
        response.headers({
          'Accept-Ranges': 'bytes',
          'Content-Type': fileInfo.contentType,
          'Content-Range': `bytes ${start}-${end ? end : fileInfo.length - 1}/${
            fileInfo.length
          }`,
          'Content-Length': (end ? end : fileInfo.length) - start,
          'Content-Disposition': `attachment; filename="${fileInfo.filename}"`,
        });

        return new StreamableFile(readstream);
      } else {
        this.logger.debug("You're in the right spot.");
        const readstream = this.bucket.openDownloadStream(oId);
        response.status(200);
        response.headers({
          'Accept-Range': 'bytes',
          'Content-Type': fileInfo.contentType,
          'Content-Length': fileInfo.length,
          'Content-Disposition': `attachment; filename="${fileInfo.filename}"`,
        });
        return new StreamableFile(readstream);
      }
    } catch (e) {
      console.error(e);
      const x = e as HttpException;

      throw new HttpException(x.message, x.getStatus(), { cause: x.cause });
    }
  }

  findAll() {
    this.logger.debug('Getting all the files.');
    return this.fileModel.find().sort({ uploadDate: -1 }).exec();
  }

  async removeAll() {
    this.logger.debug('Clearing out entire database.');
    try {
      this.fileModel.deleteMany().exec();
    } catch (err) {
      throw new ImATeapotException(`Couldn't clear out the database tables.`);
    }
  }

  async update(id: string, recording: MFile): Promise<IMFile> {
    this.logger.debug(`Updating recording with id: ${id}`);
    let existingRecording;
    try {
      existingRecording = await this.fileModel.findByIdAndUpdate(
        id,
        recording,
        { modifiedDate: new Date().toISOString() },
      );

      if (!existingRecording) {
        throw new HttpException(
          'Record Not Found',
          HttpStatus.UNPROCESSABLE_ENTITY,
          {
            cause: new Error(`Recording with id "${id}" was not found.`),
          },
        );
      }
    } catch (e) {
      console.error(e);
      const x = e as HttpException;
      throw new HttpException(x.message, x.getStatus(), { cause: x.cause });
    }
    return existingRecording;
  }
}
