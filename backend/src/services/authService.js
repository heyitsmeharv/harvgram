import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";

import dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env.development" });

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export const initiateLogin = async (email, password) => {
  const command = new AdminInitiateAuthCommand({
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  try {
    return await client.send(command);
  } catch (err) {
    throw {
      name: err.name || "CognitoError",
      message: err.message || "Login failed",
      status: err.name === "NotAuthorizedException" ? 401 : 500,
    };
  }
};

export const completeChangePassword = async (session, email, newPassword) => {
  const command = new AdminRespondToAuthChallengeCommand({
    ChallengeName: "NEW_PASSWORD_REQUIRED",
    ClientId: process.env.COGNITO_CLIENT_ID,
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Session: session,
    ChallengeResponses: {
      USERNAME: email,
      NEW_PASSWORD: newPassword,
    },
  });

  try {
    return await client.send(command);
  } catch (err) {
    throw {
      name: err.name || "CognitoError",
      message: err.message || "Update Password Failed",
      status: err.name === "NotAuthorizedException" ? 401 : 500,
    };
  }
};

export const refresh = async (refreshToken) => {
  const command = new InitiateAuthCommand({
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  });

  try {
    return await client.send(command);
  } catch (err) {
    throw {
      name: err.name || "CognitoError",
      message: err.message || "Token Refresh Failed",
      status: err.name === "NotAuthorizedException" ? 401 : 500,
    };
  }
};