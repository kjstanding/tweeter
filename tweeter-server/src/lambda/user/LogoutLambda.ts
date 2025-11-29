import { LogoutRequest, TweeterResponse } from 'tweeter-shared';
import { UserService } from '../../model/service/UserService';

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
  const userService = new UserService();

  try {
    await userService.logout(request.token);

    return {
      success: true,
      message: null,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Logout failed',
    };
  }
};
