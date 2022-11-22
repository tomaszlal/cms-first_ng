import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Articles } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl: string = "http://localhost:9292";

  constructor(private http : HttpClient) { }

  getAllArticles() : Observable<Array<Articles>>{
    return this.http.get<Array<Articles>>(this.apiUrl+"/allarticles");
  }
}
