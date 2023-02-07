import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Admin } from '../entity/admin.entity';
import { AdminResponseDTO, CreateAdminDTO } from '../../delivery/dto/admin.dto';
import { QueryRequestDTO } from '../../delivery/dto/query.dto';
import { transformToMongoFilter } from '../../utils/transform-mongo.util';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
  ) {}

  create(data: CreateAdminDTO): Observable<Admin> {
    return from(new this.adminModel(data).save());
  }

  query(query: Partial<any>): Observable<Admin[]> {
    const { page = 0, size = 10, sort, filter } = query;
    const skip = page * size;
    return from(
      this.adminModel
        .find(transformToMongoFilter<Admin>(filter))
        .limit(skip)
        .skip(page)
        .sort({ ...sort })
        .exec(),
    );
  }

  count(query: Partial<QueryRequestDTO<AdminResponseDTO>>): Observable<number> {
    return from(
      this.adminModel
        .countDocuments(transformToMongoFilter<Admin>(query.filter))
        .exec(),
    );
  }

  findOne(conditions?: FilterQuery<Admin>): Observable<Admin> {
    return from(this.adminModel.findOne(conditions).exec());
  }

  update(data: any): Observable<Admin> {
    const { companyCode } = data;
    return from(
      this.adminModel
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

  delete(conditions?: FilterQuery<Admin>): Observable<Admin> {
    return from(this.adminModel.findOne(conditions)).pipe(
      tap((result) => result.remove()),
    );
  }
}
