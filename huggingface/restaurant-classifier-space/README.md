---
title: WinSpot Restaurant Classifier
emoji: 🍽️
colorFrom: yellow
colorTo: red
sdk: docker
pinned: false
---

# WinSpot Restaurant Classifier Space

This HuggingFace Space receives a Cloudinary image URL and returns whether the image looks like a restaurant, cafe, bar, pub, or food establishment.

This is the quick MVP classifier. It uses a zero-shot image model so you can test the full WinSpot backend flow before fine-tuning EfficientNet.

## API

### Health check

```http
GET /
```

### Prediction

```http
POST /predict
Content-Type: application/json
```

Request:

```json
{
  "image_url": "https://res.cloudinary.com/your-cloud/image/upload/example.jpg"
}
```

Response:

```json
{
  "is_restaurant": true,
  "confidence": 0.87,
  "scores": [
    { "label": "restaurant", "score": 0.87 },
    { "label": "not_restaurant", "score": 0.13 }
  ]
}
```

## Backend env value

After deployment, set this in `backend/.env`:

```env
HF_RESTAURANT_CLASSIFIER_ENDPOINT=https://YOUR_USERNAME-winspot-restaurant-classifier.hf.space/predict
```
