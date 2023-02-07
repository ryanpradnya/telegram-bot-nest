import { Injectable } from '@nestjs/common';
import { map, zip } from 'rxjs';
import { Admin } from '../../dataprovider/entity/admin.entity';
import { GroupRepository } from '../../dataprovider/repository/group.repository';
import { GroupResponseDTO } from '../../delivery/dto/group.dto';
import {
  QueryRequestDTO,
  QueryTransformDTO,
} from '../../delivery/dto/query.dto';
import { exposeAndExcludeTransform } from '../../utils/transform.util';
import { DefaultService } from '../default/default.usecase.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly defaultService: DefaultService,
  ) {}

  query(
    query: QueryRequestDTO<GroupResponseDTO>,
    transform: QueryTransformDTO,
  ) {
    return this.groupRepository.query(query).pipe(
      map((vals) =>
        vals.map((val) => {
          const result = exposeAndExcludeTransform<Admin>(
            val.toObject(),
            transform,
          );
          return new GroupResponseDTO(result);
        }),
      ),
    );
  }

  find(query: QueryRequestDTO<GroupResponseDTO>, transform: QueryTransformDTO) {
    const messageObservable = this.query(query, transform);
    const totalCountObservable = this.groupRepository.count(query);

    return zip(messageObservable, totalCountObservable).pipe(
      map(([data, total]) => {
        return {
          data,
          total,
        };
      }),
      this.defaultService.transformMultiDocument$<GroupResponseDTO>(),
    );
  }
}
