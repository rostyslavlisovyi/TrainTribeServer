import { IUser } from "../interfaces/index.js";

export function completeName(user: IUser): string {
  const { firstName = "", lastName = "" } = user;
  return [firstName, lastName].filter(Boolean).join(" ");
}
