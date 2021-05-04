import db from "../config/db.ts";
import { User } from "../interfaces/User.ts";

const getAllUser = async (): Promise<User[] | null> => {
  const database = db.getDatabase;
  const users = database.collection("users");
  const res: any = await users.find({ isAdmin: { $ne: true } }).toArray();
  return res;
};

export default getAllUser;
