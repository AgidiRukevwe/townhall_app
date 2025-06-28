export function fillDataGaps(data: number[]) {
  let lastValue = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 0 && i > 0) {
      data[i] = lastValue;
    } else if (data[i] > 0) {
      lastValue = data[i];
    }
  }
}
