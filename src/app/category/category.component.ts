import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../model/model';
import { HttpService } from '../service/http.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {


  listCaregories : Array<Category>  = new Array();


  public categoryForm: FormGroup = new FormGroup({
    categoryName: new FormControl('', [Validators.required, Validators.minLength(3)],),
    categoryDescription: new FormControl('', [Validators.required, Validators.minLength(5)],)
  });

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  saveCategoryToDb() {
    throw new Error('Method not implemented.');
  }


  public getCategories() {
    this.httpService.getAllCategories().subscribe((categoryList) =>{
      categoryList.forEach((category) => {
        this.listCaregories.push(category);
      });
    });
  }

  //getters
  public get getCategoryName() {
    return this.categoryForm.get('categoryName');
  }


  public get getCategoryDescription() {
    return this.categoryForm.get('categoryDescription');
  }




}
