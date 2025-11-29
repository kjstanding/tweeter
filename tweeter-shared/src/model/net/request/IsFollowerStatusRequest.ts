import { TweeterRequest } from './TweeterRequest';
import { UserDTO } from '../../dto/UserDTO';

export interface IsFollowerStatusRequest extends TweeterRequest {
  readonly token: string;
  readonly user: UserDTO;
  readonly selectedUser: UserDTO;
}
