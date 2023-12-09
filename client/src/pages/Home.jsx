import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DisplayReceivers } from '../components';
import { useStateContext } from '../context';

const Home = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { address, contract, getReceivers } = useStateContext();
    const [receivers, setReceivers] = useState([]);
    const fetchReceivers = async () => {
        setIsLoading(true);
        const data = await getReceivers();
        setReceivers(data);
        setIsLoading(false);
    }
    useEffect(() => {
        if (contract) fetchReceivers();
    }, [address, contract]);
    return (
        <div className="bg-[] flex justify-center mr-[20px]
        items-center flex-col rounded-[10px] sm:p-10p-4">
            <div className="justify-left flex flex-row">
                <DisplayReceivers
                    title="Grant Receivers"
                    isLoading={isLoading}
                    receivers={receivers}
                />
            </div>

        </div>
    )
}

export default Home