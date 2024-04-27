import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export const hashPw = async (pw: string) => {
  console.log(pw);
  return await bcrypt.hash(pw, saltOrRounds);
};

export const comparePw = async (pw: string, hash: string) => {
  return await bcrypt.compare(pw, hash);
};
