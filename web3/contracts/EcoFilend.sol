// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract EcoFilend is OwnerIsCreator {
    IRouterClient router;
    LinkTokenInterface linkToken;

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

    constructor(address _router, address _link) {
        router = IRouterClient(_router);
        linkToken = LinkTokenInterface(_link);
    }

    function transferTokens(
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    ) internal onlyOwner returns (bytes32 messageId) {
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({
            token: _token,
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
        uint256 fees = router.getFee(_destinationChainSelector, message);

        if (fees > linkToken.balanceOf(address(this)))
            revert NotEnoughBalance(linkToken.balanceOf(address(this)), fees);

        // Approve Router to spend CCIP-BnM tokens we send
        IERC20(_token).approve(address(router), _amount);

        // Send CCIP Message
        messageId = router.ccipSend(_destinationChainSelector, message);

        emit TokensTransferred(
            messageId,
            _destinationChainSelector,
            _receiver,
            _token,
            _amount,
            address(linkToken),
            fees
        );
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

    struct GrantReceiver {
        address owner;
        string name;
        uint256 projectId;
        address receiveraddress;
        string location;
        string image;
        uint256 totalReceived;
        uint256 stakePower;
    }
    // Mapping to track insurance funds per project
    mapping(uint256 => uint256) public projectInsurancePools;

    // Define conditions for insurance payout per project
    mapping(uint256 => bool) public projectFailed;

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
        string memory _location,
        string memory _image
    ) private {
        GrantReceiver memory grantReceiver;
        id++;
        grantReceiver.projectId = id;
        grantReceiver.name = _name;
        grantReceiver.owner = msg.sender;
        grantReceiver.receiveraddress = _receiveraddress;
        grantReceiver.location = _location;
        grantReceiver.image = _image;
        grantreceivers[_name] = grantReceiver;
        grantreceiversdisplay[id] = grantReceiver;
        grantTracker[_receiveraddress] = grantReceiver;
    }

    function grant(
        uint256 _projectId,
        string memory _location,
        uint64 _destinationChainSelector,
        address _receiver,
        address _token,
        uint256 _amount
    ) public {
        GrantReceiver memory grantReceiver = grantreceiversdisplay[_projectId];
        grantReceiver.totalReceived += _amount;
        locationTracker(_location);
        transferTokens(_destinationChainSelector, _receiver, _token, _amount);
    }

    // function drip(address to) external {
    //     _mint(to, 1e18);
    // }

    function locationTracker(string memory _location) private {}

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

    function getReceiverBalance(uint256 _id) public view returns (uint256) {
        GrantReceiver memory grantReceiver = grantreceiversdisplay[_id];
        uint256 balance = grantReceiver.totalReceived;
        return balance;
    }

    function stakeTokensForProject(
        uint256 projectId,
        uint256 _amount
    ) public payable {
        GrantReceiver memory grantReceiver = grantreceiversdisplay[projectId];
        address staker = msg.sender;
        uint256 insurance = (_amount * 10) / 100;
        uint256 amount = _amount - insurance;
        (bool callSuccess, ) = payable(grantReceiver.owner).call{value: amount}(
            ""
        );
        require(callSuccess, "Call Failed");
        grantReceiver.totalReceived += amount;
        projectStakes[projectId][staker] += amount;
        contributeToInsurancePool(projectId, insurance);
    }

    // Function for stakeholders to contribute to a project's insurance pool
    function contributeToInsurancePool(
        uint256 projectId,
        uint256 insurance
    ) public payable {
        // Update projectInsurancePools mapping with the contribution
        projectInsurancePools[projectId] = insurance;
        (bool callSuccess, ) = payable(address(this)).call{value: insurance}(
            ""
        );
        require(callSuccess, "Call Failed");
    }

    // Function to trigger insurance payouts based on project conditions
    function triggerInsurancePayout(uint256 projectId) public {
        require(
            projectFailed[projectId],
            "Project hasn't failed or met criteria"
        );
        // Calculate payout based on stakes in the project's insurance pool
        uint256 totalInsurance = projectInsurancePools[projectId];
        uint256 totalStake = projectStakes[projectId][msg.sender];
        uint256 payout = totalStake;

        // Distribute the compensation to stakeholders
        (bool callSuccess, ) = payable(msg.sender).call{value: payout}("");
        require(callSuccess, "Call Failed");
        //Updates Insurance and Stake
        projectInsurancePools[projectId] = totalInsurance - payout;
        projectStakes[projectId][msg.sender] = 0;
    }

    // Function to update project status (e.g., if it fails to meet certain conditions)
    function updateProjectStatus(uint256 projectId, bool isFailed) public {
        projectFailed[projectId] = isFailed;
    }
}
