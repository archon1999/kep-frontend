import { Client, CloseCode, ErrorCode, type Room } from '@colyseus/sdk';
import assert from 'node:assert/strict';
import test, { type TestContext } from 'node:test';
import { WorldRealtime, worldConnectionError } from './world.realtime.ts';

const ticket = {
  ticket: 'signed-by-django',
  serverUrl: 'ws://127.0.0.1:2567',
  roomName: 'keppy_world',
};

function browser(t: TestContext) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const entries = new Map<string, string>();
  const target = Object.assign(new EventTarget(), {
    sessionStorage: {
      getItem: (key: string) => entries.get(key) ?? null,
      setItem: (key: string, value: string) => entries.set(key, value),
      removeItem: (key: string) => entries.delete(key),
    },
  });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: target });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, 'window', previous);
    else Reflect.deleteProperty(globalThis, 'window');
  });
  return { target, entries };
}

function room(token: string) {
  const events: Record<string, (...args: any[]) => void> = {};
  const closed: number[] = [];
  let leaves = 0;
  const value = {
    sessionId: 'same-session',
    reconnectionToken: token,
    state: { players: new Map() },
    reconnection: { enabled: true, isReconnecting: false, minUptime: 5000 },
    connection: {
      close: (code: number) => {
        assert.ok(
          code >= 3000 && code <= 4999,
          'Browser WebSocket.close only accepts application close codes.',
        );
        closed.push(code);
      },
    },
    onStateChange: (callback: (...args: any[]) => void) => {
      events.state = callback;
    },
    onMessage: () => undefined,
    onDrop: (callback: (...args: any[]) => void) => {
      events.drop = callback;
    },
    onReconnect: (callback: (...args: any[]) => void) => {
      events.reconnect = callback;
    },
    onError: (callback: (...args: any[]) => void) => {
      events.error = callback;
    },
    onLeave: (callback: (...args: any[]) => void) => {
      events.leave = callback;
    },
    leave: async () => {
      leaves++;
      events.leave?.(CloseCode.CONSENTED);
    },
    send: () => undefined,
  };
  return {
    value: value as unknown as Room<any, any>,
    raw: value,
    events,
    closed,
    get leaves() {
      return leaves;
    },
  };
}

test('page reload resumes the saved seat, rotates its token, and explicit Leave releases it', async (t) => {
  const { target, entries } = browser(t);
  const original = room('world:original');
  const recovered = room('world:rotated');
  const join = t.mock.method(Client.prototype, 'joinOrCreate', async () => original.value);
  const reconnect = t.mock.method(Client.prototype, 'reconnect', async () => recovered.value);
  const first = new WorldRealtime('alice');
  await first.connect(ticket);
  target.dispatchEvent(new Event('pagehide'));
  assert.deepEqual(original.closed, [CloseCode.MAY_TRY_RECONNECT]);
  assert.equal(original.leaves, 0);
  assert.deepEqual([...entries.values()], ['world:original']);
  // Unmount cleanup after pagehide must not delete the reservation.
  first.suspend();
  const next = new WorldRealtime('alice');
  await next.connect(ticket);
  assert.equal(join.mock.callCount(), 1);
  assert.equal(reconnect.mock.calls[0]!.arguments[0], 'world:original');
  assert.equal(next.getSnapshot().sessionId, 'same-session');
  original.events.leave?.(CloseCode.CONSENTED);
  assert.deepEqual([...entries.values()], ['world:rotated']);
  recovered.raw.reconnectionToken = 'world:rotated-again';
  recovered.events.reconnect?.();
  await Promise.resolve();
  assert.deepEqual([...entries.values()], ['world:rotated-again']);
  next.disconnect();
  assert.equal(recovered.leaves, 1);
  assert.equal(entries.size, 0);
});

test('a network failure keeps the resume token instead of creating a duplicate session', async (t) => {
  const { entries } = browser(t);
  const original = room('world:retry');
  const join = t.mock.method(Client.prototype, 'joinOrCreate', async () => original.value);
  t.mock.method(Client.prototype, 'reconnect', async () => {
    throw new TypeError('Failed to fetch');
  });
  const first = new WorldRealtime('alice');
  await first.connect(ticket);
  first.suspend();
  const next = new WorldRealtime('alice');
  await assert.rejects(next.connect(ticket), /Failed to fetch/);
  assert.equal(join.mock.callCount(), 1);
  assert.deepEqual([...entries.values()], ['world:retry']);
  next.disconnect();
});

test('server-confirmed expiry permits a new authenticated join', async (t) => {
  const { entries } = browser(t);
  const original = room('world:expired');
  const replacement = room('world:new');
  const join = t.mock.method(Client.prototype, 'joinOrCreate', async () => original.value);
  t.mock.method(Client.prototype, 'reconnect', async () => {
    throw { code: ErrorCode.MATCHMAKE_EXPIRED };
  });
  const first = new WorldRealtime('alice');
  await first.connect(ticket);
  first.suspend();
  join.mock.mockImplementation(async () => replacement.value);
  const next = new WorldRealtime('alice');
  await next.connect(ticket);
  assert.equal(join.mock.callCount(), 2);
  assert.deepEqual([...entries.values()], ['world:new']);
  next.disconnect();
});

