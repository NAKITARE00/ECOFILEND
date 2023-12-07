import React from 'react'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import { loader } from '../assets';
import { GrantCard } from './';

const DisplayReceivers = ({ title, isLoading, receivers }) => {
    const navigate = useNavigate();
    const handleNavigate = (receiver) => {
        navigate(`/grant-details/${receiver.name}`,
            { state: receiver })
    }
    return (
        <div>
            <h1 className="font-epilogue font-semibold text-[18px]
            text-white text-left">
                {title} ({receivers.length})
            </h1>

            <div className="flex flex-wrap mt-[20px] gap-[26px]">
                {isLoading && (
                    <img src={loader} className="w-{100px] h-[100px]
                        object-contain"
                    />
                )}

                {!isLoading && receivers.length === 0 && (
                    <p className="font-epilogue font-semibold text-[14px
                    leading-[30px] text-[#818183]">
                        No Grants To Display
                    </p>
                )}

                {!isLoading && receivers.length > 0 && receivers.map
                    ((receiver) => (<GrantCard
                        key={uuidv4()}
                        {...receiver}
                        handleClick={() => handleNavigate(receiver)}
                    />))}
            </div>
        </div>
    )
}

export default DisplayReceivers