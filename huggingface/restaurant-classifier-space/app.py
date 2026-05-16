from io import BytesIO

import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from PIL import Image
from transformers import pipeline


app = FastAPI(title="WinSpot Restaurant Classifier")

classifier = pipeline(
    task="zero-shot-image-classification",
    model="openai/clip-vit-base-patch32",
)


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
    return {"status": "ok", "service": "winspot-restaurant-classifier"}


@app.post("/predict")
def predict(payload: PredictRequest):
    image = download_image(str(payload.image_url))

    predictions = classifier(
        image,
        candidate_labels=[
            "restaurant",
            "cafe",
            "bar",
            "pub",
            "food establishment",
            "not restaurant",
            "home",
            "street",
            "selfie",
            "screenshot",
        ],
    )

    positive_labels = {"restaurant", "cafe", "bar", "pub", "food establishment"}
    positive_score = sum(
        float(item["score"])
        for item in predictions
        if item["label"].lower() in positive_labels
    )
    negative_score = max(0.0, 1.0 - positive_score)

    return {
        "is_restaurant": positive_score >= 0.5,
        "confidence": positive_score,
        "scores": [
            {"label": "restaurant", "score": positive_score},
            {"label": "not_restaurant", "score": negative_score},
        ],
        "raw": predictions,
    }

