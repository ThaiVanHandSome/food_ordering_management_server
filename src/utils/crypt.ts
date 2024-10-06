import bcrypt from 'bcrypt'

export const compareValue = (plainText: string, hash: string) => {
  return bcrypt.compareSync(plainText, hash)
}
