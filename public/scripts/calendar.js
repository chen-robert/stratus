let currentDate = new Date();

const updateDates = currentDate => {
  const date = new Date(currentDate);

  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  $("#calendar-title").text(`${month}, ${year}`);

  date.setDate(1);

  const day = date.getDay();

  date.setDate(1 - day);


  $(".calendar--cell").removeClass("calendar--cell__faded");
  
  for(let i = 0; i < 5; i++){
    for(let j = 0; j < 7; j++){
      const $curr = $(`.calendar--cell[data-i=${i}][data-j=${j}]`);

      const prefix = date.getDate() === 1 ? date.toLocaleString('default', { month: 'short' }): "";
      $curr.find(".cell--date").text(prefix + " " + date.getDate());

      if(date.toLocaleString('default', { month: 'long' }) !== month) {
        $curr.addClass("calendar--cell__faded");
      }
      
      date.setDate(date.getDate() + 1);
    }
  }
}

const shiftMonth = delta => {
  console.log(delta);
  currentDate.setMonth(currentDate.getMonth() + delta);
  console.log(currentDate);

  updateDates(currentDate);
}

$(() => {
  updateDates(currentDate);
})