import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { IStoryDAO } from '../interface/IStoryDAO';
import { StatusDTO } from 'tweeter-shared';

const TABLE_NAME = 'tweeter-story';

export class DynamoStoryDAO implements IStoryDAO {
  private client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  async addStatusToStory(status: StatusDTO): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        author_alias: status.user.alias,
        timestamp: status.timestamp,
        post: status.post,
        author_firstName: status.user.firstName,
        author_lastName: status.user.lastName,
        author_imageUrl: status.user.imageUrl,
      },
    };

    await this.client.send(new PutCommand(params));
  }

  async getStory(authorAlias: string, pageSize: number, lastItem: StatusDTO | null): Promise<[StatusDTO[], boolean]> {
    const params: any = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'author_alias = :alias',
      ExpressionAttributeValues: {
        ':alias': authorAlias,
      },
      Limit: pageSize + 1,
      ScanIndexForward: false,
    };

    if (lastItem) {
      params.ExclusiveStartKey = {
        author_alias: authorAlias,
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
}
