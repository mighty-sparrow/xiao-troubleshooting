import { Document } from 'mongoose';
import { MFileMetadata } from './mfile.metadata.entity';

export interface IMFile extends Document {
  readonly _id: string;

  readonly length: number;

  readonly chunkSize: number;

  readonly uploadDate: string;

  readonly filename: string;

  readonly md5: string;

  readonly contentType: string;

  readonly metaData: MFileMetadata;
}
