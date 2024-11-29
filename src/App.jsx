import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SelectCard from './components/SelectCard';
import OccupancyChart from './components/OccupancyChart';
import TemperatureChart from './components/TemperatureChart';
import Calendar from 'react-calendar';
import { RiHome4Fill } from 'react-icons/ri';
import { MdOutlineMeetingRoom } from "react-icons/md";
import { FaTemperatureHigh, FaHouseUser  } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedEtage, setSelectedEtage] = useState(null);
  const [selectedType, setSelectedType] = useState("Température");
  const [selectedPeriod, setSelectedPeriod] = useState("Journalier");
  const [temperatureData, setTemperatureData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  // Fonction pour obtenir le premier jour de la semaine (lundi)
  const getStartOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  // Fonction pour obtenir le dernier jour de la semaine (dimanche)
  const getEndOfWeek = (date) => {
    const end = new Date(date);
    const day = end.getDay();
    const diff = end.getDate() + (day === 0 ? 0 : 7 - day);
    end.setDate(diff);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  // Fonction pour obtenir le premier jour du mois
  const getStartOfMonth = (date) => {
    const start = new Date(date);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  // Fonction pour obtenir le dernier jour du mois
  const getEndOfMonth = (date) => {
    const end = new Date(date);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  let startDate = new Date(date);
  let endDate = new Date(date);

  // Calcul de la période sélectionnée
  if (selectedPeriod === "Journalier") {
    endDate.setDate(startDate.getDate() + 1);
  } else if (selectedPeriod === "Hebdomadaire") {
    startDate = getStartOfWeek(date);
    endDate = getEndOfWeek(date);
    endDate.setDate(endDate.getDate() + 1);
  } else if (selectedPeriod === "Mensuel") {
    startDate = getStartOfMonth(date);
    endDate = getEndOfMonth(date);
    endDate.setDate(endDate.getDate() + 1);
  }

  const handleRoomChange = (newRoom) => {
    setSelectedRoom(newRoom);
  };

  const handleEtageChange = (newEtage) => {
    setSelectedEtage(newEtage);
    if (newEtage === "Selectionné un étage") {
      setAvailableRooms(["Aucune salle disponible"]);
      setSelectedRoom(null);
    }
  };

  const handleTypeChange = (newType) => {
    setSelectedType(newType);
  };

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
  };

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchData = async (room, startDate, endDate) => {
    if (!room) return;
    setIsLoading(true);
    try {
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);
  
      const temperatureResponse = await fetch(`http://localhost:8000/temperature?space=${room}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
      const occupancyResponse = await fetch(`http://localhost:8000/occupancy?space=${room}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`);

      if (temperatureResponse.ok || occupancyResponse.ok) {
        const temperatureData = await temperatureResponse.json();
        const occupancyData = await occupancyResponse.json();
  
        setTemperatureData(temperatureData);
        setOccupancyData(occupancyData);
      } else {
        console.error('Erreur lors de la récupération des données');
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API:', error);
    }finally {
      setIsLoading(false);
    }
  };

  const getChartData = () => {
    if (selectedPeriod === "Journalier") {
      const hours = Array.from({ length: 24 }, (_, index) => index);
      const chartData = hours.map((hour) => {
        const tempData = temperatureData.find(d => new Date(d.timestamp).getHours() === hour);
        return {
          date: `${hour}:00`,
          temperature: tempData ? tempData.AvgTemperature : 0, 
        };
      });
      return chartData;
    } else if (selectedPeriod === "Hebdomadaire") {
      const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
      const chartData = [];
      const startOfWeek = getStartOfWeek(date); 

      // Boucle sur les jours de la semaine, mais en ajustant l'indice du jour
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(currentDay.getDate() + dayIndex);

        const dayName = daysOfWeek[dayIndex];
        
        const dayData = Array.from({ length: 24 }, (_, hourIndex) => {
          const tempData = temperatureData.find(d => {
            const tempDate = new Date(d.timestamp);
            return tempDate.getDate() === currentDay.getDate() && tempDate.getHours() === hourIndex;
          });
          return {
            date: `${dayName} ${hourIndex}h`,
            temperature: tempData ? tempData.AvgTemperature : 0,
          };
        });
        chartData.push(...dayData);
      }

      return chartData;
    } else if (selectedPeriod === "Mensuel") {
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const chartData = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const dayData = Array.from({ length: 24 }, (_, hourIndex) => {
          const tempData = temperatureData.find(d => new Date(d.timestamp).getDate() === day && new Date(d.timestamp).getHours() === hourIndex);
          return {
            date: `${day}/${date.getMonth() + 1} ${hourIndex}:00`,
            temperature: tempData ? tempData.AvgTemperature : 0,
          };
        });
        chartData.push(...dayData);
      }

      return chartData;
    }
  };

  const getOccupancyChartData = () => {
    if (selectedPeriod === "Journalier") {
      const hours = Array.from({ length: 24 }, (_, index) => index);
      const chartData = hours.map((hour) => {
        const occData = occupancyData.find(d => new Date(d.timestamp).getHours() === hour);
        return {
          date: `${hour}:00`,
          occupancy: occData ? occData.occupancy : 0,
        };
      });
      return chartData;
    } else if (selectedPeriod === "Hebdomadaire") {
      const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
      const chartData = [];
      const startOfWeek = getStartOfWeek(date);
  
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(currentDay.getDate() + dayIndex);
  
        const dayName = daysOfWeek[dayIndex];
          
        const dayData = Array.from({ length: 24 }, (_, hourIndex) => {
          const occData = occupancyData.find(d => {
            const occDate = new Date(d.timestamp);
            return occDate.getDate() === currentDay.getDate() && occDate.getHours() === hourIndex;
          });
          return {
            date: `${dayName} ${hourIndex}h`,
            occupancy: occData ? occData.occupancy : 0,
          };
        });
        chartData.push(...dayData);
      }
  
      return chartData;
    } else if (selectedPeriod === "Mensuel") {
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const chartData = [];
  
      for (let day = 1; day <= daysInMonth; day++) {
        const dayData = Array.from({ length: 24 }, (_, hourIndex) => {
          const occData = occupancyData.find(d => new Date(d.timestamp).getDate() === day && new Date(d.timestamp).getHours() === hourIndex);
          return {
            date: `${day}/${date.getMonth() + 1} ${hourIndex}:00`,
            occupancy: occData ? occData.occupancy : 0,
          };
        });
        chartData.push(...dayData);
      }
  
      return chartData;
    }
  };
  

  // Fonction pour récupérer les salles liées à l'étage
  const fetchRoomsForEtage = async (etage) => {
    try {
      const response = await fetch(`http://localhost:8000/aliases_by_etage?etage=${etage}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableRooms(data.aliases);

      } else {
        console.error("Erreur lors de la récupération des salles");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API:", error);
    }
  };

  useEffect(() => {
    fetchRoomsForEtage(selectedEtage);
  }, [selectedEtage]);

  useEffect(() => {
    console.log("Salle sélectionnée :", selectedRoom);
  }, [selectedRoom]);

  useEffect(() => {
    fetchData(selectedRoom, startDate, endDate);
  }, [date, selectedRoom, selectedPeriod]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SelectCard 
            title="Étage"
            value={selectedEtage || "Selectionné un étage"}
            icon={<RiHome4Fill />}
            isDropdown={true}
            options={["Selectionné un étage","0", "1", "2", "3", "4"]}
            onChange={handleEtageChange}
          />
          <SelectCard 
            title="Salle"
            value={selectedRoom || "Selectionné une salle"}
            icon={<MdOutlineMeetingRoom />}
            isDropdown={true}
            options={availableRooms.length > 0 ? availableRooms : ["Aucune salle disponible"]}
            onChange={handleRoomChange}
          />
          <SelectCard 
            title="Type"
            value={selectedType}
            icon={selectedType === "Température" ? <FaTemperatureHigh /> : <FaHouseUser />}
            isDropdown={true}
            options={["Température", "Occupation"]}
            onChange={handleTypeChange}
          />
          <SelectCard 
            title="Période"
            value={selectedPeriod}
            icon={<FaCalendarDays />}
            isDropdown={true}
            options={["Journalier", "Hebdomadaire", "Mensuel"]}
            onChange={handlePeriodChange}
          />
        </div>

        <div>
          <Calendar 
            onChange={setDate} 
            value={date} 
          />
        </div>

        <div className="mt-5 border-t-2 border-indigo-500 mb-4"></div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {selectedRoom && selectedEtage ? (
            isLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : selectedType === "Température" ? (
              <TemperatureChart
                data={getChartData()}
                room={selectedRoom}
                startDate={startDate}
                endDate={endDate}
              />
            ) : selectedType === "Occupation" ? (
              <OccupancyChart
                data={getOccupancyChartData()}
                room={selectedRoom}
                startDate={startDate}
                endDate={endDate}
              />
            ) : (
              <p className="text-center text-gray-500">
                Veuillez sélectionner un type de graphique.
              </p>
            )
          ) : (
            <p className="text-center text-gray-500">
              Veuillez sélectionner une salle pour voir les données.
            </p>
          )}
        </div>
        
        {/* <h2>Occupation</h2>
        <ul>
          {occupancyData.map((occ) => (
            <li key={occ.timestamp}>
              {new Date(occ.timestamp).toLocaleString()} : {occ.occupancy ? "Occupé" : "Non occupé"}
            </li>
          ))}
        </ul> */}

      </main>
    </div>
  );
}

export default App;
