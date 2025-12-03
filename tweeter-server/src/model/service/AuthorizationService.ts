import { IDAOFactory } from '../dao/interface/IDAOFactory';
import DAOFactoryProvider from '../dao/DAOFactoryProvider';

export class AuthorizationService {
  private daoFactory: IDAOFactory;

  constructor(daoFactory?: IDAOFactory) {
    // Optional parameter for testing ease
    this.daoFactory = daoFactory ?? DAOFactoryProvider.getFactory();
  }

  async validateToken(token: string): Promise<string> {
    if (!token) {
      throw new Error('[401] Invalid or expired auth token');
    }

    const authTokenDAO = this.daoFactory.getAuthTokenDAO();
    const alias = await authTokenDAO.validateAuthToken(token);

    if (!alias) {
      throw new Error('[401] Invalid or expired auth token');
    }

    await authTokenDAO.updateAuthTokenTimestamp(token, Date.now());

    return alias;
  }
}
