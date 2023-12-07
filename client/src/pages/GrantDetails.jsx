import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton } from '../components';
import { profile } from '../assets';


const GrantDetails = () => {
    const { state } = useLocation();
    const { makeStake, _sendRequest, _processResponse, transferTokensPayLINK, contract, address } = useStateContext()
    const [isLoading, setIsLoading] = useState(false);
    const [stake, setStake] = useState([]);
    console.log(state);
    // useEffect(() => {
    //     if (contract) fetchResults();
    // }, [contract, address])

    const handleStake = async () => {
        setIsLoading(true);
        await makeStake(state.projectId, stake)
        setIsLoading(false);
    }

    const handleRequest = async () => {
        setIsLoading(true);
        await _sendRequest(state.projectId);
        setIsLoading(false);
    }

    const handleResponse = async () => {
        setIsLoading(true);
        await _processResponse(state.projectId);
        setIsLoading(false)
    }

    const handleTransfer = async () => {
        setIsLoading(true);
        await transferTokensPayLINK(state.projectId);
        setIsLoading(false);
    }

    return (
        <div>
            {isLoading && 'Loading...'}
            <div className="w-full flex md:flex-row flex-col mt-10
            gap-[30px]">
                <div className="flex-1 flex-col">
                    <img src={state.image} alt="grant" className="w-full 
                    h-[410px] object-cover rounded-xl"/>
                    <div className="relative w-full h-[5px] bg-[#3a3a43]">
                    </div>
                </div>
            </div>
            <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
                <div className="flex-[2] flex flex-col gap-[40px]">
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
                            {state.name}
                        </h4>
                        <div className="flex flex-row items-center flex-wrap gap-[18px]">
                            <h4 className="font-epilogue font-semibold text-[14px] bg-green-200 rounded-md p-1 break-all">{state.city}</h4>
                            <h4 className="font-epilogue font-semibold text-[14px] bg-green-200 rounded-md p-1 break-all">{state.country}</h4>
                        </div>
                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[18px]">
                            <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                                <img src={profile} alt="user" className="w-[60%] h-[60%] object-contain" />
                            </div>
                            <div>
                                <h4 className="font-epilogue font-semibold text-[14px] bg-green-200 rounded-md p-1 break-all">Grant Account - {state.owner}</h4>
                                <h4 className="font-epilogue font-semibold text-[14px] bg-green-200 rounded-md p-1 break-all">Grant Received - {state.totalReceived}</h4>
                                <h4 className="font-epilogue font-semibold text-[14px] bg-green-200 rounded-md p-1 break-all">Stake-Power - {state.stakePower}</h4>
                                <h4 className="font-epilogue font-semibold text-[14px] bg-green-200 rounded-md p-1 break-all">Current Pollution Index - {state.pollutionIndex}</h4>
                            </div>

                        </div>
                    </div>
                    <div className="flex-1 mt-[20px]">
                        <h4 className="font-epilogue font-semibold text-[18px] 
                         text-black uppercase">
                            Stake To Earn Governance Rights
                        </h4>
                        <div className="my-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
                            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
                                Make Stake
                            </p>
                            <div className="mt-[30px]">
                                <input
                                    type="text"
                                    placeholder="Enter Token Amount"
                                    className="w-full bg-transparent rounded-[10px] border border-grey py-2 px-4 text-white 
                                        placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-600 
                                        placeholder-opacity-50"
                                    value={stake}
                                    onChange={(e) => setStake(e.target.value)}
                                />
                            </div>
                            <div className="my-[20px]">
                                <CustomButton
                                    btnType="button"
                                    title="STAKE"
                                    styles="w-full bg-[#8c6dfd]"
                                    handleClick={handleStake}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default GrantDetails