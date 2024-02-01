import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './config.service';
import { AudioRecord } from '../schemas/audio-record.schema';

export class ICapturingService {
  private _fileList: AudioRecord[] = [];
  private _apiPath: string = '';

  get apiPath(): string {
    return this._apiPath;
  }

  set apiPath(v: string) {
    this._apiPath = v;
  }

  constructor(
    protected httpClient: HttpClient,
    protected c: AppConfigService
  ) {}

  sendData(blob: Blob): Observable<{ id: string }> {
    let fDate = new Date();
    let fName = 'API Upload ' + fDate.toISOString() + '.mp3';
    let formData = new FormData();
    formData.append('file', blob, fName);

    let _params = {
      isTranscribed: 'false',
    };
    return this.httpClient.post<{ id: string }>(this.apiPath, formData, {
      params: _params, // This adds the params to the query string.
    });
  }

  public getFileList() {
    return this._fileList;
  }
  /**
   * Get all files from MongoDB.
   */
  load(): Observable<AudioRecord[]> {
    return this.httpClient.get<AudioRecord[]>(this.apiPath);
  }

  download(id: string): Observable<ArrayBuffer> {
    return this.httpClient.get(`${this.apiPath}/${id}`, {
      responseType: 'arraybuffer',
    });
  }

  delete(id: string): Observable<string> {
    return this.httpClient.delete<string>(`${this.apiPath}/${id}`);
  }
}
