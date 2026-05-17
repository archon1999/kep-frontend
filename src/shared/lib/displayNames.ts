export const getRegionDisplayName = (regionCode: string, locale: string) => {
  try {
    const regionNames = new Intl.DisplayNames([locale], { type: 'region' });
    return regionNames.of(regionCode) ?? regionCode;
  } catch {
    return regionCode;
  }
};
