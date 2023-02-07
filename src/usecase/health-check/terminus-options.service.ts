import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '../../config/config.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mongo: MongooseHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      async () =>
        this.http.pingCheck('telegram', 'https://core.telegram.org/bots/api'),
      async () => this.mongo.pingCheck(this.configService.getMongoConnection()),
    ]);
  }
}
