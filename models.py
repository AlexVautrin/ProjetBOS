from datetime import datetime
from pydantic import BaseModel

class OccupancyData(BaseModel):
    timestamp: datetime
    occupancy: bool

class TemperatureData(BaseModel):
    timestamp: datetime
    AvgTemperature: int
