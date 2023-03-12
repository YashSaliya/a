import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { connect } from 'http2';
import Web3 from 'web3';
import { MyService } from '../service';
interface CustomWindow extends Window {
  ethereum?: any;
}
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  web3: any;
  currentAccount: string = '';
  price: number;

  quantity: number;

  //use viewchild to get data from component
  @Input() item: any;
  @Input() type: any;

  constructor(private myservice: MyService) {
    this.price = 4000;
    this.quantity = 1;
    console.log(this.item);
  }

  

  ngOnInit(): void {}
  connectToMetaMask() {
    if (
      typeof window !== 'undefined' &&
      (window as CustomWindow).ethereum !== 'undefined'
    ) {
      // Request account access if needed
      (window as CustomWindow).ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(() => {
          // Instantiate Web3 with Metamask provider
          this.web3 = new Web3((window as CustomWindow).ethereum);
          // Get the current account
          this.web3.eth.getAccounts().then((accounts: string[]) => {
            this.currentAccount = accounts[0];
            console.log(accounts[0]);
          });
        })
        .catch((error: Error) => {
          console.error(error);
        });
    } else {
      console.error('Metamask not found');
    }
  }

  executeSell() {
    this.connectToMetaMask();
    this.myservice.addSell(this.item.productId, this.quantity, this.price);
  }

  executeBuy(){
    this.connectToMetaMask();
    this.myservice.addBuy(this.item.productId,this.price);
  }
}
