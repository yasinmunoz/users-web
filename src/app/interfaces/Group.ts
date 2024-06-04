import { Country } from "./Country";
import { Role } from "./Role";

export interface Group {
  id: number;
  name: string;
  country: Country;
  role: Role;
}
