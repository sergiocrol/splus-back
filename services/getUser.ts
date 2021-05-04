import db from "../config/db.ts";
import { User } from "../interfaces/User.ts";

const getUser = async (username: string): Promise<User | null> => {
  const database = db;
  const users = database.collection("users");

  const user: any = await users.findOne(
    { username },
    // @ts-ignore
    { noCursorTimeout: false }
  );
  return user;
};

export default getUser;
