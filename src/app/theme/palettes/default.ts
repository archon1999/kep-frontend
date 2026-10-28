import { PaletteOptions } from '@mui/material';
import { generatePaletteChannel } from 'shared/lib/utils';
import { darkPalette } from '../palette/darkPalette';
import { lightPalette } from '../palette/lightPalette';

// KEP's default palette: midnight canvas, cool primary and warm secondary accents.
const accent = (dark: boolean) => ({
  primary: generatePaletteChannel({
    lighter: dark ? '#172c35' : '#e4f3f5',
    light: dark ? '#c1eaf0' : '#518991',
    main: dark ? '#93d7e2' : '#296872',
    dark: dark ? '#b9e6ed' : '#174e57',
    darker: dark ? '#def5f7' : '#103941',
    contrastText: dark ? '#0a1720' : '#ffffff',
  }),
  secondary: generatePaletteChannel({
    lighter: dark ? '#30291e' : '#f8efdf',
    light: dark ? '#f2dfbc' : '#b48a4f',
    main: dark ? '#eacc9c' : '#89632e',
    dark: dark ? '#f0dab5' : '#65471f',
    darker: dark ? '#f8edd9' : '#443016',
    contrastText: dark ? '#20180d' : '#ffffff',
  }),
});

export const defaultDarkPalette: PaletteOptions = {
  ...darkPalette,
  ...accent(true),
  background: generatePaletteChannel({
    default: '#0a0d14',
    paper: '#0e121a',
    elevation1: '#131821',
    elevation2: '#1c2331',
    elevation3: '#283142',
    elevation4: '#3e495b',
    menu: '#111722',
    menuElevation1: '#1c2331',
    menuElevation2: '#283142',
  }),
  text: generatePaletteChannel({ primary: '#f5f6f8', secondary: '#aeb5c0', disabled: '#858b94' }),
  divider: '#191e28',
  dividerLight: '#141922',
  menuDivider: '#191e28',
  action: generatePaletteChannel({
    active: '#aeb5c0',
    hover: '#1c2331',
    selected: '#1c2c36',
    disabled: '#6c7480',
    disabledBackground: '#1c2331',
    focus: '#314655',
  }),
};

export const defaultLightPalette: PaletteOptions = {
  ...lightPalette,
  ...accent(false),
  background: generatePaletteChannel({
    default: '#f7f9fa',
    paper: '#ffffff',
    elevation1: '#f0f4f5',
    elevation2: '#e7edef',
    elevation3: '#d8e2e5',
    elevation4: '#c2d0d5',
    menu: '#ffffff',
    menuElevation1: '#f0f4f5',
    menuElevation2: '#e7edef',
  }),
  text: generatePaletteChannel({ primary: '#17232c', secondary: '#566571', disabled: '#74828c' }),
  divider: '#d6e0e3',
  dividerLight: '#e5ecee',
  menuDivider: '#d6e0e3',
};
