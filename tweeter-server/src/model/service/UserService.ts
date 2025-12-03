import { Buffer } from 'buffer';
import { UserDTO } from 'tweeter-shared';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { IDAOFactory } from '../dao/interface/IDAOFactory';
import { AuthorizationService } from './AuthorizationService';
import DAOFactoryProvider from '../dao/DAOFactoryProvider';

export class UserService {
  private daoFactory: IDAOFactory;
  private authService: AuthorizationService;

  constructor(daoFactory?: IDAOFactory) {
    // Optional parameter for testing ease
    this.daoFactory = daoFactory ?? DAOFactoryProvider.getFactory();
    this.authService = new AuthorizationService(this.daoFactory);
  }

  public async login(alias: string, password: string): Promise<[UserDTO, string]> {
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();

    const user = await userDAO.getUser(alias);
    const passwordHash = await userDAO.getPasswordHash(alias);
    if (!user || !passwordHash) {
      throw new Error('[401] Invalid alias or password');
    }

    const isValidPassword = await bcrypt.compare(password, passwordHash);
    if (!isValidPassword) {
      throw new Error('[401] Invalid alias or password');
    }

    const token = uuidv4();
    await authTokenDAO.createAuthToken(token, alias, Date.now());

    return [user, token];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBase64: string,
    imageFileExtension: string
  ): Promise<[UserDTO, string]> {
    const userDAO = this.daoFactory.getUserDAO();
    const authTokenDAO = this.daoFactory.getAuthTokenDAO();
    const s3DAO = this.daoFactory.getS3DAO();

    const existingUser = await userDAO.getUser(alias);
    if (existingUser) {
      throw new Error('[400] User with this alias already exists');
    }

    const imageBytes: Buffer = Buffer.from(userImageBase64, 'base64');

    const imageFileName = `${alias}-${Date.now()}.${imageFileExtension}`;
    const imageType = imageFileExtension === 'png' ? 'image/png' : 'image/jpeg'; // TODO: Check this line later
    const imageUrl = await s3DAO.uploadImage(imageFileName, imageBytes, imageType);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    await userDAO.createUser(alias, firstName, lastName, passwordHash, imageUrl);

    const token = uuidv4();
    await authTokenDAO.createAuthToken(token, alias, Date.now());

    const user: UserDTO = {
      alias,
      firstName,
      lastName,
      imageUrl,
    };

    return [user, token];
  }

  public async logout(token: string): Promise<void> {
    await this.authService.validateToken(token);

    const authTokenDAO = this.daoFactory.getAuthTokenDAO();
    await authTokenDAO.deleteAuthToken(token);
  }

  public async getUser(token: string, alias: string): Promise<UserDTO | null> {
    await this.authService.validateToken(token);

    const userDAO = this.daoFactory.getUserDAO();
    return await userDAO.getUser(alias);
  }
}