test('resume tokens are isolated by account and world server', async (t) => {
  const { entries } = browser(t);
  t.mock.method(Client.prototype, 'joinOrCreate', async () => room(`world:${entries.size}`).value);
  const reconnect = t.mock.method(Client.prototype, 'reconnect', async () => {
    throw new Error('Must not inherit another account or server');
  });
  const first = new WorldRealtime('alice');
  await first.connect(ticket);
  first.suspend();
  const other = new WorldRealtime('bob');
  await other.connect(ticket);
  other.suspend();
  const elsewhere = new WorldRealtime('alice');
  await elsewhere.connect({ ...ticket, serverUrl: 'ws://127.0.0.1:2568' });
  assert.equal(reconnect.mock.callCount(), 0);
  assert.equal(entries.size, 3);
  first.disconnect();
  other.disconnect();
  elsewhere.disconnect();
});

test('ticket HTTP failure becomes a retryable connection error', async (t) => {
  browser(t);
  const join = t.mock.method(Client.prototype, 'joinOrCreate', async () => room('retry').value);
  const transport = new WorldRealtime('alice');
  const failed = transport.connect(Promise.reject(new Error('Ticket unavailable')));
  assert.equal(transport.getSnapshot().status, 'connecting');
  await assert.rejects(failed, /Ticket unavailable/);
  assert.equal(transport.getSnapshot().status, 'error');
  assert.equal(join.mock.callCount(), 0);
  await transport.connect(ticket);
  assert.equal(transport.getSnapshot().status, 'connected');
  transport.disconnect();
});

test('leaving while a ticket is pending cannot join a room afterward', async (t) => {
  browser(t);
  const join = t.mock.method(Client.prototype, 'joinOrCreate', async () => room('unwanted').value);
  let resolveTicket!: (value: typeof ticket) => void;
  const transport = new WorldRealtime('alice');
  const connecting = transport.connect(
    new Promise<typeof ticket>((resolve) => {
      resolveTicket = resolve;
    }),
  );
  transport.disconnect();
  resolveTicket(ticket);
  await connecting;
  assert.equal(join.mock.callCount(), 0);
  assert.equal(transport.getSnapshot().status, 'idle');
  assert.equal(transport.getSnapshot().sessionId, null);
});

test('an automatic reconnect stores the token rotated after the SDK callback', async (t) => {
  const { entries } = browser(t);
  const connection = room('world:before-reconnect');
  t.mock.method(Client.prototype, 'joinOrCreate', async () => connection.value);
  const transport = new WorldRealtime('alice');
  await transport.connect(ticket);
  assert.equal(connection.raw.reconnection.minUptime, 0);
  connection.events.drop?.();
  connection.raw.reconnection.isReconnecting = false;
  connection.events.reconnect?.();
  connection.raw.reconnectionToken = 'world:after-reconnect';
  await Promise.resolve();
  assert.deepEqual([...entries.values()], ['world:after-reconnect']);
  transport.disconnect();
});

test('a transient retry error remains reconnecting until recovery or final leave', async (t) => {
  browser(t);
  const connection = room('world:retrying');
  t.mock.method(Client.prototype, 'joinOrCreate', async () => connection.value);
  const transport = new WorldRealtime('alice');
  await transport.connect(ticket);
  connection.events.drop?.();
  connection.raw.reconnection.isReconnecting = true;
  connection.events.error?.(1006, 'Temporary network interruption');
  assert.equal(transport.getSnapshot().status, 'reconnecting');
  assert.equal(transport.getSnapshot().error, null);
  connection.raw.reconnection.isReconnecting = false;
  connection.events.leave?.(CloseCode.FAILED_TO_RECONNECT);
  assert.equal(transport.getSnapshot().status, 'error');
  assert.equal(transport.getSnapshot().sessionId, null);
  transport.disconnect();
});

test('connection errors distinguish duplicate tabs, capacity, authentication and transient outages', () => {
  assert.equal(worldConnectionError({ code: 4211 }), 'duplicateSession');
  assert.equal(worldConnectionError({ code: 409 }), 'worldFull');
  assert.equal(
    worldConnectionError(new Error('The shared world is full. Please try again shortly.')),
    'worldFull',
  );
  assert.equal(worldConnectionError({ code: 401 }), 'authExpired');
  assert.equal(worldConnectionError({ code: ErrorCode.AUTH_FAILED }), 'authExpired');
  assert.equal(worldConnectionError({ status: 503 }), 'backendUnavailable');
  assert.equal(worldConnectionError({ status: 429 }), 'rateLimited');
  assert.equal(worldConnectionError(new TypeError('Failed to fetch')), 'connectionError');
});
