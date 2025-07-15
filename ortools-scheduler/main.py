import json

from fastapi import FastAPI
from schemas.request.CP_SAT_request_schema import CPSATRequestSchema
from services.CP_SAT import HSU_AUTO_SCHEDULER_CP_SAT

app = FastAPI()


@app.post("/cp-sat")
def cp_sat(cp_sat_request: CPSATRequestSchema):
    filtered_data = cp_sat_request.filtered_data
    constraints = cp_sat_request.constraints

    # data_as_dicts = [course.dict(exclude_none=True) for course in filtered_data]
    # print(json.dumps(data_as_dicts, indent=2, ensure_ascii=False))

    reseponse_data = HSU_AUTO_SCHEDULER_CP_SAT(filtered_data, constraints)
    return reseponse_data
