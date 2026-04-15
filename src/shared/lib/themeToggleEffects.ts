export const THEME_TOGGLE_EFFECT_STORAGE_KEY = 'theme-toggle-effect';

export type ThemeToggleEffect = 'polygon' | 'anime-girl' | 'none';

export const themeToggleEffectOptions: Array<{
  value: ThemeToggleEffect;
  labelKey: string;
}> = [
  { value: 'polygon', labelKey: 'settings.themeToggleEffects.polygon' },
  { value: 'anime-girl', labelKey: 'settings.themeToggleEffects.animeGirl' },
  { value: 'none', labelKey: 'settings.themeToggleEffects.none' },
];

const animeGirlMaskUrl = 'https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif';
let animeGirlMaskPreloaded = false;

const effectStyles: Record<ThemeToggleEffect, string> = {
  polygon: `
::view-transition-group(root) {
  animation-duration: 0.7s;
  animation-timing-function: var(--expo-out, cubic-bezier(0.16, 1, 0.3, 1));
}

::view-transition-new(root) {
  animation-name: reveal-light;
}

::view-transition-old(root) {
  animation: none;
  z-index: -1;
}

html[data-kep-color-scheme='dark']::view-transition-new(root) {
  animation-name: reveal-dark;
}

@keyframes reveal-dark {
  from {
    clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%);
  }
  to {
    clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%);
  }
}

@keyframes reveal-light {
  from {
    clip-path: polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%);
  }
  to {
    clip-path: polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%);
  }
}`,
  'anime-girl': `
::view-transition-group(root) {
  animation-timing-function: var(--expo-in, cubic-bezier(0.7, 0, 0.84, 0));
}

::view-transition-new(root) {
  -webkit-mask: url('${animeGirlMaskUrl}') center / 0 no-repeat;
  mask: url('${animeGirlMaskUrl}') center / 0 no-repeat;
  animation: anime-girl-scale 3s both;
}

::view-transition-old(root),
html[data-kep-color-scheme='dark']::view-transition-old(root) {
  animation: anime-girl-scale 3s both;
}

@keyframes anime-girl-scale {
  0% {
    -webkit-mask-size: 0;
    mask-size: 0;
  }
  10% {
    -webkit-mask-size: 50vmax;
    mask-size: 50vmax;
  }
  90% {
    -webkit-mask-size: 50vmax;
    mask-size: 50vmax;
  }
  100% {
    -webkit-mask-size: 2000vmax;
    mask-size: 2000vmax;
  }
}`,
  none: '',
};

export const isThemeToggleEffect = (value: string | null): value is ThemeToggleEffect =>
  value === 'polygon' || value === 'anime-girl' || value === 'none';

export const getStoredThemeToggleEffect = (): ThemeToggleEffect => {
  try {
    const storedValue = localStorage.getItem(THEME_TOGGLE_EFFECT_STORAGE_KEY);
    return isThemeToggleEffect(storedValue) ? storedValue : 'polygon';
  } catch {
    return 'polygon';
  }
};

export const setStoredThemeToggleEffect = (effect: ThemeToggleEffect) => {
  localStorage.setItem(THEME_TOGGLE_EFFECT_STORAGE_KEY, effect);
};

export const applyThemeToggleEffectStyle = (effect: ThemeToggleEffect) => {
  if (effect === 'anime-girl' && !animeGirlMaskPreloaded && typeof Image !== 'undefined') {
    animeGirlMaskPreloaded = true;
    const image = new Image();
    image.src = animeGirlMaskUrl;
  }

  const styleElement =
    document.getElementById('toggle-effect-style') ??
    document.head.appendChild(document.createElement('style'));

  styleElement.id = 'toggle-effect-style';
  styleElement.textContent = effectStyles[effect];
};
