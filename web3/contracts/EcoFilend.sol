// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract EcoFilend is FunctionsClient, OwnerIsCreator {
    //ChainLinkFunctionsSetup
    using FunctionsRequest for FunctionsRequest.Request;
    bytes32 public donId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    string source;
    FunctionsRequest.Location secretsLocation;
    bytes encryptedSecretsReference;
    bytes[] bytesArgs;
    uint64 subscriptionId;
    uint32 callbackGasLimit;
    mapping(uint256 => bytes32) public projectToResponse;

    //CCIPSETUP
    address c_router;
    address c_link;
    IRouterClient router;
    LinkTokenInterface linkToken;
    uint64 destinationChainSelector;
    address token;
    address stakeCertMinter;
    mapping(uint64 => bool) public whitelistedChains;
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error DestinationChainNotWhitelisted(uint64 destinationChainSelector);
    error NothingToWithdraw();
    event TokensTransferred(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        address token,
        uint256 tokenAmount,
        address feeToken,
        uint256 fees
    );

    constructor(
        address _router,
        address _link,
        address _token,
        uint64 _destinationChainSelector,
        address f_router,
        string memory _source,
        bytes memory _encryptedSecretsReference,
        bytes[] memory _bytesArgs,
        uint64 _subscriptionId,
        address _stakeCertMinter
    ) FunctionsClient(f_router) {
        c_router = _router;
        c_link = _link;
        LinkTokenInterface(_link).approve(_router, type(uint256).max);
        router = IRouterClient(_router);
        linkToken = LinkTokenInterface(_link);
        token = _token;
        destinationChainSelector = _destinationChainSelector;
        source = _source;
        donId = "fun-avalanche-fuji-1";
        secretsLocation = FunctionsRequest.Location.DONHosted;
        callbackGasLimit = 300000;
        encryptedSecretsReference = _encryptedSecretsReference;
        bytesArgs = _bytesArgs;
        subscriptionId = _subscriptionId;
        stakeCertMinter = _stakeCertMinter;
    }

    receive() external payable {}

    //ECOFILENDSETUP

    struct GrantReceiver {
        address owner;
        string name;
        uint256 projectId;
        string city;
        string state;
        string country;
        string image;
        uint256 totalReceived;
        uint256 stakePower;
        uint256 pollutionIndex;
        uint256 oldpollutionIndex;
        bytes32 latestReqId;
    }

    //Mapping of requestId to grantReceiver
    mapping(bytes32 => GrantReceiver) public requests;
    //This is the quota that is awarded per unit difference of the previous pollution index
    uint256 grantQuota = 1000000000000000;

    event grantSuccess(string project);

    mapping(uint256 => mapping(address => uint256)) public projectStakes;
    mapping(uint256 => GrantReceiver) public grantreceiversdisplay;
    uint256 public numberOfReceivers;
    uint256 id;
    struct granteesList {
        string name;
    }

    function register(
        string memory _name,
        address _receiveraddress,
        string memory _city,
        string memory _state,
        string memory _country,
        string memory _image
    ) public {
        GrantReceiver storage grantReceiverCreate = grantreceiversdisplay[
            numberOfReceivers
        ];
        grantReceiverCreate.projectId = numberOfReceivers++;
        grantReceiverCreate.name = _name;
        grantReceiverCreate.owner = _receiveraddress;
        grantReceiverCreate.city = _city;
        grantReceiverCreate.state = _state;
        grantReceiverCreate.country = _country;
        grantReceiverCreate.image = _image;
        grantreceiversdisplay[id] = grantReceiverCreate;
    }

    //CHAINLINKFUNCTIONS
    function _sendRequest(
        uint256 _projectId
    ) public returns (bytes32 requestId) {
        GrantReceiver memory grantReceiver = grantreceiversdisplay[_projectId];
        string[] memory args = new string[](3);
        args[0] = grantReceiver.city;
        args[1] = grantReceiver.state;
        args[2] = grantReceiver.country;
        FunctionsRequest.Request memory req;
        req.setArgs(args);
        req.initializeRequestForInlineJavaScript(source);
        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            callbackGasLimit,
            donId
        );
        requests[requestId] = grantReceiver;
        grantReceiver.latestReqId = requestId;
        return requestId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        s_lastResponse = response;
        s_lastError = err;
    }

    function _processResponse(
        uint256 projectId
    ) public view returns (uint256 index) {
        GrantReceiver memory grantReceiver = grantreceiversdisplay[projectId];
        grantReceiver.oldpollutionIndex = grantReceiver.pollutionIndex;
        grantReceiver.pollutionIndex = abi.decode(s_lastResponse, (uint256));
        return grantReceiver.pollutionIndex;
    }

    //CCIPFUNCTIONS
    mapping(uint64 => bool) public allowlistedChains;
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.

    modifier onlyAllowlistedChain(uint64 _destinationChainSelector) {
        if (!allowlistedChains[_destinationChainSelector])
            revert DestinationChainNotAllowlisted(_destinationChainSelector);
        _;
    }

    function allowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedChains[_destinationChainSelector] = allowed;
    }

    function transferTokensPayLINK(
        uint256 projectId,
        uint64 _destinationChainSelector,
        address _receiver,
        uint256 _amount
    )
        public
        onlyOwner
        onlyAllowlistedChain(_destinationChainSelector)
        returns (bytes32 messageId)
    {
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            token,
            _amount,
            address(linkToken)
        );

        uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

        if (fees > linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(linkToken.balanceOf(address(this)), fees);

        linkToken.approve(address(router), fees);

        IERC20(token).approve(address(router), _amount);

        messageId = router.ccipSend(_destinationChainSelector, evm2AnyMessage);

        emit TokensTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            token,
            _amount,
            address(linkToken),
            fees
        );

        return messageId;
    }

    function _buildCCIPMessage(
        address _receiver,
        address _token,
        uint256 _amount,
        address _feeTokenAddress
    ) internal pure returns (Client.EVM2AnyMessage memory) {
        // Set the token amounts
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });

        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(_receiver), // ABI-encoded receiver address
                data: "", // No data
                tokenAmounts: tokenAmounts, // The amount and type of token being transferred
                extraArgs: Client._argsToBytes(
                    // Additional arguments, setting gas limit to 0 as we are not sending any data and non-strict sequencing mode
                    Client.EVMExtraArgsV1({gasLimit: 0, strict: false})
                ),
                // Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
                feeToken: _feeTokenAddress
            });
    }

    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));

        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).transfer(_beneficiary, amount);
    }

    function stakeTokensForProject(uint256 projectId) public payable {
        GrantReceiver memory grantReceiver = grantreceiversdisplay[projectId];

        address staker = msg.sender;
        (bool callSuccess, ) = payable(grantReceiver.owner).call{
            value: msg.value
        }("");
        require(callSuccess, "Call failed");
        grantReceiver.stakePower += msg.value;
        projectStakes[projectId][staker] += msg.value;
    }

    //mints CROSSCHAIN NFT (Staking Certificate)
    event MessageSent(bytes32 messageId);

    function mint(uint256 projectId) public returns (bytes32) {
        require(projectStakes[projectId][msg.sender] > 0, "No Stakes Made");
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(stakeCertMinter),
            data: abi.encodeWithSignature("mint(address)", msg.sender),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 200_000, strict: false})
            ),
            feeToken: c_link
        });

        bytes32 messageId;

        messageId = IRouterClient(c_router).ccipSend(
            destinationChainSelector,
            message
        );

        emit MessageSent(messageId);
        return messageId;
    }

    function getReceivers() public view returns (GrantReceiver[] memory) {
        GrantReceiver[] memory allreceivers = new GrantReceiver[](
            numberOfReceivers
        );

        for (uint i = 0; i < numberOfReceivers; i++) {
            GrantReceiver storage item = grantreceiversdisplay[i];
            allreceivers[i] = item;
        }
        return (allreceivers);
    }

    function getTotalReceived(uint256 _id) public view returns (uint256) {
        GrantReceiver memory grantReceiver = grantreceiversdisplay[_id];
        uint256 totalReceived = grantReceiver.totalReceived;
        return totalReceived;
    }
}
