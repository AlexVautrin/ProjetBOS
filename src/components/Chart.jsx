import React from 'react';
import { Card, Title, AreaChart } from "@tremor/react";

const chartdata = [
  { date: "Jan", "catégorie 1": 2890, "catégorie 2": 2400 },
  { date: "Fév", "catégorie 1": 1890, "catégorie 2": 1398 },
  { date: "Mar", "catégorie 1": 3890, "catégorie 2": 2980 },
  { date: "Avr", "catégorie 1": 2890, "catégorie 2": 2400 },
  { date: "Mai", "catégorie 1": 4890, "catégorie 2": 3908 },
];

function Chart() {
  return (
    <Card>
      <Title>Performance Mensuelle</Title>
      <AreaChart
        className="h-72 mt-4"
        data={chartdata}
        index="date"
        categories={["catégorie 1", "catégorie 2"]}
        colors={["indigo", "cyan"]}
      />
    </Card>
  );
}

export default Chart;