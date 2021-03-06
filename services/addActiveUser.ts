import db from "../config/db.ts";
import { User, Status } from "../interfaces/User.ts";

const addActiveUser = async (username: string): Promise<User | null> => {
  const database = db;
  const users = database.collection("users");
  const newUser: User = {
    username,
    isAdmin: false,
    status: Status.active,
  };
  try {
    const user: any = users.insertOne(newUser);
    return user;
  } catch (error) {
    return null;
    console.log(error);
  }
};

export default addActiveUser;
