import React from 'react'
import { Button, Banner } from '@ensdomains/thorin'
import { Link } from 'react-router-dom';
import { eco, photo } from '../assets'

const LandingPage = () => {
    return (
        <div className="w-[95%] items-center">
            <div className='justify-right text-center font-bold font-epilogue font-[25px]'>
                <Banner alert="info" title="What is EcoFilend?">
                    <h4 className="font-epilogue font-semibold text-[16px] rounded-md p-1 break-all">
                        EcoFiLend is a DeFi DAO that ensures equality in funding</h4>
                    <h4 className="font-epilogue font-semibold text-[16px] rounded-md p-1 break-all">
                        of environmental projects. Beautified by Thorin it harnesses the power of</h4>
                    <h4 className="font-epilogue font-semibold text-[16px] rounded-md p-1 break-all">
                        CCIP & Chainlink Functions for perfomance based distribution.</h4>
                    <h4 className="font-epilogue font-semibold text-[16px] rounded-md p-1 break-all">
                        Contracts deployed on a rapid, secure and cost effcient Avalanche Chain</h4>
                    <h4 className="font-epilogue font-semibold text-[16px] rounded-md p-1 break-all">
                        With swift transaction finality, AVAX tokens power the network, facilitating  </h4>
                    <h4 className="font-epilogue font-semibold text-[16px] rounded-md p-1 break-all">
                        transactions and securing the interconnected blockchains within Avalanche
                    </h4>



                </Banner>
            </div>
            <div className='flex flex-wrap justify-center'>
                <img src={eco} alt="eco" className='w-[47%] h-[20%] object-contain' />
                <img src={photo} alt="eco" className='w-[50%] h-[55%] object-contain bg:[#4acd8d]' />
            </div>
            <Link to="/Home">
                <Button
                    size="small"
                >
                    Get Started
                </Button>
            </Link>
        </div>
    )
}

export default LandingPage