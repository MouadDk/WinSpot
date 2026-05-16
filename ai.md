# AI Fine-Tuning Plan

This file explains what we will fine-tune, why we fine-tune it, what data we need, and how to measure the difference between the old AI and the new AI.

## Goal

The AI verification system has two jobs:

1. Check if the uploaded image looks like a real restaurant, cafe, bar, pub, or food establishment.
2. Check if the image contains the required campaign tag, for example `@PUB2WIN`.

These two jobs are different. We should not fine-tune one big model for everything at the start.

Better plan:

1. Fine-tune the restaurant image classifier first.
2. Use EasyOCR for text extraction.
3. Improve OCR later only if tag detection is weak.

## What We Will Fine-Tune

We will fine-tune an EfficientNet image classifier.

The classifier answers this question:

```text
Does this image show a restaurant, cafe, bar, pub, or food establishment?
```

It should return:

```json
{
  "is_restaurant": true,
  "confidence": 0.93
}
```

or:

```json
{
  "is_restaurant": false,
  "confidence": 0.88
}
```

## What We Will Not Fine-Tune First

We will not fine-tune EasyOCR at the beginning.

Reason:

- EasyOCR is already good for many normal text cases.
- Most tag failures can be improved with better image quality, normalization, and post-processing.
- Fine-tuning OCR needs more complex labeled data, usually text boxes or exact text labels.

So the first version is:

```text
Restaurant detection: fine-tuned EfficientNet
Tag extraction: hosted EasyOCR + backend text cleanup
```

## Why EfficientNet

EfficientNet is a good fit because:

- It is smaller and cheaper than a vision-language model like LLaVA.
- It is fast enough for production verification.
- It is good at image classification.
- It can run on HuggingFace as an endpoint.
- It only needs labeled images, not complex conversations or prompts.

The old LLaVA approach is more flexible, but it is slower, heavier, and harder to control.

## Classes

Start with two classes:

```text
restaurant
not_restaurant
```

The `restaurant` class should include:

- restaurants
- cafes
- bars
- pubs
- bakeries
- food courts
- visible dining areas
- menu boards
- counters with food/drinks
- recognizable venue interiors

The `not_restaurant` class should include:

- bedrooms
- bathrooms
- streets with no venue context
- cars
- random selfies
- screenshots
- memes
- product-only photos with no venue
- plain walls
- fake uploads
- unrelated shops if food context is not visible

Later we can expand to more classes:

```text
restaurant
cafe
bar_pub
not_food_place
unclear
```

But for the MVP, two classes are easier and better.

## Training Data We Need

Each training item needs:

1. Image URL or image file.
2. Label: `restaurant` or `not_restaurant`.
3. Optional notes about why the label was chosen.

Example:

```json
{
  "image": "cloudinary-url-or-local-path.jpg",
  "label": "restaurant",
  "notes": "Cafe interior with tables, counter, and menu visible"
}
```

## Where The Data Comes From

The app already saves uploaded verification images in MongoDB through `FineTuneData`.

Each record stores:

- Cloudinary image URL
- AI prediction
- OCR text
- admin status
- transaction id
- created date

Admin review is important because it becomes our truth source.

If admin approves an image, it probably belongs in the `restaurant` class.

If admin denies an image, it may belong in `not_restaurant`, but we must check why it was denied.

Important:

An image can be denied because it is missing the tag, even if it is a restaurant.

So we cannot blindly convert every denied image into `not_restaurant`.

## Labeling Rules

Use these rules when creating the training dataset.

### Label As `restaurant`

Use `restaurant` when the image clearly shows:

- a dining space
- restaurant/cafe/bar/pub interior
- table with food and venue context
- counter or menu board
- staff/customer area inside a food establishment
- recognizable food/drink establishment exterior with signage

### Label As `not_restaurant`

Use `not_restaurant` when the image clearly shows:

- no food venue
- random object
- home/private room
- street with no restaurant context
- screenshot
- selfie only
- blank or edited image
- unrelated business

### Skip Or Label Later

Skip images that are too unclear:

