import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Articles, Category, PageArticles } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl: string = "http://localhost:9292";

  constructor(private http: HttpClient) { }

  getAllArticles(): Observable<Array<Articles>> {
    return this.http.get<Array<Articles>>(this.apiUrl + "/allarticles");
  }

  getAllCategories(): Observable<Array<Category>> {
    return this.http.get<Array<Category>>(this.apiUrl + "/allcategories");
  }

  getPageArticles(page: number, size: number): Observable<PageArticles> {
    return this.http.get<PageArticles>(this.apiUrl + "/articles?page="+page+"&size="+size);
  }
}
