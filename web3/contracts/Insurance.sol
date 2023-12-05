//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {EcoFilend} from "./EcoFilend.sol";

contract Insurance {
    //mints CROSSCHAIN NFT (Staking Certificate)
    event MessageSent(bytes32 messageId);

    function mint(address receiver, address staker) internal {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encodeWithSignature("mint(address)", staker),
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
}
