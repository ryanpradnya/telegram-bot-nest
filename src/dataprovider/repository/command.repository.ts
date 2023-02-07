import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import {
  CommandResponseDTO,
  CreateCommandDTO,
} from '../../delivery/dto/command.dto';
import { QueryRequestDTO } from '../../delivery/dto/query.dto';
import { transformToMongoFilter } from '../../utils/transform-mongo.util';
import { Command } from '../entity/command.entity';

@Injectable()
export class CommandRepository {
  constructor(
    @InjectModel(Command.name) private readonly commandModel: Model<Command>,
  ) {}

  create(data: CreateCommandDTO): Observable<Command> {
    return from(new this.commandModel(data).save());
  }

  query(query: Partial<any>): Observable<Command[]> {
    const { page = 0, size = 10, sort, filter } = query;
    const skip = page * size;
    return from(
      this.commandModel
        .find(transformToMongoFilter<Command>(filter))
        .limit(skip)
        .skip(page)
        .sort({ ...sort })
        .exec(),
    );
  }

  count(
    query: Partial<QueryRequestDTO<CommandResponseDTO>>,
  ): Observable<number> {
    return from(
      this.commandModel
        .countDocuments(transformToMongoFilter<Command>(query.filter))
        .exec(),
    );
  }

  findOne(conditions?: FilterQuery<Command>): Observable<Command> {
    return from(this.commandModel.findOne(conditions).exec());
  }

  update(data: any): Observable<Command> {
    const { companyCode } = data;
    return from(
      this.commandModel
        .updateOne({ companyCode }, data, {
          upsert: true,
          setDefaultsOnInsert: true,
        })
        .exec(),
    ).pipe(
      switchMap(() =>
        this.findOne({
          companyCode,
        }),
      ),
    );
  }

  delete(conditions?: FilterQuery<Command>): Observable<Command> {
    return from(this.commandModel.findOne(conditions)).pipe(
      tap((result) => result.remove()),
    );
  }
}
