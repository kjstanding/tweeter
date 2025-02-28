import { User, AuthToken, Status } from 'tweeter-shared';
import { StatusService } from '../model/service/StatusService';
import { MessageView, Presenter } from './Presenter';

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private service: StatusService;
  private _isLoading: boolean = false;

  constructor(view: PostStatusView) {
    super(view);
    this.service = new StatusService();
  }

  public async submitPost(post: string, currentUser: User, authToken: AuthToken): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this._isLoading = true;
      this.view.displayInfoMessage('Posting status...', 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken, status);

      this.view.setPost('');
      this.view.displayInfoMessage('Status posted!', 2000);
    }, 'post the status');

    this.view.clearLastInfoMessage();
    this._isLoading = false;
  }

  public clearPost() {
    this.view.setPost('');
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }
}
