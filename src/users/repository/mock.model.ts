import { UserEntity } from '../schemas/users.schema';

/* eslint-disable class-methods-use-this */
export class MockUserModel {
  entityStub: UserEntity;

  constructor(createEntityData: any) {
    this.constructorSpy(createEntityData);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructorSpy(createEntityData: any): void {
    this.entityStub = createEntityData;
  }

  save() {
    return Promise.resolve(this.entityStub);
  }
}
