# AI Verification Workflow: Cloudinary + HuggingFace

This guide explains the new AI flow from zero: what to create, how to configure it, how the backend uses it, and how to test it.

## What This Replaces

Old flow:

1. User uploads a publication image.
2. Backend saves the image locally in `backend/uploads`.
3. Backend uses local Tesseract + Jimp to read text.
4. Backend uses local Ollama/LLaVA to decide if the image is a restaurant.

New flow:

1. User uploads a publication image.
2. Backend uploads the image to Cloudinary.
3. Cloudinary returns a public image URL.
4. Backend sends that URL to HuggingFace EasyOCR.
5. Backend sends that URL to your HuggingFace EfficientNet restaurant classifier.
6. Backend saves the result in MongoDB for admin review.
7. Admin approves or denies the reward.

## Workflow Diagram

```mermaid
sequenceDiagram
    participant Influencer
    participant Frontend
    participant Backend
    participant Cloudinary
    participant HF_OCR as HuggingFace EasyOCR
    participant HF_Classifier as HuggingFace EfficientNet
    participant MongoDB
    participant Admin

    Influencer->>Frontend: Upload publication image
    Frontend->>Backend: POST /api/ai/verify-scan
    Backend->>Backend: Validate influencer JWT
    Backend->>Cloudinary: Upload image buffer
    Cloudinary-->>Backend: Return secure_url
    Backend->>HF_OCR: Send image_url
    Backend->>HF_Classifier: Send image_url
    HF_OCR-->>Backend: Return visible text/tags
    HF_Classifier-->>Backend: Return restaurant prediction
    Backend->>Backend: Check required tag + restaurant result
    Backend->>MongoDB: Save FineTuneData review item
    Backend->>MongoDB: Mark transaction in_review
    Backend-->>Frontend: Return AI result and review status
    Admin->>Backend: Approve/deny in admin dashboard
    Backend->>MongoDB: Complete or fail transaction
```

## Files Involved

| File | Purpose |
|---|---|
| `backend/src/routes/aiRoutes.js` | Main upload endpoint: `/api/ai/verify-scan` |
| `backend/src/services/cloudinaryStorage.js` | Uploads image buffers to Cloudinary |
| `backend/src/services/huggingFaceVision.js` | Calls HuggingFace OCR and classifier endpoints |
| `backend/src/ai/imageanalyse.js` | Combines OCR + classifier into one result |
| `backend/src/models/FineTuneData.js` | Stores AI review items for the admin dashboard |
| `backend/.env` | Your private keys and endpoint URLs |
| `backend/.env.example` | Template showing required env variables |

## Accounts You Need

You need these before the full flow can work:

1. MongoDB Atlas account or a local MongoDB server.
2. Cloudinary account.
3. HuggingFace account.
4. A HuggingFace Space or Inference Endpoint for EasyOCR.
5. A HuggingFace Space or Inference Endpoint for the restaurant classifier.
6. Optional later: Meta Developer account for Instagram API.

## Step 1: Configure MongoDB

You can use MongoDB Atlas or local MongoDB.

### Option A: MongoDB Atlas

1. Create an account at `https://www.mongodb.com/products/platform/atlas-database`.
2. Create a free cluster.
3. Go to Database Access.
4. Create a database user and password.
5. Go to Network Access.
6. Add your current IP address.
7. Go to Connect.
8. Copy the Node.js connection string.
9. Replace `<user>`, `<password>`, and database name.

Example:

```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/winspot?retryWrites=true&w=majority
```

### Option B: Local MongoDB

Install MongoDB locally and use:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/winspot
```

## Step 2: Configure Cloudinary

1. Create a free Cloudinary account at `https://cloudinary.com`.
2. Open the Cloudinary dashboard.
3. Copy:
   - Cloud name
   - API key
   - API secret
4. Add them to `backend/.env`.

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_FOLDER=winspot/ai-verification
AI_UPLOAD_MAX_BYTES=10485760
```

`AI_UPLOAD_MAX_BYTES=10485760` means the upload limit is 10 MB.

## Step 3: Create HuggingFace Token

1. Create a HuggingFace account at `https://huggingface.co`.
2. Go to Settings.
3. Open Access Tokens.
4. Create a token.
5. Use a token with permission to call your Spaces or Inference Endpoints.
6. Add it to `backend/.env`.

```env
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 4: Create the EasyOCR Service

The backend expects an endpoint that accepts:

```json
{
  "image_url": "https://res.cloudinary.com/..."
}
```

And returns one of these shapes:

```json
{
  "text": ["@PUB2WIN", "Restaurant Name"]
}
```

or:

```json
{
  "visible_text": ["@PUB2WIN", "Restaurant Name"]
}
```

or:

```json
[
  { "text": "@PUB2WIN" },
  { "text": "Restaurant Name" }
]
```

### Simple HuggingFace Space Example

This repo now includes a ready template here:

```text
huggingface/easyocr-space/
```

Upload those files to a new HuggingFace Space and choose Docker as the SDK.

Create a new HuggingFace Space:

1. Go to HuggingFace.
2. Click New Space.
3. Choose SDK: Docker or Gradio.
4. Name it something like `winspot-easyocr`.
5. Add an API route that receives `image_url`.
6. Download the image from the URL.
7. Run EasyOCR.
8. Return JSON text results.

Your EasyOCR service should behave like this:

```js
POST /predict
Content-Type: application/json

