import { Box, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { createSafeHtml } from 'shared/lib/safeHtml';

interface BlogArticleContentProps {
  html?: string;
  emptyMessage?: string;
  sx?: SxProps<Theme>;
}

const BlogArticleContent = ({ html, emptyMessage, sx }: BlogArticleContentProps) => {
  if (!html) {
    return emptyMessage ? (
      <Typography variant="body2" color="text.secondary">
        {emptyMessage}
      </Typography>
    ) : null;
  }

  return (
    <Box
      sx={[
        {
          color: 'text.primary',
          minWidth: 0,
          overflowWrap: 'anywhere',
          '& h1, & h2, & h3': {
            scrollMarginTop: 112,
            fontFamily: 'var(--kep-display-font)',
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            mt: 0,
            mb: 2,
          },
          '& h1': { fontSize: { xs: '2rem', md: '2.5rem' } },
          '& h2': { fontSize: { xs: '1.5rem', md: '1.875rem' }, mt: 5 },
          '& h3': { fontSize: { xs: '1.25rem', md: '1.5rem' }, mt: 4 },
          '& p, & li': {
            color: 'text.primary',
            fontSize: { xs: '1rem', md: '1.0625rem' },
            lineHeight: 1.85,
          },
          '& p': { my: 0 },
          '& p + p': { mt: 2.5 },
          '& ul, & ol': {
            color: 'text.secondary',
            pl: 3,
            my: 2.5,
          },
          '& li + li': {
            mt: 0.75,
          },
          '& blockquote': {
            my: 3,
            mx: 0,
            px: 2.5,
            py: 2,
            borderLeft: (theme) => `4px solid ${theme.vars.palette.primary.main}`,
            backgroundColor: 'background.default',
            borderRadius: 0,
          },
          '& blockquote p': {
            color: 'text.primary',
          },
          '& pre': {
            my: 3,
            p: 2.5,
            overflowX: 'auto',
            borderRadius: 0,
            backgroundColor: 'background.level1',
            border: 1,
            borderColor: 'divider',
          },
          '& pre code': {
            color: 'text.primary',
            fontFamily: 'monospace',
          },
          '& code': {
            fontFamily: 'monospace',
            fontSize: '0.925em',
          },
          '& a': {
            color: 'primary.main',
            fontWeight: 600,
            textDecoration: 'none',
          },
          '& a:hover': {
            textDecoration: 'underline',
          },
          '& figure': { mx: 0, maxWidth: '100%' },
          '& img': {
            width: '100%',
            height: 'auto',
            display: 'block',
            my: 3,
            borderRadius: 0,
            objectFit: 'cover',
          },
          '& hr': {
            my: 4,
            border: 0,
            borderTop: (theme) => `1px solid ${theme.vars.palette.divider}`,
          },
          '& table': {
            display: 'block',
            overflowX: 'auto',
            maxWidth: '100%',
            width: '100%',
            borderCollapse: 'collapse',
            my: 3,
          },
          '& th, & td': {
            p: 1.25,
            border: (theme) => `1px solid ${theme.vars.palette.divider}`,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      dangerouslySetInnerHTML={createSafeHtml(html)}
    />
  );
};

export default BlogArticleContent;
