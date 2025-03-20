const display = document.querySelector(".display");
display.textContent = "0";
let state = {
  message_shown: false,
  decimal: false,
  result_shown: true,
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
  state.result_shown = true;
  state.decimal = false;
};

const isInt = (number) => {
  return number % 1 === 0;
};

const clear = () => {
  display.textContent = "0";
  state.decimal = false;
  state.result_shown = true;
  state.exec_stack = [undefined, undefined, undefined];
};

const clearMessage = () => {
  if (state.message_shown) {
    state.message_shown = false;
    clear();
  }
};

const insertNumber = (evt) => {
  clearMessage();
  const number = evt.currentTarget.textContent;
  if (state.result_shown) {
    state.result_shown = false;
    display.textContent = "" + number;
    return;
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
  state.message_shown = true;
  display.textContent = str;
};

const solve = () => {
  if (divideByZero()) {
    showMessage("DON'T YOU DIVIDE BY ZERO");
    return;
  }
  showResult(operate());
};

const reusingPreviousResult = () => {
  return (
    state.result_shown &&
    state.exec_stack[0] !== undefined &&
    state.exec_stack[2] === undefined
  );
};

const usingOperatorToSolve = () => {
  return (
    !state.result_shown &&
    state.exec_stack[0] !== undefined &&
    state.exec_stack[1] !== undefined &&
    state.exec_stack[2] === undefined
  );
};

const insertOperation = (evt) => {
  clearMessage();
  const operator = evt.currentTarget.textContent;
  if (state.exec_stack[1] === undefined) {
    state.result_shown = true;
    state.decimal = false;
    state.exec_stack[0] = sanitizedDisplay();
  } else if (reusingPreviousResult()) {
    state.decimal = false;
  } else if (usingOperatorToSolve()) {
    state.exec_stack[2] = sanitizedDisplay();
    solve();
  }
  state.exec_stack[1] = operator;
  return;
};

const all_numbers = document.querySelectorAll(".number");
all_numbers.forEach((button) => {
  button.addEventListener("click", insertNumber, false);
});

const clear_button = document.querySelector(".clear");
clear_button.addEventListener("click", clear, false);

const all_operators = document.querySelectorAll(".operation");
all_operators.forEach((button) => {
  button.addEventListener("click", insertOperation, false);
});

const onlyFirstOperandDefined = () => {
  return (
    state.exec_stack[0] !== undefined &&
    state.exec_stack[1] === undefined &&
    state.exec_stack[2] === undefined
  );
};

const firstOperandUndefined = () => {
  return state.exec_stack[0] === undefined;
};

const solveByEqual = () => {
  clearMessage();
  if (onlyFirstOperandDefined()) {
    state.exec_stack[1] = "+";
    state.exec_stack[2] = 0;
  } else if (firstOperandUndefined()) {
    state.exec_stack = [0, "+", 0];
  } else {
    state.exec_stack[2] = sanitizedDisplay();
  }
  solve();
};

const operate_button = document.querySelector(".operate");
operate_button.addEventListener("click", solveByEqual, false);

const insertPeriod = (evt) => {
  clearMessage();
  const period = evt.currentTarget.textContent;
  if (!state.decimal) {
    state.result_shown = false;
    state.decimal = true;
    display.textContent += period;
  }
  return;
};

const period = document.querySelector(".period");
period.addEventListener("click", insertPeriod, false);

const deleteOne = () => {
  if (display.textContent.length){
    const to_delete = display.textContent.charAt(display.textContent.length-1);
    state.decimal = to_delete === "." ? false : state.decimal;
    display.textContent = display.textContent.slice(0, -1);
  }
};

const del = document.querySelector(".delete");
del.addEventListener("click", deleteOne, false);
