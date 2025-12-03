import { IDAOFactory } from '../interface/IDAOFactory';
import { IUserDAO } from '../interface/IUserDAO';
import { IAuthTokenDAO } from '../interface/IAuthTokenDAO';
import { IFollowDAO } from '../interface/IFollowDAO';
import { IStoryDAO } from '../interface/IStoryDAO';
import { IFeedDAO } from '../interface/IFeedDAO';
import { IS3DAO } from '../interface/IS3DAO';
import { DynamoUserDAO } from './DynamoUserDAO';
import { DynamoAuthTokenDAO } from './DynamoAuthTokenDAO';
import { DynamoFollowDAO } from './DynamoFollowDAO';
import { DynamoStoryDAO } from './DynamoStoryDAO';
import { DynamoFeedDAO } from './DynamoFeedDAO';
import { S3DAO } from './S3DAO';

export class DynamoDAOFactory implements IDAOFactory {
  private userDAO: IUserDAO | null = null;
  private authTokenDAO: IAuthTokenDAO | null = null;
  private followDAO: IFollowDAO | null = null;
  private storyDAO: IStoryDAO | null = null;
  private feedDAO: IFeedDAO | null = null;
  private s3DAO: IS3DAO | null = null;

  getUserDAO(): IUserDAO {
    if (!this.userDAO) {
      this.userDAO = new DynamoUserDAO();
    }
    return this.userDAO;
  }

  getAuthTokenDAO(): IAuthTokenDAO {
    if (!this.authTokenDAO) {
      this.authTokenDAO = new DynamoAuthTokenDAO();
    }
    return this.authTokenDAO;
  }

  getFollowDAO(): IFollowDAO {
    if (!this.followDAO) {
      this.followDAO = new DynamoFollowDAO();
    }
    return this.followDAO;
  }

  getStoryDAO(): IStoryDAO {
    if (!this.storyDAO) {
      this.storyDAO = new DynamoStoryDAO();
    }
    return this.storyDAO;
  }

  getFeedDAO(): IFeedDAO {
    if (!this.feedDAO) {
      this.feedDAO = new DynamoFeedDAO();
    }
    return this.feedDAO;
  }

  getS3DAO(): IS3DAO {
    if (!this.s3DAO) {
      this.s3DAO = new S3DAO();
    }
    return this.s3DAO;
  }
}
