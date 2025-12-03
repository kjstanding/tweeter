import { PutCommand, GetCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { IAuthTokenDAO } from '../interface/IAuthTokenDAO';
import { BaseDynamoDAO } from './BaseDynamoDAO';

const TABLE_NAME = 'tweeter-authtokens';
const AUTHTOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

export class DynamoAuthTokenDAO extends BaseDynamoDAO implements IAuthTokenDAO {
  async createAuthToken(token: string, alias: string, timestamp: number): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        token,
        alias,
        timestamp,
      },
    };

    await this.client.send(new PutCommand(params));
  }

  async validateAuthToken(token: string): Promise<string | null> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        token,
      },
    };

    const result = await this.client.send(new GetCommand(params));

    if (!result.Item) {
      return null;
    }

    const currentTime = Date.now();
    if (currentTime - result.Item.timestamp > AUTHTOKEN_EXPIRATION) {
      await this.deleteAuthToken(token);
      return null;
    }

    return result.Item.alias;
  }

  async deleteAuthToken(token: string): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        token,
      },
    };

    await this.client.send(new DeleteCommand(params));
  }

  async updateAuthTokenTimestamp(token: string, timestamp: number): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        token,
      },
      UpdateExpression: 'SET #timestamp = :timestamp',
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp',
      },
      ExpressionAttributeValues: {
        ':timestamp': timestamp,
      },
    };

    await this.client.send(new UpdateCommand(params));
  }
}
