import { S3Client, PutObjectCommand, DeleteObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { IS3DAO } from '../interface/IS3DAO';

const BUCKET_NAME = 'kjstanding-tweeter-profile-images';
const REGION = 'us-west-1';

export class S3DAO implements IS3DAO {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({ region: REGION });
  }

  async uploadImage(fileName: string, imageBuffer: Buffer, imageType: string): Promise<string> {
    const params = {
      Bucket: BUCKET_NAME,
      Key: "image/" + fileName,
      Body: imageBuffer,
      ContentType: imageType,
      ACL: ObjectCannedACL.public_read,
    };

    await this.client.send(new PutObjectCommand(params));

    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/image/${fileName}`;
  }

  async deleteImage(fileName: string): Promise<void> {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
    };

    await this.client.send(new DeleteObjectCommand(params));
  }
}
