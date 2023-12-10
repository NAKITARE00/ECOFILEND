import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton, FormField } from '../components';
import { checkIfImage } from '../utils';

const CreateGrant = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register } = useStateContext();
    const [form, setForm] = useState({
        name: '',
        receiver: '',
        city: '',
        state: '',
        country: '',
        image: ''
    });

    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        checkIfImage(form.image, async (exists) => {
            if (exists) {
                setLoading(true);
                // console.log()
                await register(
                    form.name,
                    form.receiver,
                    form.city,
                    form.state,
                    form.country,
                    form.image
                );

                setLoading(false);
                navigate('/Home');
            } else {
                alert('Provide a valid image URL');
                setForm({ ...form, image: '' });
            }
        });
    };
    return (
        <div className="bg-[#808191] flex justify-center items-center bg-[#D8D8D8]  w-[90%] flex-col rounded-[10px] sm:p-15p-4">
            {loading && 'Loader...'}
            <div className="flex justify-center items-center p-[16px] sm:min-w-[480px] bg-[#1dc071] mt-[30px] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[24px] text-[17px] leading-[37px] text-white">Create Grant</h1>
            </div>
            <form onSubmit={handleSubmit} className="w-[] mt-[65px] flex flex-col gap-[30px] sm:min-w-[200px]">
                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Grant Name *"
                        placeholder="Grant's name"
                        inputType="text"
                        value={form.name}
                        handleChange={(e) => handleFormFieldChange('name', e)}
                    />
                    <FormField
                        labelName="Receiver Address *"
                        placeholder="Enter Receiver"
                        inputType="text"
                        value={form.receiver}
                        handleChange={(e) => handleFormFieldChange('receiver', e)}
                    />
                </div>
                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="City *"
                        placeholder="City's name"
                        inputType="text"
                        value={form.city}
                        handleChange={(e) => handleFormFieldChange('city', e)}
                    />
                    <FormField
                        labelName="State *"
                        placeholder="State Name"
                        inputType="text"
                        value={form.state}
                        handleChange={(e) => handleFormFieldChange('state', e)}
                    />
                    <FormField
                        labelName="Country *"
                        placeholder="Country"
                        inputType="text"
                        value={form.state}
                        handleChange={(e) => handleFormFieldChange('country', e)}
                    />
                </div>
                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Grant Image*"
                        placeholder="Grant Photo Url"
                        inputType="url"
                        value={form.image}
                        handleChange={(e) => handleFormFieldChange('image', e)}
                    />
                </div>
                <div className="flex justify-center items-center mb-[30px]">
                    <CustomButton
                        btnType="submit"
                        title="Submit Grant"
                        styles="bg-[#1dc071]"
                        handleClick={handleSubmit}
                    />
                </div>
            </form>
        </div>
    );
}

export default CreateGrant;
