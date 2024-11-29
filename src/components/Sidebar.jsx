import React from 'react';
import { RiDashboardLine } from 'react-icons/ri';
import eseoLogo from './eseo.png'; // Importez l'image ici

function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col justify-between fixed">
      <div>
        {/* Ajoutez l'image ici */}
        <img src={eseoLogo} alt="ESEO Logo" className="w-32 h-auto mb-8 mx-auto" />
        
        <nav>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
              <RiDashboardLine />
              <span>Vue générale</span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex flex-col space-y-2 p-2 rounded">
        <span>Rodolphe MARTISCHANG</span>
        <span>Alexandre VAUTRIN</span>
        <span>Antoine LANQUETIN</span>
      </div>
    </div>
  );
}

export default Sidebar;
