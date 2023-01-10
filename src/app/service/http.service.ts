import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
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
    return this.http.get<PageArticles>(this.apiUrl + "/articles?page=" + page + "&size=" + size);
  }

  getPageArticlesByCategory(listOfSelectedCategories: Array<Category>, page: number, size: number): Observable<PageArticles> {
    return this.http.post<PageArticles>(this.apiUrl + "/articlebycategory?page=" + page + "&size=" + size, listOfSelectedCategories);
  }

  getPageArticlesBySearchText(searchText: string, page: number, size: number): Observable<PageArticles> {
    const queryParams : HttpParams = new HttpParams().set("searchtext",searchText).set("page", String(page)).set("size",String(size));
    return this.http.get<PageArticles>(this.apiUrl+"/search",{params:queryParams});
  }
  saveCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl + "/addcategory", category);
  }

  saveArticle(article: Articles): Observable<Articles> {
    return this.http.post<Articles>(this.apiUrl + "/addarticle", article);
  }

  updateArticle(article: Articles): Observable<Articles> {
    return this.http.put<Articles>(this.apiUrl + "/updatearticle", article);
  }

  deleteArticle(id: number): Observable<Array<Articles>> {
    return this.http.delete<Array<Articles>>(this.apiUrl + "/deletearticle/" + id);
  }
}
