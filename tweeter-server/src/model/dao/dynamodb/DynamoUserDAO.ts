import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { IUserDAO } from '../interface/IUserDAO';
import { UserDTO } from 'tweeter-shared';

const TABLE_NAME = 'tweeter-users';

export class DynamoUserDAO implements IUserDAO {
  private client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  async createUser(
    alias: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
    imageUrl: string
  ): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        alias,
        firstName,
        lastName,
        passwordHash,
        imageUrl,
      },
    };

    await this.client.send(new PutCommand(params));
  }

  async getUser(alias: string): Promise<UserDTO | null> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        alias,
      },
    };

    const result = await this.client.send(new GetCommand(params));

    if (!result.Item) {
      return null;
    }

    return {
      alias: result.Item.alias,
      firstName: result.Item.firstName,
      lastName: result.Item.lastName,
      imageUrl: result.Item.imageUrl,
    };
  }

  async getPasswordHash(alias: string): Promise<string | null> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        alias,
      },
    };

    const result = await this.client.send(new GetCommand(params));

    if (!result.Item) {
      return null;
    }

    return result.Item.passwordHash;
  }
}
