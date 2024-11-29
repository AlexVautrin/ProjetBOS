import React from 'react';
import { Card, Title, BarChart } from "@tremor/react";

function OccupancyChart({ data, room, startDate, endDate }) {
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
          Occupation de la salle <strong>{room}</strong> du <strong>{formatDate(startDate)}</strong>
          {!isSameDate && <> au <strong>{formatDate(adjustedEndDate)}</strong></>}
        </Title>
        <p>Aucune donnée disponible pour cette salle.</p>
      </Card>
    );
  }

  // Transformation des données pour que l'occupation soit instantanée à 20 ou 0
  let occupancyStatus = 0; // Valeur initiale de l'occupation
  const transformedData = data.map(item => {
    // Si l'occupation devient true, on passe à 20
    occupancyStatus = item.occupancy ? 20 : 0;
    return {
      ...item,
      occupancy: occupancyStatus, // Mettre directement 20 ou 0 selon l'occupation
    };
  });

  return (
    <Card>
      <Title>
        Occupation de la salle <strong>{room}</strong> du <strong>{formatDate(startDate)}</strong>
        {!isSameDate && <> au <strong>{formatDate(adjustedEndDate)}</strong></>}
      </Title>
      <BarChart
        className="h-72 mt-4"
        data={transformedData} // Utiliser les données transformées
        index="date" // Utiliser 'date' comme index pour le graphique
        categories={["occupancy"]} // Afficher l'occupation dans les catégories
        colors={["indigo"]} // Couleur des barres en "indigo" (nom de couleur valide)
        valueFormatter={(value) => value} // Affichage des valeurs 20 ou 0
      />
    </Card>
  );
}

export default OccupancyChart;
