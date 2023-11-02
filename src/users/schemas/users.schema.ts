import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserEntity> & { createdAt: string; updatedAt: string };

@Schema({ collection: 'users', timestamps: true })
export class UserEntity {
  @Prop({
    type: String, required: true, index: true, unique: true,
  })
    username: string;

  @Prop({ type: String, required: true })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
