import React from 'react';
import { RiDashboardLine } from 'react-icons/ri';

function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-2xl font-bold mb-8">Dashboard</div>
      <nav>
        <ul className="space-y-2">
          <li className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
            <RiDashboardLine />
            <span>Vue générale</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;