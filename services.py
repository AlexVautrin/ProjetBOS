import pandas as pd
from datetime import datetime
from typing import List
from models import OccupancyData, TemperatureData
from database import metadata, timeseries


def get_name_by_alias(alias: str) -> str:
    """
    Récupère le nom d'un espace basé sur son alias.
    """
    try:
        # Chargement du fichier CSV
        df = pd.read_csv('Filtered_Rooming.csv', delimiter=';')

        # Nettoyage des colonnes
        df['alias'] = df['alias'].astype(str).str.strip()
        df['Name'] = df['Name'].astype(str).str.strip()

        # Conversion de l'entrée en chaîne nettoyée
        alias = str(alias).strip()

        # Recherche insensible à la casse
        matching_row = df[df['alias'].str.lower() == alias.lower()]
        if not matching_row.empty:
            name = matching_row.iloc[0]['Name']
            print(f"Alias trouvé : {alias} -> {name}")
            return name
        else:
            print(f"Aucun alias correspondant trouvé pour : {alias}")
            return None
    except FileNotFoundError:
        print("Le fichier 'Filtered_Rooming.csv' est introuvable.")
        return None
    except Exception as e:
        print(f"Erreur lors de la lecture du fichier CSV : {e}")
        return None



def get_aliases_by_etage(etage: int) -> List[str]:
    """
    Récupère les alias pour un étage donné.
    """
    df = pd.read_csv('Filtered_Rooming_With_Etage.csv', delimiter=';')
    matching_rows = df[df['etage'] == etage]
    aliases = matching_rows['alias'].tolist()
    return aliases


def fetch_temperature_data(space: str, start_date: datetime, end_date: datetime) -> List[TemperatureData]:
    """
    Récupère les données de température pour un espace entre deux dates.
    """
    space = get_name_by_alias(space)
    print(f'{space} : space')
    if not space:
        return []

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
            temperature_data.setdefault(hour, []).append(value)

        return [
            TemperatureData(
                timestamp=hour,
                AvgTemperature=round(sum(values) / len(values)) if values else 0
            )
            for hour, values in temperature_data.items()
        ]
    return []


def fetch_occupancy_data(space: str, start_date: datetime, end_date: datetime) -> List[OccupancyData]:
    """
    Récupère les données d'occupation pour un espace entre deux dates.
    """
    space = get_name_by_alias(space)
    if not space:
        return []

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
            value = doc['value']
            occupancy_data.setdefault(hour, []).append(value)

        processed_data = []
        for hour, values in occupancy_data.items():
            occupancy_value = any(values)
            processed_data.append(OccupancyData(timestamp=hour, occupancy=occupancy_value))

        return processed_data
    return []
