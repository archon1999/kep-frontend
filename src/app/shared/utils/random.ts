export function randomInt(lower: number, upper: number) {
  return Math.floor(Math.random() * (upper - lower)) + lower;
}

export function randomChoice(array: Array<any>) {
  return array[randomInt(0, array.length - 1)];
}

export function randomShuffle(array: Array<any>) {
  let currentIndex = array.length, randomIndex: number;

  while (currentIndex != 0) {
    randomIndex = randomInt(0, currentIndex - 1);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
