import { UserEntity } from '../schemas/users.schema';

export class MockUserModel {
  entityStub: UserEntity;

  constructor(createEntityData: any) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(createEntityData: any): void {
    this.entityStub = createEntityData;
  }

  save() {
    return Promise.resolve(this.entityStub);
  }
}
