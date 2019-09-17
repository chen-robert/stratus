const apiBase = "";

const login = (username, password) => {
  return new Promise(resolve => {
    const data = JSON.parse(`{"students": [{"0": {"name": "1: Gifted IB Language And Literature HL2 S1", "numberGrade": "0.0%", "letterGrade": "N/A", "classId": "26392", "teacher": "Glover, Alexander"}}, {"1": {"name": "2: Gifted IB History HL 2/ AP American Government S1", "numberGrade": "0.0%", "letterGrade": "N/A", "classId": "26347", "teacher": "Cuffin, Shaun"}}, {"2": {"name": "3: IB Mathematics SL 2 S1", "numberGrade": "0.00%", "letterGrade": "N/A", "classId": "26401", "teacher": "Vandevanter, Wesley"}}, {"3": {"name": "4: IB Physics HL/AP Physics 2 S1", "numberGrade": "0%", "letterGrade": "N/A", "classId": "26256", "teacher": "Dossett, Lisa"}}, {"4": {"name": "5: IB Spanish 4 SL S1", "numberGrade": "0.0%", "letterGrade": "N/A", "classId": "26287", "teacher": "Cabaloue, Sophie"}}, {"5": {"name": "6: Theory Of Knowledge 2", "numberGrade": "0.0%", "letterGrade": "N/A", "classId": "26051", "teacher": "Becker, Daniel"}}, {"6": {"name": "7: IB Business And Management SL S1", "numberGrade": "0.0%", "letterGrade": "N/A", "classId": "26190", "teacher": "Weiker, Aric"}}], "name": "Arnav Chawla"}
    `);

    const classes = data.students
      .map((c, i) => {
        c = c[i]
        return {
          id: c.classId,
          letterGrade: c.letterGrade,
          name: c.name.split(":")[1].replace("S1", "").replace("S2", ""),
          numberGrade: c.numberGrade,
          teacher: c.teacher
        }
      });
    const name = data.name;

    resolve({classes, name});
  });
}

const classData = id => {
  return new Promise(resolve => {
    const weightData = JSON.parse(`{"Class Assignments and Projects": {"percentage": 40.0}, "Final": {"percentage": 10.0}, "Professionalism": {"percentage": 15.0}, "Quizzes and Tests": {"percentage": 35.0}, "TOTAL": {"percentage": 100.0}}
    `);

    const weights = {};
    
    Object.keys(weightData)
      .forEach(category => {
        weights[category] = weightData[category].percentage;
      });
    resolve({weights})
  });
}

module.exports = {login, classData};
