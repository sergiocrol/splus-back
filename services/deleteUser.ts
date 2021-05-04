import db from "../config/db.ts";
import { User } from "../interfaces/User.ts";

const deleteUser = async (username: string): Promise<User | null> => {
  const database = db.getDatabase;
  const users = database.collection("users");
  try {
    const user: any = users.deleteOne({ username });
    return user;
  } catch (error) {
    return null;
    console.log(error);
  }
};

export default deleteUser;
