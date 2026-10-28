import type {
  HomeCommunityUser,
  HomeNextBirthdays,
  HomeOnlineUsers,
} from '../../domain/entities/home.entity';

const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {};
const string = (value: unknown) => (typeof value === 'string' && value.trim() ? value : undefined);
const rows = (payload: unknown): unknown[] => {
  const data = Array.isArray(payload) ? payload : record(payload).data;
  return Array.isArray(data) ? data : [];
};
const mapUser = (payload: unknown): HomeCommunityUser | undefined => {
  const item = record(payload);
  const username = string(item.username);
  if (!username) return;
  return {
    username,
    avatar: string(item.avatar),
    firstName: string(item.firstName ?? item.first_name),
    lastName: string(item.lastName ?? item.last_name),
  };
};

export const mapBirthdayProfile = (payload: unknown) => {
  const item = record(payload);
  return string(item.dateOfBirth ?? item.date_of_birth);
};

export const mapNextBirthdays = (payload: unknown): HomeNextBirthdays => ({
  data: rows(payload).flatMap((item) => {
    const user = mapUser(item);
    if (!user) return [];
    const birthday = record(item);
    return [
      {
        ...user,
        date: string(birthday.date ?? birthday.birthday),
        dateOfBirth: mapBirthdayProfile(item),
      },
    ];
  }),
});

export const mapOnlineUsers = (payload: unknown): HomeOnlineUsers => ({
  data: rows(payload).flatMap((item) => {
    const user = mapUser(item);
    return user ? [user] : [];
  }),
});