{
  "image_url": "https://res.cloudinary.com/demo/image/upload/example.jpg"
}
```

Expected response:

```json
{
  "visible_text": ["@PUB2WIN", "Cafe", "Menu"]
}
```

Then add the final endpoint URL to `backend/.env`:

```env
HF_EASYOCR_ENDPOINT=https://your-easyocr-url
```

## Step 5: Create the Restaurant Classifier

The backend expects an endpoint that accepts:

```json
{
  "image_url": "https://res.cloudinary.com/..."
}
```

And returns one of these shapes:

```json
{
  "is_restaurant": true,
  "confidence": 0.93
}
```

or:

```json
[
  { "label": "restaurant", "score": 0.93 },
  { "label": "not_restaurant", "score": 0.07 }
]
```

### How to Build the Classifier

For the fastest first test, this repo includes a ready zero-shot classifier template:

```text
huggingface/restaurant-classifier-space/
```

Upload those files to a new HuggingFace Space and choose Docker as the SDK. This lets you test the full app workflow before collecting enough images for a real EfficientNet fine-tune.

The real production version should later be a fine-tuned EfficientNet model.

1. Collect restaurant, cafe, bar, pub, and non-restaurant images.
2. Label them with classes like:
   - `restaurant`
   - `not_restaurant`
3. Fine-tune EfficientNet using Python.
4. Upload the model to HuggingFace.
5. Serve it with a Space or Inference Endpoint.
6. Make sure the endpoint accepts `image_url` and returns JSON.

Add the endpoint URL to `backend/.env`:

```env
HF_RESTAURANT_CLASSIFIER_ENDPOINT=https://your-classifier-url
HF_RESTAURANT_THRESHOLD=0.5
HF_TIMEOUT_MS=60000
```

If the classifier returns `restaurant` with score `0.5` or higher, the backend treats the image as a restaurant.

## Step 6: Configure Backend `.env`

Create `backend/.env` if it does not exist.

Minimum local config:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/winspot
JWT_SECRET=replace_this_with_a_long_random_secret
ADMIN_SECRET=replace_this_admin_password
ADMIN_EMAILS=admin@example.com

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_FOLDER=winspot/ai-verification
AI_UPLOAD_MAX_BYTES=10485760

HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxx
HF_RESTAURANT_CLASSIFIER_ENDPOINT=https://your-classifier-url
HF_EASYOCR_ENDPOINT=https://your-easyocr-url
HF_RESTAURANT_THRESHOLD=0.5
HF_TIMEOUT_MS=60000

INSTAGRAM_CLIENT_ID=not_needed_yet
INSTAGRAM_CLIENT_SECRET=not_needed_yet
```

Generate a strong `JWT_SECRET`. In PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 7: Install Dependencies

From the repo root:

```powershell
npm install
```

If PowerShell blocks `npm`, use:

```powershell
npm.cmd install
```

## Step 8: Start the Backend

From the repo root:

```powershell
npm.cmd run dev:backend
```

Expected output:

```text
Backend listening on http://localhost:4000
```

If MongoDB is not running or the URI is wrong, the server will fail during startup.

## Step 9: Start the Frontend

In another terminal:

```powershell
npm.cmd run dev:frontend
```

Open the frontend URL shown by Vite, usually:

```text
http://localhost:5173
```

## Step 10: Test Basic Backend Health

```powershell
curl.exe http://localhost:4000/api/health
```

Expected:

```json
{
  "status": "ok"
}
```

The exact message may vary, but it should return success.

## Step 11: Test Cloudinary Only

Before testing the full AI flow, verify Cloudinary credentials by uploading through the app or by calling the route with a real token.

The route requires an influencer JWT:

```http
POST /api/ai/verify-scan
Authorization: Bearer <INFLUENCER_TOKEN>
Content-Type: multipart/form-data
```

Fields:

| Field | Required | Description |
|---|---:|---|
| `photo` | yes | Image file |
| `transactionId` | yes for app flow | Pending transaction id |
| `requiredTag` | no | Defaults to `@PUB2WIN` |

If Cloudinary is misconfigured, backend logs will show:

```text
Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.
```

## Step 12: Get an Influencer Token

The easiest way is through the frontend after logging in as an influencer.

In the browser console:

```js
localStorage.getItem('token')
```

If this app stores the token differently, inspect the login code in:

```text
frontendWeb/src/pages/InfluencerAuth.jsx
```

You can also use the actual frontend QR upload flow instead of calling the API manually.

## Step 13: Manual API Test With Curl

After you have:

- backend running
- MongoDB running
- Cloudinary configured
- HuggingFace OCR endpoint configured
- HuggingFace classifier endpoint configured
- influencer JWT token
- a pending transaction id

