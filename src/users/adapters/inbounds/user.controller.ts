import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { Transactional } from '@nestjs-cls/transactional';
import { StrictBuilder } from 'builder-pattern';
import type { UserUsername } from '../../applications/domains/user.domain';
import { CreateUserUseCase } from '../../applications/usecases/createUser.usecase';
import {
  GetUserByUsernameQuery,
  GetUserByUsernameUseCase,
} from '../../applications/usecases/getUserByUsername.usecase';
import { CreateUserDto } from './createUser.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase,
  ) {}

  @Post()
  @Transactional()
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  @Transactional()
  getByUsername(@Query('username') username: UserUsername) {
    const query = StrictBuilder<GetUserByUsernameQuery>().username(username).build();
    return this.getUserByUsernameUseCase.execute(query);
  }
}
