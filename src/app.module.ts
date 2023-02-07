import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './application/modules/config.module';
import { GeneralModule } from './application/modules/general.module';
import { TelegramModule } from './application/modules/telegram.module';
import { HealthController } from './usecase/health-check/terminus-options.service';

@Module({
  imports: [ConfigModule, GeneralModule, TelegramModule, TerminusModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
