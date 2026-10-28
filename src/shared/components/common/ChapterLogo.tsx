import { Avatar, Box, Stack, Tooltip } from '@mui/material';

export interface ChapterLogoSource {
  id: string | number;
  title: string;
  icon?: string | null;
}

const ChapterLogo = ({
  chapter,
  size = 28,
  focusable = true,
}: {
  chapter: ChapterLogoSource;
  size?: number;
  focusable?: boolean;
}) => (
  <Tooltip title={chapter.title} describeChild disableInteractive>
    <Box
      component="span"
      role="img"
      aria-label={chapter.title}
      tabIndex={focusable ? 0 : undefined}
      sx={{
        display: 'inline-flex',
        flexShrink: 0,
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 3 },
      }}
    >
      <Avatar
        src={chapter.icon ?? undefined}
        alt=""
        variant="square"
        sx={{
          width: size,
          height: size,
          bgcolor: 'transparent',
          color: 'primary.main',
          fontSize: size * 0.55,
          fontWeight: 600,
          '& img': { objectFit: 'contain' },
        }}
      >
        {chapter.title.slice(0, 1)}
      </Avatar>
    </Box>
  </Tooltip>
);

export const ChapterLogos = ({
  chapters,
  size = 28,
  label,
}: {
  chapters: readonly ChapterLogoSource[];
  size?: number;
  label: string;
}) => (
  <Stack
    direction="row"
    gap={1.25}
    alignItems="center"
    flexWrap="wrap"
    role="group"
    aria-label={label}
  >
    {chapters.map((chapter) => (
      <ChapterLogo key={chapter.id} chapter={chapter} size={size} />
    ))}
  </Stack>
);

export default ChapterLogo;
