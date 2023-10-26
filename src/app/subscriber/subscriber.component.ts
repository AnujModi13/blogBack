import { Component, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})
export class SubscriberComponent implements OnInit {

  subArray !:Array<any>;
  constructor(private subscriberService:SubscribersService){}

  ngOnInit(): void {

    this.subscriberService.loadData().subscribe(val =>{
      this.subArray=val;
    })

  }


  onDelete(id: string)
  {
    this.subscriberService.deleteData(id);
  }
}
