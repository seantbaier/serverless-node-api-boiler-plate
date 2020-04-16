/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */

const pwdGenerator = require("generate-password");
const AWS = require("aws-sdk");
const chalk = require("chalk");
require("dotenv").config();

const region = process.env.USERPOOL_REGION;
const userPoolId = process.env.USERPOOL_ID;
const appClientId = process.env.USERPOOL_APP_CLIENT_ID;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
const idp = new AWS.CognitoIdentityServiceProvider({ region });

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generatePassword() {
  return pwdGenerator.generate({
    uppercase: true,
    lowercase: true,
    numbers: true,
    strict: true,
    length: 12,
  });
}

async function signUpUser(user) {
  // eslint-disable-next-line no-console
  console.info(`Info: Creating Cognito User: ${user.email}`);

  const pwd = user.email.endsWith("simulator.amazonses.com")
    ? generatePassword()
    : process.env.SEED_USER_PASSWORD;

  const signUpParams = {
    ClientId: appClientId,
    Password: pwd,
    Username: user.email,
    UserAttributes: [
      { Name: "email", Value: user.email },
      { Name: "given_name", Value: user.firstName },
      { Name: "family_name", Value: user.lastName },
      { Name: "name", Value: `${user.firstName} ${user.lastName}` },
    ],
  };

  if (user._id) {
    signUpParams.UserAttributes.push({
      Name: "custom:externalId",
      Value: user._id.toString(),
    });
  }

  const response = await idp.signUp(signUpParams).promise();
  return {
    externalId: response.UserSub,
    password: pwd,
    ...user,
  };
}

async function confirmUser(user) {
  // eslint-disable-next-line no-console
  console.info(`Info: Confirming Cognito User: ${user.email}`);

  await idp
    .adminConfirmSignUp({
      UserPoolId: userPoolId,
      Username: user.email,
    })
    .promise();

  return user;
}

async function createUser(user) {
  return signUpUser(user)
    .then(confirmUser)
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(chalk.red(`Failed to Create User!\n${err}`));
      return null;
    });
}

async function createUsers(users) {
  const results = [];

  // eslint-disable-next-line no-console

  const items = [...users];
  while (items.length) {
    const item = items.pop();

    const user = await createUser(item);
    if (user.externalId) {
      results.push(user);
    }

    await sleep(100);
  }

  return results;
}

async function updateUser(user) {
  // eslint-disable-next-line no-console
  console.info(`Info: Updating Cognito User: ${user.email}`);

  const params = {
    UserPoolId: process.env.USERPOOL_ID,
    Username: user.email,
    UserAttributes: [
      { Name: "email", Value: user.email },
      { Name: "given_name", Value: user.firstName },
      { Name: "family_name", Value: user.lastName },
      { Name: "name", Value: `${user.firstName} ${user.lastName}` },
    ],
  };

  if (user._id) {
    params.UserAttributes.push({
      Name: "custom:externalId",
      Value: user._id.toString(),
    });
  }

  await idp.adminUpdateUserAttributes(params).promise();
}

async function updateUsers(users) {
  const items = [...users];
  while (items.length) {
    const item = items.pop();

    await updateUser(item);
    await sleep(100);
  }
}

async function deleteUser(user) {
  // eslint-disable-next-line no-console
  console.info("Info: Deleting Cognito User: ", user.Attributes[0].Value);

  await idp
    .adminDeleteUser({
      UserPoolId: userPoolId,
      Username: user.Attributes[0].Value,
    })
    .promise();
}

async function deleteUsers(users) {
  const items = [...users];

  while (items.length) {
    const item = items.pop();
    await deleteUser(item);
    await sleep(100);
  }
}

async function getUsers(filter) {
  let paginationToken = null;
  let moreToDownload = true;
  const users = [];

  while (moreToDownload) {
    const response = await idp
      .listUsers({
        PaginationToken: paginationToken,
        AttributesToGet: ["email"],
        Filter: filter,
        Limit: 60,
        UserPoolId: userPoolId,
      })
      .promise();

    moreToDownload = response.Users.length > 0 && !!response.PaginationToken;
    paginationToken = response.PaginationToken;

    users.push(...response.Users);
  }

  return users;
}

async function signInUser(user) {
  // eslint-disable-next-line no-console
  console.log("Info: Signing in User: ", user.email);

  const response = await idp
    .adminInitiateAuth({
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      UserPoolId: userPoolId,
      ClientId: appClientId,
      AuthParameters: {
        USERNAME: user.email,
        PASSWORD: user.password,
      },
    })
    .promise();

  // eslint-disable-next-line no-console
  console.log("Auth: ", response);
}

module.exports = {
  updateUsers,
  createUsers,
  signInUser,
};
