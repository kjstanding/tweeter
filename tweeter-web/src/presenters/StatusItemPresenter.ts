import { AuthToken, Status } from "tweeter-shared";

export interface StatusItemView {
  addItems(newItems: Status[]): void;
  displayErrorMessage(message: string): void;
}

export abstract class StatusItemPresenter {
  private _view: StatusItemView;
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;

  constructor(view: StatusItemView) {
    this._view = view;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

  public reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  protected get view(): StatusItemView {
    return this._view;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem(): Status | null {
    return this._lastItem;
  }

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }
}
