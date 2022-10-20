var { expressjwt: jwt } = require("express-jwt");

// prettier-ignore
module.exports = function () {
  // isRevoked = revoking the token when condition met
  return jwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"],
    isRevoked: revokeCondition
  }).unless({
    path: [
      "/api/v1/users/login",
      "/api/v1/users/register",
      { url: /^\/api\/v1\/products\/.*/, methods: ["GET"] },
      { url: /^\/api\/v1\/categories\/.*/, methods: ["GET"] },
      { url: /^\/public\/uploads\/.*/, methods: ["GET"] },
    ],
  });
  // Exlude routes to jwt auth middleware using .unless()
  // Regex can be used in url path

  //"/\api/\v1/\products(.*)" = all subroutes of products, ex products/1
};

// payload = jwt token data
// done = similar to next()
async function revokeCondition(req, payload) {
  // IF user is not admin = customer
  if (!payload.payload.isAdmin) {
    // Reject the payload
    return true; // revoke the token
  }
  // if user is admin
  return false; // continue to route
}
