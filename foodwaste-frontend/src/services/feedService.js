export const connectFeed = (onEvent) => {
  const source = new EventSource('/api/feed/live');
  source.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      onEvent(data);
    } catch {
      // ignore parse errors
    }
  };
  source.onerror = () => source.close();
  return () => source.close();
};

export const fetchRecentFeed = async () => {
  const res = await fetch('/api/feed/recent');
  if (!res.ok) throw new Error('Failed to load feed');
  return res.json();
};
