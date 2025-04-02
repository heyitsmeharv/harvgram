console.log("loading sign_up_lambda");

import { Logger } from "@aws-lambda-powertools/logger";
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";

import commonMiddleware from "./libs/commonMiddleware.js";
import { client, tracer } from "./libs/client.js";

import createError from "http-errors";

import { SendEmailCommand } from "@aws-sdk/client-ses";

const logger = new Logger({ serviceName: "sign_up_lambda" });
tracer.provider.setLogger(logger);

const traceEvents = (response, data, success, err = null) => {
  tracer.putMetadata("API_RESPONSE", { response });
  tracer.putMetadata("EVENT", JSON.stringify(data, null, 2));
  tracer.putAnnotation("SIGN_UP_SUCCESS", success);
  if (!success) {
    tracer.putMetadata("ERROR", { err });
  }
}

const signUp = async (event, context) => {
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

  const { email, name, reason } = event;

  const approvalLink = `${process.env.FRONTEND_URL}/approve-user?email=${encodeURIComponent(email)}`;
  const rejectionLink = `${process.env.FRONTEND_URL}/reject-user?email=${encodeURIComponent(email)}`;

  const params = {
    Source: process.env.FROM_EMAIL_ADDRESS,
    Destination: { ToAddresses: [process.env.TO_EMAIL_ADDRESS] },
    Message: {
      Subject: { Data: "New Access Request" },
      Body: {
        Html: {
          Data: `
              <h2>New Access Request</h2>
              <p><b>Name:</b> ${name}</p>
              <p><b>Email:</b> ${email}</p>
              <p><b>Reason:</b> ${reason}</p>
              <p>
                <a href="${approvalLink}" style="color: green;">Approve User</a> |
                <a href="${rejectionLink}" style="color: red;">Reject User</a>
              </p>
            `,
        },
      },
    },
  };

  let response;

  try {
    response = await client.send(new SendEmailCommand(params))
    traceEvents(response, params, true);
  } catch (error) {
    logger.error("An error occurred", { message: "Error: failed to send email", error, stackTrace: error.stack, xRayTraceId: tracer.getRootXrayTraceId() });
    traceEvents(response, params, false, error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Email sent successfully" }),
  };
};

export const handler = commonMiddleware(signUp)
  .use(injectLambdaContext(logger, { clearState: true }))
  .use(captureLambdaHandler(tracer));
