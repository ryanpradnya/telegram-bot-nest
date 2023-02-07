import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from '../../config/config.service';
import { Admin, AdminSchema } from '../../dataprovider/entity/admin.entity';
import {
  Command,
  CommandSchema,
} from '../../dataprovider/entity/command.entity';
import { Group, GroupSchema } from '../../dataprovider/entity/group.entity';
import { DefaultService } from '../../usecase/default/default.usecase.service';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [
    HttpModule,
    CqrsModule,
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Command.name, schema: CommandSchema },
    ]),
    CacheModule.register(configService.getRedisConncetion()),
  ],
  providers: [DefaultService, CacheService],
  exports: [
    HttpModule,
    CqrsModule,
    DefaultService,
    CacheService,
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Command.name, schema: CommandSchema },
    ]),
    CacheModule.register(configService.getRedisConncetion()),
  ],
})
export class GeneralModule {}
