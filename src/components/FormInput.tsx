import React from "react";

export interface FormInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({ label, placeholder, value, onChange }: FormInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          className="block w-full pl-2 rounded-md border-0 py-1.5 pr-10 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default FormInput;
