import { IDAOFactory } from "./interface/IDAOFactory";
import { DynamoDAOFactory } from "./dynamodb/DynamoDAOFactory";

class DAOFactoryProvider {
  private static instance: IDAOFactory | null = null;

  public static getFactory(): IDAOFactory {
    if (!this.instance) {
      this.instance = new DynamoDAOFactory();
    }
    return this.instance;
  }
}

export default DAOFactoryProvider;
