var { expressjwt: jwt } = require("express-jwt");

// prettier-ignore
module.exports = function () {
  return jwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/api/v1/users/login",
      "/api/v1/users/register",
      { url: /^\/api\/v1\/products\/.*/, methods: ["GET"] },
      { url: /^\/api\/v1\/categories\/.*/, methods: ["GET"] },
    ],
  });
  // Exlude routes to jwt auth middleware using .unless()
  // Regex can be used in url path

  //"/\api/\v1/\products(.*)" = all subroutes of products, ex products/1
};
