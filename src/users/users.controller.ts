// src/users/users.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TestsService } from '../tests/tests.service';

@Controller('users')
export class UsersController {
  constructor(private testsService: TestsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('tests')
  async getUserTests(@Request() req) {
    const tests = await this.testsService.getTestsByUser(req.user.id);
    return {
      tests: tests.map((test) => ({
        id: test.id,
        startedAt: test.startedAt,
        finishedAt: test.finishedAt,
      })),
    };
  }
}