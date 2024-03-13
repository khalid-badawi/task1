"use strict";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let origin = -1;
document.addEventListener("DOMContentLoaded", function () {
  renderTasks(tasks);

  const input = document.querySelector(".borderless-input");
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTaskDescription = input.value.trim();
      if (newTaskDescription !== "") {
        tasks.push({ description: newTaskDescription, status: "pending" });

        localStorage.setItem("tasks", JSON.stringify(tasks));
        if (
          document.getElementById("allBtn").classList.contains("selected-btn")
        ) {
          renderTasks(tasks);
        } else if (
          document
            .getElementById("pendingBtn")
            .classList.contains("selected-btn")
        ) {
          let filteredTasks = tasks.filter((task) => task.status === "pending");
          renderTasks(filteredTasks);
        } else {
          let filteredTasks = tasks.filter(
            (task) => task.status === "completed"
          );
          renderTasks(filteredTasks);
        }

        input.value = "";
      }
    }
  });
});

function selectBtn(button) {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    if (btn === button) {
      btn.classList.add("selected-btn");
    } else {
      btn.classList.remove("selected-btn");
    }
  });

  let filteredTasks = tasks;
  if (button.id === "pendingBtn") {
    filteredTasks = tasks.filter((task) => task.status === "pending");
    renderTasks(filteredTasks);
  } else if (button.id === "completedBtn") {
    filteredTasks = tasks.filter((task) => task.status === "completed");
    renderTasks(filteredTasks);
  } else {
    renderTasks(tasks);
  }
}
function renderTasks(filteredTasks) {
  let tasksCont = document.getElementById("tasksCont");
  tasksCont.innerHTML = "";

  filteredTasks.forEach((task, index) => {
    let originalIndex = tasks.indexOf(task);
    let taskCont = document.createElement("div");
    taskCont.classList.add("task-cont");
    taskCont.setAttribute("data-index", originalIndex);

    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", `checkbox${index + 1}`);
    checkbox.checked = task.status === "completed";

    checkbox.addEventListener("change", function () {
      let dataIndex = parseInt(taskCont.getAttribute("data-index"));
      if (checkbox.checked) {
        tasks[dataIndex].status = "completed";
        if (
          !document.getElementById("allBtn").classList.contains("selected-btn")
        ) {
          filteredTasks = tasks.filter((task) => task.status === "pending");
          renderTasks(filteredTasks);
        }
      } else {
        tasks[dataIndex].status = "pending";
        if (
          !document.getElementById("allBtn").classList.contains("selected-btn")
        ) {
          filteredTasks = tasks.filter((task) => task.status === "completed");
          renderTasks(filteredTasks);
        }
      }
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    let label = document.createElement("label");
    label.setAttribute("for", `checkbox${index + 1}`);
    label.textContent = task.description;

    let iconsCont = document.createElement("div");

    let dragIcon = document.createElement("i");
    dragIcon.classList.add("fas", "fa-hand-paper", "drag-icon");
    dragIcon.setAttribute("draggable", "true");

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash-alt", "delete-icon");
    deleteIcon.addEventListener("click", function () {
      let dataIndex = parseInt(taskCont.getAttribute("data-index"));
      tasks.splice(dataIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks(filteredTasks);
    });

    iconsCont.appendChild(dragIcon);
    iconsCont.appendChild(deleteIcon);

    taskCont.appendChild(checkbox);
    taskCont.appendChild(label);
    taskCont.appendChild(iconsCont);
    tasksCont.appendChild(taskCont);

    dragIcon.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", originalIndex);
      origin = originalIndex;
      console.log(originalIndex);
      e.dataTransfer.effectAllowed = "move";
    });

    taskCont.addEventListener("dragover", function (e) {
      e.preventDefault();
      console.log(origin, originalIndex);

      if (origin !== originalIndex) {
        let draggedTask = tasks[origin];
        tasks.splice(origin, 1);
        tasks.splice(originalIndex, 0, draggedTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        console.log(tasks);
        if (
          document
            .getElementById("pendingBtn")
            .classList.contains("selected-btn")
        ) {
          filteredTasks = tasks.filter((task) => task.status === "pending");
        } else if (
          document
            .getElementById("completedBtn")
            .classList.contains("selected-btn")
        ) {
          filteredTasks = tasks.filter((task) => task.status === "completed");

        }
        renderTasks(filteredTasks);
        origin = originalIndex;
      }
    });
  });
}

function clearAll() {
  let confirmation = confirm("Are you sure you want to delete all tasks?");
  if (confirmation) {
    tasks = [];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(tasks);
  }
}

// localStorage.removeItem("tasks");
