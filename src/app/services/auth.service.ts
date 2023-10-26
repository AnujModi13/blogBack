import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  isLoggedInGuard:boolean=false;
  constructor(private afAuth:AngularFireAuth,private toastr:ToastrService,private route:Router) { }

   login(email:string, password:string){
    this.afAuth.signInWithEmailAndPassword(email,password).then(async logRef=>{
      this.toastr.success('Login Succcessfully');
      await this.loadUser();
      this.loggedIn.next(true);
      this.isLoggedInGuard=true;
      this.route.navigate(['/']);
    }).catch(e=>{
      this.toastr.warning(e.message);
    })
  }
  loadUser(){
    this.afAuth.authState.subscribe(user=>{
      localStorage.setItem('user',JSON.stringify(user));
      //this.route.navigate(['/']);
    })
  }

  logout(){
    this.afAuth.signOut().then(()=>{
      this.toastr.success('Logout Successfully');
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedInGuard=false;
      this.route.navigate(['/login']);
    })
  }
  isLoggedIn(){
    return this.loggedIn.asObservable();
  }
}
