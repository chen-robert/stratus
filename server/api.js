const cheerio = require("cheerio");
const request = require("request-promise");

const apiBase = "https://wa-bsd405-psv.edupoint.com";

const loadJar = cookies => {
  const jar = request.jar();
  cookies.forEach(({ key, value }) => jar.setCookie(`${key}=${value}`, apiBase));

  return jar;
};

const saveJar = jar => jar.getCookies(apiBase);

const login = ({ username, password }) => {
  const loginEndpoint = `${apiBase}/PXP2_Login_Student.aspx?regenerateSessionId=True`;

  const jar = request.jar();
  return request.get({
    url: loginEndpoint,
    transform: body => cheerio.load(body)
  })
    .then($ => {
      const data = {
        __VIEWSTATE: $("input[name=__VIEWSTATE]").val(),
        __VIEWSTATEGENERATOR: $("input[name=__VIEWSTATEGENERATOR]").val(),
        __EVENTVALIDATION: $("input[name=__EVENTVALIDATION]").val(),
        ctl00$MainContent$username: username,
        ctl00$MainContent$password: password
      };

      return request.post({
        url: loginEndpoint,
        form: data,
        followAllRedirects: true,
        transform: body => cheerio.load(body),
        jar
      });
    })
    .then($ => {
      if ($.text().includes("Invalid user id or password")) throw new Error("Invalid credentials");

      const name = $("#Greeting").text().split(",")[1].trim();

      return {
        name,
        cookies: saveJar(jar)
      };
    })
    .catch(() => {
      return {
        err: "Invalid username or password"
      };
    });
};

const getCourses = cookies => {
  const jar = loadJar(cookies);

  return request.get({
    url: `${apiBase}/PXP2_Gradebook.aspx?AGU=0`,
    transform: body => cheerio.load(body),
    jar
  })
    .then($ => {
      const courses = $(".course-title");

      const cData = courses.map((i, elem) => {
        const $elem = $(elem);
        const $root = $elem.parent().parent();
        const $gradeRoot = $root.next();

        const focusData = JSON.parse($elem.attr("data-focus")).FocusArgs;

        const id = focusData.classID;
        const teacher = $root.find(".teacher.hide-for-screen").text();
        const name = $elem.text().split(":")[1].trim();
        const numberGrade = $gradeRoot.find(".score").text();
        const letterGrade = $gradeRoot.find(".mark").text();

        return {
          id,
          teacher,
          name,
          numberGrade,
          letterGrade
        };
      }).get();

      return {
        courses: cData
      };
    });
};

const getCourseData = (cookies, id) => {
  const jar = loadJar(cookies);

  const ret = {};
  return request.get({
    url: `${apiBase}/PXP2_Gradebook.aspx?AGU=0`,
    transform: body => cheerio.load(body),
    jar
  })
    .then($ => {
      const courses = $(".course-title");

      const data = courses
        .map((i, elem) => {
          return {
            args: JSON.parse($(elem).attr("data-focus")).FocusArgs,
            name: $(elem).text()
          };
        })
        .get()
        .filter(({ args }) => args.classID == id)
        [0];
      ret.name = data.name.split(":")[1].trim();

      return request.post({
        url: `${apiBase}/service/PXP2Communication.asmx/LoadControl`,
        body: {
          request: {
            control: "Gradebook_ClassDetails",
            parameters: data.args
          }
        },
        json: true,
        transform: resp => cheerio.load(resp.d.Data.html),
        jar
      });
    })
    .then($ => {
      let weights = null;

      const weightJSON = $(".CategoryWeights").attr("data-data-source");
      if (weightJSON !== undefined) {
        weights = JSON.parse(weightJSON)
          .map(weight => {
            return {
              name: weight.Category,
              current: weight.CurrentGrade,
              total: weight.PctOfGrade
            };
          })
          .filter(({ name }) => name !== "TOTAL");
      }

      const txt = $.html();

      const startStr = "\"dataSource\":";
      const endStr = "}],";
      const dataStart = txt.indexOf(startStr) + startStr.length;
      const dataEnd = txt.indexOf(endStr, dataStart);

      const assignments = JSON.parse(txt.substring(dataStart, dataEnd) + "}]")
        .map(assignmentData => {
          let score, total;

          if (assignmentData.GBPoints.includes("Points Possible")) {
            score = null;
            total = +assignmentData.GBPoints.split(" ")[0];
          } else {
            score = +assignmentData.GBPoints.split("/")[0];
            total = +assignmentData.GBPoints.split("/")[1];
          }
          return {
            name: JSON.parse(assignmentData.GBAssignment).value,
            category: assignmentData.GBAssignmentType,
            score,
            total,
            scoreType: assignmentData.GBScoreType,
            notes: assignmentData.GBNotes
          };
        });

      return {
        name: ret.name,
        weights,
        assignments
      };
    })
    .catch((e) => {
      console.log(e);
      return {
        err: "Invalid session"
      };
    });
};

module.exports = { login, getCourses, getCourseData };
