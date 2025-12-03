export interface IAuthTokenDAO {
  createAuthToken(token: string, alias: string, timestamp: number): Promise<void>;

  validateAuthToken(token: string): Promise<string | null>;

  deleteAuthToken(token: string): Promise<void>;

  updateAuthTokenTimestamp(token: string, timestamp: number): Promise<void>; // ?
}
