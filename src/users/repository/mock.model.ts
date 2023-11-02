import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../schemas/users.schema';
import { commonRawPassword } from '../stubs/common.stub';

export class MockUserModel {
  entityStub: UserEntity;

  constructor(createEntityData: any) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(createEntityData: any): Promise<UserEntity> {
    this.entityStub = createEntityData;
    return Promise.resolve(this.entityStub);
  }

  save() {
    return Promise.resolve(this.entityStub);
  }

  static findOne(data: { username: string }) {
    return {
      lean: async () => ({
        username: data.username,
        password: await bcrypt.hash(commonRawPassword, '$2a$10$W7gJK5i.AgJtuI/zIW1jh.'),
      }),
    };
  }
}
