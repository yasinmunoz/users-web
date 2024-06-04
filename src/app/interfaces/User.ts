import { Group } from "./Group";

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  group: Group
}
