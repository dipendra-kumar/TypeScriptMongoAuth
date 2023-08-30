export const generateSuccessResponse = (
  code: number,
  msg: string,
  data?: any
) => {
  const response: { code: number; message: string; data?: any } = {
    code: code,
    message: msg,
  };
  if (Array.isArray(data) ? data.length > 0 : data && Object.keys(data).length > 0) {
    response.data = data;
  }
  return response;
};

export const generateErrorResponse = (
  code: number,
  msg: string,
  data?: any
) => {
  const response: { code: number; message: string; data?: any } = {
    code: code,
    message: msg,
  };

  if (Array.isArray(data) ? data.length > 0 : data && Object.keys(data).length > 0) {
    response.data = data;
  }
  return response;
};


export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}


export const mailData = (userInfo: any) => {
  var mailLink: string = process.env.NODE_ENV == 'development' ?
    `http://localhost:6094/api/v1/users/redirect?token=${userInfo.token}&type=${userInfo.type}`
    : process.env.NODE_ENV == 'staging' ? `https://stgn.appsndevs.com:6094/api/v1/users/redirect?token=${userInfo.token}&type=${userInfo.type}` : " //TODO: production url goes here..."

  const mailFormat = {

    resetPassword: {
      subject: "Reset Password Request",
      body: ` <p>Hello <b>${userInfo.name}</b>,</p>
      <br>
      <p>We understand that you've forgotten your password. Don't worry, we're here to help you regain access to your account. Follow the steps below to reset your password:</p>
    <ol>
        <li>Click on the link below to start the password reset process:</li>
    </ol>
    <li style="list-style-type: none;"><a href=${mailLink}
    style="text-decoration: none; cursor: pointer; color: white; background-color: #2945FF; padding: 10px 20px; border-radius: 5px; font-weight: bolder;">
    Reset password
</a></li>
    <ol start="2">
        <li>You will be directed to a secure page where you can create a new password for your account.</li>
        <li>If you did not request this password reset, please ignore this email. Your account remains safe and
            secure.</li>
    </ol>
    <p>Please remember to keep your password safe and do not share it with anyone.</p>`
    },

    verifyEmail: {
      subject: "Email verification",
      body: ` <p>Hello <b>${userInfo.name}</b>,</p>
      <br>
      <p>We hope this email finds you well. Thank you for signing up with AdvancedLux. To ensure the security of your account and provide you with the best experience, we kindly request you to verify your email address.</p>
      <p>Please click on the link below to verify your email:</p>
      <a href=${mailLink}
          style="text-decoration: none; cursor: pointer; color: white; background-color: #2945FF; padding: 10px 20px; border-radius: 5px; font-weight: bolder;">
          Verify my email
      </a>
      <p>By verifying your email, you will be able to enjoy all the benefits and features of our platform. If you didn't create an account with us or if you received this email in error, please disregard it.</p>`
    },
  }
  return mailFormat[userInfo.type]
}

