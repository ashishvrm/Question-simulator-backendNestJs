// src/tests/tests.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Test, TestDocument } from './schemas/test.schema';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';

@Injectable()
export class TestsService {
  constructor(
    @InjectModel(Test.name) private testModel: Model<TestDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async createTest(userId: string): Promise<TestDocument> {
    const questions = await this.questionModel.aggregate([{ $sample: { size: 180 } }]);
    const test = new this.testModel({
      user: new Types.ObjectId(userId),
      questions: questions.map((q) => q._id),
      answers: {},
    });
    return test.save();
  }

  async getTest(testId: string): Promise<TestDocument> {
    return this.testModel
      .findById(testId)
      .populate('questions')
      .exec();
  }

  async submitAnswer(testId: string, questionId: string, answer: string): Promise<void> {
    await this.testModel.updateOne(
      { _id: testId },
      { $set: { [`answers.${questionId}`]: answer } },
    );
  }

  async finishTest(testId: string): Promise<void> {
    await this.testModel.updateOne(
      { _id: testId },
      { $set: { finishedAt: new Date() } },
    );
  }

  async getTestResults(testId: string): Promise<any> {
    const test = await this.testModel
      .findById(testId)
      .populate('questions')
      .exec();

    const results = test.questions.map((question: any) => {
      const userAnswer = test.answers.get(question._id.toString());
      const isCorrect = userAnswer === question.correctAnswer;
      return {
        question: question.text,
        yourAnswer: userAnswer,
        isCorrect,
        explanation: question.explanation,
      };
    });

    return results;
  }

  async getTestsByUser(userId: string): Promise<TestDocument[]> {
    return this.testModel.find({ user: userId }).exec();
  }
}
