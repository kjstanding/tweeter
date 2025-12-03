import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';

export abstract class BaseDynamoDAO {
  protected client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  protected async doPaginatedQuery<T>(
    params: QueryCommandInput,
    pageSize: number,
    mapper: (item: Record<string, any>) => T
  ): Promise<[T[], boolean]> {
    const result = await this.client.send(new QueryCommand(params));

    if (!result.Items || result.Items.length === 0) {
      return [[], false];
    }

    const hasMore = result.Items.length > pageSize;
    const items = hasMore ? result.Items.slice(0, pageSize) : result.Items;

    return [items.map(mapper), hasMore];
  }
}
