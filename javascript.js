const display = document.querySelector(".display");
display.textContent = "0";

const divideByZeroError = "DON'T YOU DIVIDE BY ZERO";

let state = {
  isMessageDisplayed: false,
  isDecimalEnabled: false,
  isResultDisplayed: true,
  isAwaitingOperand: false,
  firstOperand: null,
  currentOperator: null,
  secondOperand: null,
};

const checkInput = (input) => {
  return typeof input === "number";
};

const add = (a, b) => {
  if (checkInput(a) && checkInput(b)) {
    return a + b;
  }
  return NaN;
};

const subtract = (a, b) => {
  if (checkInput(a) && checkInput(b)) {
    return a - b;
  }
  return NaN;
};

const multiply = (a, b) => {
  if (checkInput(a) && checkInput(b)) {
    return a * b;
  }
  return NaN;
};

const divide = (a, b) => {
  if (checkInput(a) && checkInput(b)) {
    return a / b;
  }
  return NaN;
};

const rounded = (number) => {
  if (isInt(number)) {
    return number;
  }
  return number.toFixed(2);
};

const operate = () => {
  let result = null;
  switch (state.currentOperator) {
    case "*":
      result = multiply(state.firstOperand, state.secondOperand);
      break;
    case "+":
      result = add(state.firstOperand, state.secondOperand);
      break;
    case "-":
      result = subtract(state.firstOperand, state.secondOperand);
      break;
    case "/":
      result = divide(state.firstOperand, state.secondOperand);
      break;
    default:
      result = NaN;
      break;
  }
  return rounded(result);
};

const showResult = (result) => {
  display.textContent = result.toString();
  state.firstOperand = result;
  state.currentOperator = null;
  state.secondOperand = null;
  state.isResultDisplayed = true;
  state.isDecimalEnabled = false;
  state.isAwaitingOperand = false;
};

const isInt = (number) => {
  return number % 1 === 0;
};

const clear = () => {
  display.textContent = "0";
  state.isMessageDisplayed = false;
  state.isDecimalEnabled = false;
  state.isResultDisplayed = true;
  state.isAwaitingOperand = false;
  state.firstOperand = null;
  state.currentOperator = null;
  state.secondOperand = null;
};

const clearMessage = () => {
  if (state.isMessageDisplayed) {
    clear();
  }
};

const insertNumber = (number) => {
  if (state.isResultDisplayed) {
    state.isResultDisplayed = false;
    display.textContent = "";
  }
  if (state.isAwaitingOperand) {
    state.isAwaitingOperand = false;
    display.textContent = "";
  }
  display.textContent += number;
  return;
};

const getTwoDecimals = (str) => {
  return Number(str) / 100;
};

const sanitizedDisplay = () => {
  if (display.textContent == "") {
    return 0;
  } else if (display.textContent.charAt(0) === ".") {
    return getTwoDecimals(display.textContent.slice(1, 3));
  }
  return Number(display.textContent);
};

const divideByZero = () => {
  return state.currentOperator === "/" && state.secondOperand === 0;
};

const showMessage = (str) => {
  clear();
  state.isMessageDisplayed = true;
  display.textContent = str;
};

const solve = () => {
  if (divideByZero()) {
    showMessage(divideByZeroError);
    return;
  }
  showResult(operate());
};

const reusingPreviousResult = () => {
  return (
    state.isResultDisplayed &&
    state.firstOperand !== null &&
    state.secondOperand === null
  );
};

const usingOperatorToSolve = () => {
  return (
    !state.isAwaitingOperand &&
    state.firstOperand !== null &&
    state.currentOperator !== null &&
    state.secondOperand === null
    // as always, check later if there is
    // a better way to do this
  );
};

const insertOperation = (operator) => {
  if (state.currentOperator === null) {
    state.isAwaitingOperand = true;
    state.isDecimalEnabled = false;
    state.firstOperand = sanitizedDisplay();
  } else if (reusingPreviousResult()) {
    state.isDecimalEnabled = false;
  } else if (usingOperatorToSolve()) {
    state.secondOperand = sanitizedDisplay();
    solve();
  }
  state.currentOperator = operator;
  return;
};

const onlyFirstOperandDefined = () => {
  return (
    // try later if there is another way
    // of doing the same check
    state.firstOperand !== null &&
    state.currentOperator === null &&
    state.secondOperand === null
  );
};

const anyOperandUndefined = () => {
  return state.firstOperand === null || state.isAwaitingOperand;
};

const solveByEqual = () => {
  if (onlyFirstOperandDefined()) {
    state.firstOperand = "+";
    state.secondOperand = 0;
  } else if (anyOperandUndefined()) {
    state.firstOperand = sanitizedDisplay();
    state.currentOperator = "+";
    state.secondOperand = 0;
  } else {
    state.secondOperand = sanitizedDisplay();
  }
  solve();
};

const insertPeriod = () => {
  if (!state.isDecimalEnabled) {
    if (state.isResultDisplayed) {
      state.isResultDisplayed = false;
      display.textContent = "0";
    }
    if (state.isAwaitingOperand) {
      state.isAwaitingOperand = false;
      display.textContent = "0";
    }
    state.isDecimalEnabled = true;
    display.textContent += ".";
  }
};

const deleteOne = () => {
  if (display.textContent.length) {
    const to_delete = display.textContent.charAt(
      display.textContent.length - 1,
    );
    state.isDecimalEnabled = to_delete === "." ? false : state.isDecimalEnabled;
    display.textContent = display.textContent.slice(0, -1);
  }
};

const calculator = document.querySelector(".calculator");
calculator.addEventListener("click", (event) => {
  clearMessage();
  const target = event.target;
  if (target.classList.contains("number")) {
    insertNumber(target.textContent);
  } else if (target.classList.contains("operation")) {
    insertOperation(target.textContent);
  } else if (target.classList.contains("operate")) {
    solveByEqual();
  } else if (target.classList.contains("clear")) {
    clear();
  } else if (target.classList.contains("period")) {
    insertPeriod();
  } else if (target.classList.contains("delete")) {
    deleteOne();
  }
});
