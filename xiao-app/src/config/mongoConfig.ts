import { ConfigService } from '@nestjs/config';
export default () => ({
  mongoConfig: {
    host: process.env.MONGO_HOST || 'nohost',
    port: process.env.MONGO_PORT || '69',
    user: process.env.MONGO_USER || 'nouser',
    secret: process.env.MONGO_SECRET || 'nopassword',
    databases: {
      recordings: {
        name: process.env.MONGO_DATABASE_RECORDINGS || 'no-db',
        collection: process.env.MONGO_COLLECTION_FS_FILES || 'no-col',
      },
    },
  },
});
