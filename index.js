class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clearOnNextAction = false;
        this.clear();
    }

    clear() {
        this.currentOperand = "";
        this.previousOperand = "";
        this.operation = undefined;
        this.clearOnNextAction = false;
    }

    setClearOnNextAction() {
        this.clearOnNextAction = true;
    }

    delete() {
        //clear screen if Del key is clicked after the = key
        if(this.clearOnNextAction) {
            this.clear();
            this.clearOnNextAction = false;
        }

        if(this.currentOperand !== "") {
            //Delete last input character
            this.currentOperand = this.currentOperand.toString().slice(0,-1);
        } else {
            //Make currentOperand the previousOperand and delete the operation, reset previousOperand to
            //an empty string so it will not show up in the calculator window
            this.currentOperand = this.previousOperand;
            this.previousOperand = "";
            this.operation = undefined;
        }
        
    }

    appendNumber(number) {
        //clear screen if any number or decimal key is clicked after the = key
        if(this.clearOnNextAction) {
            this.clear();
            this.clearOnNextAction = false;
        }

        if (number === "." && this.currentOperand.includes(".")) {
            //only allows one decimal to be added
            return;
        }

        //convert to string so the strings can be appended
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        //DO NOT clear screen if an operation key is pressed after the = key is pressed
        if(this.clearOnNextAction) {
            this.clearOnNextAction = false;
        }

        if (this.currentOperand === "") {
            //an operation cannot be executed if there is no currentOperand
            return;
        }

        if (this.previousOperand !== "") {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = "";
    }

    compute() {
        let computation = 0;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) {
            //return if either previousOperand or currentOperand is Not a Number
            return;
        }

        switch(this.operation) {
            case "+":
                computation = current + prev;
                break;
            case "-":
                computation = prev - current;
                break;
            case "*":
                computation = current * prev;
                break;
            case "/":
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = "";
    }

    getDisplayNumber(number) {
        const convertNumberToString = number.toString();
        //split string into two parts: one for the integers, one for the decimals
        //grab integer portion
        const integerDigits = parseFloat(convertNumberToString.split(".")[0]);
        //grab decimal portion
        const decimalDigits = convertNumberToString.split(".")[1];

        let integerDisplay = "";

        if (isNaN(integerDigits)) {
            //display nothing
            integerDisplay = "";
        } else {
            //display integerDigits with no decimal places. "en" allows for automatic commas after more than 3 digits
            integerDisplay = integerDigits.toLocaleString("en", {maximumFractionDigits: 0});
        }

        if (decimalDigits != null) {
            //return integers and decimals as one number
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            //return just integers since there are no decimals
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);

        if(this.operation != null) {
            //Display previousOperand and operation sign
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            //Display previousOperand without operation sign if none have been selected yet
            this.previousOperandTextElement.innerText = "";
        }
    }
}


const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector("[data-previous-operand]");
const currentOperandTextElement = document.querySelector("[data-current-operand]");

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

allClearButton.addEventListener("click", () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener("click", () => {
    calculator.delete();
    calculator.updateDisplay();
});

equalsButton.addEventListener("click", () => {
    calculator.compute();
    calculator.setClearOnNextAction();
    calculator.updateDisplay();
});


//Dynamic copyright year for footer
let date = new Date();
let currentYear = date.getFullYear();

const copyrightYear = document.querySelector("[data-copyright-year]");
copyrightYear.innerText = `Copyright ${currentYear}`;

