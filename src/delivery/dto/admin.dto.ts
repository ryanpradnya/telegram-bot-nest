import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Admin } from '../../dataprovider/entity/admin.entity';

export class AdminResponseDTO {
  @Expose() username: string;
  @Expose() isActive: boolean;

  @Exclude()
  _id: string;

  @Exclude()
  __v: string;

  @Expose()
  get id(): string {
    return this._id.toString();
  }

  constructor(partial: Partial<AdminResponseDTO | Partial<Admin>>) {
    Object.assign(this, partial);
  }
}

export class CreateAdminDTO {
  @ApiProperty({
    example: 'abc',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    default: false,
    example: false,
    required: true,
  })
  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  readonly isActive: string;

  constructor(partial: Partial<CreateAdminDTO>) {
    Object.assign(this, partial);
  }
}
