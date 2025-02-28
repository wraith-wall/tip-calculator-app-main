"use strict";

const billForm = document.getElementById("bill");
const peopleForm = document.getElementById("people");
const resetButton = document.getElementById("reset");
const inputButton = document.getElementById("tip-input");
const percentButtons = document.querySelectorAll(".calculator__btn");
const billError = document.getElementById("billError");
const peopleError = document.getElementById("peopleError");
const totalSumDisplay = document.getElementById("total-sum");
const perPersonSumDisplay = document.getElementById("per-person-sum");

let activeButton = null;
let selectedTipPercent = null;

// Event listeners for inputs
billForm.addEventListener("input", () => {
  billForm.value = billForm.value.replace(/[^0-9.]/g, "");
  billForm.value = billForm.value.replace(/(\.\d{2})\d+/g, "$1");
  billForm.value = billForm.value.replace(/(\..*)\./g, "$1");
  billForm.value = billForm.value.replace(/^(\d{7})\d+/g, "$1");
  handleReset();
  calculateTip();
  checkForZero(billForm, billError);
});

peopleForm.addEventListener("input", () => {
  peopleForm.value = peopleForm.value.replace(/[^0-9]/g, "");
  peopleForm.value = peopleForm.value.replace(/^(\d{3})\d+/g, "$1");
  handleReset();
  calculateTip();
  checkForZero(peopleForm, peopleError);
});

inputButton.addEventListener("input", () => {
  inputButton.value = inputButton.value.replace(/[^0-9]/g, "");
  if (/^0+$/.test(inputButton.value)) {
    inputButton.value = "0";
  }
  selectedTipPercent = null;
  calculateTip();
  handleReset();
});

// Event listener for custom tip input
percentButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    selectedTipPercent = parseFloat(button.value);
    inputButton.value = "";
    handleTipButtonClick(event.target);
    calculateTip();
  });
});

resetButton.addEventListener("click", () => {
  if (handleReset()) {
    billForm.value = "";
    peopleForm.value = "";
    inputButton.value = "";

    if (activeButton) {
      revertButtonStyle(activeButton);
      activeButton = null;
    }
    selectedTipPercent = null;

    totalSumDisplay.textContent = "$0.00";
    perPersonSumDisplay.textContent = "$0.00";

    handleReset();
  }
});

function checkForZero(inputElement, errorElement) {
  const value = parseFloat(inputElement.value) || 0;

  if (value === 0 && inputElement.value.trim() !== "") {
    errorElement.textContent = "Can't be zero";
    errorElement.style.color = "#E17457";
    errorElement.style.fontWeight = "700";
    errorElement.style.fontSize = "16";
    errorElement.style.float = "right";
    inputElement.style.borderColor = "#E17457";
  } else {
    errorElement.textContent = "";
    inputElement.style.borderColor = "";
  }
}

// Handle reset
function handleReset() {
  const billValue = parseFloat(billForm.value) || 0;
  const peopleValue = parseFloat(peopleForm.value) || 0;
  const customTipValue = inputButton.value.trim();
  if (
    billValue > 0 &&
    peopleValue > 0 &&
    (customTipValue !== "" || activeButton !== null)
  ) {
    resetButton.style.backgroundColor = "#26c2ae";
    resetButton.style.opacity = "1";
  } else {
    resetButton.style.backgroundColor = "";
    resetButton.style.opacity = "";
  }
  return (
    billValue > 0 &&
    peopleValue > 0 &&
    (customTipValue !== "" || activeButton !== null)
  );
}

// Handle percentage button click
function handleTipButtonClick(button) {
  if (activeButton) {
    revertButtonStyle(activeButton);
  }
  if (button === activeButton) {
    activeButton = null;
    selectedTipPercent = null;
  } else {
    button.style.backgroundColor = "#26c2ae";
    button.style.color = "#00474b";
    activeButton = button;
    selectedTipPercent = parseFloat(button.dataset.percent);
  }
  handleReset();
}

// Revert button style
function revertButtonStyle(button) {
  button.style.backgroundColor = "";
  button.style.color = "";
}

// Calculate the tip amount
function calculateTip() {
  // Get input values and convert to numbers
  const billAmount = parseFloat(billForm.value);
  const numPeople = parseFloat(peopleForm.value);
  let customTip = parseFloat(inputButton.value);

  if (customTip > 100) {
    inputButton.value = "100";
    customTip = 100;
  }

  // Validate inputs
  if (isNaN(billAmount) || isNaN(numPeople) || numPeople <= 0) {
    totalSumDisplay.textContent = "$0.00";
    perPersonSumDisplay.textContent = "$0.00";
    return;
  }
  let tipAmountPerPerson;
  const billPerPerson = billAmount / numPeople;

  if (!isNaN(customTip)) {
    if (activeButton) {
      revertButtonStyle(activeButton);
      activeButton = null;
      selectedTipPercent = null;
    }
    tipAmountPerPerson = (billPerPerson * customTip) / 100;
  } else if (selectedTipPercent) {
    tipAmountPerPerson = (billPerPerson * selectedTipPercent) / 100;
  } else {
    totalSumDisplay.textContent = "$0.00";
    perPersonSumDisplay.textContent = "$0.00";
    return;
  }
  const total = billPerPerson + tipAmountPerPerson;
  perPersonSumDisplay.textContent = `$${tipAmountPerPerson.toFixed(2)}`;
  totalSumDisplay.textContent = `$${total.toFixed(2)}`;
}
