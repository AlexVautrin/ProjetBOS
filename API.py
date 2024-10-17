from fastapi import FastAPI

app = FastAPI()


@app.get("/temperature")
async def root():
    return {"message": "Temperature value : 20"}        #TODO: change to actual value

@app.get("/occupancy")
async def root():
    return {"message": "Occupancy value : 1"}           #TODO: change to actual value
