import { TweeterRequest } from './TweeterRequest';
import { UserDTO } from '../../dto/UserDTO';

export interface PagedUserItemRequest extends TweeterRequest {
  readonly token: string;
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: UserDTO | null;
}
