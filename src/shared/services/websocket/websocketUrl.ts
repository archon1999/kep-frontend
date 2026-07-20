interface WebsocketLocation {
  protocol: string;
  host: string;
}

export const resolveWebsocketUrl = (
  configuredUrl: string | undefined,
  location: WebsocketLocation | undefined,
) => {
  const normalizedUrl = configuredUrl?.trim();

  if (normalizedUrl) {
    return normalizedUrl;
  }

  if (!location?.host) {
    return undefined;
  }

  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${location.host}/ws/`;
};
