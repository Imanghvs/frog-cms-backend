export interface IBcryptWraper {
  hash(input: string, salt: string): Promise<string>
  compare(inputPassword: string, validHash: string): Promise<boolean>
}
