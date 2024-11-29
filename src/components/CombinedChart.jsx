import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, Title } from "@tremor/react";

function CombinedChart({ data, room, startDate, endDate }) {
  // Format de la date pour l'affichage
  const formatDate = (date) => date.toLocaleDateString("fr-FR");

  // Calcul de la date de fin moins un jour
  const adjustedEndDate = new Date(endDate);
  adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);

  // Fonction pour vérifier si les dates de début et de fin sont identiques
  const isSameDate = (start, end) => {
    return start.toLocaleDateString("fr-FR") === end.toLocaleDateString("fr-FR");
  };

  // Vérification si les données sont disponibles
  if (!data || data.length === 0) {
    return (
      <Card>
        <Title>
          Données combinées pour la salle <strong>{room}</strong> du <strong>{formatDate(startDate)}</strong>
          {!isSameDate(startDate, adjustedEndDate) && <> au <strong>{formatDate(adjustedEndDate)}</strong></>}
        </Title>
        <p>Aucune donnée disponible pour cette salle.</p>
      </Card>
    );
  }

  return (
    <Card>
      <Title>
        Données combinées pour la salle <strong>{room}</strong> du <strong>{formatDate(startDate)}</strong>
        {!isSameDate(startDate, adjustedEndDate) && <> au <strong>{formatDate(adjustedEndDate)}</strong></>}
      </Title>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" label={{ value: "Température (°C)", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: "Occupation", angle: 90, position: "insideRight" }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" name="Température" />
          <Line yAxisId="right" type="monotone" dataKey="occupancyLabel" stroke="#82ca9d" name="Occupation" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default CombinedChart;
