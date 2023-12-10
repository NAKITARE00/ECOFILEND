import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton } from '../components';
import { profile } from '../assets';


const GrantDetails = () => {

    const { state } = useLocation();
    const { makeStake, _sendRequest, mint, _processResponse, transferTokensPayLINK,
        address } = useStateContext()
    const [isLoading, setIsLoading] = useState(false);
    console.log('Contract:', contract);
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

    const handleMint = async () => {
        setIsLoading(true);
        await mint(state.projectId)
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
        await transferTokensPayLINK(state.projectId, "16015286601757825753");
        setIsLoading(false);
    }

    return (
        <div className="w-[90%]">
            {isLoading && 'Loading...'}
            <div className="w-full flex md:flex-row flex-col mt-10
            gap-[30px]">
                <div className="flex-1 flex-col">
                    <img src={state.image} alt="grant" className="w-full 
                    h-[410px] object-cover rounded-xl"/>
                    <div className="relative w-full h-[5px] bg-[#4acd8d]">
                    </div>
                </div>
            </div>
            <div className="mt-[60px] flex lg:flex-row gap-5">
                <div className="flex-[2] flex flex-col gap-[40px]">
                    <div className='w-[80%]'>
                        <h4 className="font-epilogue font-bold text-[18px] text-black uppercase">
                            {state.name}
                        </h4>
                        <div className="flex flex-row items-center flex-wrap gap-[18px]">
                            <h4 className="font-epilogue font-semibold text-[14px] bg-[#4acd8d] rounded-md p-1 break-all">{state.city}</h4>
                            <h4 className="font-epilogue font-semibold text-[14px] bg-[#4acd8d] rounded-md p-1 break-all">{state.country}</h4>
                        </div>
                        <div className="mt-[20px]  flex flex-row items-center flex-wrap gap-[18px]">
                            <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#4acd8d] cursor-pointer">
                                <img src={profile} alt="user" className="w-[60%] h-[60%] object-contain" />
                            </div>
                            <div className="bg-[#4acd8d] rounded-[10px] p-[10px]">
                                <h4 className="font-epilogue font-semibold text-[16px] rounded-md p-1 break-all">Grant Account: {state.owner}</h4>
                                <h4 className="font-epilogue font-semibold text-[16px] rounded-md p-1 break-all">Stake-Power: {state.stakePower}</h4>
                            </div>

                        </div>
                    </div>
                    <div className="flex-1 mt-[5px] w-[74%]">
                        <div className="my-[20px] flex flex-col p-4 bg-[] rounded-[10px] border-[3px] items-center border-[#4acd8d] ">
                            <div className="py-[1px] mt-[30px]">
                                <div className="mb-[50px]">
                                    <h4 className="font-epilogue font-bold text-[18px] 
                                    text-black uppercase"
                                    >
                                        Stake To Earn Governance Rights
                                    </h4>
                                </div>
                                <input
                                    type="text"
                                    placeholder="enter stake amount"
                                    className="w-[370px] height-[60px] flex rounded-[10px] border-[1px] border-[#4acd8d]
                                    font-epilogue font-normal text-[30px] sm:min-w-[300px]
                                    placeholder:text-[15px] placeholder:text-[grey] text-black text-center
                                    bg-transparent outline-none focus:outline-none focus:ring-2 
                                    focus:ring-purple-600 
                                    "
                                    value={stake}
                                    onChange={(e) => setStake(e.target.value)}
                                />
                            </div>
                            <div className="my-[20px] items-center">
                                <CustomButton
                                    btnType="button"
                                    title="Stake"
                                    styles="w-full bg-[#4acd8d]"
                                    handleClick={handleStake}
                                />

                                <div className="mt-[20px] justify-center">
                                    <CustomButton
                                        btnType="button"
                                        title="Mint Certificate"
                                        styles="w-50% bg-[#4acd8d]"
                                        handleClick={handleMint}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-[90%] flex-1 flex-col gap-5 justify-left'>
                    <div className="p-[20px] border-[3px] flex-col gap-5 rounded-[10px] items-center border-[#4acd8d] space-y-4
                    ">
                        <div>
                            <CustomButton
                                btnType="button"
                                title="Request Pollution Info"
                                styles="w-full bg-[#4acd8d]"
                                handleClick={handleRequest}
                            />
                        </div>
                        <div className="mt-[4]">
                            <CustomButton
                                btnType="button"
                                title="Process Request"
                                styles="w-full bg-[#4acd8d]"
                                handleClick={handleResponse}
                            />
                            <h4 className="font-epilogue font-bold text-[16px] rounded-md p-1 break-all">Current Pollution Index:</h4>
                            <h4 className="font-epilogue w-[10%] font-semibold text-[14px] text-center bg-[#4acd8d] rounded-md p-1 break-all">{state.pollutionIndex}</h4>
                        </div>
                        <div className="mt-[40px]">
                            <CustomButton
                                btnType="button"
                                title="Process Payment"
                                styles="w-full bg-[#4acd8d]"
                                handleClick={handleTransfer}
                            />
                            <h4 className="font-epilogue font-bold text-[16px] rounded-md p-1 break-all">Grant Received:</h4>
                            <h4 className="font-epilogue w-[50%] font-semibold text-[14px] text-left bg-[#4acd8d] rounded-md p-1 break-all">{state.totalReceived}</h4>
                        </div>
                    </div>
                    <div className="mt-[80px]">
                        <h4 className="bg-[#4acd8d] font-epilogue font-semibold text-[18px] text-center rounded-md p-1 break-all">
                            Grants Are Earned Based On Index
                        </h4>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default GrantDetails