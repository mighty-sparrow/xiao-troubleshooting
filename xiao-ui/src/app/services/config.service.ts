import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  data = environment;

  constructor(private http: HttpClient) {}

  init() {
    // this.http.get('/environment.ts')
    // .subscribe((obj:Object)=>{
    //   this.data = {...this.data,...obj};
    // })
  }
}
