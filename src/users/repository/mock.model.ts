import { UserEntity } from '../schemas/users.schema';

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
}
