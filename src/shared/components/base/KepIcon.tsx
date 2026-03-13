import IconifyIcon, { IconifyProps } from './IconifyIcon';
import { getKepIcon, KepIconName } from 'shared/config/icons';

const FALLBACK_ICON = 'material-symbols:help-outline-rounded';

interface KepIconProps extends Omit<IconifyProps, 'icon'> {
  name: KepIconName;
  fallbackIcon?: IconifyProps['icon'];
}

const KepIcon = ({ name, fallbackIcon = FALLBACK_ICON, ...rest }: KepIconProps) => {
  const icon = getKepIcon(name) ?? fallbackIcon;

  return <IconifyIcon icon={icon} {...rest} />;
};

export default KepIcon;
