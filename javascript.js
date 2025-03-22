const display = document.querySelector(".display");
display.textContent = "0";

const divideByZeroError = "DON'T YOU DIVIDE BY ZERO";

let state = {
  isMessageDisplayed: false,
  isDecimalEnabled: false,
  isResultDisplayed: true,
  isAwaitingOperand: false,
  exec_stack: [undefined, undefined, undefined],
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
  let result = undefined;
  switch (state.exec_stack[1]) {
    case "*":
      result = multiply(state.exec_stack[0], state.exec_stack[2]);
      break;
    case "+":
      result = add(state.exec_stack[0], state.exec_stack[2]);
      break;
    case "-":
      result = subtract(state.exec_stack[0], state.exec_stack[2]);
      break;
    case "/":
      result = divide(state.exec_stack[0], state.exec_stack[2]);
      break;
    default:
      result = NaN;
      break;
  }
  return rounded(result);
};

const showResult = (result) => {
  display.textContent = result.toString();
  state.exec_stack[0] = result;
  state.exec_stack[1] = undefined;
  state.exec_stack[2] = undefined;
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
  state.exec_stack = [undefined, undefined, undefined];
};

const clearMessage = () => {
  if (state.isMessageDisplayed) {
    clear();
  }
};

const insertNumber = (number) => {
  clearMessage();
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
  return state.exec_stack[1] === "/" && state.exec_stack[2] === 0;
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
    state.exec_stack[0] !== undefined &&
    state.exec_stack[2] === undefined
  );
};

const usingOperatorToSolve = () => {
  return (
    !state.isAwaitingOperand &&
    state.exec_stack[0] !== undefined &&
    state.exec_stack[1] !== undefined &&
    state.exec_stack[2] === undefined
    // as always, check later if there is
    // a better way to do this
  );
};

const insertOperation = (operator) => {
  clearMessage();
  if (state.exec_stack[1] === undefined) {
    state.isAwaitingOperand = true;
    state.isDecimalEnabled = false;
    state.exec_stack[0] = sanitizedDisplay();
  } else if (reusingPreviousResult()) {
    state.isDecimalEnabled = false;
  } else if (usingOperatorToSolve()) {
    state.exec_stack[2] = sanitizedDisplay();
    solve();
  }
  state.exec_stack[1] = operator;
  return;
};

const onlyFirstOperandDefined = () => {
  return (
    // try later if there is another way
    // of doing the same check
    state.exec_stack[0] !== undefined &&
    state.exec_stack[1] === undefined &&
    state.exec_stack[2] === undefined
  );
};

const anyOperandUndefined = () => {
  return state.exec_stack[0] === undefined || state.isAwaitingOperand;
};

const solveByEqual = () => {
  clearMessage();
  if (onlyFirstOperandDefined()) {
    state.exec_stack[1] = "+";
    state.exec_stack[2] = 0;
  } else if (anyOperandUndefined()) {
    state.exec_stack = [sanitizedDisplay(), "+", 0];
  } else {
    state.exec_stack[2] = sanitizedDisplay();
  }
  solve();
};

const insertPeriod = () => {
  clearMessage();
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
