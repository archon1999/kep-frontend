import {
  type WorldPoint,
  clampToWorld,
  validWorldIds,
  worldBeacons,
  worldObjectivesComplete,
  worldRoutes,
  worldShards,
  worldStations,
  worldTerminals,
} from '../domain/world/world.ts';

export type WorldSave = {
  position: WorldPoint;
  collected: string[];
  solved: string[];
  charged: string[];
  beacons: string[];
  routes: string[];
  mistakes: number;
  hits: number;
  lockedUntil: Record<string, number>;
  elapsed: number;
  completed: boolean;
  fallen: boolean;
};

type WorldStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export const emptyWorldSave = (): WorldSave => ({
  position: { x: 0, z: 0 },
  collected: [],
  solved: [],
  charged: [],
  beacons: [],
  routes: [],
  mistakes: 0,
  hits: 0,
  lockedUntil: {},
  elapsed: 0,
  completed: false,
  fallen: false,
});

const storageKey = (player: string) => `kep-games:world:${player}`;
const guestClaimKey = 'kep-games:world:guest-claim';

const normalizeSave = (parsed: Partial<WorldSave>): WorldSave => {
  const collected = validWorldIds(parsed.collected, worldShards);
  const solved = validWorldIds(parsed.solved, worldTerminals);
  const charged = validWorldIds(parsed.charged, worldStations);
  const beacons = validWorldIds(parsed.beacons, worldBeacons);
  const routes = validWorldIds(parsed.routes, worldRoutes);
  const lockedUntil = Object.fromEntries(
    Object.entries(parsed.lockedUntil ?? {}).filter(
      ([id, until]) =>
        worldTerminals.some((item) => item.id === id) && Number.isInteger(until) && until >= 0,
    ),
  ) as Record<string, number>;
  const completed =
    parsed.completed === true &&
    worldObjectivesComplete({
      shards: collected.length,
      terminals: solved.length,
      stations: charged.length,
      beacons: beacons.length,
      routes: routes.length,
    });
  return {
    position: clampToWorld({
      x: Number.isFinite(parsed.position?.x) ? parsed.position!.x : 0,
      z: Number.isFinite(parsed.position?.z) ? parsed.position!.z : 0,
    }),
    collected,
    solved,
    charged,
    beacons,
    routes,
    mistakes: Number.isInteger(parsed.mistakes) && parsed.mistakes! >= 0 ? parsed.mistakes! : 0,
    hits: Number.isInteger(parsed.hits) && parsed.hits! >= 0 ? parsed.hits! : 0,
    lockedUntil,
    elapsed: Number.isInteger(parsed.elapsed) && parsed.elapsed! >= 0 ? parsed.elapsed! : 0,
    completed,
    fallen: !completed && parsed.fallen === true,
  };
};

export const isWorldSavePristine = (save: WorldSave) =>
  save.position.x === 0 &&
  save.position.z === 0 &&
  save.collected.length === 0 &&
  save.solved.length === 0 &&
  save.charged.length === 0 &&
  save.beacons.length === 0 &&
  save.routes.length === 0 &&
  save.mistakes === 0 &&
  save.hits === 0 &&
  Object.keys(save.lockedUntil).length === 0 &&
  save.elapsed === 0 &&
  !save.completed &&
  !save.fallen;

export const loadWorldSave = (storage: WorldStorage, player: string): WorldSave => {
  try {
    const raw = storage.getItem(storageKey(player));
    return raw ? normalizeSave(JSON.parse(raw) as Partial<WorldSave>) : emptyWorldSave();
  } catch {
    return emptyWorldSave();
  }
};

export const saveWorldSave = (storage: WorldStorage, player: string, save: WorldSave) => {
  try {
    storage.setItem(storageKey(player), JSON.stringify(save));
    if (player === 'guest' && !isWorldSavePristine(save)) storage.removeItem(guestClaimKey);
    return true;
  } catch {
    return false;
  }
};

export const claimGuestWorldSave = (
  storage: WorldStorage,
  username: string,
  currentGuestSave?: WorldSave,
): WorldSave => {
  const account = loadWorldSave(storage, username);
  if (!username || username === 'guest' || !isWorldSavePristine(account)) return account;
  try {
    if (storage.getItem(guestClaimKey)) return account;
    const guest = currentGuestSave
      ? normalizeSave(currentGuestSave)
      : loadWorldSave(storage, 'guest');
    if (isWorldSavePristine(guest)) return account;
    storage.setItem(storageKey(username), JSON.stringify(guest));
    storage.setItem(guestClaimKey, username);
    storage.removeItem(storageKey('guest'));
    return guest;
  } catch {
    return account;
  }
};
