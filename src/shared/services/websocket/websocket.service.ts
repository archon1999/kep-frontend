import { resolveWebsocketUrl } from './websocketUrl.ts';

interface WebsocketMessage<T> {
  event: string;
  data: T;
}

type Listener<T> = (data: T) => void;

interface WebsocketServiceOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

class WebsocketService {
  private socket: WebSocket | null = null;

  private url?: string;

  private enabled = false;

  private reconnectAttempts: number;

  private reconnectInterval: number;

  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  private reconnectCount = 0;

  private listeners = new Map<string, Set<Listener<unknown>>>();

  private pendingMessages: string[] = [];

  constructor(url?: string, options: WebsocketServiceOptions = {}) {
    this.url = url;
    this.reconnectAttempts = options.reconnectAttempts ?? 10;
    this.reconnectInterval = options.reconnectInterval ?? 5000;
  }

  setEnabled(enabled: boolean) {
    if (this.enabled === enabled) return;

    this.enabled = enabled;

    if (enabled) return;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.reconnectCount = 0;
    this.pendingMessages = [];
    this.listeners.clear();

    const socket = this.socket;
    this.socket = null;
    socket?.close();
  }

  connect() {
    if (!this.enabled || !this.url) return;

    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)
    )
      return;

    const socket = new WebSocket(this.url);
    this.socket = socket;

    socket.onopen = () => {
      if (this.socket !== socket || !this.enabled) return;

      this.reconnectCount = 0;
      this.flushPendingMessages();
    };

    socket.onmessage = (event) => {
      if (this.socket === socket && this.enabled) {
        this.handleMessage(event);
      }
    };

    socket.onerror = () => {
      socket.close();
    };

    socket.onclose = () => {
      if (this.socket !== socket) return;

      this.socket = null;
      this.scheduleReconnect();
    };
  }

  send(event: string, data: unknown = {}) {
    if (!this.enabled || !event) return;

    const payload = JSON.stringify({ event, data });

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(payload);
      return;
    }

    this.pendingMessages.push(payload);
    this.connect();
  }

  on<T>(event: string, listener: Listener<T>) {
    if (!this.enabled || !event) return () => {};

    this.connect();

    const existingListeners = this.listeners.get(event) ?? new Set<Listener<unknown>>();
    existingListeners.add(listener as Listener<unknown>);
    this.listeners.set(event, existingListeners);

    return () => {
      const listeners = this.listeners.get(event);
      listeners?.delete(listener as Listener<unknown>);

      if (listeners?.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  private handleMessage(event: MessageEvent) {
    try {
      const parsed = JSON.parse(event.data) as WebsocketMessage<unknown>;

      if (!parsed.event) return;

      const listeners = this.listeners.get(parsed.event);
      listeners?.forEach((listener) => listener(parsed.data));
    } catch (error) {
      console.error('WebSocket parse error', error);
    }
  }

  private scheduleReconnect() {
    if (
      !this.enabled ||
      this.reconnectTimer ||
      this.reconnectCount >= this.reconnectAttempts
    )
      return;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;

      if (!this.enabled) return;

      this.reconnectCount += 1;
      this.connect();
    }, this.reconnectInterval);
  }

  private flushPendingMessages() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    while (this.pendingMessages.length > 0) {
      const message = this.pendingMessages.shift();

      if (message) {
        this.socket.send(message);
      }
    }
  }
}

export const wsService = new WebsocketService(
  resolveWebsocketUrl(
    import.meta.env?.VITE_WS_URL,
    typeof window === 'undefined' ? undefined : window.location,
  ),
  {
    reconnectAttempts: 10,
    reconnectInterval: 5000,
  },
);

export { WebsocketService };
export default wsService;
