import db from "../config/db.ts";
import { User, Status } from "../interfaces/User.ts";

const updateUser = async (
  username: string,
  status: string
): Promise<User | null> => {
  const database = db.getDatabase;
  const users = database.collection("users");
  try {
    const user: any = users.updateOne(
      { username: username },
      { $set: { status: status } }
    );
    return user;
  } catch (error) {
    return null;
    console.log(error);
  }
};

export default updateUser;
