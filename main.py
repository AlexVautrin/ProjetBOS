from datetime import datetime
from fastapi import FastAPI, Query, HTTPException
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from database import metadata, timeseries
from models import OccupancyData, TemperatureData
from services import fetch_temperature_data, fetch_occupancy_data, get_aliases_by_etage

app = FastAPI()

# Configuration CORS
origins = [
    "http://localhost:5000",  # À remplacer par l'URL de votre frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/temperature", response_model=List[TemperatureData])
async def get_temperature(space: str, start_date: datetime, end_date: datetime):
    """
    Récupère les données de température pour un espace donné entre deux dates.
    """
    if start_date >= end_date:
        raise HTTPException(status_code=400, detail="La date de début doit être antérieure à la date de fin.")
    return fetch_temperature_data(space, start_date, end_date)


@app.get("/occupancy", response_model=List[OccupancyData])
async def get_occupancy(space: str, start_date: datetime, end_date: datetime):
    """
    Récupère les données d'occupation pour un espace donné entre deux dates.
    """
    if start_date >= end_date:
        raise HTTPException(status_code=400, detail="La date de début doit être antérieure à la date de fin.")
    return fetch_occupancy_data(space, start_date, end_date)


@app.get("/aliases_by_etage")
async def get_aliases_by_etage_route(etage: int = Query(..., ge=0)):
    """
    Retourne les alias des espaces pour un étage donné.
    """
    aliases = get_aliases_by_etage(etage)
    if not aliases:
        raise HTTPException(status_code=404, detail=f"Aucun alias trouvé pour l'étage {etage}.")
    return {"etage": etage, "aliases": aliases}
