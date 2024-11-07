import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import Chart from './components/Chart';
import Calendar from 'react-calendar';
import { RiHome4Fill, RiShoppingCartLine, RiBarChartLine, RiMoneyEuroCircleLine } from 'react-icons/ri';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
  const [date, setDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState("324");  // Salle sélectionnée
  const [view, setView] = useState('journalier');  // 'journalier' ou 'hebdomadaire'

  const handleRoomChange = (newRoom) => {
    setSelectedRoom(newRoom);  // Mettre à jour la salle sélectionnée
  };

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  // Fonction pour obtenir la date du début de la semaine (lundi) en fonction de la date sélectionnée
  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);
    
    // Réinitialiser la date au début de la semaine (lundi)
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Réinitialiser la date à la fin de la semaine (dimanche)
    endOfWeek.setDate(date.getDate() - date.getDay() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
      start: startOfWeek,
      end: endOfWeek
    };
  };

  // Générer les données pour le graphique journalier (24 heures du jour sélectionné)
  const getDailyData = () => {
    const hours = Array.from({ length: 24 }, (_, index) => index);  // Créer un tableau d'heures de 0 à 23
    const chartData = hours.map((hour) => ({
      date: `${hour}:00`,  // L'heure de la journée
      "catégorie 1": Math.floor(Math.random() * 100),  // Valeur aléatoire pour la catégorie 1
      "catégorie 2": Math.floor(Math.random() * 100),  // Valeur aléatoire pour la catégorie 2
    }));
    return chartData;
  };

  // Générer les données pour le graphique hebdomadaire (7 jours de la semaine, 24 heures chaque jour)
  const getWeeklyData = () => {
    const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const hours = Array.from({ length: 24 }, (_, index) => index);  // Créer un tableau d'heures de 0 à 23

    const chartData = [];
    
    daysOfWeek.forEach((day) => {
      hours.forEach((hour) => {
        chartData.push({
          date: `${day} ${hour}:00`,  // Par exemple, "Lundi 00:00", "Lundi 01:00", etc.
          "catégorie 1": Math.floor(Math.random() * 100),  // Valeur aléatoire pour la catégorie 1
          "catégorie 2": Math.floor(Math.random() * 100),  // Valeur aléatoire pour la catégorie 2
        });
      });
    });

    return chartData;
  };

  const { start, end } = getWeekRange(date);  // Obtenir la plage de dates pour la semaine

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Salles"
            value={selectedRoom}
            icon={<RiHome4Fill />}
            isDropdown={true}
            options={["234", "354", "233", "411"]}
            onChange={handleRoomChange}  // Assurez-vous que onChange est bien passé
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
            <h2 className="text-xl font-bold mb-4">Performance du {date.toLocaleDateString()}</h2>  // Afficher la date du jour sélectionné
          ) : (
            <h2 className="text-xl font-bold mb-4">
              Performance de la semaine du {start.toLocaleDateString()} au {end.toLocaleDateString()}
            </h2>  // Afficher la plage de la semaine
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <Chart 
            data={view === 'journalier' ? getDailyData() : getWeeklyData()}  // Passer les bonnes données selon la vue
            room={selectedRoom}  // Passer la salle sélectionnée à Chart
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
