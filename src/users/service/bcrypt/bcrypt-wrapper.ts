/* eslint-disable class-methods-use-this */
import * as bcrypt from 'bcryptjs';
import { IBcryptWraper } from './bcrypt-wrapper.interface';

export class BcryptWrapper implements IBcryptWraper {
  genSalt(rounds: number): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(rounds, (err, salt) => {
        if (err) reject(err);
        resolve(salt);
      });
    });
  }

  hash(input: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(input, salt, (error, hash) => {
        if (error) reject(error);
        resolve(hash);
      });
    });
  }
}
