import React from 'react';
import { Card, Title, AreaChart } from "@tremor/react";

function Chart({ data, room }) {
  return (
    <Card>
      <Title>
        Performance de la salle <strong>{room}</strong> 
      </Title>
      <AreaChart
        className="h-72 mt-4"
        data={data}
        index="date"
        categories={["Température", "Occupation"]}
        colors={["indigo", "cyan"]}
      />
    </Card>
  );
}

export default Chart;
