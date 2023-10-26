import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  userEmail !: any;
  isLoggedIn$!: Observable<boolean>;
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn$=this.auth.isLoggedIn();
    const user = localStorage.getItem('user');
    if(user)
    this.userEmail = JSON.parse(user).email;
  }

  onLogOut(){
    this.auth.logout();
  }

}
