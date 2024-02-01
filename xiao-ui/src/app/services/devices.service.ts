import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './config.service';
import { Badge } from '../schemas/badge.schema';
import { Station } from '../schemas/station.schema';

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private _badgeList: Badge[] = [];
  private _stationList: Station[] = [];

  private _apiPathBadges: string = '';
  private _apiPathStations: string = '';

  get apiPathBadges(): string {
    return this._apiPathBadges;
  }

  set apiPathBadges(v: string) {
    this._apiPathBadges = v;
  }

  get apiPathStations(): string {
    return this._apiPathStations;
  }

  set apiPathStations(v: string) {
    this._apiPathStations = v;
  }

  constructor(protected httpClient: HttpClient, protected c: AppConfigService) {
    this._apiPathBadges = c.data.apiPathBadges;
    this._apiPathStations = c.data.apiPathStations;
  }

  postBadge(newBadge: Badge): Observable<Badge> {
    return this.httpClient.post<Badge>(this.apiPathBadges, newBadge);
  }
  postStation(newStation: Station): Observable<Station> {
    return this.httpClient.post<Station>(this.apiPathBadges, newStation);
  }

  loadBadges(): Observable<Badge[]> {
    return this.httpClient.get<Badge[]>(this.apiPathBadges);
  }
  loadStations(): Observable<Station[]> {
    return this.httpClient.get<Station[]>(this.apiPathStations);
  }

  deleteBadge(id: string): Observable<string> {
    return this.httpClient.delete<string>(`${this.apiPathBadges}/${id}`);
  }
  deleteStation(id: string): Observable<string> {
    return this.httpClient.delete<string>(`${this.apiPathStations}/${id}`);
  }

  putBadge(badge: Badge): Observable<Badge> {
    return this.httpClient.put<Badge>(
      `${this.apiPathBadges}/${badge._id}`,
      badge
    );
  }
  putStation(station: Station): Observable<Station> {
    return this.httpClient.put<Station>(
      `${this.apiPathStations}/${station._id}`,
      station
    );
  }
}
