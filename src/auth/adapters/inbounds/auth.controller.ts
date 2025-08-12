import { Body, Controller, HttpStatus, Post } from '@nestjs/common';

import { Transactional } from '@nestjs-cls/transactional';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StrictBuilder } from 'builder-pattern';
import type { LoginCommand } from '../../usecases/login.usecase';
import { LoginUseCase } from '../../usecases/login.usecase';
import type { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully logged in.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The username or password is incorrect.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const command = StrictBuilder<LoginCommand>().username(loginDto.username).password(loginDto.password).build();

    const accessToken = await this.loginUseCase.execute(command);
    return {
      accessToken,
    };
  }
}