- very blurry
- too dark
- only a close-up of food with no venue context
- cropped too tightly
- mixed scene
- impossible to judge

Later we can create an `unclear` class, but not in the first model.

## Dataset Format

Recommended folder structure:

```text
dataset/
  train/
    restaurant/
      image001.jpg
      image002.jpg
    not_restaurant/
      image003.jpg
      image004.jpg
  validation/
    restaurant/
      image101.jpg
      image102.jpg
    not_restaurant/
      image103.jpg
      image104.jpg
  test/
    restaurant/
      image201.jpg
      image202.jpg
    not_restaurant/
      image203.jpg
      image204.jpg
```

Recommended split:

```text
70% train
15% validation
15% test
```

The test set must be kept separate. Do not train on it.

## Minimum Dataset Size

For a first test:

```text
restaurant: 100 images
not_restaurant: 100 images
```

For a better MVP:

```text
restaurant: 500+ images
not_restaurant: 500+ images
```

For stronger production behavior:

```text
restaurant: 2,000+ images
not_restaurant: 2,000+ images
```

Quality matters more than quantity. Bad labels will make the model worse.

## What We Compare

We compare:

```text
Old AI: local LLaVA restaurant decision
New AI: fine-tuned EfficientNet restaurant classifier
```

We also track:

```text
Old OCR: Tesseract + Jimp
New OCR: hosted EasyOCR
```

But the main fine-tuning comparison is the restaurant classifier.

## How To See The Difference

Create a fixed test set of images that never changes.

Example:

```text
test/
  50 clear restaurant images
  50 clear not-restaurant images
  20 difficult edge cases
```

Run both systems on the same images.

For each image, record:

```text
actual_label
old_ai_prediction
new_ai_prediction
old_ai_confidence
new_ai_confidence
admin_decision
notes
```

Example table:

| Image | Actual | Old LLaVA | New EfficientNet | Result |
|---|---|---|---|---|
| cafe_001.jpg | restaurant | false | true | new better |
| bedroom_001.jpg | not_restaurant | true | false | new better |
| food_closeup_001.jpg | unclear | true | true | needs review |

## Metrics To Measure

Use these metrics:

### Accuracy

How often the model is correct.

```text
accuracy = correct predictions / total images
```

Example:

```text
90 correct out of 100 = 90% accuracy
```

### Precision

When the model says `restaurant`, how often is it really a restaurant?

High precision means fewer fake approvals.

This matters because we do not want to reward bad uploads.

### Recall

Of all real restaurant images, how many did the model catch?

High recall means fewer good influencer uploads get rejected.

### False Positives

The model says restaurant, but the image is not a restaurant.

This is dangerous because it can approve bad uploads.

### False Negatives

The model says not restaurant, but the image is a real restaurant.

This is annoying because real users get denied.

## Which Metric Matters Most

For Pub2Win, false positives are more dangerous than false negatives.

Reason:

- False positive means someone can upload a fake image and maybe get paid.
- False negative means a real user may need admin review or retry.

So we prefer:

```text
high precision first
good recall second
```

Target MVP:

```text
precision: 90%+
recall: 80%+
accuracy: 85%+
```

Target production:

```text
precision: 95%+
recall: 90%+
accuracy: 92%+
```

## Confidence Threshold

The backend uses:

```env
HF_RESTAURANT_THRESHOLD=0.5
```

If the model returns:

```json
{ "label": "restaurant", "score": 0.72 }
```

Then:

```text
0.72 >= 0.5 = restaurant
```

If fake approvals are too high, increase the threshold:

```env
HF_RESTAURANT_THRESHOLD=0.7
```

If real restaurant uploads are rejected too often, lower it:

```env
HF_RESTAURANT_THRESHOLD=0.4
```

Do not choose the threshold by guessing. Choose it after testing on the fixed test set.

## Before And After Test Template

Use this table after each model version.

| Metric | Old LLaVA | New EfficientNet v1 | Difference |
|---|---:|---:|---:|
| Accuracy |  |  |  |
| Precision |  |  |  |
| Recall |  |  |  |
| False positives |  |  |  |
| False negatives |  |  |  |
| Average response time |  |  |  |
| Average cost/request |  |  |  |

