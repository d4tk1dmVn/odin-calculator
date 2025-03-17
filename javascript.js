const display = document.querySelector(".display");
display.textContent = "this WAS your calculator";
let exec_stack = [undefined, undefined, undefined];

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

const validOperation = (exec_stack) => {
  return (
    exec_stack.length === 3 &&
    typeof exec_stack[0] === "number" &&
    exec_stack[1] === "number" &&
    "*+/-".includes(exec_stack[2])
  );
};

const operate = (exec_stack) => {
  if (!validOperation(exec_stack)) {
    return "SYNTAX ERROR";
  }
  const a = exec_stack[0];
  const b = exec_stack[1];
  const operand = exec_stack[2];
  switch (operand) {
    case "*":
      exec_stack[0] = multiply(a, b);
      break;
    case "+":
      exec_stack[0] = add(a, b);
      break;
    case "-":
      exec_stack[0] = subtract(a, b);
      break;
    case "/":
      exec_stack[0] = divide(a, b);
      break;
    default:
      exec_stack[0] = NaN;
      break;
  }
  return exec_stack[0];
};

const print = (evt) => {
  switch (evt.currentTarget.textContent) {
    case "Del":
      display.textContent = display.textContent.slice(0, -1);
      break;
    case "Clear":
      display.textContent = "";
      exec_stack = [undefined, undefined, undefined];
      break;
    case "=":
      exec_stack[1] = Number(display.textContent);
      display.textContent = operate(exec_stack).toString();
      break;
    default:
      if ("+*/-".includes(evt.currentTarget.textContent)) {
        // WHAT HAPPENS IF WE ARE SKIPPING THE USE OF =?
        exec_stack[0] = Number(display.textContent);
        exec_stack[2] = evt.currentTarget.textContent;
      } else if (exec_stack[2] !== undefined) {
        display.textContent = "" + evt.currentTarget.textContent;
      } else {
        display.textContent += evt.currentTarget.textContent;
      }
      break;
  }
};

const all_buttons = document.querySelectorAll("button");
all_buttons.forEach((button) => {
  button.addEventListener("click", print, false);
});
