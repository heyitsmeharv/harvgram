console.log("loading approve_user_lambda");

import { Logger } from "@aws-lambda-powertools/logger";
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';

import commonMiddleware from "./libs/commonMiddleware.js";
import { sesClient, cognitoClient, tracer } from "./libs/client.js";

import createError from "http-errors";

import { AdminCreateUserCommand, AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { SendEmailCommand } from "@aws-sdk/client-ses";

const logger = new Logger({ serviceName: "approve_user_lambda" });
tracer.provider.setLogger(logger);

const traceEvents = (response, data, success, err = null) => {
  tracer.putMetadata("API_RESPONSE", { response });
  tracer.putMetadata("EVENT", JSON.stringify(data, null, 2));
  tracer.putAnnotation("APPROVE_USER_SUCCESS", success);
  if (!success) {
    tracer.putMetadata("ERROR", { err });
  }
}

export const approveUser = async (event, context) => {
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
    inputPayload: event.body || null
  }
  logger.info("Lambda execution details", { ...metadata, ...annotations });

  const { email, name } = JSON.parse(event.body);
  const tempPassword = Math.random().toString(36).slice(-8);

  const createUserParams = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: email,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: name }
    ],
    TemporaryPassword: tempPassword,
    MessageAction: "SUPPRESS",
  };

  let createUser;

  try {
    createUser = await cognitoClient.send(new AdminCreateUserCommand(createUserParams));
    traceEvents(createUser, createUserParams, true);
  } catch (error) {
    logger.error("An error occurred", { message: "Error: failed to create user in cognito", error, stackTrace: error.stack, xRayTraceId: tracer.getRootXrayTraceId() });
    traceEvents(createUser, createUserParams, false, error);
    throw new createError.InternalServerError(error);
  }

  const setPasswordParams = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: email,
    Password: tempPassword,
    Permanent: false,
  };

  let setPassword;

  try {
    setPassword = await cognitoClient.send(new AdminSetUserPasswordCommand(setPasswordParams));
    traceEvents(setPassword, setPasswordParams, true);
  } catch (error) {
    logger.error("An error occurred", { message: "Error: failed to set users password", error, stackTrace: error.stack, xRayTraceId: tracer.getRootXrayTraceId() });
    traceEvents(setPassword, setPasswordParams, false, error);
    throw new createError.InternalServerError(error);
  }

  const emailParams = {
    Source: process.env.FROM_EMAIL_ADDRESS,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Your Account Has Been Approved" },
      Body: {
        Html: {
          Data: `
              <h2>Welcome to Harvgram</h2>
              <p>Your account has been approved. Please use the credentials below to log in:</p>
              <p><b>Email:</b> ${email}</p>
              <p><b>Temporary Password:</b> ${tempPassword}</p>
              <p><a href="${process.env.FRONTEND_URL}/login">Login Here</a></p>
              <p>You will be required to set a new password upon first login.</p>
            `,
        },
      },
    },
  };

  let sendEmailCredentials;

  try {
    sendEmailCredentials = await sesClient.send(new SendEmailCommand(emailParams));
    traceEvents(sendEmailCredentials, emailParams, true);
  } catch (error) {
    logger.error("An error occurred", { message: "Error: failed to send user credentials", error, stackTrace: error.stack, xRayTraceId: tracer.getRootXrayTraceId() });
    traceEvents(sendEmailCredentials, emailParams, false, error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "User approved, created in Cognito, and credentials sent via email." }),
  };
};

export const handler = commonMiddleware(approveUser)
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(captureLambdaHandler(tracer));
