console.log("loading get_pictures lambda");

import { Logger } from "@aws-lambda-powertools/logger";
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';

import commonMiddleware from "./libs/commonMiddleware.js";
import { dynamoDBClient, tracer } from "./libs/client.js";

import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const logger = new Logger({ serviceName: "get_pictures_lambda" });
tracer.provider.setLogger(logger);

const traceEvents = (response, data, success, err = null) => {
  tracer.putMetadata("API_RESPONSE", { response });
  tracer.putMetadata("EVENT", JSON.stringify(data, null, 2));
  tracer.putAnnotation("GET_PICTURES_SUCCESS", success);
  if (!success) {
    tracer.putMetadata("ERROR", { err });
  }
}

const getPictures = async (event, context) => {
  const { functionName, functionVersion, awsRequestId } = context;
  const metadata = {
    functionName,
    functionVersion,
    requestId: awsRequestId,
    region: process.env.AWS_REGION,
    accountId: process.env.AWS_ACCOUNT_ID,
    eventSource: event?.source,
    userIdentity: event?.requestContext?.identity?.userArn || "Anonymous"
  }
  const annotations = {
    httpMethod: event?.httpMethod,
    path: event?.path,
    inputPayload: event || null
  }
  logger.info("Lambda execution details", { ...metadata, ...annotations });

  const { tag } = event;
  let pictures;
  let result;

  if (!tag) {
    try {
      const params = {
        TableName: process.env.PICTURE_TABLE_NAME,
      };
      result = await dynamoDBClient.send(new ScanCommand(params));
      traceEvents(result, params, true);
    } catch (err) {
      traceEvents(result, params, false, err);
      throw {
        name: err.name || "ScanDynamoDBError",
        message: err.message || "Failed to scan DynamoDB",
        status: 500,
      };
    }
  } else {
    const params = {
      TableName: process.env.PICTURES_TABLE_NAME,
      IndexName: 'tag',
      KeyConditionExpression: '#tag = :tag',
      ExpressionAttributeValues: {
        ':tag': tag,
      },
      ExpressionAttributeNames: {
        '#tag': 'tag',
      },
    }
    try {
      result = await dynamoDBClient.send(new ScanCommand(params));
      traceEvents(result, params, true);
    } catch (err) {
      traceEvents(result, params, false, err);
      throw {
        name: err.name || "ScanDynamoDBError",
        message: err.message || "Failed to scan DynamoDB",
        status: 500,
      };
    }
  }

  pictures = result.Items;

  return {
    statusCode: 200,
    pictures,
  };
};

export const handler = commonMiddleware(getPictures)
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(captureLambdaHandler(tracer));