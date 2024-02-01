import { Module } from '@nestjs/common';
import { MFileService } from './mfile.service';
import { MFileController } from './mfile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MFileSchema } from './mfile.entity';

@Module({
  controllers: [MFileController],
  providers: [MFileService],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: 'fs.files',
          schema: MFileSchema,
          collection: process.env.MONGO_COLLECTION_FS_FILES,
        },
      ],
      'cxnRecordings',
    ),
  ],
})
export class MFileModule {}
