from io import BytesIO

import easyocr
import numpy as np
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from PIL import Image


app = FastAPI(title="WinSpot EasyOCR")
reader = easyocr.Reader(["en"], gpu=False)


class PredictRequest(BaseModel):
    image_url: HttpUrl


def download_image(url: str) -> Image.Image:
    try:
        response = requests.get(url, timeout=20)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(status_code=400, detail=f"Could not download image: {exc}") from exc

    try:
        return Image.open(BytesIO(response.content)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {exc}") from exc


@app.get("/")
def health():
    return {"status": "ok", "service": "winspot-easyocr"}


@app.post("/predict")
def predict(payload: PredictRequest):
    image = download_image(str(payload.image_url))
    results = reader.readtext(np.array(image))

    raw = []
    visible_text = []

    for box, text, confidence in results:
        clean_text = text.strip()
        if not clean_text:
            continue

        visible_text.append(clean_text)
        raw.append(
            {
                "text": clean_text,
                "confidence": float(confidence),
                "box": [[float(x), float(y)] for x, y in box],
            }
        )

    return {
        "visible_text": visible_text,
        "raw": raw,
    }
