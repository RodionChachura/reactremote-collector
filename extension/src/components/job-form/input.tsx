import React from "react";

interface Props {
  value: string | number | undefined,
  onChange: (v: string) => void,
  label: string
}

const Input = ({ label, onChange, value }: Props) => {
  return (
    <div className="flex flex-col space-y-1">
      {/* <label className="text-sm text-gray-100">{label}</label> */}
      <input
        placeholder={label}
        onChange={({ target }) => onChange(target.value)}
        value={value}
        type="text"
        className="w-full rounded-md bg-gray-800 text-gray-100 p-2"
      />
    </div>
  );
};

export default Input
