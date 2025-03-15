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

const shuntingYard = (array) => {
  // let stack = [];
  // let result = [];
  // for (let i = 0; i < array.length ; i++){
  //   const entry = array[i];
  //   if (typeof entry === "number"){
  //     result.push(entry)
  //   } else if ("+/*-".includes)
  // }
  // return result
  return array
};

const toArray = (string) => {
  let result = [];
  let number = "";
  for(let i = 0; i < string.length; i++){
    if("+/*-".includes(string.charAt(i))){
      result.push(Number(number));
      result.push(string.charAt(i));
      number = "";
    } else {
      number += string.charAt(i);
    }
  }
  result.push(number);
  return result;
};

const solve = (polish_notation) => {
  return polish_notation;
};

const evaluate = (input) => {
  const array = toArray(input);
  const polish_notation = shuntingYard(array);
  return solve(polish_notation).toString();
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
