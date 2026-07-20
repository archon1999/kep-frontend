import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveWebsocketUrl } from './websocketUrl.ts';

test('configured websocket URL takes precedence', () => {
  assert.equal(
    resolveWebsocketUrl(' wss://realtime.example.com/socket ', {
      protocol: 'https:',
      host: 'app.example.com',
    }),
    'wss://realtime.example.com/socket',
  );
});

test('websocket URL falls back to the current secure origin', () => {
  assert.equal(
    resolveWebsocketUrl(undefined, { protocol: 'https:', host: 'kep.uz' }),
    'wss://kep.uz/ws/',
  );
});
