import React, { useState } from "react";

const Switch = ({ checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <div
      className={`${
        isChecked ? "bg-blue-600" : "bg-gray-200"
      } relative inline-block w-10 h-6 rounded-full mt-4`}
      onClick={handleToggle}
    >
      <span
        className={`${
          isChecked ? "translate-x-5" : "translate-x-1"
        } inline-block w-4 h-4 transform bg-white rounded-full mt-1 transition ease-in-out duration-300`}
      ></span>
    </div>
  );
};

export default Switch;
