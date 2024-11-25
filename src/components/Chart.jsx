import React from 'react';
import { Card, Title, AreaChart } from "@tremor/react";

function Chart({ data, room, startDate, endDate }) {
  // Format de la date pour l'affichage
  const formatDate = (date) => date.toLocaleDateString('fr-FR'); // Format français : JJ/MM/AAAA

  // Calcul de la date de fin moins un jour
  const adjustedEndDate = new Date(endDate);
  adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);

  // Vérification si les dates sont égales
  const isSameDate = startDate.toDateString() === adjustedEndDate.toDateString();

  // Vérification de la présence de données pour éviter un affichage incorrect
  if (!data || data.length === 0) {
    return (
      <Card>
        <Title>
          Performance de la salle <strong>{room}</strong> du <strong>{formatDate(startDate)}</strong>
          {!isSameDate && <> au <strong>{formatDate(adjustedEndDate)}</strong></>}
        </Title>
        <p>Aucune donnée disponible pour cette salle.</p>
      </Card>
    );
  }

  return (
    <Card>
      <Title>
        Performance de la salle <strong>{room}</strong> du <strong>{formatDate(startDate)}</strong>
        {!isSameDate && <> au <strong>{formatDate(adjustedEndDate)}</strong></>}
      </Title>
      <AreaChart
        className="h-72 mt-4"
        data={data}
        index="date" // Utiliser 'date' (ou 'heure' selon votre formatage) comme index
        categories={["temperature"]} // Afficher la température dans les catégories
        colors={["indigo"]} // Couleur de la courbe
        valueFormatter={(value) => `${value} °C`} // Format pour afficher la température avec un symbole '°C'
      />
    </Card>
  );
}

export default Chart;
