import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './config.service';
import { ICapturingService } from './icapturing.service';

@Injectable({ providedIn: 'root' })
export class RecordingService extends ICapturingService {
  constructor(
    protected override httpClient: HttpClient,
    protected override c: AppConfigService
  ) {
    super(httpClient, c);
    super.apiPath = this.c.data.apiPathRecording;
  }
}
