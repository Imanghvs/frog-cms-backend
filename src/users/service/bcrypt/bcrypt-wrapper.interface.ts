export interface IBcryptWraper {
  genSalt(rounds: number): Promise<string>;
  hash(input: string, salt: string): Promise<string>
}
