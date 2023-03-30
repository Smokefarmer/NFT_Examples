import "./Lib.sol";

contract Vulnerable {
    address public owner;
    Lib public lib;

    mapping(address => uint) public balances;

    constructor(Lib _lib) {
        owner = msg.sender;
        lib = Lib(_lib);
    }

    fallback() external payable {
        address(lib).delegatecall(msg.data);
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed to send Ether");

        balances[msg.sender] = 0;
    }

    function withdrawAll() public {
        require(owner == msg.sender, "Not the owner of the contract");

        (bool success,) = owner.call{value: address(this).balance}("");
        require(success, "Transfer failed!");
    }

}