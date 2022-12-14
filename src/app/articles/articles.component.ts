import { Component, OnInit, ViewEncapsulation, ɵinternalCreateApplication } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Articles, Category, FileData, PageArticles } from '../model/model';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  encapsulation: ViewEncapsulation.Emulated  //przekazanie styklów w innerhtml
})
export class ArticlesComponent implements OnInit {

  title = 'Pomocnik Technik Informatyk';
  listArticles: Array<Articles> = new Array();
  listCaregories: Array<Category> = new Array();
  listOfSelectedCatagoriesToView: Array<Category> = new Array();
  pageArticles: PageArticles = { empty: true };

  arrayOfArticlesOfPage: Array<number> = [5, 10, 20]; //pozostałe możliwości wyboru artykułów na stronę
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

  formSearchText: FormGroup = new FormGroup({
    searchText: new FormControl('', Validators.required)
  })

  selectedArticle: any = {
    title: "hffhffgh",
    description: "hfhfhhfg",
    fileDataList: []
  };

  constructor(private httpService: HttpService, private _sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    // this.getArticles();   //nie ma potrzeby pobierania wszystkich artykulow skoro pobiera przez pagearticle
    this.getCategories();
    this.getPageArticles(this.pageNumber, this.sizeArticlesOnPage);
    console.log(this.listArticles[0]);

    console.log(this.pageArticles);
    console.log(this.listCaregories);

  }

  //pobranie wszysstkich artykułów do wykasowania w tm pliku ?
  public getArticles() {
    this.httpService.getAllArticles().subscribe((articlesList) => {
      articlesList.forEach((articles) => {
        this.listArticles.push(articles);
      });
      // this.listArticles = this.listArticles.slice();
      // this.selectedArticle = this.listArticles[8];
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
    // drugi test do przygotowania to czy w polu serch jest wprowadzony tekst

    if (this.formSearchText.valid) {
      this.httpService.getPageArticlesBySearchText(this.getSearchText, page, size).subscribe(page => {
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
    }

    else if (this.formCategoryToView.valid) {
      // console.log("Zaznaczona min 1 pozycja w kategorii");
      this.httpService.getPageArticlesByCategory(this.listOfSelectedCatagoriesToView, page, size).subscribe((page) => {
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

  //wywołana funkcja z przycisku szukaj
  searchTextInArticles() {
    this.getPageArticles(0, this.sizeArticlesOnPage);
  }


  onCheckChange(event: any) {
    this.pageNumber = 0;
    this.listOfSelectedCatagoriesToView = [];

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

          listOfCategories.controls.forEach((selected: any) => {
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

  //ustawienie artykułu do okna modalego
  public setArticleToContext(article: Articles) {
    this.selectedArticle.title = article.title;
    this.selectedArticle.description = this._sanitizer.bypassSecurityTrustHtml(article.description ? article.description : "");//akcptowanie styli z ckeditora
    this.selectedArticle.fileDataList = article.fileDataList;

  }

  //gettersy do formularza
  public get getArticleListOfCategory() {
    return this.formCategoryToView.get('categoryToView');
  }


  public get getSearchText() {
    return this.formSearchText.get('searchText')?.value;
  }


}
