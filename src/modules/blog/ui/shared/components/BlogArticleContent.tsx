import { Box, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

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
          '& h1, & h2, & h3': {
            scrollMarginTop: 112,
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            mt: 0,
            mb: 2,
          },
          '& h1': { fontSize: { xs: '2rem', md: '2.5rem' } },
          '& h2': { fontSize: { xs: '1.5rem', md: '1.875rem' }, mt: 5 },
          '& h3': { fontSize: { xs: '1.25rem', md: '1.5rem' }, mt: 4 },
          '& p, & li': {
            color: 'text.secondary',
            fontSize: '1rem',
            lineHeight: 1.9,
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
            borderRadius: 2,
          },
          '& blockquote p': {
            color: 'text.primary',
          },
          '& pre': {
            my: 3,
            p: 2.5,
            overflowX: 'auto',
            borderRadius: 3,
            backgroundColor: 'common.black',
          },
          '& pre code': {
            color: 'common.white',
            fontFamily: 'monospace',
          },
          '& code': {
            fontFamily: 'monospace',
            fontSize: '0.925em',
          },
          '& a': {
            color: 'primary.main',
            fontWeight: 700,
            textDecoration: 'none',
          },
          '& a:hover': {
            textDecoration: 'underline',
          },
          '& img': {
            width: '100%',
            height: 'auto',
            display: 'block',
            my: 3,
            borderRadius: 4,
            objectFit: 'cover',
          },
          '& hr': {
            my: 4,
            border: 0,
            borderTop: (theme) => `1px solid ${theme.vars.palette.divider}`,
          },
          '& table': {
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
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default BlogArticleContent;