We should only call the new model better if:

- precision improves or stays high
- response time improves
- cost/request improves
- false positives decrease
- admin has fewer wrong AI decisions to correct

## OCR Difference

OCR is separate from restaurant classification.

We compare:

```text
Old: Tesseract + Jimp preprocessing
New: EasyOCR hosted on HuggingFace
```

Test images should include tags like:

```text
@PUB2WIN
#PUB2WIN
PUB2WIN
@ PUB2 WIN
```

Track:

| Image | Actual Tag | Tesseract Output | EasyOCR Output | Winner |
|---|---|---|---|---|
| tag_001.jpg | @PUB2WIN | B2WIN | @PUB2WIN | EasyOCR |
| tag_002.jpg | @PUB2WIN | PUB2WIN | PUB2WIN | tie |

OCR success means:

```text
backend can detect the required tag after normalization
```

It does not need to read every word perfectly.

## Data We Should Save For Future Training

For every uploaded image, save:

- image URL
- OCR output
- classifier prediction
- classifier confidence
- expected tag
- whether tag matched
- admin decision
- denial reason
- final transaction status

This lets us build better datasets later.

Example:

```json
{
  "imageUrl": "https://res.cloudinary.com/...",
  "visible_text": ["@PUB2WIN", "Cafe"],
  "is_restaurant": true,
  "restaurant_confidence": 0.91,
  "expected_tag": "@PUB2WIN",
  "has_tag": true,
  "adminStatus": "approved",
  "notes": "Correct restaurant and tag"
}
```

## Model Versions

Use clear model version names:

```text
restaurant-efficientnet-v1
restaurant-efficientnet-v2
restaurant-efficientnet-v3
```

Keep a record of:

- training date
- dataset size
- class balance
- validation accuracy
- test accuracy
- threshold used
- known weaknesses

Example:

```text
Model: restaurant-efficientnet-v1
Date: 2026-05-15
Train images: 700
Validation images: 150
Test images: 150
Threshold: 0.65
Precision: 92%
Recall: 84%
Weakness: close-up food photos without visible venue context
```

## Fine-Tuning Steps

High-level steps:

1. Export reviewed images from MongoDB.
2. Manually label or verify labels.
3. Split images into train, validation, and test folders.
4. Fine-tune EfficientNet.
5. Evaluate on the fixed test set.
6. Choose a confidence threshold.
7. Upload the model to HuggingFace.
8. Update `HF_RESTAURANT_CLASSIFIER_ENDPOINT`.
9. Test with real app uploads.
10. Compare admin correction rate before and after.

## How To Know It Is Better In The Real App

Offline test metrics are useful, but the real proof is production behavior.

Track weekly:

```text
total uploaded images
AI approved count
AI denied count
admin approved after AI approved
admin denied after AI approved
admin approved after AI denied
admin denied after AI denied
average verification time
```

Important rates:

```text
AI false approval rate = admin denied after AI approved / AI approved count
AI false denial rate = admin approved after AI denied / AI denied count
```

The new model is better if:

- admin changes fewer AI decisions
- fake uploads are caught more often
- real restaurant uploads pass more often
- response time is faster than LLaVA
- server no longer depends on local Ollama

## First MVP Recommendation

For the first production-ready AI setup:

1. Use Cloudinary for every uploaded image.
2. Use EasyOCR on HuggingFace for tag extraction.
3. Fine-tune EfficientNet with two classes: `restaurant`, `not_restaurant`.
4. Keep admin review required before payment.
5. Save every admin decision for the next training dataset.
6. Re-train when you have at least 500 good reviewed examples.

## Summary

We fine-tune the restaurant classifier, not the OCR system first.

The difference is measured by testing old vs new on the same fixed image set and tracking real admin corrections in the app.

The best model is not the one that sounds smartest. The best model is the one that:

- rejects fake uploads
- accepts real venue uploads
- finds required tags reliably with OCR
- responds quickly
- costs less
- creates less manual work for admin

