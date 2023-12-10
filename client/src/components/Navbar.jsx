import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton } from "./";
import { tipper, menu, search, profile, avatar } from '../assets';
import { navlinks } from '../constants';
import { Avatar, Profile, Card } from '@ensdomains/thorin'
import { providers } from 'ethers'
import { env } from 'dotenv'

const provider = new providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/2eGk-LXbVCnUev_mETVvjlj1kIBY3ri9')


const Navbar = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState('dashboard');
    const [toggleDrawer, setToggleDrawer] = useState(false);
    const { connect, address } = useStateContext();
    const [resolvedName, setResolvedName] = useState('');
    useEffect(() => {
        const fetchName = async () => {
            try {
                console.log(address);
                const resolvedName = await provider.lookupAddress(address);
                setResolvedName(resolvedName || 'ENS.eth');
            } catch (error) {
                console.error('Error fetching name:', error);

            }
        };

        if (address) {
            fetchName();
        }
    }, [address]);
    console.log(resolvedName)
    console.log(address)
    const truncatedAddress = address ? (
        address.length > 4 ? `${address.slice(0, 2)}...${address.slice(-3)}` : address
    ) : 'Connect';

    return (
        <div className="flex md:flex-row flex-col-reverse justify-between mt-[10px] w-[85%]
            mb-[35px] gap-4 mr-25 ">
            <div className="lg:flex-1 flex flex-row justify-left gap-2 py-2 pl-4 ml-10 pr-2 h-[52px] bg-[transparent] 
                rounded-[100px]">
                <input type='text' placeholder='search for grants'
                    className='flex w-[370px] rounded-[10px] border-[1px] border-[#4acd8d]
                     font-epilogue font-normal text-center
                     text-[14px] placeholder:text-[grey] text-black
                     bg-transparent outline-none focus:outline-none focus:ring-2 
                     focus:ring-purple-600 '
                />
                <div className='w-[42px] h-full rounded-[240px] 
                bg-[#4acd8d] flex justify-center 
                items-center cursor-pointer'>
                    <img src={search} alt="search" className='w-[15px] h-[15px]
                    object-contain'
                    />
                </div>
            </div>

            <div className="sm:flex hidden flex-row justify-left gap-10 mr-24">
                <CustomButton
                    btnType="button"
                    title={truncatedAddress}
                    styles={address ? 'bg-[#4acd8d]' : 'bg-[#4acd8d]'}
                    handleClick={() => {
                        if (address) navigate('/')
                        else connect();
                    }}
                />
                <Link to="/profile">
                    <div className="w-[15px] mt-[15px] h-[30px] rounded-full
                    bg-[#4acd8d] flex justify-right items-center
                    cursor-pointer">
                        <Card style={{
                            backgroundColor: "#4acd8d", width: "", height: "55px",
                            paddingBottom: "2px", paddingTop: "2px", marginBottom: "10px", marginTop: "3px"
                        }}>
                            <Profile
                                address={address}
                                ensName={resolvedName}
                                avatar={avatar}
                                size='medium'
                            />
                        </Card>

                    </div>
                </Link>
            </div>
            {/* Mobile View */}
            <div className="sm:hidden flex pt-[1px] justify-between items-center relative">
                <div className="w-[105px] h-[65px]  flex justify-center items-center cursor-pointer">
                    <img src={tipper} alt="user" className="w-[95%] h-[90%] object-contain" />
                </div>

                <img
                    src={menu}
                    alt="menu"
                    className="w-[34px] h-[34px] object-contain cursor-pointer"
                    onClick={() => setToggleDrawer((prev) => !prev)}
                />

                <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
                    <ul className="mb-4">
                        {navlinks.map((link) => (
                            <li
                                key={link.name}
                                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                                onClick={() => {
                                    setIsActive(link.name);
                                    setToggleDrawer(false);
                                    navigate(link.link);
                                }}
                            >
                                <img
                                    src={link.imgUrl}
                                    alt={link.name}
                                    className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                                />
                                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                                    {link.name}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <div className="flex mx-4">
                        <CustomButton
                            btnType="button"
                            title={address ? (address.length > 10 ? `${address.slice(0, 10)}...` : address) : 'Connect'}
                            styles={address ? 'bg-[#4acd8d]' : 'bg-[#4acd8d]'}
                            handleClick={() => {
                                if (address) navigate('/')
                                else connect();
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar