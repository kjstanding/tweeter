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
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDTO, string]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string = Buffer.from(userImageBytes).toString('base64');

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
