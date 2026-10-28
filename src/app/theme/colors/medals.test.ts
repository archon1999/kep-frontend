import assert from 'node:assert/strict';
import test from 'node:test';
import { getRankColor, medalColors } from './medals.ts';

test('ranks serialized as strings keep their medal color and unranked values keep the fallback', () => {
  for (const rank of [1, 2, 3, 16]) {
    assert.equal(getRankColor(String(rank)), getRankColor(rank));
  }
  for (const rank of [null, undefined, '', 'unranked', 0]) {
    assert.equal(getRankColor(rank, 'inherit'), 'inherit');
  }
});

const luminance = (hex: string) => {
  const channels = hex.match(/[a-f\d]{2}/gi)!.map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

test('medal numbers meet normal-text contrast on default theme surfaces', () => {
  const surfaces = {
    light: ['#ffffff', '#f7f9fa', '#f0f4f5'],
    dark: ['#0a0d14', '#0e121a', '#1c2331'],
  } as const;
  for (const scheme of ['light', 'dark'] as const) {
    for (const [rank, color] of Object.entries(medalColors[scheme])) {
      for (const background of surfaces[scheme]) {
        const foregroundLuminance = luminance(color);
        const backgroundLuminance = luminance(background);
        const ratio =
          (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
          (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
        assert.ok(ratio >= 4.5, `${scheme} ${rank} on ${background}: ${ratio.toFixed(2)}`);
      }
    }
  }
});
