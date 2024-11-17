import bcrypt from "bcrypt";

export const hashPassword = async (plainPassword: string): Promise<string> => {
  const saltRounds: number = 12;
  return await bcrypt.hash(plainPassword, saltRounds);
};

export const verifyPassword = async (
  plainPassword: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hash);
};
