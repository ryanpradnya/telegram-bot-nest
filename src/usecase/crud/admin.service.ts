import { Injectable } from '@nestjs/common';
import { map, zip } from 'rxjs';
import { Admin } from '../../dataprovider/entity/admin.entity';
import { AdminRepository } from '../../dataprovider/repository/admin.repository';
import { AdminResponseDTO } from '../../delivery/dto/admin.dto';
import {
  QueryRequestDTO,
  QueryTransformDTO,
} from '../../delivery/dto/query.dto';
import { exposeAndExcludeTransform } from '../../utils/transform.util';
import { DefaultService } from '../default/default.usecase.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly defaultService: DefaultService,
  ) {}

  query(
    query: QueryRequestDTO<AdminResponseDTO>,
    transform: QueryTransformDTO,
  ) {
    return this.adminRepository.query(query).pipe(
      map((vals) =>
        vals.map((val) => {
          const result = exposeAndExcludeTransform<Admin>(
            val.toObject(),
            transform,
          );
          return new AdminResponseDTO(result);
        }),
      ),
    );
  }

  find(query: QueryRequestDTO<AdminResponseDTO>, transform: QueryTransformDTO) {
    const messageObservable = this.query(query, transform);
    const totalCountObservable = this.adminRepository.count(query);

    return zip(messageObservable, totalCountObservable).pipe(
      map(([data, total]) => {
        return {
          data,
          total,
        };
      }),
      this.defaultService.transformMultiDocument$<AdminResponseDTO>(),
    );
  }
}
