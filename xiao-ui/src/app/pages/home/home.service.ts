import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';
import { IInfoResponse } from './info.entity';
import { environment } from 'src/environments/environment';
import { AppConfigService } from '../../services/config.service';

@Injectable()
export class HomeService {
  constructor(private httpClient: HttpClient) {}

  /** GET heroes from the server */
  getInfo(): Observable<IInfoResponse> {
    return this.httpClient
      .get<IInfoResponse>(environment.apiPathHelloWorld)
      .pipe(map((response) => response));
  }
}
