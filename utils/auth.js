var { expressjwt: jwt } = require("express-jwt");

module.exports = function () {
  return jwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"],
  });
};
