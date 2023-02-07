export function groupBy<T>(array: T[], key: string): Record<string, T[]> {
  return array.reduce((prev, curr) => {
    (prev[curr[key]] = prev[curr[key]] || []).push(curr);
    return prev;
  }, {});
}

export function uniqueArray(value: any, index: number, self: any[]): boolean {
  return self.indexOf(value) === index;
}

/*
  Combine multiple array with type
**/
export function combineArray<T>(unique: boolean, ...args: T[][]): T[] {
  return args.reduce((vals, curr) => {
    if (curr) {
      vals.push(...curr.filter((c) => c));
    }
    return unique ? vals.filter(uniqueArray) : vals;
  }, new Array<T>());
}
