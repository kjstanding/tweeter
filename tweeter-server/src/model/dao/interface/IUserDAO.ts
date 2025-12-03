import { UserDTO } from 'tweeter-shared';

export interface IUserDAO {
  createUser(alias: string, firstName: string, lastName: string, passwordHash: string, imageUrl: string): Promise<void>;

  getUser(alias: string): Promise<UserDTO | null>;

  getPasswordHash(alias: string): Promise<string | null>;
}
