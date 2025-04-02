const REGION = "eu-west-2";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { SESClient } from "@aws-sdk/client-ses";
import { Tracer } from "@aws-lambda-powertools/tracer";

export const tracer = new Tracer({ serviceName: "approve_user_lambda" });
export const sesClient = tracer.captureAWSv3Client(new SESClient({ region: REGION }));
export const cognitoClient = tracer.captureAWSv3Client(new CognitoIdentityProviderClient({ region: REGION }));