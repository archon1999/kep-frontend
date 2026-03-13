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

  private reconnectAttempts: number;

  private reconnectInterval: number;

  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  private reconnectCount = 0;

  private listeners = new Map<string, Set<Listener<unknown>>>();

  private pendingMessages: string[] = [];

  constructor(
    private url?: string,
    options: WebsocketServiceOptions = {},
  ) {
    this.reconnectAttempts = options.reconnectAttempts ?? 10;
    this.reconnectInterval = options.reconnectInterval ?? 5000;
  }

  connect() {
    if (!this.url) return;

    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)
    )
      return;

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.reconnectCount = 0;
      this.flushPendingMessages();
    };

    this.socket.onmessage = (event) => this.handleMessage(event);

    this.socket.onerror = () => {
      this.socket?.close();
    };

    this.socket.onclose = () => {
      this.socket = null;
      this.scheduleReconnect();
    };
  }

  send(event: string, data: unknown = {}) {
    if (!event) return;

    const payload = JSON.stringify({ event, data });

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(payload);
      return;
    }

    this.pendingMessages.push(payload);
    this.connect();
  }

  on<T>(event: string, listener: Listener<T>) {
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
    if (this.reconnectTimer || this.reconnectCount >= this.reconnectAttempts) return;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
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

export const wsService = new WebsocketService(import.meta.env.VITE_WS_URL, {
  reconnectAttempts: 10,
  reconnectInterval: 5000,
});

export type { WebsocketService };
export default wsService;
