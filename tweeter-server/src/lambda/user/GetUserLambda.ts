import { GetUserRequest, GetUserResponse } from 'tweeter-shared';
import { UserService } from '../../model/service/UserService';

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
  const userService = new UserService();

  try {
    const user = await userService.getUser(request.token, request.alias);

    return {
      success: true,
      message: null,
      user: user,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get user',
      user: null,
    };
  }
};
