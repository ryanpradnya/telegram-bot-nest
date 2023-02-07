import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { CreateGroupDTO, GroupResponseDTO } from '../../delivery/dto/group.dto';
import { QueryRequestDTO } from '../../delivery/dto/query.dto';
import { transformToMongoFilter } from '../../utils/transform-mongo.util';
import { Group } from '../entity/group.entity';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {}

  create(data: CreateGroupDTO): Observable<Group> {
    return from(new this.groupModel(data).save());
  }

  query(query: Partial<any>): Observable<Group[]> {
    const { page = 0, size = 10, sort, filter } = query;
    const skip = page * size;
    return from(
      this.groupModel
        .find(transformToMongoFilter<Group>(filter))
        .limit(skip)
        .skip(page)
        .sort({ ...sort })
        .exec(),
    );
  }

  count(query: Partial<QueryRequestDTO<GroupResponseDTO>>): Observable<number> {
    return from(
      this.groupModel
        .countDocuments(transformToMongoFilter<Group>(query.filter))
        .exec(),
    );
  }

  findOne(conditions?: FilterQuery<Group>): Observable<Group> {
    return from(this.groupModel.findOne(conditions).exec());
  }

  update(data: any): Observable<Group> {
    const { companyCode } = data;
    return from(
      this.groupModel
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

  delete(conditions?: FilterQuery<Group>): Observable<Group> {
    return from(this.groupModel.findOne(conditions)).pipe(
      tap((result) => result.remove()),
    );
  }
}
