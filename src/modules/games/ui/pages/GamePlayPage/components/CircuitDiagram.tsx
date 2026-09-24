import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { circuitPairLabels } from 'modules/games/domain/mini-games/logic-circuit';
import type { CircuitConfig } from 'modules/games/domain/mini-games/logic-circuit';

interface CircuitDiagramProps {
  config: CircuitConfig;
  inputCount: 2 | 3 | 4;
  expression: string;
}

const CircuitDiagram = ({ config, inputCount, expression }: CircuitDiagramProps) => {
  const { t } = useTranslation();
  const threeInputs = inputCount === 3;
  const fourInputs = inputCount === 4;
  const [firstPair, secondPair] = circuitPairLabels[config.pairing];
  const outputY = fourInputs ? 115 : threeInputs ? 90 : 80;
  const notX = inputCount === 2 ? 370 : 416;
  const notWidth = inputCount === 2 ? 58 : 43;

  return (
    <Box
      role="img"
      aria-label={t('gamesMinis.logicCircuit.diagramLabel')}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: '#132d42',
        backgroundImage:
          'linear-gradient(#ffffff0a 1px, transparent 1px), linear-gradient(90deg, #ffffff0a 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <Box
        component="svg"
        viewBox={fourInputs ? '0 0 520 220' : '0 0 520 160'}
        aria-hidden="true"
        sx={{
          display: 'block',
          width: '100%',
          height: 'auto',
          '& .wire': {
            fill: 'none',
            stroke: '#80c7f9',
            strokeWidth: 2.5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          },
          '& .node': {
            fill: '#20445e',
            stroke: '#5d9bc7',
            strokeWidth: 2,
          },
          '& .gate': {
            fill: '#244c68',
            stroke: '#80c7f9',
            strokeWidth: 2,
          },
          '& .label': {
            fill: '#eff8ff',
            fontFamily: 'inherit',
            fontWeight: 800,
            fontSize: 15,
            textAnchor: 'middle',
          },
          '& .output': {
            fill: '#7cdec7',
          },
          '& .output-label': {
            fill: '#113448',
            fontFamily: 'inherit',
            fontWeight: 800,
            fontSize: 15,
            textAnchor: 'middle',
          },
        }}
      >
        {fourInputs ? (
          <>
            <path className="wire" d="M 46 30 H 88 V 48 H 118" />
            <path className="wire" d="M 46 80 H 100 V 74 H 118" />
            <path className="wire" d="M 46 142 H 88 V 148 H 118" />
            <path className="wire" d="M 46 192 H 100 V 174 H 118" />
            <path className="wire" d="M 200 61 H 250 V 104 H 312" />
            <path className="wire" d="M 200 161 H 250 V 126 H 312" />
            {[...firstPair, ...secondPair].map((label, index) => {
              const y = [30, 80, 142, 192][index];
              return (
                <g key={label}>
                  <circle className="node" cx="28" cy={y} r="18" />
                  <text className="label" x="28" y={y + 5}>
                    {label}
                  </text>
                </g>
              );
            })}
            <rect className="gate" x="118" y="38" width="82" height="46" rx="5" />
            <text className="label" x="159" y="67">
              {config.firstGate}
            </text>
            <rect className="gate" x="118" y="138" width="82" height="46" rx="5" />
            <text className="label" x="159" y="167">
              {config.secondGate}
            </text>
            <rect className="gate" x="312" y="90" width="84" height="50" rx="5" />
            <text className="label" x="354" y="121">
              {config.thirdGate}
            </text>
            <path className="wire" d={config.invert ? 'M 396 115 H 416' : 'M 396 115 H 464'} />
          </>
        ) : threeInputs ? (
          <>
            <path className="wire" d="M 46 24 H 80 V 52 H 130" />
            <path className="wire" d="M 46 96 H 104 V 73 H 130" />
            <path className="wire" d="M 216 62 H 268 V 80 H 315" />
            <path className="wire" d="M 46 136 H 270 V 101 H 315" />
            <circle className="node" cx="28" cy="24" r="18" />
            <circle className="node" cx="28" cy="96" r="18" />
            <circle className="node" cx="28" cy="136" r="18" />
            <text className="label" x="28" y="29">
              A
            </text>
            <text className="label" x="28" y="101">
              B
            </text>
            <text className="label" x="28" y="141">
              C
            </text>
            <rect className="gate" x="130" y="36" width="86" height="52" rx="5" />
            <text className="label" x="173" y="68">
              {config.firstGate}
            </text>
            <rect className="gate" x="315" y="65" width="82" height="50" rx="5" />
            <text className="label" x="356" y="96">
              {config.secondGate}
            </text>
            <path className="wire" d={config.invert ? 'M 397 90 H 416' : 'M 397 90 H 464'} />
          </>
        ) : (
          <>
            <path className="wire" d="M 46 34 H 108 V 67 H 180" />
            <path className="wire" d="M 46 126 H 126 V 93 H 180" />
            <circle className="node" cx="28" cy="34" r="18" />
            <circle className="node" cx="28" cy="126" r="18" />
            <text className="label" x="28" y="39">
              A
            </text>
            <text className="label" x="28" y="131">
              B
            </text>
            <rect className="gate" x="180" y="54" width="88" height="52" rx="5" />
            <text className="label" x="224" y="86">
              {config.firstGate}
            </text>
            <path className="wire" d={config.invert ? 'M 268 80 H 370' : 'M 268 80 H 464'} />
          </>
        )}
        {config.invert && (
          <>
            <rect
              className="gate"
              x={notX}
              y={outputY - (inputCount === 2 ? 20 : 19)}
              width={notWidth}
              height={inputCount === 2 ? 40 : 38}
              rx="5"
            />
            <text className="label" x={notX + notWidth / 2} y={outputY + 5}>
              NOT
            </text>
            <path className="wire" d={`M ${notX + notWidth} ${outputY} H 464`} />
          </>
        )}
        <circle className="output" cx="485" cy={outputY} r="20" />
        <text className="output-label" x="485" y={outputY + 5}>
          Y
        </text>
      </Box>
      <Typography
        variant="caption"
        fontFamily="monospace"
        color="#b3cbdd"
        sx={{
          display: 'block',
          px: 1.5,
          py: 0.75,
          bgcolor: '#0d2639',
          overflowWrap: 'anywhere',
        }}
      >
        {expression}
      </Typography>
    </Box>
  );
};

export default CircuitDiagram;
