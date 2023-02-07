import { SortOrder } from '../delivery/enum/sort.enum';
import { SortData } from '../delivery/interfaces/general/sort.interface';

export function sortArrayOfObject<T>(arr: T[], sort: SortData[]): T[] {
  return arr.sort((a: T, b: T) => {
    return multiSortObject<T>(a, b, sort, 0);
  });
}

function multiSortObject<T>(a: T, b: T, sort: SortData[], i = 0): number {
  if (i < sort.length - 1 && a[sort[i].key] === b[sort[i].key]) {
    return multiSortObject(a, b, sort, ++i);
  } else {
    if (a[sort[i].key] < b[sort[i].key]) {
      if (sort[i].sort === SortOrder.desc) {
        return 1;
      } else {
        return -1;
      }
    }
    if (a[sort[i].key] > b[sort[i].key]) {
      if (sort[i].sort === SortOrder.desc) {
        return -1;
      } else {
        return 1;
      }
    }
    return 0;
  }
}
