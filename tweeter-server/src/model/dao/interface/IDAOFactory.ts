import { IUserDAO } from './IUserDAO';
import { IAuthTokenDAO } from './IAuthTokenDAO';
import { IFollowDAO } from './IFollowDAO';
import { IStoryDAO } from './IStoryDAO';
import { IFeedDAO } from './IFeedDAO';
import { IS3DAO } from './IS3DAO';

export interface IDAOFactory {
  getUserDAO(): IUserDAO;
  getAuthTokenDAO(): IAuthTokenDAO;
  getFollowDAO(): IFollowDAO;
  getStoryDAO(): IStoryDAO;
  getFeedDAO(): IFeedDAO;
  getS3DAO(): IS3DAO;
}
