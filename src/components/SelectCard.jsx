import React, { useState, useRef } from 'react';
import { Card, Text, Metric } from "@tremor/react";

function SelectCard({ title, value, icon, options = [], isDropdown = false, onChange }) {
  const [selectedValue, setSelectedValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const selectRef = useRef(null);

  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onChange(newValue);
    setIsEditing(false);
  };

  const handleBlur = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.relatedTarget)) {
      setIsEditing(false);
    }
  };

  return (
    <Card 
      className="max-w-xs mx-auto bg-white"
      decoration="top" 
      decorationColor="indigo"
      onBlur={handleBlur}
      tabIndex={-1}
    >
      <div 
        className={`flex items-center justify-between ${isDropdown ? 'cursor-pointer' : ''}`}
        onClick={() => isDropdown && setIsEditing(true)}
      >
        <div>
          <Text>{title}</Text>
          
          {isEditing && isDropdown ? (
            <select
              ref={selectRef}
              className="w-full p-2 border rounded-md"
              value={selectedValue}
              onChange={handleSelectChange}
              autoFocus
            >
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <Metric>{selectedValue}</Metric>
          )}
        </div>
        <div className="text-2xl text-indigo-500">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default SelectCard;
