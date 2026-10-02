import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @IsIn(['credit', 'debit'])
  type: 'credit' | 'debit';

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
