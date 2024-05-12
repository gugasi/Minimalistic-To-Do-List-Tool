let input = document.getElementById("inputTarefa"); //Separate the variable to the input value
let btnAdd = document.getElementById("adicionar"); //Registers the add button.
let main = document.querySelector("#areaLista"); //Separates the variable from the area where it will be placed in the html

let mainInput = document.querySelector("#main-input");

let toolBar = document.querySelector("#toolbar"); // Toolbar underneath the input

// Variables used in the Edit part
let editBack = document.querySelector("#cancel-edit-back"); // Edit screen back arrow
let editForm = document.querySelector("#editform"); // Editing "Form"
let editTitle = document.querySelector("#edit-title"); // Title of the Edit Form
var input_edit = document.querySelector("#input-edit");

let oldInputValue; 

let itemcounter = 0; //class item

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];



window.addEventListener('load', function() {
  let savedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (savedTasks && savedTasks.length > 0) {
    savedTasks.forEach(function(task) {
      let novoItem = `
        <div class="item" id="${task.id}">
            <div class="item-icone">
                <i onclick="finished(${task.id})" id="icone_${task.id}" class="mdi mdi-circle-outline"></i>
            </div>
            <div class="item-nome">
                ${task.nome}
            </div>
            <div class="item-botao">
                <button onclick="editar(${task.id})" class="edit">
                <span class="mdi mdi-pencil-outline"></span>
                </button>
                <button onclick="deletar(${task.id})" class="delete">
                <i class="mdi mdi-delete"></i>
                </button>
            </div>
        </div>
        `;
      main.innerHTML += novoItem;
    });
  }
});




// event

//Function
function addTarefa() {
  //no input
  valorInput = input.value;

  if (valorInput !== "" && valorInput !== null && valorInput !== undefined) {
    //Check the input value if it is NOT empty, null or undefined

    let newItem ={
      id: ++itemcounter,
      nome: valorInput 
    };

    tasks.push(newItem);

    //++itemcounter;
    let novoItem = `
        <div class="item" id="${itemcounter}">
            <div class="item-icone">
                <i onclick="finished(${itemcounter})" id="icone_${itemcounter}" class="mdi mdi-circle-outline"></i>
            </div>
            <div class="item-nome">
                ${valorInput}
            </div>
            <div class="item-botao">
                <button onclick="editar(${itemcounter})" class="edit">
                <span class="mdi mdi-pencil-outline"></span>
                </button>
                <button onclick="deletar(${itemcounter})" class="delete">
                <i class="mdi mdi-delete"></i>
                </button>
            </div>
        </div>
        `;
    // main item
    main.innerHTML += novoItem;
    
    // local list
    localStorage.setItem('tasks', JSON.stringify(tasks));

    //input
    input.value = "";
    input.focus();
    console.log(tasks);
  }
}

// event

// delete function
function deletar(id) {
  var item = document.getElementById(id);
  let index = tasks.findIndex(item => item.id === id);

  console.log(index);
  
  if(index !== -1){
    // Remove an item
    tasks.splice(index, 1);

    // Refreshes the task list in local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    item.style.opacity = 0;
    setTimeout(function () {
      item.remove(); // Remove element after 500ms (transition time)
    }, 500);
  }

}



// START - Event to end task

// Function to mark as Done

function finished(id) {
  var item = document.getElementById(id);
  var classe = item.getAttribute("class");
  var icone = document.getElementById("icone_" + id);
  
  

  if (classe == "item") {
    item.classList.toggle("concluido");

    icone.classList.remove("mdi-circle-outline");
    icone.classList.add("mdi-check-circle");
  } else {
    item.classList.toggle("concluido");

    icone.classList.remove("mdi-check-circle");
    icone.classList.add("mdi-circle-outline");
  }
}

// END - Event to end task

// HOME - Event Edit

// Function for the edit button
function switchCard() {
  mainInput.classList.toggle("hidden");
  editForm.classList.toggle("hidden");
  editBack.classList.toggle("hidden");
  toolBar.classList.toggle("hidden");
  editTitle.classList.toggle("hidden");
  main.classList.toggle("hidden");
}
// Edit Task Button

function uptadeInput(text) {
  let item = document.querySelector(".item");

  let items = document.querySelectorAll(".item");

  items.forEach((item) => {
    let item_name = item.querySelector(".item-nome");

    if (item_name.textContent.trim() === oldInputValue) {
      item_name.textContent = text;
    }
  });
}

function editar(id) {
  var item = document.getElementById(id); // Takes the entire div of the separated by the item id because it is unique.

  let item_name = item.querySelector(".item-nome").textContent.trim(); //grabs the value of the item-name class div from within the ITEM div

  let edit = document.querySelector(".edit"); // Edit Button Class on Task

  if (
    edit.classList.contains("edit") ||
    item.classList.contains("mdi-pencil-outline")
  ) {
    switchCard();

    input_edit.value = item_name;
    oldInputValue = item_name;
  }
}

//Event on the "back" arrow button

editBack.addEventListener("click", (e) => {
  e.preventDefault();
  switchCard();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = input_edit.value;

  if (editInputValue) {
    // Update
    uptadeInput(editInputValue);
  }

  switchCard();
});

// END - Event Edit

//Event for the ENTER button to be recognized when adding a task
input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    btnAdd.click();
  }
});

// HOME - Search Event by Task
function search() {
  let item = document.querySelector(".item");

  let items = document.querySelectorAll(".item");

  let inputSearch = document.querySelector("#input-search");

  inputSearch.addEventListener("input", function (e) {
    const searchStr = e.target.value.toLowerCase();
    console.log(items);
    //console.log(e.target.value);

    items.forEach((item) => {
      let item_name = item.querySelector(".item-nome").textContent.trim();
      if (item_name.toLowerCase().indexOf(searchStr) > -1) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });
}

// End - Search Event by Task

// HOME - Filter Selector

const filter = document.getElementById("filter-select");

// Adds an event listener to the "filter" element
filter.addEventListener("change", function() {
  const selectedValue = this.value; // Gets the value of the selected filter

   // Defines the "filterTasks" function that filters tasks based on the selected filter
  function filterTasks(state) {
      // Retrieves all tasks from the task area
    let items = document.querySelectorAll(".item");

    // Iterate over all tasks
    items.forEach((item) => {
      const taskState = item.classList.contains('concluido');
    
        // Shows only the tasks that match the selected filter
      if (state === 'all' || (state === 'done' && taskState) || (state === 'current' && !taskState)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  filterTasks(selectedValue);// Shows only the tasks that match the selected filter
});

// FIM - Selector Filter

// HOME - Local Storage

/*const items = localStorage.getItem('items')
let items= [];
if()
*/


//const items = localStorage=getItem('items')


// Fim - Local Storage

// HOME - Date Setting Event

//Date Updated Daily
const d = new Date();
document.getElementById("dia").innerHTML = d.getDate() + "th";

const months = [
  "January ",
   "February ",
   "March ",
   "April ",
   "May ",
   "June ",
   "July ",
   "August ",
   "September ",
   "October ",
   "November ",
   "December ",
];

const m = new Date();
let month = months[m.getMonth()];

document.getElementById("mes").innerHTML = month;

// fIM - Date Marking Event
