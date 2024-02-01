import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MFileCore } from 'src/shared/mfile.core.entity';

export type MFileDocument = HydratedDocument<MFile>;

@Schema()
export class MFile extends MFileCore {}

export const MFileSchema = SchemaFactory.createForClass(MFile);
