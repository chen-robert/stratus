let currentDate = new Date();

const hash = date => {
  return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
}

const updateDates = async () => {
  const date = new Date(currentDate);

  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  $("#calendar-title").text(`${month}, ${year}`);

  date.setDate(1);
  const day = date.getDay();

  date.setDate(1 - day);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);

  const startTime = date.getTime();
  const endTime = startTime + 5 * 7 * 24 * 60 * 60* 1000;

  const tasks = await $.get(`/calendar/list?start=${startTime}&end=${endTime}`);
  const lp = {};
  tasks.forEach(task => {
    const date = new Date(task.date);

    const key = hash(date);
    if(!lp[key]) lp[key] = [];

    const $elem = $(Task(task.text, task.completed));
    $elem.find("input").change(function(){
      markTask(task._id, $(this).prop("checked"));
    });

    $elem.bind("contextmenu", () => {
      removeTask(task._id);
      $elem.remove();
      return false;
    });

    lp[key].push($elem);
  });


  $(".calendar--cell").removeClass("calendar--cell__faded");
  $(".calendar--cell").removeClass("calendar--cell__today");
  
  for(let i = 0; i < 5; i++){
    for(let j = 0; j < 7; j++){
      const $curr = $(`.calendar--cell[data-i=${i}][data-j=${j}]`);

      $curr.data("date", date.getTime());

      const prefix = date.getDate() === 1 ? date.toLocaleString('default', { month: 'short' }): "";
      $curr.find(".cell--date").text(prefix + " " + date.getDate());

      if(date.toLocaleString('default', { month: 'long' }) !== month) {
        $curr.addClass("calendar--cell__faded");
      }

      const key = hash(date);
      if(!lp[key]) lp[key] = [];
      $curr.find(".cell--tasks")
        .empty()
        .append(
          lp[key]
        );

      if(key === hash(new Date())) {
        $curr.addClass("calendar--cell__today");
      }
      
      date.setDate(date.getDate() + 1);
    }
  }
}

const shiftMonth = delta => {
  currentDate.setMonth(currentDate.getMonth() + delta);

  updateDates();
}

const addTask = async (text, date) => {
  await $.post("/calendar/addTask", {text, date});

  updateDates();
}

const removeTask = async id => {
  await $.post("/calendar/removeTask", {id});
}

const markTask = async (id, completed) => {
  await $.post("/calendar/markTask", {id, completed});
}

$(() => {
  updateDates();

  $("body").click(() => $(".popup").remove());
  $(".calendar--cell").click(function(e){
    $(".popup").remove();

    if(e.target !== this) return;

    const date = $(this).data("date");

    $popup = $(Popup());

    $popup.find("button").click(() => {
      const text = $(this).find("textarea").val();

      addTask(text, date);
      $popup.remove();
      
      return false;
    });

    $popup.click(() => false);

    $(this).append($popup);
    $popup.find("textarea").focus()

    return false;
  });
})