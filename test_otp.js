const axios = require('axios');

async function test() {
  const email = "style1@mailinator.com";
  // Assuming the OTP is still valid from the previous send or I'll just trigger one
  await axios.post('https://online-closet-api.devtechnosys.tech/webservice/api/v1/user/auth/forget-password', {
      email: email,
  });
  
  // We don't know the exact OTP, let's just make a dummy request to see the error message
  try {
    const res1 = await axios.post('https://online-closet-api.devtechnosys.tech/webservice/api/v1/user/auth/verifyOTPWithEmail', {
      email: email,
      otp: "1234",
      type: "password_reset"
    });
    console.log("verify no role:", res1.data);
  } catch(e) { console.log("verify no role error:", e.response?.data || e.message) }
  
  try {
    const res2 = await axios.post('https://online-closet-api.devtechnosys.tech/webservice/api/v1/user/auth/verifyOTPWithEmail', {
      email: email,
      otp: "1234",
      type: "password_reset",
      role: "stylist"
    });
    console.log("verify with role stylist:", res2.data);
  } catch(e) { console.log("verify with role error:", e.response?.data || e.message) }

}
test();
