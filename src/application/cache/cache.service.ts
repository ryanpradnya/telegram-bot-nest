import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  find(key: string) {
    return this.cacheManager.store.get(key);
  }

  save(key: string, data: any, options?: CachingConfig<any>) {
    return this.cacheManager.store.set(key, data, options);
  }

  async clear(key: string) {
    try {
      await this.cacheManager.store.del(key);
    } catch (error) {
      console.error('error clear redis', error);
    }
  }
}
