from fastapi import FastAPI

app = FastAPI()


@app.get("/temperature")
async def root():
    return {"message": "Temperature value : 20"}

@app.get("/occupancy")
async def root():
    return {"message": "Occupancy value : 1"}
