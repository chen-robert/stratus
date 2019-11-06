const request = require("request");
const api = require(__dirname + "/scraper.js");
const apiBase = "https://bsd405.herokuapp.com";

const login = (username, password) => {
  return api.login({ username, password })
    .catch(() => {
      return {
        err: "Invalid username or password"
      }
    });
};

const classData = id => {
  return new Promise(resolve => {
    request.post({
      url: `${apiBase}/get_weight`,
      form: { id },
      followAllRedirects: true
    },
    (err, res, body) => {
      console.log(body);
      const data = JSON.parse(body);
      const weights = {};

      Object.keys(data)
        .forEach(category => {
          weights[category] = weightData[category].percentage;
        });
      resolve({ weights });
    });
  });
};

module.exports = { login, classData };
