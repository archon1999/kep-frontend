import assert from 'node:assert/strict';
import test from 'node:test';
import { WebsocketService } from './websocket.service.ts';

class FakeWebSocket {
  static readonly CONNECTING = 0;

  static readonly OPEN = 1;

  static readonly CLOSING = 2;

  static readonly CLOSED = 3;

  static instances: FakeWebSocket[] = [];

  readonly url: string;

  readonly sent: string[] = [];

  readyState = FakeWebSocket.CONNECTING;

  onopen: (() => void) | null = null;

  onmessage: ((event: MessageEvent) => void) | null = null;

  onerror: (() => void) | null = null;

  onclose: (() => void) | null = null;

  constructor(url: string) {
    this.url = url;
    FakeWebSocket.instances.push(this);
  }

  open() {
    this.readyState = FakeWebSocket.OPEN;
    this.onopen?.();
  }

  send(message: string) {
    this.sent.push(message);
  }

  emit(data: string) {
    this.onmessage?.({ data } as MessageEvent);
  }

  close() {
    if (this.readyState === FakeWebSocket.CLOSED) return;

    this.readyState = FakeWebSocket.CLOSED;
    this.onclose?.();
  }
}

const withFakeWebSocket = (run: () => void) => {
  const originalWebSocket = globalThis.WebSocket;
  FakeWebSocket.instances = [];
  Object.defineProperty(globalThis, 'WebSocket', {
    configurable: true,
    value: FakeWebSocket,
    writable: true,
  });

  try {
    run();
  } finally {
    Object.defineProperty(globalThis, 'WebSocket', {
      configurable: true,
      value: originalWebSocket,
      writable: true,
    });
  }
};

test('anonymous clients cannot connect, subscribe, or queue messages', () => {
  withFakeWebSocket(() => {
    const service = new WebsocketService('wss://example.test/ws/');

    service.on('attempt-update', () => {});
    service.send('attempt-add', 42);
    service.connect();

    assert.equal(FakeWebSocket.instances.length, 0);

    service.setEnabled(true);

    assert.equal(FakeWebSocket.instances.length, 0);
  });
});

test('authenticated clients retain messaging and are disconnected on logout', () => {
  withFakeWebSocket(() => {
    const service = new WebsocketService('wss://example.test/ws/');
    const received: number[] = [];

    service.setEnabled(true);
    service.on<number>('attempt-update', (attemptId) => received.push(attemptId));
    service.send('attempt-add', 42);

    const socket = FakeWebSocket.instances[0];
    assert.ok(socket);
    assert.equal(socket.url, 'wss://example.test/ws/');
    assert.deepEqual(socket.sent, []);

    socket.open();
    assert.deepEqual(socket.sent, [JSON.stringify({ event: 'attempt-add', data: 42 })]);

    socket.emit(JSON.stringify({ event: 'attempt-update', data: 42 }));
    assert.deepEqual(received, [42]);

    service.setEnabled(false);
    assert.equal(socket.readyState, FakeWebSocket.CLOSED);

    service.send('attempt-add', 43);
    service.on('attempt-update', () => received.push(43));
    assert.equal(FakeWebSocket.instances.length, 1);
  });
});
