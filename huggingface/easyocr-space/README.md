---
title: WinSpot EasyOCR
emoji: 🔎
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# WinSpot EasyOCR Space

This HuggingFace Space receives a Cloudinary image URL, runs EasyOCR, and returns visible text for the WinSpot backend.

## API

### Health check

```http
GET /
```

### OCR prediction

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
  "visible_text": ["@PUB2WIN", "Cafe", "Menu"],
  "raw": [
    {
      "text": "@PUB2WIN",
      "confidence": 0.91,
      "box": [[10, 10], [120, 10], [120, 40], [10, 40]]
    }
  ]
}
```

## Backend env value

After deployment, set this in `backend/.env`:

```env
HF_EASYOCR_ENDPOINT=https://YOUR_USERNAME-winspot-easyocr.hf.space/predict
```

