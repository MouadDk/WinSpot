const DEFAULT_TIMEOUT_MS = 60000;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required for HuggingFace AI verification.`);
  return value;
}

function normalizeTextItems(raw) {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw
      .flatMap((item) => {
        if (typeof item === 'string') return item;
        if (typeof item?.text === 'string') return item.text;
        if (typeof item?.value === 'string') return item.value;
        if (typeof item?.word === 'string') return item.word;
        return [];
      })
      .map((text) => text.trim())
      .filter(Boolean);
  }

  if (typeof raw === 'string') {
    return raw
      .split(/\s+/)
      .map((text) => text.trim())
      .filter(Boolean);
  }

  return normalizeTextItems(raw.text ?? raw.words ?? raw.visible_text ?? raw.tags);
}

function normalizeClassifierResult(raw) {
  if (typeof raw?.is_restaurant === 'boolean') {
    return {
      isRestaurant: raw.is_restaurant,
      confidence: Number(raw.confidence ?? raw.score ?? 0)
    };
  }

  const predictions = Array.isArray(raw) ? raw : raw?.predictions ?? raw?.labels ?? [];
  const restaurantPrediction = predictions.find((prediction) => {
    const label = String(prediction?.label ?? prediction?.class ?? '').toLowerCase();
    return ['restaurant', 'cafe', 'pub', 'bar', 'food_establishment', 'food establishment'].some((term) => label.includes(term));
  });

  const score = Number(restaurantPrediction?.score ?? restaurantPrediction?.confidence ?? 0);
  return {
    isRestaurant: Boolean(restaurantPrediction && score >= Number(process.env.HF_RESTAURANT_THRESHOLD ?? 0.5)),
    confidence: Number.isFinite(score) ? score : 0
  };
}

async function postJson(endpoint, body) {
  const token = requireEnv('HF_TOKEN');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.HF_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS));

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { text };
      }
    }

    if (!response.ok) {
      const message = data?.error || data?.message || response.statusText;
      throw new Error(`HuggingFace request failed (${response.status}): ${message}`);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function classifyRestaurantImage(imageUrl) {
  const endpoint = requireEnv('HF_RESTAURANT_CLASSIFIER_ENDPOINT');
  const result = await postJson(endpoint, { image_url: imageUrl });
  return normalizeClassifierResult(result);
}

export async function extractImageText(imageUrl) {
  const endpoint = requireEnv('HF_EASYOCR_ENDPOINT');
  const result = await postJson(endpoint, { image_url: imageUrl });
  return normalizeTextItems(result);
}
