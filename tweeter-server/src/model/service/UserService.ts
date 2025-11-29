import { Buffer } from 'buffer';
import { FakeData, UserDTO } from 'tweeter-shared';

export class UserService {
  public async login(alias: string, password: string): Promise<[UserDTO, string]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error('Invalid alias or password');
    }

    return [user.dto, FakeData.instance.authToken.token];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string,
    imageFileExtension: string
  ): Promise<[UserDTO, string]> {
    // Convert base64 string back to Uint8Array
    const imageBytes: Uint8Array = Uint8Array.from(Buffer.from(userImageBase64, 'base64'));

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error('Invalid registration');
    }
    return [user.dto, FakeData.instance.authToken.token];
  }

  public async logout(token: string): Promise<void> {
    // TODO: Call the server
    await new Promise((res) => setTimeout(res, 1000));
  }

  public async getUser(token: string, alias: string): Promise<UserDTO | null> {
    // TODO: Replace with the result of calling server
    const user = FakeData.instance.findUserByAlias(alias);
    return user ? user.dto : null;
  }
}
