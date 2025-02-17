const REGION = "eu-west-2";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { Tracer } from "@aws-lambda-powertools/tracer";

export const tracer = new Tracer({ serviceName: "upload_picture_lambda" });
export const s3Client = tracer.captureAWSv3Client(new S3Client({ region: REGION }));
export const dynamoDBClient = tracer.captureAWSv3Client(new DynamoDBClient({ region: REGION }));