import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Articles, Category } from '../model/model';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  listOfSelectedCategories: Array<Category> = new Array();

  listCaregories: Array<Category> = new Array();

  isSelectedCategories: string = "";


  public categoryForm: FormGroup = new FormGroup({
    categoryName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    categoryDescription: new FormControl('', [Validators.required, Validators.minLength(5)])
  });


  public articleForm: FormGroup = new FormGroup({
    articleTitle: new FormControl('', [Validators.required, Validators.minLength(5)]),
    articleDescription: new FormControl('', [Validators.required, Validators.minLength(20)]),
    articlePublicationDate: new FormControl('', [Validators.required]),
    articleListCategories: new FormArray([], Validators.required) //deklaracja lista checkboxow
  })

  constructor(private httpService: HttpService) {

  }

  ngOnInit(): void {
    this.getCategories();
  }

  public saveCategoryToDb() {
    const newCategory: Category = {
      // name: this.categoryForm.controls['categoryName'].value,
      name: this.getCategoryName?.value,
      description: this.getCategoryDescription?.value
    }
    console.log(newCategory);
    this.httpService.saveCategory(newCategory).subscribe((category) => {
      console.log(category);
      this.listCaregories.push(category);
      this.categoryForm.reset();
    })
  }


  public getCategories() {
    this.httpService.getAllCategories().subscribe((categoryList) => {
      categoryList.forEach((category) => {
        this.listCaregories.push(category);
      });
    });
  }

  public saveArticleToDb() {

    const newArticle : Articles = {
      title: this.getArticleTitle?.value,
      description: this.getArticleDescription?.value,
      publicationDate: this.getArticlePublicationDate?.value,
      categoryList: this.getArticleListOfCategory?.value

    }
    console.log(newArticle);
    this.httpService.saveArticle(newArticle).subscribe((article) =>{
      console.log(article);
      this.articleForm.reset();
    });

  }


  // funkcja  wypełniająca listę FormArray w formularzu niezbędnie dla validate.required
  public onCheckChange(event: any) {

    const listOfCategories: FormArray = this.getArticleListOfCategory as FormArray;

    if (event.target.checked) {
      this.listCaregories.forEach((category) => {
        if (category.id == event.target.value) {
          listOfCategories.push(new FormControl(category));

        }
      })
    } else {
      this.listCaregories.forEach((category) => {
        if (category.id == event.target.value) {
          let i: number = 0;

          listOfCategories.controls.forEach((selected: any) =>{
            if (selected.value.id == event.target.value) {
              listOfCategories.removeAt(i);
              return;
            }
            i++;
          })
        }
      })
    }

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




}
