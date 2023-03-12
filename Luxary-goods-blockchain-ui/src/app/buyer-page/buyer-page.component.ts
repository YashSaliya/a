import { Component, OnInit } from '@angular/core';
import { MyService } from '../service';

@Component({
  selector: 'app-buyer-page',
  templateUrl: './buyer-page.component.html',
  styleUrls: ['./buyer-page.component.scss']
})
export class BuyerPageComponent implements OnInit {


  allProducts = [];
  queriedProducts = [];
  search = "";
  constructor(private myService:MyService) { }

  ngOnInit(): void {
    this.myService.loadContract();
    this.myService.getProducts().then((res:any)=>{
      this.allProducts = res;
      this.queriedProducts = res;
      console.log(this.allProducts);
    });
  }

  searchFn(){
    this.queriedProducts = this.allProducts.filter((item:any)=> {
      //write regex for search queries
      return item.name.toLowerCase().includes(this.search.toLowerCase());
    });
  }



}
