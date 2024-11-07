import React from 'react';
import { Card, Title, AreaChart } from "@tremor/react";

const chartdata = [
  { date: "Jan", Ventes: 2890, Visites: 2400 },
  { date: "Fév", Ventes: 1890, Visites: 1398 },
  { date: "Mar", Ventes: 3890, Visites: 2980 },
  { date: "Avr", Ventes: 2890, Visites: 2400 },
  { date: "Mai", Ventes: 4890, Visites: 3908 },
];

function Chart() {
  return (
    <Card>
      <Title>Performance Mensuelle</Title>
      <AreaChart
        className="h-72 mt-4"
        data={chartdata}
        index="date"
        categories={["Ventes", "Visites"]}
        colors={["indigo", "cyan"]}
      />
    </Card>
  );
}

export default Chart;