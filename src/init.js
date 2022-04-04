const message = document.getElementById("message");
message.innerHTML = "";

const togo1 = document.getElementById("togo1");
const togo2 = document.getElementById("togo2");
const togo3 = document.getElementById("togo3");
const startTime = document.getElementById("start");
const endTime = document.getElementById("end");

const getDateFromTimeString = (timeString) => {
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(hour, minute, 0);
  return date;
};

const getSecondsWorkedPerDay = () => {
  const startDate = getDateFromTimeString(startTime.value);
  const endDate = getDateFromTimeString(endTime.value);

  if (startDate > endDate) {
    // Handle nightshift!
    endDate.setDate(endDate.getDate() + 1);
  }

  return Math.round((endDate - startDate) / 1000);
};

const getWorkingDays = () => {
  const selected = [...document.getElementsByClassName("day-button selected")];
  return selected.map((element) => Number.parseInt(element.dataset.i));
};

const getTotalWorkingSeconds = () => {
  const numDays = getWorkingDays().length;
  return getSecondsWorkedPerDay() * numDays;
};

const getInternalDayIndex = (dayIndex) => {
  if (dayIndex === 0) {
    return 7;
  }
  return dayIndex;
};

const randomChoice = (array) => {
  const i = Math.floor(Math.random() * array.length);
  return array[i];
};

const getTermOfEndearment = () => {
  return randomChoice([
    "dude",
    "bro",
    "champ",
    "buddy",
    "pal",
    "friendo",
    "chief",
    "you beautiful bastard",
    "my lover",
    "you joyous being",
    "you burst of summer rain",
    "you delightful maniac",
    "you unhinged demon",
    "you workaholic",
    "{{ humourous term of endearment #34 }}",
    "Jeff",
    "legend",
    "you delicious fruity snack",
    "cutie pie",
    "you bundle of joy",
    "dreamboat",
    "dream machine",
    "wonderkid",
    "you absolute unit",
  ]);
};

const pluralise = (string, value) => {
  if (value === 1) {
    return string;
  }
  return `${string}s`;
};

const setTodoValue = (totalSeconds, secondsWorked) => {
  const percentage = (secondsWorked / totalSeconds) * 100;
  let secondsToGo = totalSeconds - secondsWorked;

  const workedH = Math.floor(secondsWorked / 3600);
  secondsWorked %= 3600;
  const workedM = Math.floor(secondsWorked / 60);
  const workedS = secondsWorked % 60;

  const remainingH = Math.floor(secondsToGo / 3600);
  secondsToGo %= 3600;
  const remainingM = Math.floor(secondsToGo / 60);
  const remainingS = secondsToGo % 60;

  togo1.innerHTML = `
    You're <strong>${percentage.toFixed(4)}%</strong> done
  `;

  togo2.innerHTML = `
    That's <strong>${workedH} ${pluralise(
    "hour",
    workedH
  )} ${workedM} ${pluralise("minute", workedM)} and ${workedS} ${pluralise(
    "second",
    workedS
  )}</strong> worked
  `;

  togo3.innerHTML = `
    <strong>${remainingH} ${pluralise(
    "hour",
    remainingH
  )} ${remainingM} ${pluralise(
    "minute",
    remainingM
  )} and ${remainingS} ${pluralise("second", remainingS)}</strong> to go
  `;
};

const clearTogo = () => {
  togo1.innerHTML = null;
  togo2.innerHTML = null;
  togo3.innerHTML = null;
};

const setResult = (updateMessage = true) => {
  const secondsPerDay = getSecondsWorkedPerDay();
  const totalSeconds = getTotalWorkingSeconds();

  if (totalSeconds === 0) {
    message.innerHTML = "No work this week? Result.";
    clearTogo();
    return;
  }

  const startTimeToday = getDateFromTimeString(startTime.value);
  const now = new Date();
  const dayIndex = getInternalDayIndex(now.getDay());

  const workingDays = getWorkingDays();

  const numDaysWorked = workingDays.filter((i) => i < dayIndex).length;
  const secondsFromPreviousDays = numDaysWorked * secondsPerDay;

  const secondsWorkedToday = Math.max(
    Math.min(Math.round((now - startTimeToday) / 1000), secondsPerDay),
    0
  );

  let totalSecondsWorkedThisWeek = secondsFromPreviousDays;
  if (workingDays.includes(dayIndex)) {
    totalSecondsWorkedThisWeek += secondsWorkedToday;
  }

  if (secondsWorkedToday === 0) {
    if (updateMessage) {
      message.innerHTML = "You don't have to start working yet!";
    }
    setTodoValue(totalSeconds, totalSecondsWorkedThisWeek);
    return;
  }

  if (!workingDays.includes(dayIndex)) {
    if (updateMessage) {
      message.innerHTML = "You're not working today. Chill out a bit...";
    }
    setTodoValue(totalSeconds, totalSecondsWorkedThisWeek);
    return;
  }

  if (secondsWorkedToday >= 0) {
    if (updateMessage) {
      message.innerHTML = `Keep going ${getTermOfEndearment()}...`;
    }
    setTodoValue(totalSeconds, totalSecondsWorkedThisWeek);
  }

  const isLastDay = workingDays.indexOf(dayIndex) === workingDays.length - 1;
  if (isLastDay && secondsWorkedToday >= 0) {
    if (updateMessage) {
      message.innerHTML = `Last day! Hang in there ${getTermOfEndearment()}...`;
    }
    setTodoValue(totalSeconds, totalSecondsWorkedThisWeek);
  }

  if (!isLastDay && secondsWorkedToday === secondsPerDay) {
    message.innerHTML = "All done for today!";
    setTodoValue(totalSeconds, totalSecondsWorkedThisWeek);
  }

  if (isLastDay && secondsWorkedToday === secondsPerDay) {
    message.innerHTML = "All done!";
    clearTogo();
    togo1.innerHTML = "Go home you massive legend";
  }
};

startTime.onchange = () => {
  if (startTime.value) {
    setResult();
  }
};
endTime.onchange = () => {
  if (endTime.value) {
    setResult();
  }
};

const dayButtons = [...document.getElementsByClassName("day-button")];

dayButtons.forEach((element) => {
  element.onclick = () => {
    element.classList.toggle("selected");
    setResult();
  };
});

setResult();
setInterval(() => {
  !!startTime.value && !!endTime.value && setResult(false);
}, 1000);
