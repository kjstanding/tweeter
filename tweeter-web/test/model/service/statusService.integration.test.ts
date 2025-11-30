import 'isomorphic-fetch';
import { Buffer } from 'buffer';
import { ServerFacade } from '../../../src/model/network/ServerFacade';
import { StatusService } from '../../../src/model/service/StatusService';
import { RegisterRequest, AuthToken, Status } from 'tweeter-shared';

describe('StatusService Integration Test', () => {
  const serverFacade = new ServerFacade();
  const statusService = new StatusService();
  let authToken: AuthToken;
  let userAlias: string;

  beforeAll(async () => {
    const imageBytes = new Uint8Array([3, 4, 5]);
    const imageStringBase64: string = Buffer.from(imageBytes).toString('base64');
    const request: RegisterRequest = {
      firstName: 'Test',
      lastName: 'User',
      alias: '@TestUser',
      password: 'password',
      userImageBase64: imageStringBase64,
      imageFileExtension: 'png',
    };

    const [user, token] = await serverFacade.register(request);
    userAlias = user.alias;
    authToken = token;
  });

  test('loadMoreStoryItems', async () => {
    const pageSize = 5;
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(authToken, userAlias, pageSize, null);
    expect(statuses.length).toBe(pageSize);
    expect(hasMore).toBe(true);
    expect(statuses[0].post).toMatch(/Post 0 0/);
    expect(statuses[0].user.alias).toBe('@allen');
    expect(statuses[1].post).toMatch(/Post 0 1/);
  });

  test('loadMoreStoryItems 2nd Page', async () => {
    const pageSize = 5;
    const [firstPage] = await statusService.loadMoreStoryItems(authToken, userAlias, pageSize, null);
    const [secondPage] = await statusService.loadMoreStoryItems(authToken, userAlias, pageSize, firstPage[pageSize - 1]);
    expect(secondPage[0].post).toMatch(/Post 0 5/);
  });
});
