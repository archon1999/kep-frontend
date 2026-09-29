import { Client, CloseCode, ErrorCode, type Room } from '@colyseus/sdk';
import type { MoveIntent, WorldConnection, WorldPlayer, WorldTicket } from '../../domain';
import { mapQuest, mapWorld } from '../mappers/world.mapper.ts';

type NetworkState = {
  players?: {
    forEach: (
      visit: (
        player: Omit<WorldPlayer, 'sessionId'> & { connected?: boolean },
        sessionId: string,
      ) => void,
    ) => void;
  };
};
const initial = (): WorldConnection => ({
  status: 'idle',
  sessionId: null,
  players: [],
  world: null,
  quests: null,
  error: null,
});

/** Reuse Colyseus' reserved seat across reloads as well as transient disconnects. */
export class WorldRealtime {
  private room: Room<any, NetworkState> | null = null;
  private generation = 0;
  private snapshot = initial();
  private listeners = new Set<() => void>();
  private username: string | undefined;
  private resumeKey: string | null = null;
  private savedToken: string | null = null;
  constructor(username?: string) {
    this.username = username;
  }
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private update(next: Partial<WorldConnection>) {
    this.snapshot = { ...this.snapshot, ...next };
    this.listeners.forEach((listener) => listener());
  }
  private readResumeToken() {
    if (!this.resumeKey || typeof window === 'undefined') return null;
    try {
      return window.sessionStorage.getItem(this.resumeKey);
    } catch {
      return null;
    }
  }
  private remember(room: Room<any, NetworkState>) {
    this.savedToken = room.reconnectionToken;
    if (!this.resumeKey || typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(this.resumeKey, this.savedToken);
    } catch {
      /* Storage may be disabled. */
    }
  }
  private forget() {
    if (this.resumeKey && typeof window !== 'undefined') {
      try {
        // A late callback from an old transport must not remove a rotated token.
        if (window.sessionStorage.getItem(this.resumeKey) === this.savedToken)
          window.sessionStorage.removeItem(this.resumeKey);
      } catch {
        /* Storage may be disabled. */
      }
    }
    this.savedToken = null;
  }
  private pageHide = () => {
    this.suspend();
    // A bfcache restore should offer Retry rather than show an endless spinner.
    this.update({ status: 'error', error: 'disconnected' });
  };
  async connect(pendingTicket: WorldTicket | Promise<WorldTicket>) {
    this.suspend();
    const generation = this.generation;
    this.update({ status: 'connecting', error: null });
    try {
      const ticket = await pendingTicket;
      if (generation !== this.generation) return;
      this.resumeKey = this.username
        ? `keppy-world:resume:${encodeURIComponent(this.username)}:${encodeURIComponent(ticket.serverUrl)}:${encodeURIComponent(ticket.roomName)}`
        : null;
      this.savedToken = this.readResumeToken();
      const client = new Client(ticket.serverUrl);
      client.auth.token = ticket.ticket;
      let room: Room<any, NetworkState> | undefined;
      if (this.savedToken) {
        try {
          room = await client.reconnect<NetworkState>(this.savedToken);
        } catch (error) {
          const code =
            typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined;
          // A network failure is retryable with the same reserved seat. Only a
          // confirmed expired token / missing room permits a new authenticated join.
          if (code !== ErrorCode.MATCHMAKE_EXPIRED && code !== ErrorCode.MATCHMAKE_INVALID_ROOM_ID)
            throw error;
          this.forget();
        }
      }
      if (generation !== this.generation) {
        if (room) await room.leave();
        return;
      }
      room ??= await client.joinOrCreate<NetworkState>(ticket.roomName, { ticket: ticket.ticket });
      if (generation !== this.generation) {
        await room.leave();
        return;
      }
      this.room = room;
      this.remember(room);
      if (typeof window !== 'undefined') window.addEventListener('pagehide', this.pageHide);
      const active = () => this.room === room && generation === this.generation;
      const readPlayers = (state: NetworkState) => {
        if (!active()) return;
        const players: WorldPlayer[] = [];
        state?.players?.forEach((p, sessionId) => {
          if (p.connected === false) return;
          players.push({
            sessionId,
            userId: String(p.userId),
            username: p.username,
            mascotId: p.mascotId,
            equippedCosmetic: p.equippedCosmetic,
            level: p.level,
            x: p.x,
            y: p.y,
            z: p.z,
            yaw: p.yaw,
            moving: p.moving,
            falling: p.falling,
            emote: p.emote,
            lastSeq: p.lastSeq,
          });
        });
        const previous = this.snapshot.players;
        const shared = players.map((player) => {
          const prior = previous.find((item) => item.sessionId === player.sessionId);
          return prior &&
            (Object.keys(player) as (keyof WorldPlayer)[]).every(
              (key) => player[key] === prior[key],
            )
            ? prior
            : player;
        });
        if (
          shared.length !== previous.length ||
          shared.some((player, index) => player !== previous[index])
        )
          this.update({ players: shared });
      };
      room.onStateChange(readPlayers);
      room.onMessage('welcome', () => undefined);
      room.onMessage('fell', () => undefined);
      room.onMessage('respawned', () => undefined);
      room.onMessage('backendUnavailable', () => {
        if (active()) this.update({ error: 'backendUnavailable' });
      });
      room.onMessage('world', (data) => {
        if (active())
          this.update({
            world: mapWorld(data.world),
            quests: data.quests.map(mapQuest),
            error: null,
          });
      });
      room.onDrop(() => {
        if (active()) {
          this.remember(room);
          this.update({ status: 'reconnecting' });
        }
      });
      room.onReconnect(() => {
        if (active()) {
          this.remember(room);
          this.update({ status: 'connected', error: null });
        }
      });
      room.onError((_code, message) => {
        if (active()) this.update({ status: 'error', error: message || 'connection' });
      });
      room.onLeave((code) => {
        if (active()) {
          if (code === CloseCode.CONSENTED) this.forget();
          this.room = null;
          this.update({ status: 'error', sessionId: null, players: [], error: 'disconnected' });
        }
      });
      this.update({ status: 'connected', sessionId: room.sessionId });
      readPlayers(room.state);
      room.send('refresh');
    } catch (error) {
      if (generation === this.generation)
        this.update({
          status: 'error',
          error: error instanceof Error ? error.message : 'connection',
        });
      throw error;
    }
  }
  move = (input: MoveIntent) => {
    if (this.snapshot.status === 'connected') this.room?.send('move', input);
  };
  emote = (id: 'wave' | 'heart' | 'gg') => {
    if (this.snapshot.status === 'connected') this.room?.send('emote', { id });
  };
  refresh = () => {
    if (this.snapshot.status === 'connected') this.room?.send('refresh');
  };
  applyTicket = (ticket: string) => {
    if (this.snapshot.status === 'connected') this.room?.send('profile', { ticket });
  };
  private close(preserve: boolean) {
    this.generation += 1;
    const room = this.room;
    this.room = null;
    if (typeof window !== 'undefined') window.removeEventListener('pagehide', this.pageHide);
    if (preserve && room) this.remember(room);
    if (!preserve) this.forget();
    if (room) {
      room.reconnection.enabled = false;
      if (preserve) room.connection.close(CloseCode.MAY_TRY_RECONNECT);
      else void room.leave().catch(() => undefined);
    }
    this.snapshot = initial();
    this.listeners.forEach((listener) => listener());
  }
  /** Page reload / component cleanup keeps a short-lived server reservation. */
  suspend = () => this.close(true);
  /** The explicit Leave action releases the seat and forgets its bearer token. */
  disconnect = () => this.close(false);
}
