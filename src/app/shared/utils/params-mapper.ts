function toSnakeCase(name: string) {
  let snakeCaseName = '';
  for (const c of name) {
    if (c === c.toUpperCase() && c !== c.toLowerCase()) {
      snakeCaseName += '_';
    }
    snakeCaseName += c.toLowerCase();
  }
  return snakeCaseName;
}

export function paramsMapper(obj: any) {
  const params = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value !== null) {
      params[toSnakeCase(key)] = value;
    }
  }
  return params;
}
