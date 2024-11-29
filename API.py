from datetime import datetime
from pymongo import MongoClient
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5000",  # Remplace cela par l'URL de ton frontend 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Liste des origines autorisées
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],  # Autorise tous les headers
)


# Configuration de la connexion MongoDB
client = MongoClient('mongodb+srv://dijon_eseo_estp:TARCjcsFLhh60yRi@dijon.j7vi7.mongodb.net/')
db = client['OnDijon']
metadata = db['metadata']
timeseries = db['timeseries']

# Modèle de réponse pour FastAPI
class OccupancyData(BaseModel):
    timestamp: datetime
    occupancy: bool

class TemperatureData(BaseModel):
    timestamp: datetime
    AvgTemperature: int


# Fonction pour obtenir le nom d'espace par alias
def get_name_by_alias(alias):
    df = pd.read_csv('Filtered_Rooming_With_Etage.csv', delimiter=';')
    matching_row = df[df['alias'] == alias]
    if not matching_row.empty:
        print (matching_row.iloc[0]['Name'])
        return matching_row.iloc[0]['Name']
    else:
        return None
    
def get_aliases_by_etage(etage: int) -> List[str]:
    df = pd.read_csv('Filtered_Rooming_With_Etage.csv', delimiter=';')
    
    matching_rows = df[df['etage'] == etage]
    
    aliases = matching_rows['alias'].tolist()
    
    return aliases


# Fonction de récupération des données de température
def fetch_temperature_data(space: str, start_date: datetime, end_date: datetime) -> List[TemperatureData]:
    space = get_name_by_alias(space)
    query_metadata = {
        "controlPointType": "SENSOR",
        "space": space,
        "equipmentControlCategory": "TEMPERATURE",
        "historyDisplayName": {"$regex": ".*AvgTemperature .*", "$options": "i"}
    }
    metadata_documents = list(metadata.find(query_metadata))
    id_list = [doc['_id'] for doc in metadata_documents]

    if id_list:
        query_timeseries = {
            "metadata.metadata_id": {"$in": id_list},
            "timestamp": {"$gte": start_date, "$lt": end_date}
        }
        timeseries_documents = list(timeseries.find(query_timeseries))

        temperature_data = {}
        for doc in timeseries_documents:
            timestamp = doc['timestamp']
            hour = timestamp.replace(minute=0, second=0, microsecond=0)
            value = doc['value']
            if hour not in temperature_data:
                temperature_data[hour] = []
            temperature_data[hour].append(value)

        processed_data = []
        for hour, values in temperature_data.items():
            # Filtrer les valeurs NaN
            values = [v for v in values if v is not None and not pd.isna(v)]

            # Si la liste de valeurs est vide, assignez une valeur par défaut
            if values:
                avg_temperature = round(sum(values) / len(values))
            else:
                avg_temperature = 0  # Ou une autre valeur par défaut que vous préférez

            processed_data.append(TemperatureData(timestamp=hour, AvgTemperature=avg_temperature))

        return processed_data
    return []


# Fonction de récupération des données d'occupation
def fetch_occupancy_data(space: str, start_date: datetime, end_date: datetime) -> List[OccupancyData]:
    space = get_name_by_alias(space)
    query_metadata = {
        "controlPointType": "SENSOR",
        "space": space,
        "equipmentControlCategory": "OCCUPANCY"
    }
    metadata_documents = list(metadata.find(query_metadata))
    id_list = [doc['_id'] for doc in metadata_documents]

    if id_list:
        query_timeseries = {
            "metadata.metadata_id": {"$in": id_list},
            "timestamp": {"$gte": start_date, "$lt": end_date}
        }
        timeseries_documents = list(timeseries.find(query_timeseries))

        occupancy_data = {}
        for doc in timeseries_documents:
            timestamp = doc['timestamp']
            hour = timestamp.replace(minute=0, second=0, microsecond=0)
            metadata_id = doc['metadata']['metadata_id']
            value = doc['value']

            if 'OrPresence' in metadata_id or 'OrLightControl' in metadata_id:
                if hour not in occupancy_data:
                    occupancy_data[hour] = []
                occupancy_data[hour].append(value)

        processed_data = []

        for hour, values in occupancy_data.items():
            occupancy_value = any(occupancy_data.get(hour, [False]))
            processed_data.append(OccupancyData(timestamp=hour, occupancy=occupancy_value))

        # Entourer les faux par des vrais sauf pour 12 heures
        for i in range(1, len(processed_data) - 1):
            if processed_data[i].occupancy == False and processed_data[i].timestamp.hour != 12:
                if processed_data[i - 1].occupancy == True and processed_data[i + 1].occupancy == True:
                    processed_data[i].occupancy = True

        return processed_data
    return []

# Route pour les données de température
@app.get("/temperature", response_model=List[TemperatureData])
async def get_temperature(space: int, start_date: datetime, end_date: datetime):
    return fetch_temperature_data(space, start_date, end_date)

# Route pour les données d'occupation
@app.get("/occupancy", response_model=List[OccupancyData])
async def get_occupancy(space: int, start_date: datetime, end_date: datetime):
    return fetch_occupancy_data(space, start_date, end_date)

@app.get("/aliases_by_etage")
async def get_aliases_by_etage_route(etage: int):
    aliases = get_aliases_by_etage(etage)
    return {"etage": etage, "aliases": aliases}
