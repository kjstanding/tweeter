import { UserDTO } from 'tweeter-shared';
import { IDAOFactory } from '../dao/interface/IDAOFactory';
import { AuthorizationService } from './AuthorizationService';
import DAOFactoryProvider from '../dao/DAOFactoryProvider';

export class FollowService {
  private daoFactory: IDAOFactory;
  private authService: AuthorizationService;

  constructor(daoFactory?: IDAOFactory) {
    // Optional parameter for testing ease
    this.daoFactory = daoFactory ?? DAOFactoryProvider.getFactory();
    this.authService = new AuthorizationService(this.daoFactory);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    await this.authService.validateToken(token);

    const followDAO = this.daoFactory.getFollowDAO();
    return await followDAO.getFollowers(userAlias, pageSize, lastItem);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    await this.authService.validateToken(token);

    const followDAO = this.daoFactory.getFollowDAO();
    return await followDAO.getFollowees(userAlias, pageSize, lastItem);
  }

  public async follow(token: string, userToFollow: UserDTO): Promise<[followerCount: number, followeeCount: number]> {
    const currentUserAlias = await this.authService.validateToken(token);

    const followDAO = this.daoFactory.getFollowDAO();
    const userDAO = this.daoFactory.getUserDAO();

    // Check if already following
    const isAlreadyFollowing = await followDAO.isFollowing(currentUserAlias, userToFollow.alias);
    if (isAlreadyFollowing) {
      throw new Error('[400] Already following this user');
    }

    // Get both users' full data for denormalization
    const [currentUser, targetUser] = await Promise.all([
      userDAO.getUser(currentUserAlias),
      userDAO.getUser(userToFollow.alias),
    ]);

    if (!currentUser || !targetUser) {
      throw new Error('[404] User not found');
    }

    // Pass full user objects to DAO for denormalization
    await followDAO.follow(currentUser, targetUser);

    // Get updated counts
    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    const currentUserAlias = await this.authService.validateToken(token);

    const followDAO = this.daoFactory.getFollowDAO();

    // Check if following
    const isFollowing = await followDAO.isFollowing(currentUserAlias, userToUnfollow.alias);
    if (!isFollowing) {
      throw new Error('[400] Not following this user');
    }

    await followDAO.unfollow(currentUserAlias, userToUnfollow.alias);

    // Get updated counts
    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }

  public async getIsFollowerStatus(token: string, user: UserDTO, selectedUser: UserDTO): Promise<boolean> {
    await this.authService.validateToken(token);

    const followDAO = this.daoFactory.getFollowDAO();
    return await followDAO.isFollowing(user.alias, selectedUser.alias);
  }

  public async getFolloweeCount(token: string, user: UserDTO): Promise<number> {
    await this.authService.validateToken(token);

    const followDAO = this.daoFactory.getFollowDAO();
    return await followDAO.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDTO): Promise<number> {
    await this.authService.validateToken(token);

    const followDAO = this.daoFactory.getFollowDAO();
    return await followDAO.getFollowerCount(user.alias);
  }
}
