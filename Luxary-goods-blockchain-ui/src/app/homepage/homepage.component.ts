import { Component, OnInit } from '@angular/core';
import { MyService } from '../service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  currentAccount: string = '';
  constructor(private myService: MyService) {}
  ngOnInit(): void {
    this.myService.currentMessage.subscribe((message) => {
      this.currentAccount = message;
    });
  }
}
