import React from 'react';
import { Card, Text, Metric } from "@tremor/react";

function StatCard({ title, value, icon }) {
  return (
    <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo">
      <div className="flex items-center justify-between">
        <div>
          <Text>{title}</Text>
          <Metric>{value}</Metric>
        </div>
        <div className="text-2xl text-indigo-500">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default StatCard;