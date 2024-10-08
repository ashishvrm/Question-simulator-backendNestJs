// src/tests/schemas/test.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestDocument = Test & Document;

@Schema()
export class Test {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Question' }], required: true })
  questions: Types.ObjectId[];

  @Prop({ type: Map, of: String, default: {} })
  answers: Map<string, string>;

  @Prop({ default: Date.now })
  startedAt: Date;

  @Prop()
  finishedAt: Date;
}

export const TestSchema = SchemaFactory.createForClass(Test);
