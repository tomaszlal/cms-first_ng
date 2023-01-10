import { TagDefinition } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Articles, Category, FileData } from '../model/model';
import { Clipboard } from '@angular/cdk/clipboard';  //obsługa schowka
import { FileService } from '../service/file.service';
import { HttpService } from '../service/http.service';
import { Router } from '@angular/router';
// import * as  ClassicEditor  from '@ckeditor/ckeditor5-build-classic'; // do ckeditor5

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  // public Editor:any = ClassicEditor; do ckeditor 5

  modeCreateNew: boolean = true;//wybór trybu edycja / twórz nowy wartośc true-twórz nowy

  listArticles: Array<Articles> = new Array();

  listOfSelectedCategories: Array<Category> = new Array();

  listCategories: Array<Category> = new Array();

  isSelectedCategories: string = "";

  listOfFiles: Array<FileData> = new Array();
  selectedFiles: Array<File> = new Array();
  currentFile?: File;
  descriptionFile: string = "";
  message: string = "";

  articleToDelete:Articles = {};
  idArticleToDelete:number = 0;


  //formularz dodawania kategorii
  public categoryForm: FormGroup = new FormGroup({
    categoryName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    categoryDescription: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  //formularz wybrania artykulu do edycji
  public selectArticleToEditForm: FormGroup = new FormGroup({
    articleNameToEdit: new FormControl(this.listArticles, Validators.required)
  })


  //formularz dodawania nowego artykulu
  public articleForm: FormGroup = new FormGroup({
    articleTitle: new FormControl('', [Validators.required, Validators.minLength(5)]),
    articleDescription: new FormControl('', [Validators.required, Validators.minLength(20)]),
    articlePublicationDate: new FormControl('', [Validators.required]),
    articleListCategories: new FormArray([], Validators.required), //deklaracja lista checkboxow
    filesInArticle: new FormArray([])
  })

  constructor(private httpService: HttpService, private fileService: FileService, private clipboard: Clipboard, private router: Router) {

  }

  ngOnInit(): void {
    this.getCategories();
    this.getListOfFiles();
    this.getArticles();
    console.log(this.listOfFiles);
    console.log(this.listCategories);
    console.log(`tryb NOWY ARTYKUL: ${this.modeCreateNew}`);
  }

  //zapisuje nowa kategorie artykulu do bazu danych
  public saveCategoryToDb() {
    const newCategory: Category = {
      // name: this.categoryForm.controls['categoryName'].value, //drugi sposob
      name: this.getCategoryName?.value,
      description: this.getCategoryDescription?.value
    }
    console.log(newCategory);
    this.httpService.saveCategory(newCategory).subscribe((category) => {
      console.log(category);
      this.listCategories.push(category);
      this.clearFormArticle();
      this.router.navigateByUrl("/");
    })
  }

  //pobranie wszysstkich artykułów
  public getArticles() {
    this.httpService.getAllArticles().subscribe((articlesList) => {
      articlesList.forEach((articles) => {
        this.listArticles.push(articles);
      });

    });
  }

  //pobranie wszystkich categorii z abazy danych
  public getCategories() {
    this.listCategories.length = 0;
    this.httpService.getAllCategories().subscribe((categoryList) => {
      categoryList.forEach((category) => {
        category.checked = false;
        this.listCategories.push(category);
      });
    });
  }

  //pobiera wszystkie pliki z db
  public getListOfFiles() {
    this.listOfFiles.length = 0;  // czyszczenie listy
    this.fileService.getListOfFile().subscribe((filesList) => {
      filesList.forEach((file) => {
        this.listOfFiles.push(file);
      })

    })
  }

  //zapisuje nowy artykuł do bazy danych lub uaktualnia
  public saveArticleToDb() {

    if (this.modeCreateNew){ //zapisuje nowy artykul do db
      const newArticle: Articles = {
        title: this.getArticleTitle?.value,
        description: this.getArticleDescription?.value,
        publicationDate: this.getArticlePublicationDate?.value,
        categoryList: this.getArticleListOfCategory?.value,
        fileDataList: this.getFilesInArticle?.value
      }
      console.log(newArticle);
      this.httpService.saveArticle(newArticle).subscribe((article) => {
        console.log(article);
        this.clearFormArticle();
      });
    }else{//zapisuje uaktualnia artykuł w bazy danych
      if (this.getArticleFromSelectForm?.value != null) {
        const art: Articles = this.getArticleFromSelectForm.value;
        const newArticle: Articles = {
          id: art.id,
          title: this.getArticleTitle?.value,
          description: this.getArticleDescription?.value,
          publicationDate: this.getArticlePublicationDate?.value,
          categoryList: this.getArticleListOfCategory?.value,
          fileDataList: this.getFilesInArticle?.value
        }
        console.log(newArticle);
        this.httpService.updateArticle(newArticle).subscribe((article) => {
          console.log(article);
          this.clearFormArticle();
        });
      }
    }


    this.router.navigate(['/']);
  }


  //przesłanie id artykułu do usunięcia
  public prepareArticleForDeletion() {

    if (this.getArticleFromSelectForm?.value != null) {
      this.articleToDelete = this.getArticleFromSelectForm.value; // pobranie wybranego do edycji artykułu
      this.idArticleToDelete = this.articleToDelete.id != undefined ? this.articleToDelete.id:0 ;
      console.log(this.articleToDelete);

    }
  }

  public deleteArticle() {

    if (this.articleToDelete != undefined){
      this.listArticles.length=0;
      this.httpService.deleteArticle(this.idArticleToDelete).subscribe(articles =>{
        this.listArticles = articles;
      })
    }
    this.clearFormArticle();
  }




  // funkcja  wypełniająca listę FormArray w formularzu wybranymi kategoriami niezbędnie dla validate.required
  public onCheckChange(event: any) {
    const listOfCategories: FormArray = this.getArticleListOfCategory as FormArray; //ustawienie zmiennej (powiązanie wskażnik) tablicy FormArray zawierającej FormControl z metodami Validacji
    if (event.target.checked) {                         //sprawdzenie zaznaczenia checkboxa (ZAZNACZONY)
      this.listCategories.forEach((category) => {
        if (category.id == event.target.value) {
          listOfCategories.push(new FormControl(category)); //wypelnienie formarray powiazanej z formularzem categoriami zaznaczonymi
          console.log(listOfCategories);
        }
      })
    } else {                                               //sprawdzenie zaznaczenia checkboxa (ODZNACZONY)
      this.listCategories.forEach((category) => {
        if (category.id == event.target.value) {
          let i: number = 0;
          listOfCategories.controls.forEach((selected: any) => {
            if (selected.value.id == event.target.value) {
              listOfCategories.removeAt(i);                       //usuniecie z listy odznaczonej kategorii
              console.log(listOfCategories);
              return;
            }
            i++;
          })
        }
      })
    }
  }

  // funkcja  wypełniająca listę FormArray w formularzu wybranymi plikami(zalacznikami)
  public onCheckChangeFiles(event: any) {
    const listOfFilesInArticle: FormArray = this.getFilesInArticle as FormArray;  //ustawienie zmiennej (powiązanie wskażnik) tablicy FormArray zawierającej FormControl z metodami Validacji
    if (event.target.checked) {
      this.listOfFiles.forEach((file) => {
        if (file.id == event.target.value) {
          listOfFilesInArticle.push(new FormControl(file));
          console.log(listOfFilesInArticle);
        }
      })
    } else {
      this.listOfFiles.forEach((file) => {
        if (file.id == event.target.value) {
          let i = 0;
          listOfFilesInArticle.controls.forEach((selected: any) => {
            if (selected.value.id == event.target.value) {
              listOfFilesInArticle.removeAt(i);
              console.log(listOfFilesInArticle);
              return;
            }
            i++;
          })
        }
      })
    }
  }


  //wypełnia danymi wybranego do edycji artykułu formularz edycji i dodawania nowego artykułu
  public insertAarticleToEditForm() {
    this.modeCreateNew = false;

    const listOfCategories: FormArray = this.getArticleListOfCategory as FormArray;  //ustawienie zmiennej (powiązanie wskażnik) tablicy FormArray zawierającej FormControl z metodami Validacji
    listOfCategories.clear();           //wyczyszczenie starej tablicy formarray

    const listOfFilesInArticle: FormArray = this.getFilesInArticle as FormArray;  //ustawienie zmiennej (powiązanie wskażnik) tablicy FormArray zawierającej FormControl z metodami Validacji
    listOfFilesInArticle.clear();



    if (this.getArticleFromSelectForm?.value != null) {
      const art: Articles = this.getArticleFromSelectForm.value; // pobranie wybranego do edycji artykułu
      // console.log(art);
      this.setArticleTitle(art.title);                //wstawienie tytułu do pola,
      this.setArticleDescription(art.description);    //wstawienie opisu  do pola ck editora,
      this.setArticlePublicationDate(art.publicationDate);

      if (art.categoryList != undefined) {      //sprawdzenie czy lista categorii istnieje w artykule
        const catList: Array<Category> = art.categoryList;
        this.listCategories.forEach((category) => {         //forech przez wszystkie kategorie
          category.checked = false;                         //odznaczenie pol checkbox
          catList.forEach((categoryFromArticleEdit) => {        //sprawdzeniewszystkich kategorii i
            if (category.id == categoryFromArticleEdit.id) {    //porownanie ich z pobrana listą z atykulu
              category.checked = true;                          //zaznaczenie checkpboxow
              listOfCategories.push(new FormControl(category))  //wypelnienie formarray powiazanej z formularzem categoriami z artykulu
            }
          })
        })
      }
      console.log(listOfCategories);
      if (art.fileDataList != undefined) {
        const fileList: Array<FileData> = art.fileDataList;
        this.listOfFiles.forEach((file) => {
          file.checked = false;
          fileList.forEach((fileFromArticleEdit) => {
            if (file.id == fileFromArticleEdit.id) {
              file.checked = true;
              listOfFilesInArticle.push(new FormControl(file))
            }
          })
        })
      }
      console.log(listOfFilesInArticle);
    };
  }


  // wybiera plik do przesłania do bazy danej
  public selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.message = "";
    console.log(this.selectedFiles);
  }

  //załadowanie pliku na serwer bazy danych i do katalogu storage
  public uploadFile(): void {
    if (this.selectedFiles) {
      const file = this.selectedFiles[0];
      if (file) {
        this.currentFile = file;
        this.fileService.upload(this.currentFile, this.descriptionFile).subscribe({
          next: (event: any) => {
            this.message = "Plik załadowany"
            this.getListOfFiles();
            this.descriptionFile = "";
          },
          error: (err) => {
            console.log(err);
            this.message = "Plik istnieje w bazie danych";
          }
        })
        this.currentFile = undefined;
      }
      this.selectedFiles = [];
    }
  }



  //zmiana trybu funkcja wywołływana przyciskiem zmiany trybu
  public changeMode() {
    this.modeCreateNew = !this.modeCreateNew;
    console.log(this.modeCreateNew);
    this.clearFormArticle();
  }

  //czyszczenie formularza
  private clearFormArticle() {
    const listOfCategories: FormArray = this.getArticleListOfCategory as FormArray;  //ustawienie zmiennej (powiązanie wskażnik) tablicy FormArray zawierającej FormControl z metodami Validacji
    listOfCategories.clear();           //wyczyszczenie starej tablicy formarray
    const listOfFilesInArticle: FormArray = this.getFilesInArticle as FormArray;  //ustawienie zmiennej (powiązanie wskażnik) tablicy FormArray zawierającej FormControl z metodami Validacji
    listOfFilesInArticle.clear();
    this.setArticleTitle("");                //wstawienie tytułu do pola,
    this.setArticleDescription("");    //wstawienie opisu  do pola ck editora,
    this.setArticlePublicationDate("");
    this.getCategories();
    this.getListOfFiles();
    this.listCategories.forEach((cat) => cat.checked = false);
    this.listOfFiles.forEach((file) => file.checked = false);
  }


  //obsługa schowka kopiowanie do schowka
  public copyText(textToCopy: any) {
    this.clipboard.copy(textToCopy);
  }

  //getters
  public get getCategoryName() {
    return this.categoryForm.get('categoryName');
  }


  public get getCategoryDescription() {
    return this.categoryForm.get('categoryDescription');
  }


  public get getArticleTitle() {
    return this.articleForm.get('articleTitle');
  }


  public get getArticleDescription() {
    return this.articleForm.get('articleDescription');
  }


  public get getArticleListOfCategory() {
    return this.articleForm.get('articleListCategories');
  }


  public get getArticlePublicationDate() {
    return this.articleForm.get('articlePublicationDate');
  }

  public get getFilesInArticle() {
    return this.articleForm.get('filesInArticle');
  }


  public get getArticleFromSelectForm() {
    return this.selectArticleToEditForm.get('articleNameToEdit');
  }


  //setters

  public setArticleTitle(title: any) {
    this.articleForm.get('articleTitle')?.setValue(title);
  }

  public setArticleDescription(description: any) {
    this.articleForm.get('articleDescription')?.setValue(description);
  }

  public setArticlePublicationDate(publicationDate: any) {
    this.articleForm.get('articlePublicationDate')?.setValue(publicationDate);
  }





}
