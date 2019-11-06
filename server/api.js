const cheerio = require("cheerio");
const request = require("request-promise");

const apiBase = "https://wa-bsd405-psv.edupoint.com";

const loadJar = cookies => {
  const jar = request.jar();
  cookies.forEach(({key, value}) => jar.setCookie(`${key}=${value}`, apiBase));

  return jar;
}

const saveJar = jar => jar.getCookies(apiBase);

const login = ({username, password}) => {
  const loginEndpoint = `${apiBase}/PXP2_Login_Student.aspx?regenerateSessionId=True`;
  
  const jar = request.jar();
  return request.get({
    url: loginEndpoint,
    transform: body => cheerio.load(body)
  })
  .then($ => {
    const data = {
      "__VIEWSTATE": $(`input[name=__VIEWSTATE]`).val(),
      "__VIEWSTATEGENERATOR": $(`input[name=__VIEWSTATEGENERATOR]`).val(),
      "__EVENTVALIDATION": $(`input[name=__EVENTVALIDATION]`).val(),
      "ctl00$MainContent$username": username,
      "ctl00$MainContent$password": password
    }

    return request.post({
      url: loginEndpoint,
      form: data,
      followAllRedirects: true,
      transform: body => cheerio.load(body),
      jar
    });
  })
  .then($ => {
    if($.text().includes("Invalid user id or password")) throw new Error("Invalid credentials");

    const name = $("#Greeting").text().split(",")[1].trim();
    const gradebookPage = $(`.list-group-item[href*='Gradebook.aspx']`).attr("href");
    
    return { 
      name ,
      cookies: jar.getCookies(apiBase)
    }
  })
  .catch(() => {
    return {
      err: "Invalid username or password"
    }
  });
}

const getCourses = cookies => {
  const jar = loadJar(cookies);
  console.log(jar)

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
      const name = $elem.text();
      const numberGrade = $gradeRoot.find(".score").text();
      const letterGrade = $gradeRoot.find(".mark").text();

      return {
        id,
        teacher,
        name,
        numberGrade,
        letterGrade
      }
    }).get();
    
    return {
      a: 3,
      courses: cData
    };
  });
}


module.exports = { login, getCourses };
