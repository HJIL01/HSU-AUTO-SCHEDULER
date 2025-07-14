from fastapi import FastAPI
from pydantic import BaseModel
from schemas.constraints_schema import ConstraintsInputDataSchema

app = FastAPI()


class ConstraintsRequest(BaseModel):
    filtered_data: list[ConstraintsInputDataSchema]  # 또는 정확한 타입


@app.post("/constraints")
def echo(filteredData: ConstraintsRequest):
    print(filteredData)
    return {"received": "받기 성공"}
