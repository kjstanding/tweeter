import { StatusDTO } from 'tweeter-shared';
import { IDAOFactory } from '../dao/interface/IDAOFactory';
import { AuthorizationService } from './AuthorizationService';
import DAOFactoryProvider from '../dao/DAOFactoryProvider';

export class StatusService {
  private daoFactory: IDAOFactory;
  private authService: AuthorizationService;

  constructor(daoFactory?: IDAOFactory) {
    // Optional parameter for testing ease
    this.daoFactory = daoFactory ?? DAOFactoryProvider.getFactory();
    this.authService = new AuthorizationService(this.daoFactory);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    await this.authService.validateToken(token);

    const feedDAO = this.daoFactory.getFeedDAO();
    return await feedDAO.getFeed(userAlias, pageSize, lastItem);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    await this.authService.validateToken(token);

    const storyDAO = this.daoFactory.getStoryDAO();
    return await storyDAO.getStory(userAlias, pageSize, lastItem);
  }

  public async postStatus(token: string, newStatus: StatusDTO): Promise<void> {
    await this.authService.validateToken(token);

    const storyDAO = this.daoFactory.getStoryDAO();
    const feedDAO = this.daoFactory.getFeedDAO();
    const followDAO = this.daoFactory.getFollowDAO();

    await storyDAO.addStatusToStory(newStatus);
    const followers = await followDAO.getAllFollowers(newStatus.user.alias);

    if (followers.length > 0) {
      await feedDAO.batchWriteFeedItems(followers, newStatus);
    }
  }
}
