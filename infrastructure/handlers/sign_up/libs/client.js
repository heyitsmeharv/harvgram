const REGION = "eu-west-2";
import { SESClient } from "@aws-sdk/client-ses";
import { Tracer } from "@aws-lambda-powertools/tracer";

export const tracer = new Tracer({ serviceName: "sign_up_lambda" });
export const client = tracer.captureAWSv3Client(new SESClient({ region: REGION }));