export interface IBcryptWraper {
  hash(input: string, salt: string): Promise<string>
}
