import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Web3 from 'web3';
interface CustomWindow extends Window {
  ethereum?: any;
}
@Injectable({
  providedIn: 'root',
})


export class MyService {
  public sharedValue: string = '';
  web3:any = new Web3("https://sepolia.infura.io/v3/c280de82098240a78ce5b2b995e36fad");
  currentAccount: string = 'Login';
  contract: any;
  contractAddress: string = '0x55E76AB3E53471615Bfbe3ea6f37e1Bd202A8543'; // Replace with your contract address
  contractABI: any = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "addToSell",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "priceInWei",
          "type": "uint256"
        }
      ],
      "name": "buyone",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "url",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "manufacturer",
          "type": "address"
        }
      ],
      "name": "createByManufacturer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "keysluxuryGoods",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "luxuryGoods",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "url",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "manufacturer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalSupply",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "manufacturers",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "users",
      "outputs": [
        {
          "internalType": "string",
          "name": "firstname",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "lastname",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "desc",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "viewInventory",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "productId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "url",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "manufacturer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "quantity",
              "type": "uint256"
            }
          ],
          "internalType": "struct ProvenanceTracking.SellItem[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "viewStock",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "productId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "url",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "manufacturer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "desc",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            }
          ],
          "internalType": "struct ProvenanceTracking.BuyItem[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  private messageSource = new BehaviorSubject(this.sharedValue);
  currentMessage = this.messageSource.asObservable();
  constructor() {
    this.loadContract();
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

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  loadContract() {
    console.log('hello');
    this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);

  }


  getProducts() {
    return this.contract.methods.viewStock().call().then((t:any)=>{return t;});
  }


  getSellerProducts(){
    this.connectToMetaMask();
    console.log(this.currentAccount);
    return this.contract.methods.viewInventory(this.currentAccount).call().then((t:any)=>{
      console.log(t);
      return t;
    })
  }

  addSell(productid: number,quantity: number,price: number){
    this.connectToMetaMask();
    return this.contract.methods.addToSell(productid,quantity,price).send({from: this.currentAccount}).then((t:any)=>{
      console.log(t);
      return t;
    })
  }

  addBuy(productId:number, price:number){
    this.connectToMetaMask();
    const gasPrice = 1000000;
    const gasLimit = 200000; // adjust the gas limit as needed
    const weiPrice = price;
    return this.contract.methods.buyone(productId, weiPrice)
    .send({ from: this.currentAccount, value: weiPrice, gas: gasLimit, gasPrice })
    .then((t: any) => {
      console.log(t);
      return t;
    });
  }

}
