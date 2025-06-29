let todoListCont = document.querySelector("#todoListCont");
let todoCategory = document.querySelectorAll(".category");
let todoInput = document.querySelector("#todoInput");
let addTodoBtn = document.querySelector("#addBtn");
let allCheckbox = document.querySelectorAll("input[type=checkbox]");
let todosArray = JSON.parse(localStorage.getItem("todos")) || [];
document.addEventListener("DOMContentLoaded", () => {
  // By default: show all todos
  displayTodos(todosArray);
  // By default: mark "All" category as selected
  todoCategory[0].classList.add("bg-[#1056d2]");

  todoCategory.forEach((category, i) => {
    category.addEventListener("click", (e) => {
      // Remove bg class from all categories first
      todoCategory.forEach((cat, i) => {
        cat.classList.remove("bg-[#1056d2]");
      });
      // Add bg class to the clicked category only
      e.target.classList.add("bg-[#1056d2]");
      const selectedCategory = e.target.textContent.toLowerCase();
      let finalTodos = todosArray;
      if (selectedCategory == "all") {
        finalTodos = todosArray;
      } else if (selectedCategory == "completed") {
        finalTodos = todosArray.filter(
          (completedSelected) => completedSelected.isCompleted
        );
      } else if (selectedCategory == "pending") {
        finalTodos = todosArray.filter(
          (pendingSelected) => !pendingSelected.isCompleted
        );
      }
      displayTodos(finalTodos);
    });
  });
});
// add new task
addTodoBtn.addEventListener("click", () => {
  let newTodoInput = todoInput.value.trim();

  if (newTodoInput == "") {
    alert("Plase enter a task");
    return;
  }
  if (
    todosArray.some(
      (existedTodo) =>
        existedTodo.todo.toLowerCase() == newTodoInput.toLowerCase()
    )
  ) {
    alert("Task already exists");
    todoInput.value = "";
    return;
  }
  if (newTodoInput.length > 25) {
    alert("Task length must be less than 25 characters");
    todoInput.value = "";
    return;
  }

  todosArray.push({ todo: newTodoInput, isCompleted: false });
  saveToLocalStorage();
  displayTodos(todosArray);
  todoInput.value = "";
});

// display todos
function displayTodos(finalTodos) {
  todoListCont.innerHTML = "";
  finalTodos.forEach((todoItem, i) => {
    let newTodoItem = document.createElement("div");
    newTodoItem.className =
      "flex items-center py-3 border-b-[0.5px] border-[#1e2c4c]/50";
    newTodoItem.innerHTML = `<input class="todo-checkbox basis-auto w-5 h-5" type="checkbox" data-index="${i}" name="" id="" ${
      todoItem.isCompleted ? "checked" : ""
    }/>
          <p class="basis-full mx-3 text-lg">${todoItem.todo}</p>
          <div class="hover:bg-blue-300/10 rounded-full px-2 py-1 duration-300">
            <i
          class="fa-solid fa-trash todo-delete basis-auto scale-120 cursor-pointer text-[#59688c]" data-id="${
            todoItem.todo
          }"
          ></i></div>`;
    todoListCont.append(newTodoItem);
  });

  // toggle checkbox
  const checkboxes = document.querySelectorAll(".todo-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      let index = parseInt(e.target.getAttribute("data-index"));
      todosArray[index].isCompleted = e.target.checked;
      saveToLocalStorage();
      const selectedCategory = e.target.textContent.toLowerCase();
      if (selectedCategory == "all") {
        displayTodos(todosArray);
      } else if (selectedCategory == "completed") {
        displayTodos(
          todosArray.filter(
            (completedSelected) => completedSelected.isCompleted
          )
        );
      } else if (selectedCategory == "pending") {
        displayTodos(
          todosArray.filter((pendingSelected) => !pendingSelected.isCompleted)
        );
      }
    });
  });

  // delete todo
  let deletes = document.querySelectorAll(".todo-delete");
  deletes.forEach((del) => {
    del.addEventListener("click", (e) => {
      let id = e.target.getAttribute("data-id");
      todosArray = todosArray.filter((todo) => todo.todo !== id);
      saveToLocalStorage();
      displayTodos(todosArray);
    });
  });
}
// save to local storage
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todosArray));
}
function clearLocalrStorage() {
  if (todosArray.length == 0) {
    alert("No tasks to delete");
    return;
  }
  if (confirm("Are you sure? All tasks will be deleted")) {
    localStorage.clear();
    todosArray = [];
    displayTodos(todosArray);
  }
}
