import { useEffect, useState } from 'react';
import { Link, SvgIcon, SvgIconProps, Typography, typographyClasses } from '@mui/material';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { rootPaths } from 'app/routes/route-config';

interface LogoProps extends SvgIconProps {
  showName?: boolean;
  vibrant?: boolean;
}

const Logo = ({ sx, viewBox = '0 0 1000 1000', showName = true, vibrant = false, ...rest }: LogoProps) => {
  const [id, setId] = useState('kep-logo');

  const {
    config: { navColor },
  } = useSettingsContext();

  const isVibrant = vibrant && navColor === 'vibrant';
  const color = isVibrant ? '#A641FA' : '#3385F0';

  useEffect(() => {
    setId(`kep-logo-${Math.floor(Math.random() * 1000) + 1}`);
  }, []);

  return (
    <Link
      href={rootPaths.root}
      underline="none"
      sx={{
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
          [`& .${typographyClasses.root}`]: {
            backgroundPosition: ({ direction }) => (direction === 'rtl' ? 'right' : 'left'),
          },
        },
      }}
    >
      <SvgIcon
        viewBox={viewBox}
        sx={{
          height: 32,
          width: 32,
          ...sx,
        }}
        {...rest}
      >
        <g clipPath={`url(#clip0_${id})`}>
          <path
            d="M695.348 250.014L389.334 556.027L278.057 556.027L278.057 444.75L584.07 138.736L695.348 138.736L695.348 250.014Z"
            fill={`url(#paint0_linear_${id})`}
          />
          <path
            d="M556.029 111.139L55.2802 611.888L-0.358614 556.249L-0.35861 444.971L444.752 -0.13878L556.029 -0.138781L556.029 55.5L556.029 111.139Z"
            fill={`url(#paint1_linear_${id})`}
          />
          <g filter={`url(#filter0_d_${id})`}>
            <path
              d="M695.349 138.734L1000.65 445.141L1000.65 555.308L889.367 555.308L584.071 254.697L584.071 138.734L695.349 138.734Z"
              fill={`url(#paint2_linear_${id})`}
            />
            <path
              d="M695.349 138.734L1000.65 445.141L1000.65 555.308L889.367 555.308L584.071 254.697L584.071 138.734L695.349 138.734Z"
              fill={`url(#paint3_linear_${id})`}
              fillOpacity="0.5"
            />
          </g>
          <g filter={`url(#filter1_d_${id})`}>
            <path
              d="M1001.36 556.025L806.627 750.761L695.35 750.761L695.35 639.484L890.086 444.748H1001.36L1001.36 556.025Z"
              fill={`url(#paint4_linear_${id})`}
            />
          </g>
          <g filter={`url(#filter2_d_${id})`}>
            <path
              d="M556.251 389.109L806.626 639.485L806.626 750.762L693.002 750.762L444.973 500.387L556.251 389.109Z"
              fill={`url(#paint5_linear_${id})`}
            />
            <path
              d="M556.251 389.109L806.626 639.485L806.626 750.762L693.002 750.762L444.973 500.387L556.251 389.109Z"
              fill={`url(#paint6_linear_${id})`}
              fillOpacity="0.4"
            />
          </g>
          <g filter={`url(#filter3_d_${id})`}>
            <path
              d="M444.975 1001.13L-0.13566 556.024L-0.135617 444.747L111.142 444.747L556.252 889.857V1001.13H444.975Z"
              fill={`url(#paint7_linear_${id})`}
            />
          </g>
        </g>
        <defs>
          <filter
            id={`filter0_d_${id}`}
            x="570.071"
            y="132.734"
            width="436.574"
            height="436.574"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-4" dy="4" />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1246_654" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_1246_654" result="shape" />
          </filter>
          <filter
            id={`filter1_d_${id}`}
            x="681.35"
            y="430.748"
            width="326.014"
            height="326.014"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-4" dy="-4" />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1246_654" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_1246_654" result="shape" />
          </filter>
          <filter
            id={`filter2_d_${id}`}
            x="438.974"
            y="375.109"
            width="381.652"
            height="381.652"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="4" dy="-4" />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1246_654" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_1246_654" result="shape" />
          </filter>
          <filter
            id={`filter3_d_${id}`}
            x="-6.13574"
            y="430.746"
            width="576.388"
            height="576.389"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="4" dy="-4" />
            <feGaussianBlur stdDeviation="5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1246_654" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_1246_654" result="shape" />
          </filter>
          <linearGradient
            id={`paint0_linear_${id}`}
            x1="508.5"
            y1="362"
            x2="431.063"
            y2="291.743"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
          <linearGradient
            id={`paint1_linear_${id}`}
            x1="293.002"
            y1="285.998"
            x2="243.002"
            y2="236.998"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
          <linearGradient
            id={`paint2_linear_${id}`}
            x1="746.238"
            y1="279.74"
            x2="563.441"
            y2="105.28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
          <linearGradient
            id={`paint3_linear_${id}`}
            x1="808.879"
            y1="330.5"
            x2="791.379"
            y2="348"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
          <linearGradient
            id={`paint4_linear_${id}`}
            x1="853.602"
            y1="603"
            x2="808.5"
            y2="557.898"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
          <linearGradient
            id={`paint5_linear_${id}`}
            x1="487.5"
            y1="439.5"
            x2="810.5"
            y2="762.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} />
            <stop offset="0.648407" stopColor={color} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
          <linearGradient
            id={`paint6_linear_${id}`}
            x1="653.374"
            y1="598"
            x2="674.874"
            y2="576.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
          <linearGradient
            id={`paint7_linear_${id}`}
            x1="278.002"
            y1="722.998"
            x2="310.502"
            y2="690.498"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
          <clipPath id={`clip0_${id}`}>
            <rect
              x="1000"
              width="1000"
              height="1000"
              rx="160"
              transform="rotate(90 1000 0)"
              fill="white"
            />
          </clipPath>
        </defs>
      </SvgIcon>
      {showName && (
        <Typography
          sx={[
            {
              color: 'text.main',
              fontSize: 29.5,
              lineHeight: 1,
              margin: 1,
              marginLeft: 1,
              marginBottom: 1.5,
            },
            navColor !== 'vibrant' && {
              background: ({ vars }) =>
                `linear-gradient(100.06deg, ${color} 6.97%, #7DB1F5 27.63%, #5A9EF6 49.36%, ${vars.palette.text.secondary} 50.11%, ${vars.palette.text.secondary} 87.87%);`,
              backgroundSize: '240% 100%',
              backgroundPosition: ({ direction }) => (direction === 'rtl' ? 'left' : 'right'),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transition: 'background-position .3s cubic-bezier(0.8, 0.63, .5, 1)',
            },
          ]}
        >
          KEP.uz
        </Typography>
      )}
    </Link>
  );
};

export default Logo;
