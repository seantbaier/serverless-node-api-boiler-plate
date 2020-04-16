import AWS from "aws-sdk";

const ISP = new AWS.CognitoIdentityServiceProvider({
  region: process.env.USERPOOL_REGION,
});

const getCognitoUserName = (user) => user.email;

export const getUser = async (user) => {
  const params = {
    UserPoolId: process.env.USERPOOL_ID,
    Username: getCognitoUserName(user),
  };

  await ISP.adminGetUser(params).promise();
};

export const userExists = async (user) => {
  const userAttributes = await getUser(user);
  return userAttributes !== null;
};

export const createUser = async (user) => {
  const params = {
    UserPoolId: process.env.USERPOOL_ID,
    Username: getCognitoUserName(user),
    DesiredDeliveryMediums: ["EMAIL"],
    ForceAliasCreation: false,
    UserAttributes: [
      { Name: "email", Value: user.email },
      { Name: "email_verified", Value: "True" },
      { Name: "given_name", Value: user.firstName },
      { Name: "family_name", Value: user.lastName },
      { Name: "name", Value: `${user.firstName} ${user.lastName}` },
    ],
  };

  // Set the temporary password, if one was provided.
  if (user.password) {
    params.TemporaryPassword = user.password;
  }

  return await ISP.adminCreateUser(params).promise();
};

export const updateUser = async (user) => {
  const params = {
    UserPoolId: process.env.USERPOOL_ID,
    Username: getCognitoUserName(user),
    UserAttributes: [
      { Name: "email", Value: user.email },
      { Name: "email_verified", Value: "True" },
      { Name: "given_name", Value: user.firstName },
      { Name: "family_name", Value: user.lastName },
      { Name: "name", Value: `${user.firstName} ${user.lastName}` },
    ],
  };

  await ISP.adminUpdateUserAttributes(params).promise();
};

export const deleteUser = async (user) => {
  const params = {
    UserPoolId: process.env.USERPOOL_ID,
    Username: getCognitoUserName(user),
  };

  await ISP.adminDeleteUser(params).promise();
};

export const confirmSignUp = async (user) => {
  const params = {
    UserPoolId: process.env.USERPOOL_ID,
    Username: getCognitoUserName(user),
  };

  await ISP.adminConfirmSignUp(params).promise();
};

export const uploadImage = async (folder, filename, file) => {
  const s3Key = `${encodeURIComponent(folder)}/${filename}.${file.name
    .split(".")
    .pop()}`;
  const data = file.data.replace(/^data:image\/[^;]+;base64,/, "");
  const buffer = Buffer.from(data, "base64");

  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: process.env.ASSETS_S3_BUCKET,
      Key: s3Key,
      Body: buffer,
      ACL: "public-read",
      ContentType: file.type,
      ContentEncoding: "base64",
    },
  });

  const result = await upload.promise();
  result.Location = result.Location.replace(/s3.amazonaws.com\//, "");
  return result;
};

export const moveFile = async (srcBucket, srcKey, dstBucket, dstKey) => {
  const s3 = new AWS.S3();

  await s3
    .copyObject({
      CopySource: `/${srcBucket}/${srcKey}`,
      Bucket: dstBucket,
      Key: dstKey,
    })
    .promise();

  await s3
    .deleteObject({
      Bucket: srcBucket,
      Key: srcKey,
    })
    .promise();
};
