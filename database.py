from pymongo import MongoClient

# Configuration de la connexion MongoDB
client = MongoClient('mongodb+srv://dijon_eseo_estp:TARCjcsFLhh60yRi@dijon.j7vi7.mongodb.net/')
db = client['OnDijon']
metadata = db['metadata']
timeseries = db['timeseries']
