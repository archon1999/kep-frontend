function toUndescore(name: string) {
  let undescoreName = "";
  for (let c of name) {
    if (c == c.toUpperCase()) {
      undescoreName += "_";
    }
    undescoreName += c.toLowerCase();
  }
  return undescoreName;
}

export function paramsMapper(obj: any) {
  let params = {};
  for (let key of Object.keys(obj)) {
    let value = obj[key];
    if (value !== null) {
      params[toUndescore(key)] = value;
    }
  }
  return params;
}
