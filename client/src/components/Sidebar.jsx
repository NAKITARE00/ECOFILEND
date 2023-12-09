import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tipper, menu } from '../assets';
import { navlinks } from '../constants';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
    <div className={`w-[75px] h-[75px] rounded-[5px] p-[0] ${isActive && isActive === name && 'bg-[]'} flex justify-center items-center 
    ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
        {!isActive ? (
            <img src={imgUrl} alt="fund_logo" className="w-9/10 h-9/10" />
        ) : (
            <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
        )}
    </div>
)

const Sidebar = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState('dashboard');
    const [toggleDrawer, setToggleDrawer] = useState(false);

    return (
        <div className="flex justify-left bg-[] flex-col sticky top-4">


            <div className="flex-1 flex-col items-center bg-[] 20px rounded-[20px] w-[176px]">
                <Link to="/">
                    <Icon styles="w-[290px] h-[78px] bg-[]" imgUrl={tipper} />
                </Link>
                <div className="flex flex-col justify-right items-center gap-3 ml-10">
                    {navlinks.map((link) => (
                        <Icon
                            key={link.name}
                            {...link}
                            isActive={isActive}
                            handleClick={() => {
                                if (!link.disabled) {
                                    setIsActive(link.name);
                                    navigate(link.link);
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
        </div >
    )
}

export default Sidebar