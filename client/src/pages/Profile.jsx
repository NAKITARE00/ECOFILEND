import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DisplayReceivers } from '../components';
import { useStateContext } from '../context';


const Profile = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { address, contract, getUserGrants } = useStateContext();

    const [receivers, setReceivers] = useState([]);
    const fetchGrants = async () => {
        setIsLoading(true);
        const data = await getUserGrants();
        setReceivers(data);
        setIsLoading(false);
    }
    useEffect(() => {
        if (contract) fetchGrants();
    }, [address, contract]);
    return (
        <div className="bg-[#1c1c24] flex justify-center
        items-center flex-col rounded-[10px] sm:p-10p-4">

            <DisplayReceivers
                title="Grants"
                isLoading={isLoading}
                receivers={receivers}
            />
        </div>
    )
}

export default Profile