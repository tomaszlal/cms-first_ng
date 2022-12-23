import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileData } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  apiUrl: string = "http://localhost:9292";

  constructor(private http: HttpClient) { }

  public upload(file : File,description:string):Observable<HttpResponse<any>>{
    const formData : FormData  = new FormData();

    formData.append('file',file);
    formData.append('description',description);

    return this.http.post<HttpResponse<any>>(this.apiUrl+"/upload",formData);
    // ,{reportProgress:true}
  }

  public getListOfFile():Observable<Array<FileData>> {

    return this.http.get<Array<FileData>>(this.apiUrl+"/allfiles");
  }
}
