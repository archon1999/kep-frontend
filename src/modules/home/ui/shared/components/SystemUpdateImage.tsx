import type { SxProps } from '@mui/material';
import Image from 'shared/components/base/Image';

interface SystemUpdateImageProps {
  src?: string | null;
  sx?: SxProps;
}

const SystemUpdateImage = ({ src, sx }: SystemUpdateImageProps) => {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        sx={[
          {
            display: 'block',
            width: 1,
            height: 1,
            objectFit: 'cover',
            borderRadius: 2,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      />
    );
  }

  return null;
};

export default SystemUpdateImage;