Run:

```powershell
curl.exe -X POST http://localhost:4000/api/ai/verify-scan `
  -H "Authorization: Bearer <INFLUENCER_TOKEN>" `
  -F "photo=@C:\path\to\your\test-image.jpg" `
  -F "transactionId=<TRANSACTION_ID>" `
  -F "requiredTag=@PUB2WIN"
```

Expected success response:

```json
{
  "success": true,
  "status": "approved",
  "reason": "Valid tag and location detected! Waiting for admin approval.",
  "image_url": "https://res.cloudinary.com/...",
  "ai_data": {
    "visible_text": ["@PUB2WIN"],
    "is_restaurant": true,
    "restaurant_confidence": 0.93
  }
}
```

The transaction will still be `in_review` until admin approval.

## Step 14: Test From the App UI

1. Start backend.
2. Start frontend.
3. Create or log in as a merchant.
4. Create an offer.
5. Generate a QR code.
6. Log in as an influencer.
7. Scan or enter the QR token.
8. Upload a publication image.
9. Backend uploads it to Cloudinary.
10. Backend sends the Cloudinary URL to HuggingFace.
11. Image appears in admin dashboard AI review.
12. Admin approves or denies.

## Step 15: Admin Review

The AI does not directly pay the influencer. It creates an admin review item.

Admin flow:

1. Admin opens dashboard.
2. Admin goes to AI review/fine-tune section.
3. Admin sees:
   - uploaded image
   - OCR text
   - restaurant classifier result
   - pending transaction
4. Admin clicks approve or deny.

Approve:

- `FineTuneData.adminStatus` becomes `approved`.
- transaction becomes `completed`.
- influencer receives WinCoins.

Deny:

- `FineTuneData.adminStatus` becomes `denied`.
- transaction becomes `failed`.
- influencer does not receive WinCoins.

## How Tag Matching Works

The backend currently defaults to:

```text
@PUB2WIN
```

OCR can return messy text, so the backend normalizes tags.

Examples that still match:

```text
@PUB2WIN
PUB2WIN
@ PUB2 WIN
pub2win
```

The backend removes spaces and punctuation except `@` and `#`, then compares uppercase text.

## HuggingFace Response Compatibility

The OCR service can return:

```json
{ "text": ["@PUB2WIN"] }
```

or:

```json
{ "visible_text": ["@PUB2WIN"] }
```

or:

```json
[{ "text": "@PUB2WIN" }]
```

The classifier can return:

```json
{ "is_restaurant": true, "confidence": 0.9 }
```

or:

```json
[{ "label": "restaurant", "score": 0.9 }]
```

## Common Errors

### `JWT_SECRET environment variable is not set`

Add this to `backend/.env`:

```env
JWT_SECRET=your_long_random_secret
```

### `Cloudinary is not configured`

Add:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### `HF_TOKEN is required`

Add:

```env
HF_TOKEN=hf_...
```

### `HF_EASYOCR_ENDPOINT is required`

Add:

```env
HF_EASYOCR_ENDPOINT=https://your-easyocr-url
```

### `HF_RESTAURANT_CLASSIFIER_ENDPOINT is required`

Add:

```env
HF_RESTAURANT_CLASSIFIER_ENDPOINT=https://your-classifier-url
```

### HuggingFace returns 404

Check:

- endpoint URL is correct
- endpoint is running
- endpoint accepts POST
- you included the correct path, for example `/predict` if your service needs it

### HuggingFace returns 401 or 403

Check:

- `HF_TOKEN` is correct
- token has access to the endpoint
- private Space/Endpoint permissions allow your token

### Upload works but AI always denies

Check:

- OCR response includes the required tag.
- classifier response has label `restaurant`, `cafe`, `pub`, `bar`, `food_establishment`, or returns `is_restaurant: true`.
- `HF_RESTAURANT_THRESHOLD` is not too high.

## Instagram Note

Do not build new work on Instagram Basic Display API. Meta shut it down on December 4, 2024.

For this project, the future Instagram path should be:

1. Influencers only.
2. Require Instagram creator/business accounts if you need media insights or professional account features.
3. Use Instagram API with Instagram Login or Facebook Login.
4. Store Instagram connection data on the influencer profile.
5. Use Instagram API later to verify published media where possible.

For now, the AI upload flow works independently of Instagram.

## Minimum End-to-End Checklist

Use this when setting up from nothing:

```text
[ ] MongoDB URI configured
[ ] JWT_SECRET configured
[ ] Backend starts
[ ] Cloudinary account created
[ ] Cloudinary env vars configured
[ ] HuggingFace account created
[ ] HF_TOKEN configured
[ ] EasyOCR endpoint created and tested
[ ] EfficientNet classifier endpoint created and tested
[ ] HF endpoint URLs added to backend/.env
[ ] Frontend starts
[ ] Influencer account can log in
[ ] QR scan creates pending transaction
[ ] Image upload returns success
[ ] Admin dashboard shows review item
[ ] Admin approval completes transaction
```
