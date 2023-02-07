import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Command } from '../../dataprovider/entity/command.entity';

export class CommandResponseDTO {
  @Expose() command: string;
  @Expose() isActive: boolean;
  @Expose() description: boolean;

  @Exclude()
  _id: string;

  @Exclude()
  __v: string;

  @Expose()
  get id(): string {
    return this._id.toString();
  }

  constructor(partial: Partial<CommandResponseDTO | Partial<Command>>) {
    Object.assign(this, partial);
  }
}

export class CreateCommandDTO {
  @ApiProperty({
    example: 'start',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  readonly command: string;

  @ApiProperty({
    default: false,
    example: false,
    required: true,
  })
  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  readonly isActive: string;

  @ApiProperty({
    default: '',
    example: '',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  readonly description: string;

  constructor(partial: Partial<CreateCommandDTO>) {
    Object.assign(this, partial);
  }
}
