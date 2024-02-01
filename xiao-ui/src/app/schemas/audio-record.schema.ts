export class AudioRecord {
  _id!: string;
  length?: number;
  chunkSize?: number;
  uploadDate?: Date;
  filename?: string;
  contentType?: string;
  md5?: string;
  metadata?: {
    headers: object;
    isTranscribed: boolean;
    transcriptionId: number;
    modifiedDate: Date;
    _id?: string;
    mimetype?: string;
  };
}
