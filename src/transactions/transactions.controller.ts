import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from '../auth/guards/jwt-auth.guard.js';

import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { TransactionsService } from './transactions.service.js';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(request.user.sub, dto);
  }

  @Get()
  findMine(@Req() request: AuthenticatedRequest) {
    return this.transactionsService.findMine(request.user.sub);
  }
}
