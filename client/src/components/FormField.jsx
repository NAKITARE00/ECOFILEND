import React from 'react'

const FormField = ({ labelName, placeholder, inputType, value, handleChange }) => {
    return (
        <label className="flex-1 w-full flex flex-col justify-center">
            {labelName && (
                <span className="font-epilogue font-bold text-[15px] leading-[23px]
                text-[#808191] mb-[10px]">{labelName}</span>
            )}
            <input
                requiredvalue={value}
                onChange={handleChange}
                type={inputType}
                step="0.1"
                placeholder={placeholder}
                className="py-[15px] sm:px-[25px] px-[15px] 
                        outline-none border-[1px] border-[#fff] 
                        bg-transparent font-epilogue text-white text-[14px] 
                        placeholder:text-[#4b5264] 
                        rounded-[10px] sm:min-w-[300px]
                        focus:ring-2 focus:ring-purple-500
                    "
            />

        </label>
    )
}

export default FormField