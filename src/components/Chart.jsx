import React from 'react';
import { Card, Title, AreaChart } from "@tremor/react";

// Le composant Chart prend des données et la salle en prop
function Chart({ data, room }) {
  return (
    <Card>
      <Title>Performance de {room}</Title>  {/* Affichage dynamique du titre */}
      <AreaChart
        className="h-72 mt-4"
        data={data}
        index="date"
        categories={["catégorie 1", "catégorie 2"]}
        colors={["indigo", "cyan"]}
      />
    </Card>
  );
}

export default Chart;
