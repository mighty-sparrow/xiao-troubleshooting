import { Prop, Schema } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';
import { MFileMetadata } from './mfile.metadata.entity';

@Schema()
export class MFileCore extends Document {
  @Prop()
  @ApiPropertyOptional({
    type: SchemaTypes.ObjectId,
    title: 'ID',
    description:
      'The unique identifier for this document. The `_id` is of the data type you chose for the original document. The default type for MongoDB documents is [BSON ObjectId](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-ObjectId).',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.Number,
    title: 'Length',
    description: 'The size of the document in bytes.',
  })
  @ApiHideProperty()
  @IsNumber()
  length: number;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.Number,
    title: 'Chunk Size',
    description:
      'The size of each chunk in bytes. GridFS divides the document into chunks of size chunkSize, except for the last, which is only as large as needed. The default size is 255 kilobytes (kB).',
  })
  @ApiHideProperty()
  @IsNumber()
  chunkSize: number;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'File Name',
    description: 'Optional. A human-readable name for the GridFS file.',
  })
  @IsOptional()
  filename: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'MD5',
    description:
      'DEPRECATED: The MD5 algorithm is prohibited by FIPS 140-2. MongoDB drivers deprecate MD5 support and will remove MD5 generation in future releases. Applications that require a file digest should implement it outside of GridFS and store in [`files.metadata`](https://www.mongodb.com/docs/manual/core/gridfs/#mongodb-data-files.metadata).',
    deprecated: true,
  })
  @IsOptional()
  md5: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Content Type',
    description:
      'Optional. A valid MIME type for the GridFS file. For application use only.\n\nUse [`files.metadata`](https://www.mongodb.com/docs/manual/core/gridfs/#mongodb-data-files.metadata) for storing information related to the MIME type of the GridFS file.',
  })
  @IsString()
  contentType: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.Date,
    title: 'Upload Date',
    description:
      'The date the document was first stored by GridFS. This value has the Date type.',
  })
  @IsDateString()
  @IsOptional()
  uploadDate: Date;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.Subdocument,
    title: 'MetaData',
    description:
      'Optional. The metadata field may be of any data type and can hold any additional information you want to store. If you wish to add additional arbitrary fields to documents in the `files` collection, add them to an object in the metadata field.',
  })
  @IsOptional()
  metadata: MFileMetadata;
}
