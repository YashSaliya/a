pragma solidity ^0.8.0;

contract ProvenanceTracking {

  struct OrderDetail{
    address prevOwner;
    address newOwner;
    uint price;
  }

  struct OrderLedger{
    OrderDetail[] orderdetails;
  }


  struct User{
    string firstname;
    string lastname;
    string desc; 
    mapping(uint256 => uint) hold;

  }


  
  mapping(address => User) public users; 

  // Struct to store the details of a luxury good
  struct LuxuryGood {
    uint256 productId;
    string url;
    string name;
    address manufacturer;
    mapping(uint => OrderDetail[]) ledgers; 
    uint totalSupply; 
  }

  mapping(uint256 => LuxuryGood) public luxuryGoods;

  uint[] public keysluxuryGoods;

  struct Manufacturer{
    string name;
    string desc; 
  }

  mapping(address => Manufacturer) public manufacturers;
 
  struct BuyItem{
    uint256 productId;
    string url;
    string name;
    address manufacturer;
    string desc; 
    uint price;
  }


  // Function to add a new luxury good to the blockchainx
  function createByManufacturer(uint256 productId,uint256 quantity, string memory url ,string memory name, address manufacturer) public {
    LuxuryGood storage newGood = luxuryGoods[productId];
    newGood.productId = productId;
    newGood.url = url;
    newGood.name = name;
    newGood.manufacturer = manufacturer;
    newGood.totalSupply += quantity; 
    User storage user = users[manufacturer];
    if(user.hold[productId] != 0){
      for(uint i = user.hold[productId] ; i < user.hold[productId] + quantity ; i++){
        newGood.ledgers[i].push(OrderDetail(manufacturer,manufacturer,0));
      }
      user.hold[productId] = user.hold[productId] + quantity;
    }
    else{
      user.hold[productId] = quantity;
      for(uint i = 0 ; i < user.hold[productId] ; i++){
        newGood.ledgers[i].push(OrderDetail(manufacturer,manufacturer,0));
      }
      keysluxuryGoods.push(productId);
    }
  
  }


  function addToSell(uint256 productId, uint256 quantity,uint price) public{
    require(users[msg.sender].hold[productId] >= quantity , "You have insufficient funds to proceed with the transaction ! ");
    LuxuryGood storage good = luxuryGoods[productId];
    uint counter = 0; 
    for(uint i= 0 ; i < good.totalSupply ; i++ ){
      if(counter > quantity){
        break;
      }
      OrderDetail[] memory od = good.ledgers[i];
      if(od[od.length - 1].newOwner == msg.sender){
        good.ledgers[i].push(OrderDetail(msg.sender,0x0000000000000000000000000000000000000000,price));
        counter++;
      }
    }
    users[msg.sender].hold[productId] -= quantity;
  }


  // function viewStock() public view returns(BuyItem[] memory){
  //   BuyItem[] memory res; 
  //   for(uint i = 0 ; i < keysluxuryGoods.length ; i++){
  //     LuxuryGood storage good =luxuryGoods[keysluxuryGoods[i]];
  //     uint qty = good.totalSupply;
  //     for(uint j = 0 ; j < qty ; j ++){
  //       OrderDetail[] memory od = good.ledgers[i];
  //       if(od[od.length -1].newOwner == 0x0000000000000000000000000000000000000000){
  //         res.push(BuyItem(good.productId,good.url,good.name,good.manufacturer,users[good.manufacturer].desc,od[od.length - 1].price));
  //       }

  //     }

  //   }
  //   return res;

  // }

  function viewStock() public view returns (BuyItem[] memory) {
    uint itemCount = 0;
    for (uint i = 0; i < keysluxuryGoods.length; i++) {
        LuxuryGood storage good = luxuryGoods[keysluxuryGoods[i]];
        uint qty = good.totalSupply;
        for (uint j = 0; j < qty; j++) {
            OrderDetail[] memory od = good.ledgers[j];
            if (od[od.length - 1].newOwner == address(0)) {
                itemCount++;
            }
        }
    }

    BuyItem[] memory res = new BuyItem[](itemCount);
    itemCount = 0;
    for (uint i = 0; i < keysluxuryGoods.length; i++) {
        LuxuryGood storage good = luxuryGoods[keysluxuryGoods[i]];
        uint qty = good.totalSupply;
        for (uint j = 0; j < qty; j++) {
            OrderDetail[] memory od = good.ledgers[j];
            if (od[od.length - 1].newOwner == address(0)) {
                res[itemCount] = BuyItem(good.productId, good.url, good.name, od[od.length - 1].prevOwner, users[od[od.length - 1].prevOwner].desc, od[od.length - 1].price);
                itemCount++;
            }
        }
    }

    return res;
}


  // function buy(uint productId , uint256 quantity) public payable{
  //   uint itemCount = 0;
  //   bool isSufficient = false;
  //   uint price = 0 ;
  //   LuxuryGood storage good = luxuryGoods[productId];
  //   for(uint i = 0 ; i < good.totalSupply ; i++){
  //     if(itemCount > quantity ){
  //       isSufficient = true;
  //       break;
  //     }
  //     OrderDetail[] memory od = good.ledgers[i];
  //     if(od[od.length - 1].newOwner == address(0)){
  //       itemCount += 1;
  //     }
  //   }


  //   require(isSufficient == true , "Not sufficient quantity available in the market !");



  // }

  function buyone(uint productId, address payable prevOwner , uint price) public payable{
    require(msg.value > price, " Not enough credentials");
    LuxuryGood storage good = luxuryGoods[productId];
    for(uint i = 0 ; i < good.totalSupply ; i++){
      OrderDetail[] memory od = good.ledgers[i];
      if(od[od.length - 1].prevOwner == prevOwner && od[od.length - 1].price == price && od[od.length - 1].newOwner == address(0)){
        good.ledgers[i].push(OrderDetail(prevOwner,msg.sender,price));
        prevOwner.transfer(price);
        address payable sendermsg = payable(msg.sender);
        sendermsg.transfer(msg.value - price);
        break;
      }
    }
    
  }

  function buy(uint productId, uint256 quantity) public {
      uint itemCount = 0;
      bool isSufficient = false;
      uint price = 0;
      LuxuryGood storage good = luxuryGoods[productId];
      OrderDetail[] memory heapArray = new OrderDetail[](good.totalSupply);

      // Populate heapArray with valid order details
      for (uint i = 0; i < good.totalSupply; i++) {
          OrderDetail[] memory od = good.ledgers[i];
          if (od[od.length - 1].newOwner == address(0)) {
              heapArray[itemCount] = od[od.length - 1];
              itemCount += 1;
          }
      }

      require(itemCount >= quantity, "Not sufficient quantity available in the market!");

      // Build heap using heapArray
      for (uint i = itemCount / 2; i > 0; i--) {
          uint k = i - 1;
          uint j = 2 * i - 1;
          while (j < itemCount) {
              if (j + 1 < itemCount && heapArray[j + 1].price < heapArray[j].price) {
                  j++;
              }
              if (heapArray[k].price <= heapArray[j].price) {
                  break;
              }
              OrderDetail memory temp = heapArray[k];
              heapArray[k] = heapArray[j];
              heapArray[j] = temp;
              k = j;
              j = 2 * k + 1;
          }
      }

      // Return sorted OrderDetail array

  }





  // function addLuxuryGood(uint256 productId, string memory name, address manufacturer, address owner,uint price) public {
  //   LuxuryGood storage newGood = luxuryGoods[productId];

  // }

  // // Function to record the transfer of a luxury good to a new owner
  // function transferOwnership(uint256 productId, address newOwner) public {
  //   LuxuryGood storage good = luxuryGoods[productId];
  //   require(good.owner == msg.sender, "You are not the current owner of this luxury good");
  //   // require(good.owner != newOwner , "You already own this good ! ");
  //   LinkBlock memory lb = LinkBlock(good.owner,newOwner,block.timestamp); 
  //   good.owner = newOwner;
  //   good.linkblocks.push(lb);
  //   // good.history.push(block.timestamp);
  // }

  // // Function to get the history of a luxury good
  // function getLuxuryGoodHistory(uint256 productId) public view returns (LinkBlock[] memory) {
  //   return luxuryGoods[productId].linkblocks; 
  // }

}
