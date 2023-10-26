import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Post } from '../models/post';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage: AngularFireStorage, private afs: AngularFirestore, private toastr: ToastrService, private router:Router) { }

  uploadImage(selectedImage: any, postData: Post, id: string, formStatus: string) {
    const filePath = `postIMG/${Date.now()}`;
    //console.log(filePath);

    this.storage.upload(filePath, selectedImage).then(() => {
      console.log("Uploaded Image Successfully");

      this.storage.ref(filePath).getDownloadURL().subscribe(URL => {
        postData.postImgPath = URL;

        if(formStatus=='Edit')
        {
          this.updateData(id,postData);
        }
        else{
        this.saveData(postData);
        }
      })
    })
  }
  saveData(postData: any) {
    this.afs.collection('posts').add(postData).then(docRef => {
      this.toastr.success('Data Insert Successfully');
      this.router.navigate(['/posts'])
    });
  }

  loadData() {
    return this.afs.collection('posts').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data }
        })
      })
    )
  }

  loadOneData(id :any ){
    return this.afs.collection('posts').doc(id).valueChanges();
  }

  updateData(id: string,postData: any)
  {

    this.afs.doc(`posts/${id}`).update(postData).then(()=>{
      this.toastr.success('Data Updated Successfully');
      this.router.navigate(['/posts'])
    })
  }

  deleteImage(postImagePath: string,id: string){
    this.storage.storage.refFromURL(postImagePath).delete().then(()=>{
      this.deleteData(id)
    })
  }

  deleteData(id:string)
  {
    this.afs.doc(`posts/${id}`).delete().then(()=>{
      this.toastr.warning('Data Deleted Successfully');
    })
  }
  markFeatured(id :string ,featured: boolean)
  {
    this.afs.doc(`posts/${id}`).update({isFeatured :featured}).then(()=>{
      this.toastr.info('Featured Updated Successfully');
    })
  }
}
