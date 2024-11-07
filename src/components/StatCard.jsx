import React, { useState, useRef } from 'react';
import { Card, Text, Metric } from "@tremor/react";

function StatCard({ title, value, icon, options = [], isDropdown = false, onChange }) {
  const [selectedValue, setSelectedValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const selectRef = useRef(null);

  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onChange(newValue); // Appeler la fonction onChange pour mettre à jour la salle dans le parent
    setIsEditing(false);  // Ferme le select après avoir sélectionné une option
  };

  const handleBlur = (event) => {
    // Vérifie si le clic est en dehors du menu déroulant et ferme le select
    if (selectRef.current && !selectRef.current.contains(event.relatedTarget)) {
      setIsEditing(false);
    }
  };

  return (
    <Card 
      className="max-w-xs mx-auto" 
      decoration="top" 
      decorationColor="indigo"
      onBlur={handleBlur}
      tabIndex={-1}
    >
      <div 
        className={`flex items-center justify-between ${isDropdown ? 'cursor-pointer' : ''}`}  // Ajouter `cursor-pointer` uniquement si isDropdown est true
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

export default StatCard;
