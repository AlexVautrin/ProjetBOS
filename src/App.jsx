import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import Chart from './components/Chart';
import Calendar from 'react-calendar';
import { RiHome4Fill, RiShoppingCartLine, RiBarChartLine, RiMoneyEuroCircleLine } from 'react-icons/ri';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
  const [date, setDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState(324);
  const [view, setView] = useState('journalier');
  const [temperatureData, setTemperatureData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);

  const handleRoomChange = (newRoom) => {
    setSelectedRoom(newRoom);
  };

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  const getWeekRange = (date, view) => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);
  
    if (view === 'hebdomadaire') {
      // Pour la vue hebdomadaire, calculer la plage de lundi à dimanche
      startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Lundi de la semaine
      startOfWeek.setHours(0, 0, 0, 0);
  
      endOfWeek.setDate(date.getDate() - date.getDay() + 7); // Dimanche de la semaine
      endOfWeek.setHours(23, 59, 59, 999);
    } else {
      // Pour la vue journalier, start_date = jour sélectionné, end_date = jour + 1
      startOfWeek.setHours(0, 0, 0, 0); // Réinitialiser l'heure
      endOfWeek.setDate(date.getDate() + 1); // Le jour suivant
      endOfWeek.setHours(23, 59, 59, 999); // Fin de la journée suivante
    }
  
    return {
      start: startOfWeek,
      end: endOfWeek,
    };
  };  

  // Fonction pour récupérer les données de température et d'occupation depuis l'API
  const fetchData = async (room, startDate, endDate) => {
    try {
      // Formatage des dates en format YYYY-MM-DD
      const startFormatted = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const endFormatted = endDate.toISOString().split('T')[0]; // YYYY-MM-DD
  
      // Appels pour récupérer les données de température et d'occupation
      const temperatureResponse = await fetch(`localhost:8000/temperature?space=${room}&start_date=${startFormatted}&end_date=${endFormatted}`);
      const occupancyResponse = await fetch(`localhost:8000/occupancy?space=${room}&start_date=${startFormatted}&end_date=${endFormatted}`);
  
      // Vérifier que les réponses sont OK
      if (temperatureResponse.ok && occupancyResponse.ok) {
        const temperatureData = await temperatureResponse.json();
        const occupancyData = await occupancyResponse.json();
  
        setTemperatureData(temperatureData);
        setOccupancyData(occupancyData);
      } else {
        console.error('Erreur lors de la récupération des données');
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API:', error);
    }
  };
  

  const getDailyData = () => {
    const hours = Array.from({ length: 24 }, (_, index) => index);
    const chartData = hours.map((hour) => {
      const tempData = temperatureData.find(d => new Date(d.timestamp).getHours() === hour);
      const occupancyDataPoint = occupancyData.find(d => new Date(d.timestamp).getHours() === hour);

      return {
        date: `${hour}:00`,
        temperature: tempData ? tempData.AvgTemperature : 0,
        occupancy: occupancyDataPoint ? (occupancyDataPoint.occupancy ? 1 : 0) : 0,
      };
    });
    return chartData;
  };

  const getWeeklyData = () => {
    const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const chartData = [];

    daysOfWeek.forEach((day) => {
      for (let hour = 0; hour < 24; hour++) {
        const tempData = temperatureData.find(d => new Date(d.timestamp).getHours() === hour && new Date(d.timestamp).toLocaleDateString() === `${day}`);
        const occupancyDataPoint = occupancyData.find(d => new Date(d.timestamp).getHours() === hour && new Date(d.timestamp).toLocaleDateString() === `${day}`);

        chartData.push({
          date: `${day} ${hour}:00`,
          temperature: tempData ? tempData.AvgTemperature : 0,
          occupancy: occupancyDataPoint ? (occupancyDataPoint.occupancy ? 1 : 0) : 0,
        });
      }
    });

    return chartData;
  };

  useEffect(() => {
    // Quand la date ou la salle change, on récupère les nouvelles données
    const { start, end } = getWeekRange(date, view);
    fetchData(selectedRoom, start, end);
  }, [date, selectedRoom, view]); // Ajout de `view` à la dépendance
  

  const { start, end } = getWeekRange(date);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Salles"
            value={selectedRoom}
            icon={<RiHome4Fill />}
            isDropdown={true}
            options={[324, 354, 233, 411]}
            onChange={handleRoomChange}
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

        <div className="flex mb-8">
          <button
            onClick={() => handleViewChange('journalier')}
            className={`mr-4 px-4 py-2 rounded ${view === 'journalier' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
          >
            Journalier
          </button>
          <button
            onClick={() => handleViewChange('hebdomadaire')}
            className={`px-4 py-2 rounded ${view === 'hebdomadaire' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
          >
            Hebdomadaire
          </button>
        </div>

        <div className="mb-8">
          {view === 'journalier' ? (
            <h2 className="text-xl font-bold mb-4">Performance du {date.toLocaleDateString()}</h2>
          ) : (
            <h2 className="text-xl font-bold mb-4">
              Performance de la semaine du {start.toLocaleDateString()} au {end.toLocaleDateString()}
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <Chart 
            data={view === 'journalier' ? getDailyData() : getWeeklyData()}
            room={selectedRoom}
          />
        </div>

        <div>
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
