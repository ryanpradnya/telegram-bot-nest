export function nFormatter(num: number, digit: number) {
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: ' Ribuan' },
    { value: 1e6, symbol: ' Jutaan' },
    { value: 1e9, symbol: ' Milyaran' },
    { value: 1e12, symbol: ' Triliunan' },
    { value: 1e15, symbol: ' Kuadriliunan' },
    { value: 1e18, symbol: ' Kuintiliun' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i: number;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digit).replace(rx, '1') + si[i].symbol;
}

/*
    Function to change param in the text
    Exmpale text 'Lorem ipsum dolor sit amet, (param1) adipiscing elit. (param2) massa neque, cursus at dictum ac, sollicitudin quis est'
    param1 and param2 in the text will change with the new string text
**/
export function textParamFormatter(obj: Record<string, string>, text: string) {
  return Object.entries(obj).reduce((val, curr) => {
    const regex = new RegExp(`\\(${curr[0]}\\)`, 'g');
    return val.replace(regex, curr[1]);
  }, text);
}

export function numberWithSeparator(num: number, separator: string) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export function decimalWithSeparator(
  num: number,
  separator: string,
  decimalSeparator = ',',
) {
  const nums = num.toFixed(2).toString().split('.');
  const roundNum = nums[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return `${roundNum}${decimalSeparator}${nums[1]}`;
}

export function stringToObject(key: string, value: any) {
  const keys = key.split('.');
  let construct = `{"${keys[keys.length - 1]}": "${value}"}`;

  for (let i = keys.length - 2; i >= 0; i--) {
    construct = `{"${keys[i]}": ${construct}}`;
  }

  return JSON.parse(construct);
}
