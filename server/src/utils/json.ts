export function safelyParseJSON<T>(text: string) {
  try {
    const out = JSON.parse(text) as T;
    return out;
  } catch (e) {
    return null;
  }
}
