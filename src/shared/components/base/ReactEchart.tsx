import { useMemo } from 'react';
import { Box, BoxProps, useMediaQuery, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { EChartsReactProps } from 'echarts-for-react';
import { default as ReactEChartsCore } from 'echarts-for-react/lib/core';
import merge from 'lodash.merge';
import useChartPalette from 'shared/hooks/useChartPalette';
import { getColor } from 'shared/lib/echart-utils';

export interface ReactEchartProps extends BoxProps {
  echarts: EChartsReactProps['echarts'];
  option: EChartsReactProps['option'];
  onEvents?: EChartsReactProps['onEvents'];
}
const ReactEchart = ({ option, ref, onEvents, ...rest }: ReactEchartProps) => {
  const theme = useTheme(),
    palette = useChartPalette();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const touch = useMemo(
    () =>
      typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    [],
  );
  const chartOption = useMemo(() => {
    const text = getColor(palette.text.secondary),
      foreground = getColor(palette.text.primary);
    const line = alpha(text, palette.mode === 'dark' ? 0.14 : 0.18),
      fontFamily = theme.typography.fontFamily;
    const resolved = merge(
      {},
      {
        color: [
          palette.primary.main,
          palette.secondary.main,
          palette.success.main,
          palette.info.main,
          palette.warning.main,
        ].map(getColor),
        backgroundColor: 'transparent',
        textStyle: { fontFamily, fontSize: 12, color: foreground },
        animationDuration: 500,
        animationDurationUpdate: 250,
        animationEasing: 'cubicOut',
      },
      option,
      {
        tooltip: merge(
          {},
          {
            padding: [10, 14],
            axisPointer: { type: 'none' },
            confine: true,
            transitionDuration: 0,
            triggerOn: touch ? 'click' : 'mousemove|click',
          },
          option?.tooltip,
          {
            backgroundColor: getColor(palette.background.default),
            borderColor: getColor(palette.divider),
            borderWidth: 1,
            textStyle: { fontFamily, fontSize: 13, lineHeight: 22, color: foreground },
            extraCssText: 'box-shadow: none; border-radius: 0;',
          },
        ),
        ...(reducedMotion ? { animation: false } : {}),
      },
    );
    if (option?.legend) {
      const style = (legend: Record<string, unknown>) =>
        merge({}, { itemWidth: 10, itemHeight: 10 }, legend, {
          textStyle: { fontFamily, color: text, fontSize: 12 },
        });
      resolved.legend = Array.isArray(option.legend)
        ? option.legend.map(style)
        : style(option.legend);
    }
    for (const key of ['xAxis', 'yAxis']) {
      if (!resolved[key]) continue;
      const style = (axis: Record<string, unknown>) =>
        merge({}, axis, {
          axisLine: { lineStyle: { color: line } },
          axisTick: { lineStyle: { color: line } },
          axisLabel: { fontFamily, color: text, fontSize: 12, fontWeight: 500, hideOverlap: true },
          splitLine: { lineStyle: { color: line, type: 'dashed', width: 1 } },
        });
      resolved[key] = Array.isArray(resolved[key])
        ? resolved[key].map(style)
        : style(resolved[key]);
    }
    return resolved;
  }, [option, reducedMotion, touch, theme.typography.fontFamily, palette]);
  return (
    <Box
      component={ReactEChartsCore}
      ref={ref}
      option={chartOption}
      onEvents={onEvents}
      {...rest}
    />
  );
};
export default ReactEchart;
