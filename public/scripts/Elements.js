const Task = (title, checked) => `
<div class="tasks--task">
  <div class="pretty p-icon p-rotate">
    <input type="checkbox" ${checked? "checked": ""}/>
    <div class="state">
      <i class="icon mdi mdi-close"></i>
      <label>${title}</label>
    </div>
  </div>
</div>
`

const Popup = () => `
<div class="popup">
  <textarea></textarea>
  <br>
  <button>Create</button>
</div>
`