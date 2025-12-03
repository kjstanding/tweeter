import { DynamoDBClient, Select } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { IFollowDAO } from '../interface/IFollowDAO';
import { UserDTO } from 'tweeter-shared';

const TABLE_NAME = 'tweeter-follows';
const INDEX_NAME = 'followee-follower-index';

export class DynamoFollowDAO implements IFollowDAO {
  private client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  async follow(follower: UserDTO, followee: UserDTO): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        follower_alias: follower.alias,
        followee_alias: followee.alias,
        follower_firstName: follower.firstName,
        follower_lastName: follower.lastName,
        follower_imageUrl: follower.imageUrl,
        followee_firstName: followee.firstName,
        followee_lastName: followee.lastName,
        followee_imageUrl: followee.imageUrl,
      },
    };

    await this.client.send(new PutCommand(params));
  }

  async unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        follower_alias: followerAlias,
        followee_alias: followeeAlias,
      },
    };

    await this.client.send(new DeleteCommand(params));
  }

  async isFollowing(followerAlias: string, followeeAlias: string): Promise<boolean> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        follower_alias: followerAlias,
        followee_alias: followeeAlias,
      },
    };

    const result = await this.client.send(new GetCommand(params));
    return !!result.Item;
  }

  async getFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollower: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    const params: any = {
      TableName: TABLE_NAME,
      IndexName: INDEX_NAME,
      KeyConditionExpression: 'followee_alias = :followee',
      ExpressionAttributeValues: {
        ':followee': followeeAlias,
      },
      Limit: pageSize + 1,
    };

    if (lastFollower) {
      params.ExclusiveStartKey = {
        followee_alias: followeeAlias,
        follower_alias: lastFollower.alias,
      };
    }

    const result = await this.client.send(new QueryCommand(params));

    if (!result.Items || result.Items.length === 0) {
      return [[], false];
    }

    const hasMore = result.Items.length > pageSize;
    const items = hasMore ? result.Items.slice(0, pageSize) : result.Items;

    const users: UserDTO[] = items.map((item) => ({
      alias: item.follower_alias,
      firstName: item.follower_firstName,
      lastName: item.follower_lastName,
      imageUrl: item.follower_imageUrl,
    }));

    return [users, hasMore];
  }

  async getFollowees(
    followerAlias: string,
    pageSize: number,
    lastFollowee: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    const params: any = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'follower_alias = :follower',
      ExpressionAttributeValues: {
        ':follower': followerAlias,
      },
      Limit: pageSize + 1,
    };

    if (lastFollowee) {
      params.ExclusiveStartKey = {
        follower_alias: followerAlias,
        followee_alias: lastFollowee.alias,
      };
    }

    const result = await this.client.send(new QueryCommand(params));

    if (!result.Items || result.Items.length === 0) {
      return [[], false];
    }

    const hasMore = result.Items.length > pageSize;
    const items = hasMore ? result.Items.slice(0, pageSize) : result.Items;

    const users: UserDTO[] = items.map((item) => ({
      alias: item.followee_alias,
      firstName: item.followee_firstName,
      lastName: item.followee_lastName,
      imageUrl: item.followee_imageUrl,
    }));

    return [users, hasMore];
  }

  async getFollowerCount(followeeAlias: string): Promise<number> {
    const params = {
      TableName: TABLE_NAME,
      IndexName: INDEX_NAME,
      KeyConditionExpression: 'followee_alias = :followee',
      ExpressionAttributeValues: {
        ':followee': followeeAlias,
      },
      Select: Select.COUNT,
    };

    const result = await this.client.send(new QueryCommand(params));
    return result.Count ?? 0;
  }

  async getFolloweeCount(followerAlias: string): Promise<number> {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'follower_alias = :follower',
      ExpressionAttributeValues: {
        ':follower': followerAlias,
      },
      Select: Select.COUNT,
    };

    const result = await this.client.send(new QueryCommand(params));
    return result.Count ?? 0;
  }

  async getAllFollowers(followeeAlias: string): Promise<string[]> {
    const followers: string[] = [];
    let lastKey = undefined;

    while (true) {
      const params: any = {
        TableName: TABLE_NAME,
        IndexName: INDEX_NAME,
        KeyConditionExpression: 'followee_alias = :followee',
        ExpressionAttributeValues: {
          ':followee': followeeAlias,
        },
        ProjectionExpression: 'follower_alias',
      };

      if (lastKey) {
        params.ExclusiveStartKey = lastKey;
      }

      const result = await this.client.send(new QueryCommand(params));

      if (result.Items) {
        followers.push(...result.Items.map((item) => item.follower_alias));
      }

      lastKey = result.LastEvaluatedKey;
      if (!lastKey) {
        break;
      }
    }

    return followers;
  }
}
