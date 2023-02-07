import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Group } from '../../dataprovider/entity/group.entity';

export class GroupResponseDTO {
  @Expose() groupCode: string;
  @Expose() groupId: string;
  @Expose() groupTitle: string;
  @Expose() groupType: string;
  @Expose() isActive: boolean;

  @Exclude()
  _id: string;

  @Exclude()
  __v: string;

  @Expose()
  get id(): string {
    return this._id.toString();
  }

  constructor(partial: Partial<GroupResponseDTO | Partial<Group>>) {
    Object.assign(this, partial);
  }
}

export class CreateGroupDTO {
  @ApiProperty({
    example: 'abc',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  readonly groupCode: string;

  @ApiProperty({
    example: '001',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  readonly groupId: string;

  @ApiProperty({
    example: 'abc',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  readonly groupTitle: string;

  @ApiProperty({
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  readonly groupType: string;

  @ApiProperty({
    default: false,
    example: false,
    required: true,
  })
  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  readonly isActive: string;

  constructor(partial: Partial<CreateGroupDTO>) {
    Object.assign(this, partial);
  }
}
