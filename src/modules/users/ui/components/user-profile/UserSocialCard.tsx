import { useTranslation } from 'react-i18next';
import { Card, CardContent, Link, Skeleton, Stack, Typography } from '@mui/material';
import { useUserSocial } from '../../../application/queries';
import KepIcon from 'shared/components/base/KepIcon';

type UserSocialCardProps = {
  username: string;
};

const UserSocialCard = ({ username }: UserSocialCardProps) => {
  const { t } = useTranslation();
  const { data, isLoading } = useUserSocial(username);

  if (isLoading) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="80%" />
        </CardContent>
      </Card>
    );
  }

  if (!data?.telegram && !data?.codeforcesHandle) {
    return null;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="column" spacing={1.5}>
          <Typography variant="h6" fontWeight={700}>
            {t('users.profile.social.title')}
          </Typography>

          {data.telegram ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <KepIcon name="info" fontSize={18} color="primary.main" />
              <Typography variant="body2" color="text.secondary">
                Telegram:
              </Typography>
              <Link href={`https://t.me/${data.telegram}`} underline="hover" target="_blank" rel="noreferrer">
                {data.telegram}
              </Link>
            </Stack>
          ) : null}

          {data.codeforcesHandle ? (
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <img width="16" height="16"
                   src="https://cdn-1.webcatalog.io/catalog/codeforces/codeforces-icon-filled.png" />
              <Typography variant="body2" color="text.secondary">
                Codeforces:
              </Typography>
              <Link
                href={`https://codeforces.com/profile/${data.codeforcesHandle}`}
                underline="hover"
                target="_blank"
                rel="noreferrer"
              >
                {data.codeforcesHandle}
              </Link>
              <img className="ms-1" src={data.codeforcesBadge}/>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserSocialCard;
