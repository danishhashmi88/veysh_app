const axios = require('axios');

async function test() {
  const email = "style1@mailinator.com";
  // The user says OTP verification fails. Let's send a fake OTP.
  // We'll see if verifyOTPWithEmail supports role='stylist'.
  
  try {
    const res = await axios.post('https://online-closet-api.devtechnosys.tech/webservice/api/v1/user/auth/verifyOTPWithEmail', {
      email: email,
      otp: "0000",
      type: "password_reset",
    });
    console.log("No role res:", res.data);
  } catch(e) {
    console.log("No role err:", e.response?.data || e.message);
  }
  
  try {
    const res = await axios.post('https://online-closet-api.devtechnosys.tech/webservice/api/v1/user/auth/verifyOTPWithEmail', {
      email: email,
      otp: "0000",
      type: "password_reset",
      role: "stylist"
    });
    console.log("Stylist role res:", res.data);
  } catch(e) {
    console.log("Stylist role err:", e.response?.data || e.message);
  }
}
test();
