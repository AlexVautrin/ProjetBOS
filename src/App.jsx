import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import Chart from './components/Chart';
import Calendar from 'react-calendar';
import { RiUserLine, RiShoppingCartLine, RiBarChartLine, RiMoneyEuroCircleLine } from 'react-icons/ri';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Salles"
            value="234"
            icon={<RiUserLine />}
          />
          <StatCard 
            title="test"
            value="0"
            icon={<RiShoppingCartLine />}
          />
          <StatCard 
            title="test"
            value="0"
            icon={<RiBarChartLine />}
          />
          <StatCard 
            title="test"
            value="0"
            icon={<RiMoneyEuroCircleLine />}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <Chart />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <h2 className="text-xl font-bold mb-4">Calendrier</h2>
          <Calendar 
            onChange={setDate} 
            value={date} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;
