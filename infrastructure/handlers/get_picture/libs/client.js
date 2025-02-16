const REGION = "eu-west-2";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Tracer } from "@aws-lambda-powertools/tracer";

export const tracer = new Tracer({ serviceName: "get_picture_lambda" });
export const client = tracer.captureAWSv3Client(new DynamoDBClient({ region: REGION }));