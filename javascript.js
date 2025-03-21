const display = document.querySelector(".display");
display.textContent = "0";

const divideByZeroError = "DON'T YOU DIVIDE BY ZERO";

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
  state.message_shown = false;
  state.decimal = false;
  state.result_shown = true;
  state.exec_stack = [undefined, undefined, undefined];
};

const clearMessage = () => {
  if (state.message_shown) {
    clear();
  }
};

const insertNumber = (number) => {
  clearMessage();
  // const number = evt.currentTarget.textContent;
  if (state.result_shown) {
    // SHOW RESULT != EXPECTING PARTICULAR OPERAND
    // notice that typing after getting a result
    // DOESN'T CLEAR THE STACK, and therefore
    // the "chain" doesn't stop when it should
    // using clear() here get's rid of ALL THE STATE
    // so it's pointless
    // therefore, we gotta differentiate SHOWING A RESULT
    // from EXPECTING A PARTICULAR INPUT
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
    showMessage(divideByZeroError);
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

const insertOperation = (operator) => {
  clearMessage();
  // const operator = evt.currentTarget.textContent;
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

// const numberButtons = document.querySelectorAll(".number");
// numberButtons.forEach((button) => {
//   button.addEventListener("click", insertNumber, false);
// });
//
// const clearButton = document.querySelector(".clear");
// clearButton.addEventListener("click", clear, false);
//
// const operationButtons = document.querySelectorAll(".operation");
// operationButtons.forEach((button) => {
//   button.addEventListener("click", insertOperation, false);
// });

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
  } else if (firstOperandUndefined() || state.result_shown) {
    state.exec_stack = [sanitizedDisplay(), "+", 0];
  } else {
    state.exec_stack[2] = sanitizedDisplay();
  }
  solve();
};

// const equalButton = document.querySelector(".operate");
// equalButton.addEventListener("click", solveByEqual, false);

const insertPeriod = () => {
  clearMessage();
  // const period = evt.currentTarget.textContent;
  if (!state.decimal) {
    state.result_shown = false;
    state.decimal = true;
    display.textContent += ".";
  }
  return;
};

// const period = document.querySelector(".period");
// period.addEventListener("click", insertPeriod, false);

const deleteOne = () => {
  if (display.textContent.length) {
    const to_delete = display.textContent.charAt(
      display.textContent.length - 1,
    );
    state.decimal = to_delete === "." ? false : state.decimal;
    display.textContent = display.textContent.slice(0, -1);
  }
};

// const del = document.querySelector(".delete");
// del.addEventListener("click", deleteOne, false);

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
