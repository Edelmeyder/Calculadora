// This Map will hold the buttons for ease of access
const btns = new Map();
for (let btn of document.getElementsByClassName("btn")) {
	btns.set(btn.id, btn);
}

const display = document.getElementById("res");

// assign event handlers for each button
for (let i = 0; i < 10; i++) {
	btns.get(`${i}`).onclick = numFunc(`${i}`);
}
btns.get("dot").onclick = dotFunc;
btns.get("sum").onclick = operatorFunc("+");
btns.get("sub").onclick = operatorFunc("-");
btns.get("mul").onclick = operatorFunc("*");
btns.get("div").onclick = operatorFunc("/");
btns.get("equ").onclick = equals;
btns.get("clr").onclick = clear;
btns.get("del").onclick = del;

// string variables for the input
let operator1 = "",
	operator2 = "",
	operation = "";

// variables used to decide with how many decimal places to show the results
let dot = false,
	op1Precision = 0,
	op2Precision = 0,
	precision = 0;

let result = undefined;

function numFunc(num) {
	return () => {
		if (result !== undefined) {
			result = undefined;
		}
		if (operation === "") {
			operator1 += num;
			if (dot) {
				op1Precision++;
			}
		} else {
			operator2 += num;
			if (dot) {
				op2Precision++;
			}
		}
		updateDiplay();
	};
}

function operatorFunc(operator) {
	return () => {
		// this if handles when an operation is made with more than 2 operands
		if (operation !== "") {
			equals();
			operator1 = formatResult();
			op1Precision = precision;
			result = undefined;
		}
		operation = operator;
		dot = false;
		updateDiplay();
	};
}

function equals() {
	switch (operation) {
		case "":
			result = operator1 === "" ? 0 : parseFloat(operator1);
			break;
		case "+":
			result = parseFloat(operator1) + parseFloat(operator2);
			break;
		case "-":
			result = parseFloat(operator1) - parseFloat(operator2);
			break;
		case "*":
			result = parseFloat(operator1) * parseFloat(operator2);
			break;
		case "/":
			result =
				parseFloat(operator2) === 0
					? NaN // prevents the erroneous 'infinite' value as a result
					: parseFloat(operator1) / parseFloat(operator2);
			// division results are shown with at least 5 decimal places
			op2Precision = op2Precision > 5 ? op2Precision : 5;
			break;
	}
	// resets all variables after the operation
	updateDiplay();
	operator1 = "";
	op1Precision = 0;
	operator2 = "";
	op2Precision = 0;
	operation = "";
	dot = false;
}

function clear() {
	operator1 = "";
	op1Precision = 0;
	operator2 = "";
	op2Precision = 0;
	operation = "";
	result = undefined;
	dot = false;
	updateDiplay();
}

function dotFunc() {
	dot = true;
	if (operation === "") {
		operator1 += ".";
	} else {
		operator2 += ".";
	}
	updateDiplay();
}

function del() {
	if (result !== undefined) {
		clear();
		return;
	}
	if (operation === "") {
		if (dot) {
			if (op1Precision === 0) {
				dot = false;
			} else {
				op1Precision--;
			}
		}
		operator1 = operator1.slice(0, -1);
	} else if (operator2 === "") {
		operation = "";
	} else {
		if (dot) {
			if (op2Precision === 0) {
				dot = false;
			} else {
				op2Precision--;
			}
		}
		operator2 = operator2.slice(0, -1);
	}
	updateDiplay();
}

function updateDiplay() {
	if (result !== undefined) {
		display.innerHTML = formatResult();
	} else {
		display.innerHTML = operator1 + operation + operator2;
	}
}

// this function formats the result to be shown on the display
function formatResult() {
	precision = op1Precision > op2Precision ? op1Precision : op2Precision;
	if (precision === 0) {
		return result;
	}
	return new Intl.NumberFormat("en-US", {
		style: "decimal",
		minimumFractionDigits: precision,
		maximumFractionDigits: precision,
	}).format(result);
}
