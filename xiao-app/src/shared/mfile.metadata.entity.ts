import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsOptional,
} from 'class-validator';
import { IsAudioFile } from 'src/validators/audio.file.validator';

export type MFileMetadataDocument = HydratedDocument<MFileMetadata>;

@Schema()
export class MFileMetadata {
  constructor() {
    this.isTranscribed = false;
    this.transcriptionId = 0;
    this.modifiedDate = new Date();
    this.headers = {};
  }

  @Prop({
    type: Object,
  })
  @ApiProperty({
    type: SchemaTypes.Mixed,
    title: 'WAV File Header',
    description:
      'This is the header of the `.wav` file. This can be stored separately to make indexing/searching large data sets more performant.',
  })
  @IsObject()
  @IsOptional()
  headers?: object;

  @Prop({ default: false })
  @ApiProperty({
    type: SchemaTypes.Boolean,
    title: 'Is Transcribed',
    description:
      'Identifies whether or not the audio has been processed and transcribed.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isTranscribed: boolean;

  @Prop()
  @ApiPropertyOptional({
    type: SchemaTypes.Number,
    title: 'Transcription ID',
    description:
      '*PLACEHOLDER*: This is the identifier for the corresponding transcription in another table. That table and relationship needs to be designed/established.',
  })
  @IsOptional()
  @IsNumberString()
  transcriptionId?: number;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.Date,
    title: 'Moified Date',
    description:
      'The date the document was flast updated. This value has the Date type.',
    default: new Date().toISOString(),
  })
  @IsDateString()
  @IsOptional()
  modifiedDate: Date;

  @Prop()
  @ApiPropertyOptional({
    type: SchemaTypes.Number,
    title: 'Seconds',
    description: '*PLACEHOLDER*: This is the length of the recording.',
  })
  @IsOptional()
  @IsNumberString()
  seconds?: number;

  @Prop({
    name: 'mimetype',
  })
  @ApiPropertyOptional({
    type: SchemaTypes.String,
    title: 'MIME Type',
    description: 'The MIME Type of the audio file.',
  })
  @IsNotEmpty()
  @IsAudioFile({ message: 'Invalid mime type received.' })
  mimetype?: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Encoding',
    description: 'The encoding method for the file.',
  })
  @IsNotEmpty()
  encoding?: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Field Name',
    description: 'Not really sure what this is, but keeping it in here.',
  })
  @IsNotEmpty()
  fieldname?: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Type',
    description: `The base type of the object - should be 'file'.`,
  })
  @IsNotEmpty()
  type?: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Session ID',
    description: `The unique session ID provided by the device.`,
  })
  @IsNotEmpty()
  sessionId?: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Device ID',
    description: `The unique device ID sent in a request.`,
  })
  @IsNotEmpty()
  deviceId?: string;

  @Prop()
  @ApiProperty({
    type: SchemaTypes.String,
    title: 'Audio Source',
    description: `The source of the audio recording.`,
  })
  @IsNotEmpty()
  audioSource?: string;
}
export const MFileMetadataSchema = SchemaFactory.createForClass(MFileMetadata);
