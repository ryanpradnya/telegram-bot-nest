import { FilterQuery } from 'mongoose';

export function transformToMongoFilter<T>(filter: any): FilterQuery<T> {
  return Object.keys(filter).reduce((prev, curr) => {
    return {
      ...prev,
      [curr]: filterQuery(filter[curr]),
    };
  }, {});
}

function filterQuery(query: string) {
  const defaultRes = new RegExp(`.*${query}.*`, 'i');

  if (query.includes(',')) {
    const results = query.split(',');
    return results.length > 1 ? { $in: results } : defaultRes;
  } else if (query.includes('~')) {
    const results = query.split('~');
    if (results.length < 2) return defaultRes;

    return {
      $lte: Number(results[1]) ? Number(results[1]) : results[1],
      $gte: Number(results[0]) ? Number(results[0]) : results[0],
    };
  } else {
    return defaultRes;
  }
}
