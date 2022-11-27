import { Component, OnInit } from '@angular/core';
import { Articles, Category, PageArticles } from '../model/model';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {



  title = 'cms-first-ng';
  listArticles : Array<Articles> = new Array();
  listCaregories : Array<Category>  = new Array();
  pageArticles : PageArticles = {empty:true};
  sizeArticlesOnPage: number = 2; //ilość artykułów na stronę
  pageNumber: number = 0;
  totalPages : number = 0;
  pageNumbers: Array<number> = new Array();


  constructor(private httpService : HttpService,  ){

  }

  ngOnInit(): void{
    this.getArticles();
    this.getCategories();
    this.getPageArticles(this.pageNumber,this.sizeArticlesOnPage);
    console.log(this.pageArticles);
    console.log(this.listArticles);
    console.log(this.listCaregories);

  }

  public getArticles(){
    this.httpService.getAllArticles().subscribe((articlesList) => {
      articlesList.forEach((articles) => {
        this.listArticles.push(articles);
      });
      // this.listArticles = this.listArticles.slice();
    });
  }

  public getCategories() {
    this.httpService.getAllCategories().subscribe((categoryList) =>{
      categoryList.forEach((category) => {
        this.listCaregories.push(category);
      });
    });
  }

  public getPageArticles(page:number, size:number) {
    this.httpService.getPageArticles(page,size).subscribe((page) => {
      // console.log(page);
      if (page.totalPages!=null){
        this.totalPages = page.totalPages;
        // console.log(this.totalPages);
      }
      if (page.pageable?.pageNumber != null){
        console.log(page.pageable.pageNumber);
        this.pageNumber = page.pageable.pageNumber;
      }
      for (let i = 0; i < this.totalPages; i++) {
        this.pageNumbers[i]=i+1;

      }
      // console.log(this.pageNumbers);
      this.pageArticles = page;

    })
  }

  public changePage(pageItem : number) {
    console.log(pageItem);
    this.getPageArticles(pageItem-1,this.sizeArticlesOnPage);
  }



}
