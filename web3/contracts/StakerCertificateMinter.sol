// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract SourceMinter {
    address i_router;
    address i_link;

    event MessageSent(bytes32 messageId);
    uint64 destinationChainSelector;
    address receiver;

    constructor(address router, address link) {
        i_router = router;
        i_link = link;
        LinkTokenInterface(i_link).approve(i_router, type(uint256).max);
        destinationChainSelector = 16015286601757825753;
        receiver = 0x1FF263E7Ce2d42384Da9996173C258277cF82464;
    }

    receive() external payable {}

    function mint() external {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encodeWithSignature("mint(address)", msg.sender),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: i_link
        });

        bytes32 messageId;

        messageId = IRouterClient(i_router).ccipSend(
            destinationChainSelector,
            message
        );

        emit MessageSent(messageId);
    }
}
