import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { repository } from '../data-access';

export const useSetUserFollowing = (username: string) => {
  const { mutate } = useSWRConfig();
  return useSWRMutation(
    ['user-following', username],
    async (_, { arg: following }: { arg: boolean }) => {
      await repository.setFollowing(username, following);
      await mutate(
        (key) =>
          Array.isArray(key) &&
          key[1] === username &&
          ['user-details', 'user-followers'].includes(key[0]),
      );
    },
  );
};
