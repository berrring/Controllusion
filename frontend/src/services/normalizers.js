export function unwrapApiData(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if ('data' in data && Object.keys(data).length === 1) {
    return data.data;
  }

  return data;
}

export function pickFirstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

export function normalizeUserRecord(data) {
  const payload = unwrapApiData(data);

  return (
    payload?.user ||
    payload?.profile ||
    payload?.account ||
    payload?.currentUser ||
    payload ||
    null
  );
}

export function normalizeListResponse(data, key) {
  const payload = unwrapApiData(data);

  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.[key] || payload?.items || payload?.content || [];
}
