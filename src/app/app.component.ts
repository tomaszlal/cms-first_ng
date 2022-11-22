import { Component } from '@angular/core';
import { Articles, CategoryList } from './model/model';
import { HttpService } from './service/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cms-first-ng';
  listArticles : Array<Articles> = new Array();
  listCaregories : Array<CategoryList>  = new Array();

  constructor(private httpService : HttpService){}

  ngOnInit(): void{
    this.getArticles();
    console.log(this.listArticles);
  }

  public getArticles(){
    this.httpService.getAllArticles().subscribe((articlesList) => {
      articlesList.forEach((articles) => {
        this.listArticles.push(articles);
      });
      // this.listArticles = this.listArticles.slice();
    })
  }

}
