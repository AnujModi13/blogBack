import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categoryArray : any | undefined;
  formCategory  : string | undefined;
  formStatus : string |undefined = 'New' ;
  cid: string = '';


  constructor(private categoryService:CategoriesService) { }

  ngOnInit(): void {
     this.categoryService.loadData().subscribe(val =>{
      console.log(val)
      this.categoryArray=val;
     })
  }

  onSubmit(formData: any) {
   const categoryData :Category = {
     category: formData.value.category
   };

   if(this.formStatus=='New'){
   this.categoryService.saveData(categoryData)
   formData.reset();
  }
  if(this.formStatus=='Edit'){
    this.categoryService.updateData(this.cid,categoryData)
    formData.reset();
    this.formStatus='New';
   }

  }
  onEdit(category: any, id: string){
    this.formCategory=category;
    this.formStatus='Edit';
    this.cid=id;
  }

  onDelete(id:string)
  {
    this.categoryService.deleteData(id);
  }
}

