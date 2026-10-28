import { Typography } from '@mui/material';

/** Smooth display text with the same single pixel accent used by page headings. */
const MixedText = ({ children }: { children: string }) => {
  const characters = Array.from(children);

  return (
    <>
      {characters.slice(0, 2).join('')}
      {characters[2] && (
        <Typography
          component="span"
          variant="pixel"
          sx={{ fontSize: 'inherit', lineHeight: 'inherit', letterSpacing: 'inherit' }}
        >
          {characters[2]}
        </Typography>
      )}
      {characters.slice(3).join('')}
    </>
  );
};

export default MixedText;
