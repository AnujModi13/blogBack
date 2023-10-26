import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Category } from '../models/category';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afs: AngularFirestore,private toastr:ToastrService) { }


  saveData(categoryData: Category){

    this.afs.collection('categories').add(categoryData).then(docRef =>{
      //console.log(docRef)
      this.toastr.success(" New Category added successfully")
     //this.afs.doc(`categories/${docRef}`).collection('subcategories').add(subcategoryData).then(subRef =>{}).catch(err =>{});
      //or
      //this.afs.collection('categories').doc(docRef.id).collection('subCategories').add(subcategoryData).then(subRef =>{
       //console.log(subRef)
    }).catch (err => {
      console.log(err)});
    }

    loadData(){
      return this.afs.collection('categories').snapshotChanges().pipe(
        map(actions =>{
          return actions.map(a => {
            const data= a.payload.doc.data();
            const id =a.payload.doc.id;
            return { id, data}
          })
        })
      )
    }

    updateData(id: string ,editData: Category)
    {
      this.afs.collection('categories').doc(id).update(editData).then(docRef =>{
        this.toastr.success(" Category Edited successfully")
      }).catch(err =>{
        console.log(err);
      })
    }

    deleteData(id :string){
      this.afs.collection('categories').doc(id).delete().then(docRef=>{
        this.toastr.success(" Category Deleted successfully")
      }).catch(err =>{
        console.log(err);
      })
    }
}
