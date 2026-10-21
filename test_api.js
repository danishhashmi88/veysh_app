const axios = require('axios');

async function test() {
  const email = "style1@mailinator.com";
  try {
    const res1 = await axios.post('https://online-closet-api.devtechnosys.tech/webservice/api/v1/user/auth/forget-password', {
      email: email,
    });
    console.log("forgot pass no role:", res1.data);
  } catch(e) { console.log(e.response?.data || e.message) }
  
  try {
    const res2 = await axios.post('https://online-closet-api.devtechnosys.tech/webservice/api/v1/user/auth/forget-password', {
      email: email,
      role: "stylist"
    });
    console.log("forgot pass stylist:", res2.data);
  } catch(e) { console.log(e.response?.data || e.message) }

}
test();
