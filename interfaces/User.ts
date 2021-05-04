export enum Status {
  active = "active",
  waiting = "waiting",
  blocked = "blocked"
}

export interface User {
  username: string;
  isAdmin: boolean;
  status: Status;
}