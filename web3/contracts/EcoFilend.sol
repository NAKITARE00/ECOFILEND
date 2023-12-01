// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract EcoFilend is FunctionsClient, ConfirmedOwner {
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

    //CCIPSETUP
    IRouterClient router;
    LinkTokenInterface linkToken;
    uint64 destinationChainSelector;
    address token;

    mapping(uint64 => bool) public whitelistedChains;

    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error DestinationChainNotWhitelisted(uint64 destinationChainSelector);
    error NothingToWithdraw();

    event TokensTransferred(
        bytes32 indexed messageId, // The unique ID of the message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        address token, // The token address that was transferred.
        uint256 tokenAmount, // The token amount that was transferred.
        address feeToken, // the token address used to pay CCIP fees.
        uint256 fees // The fees paid for sending the message.
    );

    constructor(
        address _router,
        address _link,
        address _token,
        uint64 _destinationChainSelector,
        address f_router,
        bytes32 _donId,
        string memory _source,
        FunctionsRequest.Location _secretsLocation,
        bytes memory _encryptedSecretsReference,
        bytes[] memory _bytesArgs,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit
    ) FunctionsClient(f_router) ConfirmedOwner(msg.sender) {
        router = IRouterClient(_router);
        linkToken = LinkTokenInterface(_link);
        LinkTokenInterface(_link).approve(_router, type(uint256).max);
        donId = _donId;
        token = _token;
        destinationChainSelector = _destinationChainSelector;
        source = _source;
        secretsLocation = _secretsLocation;
        encryptedSecretsReference = _encryptedSecretsReference;
        bytesArgs = _bytesArgs;
        subscriptionId = _subscriptionId;
        callbackGasLimit = _callbackGasLimit;
    }

    //CHAINLINKFUNCTIONS

    function setDonId(bytes32 newDonId) external onlyOwner {
        donId = newDonId;
    }

    function _sendRequest(
        string[] memory args
    ) internal returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequest(
            FunctionsRequest.Location.Inline,
            FunctionsRequest.CodeLanguage.JavaScript,
            source
        );

        if (args.length > 0) {
            req.setArgs(args);
        }

        if (bytesArgs.length > 0) {
            req.setBytesArgs(bytesArgs);
        }

        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            callbackGasLimit,
            donId
        );
        return requestId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        s_lastResponse = response;
        s_lastError = err;
        grantProcessor(requestId, response);
    }

    //CCIPFUNCTIONS
    function transferTokens(
        address _receiver,
        uint256 _amount
    ) internal returns (bytes32 messageId) {
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({
            token: token,
            amount: _amount
        });
        tokenAmounts[0] = tokenAmount;

        // Build the CCIP Message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: "",
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 0, strict: false})
            ),
            feeToken: address(linkToken)
        });

        // CCIP Fees Management
        uint256 fees = router.getFee(destinationChainSelector, message);

        if (fees > linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(linkToken.balanceOf(address(this)), fees);

        // Approve Router to spend CCIP-BnM tokens we send
        IERC20(token).approve(address(router), _amount);

        // Send CCIP Message
        messageId = router.ccipSend(destinationChainSelector, message);

        emit TokensTransferred(
            messageId,
            destinationChainSelector,
            _receiver,
            token,
            _amount,
            address(linkToken),
            fees
        );
    }

    //mints CROSSCHAIN NFT (Staking Certificate)
    event MessageSent(bytes32 messageId);

    function mint(address receiver) internal {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encodeWithSignature("mint(address)", msg.sender),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(linkToken)
        });

        uint256 fees = IRouterClient(router).getFee(
            destinationChainSelector,
            message
        );

        if (fees > linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(linkToken.balanceOf(address(this)), fees);
        bytes32 messageId;

        messageId = IRouterClient(router).ccipSend(
            destinationChainSelector,
            message
        );

        emit MessageSent(messageId);
    }

    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));

        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).transfer(_beneficiary, amount);
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
    }

    //Mapping of requestId to grantReceiver
    mapping(bytes32 => GrantReceiver) public requests;
    //This is the quota that is awarded per unit difference of the previous pollution index
    uint256 grantQuota = 1000000000000000;
    // Mapping to track insurance funds per project
    mapping(uint256 => uint256) public projectInsurancePools;

    // Define conditions for insurance payout per project
    // mapping(uint256 => bool) public projectFailed;
    event grantSuccess(string project);

    mapping(uint256 => mapping(address => uint256)) public projectStakes;

    mapping(string => GrantReceiver) public grantreceivers;
    mapping(address => GrantReceiver) public grantTracker;
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
    ) private {
        GrantReceiver memory grantReceiver;
        id++;
        grantReceiver.projectId = id;
        grantReceiver.name = _name;
        grantReceiver.owner = _receiveraddress;
        grantReceiver.city = _city;
        grantReceiver.state = _state;
        grantReceiver.country = _country;
        grantReceiver.image = _image;
        grantreceivers[_name] = grantReceiver;
        grantreceiversdisplay[id] = grantReceiver;
        grantTracker[_receiveraddress] = grantReceiver;
    }

    function grantRequest(uint256 _projectId) public {
        GrantReceiver memory grantReceiver = grantreceiversdisplay[_projectId];
        string[] memory args = new string[](3);
        args[0] = grantReceiver.city;
        args[1] = grantReceiver.state;
        args[2] = grantReceiver.country;
        bytes32 requestId = _sendRequest(args);
        requests[requestId] = grantReceiver;
    }

    function grantProcessor(bytes32 requestId, bytes memory response) internal {
        string memory pollutionIndex = string(response);
        (uint256 index, bool istrue) = strToUint(pollutionIndex);
        GrantReceiver memory grantReceiver = requests[requestId];
        uint256 currentIndex = grantReceiver.pollutionIndex;
        if (index < currentIndex) {
            uint256 amount = (currentIndex - index) * grantQuota;
            transferTokens(grantReceiver.owner, amount);
            grantReceiver.totalReceived += amount;
            grantReceiver.pollutionIndex = index;
        }

        emit grantSuccess(grantReceiver.name);
    }

    function strToUint(
        string memory _str
    ) internal pure returns (uint256 res, bool err) {
        for (uint256 i = 0; i < bytes(_str).length; i++) {
            if (
                (uint8(bytes(_str)[i]) - 48) < 0 ||
                (uint8(bytes(_str)[i]) - 48) > 9
            ) {
                return (0, false);
            }
            res +=
                (uint8(bytes(_str)[i]) - 48) *
                10 ** (bytes(_str).length - i - 1);
        }

        return (res, true);
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

    function stakeTokensForProject(
        uint256 projectId,
        uint256 _amount
    ) public payable {
        GrantReceiver memory grantReceiver = grantreceiversdisplay[projectId];

        address staker = msg.sender;
        uint256 insurance = (_amount * 25) / 100;
        uint256 amount = _amount - insurance;
        (bool callSuccess, ) = payable(address(this)).call{value: _amount}("");
        require(callSuccess, "Call Failed");

        transferTokens(grantReceiver.owner, amount);
        projectInsurancePools[projectId] += insurance;
        grantReceiver.totalReceived += amount;
        projectStakes[projectId][staker] += amount;
    }

    // Function to trigger insurance payouts based on project conditions
    function triggerInsurancePayout(uint256 projectId) public {
        // require(
        //     projectFailed[projectId],
        //     "Project hasn't failed or met criteria"
        // );

        // Calculate payout based on stakes in the project's insurance pool
        address staker = msg.sender;
        uint256 totalInsurance = projectInsurancePools[projectId];
        uint256 totalStake = projectStakes[projectId][staker];
        uint256 payout = (totalStake * 25) / 100;
        transferTokens(staker, payout);
        //Updates Insurance
        projectInsurancePools[projectId] = totalInsurance - payout;
    }
}
