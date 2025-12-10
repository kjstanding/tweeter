import 'isomorphic-fetch';
import { Buffer } from 'buffer';
import { ServerFacade } from '../../src/model/network/ServerFacade';
import { StatusService } from '../../src/model/service/StatusService';
import { PostStatusPresenter, PostStatusView } from '../../src/presenters/PostStatusPresenter';
import { RegisterRequest, AuthToken, User, Status } from 'tweeter-shared';
import { instance, mock, spy, verify, capture, anything } from '@typestrong/ts-mockito';

describe('Post Status Integration Test', () => {
  const serverFacade = new ServerFacade();
  const statusService = new StatusService();
  let authToken: AuthToken;
  let user: User;
  let presenter: PostStatusPresenter;
  let mockView: PostStatusView;
  let viewSpy: PostStatusView;

  beforeAll(async () => {
    const imageBytes = new Uint8Array([1, 2, 3]);
    const imageStringBase64: string = Buffer.from(imageBytes).toString('base64');
    const request: RegisterRequest = {
      firstName: 'Test',
      lastName: 'User',
      alias: `@PostStatusTest${Date.now()}`,
      password: 'password123',
      userImageBase64: imageStringBase64,
      imageFileExtension: 'png',
    };

    [user, authToken] = await serverFacade.register(request);
  });

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    viewSpy = instance(mockView);
    presenter = new PostStatusPresenter(viewSpy);
  });

  test('Status appended to story after posting', async () => {
    const testPost = 'Test status for Post Status Integration Test';
    const beforeTimestamp = Date.now();

    // Post the status
    await presenter.submitPost(testPost, user, authToken);

    // Verify success message displayed
    verify(mockView.displayInfoMessage('Status posted!', 2000)).once();

    // Get user's story
    const [storyStatuses] = await statusService.loadMoreStoryItems(authToken, user.alias, 10, null);

    const postedStatus = storyStatuses[0];
    expect(postedStatus).toBeDefined();
    expect(postedStatus.post).toBe(testPost);
    expect(postedStatus.user.alias).toBe(user.alias);
    expect(postedStatus.user.firstName).toBe(user.firstName);
    expect(postedStatus.user.lastName).toBe(user.lastName);
    expect(postedStatus.user.imageUrl).toBe(user.imageUrl);
    expect(postedStatus.timestamp).toBeGreaterThanOrEqual(beforeTimestamp);
    expect(postedStatus.timestamp).toBeLessThanOrEqual(Date.now());
  });
});
