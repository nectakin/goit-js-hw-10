import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const timerDays = document.querySelector('span[data-days]');
const timerHours = document.querySelector('span[data-hours]');
const timerMinutes = document.querySelector('span[data-minutes]');
const timerSeconds = document.querySelector('span[data-seconds]');

let userSelectedDate;
const iziOptions = {
  title: 'ERROR',
  titleColor: 'red',
  titleSize: '24px',
  message: 'Please choose a date in the future',
  messageSize: '16px',
  backgroundColor: 'rgba(225, 0, 0, 0.3)',
  position: 'center',
  closeOnEscape: true,
  timeout: 3000,
  overlay: true,
  overlayClose: true,
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentTime = Date.now();
    if (selectedDates[0] <= currentTime) {
      iziToast.show(iziOptions);
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
      userSelectedDate = selectedDates[0];
    }
    return;
  },
};

startBtn.disabled = true;

startBtn.addEventListener('click', startTimer);

function startTimer() {
  const timerId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = userSelectedDate - currentTime;
    if (deltaTime <= 0) {
      clearInterval(timerId);
      input.disabled = false;
      startBtn.disabled = false;
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(deltaTime);
    updateTimerInterface({ days, hours, minutes, seconds });
    input.disabled = true;
    startBtn.disabled = true;
  }, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
  timerDays.textContent = `${days}`;
  timerHours.textContent = `${hours}`;
  timerMinutes.textContent = `${minutes}`;
  timerSeconds.textContent = `${seconds}`;
}

const fp = flatpickr(input, options);