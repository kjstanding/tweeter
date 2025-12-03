export interface IS3DAO {
  uploadImage(fileName: string, imageBytes: Buffer, imageType: string): Promise<string>;

  deleteImage(fileName: string): Promise<void>;
}
