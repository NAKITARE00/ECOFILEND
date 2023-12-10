import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import EcoFilend from '../contracts/EcoFilend.json';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0x191074b05fc2487A42542d51439B2C5cfbF3daC8', EcoFilend.abi);
    const { mutateAsync: register } = useContractWrite(contract, 'register');
    const { mutateAsync: _sendRequest } = useContractWrite(contract, '_sendRequest');
    const { mutateAsync: _processResponse } = useContractWrite(contract, '_processResponse');
    const { mutateAsync: transferTokensPayLINK } = useContractWrite(contract, 'transferTokensPayLINK');
    const { mutateAsync: mint } = useContractWrite(contract, 'mint');
    const address = useAddress();
    const connect = useMetamask();

    const publishRegistration = async (_name, _receiveraddress, _city, _state, _country, _image) => {
        try {
            const data = await register({
                args: [
                    _name,
                    _receiveraddress,
                    _city,
                    _state, _country, _image
                ]
            })
            console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failed", error)
        }
    }

    const publishRequest = async (_projectId) => {
        try {
            const data = await _sendRequest({
                args: [
                    _projectId
                ]
            })
            console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failed", error)
        }
    }

    const publishMint = async (projectId) => {
        try {
            const data = await mint({
                args: [
                    projectId
                ]
            })
            console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failed", error)
        }
    }

    const publishProccessGrant = async (projectId) => {
        try {
            const data = await _processResponse({
                args:
                    [
                        projectId
                    ]
            })
            console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failed", error)
        }
    }

    const publishTokenTransfer = async (projectId, _destinationChainSelector) => {
        try {
            const data = await transferTokensPayLINK({
                args: [
                    projectId,
                    _destinationChainSelector
                ]
            })
            console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failed", error)
        }
    }

    const makeStake = async (_projectId, stake) => {

        const data = await contract.call('stakeTokensForProject', [_projectId], {
            value: ethers.utils.parseEther
                (stake)
        });

        return data;
    }

    const getReceivers = async () => {
        const receivers = await contract.call
            ('getReceivers');

        const parsedReceivers = receivers.map((receiver, i) => ({
            owner: receiver.owner,
            name: receiver.name,
            projectId: receiver.projectId,
            city: receiver.city,
            state: receiver.state,
            country: receiver.country,
            image: receiver.image,
            totalReceived: ethers.utils.formatEther(receiver.totalReceived.toString()),
            stakePower: ethers.utils.formatEther(receiver.stakePower.toString()),
            pollutionIndex: receiver.pollutionIndex.toString(),
            pId: i
        }));
        return (parsedReceivers);
    }

    const getUserGrants = async () => {
        const allReceivers = await getReceivers();

        const filteredReceivers = allReceivers.filter((receiver) =>
            receiver.owner === address);
        return filteredReceivers;

    }

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                register: publishRegistration,
                _sendRequest: publishRequest,
                _processResponse: publishProccessGrant,
                transferTokensPayLINK: publishTokenTransfer,
                mint: publishMint,
                makeStake,
                getReceivers,
                getUserGrants
            }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);

