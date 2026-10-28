import { Box, Tooltip } from '@mui/material';
import angularLogo from 'devicon/icons/angularjs/angularjs-original.svg';
import djangoLogo from 'devicon/icons/django/django-plain.svg';
import fastApiLogo from 'devicon/icons/fastapi/fastapi-original.svg';
import nodeJsLogo from 'devicon/icons/nodejs/nodejs-original.svg';
import frontendLogo from 'shared/assets/images/languages/html.svg';
import pythonLogo from 'shared/assets/images/languages/py.svg';
import textLogo from 'shared/assets/images/languages/text.svg';

const technologyLogos: Record<string, string> = {
  frontend: frontendLogo,
  django: djangoLogo,
  python: pythonLogo,
  fastapi: fastApiLogo,
  nodejs: nodeJsLogo,
  angular: angularLogo,
  text: textLogo,
};

const ProjectTechnologyLogo = ({
  technology,
  size = 32,
}: {
  technology: string;
  size?: number;
}) => (
  <Tooltip title={technology}>
    <Box
      component="img"
      src={technologyLogos[technology.toLowerCase()] ?? textLogo}
      alt={technology}
      sx={(theme) => ({
        width: size,
        height: size,
        objectFit: 'contain',
        flexShrink: 0,
        ...theme.applyStyles('dark', {
          filter: technology.toLowerCase() === 'django' ? 'brightness(0) invert(1)' : undefined,
        }),
      })}
    />
  </Tooltip>
);

export default ProjectTechnologyLogo;
