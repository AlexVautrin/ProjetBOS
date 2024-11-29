import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, Title } from "@tremor/react";

function OccupancyChart({ data, room, startDate, endDate }) {
  // Format de la date pour l'affichage
  const formatDate = (date) => date.toLocaleDateString("fr-FR");

  // Calcul de la date de fin moins un jour
  const adjustedEndDate = new Date(endDate);
  adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);

  // Vérification si les dates sont égales
  const isSameDate = startDate.toDateString() === adjustedEndDate.toDateString();

  // Vérification de la présence de données
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

  // Transformation des données pour recharts
  const transformedData = data.map((item) => ({
    ...item,
    occupancy: item.occupancy ? 20 : 0, // Valeurs numériques pour le graphique
  }));

  return (
    <Card>
      <Title>
        Occupation de la salle <strong>{room}</strong> du <strong>{formatDate(startDate)}</strong>
        {!isSameDate && <> au <strong>{formatDate(adjustedEndDate)}</strong></>}
      </Title>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={transformedData}>
          {/* Axe des abscisses (dates) */}
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          {/* Axe des ordonnées avec étiquettes personnalisées */}
          <YAxis
            tickFormatter={(value) => (value === 20 ? "Occupé" : value === 0 ? "Non occupé" : "")}
            domain={[0, 20]} // Limite les valeurs entre 0 et 20
            ticks={[0, 20]} // Affiche uniquement les valeurs 0 et 20
          />
          <Tooltip
            formatter={(value) => (value === 20 ? "Occupé" : "Non occupé")}
          />
          <Legend
            payload={[{
              value: "Occupation",
              type: "square",
              id: "occupancy",
              color: "#4A90E2",
            }]}
          />
          <Bar dataKey="occupancy" name="Occupation" fill="#4A90E2" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default OccupancyChart;
