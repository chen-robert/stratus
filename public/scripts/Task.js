const Task = (title, checked) => `
<div class="tasks--task">
  <div class="pretty p-icon p-tada">
    <input type="checkbox" ${checked? "checked": ""}/>
    <div class="state">
      <i class="icon mdi mdi-close"></i>
      <label>${title}</label>
    </div>
  </div>
</div>
`