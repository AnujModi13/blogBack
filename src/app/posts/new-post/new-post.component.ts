import { Category } from './../../models/category';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from './../../services/categories.service';
import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  permalink :string='';
  imageSrc : any = "\\assets\\placeholder.png";
  selectedImg :any;
  categories :any | undefined;
  postForm !: FormGroup;
  post :any;
  formStatus :string='Add New';
  docId !:string;

  constructor(private CategoriesService:CategoriesService ,private fb:FormBuilder,private toastr: ToastrService, private postService:PostsService,private afs:AngularFirestore,private route:ActivatedRoute){

    this.route.queryParams.subscribe(val =>{
      this.docId=val['id'];
    if(this.docId){
      this.postService.loadOneData(val['id']).subscribe(post=>{
        this.post=post;

        this.postForm =this.fb.group({
          title:[this.post.title,[Validators.required,Validators.minLength(10)]],
          permalink:new FormControl({value:this.post.permalink,disabled:true}),
          excerpt:[this.post.excerpt,[Validators.required,Validators.minLength(50)]],
          category:[`${this.post.category.categoryId}-${this.post.category.category}`,[Validators.required]],
          postImg:['',[Validators.required]],
          content:[this.post.content,[Validators.required]]
        })

        this.imageSrc=this.post.postImgPath;
        this.formStatus='Edit';
      })

    }
    else{

      this.postForm =this.fb.group({
        title:['',[Validators.required,Validators.minLength(10)]],
        permalink:new FormControl({value:'',disabled:true}),
        excerpt:['',[Validators.required,Validators.minLength(50)]],
        category:['',[Validators.required]],
        postImg:['',[Validators.required]],
        content:['',[Validators.required]]
      })
    }

    })




  }

  ngOnInit(): void {
    this.CategoriesService.loadData().subscribe(val=>{
      this.categories=val;
    })

  }

  get fc(){
    return this.postForm.controls;
  }
  onTitleChanged($event: any){
    const title=$event.target.value;
    this.permalink=title.replace(/\s/g,'-');
  }

  showPreview($event: any){
    const reader = new FileReader();
    reader.onload=(e)=>{
      this.imageSrc=e.target?.result
    }
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg=$event.target.files[0];

  }

  onSubmit(){

    let splitted= this.postForm.value.category.split('-');

    const postData :Post ={
      title:this.postForm.value.title,
      permalink:this.permalink,
      category:{
        categoryId:splitted[0],
        category:splitted[1],
      },
      postImgPath:'',
      excerpt:this.postForm.value.excerpt,
      content:this.postForm.value.content,
      isFeatured:false,
      views:0,
      status:'new',
      createdAt: new Date()
    }
    //console.log(postData);

    this.postService.uploadImage(this.selectedImg,postData,this.docId,this.formStatus);
    this.postForm.reset();
    this.imageSrc="\\assets\\placeholder.png";
  }
}
