const display = document.querySelector(".display");
display.textContent = "this WAS your calculator";

const checkInput = (input) => {
  return typeof input === "number";
};

const add = (a, b) => {
  if (checkInput(a) && checkInput(b)) {
    return a + b;
  }
  return Nan;
};

const subtract = (a, b) => {
  if (checkInput(a) && checkInput(b)) {
    return a - b;
  }
  return Nan;
};

const multiply = (a, b) => {
  if (checkInput(a) && checkInput(b)) {
    return a * b;
  }
  return Nan;
}

const divide = (a, b) => {
  if (checkInput(a) && checkInput(b)) {
    return a / b;
  }
  return Nan;
};

const parse = (input) => {
  return [];
};

// const toArray = (string) => {
//   let result = [];
//   let number = "";
//   for(let i = 0; i < string.length; i++){
//     if(string.charAt(i))
//   }
// };

const solve = (polish_notation) => {
  return 42;
};

const evaluate = (input) => {
  const parsed = parse(input);
  return solve(parsed).toString();
};

const print = (evt) => {
  switch (evt.currentTarget.textContent) {
    case "Del":
      display.textContent = display.textContent.slice(0, -1);
      break;
    case "Clear":
      display.textContent = "";
      break;
    case "=":
      display.textContent = evaluate(display.textContent);
      break;
    default:
      display.textContent += evt.currentTarget.textContent;
      break;
  }
};

const all_buttons = document.querySelectorAll("button");
all_buttons.forEach((button) => {
  button.addEventListener("click", print, false);
});
