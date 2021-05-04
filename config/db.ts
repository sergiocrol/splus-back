import { MongoClient } from "../deps.ts";
import { DB_NAME, DB_HOST, DB_USERNAME, DB_PASSWORD } from "./config.ts";

// class DB {
//   public client: MongoClient;
//   constructor(public dbName: string, public url: string) {
//     this.dbName = dbName;
//     this.url = url;
//     this.client = {} as MongoClient;
//   }

//   connect() {
//     const client = new MongoClient();
//     client.connect(this.url);
//     console.log(client);
//     this.client = client;
//   }

//   get getDatabase() {
//     return this.client.database(this.dbName);
//   }
// }

// const db = new DB(DB_NAME, DB_URL);
// db.connect();

// export default db;

const client = new MongoClient();

await client.connect({
  db: DB_NAME,
  tls: true,
  servers: [
    {
      host: DB_HOST,
      port: 27017,
    },
  ],
  credential: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    db: DB_NAME,
    mechanism: "SCRAM-SHA-1",
  },
});

const db = client.database(DB_NAME);

export default db;
