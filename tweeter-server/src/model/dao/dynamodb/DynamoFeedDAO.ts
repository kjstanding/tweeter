import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { IFeedDAO } from '../interface/IFeedDAO';
import { StatusDTO } from 'tweeter-shared';

const TABLE_NAME = 'tweeter-feed';

export class DynamoFeedDAO implements IFeedDAO {
  private client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  async addStatusToFeed(userAlias: string, status: StatusDTO): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        follower_alias: userAlias,
        timestamp: status.timestamp,
        post: status.post,
        author_alias: status.user.alias,
        author_firstName: status.user.firstName,
        author_lastName: status.user.lastName,
        author_imageUrl: status.user.imageUrl,
      },
    };

    await this.client.send(new PutCommand(params));
  }

  async getFeed(userAlias: string, pageSize: number, lastItem: StatusDTO | null): Promise<[StatusDTO[], boolean]> {
    const params: any = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'follower_alias = :alias',
      ExpressionAttributeValues: {
        ':alias': userAlias,
      },
      Limit: pageSize + 1,
      ScanIndexForward: false,
    };

    if (lastItem) {
      params.ExclusiveStartKey = {
        follower_alias: userAlias,
        timestamp: lastItem.timestamp,
      };
    }

    const result = await this.client.send(new QueryCommand(params));

    if (!result.Items || result.Items.length === 0) {
      return [[], false];
    }

    const hasMore = result.Items.length > pageSize;
    const items = hasMore ? result.Items.slice(0, pageSize) : result.Items;

    const statuses: StatusDTO[] = items.map((item) => ({
      user: {
        alias: item.author_alias,
        firstName: item.author_firstName,
        lastName: item.author_lastName,
        imageUrl: item.author_imageUrl,
      },
      post: item.post,
      timestamp: item.timestamp,
    }));

    return [statuses, hasMore];
  }

  async batchWriteFeedItems(followers: string[], status: StatusDTO): Promise<void> {
    // Split into batches of 25 (DynamoDB batch write limit)
    for (let i = 0; i < followers.length; i += 25) {
      const batch = followers.slice(i, i + 25);

      const putRequests = batch.map((follower) => ({
        PutRequest: {
          Item: {
            follower_alias: follower,
            timestamp: status.timestamp,
            post: status.post,
            author_alias: status.user.alias,
            author_firstName: status.user.firstName,
            author_lastName: status.user.lastName,
            author_imageUrl: status.user.imageUrl,
          },
        },
      }));

      const params = {
        RequestItems: {
          [TABLE_NAME]: putRequests,
        },
      };

      await this.client.send(new BatchWriteCommand(params));
    }
  }
}
