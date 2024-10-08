// src/tests/tests.controller.ts
import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { TestsService } from './tests.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @Controller('tests')
  export class TestsController {
    constructor(private readonly testsService: TestsService) {}
  
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createTest(@Request() req) {
      const test = await this.testsService.createTest(req.user.id);
      return { testId: test.id };
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getTest(@Param('id') id: string) {
      const test = await this.testsService.getTest(id);
      return test;
    }
  
    @UseGuards(JwtAuthGuard)
    @Post(':id/answer')
    async submitAnswer(
      @Param('id') id: string,
      @Body() body: { questionId: string; answer: string },
    ) {
      await this.testsService.submitAnswer(id, body.questionId, body.answer);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post(':id/finish')
    async finishTest(@Param('id') id: string) {
      await this.testsService.finishTest(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id/results')
    async getTestResults(@Param('id') id: string) {
      const results = await this.testsService.getTestResults(id);
      return { results };
    }
  }
  