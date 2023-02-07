import { Injectable } from '@nestjs/common';
import { map, zip } from 'rxjs';
import { Command } from '../../dataprovider/entity/command.entity';
import { CommandRepository } from '../../dataprovider/repository/command.repository';
import { CommandResponseDTO } from '../../delivery/dto/command.dto';
import {
  QueryRequestDTO,
  QueryTransformDTO,
} from '../../delivery/dto/query.dto';
import { exposeAndExcludeTransform } from '../../utils/transform.util';
import { DefaultService } from '../default/default.usecase.service';

@Injectable()
export class CommandService {
  constructor(
    private readonly commandRepository: CommandRepository,
    private readonly defaultService: DefaultService,
  ) {}

  query(
    query: QueryRequestDTO<CommandResponseDTO>,
    transform: QueryTransformDTO,
  ) {
    return this.commandRepository.query(query).pipe(
      map((vals) =>
        vals.map((val) => {
          const result = exposeAndExcludeTransform<Command>(
            val.toObject(),
            transform,
          );
          return new CommandResponseDTO(result);
        }),
      ),
    );
  }

  find(
    query: QueryRequestDTO<CommandResponseDTO>,
    transform: QueryTransformDTO,
  ) {
    const messageObservable = this.query(query, transform);
    const totalCountObservable = this.commandRepository.count(query);

    return zip(messageObservable, totalCountObservable).pipe(
      map(([data, total]) => {
        return {
          data,
          total,
        };
      }),
      this.defaultService.transformMultiDocument$<CommandResponseDTO>(),
    );
  }
}
