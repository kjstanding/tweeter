import {
  AuthResponse,
  AuthToken,
  FollowCountResponse,
  FollowRequest,
  FollowResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerStatusRequest,
  IsFollowerStatusResponse,
  LoginRequest,
  LogoutRequest,
  PagedItemRequest,
  PagedItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  StatusDTO,
  TweeterResponse,
  User,
  UserDTO,
} from 'tweeter-shared';
import { ClientCommunicator } from './ClientCommunicator';

export class ServerFacade {
  private SERVER_URL = 'https://syo9zl3582.execute-api.us-west-1.amazonaws.com/dev';

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  // TODO: Potentially switch use of AuthToken for all Auth methods
  // User methods
  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<LoginRequest, AuthResponse>(request, '/auth/login');

    if (response.success && response.user && response.token) {
      const user = User.fromDTO(response.user);
      return [user, new AuthToken(response.token, Date.now())];
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Login failed');
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<RegisterRequest, AuthResponse>(request, '/auth/register');

    if (response.success && response.user && response.token) {
      const user = User.fromDTO(response.user);
      return [user, new AuthToken(response.token, Date.now())];
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Registration failed');
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<LogoutRequest, TweeterResponse>(request, '/auth/logout');

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? 'Logout failed');
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(request, '/auth/get-user');

    if (response.success) {
      return response.user ? User.fromDTO(response.user) : null;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Failed to get user');
    }
  }

  // Status methods
  public async getMoreFeedItems(request: PagedItemRequest<StatusDTO>): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<PagedItemRequest<StatusDTO>, PagedItemResponse<StatusDTO>>(
      request,
      '/status/get-feed'
    );

    if (response.success) {
      const items: Status[] = response.items ? response.items.map((dto) => Status.fromDTO(dto)) : [];
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Failed to get feed');
    }
  }

  public async getMoreStoryItems(request: PagedItemRequest<StatusDTO>): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<PagedItemRequest<StatusDTO>, PagedItemResponse<StatusDTO>>(
      request,
      '/status/get-story'
    );

    if (response.success) {
      const items: Status[] = response.items ? response.items.map((dto) => Status.fromDTO(dto)) : [];
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Failed to get story');
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(
      request,
      '/status/post-status'
    );

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? 'Failed to post status');
    }
  }

  // Follow methods
  public async follow(request: FollowRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowResponse>(request, '/follow/follow');

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Follow failed');
    }
  }

  public async unfollow(request: FollowRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowResponse>(request, '/follow/unfollow');

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Unfollow failed');
    }
  }

  public async getMoreFollowers(request: PagedItemRequest<UserDTO>): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<PagedItemRequest<UserDTO>, PagedItemResponse<UserDTO>>(
      request,
      '/follow/get-followers'
    );

    if (response.success) {
      const items: User[] = response.items ? response.items.map((dto) => User.fromDTO(dto)) : [];
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Failed to get followers');
    }
  }

  public async getMoreFollowees(request: PagedItemRequest<UserDTO>): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<PagedItemRequest<UserDTO>, PagedItemResponse<UserDTO>>(
      request,
      '/follow/get-followees'
    );

    if (response.success) {
      const items: User[] = response.items ? response.items.map((dto) => User.fromDTO(dto)) : [];
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Failed to get followees');
    }
  }

  public async getFollowerCount(request: FollowRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowCountResponse>(
      request,
      '/follow/get-follower-count'
    );

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Failed to get follower count');
    }
  }

  public async getFolloweeCount(request: FollowRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<FollowRequest, FollowCountResponse>(
      request,
      '/follow/get-followee-count'
    );

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Failed to get followee count');
    }
  }

  public async getIsFollowerStatus(request: IsFollowerStatusRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<IsFollowerStatusRequest, IsFollowerStatusResponse>(
      request,
      '/follow/is-follower-status'
    );

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message ?? 'Failed to check follower status');
    }
  }
}
