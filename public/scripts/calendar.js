const updateDates = currentDate => {
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  $("#calendar-title").text(`${month}, ${year}`);

  currentDate.setDate(1);

  const day = currentDate.getDay();

  currentDate.setDate(1 - day);

  console.log(currentDate);

  $(".calendar--cell").removeClass("calendar--cell__faded");
  
  for(let i = 0; i < 5; i++){
    for(let j = 0; j < 7; j++){
      const $curr = $(`.calendar--cell[data-i=${i}][data-j=${j}]`);

      const prefix = currentDate.getDate() === 1 ? currentDate.toLocaleString('default', { month: 'short' }): "";
      $curr.find(".cell--date").text(prefix + " " + currentDate.getDate());

      currentDate.setDate(currentDate.getDate() + 1);

      if(currentDate.toLocaleString('default', { month: 'long' }) !== month) {
        $curr.addClass("calendar--cell__faded");
      }
    }
  }
  console.log(currentDate);
}

$(() => {
  updateDates(new Date());
})