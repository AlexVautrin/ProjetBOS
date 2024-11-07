import React from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import Chart from './components/Chart';
import { RiUserLine, RiShoppingCartLine, RiBarChartLine, RiMoneyEuroCircleLine } from 'react-icons/ri';

function App() {
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

        <div className="grid grid-cols-1 gap-6">
          <Chart />
        </div>
      </main>
    </div>
  );
}

export default App;