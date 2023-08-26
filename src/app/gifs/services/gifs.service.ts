import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';
const GYPHY_API_KEY = 'IncDu3B17npmWG9u7c2LXEQF9cwMGvR7';
@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _tagHistory: string[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }
  get tagsHistory() {
    return [...this._tagHistory];
  }
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  public gifList: Gif[] = [];

  private saveLocalStorege(): void {
    localStorage.setItem('history', JSON.stringify(this._tagHistory));
  }
  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;
    this._tagHistory = JSON.parse(localStorage.getItem('history')!);
    if (this._tagHistory.length === 0) return;
    this.searchTag(this._tagHistory[0]);
  }
  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();
    if (this._tagHistory.includes(tag)) {
      this._tagHistory = this._tagHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagHistory.unshift(tag);
    this._tagHistory = this._tagHistory.splice(0, 10);
    this.saveLocalStorege();
  }
  public searchTag(tag: string): void {
    if (tag.length === 0) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', GYPHY_API_KEY)
      .set('limit', 10)
      .set('q', tag);

    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp: SearchResponse) => {
        this.gifList = resp.data;
      });
  }
}
