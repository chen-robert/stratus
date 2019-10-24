const request = require("request");
const apiBase = "https://bsd405.herokuapp.com";

const login = (username, password) => {
  return new Promise(resolve => {
    request.post({
      url: `${apiBase}/login`,
      formData: { username, password }
    },
    (err, res, body) => {
      if (res.statusCode !== 200) return resolve({ err: "Invalid username or password" });
      const data = JSON.parse(body);
      const classes = data.students
        .map((c, i) => {
          c = c[i];
          return {
            id: c.classId,
            letterGrade: c.letterGrade,
            name: c.name.split(":")[1].replace("S1", "").replace("S2", ""),
            numberGrade: c.numberGrade,
            teacher: c.teacher
          };
        });
      const name = data.name;

      resolve({ classes, name });
    });
  });
};

const classData = id => {
  return new Promise(resolve => {
    request.post({
      url: `${apiBase}/get_weight`,
      formData: { id: 26292 }
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
