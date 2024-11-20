import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import Chart from './components/Chart';
import Calendar from 'react-calendar';
import { RiHome4Fill, RiShoppingCartLine, RiBarChartLine, RiMoneyEuroCircleLine } from 'react-icons/ri';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
  const [date, setDate] = useState(new Date());  // Date sélectionnée dans le calendrier
  const [selectedRoom, setSelectedRoom] = useState("327");
  const [view, setView] = useState('journalier');
  const [temperatureData, setTemperatureData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);

  const handleRoomChange = (newRoom) => {
    setSelectedRoom(newRoom);
  };

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);

    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    endOfWeek.setDate(date.getDate() - date.getDay() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
      start: startOfWeek,
      end: endOfWeek,
    };
  };

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchData = async (room, startDate, endDate) => {
    try {
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);
  
      const temperatureResponse = await fetch(`http://localhost:8000/temperature?space=${room}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
      const occupancyResponse = await fetch(`http://localhost:8000/occupancy?space=${room}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`);

      console.log(temperatureResponse);
      console.log(occupancyResponse);

      if (temperatureResponse.ok && occupancyResponse.ok) {
        const temperatureData = await temperatureResponse.json();
        const occupancyData = await occupancyResponse.json();
  
        setTemperatureData(temperatureData);
        setOccupancyData(occupancyData);
      } else {
        console.error('Erreur lors de la récupération des données');
      }

      console.log("Température Data:", temperatureData);
      console.log("Occupancy Data:", occupancyData);

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
        date: `${hour}:00`, // Utilisation de l'heure comme "date" pour l'index
        temperature: tempData ? tempData.AvgTemperature : 0,
        occupancy: occupancyDataPoint ? (occupancyDataPoint.occupancy ? 10 : 0) : 0, // Convertir `true`/`false` en 10/0
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
          date: `${day} ${hour}:00`, // Combinaison du jour et de l'heure
          temperature: tempData ? tempData.AvgTemperature : 0,
          occupancy: occupancyDataPoint ? (occupancyDataPoint.occupancy ? 10 : 0) : 0, // Convertir `true`/`false` en 10/0
        });
      }
    });
  
    return chartData;
  };

  useEffect(() => {
    // Pour la vue "journalier", on veut simplement ajouter un jour au startDate
    let startDate = new Date(date);
    let endDate = new Date(date);
    endDate.setDate(startDate.getDate() + 1); // Ajouter 1 jour à la date sélectionnée

    // Si la vue est hebdomadaire, récupère le début et la fin de la semaine
    if (view === 'hebdomadaire') {
      const { start, end } = getWeekRange(date);
      startDate = start;
      endDate = end;
    }

    console.log("Données récupérées pour la salle:", selectedRoom);
    console.log("Date de début:", startDate);
    console.log("Date de fin:", endDate);

    // Appel de la fonction fetchData après mise à jour de la date
    fetchData(selectedRoom, startDate, endDate);
  }, [date, selectedRoom, view]); // Ne se déclenche que lorsque la date, la salle ou la vue changent.

  console.log("Graph Data:", view === 'journalier' ? getDailyData() : getWeeklyData());
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
            options={["327", "326", "325", "411"]}
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
              Performance de la semaine du {getWeekRange(date).start.toLocaleDateString()} au {getWeekRange(date).end.toLocaleDateString()}
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <Chart data={view === 'journalier' ? getDailyData() : getWeeklyData()} room={selectedRoom} />
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
