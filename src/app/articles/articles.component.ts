import { Component, OnInit, ɵinternalCreateApplication } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Articles, Category, PageArticles } from '../model/model';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {





  title = 'cms-first-ng';
  listArticles: Array<Articles> = new Array();
  listCaregories: Array<Category> = new Array();
  listOfSelectedCatagoriesToView: Array<Category> = new Array();
  pageArticles: PageArticles = { empty: true };

  arrayOfArticlesOfPage: Array<number> = [2, 5, 10, 20]; //pozostałe możliwości wyboru artykułów na stronę
  sizeArticlesOnPage: number = this.arrayOfArticlesOfPage[0]; //ilość artykułów na stronę - pierwszy element tablicy powyzej
  pageNumber: number = 0;
  totalPages: number = 0;
  pageNumbers: Array<number> = new Array();

  formArticleOnPage: FormGroup = new FormGroup({
    artOnPage: new FormControl(this.arrayOfArticlesOfPage[0].toString(), Validators.required)
  })

  formCategoryToView: FormGroup = new FormGroup({
    categoryToView: new FormArray([], Validators.required)
  })


  constructor(private httpService: HttpService,) {

  }

  ngOnInit(): void {
    this.getArticles();
    this.getCategories();
    this.getPageArticles(this.pageNumber, this.sizeArticlesOnPage);
    console.log(this.pageArticles);
    console.log(this.listArticles);
    console.log(this.listCaregories);

  }

  public getArticles() {
    this.httpService.getAllArticles().subscribe((articlesList) => {
      articlesList.forEach((articles) => {
        this.listArticles.push(articles);
      });
      // this.listArticles = this.listArticles.slice();
    });
  }

  public getCategories() {
    this.httpService.getAllCategories().subscribe((categoryList) => {
      categoryList.forEach((category) => {
        this.listCaregories.push(category);
      });
    });
  }

  public getPageArticles(page: number, size: number) {

    //test czy jest zaznaczony jakas kategoria

    if (this.formCategoryToView.valid){
      // console.log("Zaznaczona min 1 pozycja w kategorii");
      this.httpService.getPageArticlesByCategory(this.listOfSelectedCatagoriesToView,page,size).subscribe((page)=>{
        console.log(page);
        if (page.totalPages != null) {
          this.totalPages = page.totalPages;
          console.log(this.totalPages);
        }
        if (page.pageable?.pageNumber != null) {
          console.log(page.pageable.pageNumber);
          this.pageNumber = page.pageable.pageNumber;
        }
        this.pageNumbers = [];
        for (let i = 0; i < this.totalPages; i++) {
          this.pageNumbers[i] = i + 1;


        }

        this.pageArticles = page;

      })


    } else {
      // console.log("NIe zaznaczona żadnej katalogach");
      this.httpService.getPageArticles(page, size).subscribe((page) => {
        console.log(page);
        if (page.totalPages != null) {
          this.totalPages = page.totalPages;
          console.log(this.totalPages);
        }
        if (page.pageable?.pageNumber != null) {
          console.log(page.pageable.pageNumber);
          this.pageNumber = page.pageable.pageNumber;
        }
        this.pageNumbers = [];
        for (let i = 0; i < this.totalPages; i++) {
          this.pageNumbers[i] = i + 1;


        }
        // console.log(this.pageNumbers);
        this.pageArticles = page;

      })
    }


  }

  public changePage(pageItem: number) {
    console.log(pageItem);
    this.getPageArticles(pageItem - 1, this.sizeArticlesOnPage);
  }

  setSizeArticlecOnPage() {
    let pageOnSite = this.formArticleOnPage.controls['artOnPage'].value;
    this.sizeArticlesOnPage = pageOnSite;
    this.getPageArticles(0, this.sizeArticlesOnPage);
  }


  onCheckChange(event: any) {
    this.listOfSelectedCatagoriesToView=[];

    const listOfCategories: FormArray = this.getArticleListOfCategory as FormArray;

    if (event.target.checked) {
      this.listCaregories.forEach((category) => {
        if (category.id == event.target.value) {
          listOfCategories.push(new FormControl(category));


          listOfCategories.controls.forEach((itemControl) => {
            this.listOfSelectedCatagoriesToView.push(itemControl.value);

          })

          console.log(this.listOfSelectedCatagoriesToView);
          this.getPageArticles(this.pageNumber, this.sizeArticlesOnPage);
        }
      })
    } else {
      this.listCaregories.forEach((category) => {
        if (category.id == event.target.value) {
          let i: number = 0;

          listOfCategories.controls.forEach((selected: any) =>{
            if (selected.value.id == event.target.value) {
              listOfCategories.removeAt(i);
              listOfCategories.controls.forEach((itemControl) => {
                this.listOfSelectedCatagoriesToView.push(itemControl.value);

              })

              console.log(this.listOfSelectedCatagoriesToView);
              this.getPageArticles(this.pageNumber, this.sizeArticlesOnPage);
              return;
            }
            i++;
          })
        }
      })
    }

  }

  //getters do formularza
  public get getArticleListOfCategory() {
    return this.formCategoryToView.get('categoryToView');
  }

}
