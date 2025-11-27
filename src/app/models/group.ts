import { Transaction } from "./transaction";
import { User } from "./user";

export interface Group {
  id: number;
  name: string;
  createdAt: string;
  lastUpdatedAt: string;
  members: User[];
  transactions?: Transaction[];
}
