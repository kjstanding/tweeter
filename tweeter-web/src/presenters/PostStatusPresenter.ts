import { User, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
  setPost: (post: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  displayErrorMessage: (message: string) => void;
  clearLastInfoMessage: () => void;
}

export class PostStatusPresenter {
  private service: StatusService;
  private view: PostStatusView;
  private _isLoading: boolean = false;

  constructor(view: PostStatusView) {
    this.view = view;
    this.service = new StatusService();
  }

  public async submitPost(post: string, currentUser: User, authToken: AuthToken): Promise<void> {
    try {
      this._isLoading = true;
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
    } finally {
      this.view.clearLastInfoMessage();
      this._isLoading = false;
    }
  }

  public clearPost() {
    this.view.setPost("");
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }
}
