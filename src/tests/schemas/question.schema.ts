// src/tests/schemas/question.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true, type: [String] })
  options: string[];

  @Prop({ required: true })
  correctAnswer: string;

  @Prop()
  explanation: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
