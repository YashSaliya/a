import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import Web3 from 'web3';
import { MyService } from '../service';

interface CustomWindow extends Window {
  ethereum?: any;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  web3: any;
  currentAccount: string = 'Login';
  @Output() currentAccountEvent = new EventEmitter<string>();

  constructor(private myService: MyService) {}

  ngOnInit(): void {}
  addNewItem(value: string) {
    this.currentAccountEvent.emit(value);
  }
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
            this.myService.changeMessage(accounts[0]);
            console.log(accounts[0]);
            this.addNewItem(this.currentAccount);
          });
        })
        .catch((error: Error) => {
          console.error(error);
        });
    } else {
      console.error('Metamask not found');
    }
  }
}
