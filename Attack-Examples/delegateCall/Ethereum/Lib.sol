contract Lib {
    address public owner;

    function setowner() public {
        owner = msg.sender;
    }
}