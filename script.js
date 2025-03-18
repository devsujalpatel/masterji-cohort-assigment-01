const currentDate = document.querySelector(".calendar-current-date");
const prevBtn = document.getElementById("calendar-prev");
const nextBtn = document.getElementById("calendar-next");
const datesContainer = document.querySelector(".calendar-dates");
const moodSelect = document.getElementById("moods-select");
const moodContainer = document.getElementById("mood-container");

let date = new Date();
let currentMonth = date.getMonth();
let currentMonthReal = date.getMonth();
let currentYear = date.getFullYear();
let today = date.getDate();
let selectedEmoji = "";
let nameOnly = "";

// load stored moods
let moodData = JSON.parse(localStorage.getItem("moodData")) || {};

// months array to get months name
const months = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];

// mood selection event to render moods in the dom 
moodSelect.addEventListener("change", () => {
  let value = moodSelect.value;
  nameOnly = value.replace(/[\p{Emoji_Presentation}]/gu, "").trim();
  selectedEmoji = value.match(/[\p{Extended_Pictographic}\uFE0F]/gu)?.join("") || "";

  // save mood for today's date
  let key = `${currentYear}-${currentMonth}-${today}`;
  // giving data in the object with date key
  moodData[key] = { emoji: selectedEmoji, mood: nameOnly };
  
  // saving data to local storage or updatin
  localStorage.setItem("moodData", JSON.stringify(moodData));
    // running these two function on change event to render the change
  renderCalendar();
  todaysMood();
});

// function to display today's mood
const todaysMood = () => {
  let key = `${currentYear}-${currentMonth}-${today}`;
  let storedMood = moodData[key];
    // agar mood selected h to data show hoga nahi to  "Select a mood for today!" 
  moodContainer.innerHTML = storedMood
    ? `Your mood is: ${storedMood.emoji} ${storedMood.mood} today`
    : "Select a mood for today!";
};

// function to render the calendar with stored moods
function renderCalendar() {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

  let currentMonthName = months[currentMonth];

  currentDate.textContent = `${currentMonthName} ${currentYear}`;

  let days = "";

  for (let i = 0; i < firstDay; i++) {
    days += `<li class="text-gray-600"></li>`;
  }

  // add days
  for (let i = 1; i <= lastDate; i++) {
    let isToday = i === today && currentMonth === currentMonthReal;
    let key = `${currentYear}-${currentMonth}-${i}`;
    let storedMood = moodData[key];
    // checking if that date has any mood selected in local storage to render
    days += `<li class="p-2 sm:p-3 sm:text-xl lg:text-3xl rounded-md sm:border sm:border-gray-700  hover:bg-zinc-600 cursor-pointer sm:w-[60px] sm:h-[60px] lg:w-[80px] lg:h-[80px] w-[50px] h-[50px] content-center ${
      isToday ? "bg-gray-700" : ""
    }">${storedMood ? storedMood.emoji : i}</li>`;
  }

  datesContainer.innerHTML = days;
}

// event listeners for navigation
prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

// Initialize the calendar and load stored data
renderCalendar();
todaysMood();
