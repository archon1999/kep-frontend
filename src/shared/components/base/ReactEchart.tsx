import { useMemo } from 'react';
import { Box, BoxProps, useTheme } from '@mui/material';
import { EChartsReactProps } from 'echarts-for-react';
import { default as ReactEChartsCore } from 'echarts-for-react/lib/core';
import merge from 'lodash.merge';
import { grey } from 'app/theme/palette/colors';
import { getColor } from 'shared/lib/echart-utils';

export interface ReactEchartProps extends BoxProps {
  echarts: EChartsReactProps['echarts'];
  option: EChartsReactProps['option'];
  onEvents?: EChartsReactProps['onEvents'];
}

const ReactEchart = ({ option, ref, onEvents, ...rest }: ReactEchartProps) => {
  const theme = useTheme();

  const isTouchDevice = useMemo(() => {
    return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const defaultTooltip = useMemo(
    () => ({
      padding: [7, 10],
      axisPointer: {
        type: 'none',
      },
      textStyle: {
        fontFamily: theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: 12,
        color: getColor(theme.vars.palette.common.white),
      },
      backgroundColor: grey[800],
      borderWidth: 0,
      borderColor: getColor(theme.vars.palette.menuDivider),
      extraCssText: 'box-shadow: none;',
      transitionDuration: 0,
      confine: true,
      triggerOn: isTouchDevice ? 'click' : 'mousemove|click',
      ...theme.applyStyles('dark', {
        backgroundColor: grey[900],
        borderWidth: 1,
      }),
    }),
    [theme, isTouchDevice],
  );

  return (
    <Box
      component={ReactEChartsCore}
      ref={ref}
      option={{
        ...option,
        tooltip: merge(defaultTooltip, option?.tooltip),
      }}
      onEvents={onEvents}
      {...rest}
    />
  );
};

export default ReactEchart;
