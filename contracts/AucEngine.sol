// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract AucEngine {
    address public owner;
    uint constant DURATION = 2 days;
    uint constant FEE = 10;

    struct Auction {
        address payable seller;
        uint startingPrice;
        uint finalPrice;
        uint startAt;
        uint endsAt;
        uint discountRate;
        string item;
        bool stopped;

    }

    Auction[] public auctions;

    event AuctionCreated(uint index, string itemName, uint startingPrice,uint duration);
    event AuctionEnded(uint index,uint price, address winner);
    constructor() {
        owner= msg.sender;
    }
    function getAuctions() public view returns(Auction[] memory)  {
        return auctions;
    }
    function createAuction(uint _startingPrice, uint _discountRate, string calldata _item, uint _duration ) external {
        uint duration = _duration == 0 ? DURATION : _duration;
        
        require(_startingPrice >= _discountRate * duration,"incorrect Price!");
        Auction memory newAuction = Auction(
            {
                seller : payable(msg.sender),
                startingPrice : _startingPrice,
                finalPrice : _startingPrice,
                startAt : block.timestamp,
                endsAt : block.timestamp + duration,
                discountRate : _discountRate,
                item : _item,
                stopped : false
            }
            

        );
        auctions.push(newAuction);

        emit AuctionCreated(auctions.length - 1,_item, _startingPrice,duration);

    }

    function getPrice(uint index) public view returns(uint) {
        Auction memory currentAuc = auctions[index];
        require(!currentAuc.stopped, 'auc has been stopped!');

        uint elapsed = block.timestamp - currentAuc.startAt;
        uint discount = currentAuc.discountRate * elapsed;
        return currentAuc.startingPrice - discount;

    } 

    function buy(uint index) external payable {
        Auction storage cAuc = auctions[index];
        require(!cAuc.stopped, "stopped!");
        require(block.timestamp < cAuc.endsAt, "ended!");
        uint cPrice = getPrice(index);
        require(msg.value >= cPrice, 'not enough funds');
        cAuc.stopped = true;
        cAuc.finalPrice =cPrice;
        uint refund = msg.value - cPrice;
        if(refund > 0) {
            payable (msg.sender).transfer(refund);
        }
        cAuc.seller.transfer(
            cPrice - ((cPrice * FEE) / 100)
        );
        emit AuctionEnded(index,cPrice,msg.sender);
    }
}