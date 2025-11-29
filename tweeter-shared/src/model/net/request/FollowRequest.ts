import { TweeterRequest } from './TweeterRequest';
import { UserDTO } from '../../dto/UserDTO';

export interface FollowRequest extends TweeterRequest {
  readonly token: string;
  readonly selectedUser: UserDTO;
}
