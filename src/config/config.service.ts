import { CacheModuleOptions, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as redisStore from 'cache-manager-redis-store';

export type EnvConfig = Record<string, string>;

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath?: string) {
    if (filePath) {
      const envVariables = fs.readFileSync(filePath);
      this.envConfig = dotenv.parse(envVariables);
    } else {
      this.envConfig = dotenv.config().parsed;
    }

    this.envConfig = this.validateInput(process.env);
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  public getAppPort(): number {
    return Number(this.get('PORT'));
  }

  public getMongoConnection(): string {
    return String(this.get('MONGO_CONNECTION'));
  }

  public getRedisConncetion(): any {
    return {
      store: redisStore,
      url: this.get('REDIS_CONNECTION'),
      retry_strategy(options) {
        // tslint:disable-next-line: no-console
        console.error(options.error);
        if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with
          // a individual error
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands
          // with a individual error
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          // End reconnecting with built in error
          return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
      },
      ttl: Number(this.get('REDIS_TTL')),
    };
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      PORT: Joi.number().default(4000),
      API_VERSION: Joi.string().default('1.0.0'),

      // == Redis ==
      REDIS_CONNECTION: Joi.string().required(),
      REDIS_TTL: Joi.string().default('300'),

      // == Telegram ==
      TELEGRAM_TOKEN: Joi.string().required(),
      TELEGRAM_LOG_CHANNEL: Joi.string().required(),
      TELEGRAM_URL: Joi.string().default('https://api.telegram.org'),

      // == Mongo ==
      MONGO_CONNECTION: Joi.string().required(),
    }).options({ stripUnknown: true });
    const { error, value: validatedEnvConfig } =
      envVarsSchema.validate(envConfig);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}

const configService = new ConfigService();
export { configService };
