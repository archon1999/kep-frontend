import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Chip, LinearProgress, Link, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { contentGridSx, contentInsetSx } from 'app/theme/styles/content';
import {
  UserProfileAbout,
  UserSocialLinks,
} from 'modules/users/domain/entities/user-profile.entity';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { formatDateTime } from 'shared/lib/dateTime';
import { decodeHtmlEntities } from 'shared/lib/html';
import { getCountryLabel } from 'shared/utils/country';
import UserFollowersCard from './user-profile/UserFollowersCard';

const ProfileOverview = ({
  about,
  social,
  username,
  isOwner,
}: {
  about?: UserProfileAbout;
  social?: UserSocialLinks;
  username: string;
  isOwner: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const info = about?.profileInfo;
  const bio = decodeHtmlEntities(
    (info?.bio ?? '').replace(/<\/(?:p|div)>|<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, ''),
  ).trim();
  const fullName = [about?.generalInfo?.firstName, about?.generalInfo?.lastName]
    .filter(Boolean)
    .join(' ');
  const telegram = social?.telegram?.replace(/^@+/, '').trim();
  const codeforces = social?.codeforcesHandle?.trim();
  const details: Array<{ label: string; value?: ReactNode }> = [
    { label: 'fullName', value: fullName },
    {
      label: 'lives',
      value: [getCountryLabel(info?.country, i18n.language), info?.region]
        .filter(Boolean)
        .join(', '),
    },
    { label: 'wasBorn', value: formatDateTime(info?.dateOfBirth, 'profileDate', '') },
    { label: 'email', value: info?.email },
    { label: 'website', value: info?.website },
    { label: 'joined', value: formatDateTime(info?.dateJoined, 'profileDate', '') },
    {
      label: 'telegram',
      value: telegram && (
        <Link href={`https://t.me/${telegram}`} target="_blank" rel="noopener noreferrer">
          @{telegram}
        </Link>
      ),
    },
    {
      label: 'codeforces',
      value: codeforces && (
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          <Link
            href={`https://codeforces.com/profile/${codeforces}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {codeforces}
          </Link>
          {social?.codeforcesBadge && (
            <Box
              component="img"
              src={social.codeforcesBadge}
              alt={codeforces}
              sx={{ height: 20, maxWidth: 120, objectFit: 'contain' }}
            />
          )}
        </Stack>
      ),
    },
  ].filter((row) => Boolean(row.value));

  return (
    <Box
      sx={{
        ...contentGridSx,
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1.65fr) minmax(280px, 1fr)' },
        alignItems: 'stretch',
      }}
    >
      <Box>
        <SectionHeader
          title={t('users.profile.about')}
          action={
            isOwner ? (
              <Button component={RouterLink} to={resources.SettingsInformation} size="small">
                {t('users.profile.editProfile')}
              </Button>
            ) : undefined
          }
        />
        <Box sx={contentInsetSx}>
          <Typography
            color="text.secondary"
            sx={{ lineHeight: 1.8, whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}
          >
            {bio || t('users.profile.emptyBio')}
          </Typography>
        </Box>
        <SectionHeader title={t('users.profile.skills')} />
        <Box
          sx={{
            ...contentInsetSx,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 2.5,
          }}
        >
          {about?.skills?.length ? (
            about.skills.map((skill) => (
              <Box key={skill.slug ?? skill.name}>
                <Stack direction="row" justifyContent="space-between" gap={2} sx={{ mb: 1 }}>
                  <Typography variant="body2">{skill.name}</Typography>
                  <Typography variant="metric" sx={{ fontSize: 17, color: 'primary.main' }}>
                    {Math.min(100, Math.max(0, skill.level))}%
                  </Typography>
                </Stack>
                <LinearProgress
                  value={Math.min(100, Math.max(0, skill.level))}
                  variant="determinate"
                  aria-label={skill.name}
                  sx={{ height: 3, borderRadius: 0 }}
                />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('users.profile.noSkills')}
            </Typography>
          )}
        </Box>
        {!!about?.technologies?.length && (
          <>
            <SectionHeader title={t('users.profile.technologies')} />
            <Stack direction="row" gap={1} flexWrap="wrap" sx={contentInsetSx}>
              {about.technologies.map((tech) => (
                <Chip
                  key={`${tech.text}-${tech.devIconClass}`}
                  variant="outlined"
                  label={tech.text}
                  icon={
                    tech.devIconClass ? (
                      <Box component="i" className={tech.devIconClass} />
                    ) : undefined
                  }
                  sx={{ borderRadius: 0, bgcolor: 'transparent' }}
                />
              ))}
            </Stack>
          </>
        )}
        {[
          {
            title: t('users.profile.workExperience'),
            items: (about?.workExperiences ?? []).map((item) => ({
              title: item.company,
              subtitle: item.jobTitle,
              from: item.fromYear,
              to: item.toYear,
            })),
          },
          {
            title: t('users.profile.education'),
            items: (about?.educations ?? []).map((item) => ({
              title: item.organization,
              subtitle: item.degree,
              from: item.fromYear,
              to: item.toYear,
            })),
          },
        ].map((section) => (
          <Box key={section.title}>
            <SectionHeader title={section.title} />
            <Stack direction="column" gap={2.5} sx={contentInsetSx}>
              {section.items.length ? (
                section.items.map((item, index) => (
                  <Box
                    key={`${item.title}-${index}`}
                    sx={{ pl: 2, borderLeft: 1, borderColor: 'divider' }}
                  >
                    <Typography variant="body1" fontWeight={600} sx={{ overflowWrap: 'anywhere' }}>
                      {item.title}
                    </Typography>
                    {item.subtitle && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {item.subtitle}
                      </Typography>
                    )}
                    {(item.from || item.to) && (
                      <Typography
                        variant="caption"
                        color="primary.main"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        {item.from ?? '—'} — {item.to ?? t('users.profile.timeline.present')}
                      </Typography>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('users.profile.noDetails')}
                </Typography>
              )}
            </Stack>
          </Box>
        ))}
      </Box>
      <Box component="aside">
        <SectionHeader title={t('users.profile.personal.title')} />
        <Box component="dl" sx={{ ...contentInsetSx, m: 0 }}>
          {details.length ? (
            details.map((row) => (
              <Box
                key={row.label}
                sx={{
                  pb: 2,
                  mb: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:last-child': { mb: 0, pb: 0, border: 0 },
                }}
              >
                <Typography component="dt" variant="label" color="text.secondary" sx={{ mb: 0.75 }}>
                  {t(`users.profile.personal.${row.label}`)}
                </Typography>
                <Box
                  component="dd"
                  sx={{ m: 0, fontSize: 14, lineHeight: 1.6, overflowWrap: 'anywhere' }}
                >
                  {row.value}
                </Box>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary" variant="body2">
              {t('users.profile.noDetails')}
            </Typography>
          )}
        </Box>
        <UserFollowersCard username={username} />
      </Box>
    </Box>
  );
};

export default ProfileOverview;
