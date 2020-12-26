let calculatorOperation = new Operation();
let calculatorDisplay = new Display('.calc-display');
let calculatorHistory = [];

let latestHistoryDisplay = document.querySelector('.calc-latest-history-display');
let fullHistoryDisplay = document.querySelector('.calc-history-display ul');
let historyContainer = document.querySelector('.calc-history-display-container');

var btnToggleHistoryDisplay = document.querySelector('.history-expand-toggler');
btnToggleHistoryDisplay.addEventListener("click", toggleHistoryDisplay);

var numericElementList = document.querySelectorAll('.btn-numeric-element')
numericElementList.forEach(function(numericElement){
    numericElement.addEventListener("click", handleNumber);
})

var btnClearScreen = document.querySelector(".btn-clear-screen");
btnClearScreen.addEventListener("click", clearDisplay);

var btnBinaryOperatorList = document.querySelectorAll('.btn-binary-operator')
btnBinaryOperatorList.forEach(function(btnOperator){
    btnOperator.addEventListener("click", handleBinaryOperator);
})

var btnUnaryOperatorList = document.querySelectorAll('.btn-unary-operator')
btnUnaryOperatorList.forEach(function(btnOperator){
    btnOperator.addEventListener("click", handleUnaryOperator);
})

var btnEquals = document.querySelector(".btn-equals");
btnEquals.addEventListener("click", handleEqualsButton);

var btnClearLastCharacter = document.querySelector(".btn-clear-last-character");
btnClearLastCharacter.addEventListener("click", clearLastCharacter);

function handleNumber(e){
    calculatorDisplay.addContent(e.target.innerText);
    calculatorDisplay.render();
}

function clearDisplay(){
    calculatorDisplay.clear();
    calculatorOperation.clear();
}

function clearLastCharacter(){
    calculatorDisplay.clearLastCharacter();
}

function handleBinaryOperator(e){
    if(calculatorOperation.operandA == null){
        calculatorOperation.operandA = calculatorDisplay.content;
    }else{
        calculatorExecutor();
        calculatorOperation.operandA = calculatorOperation.previousOperation.result;
    }
    calculatorOperation.operator = e.target.innerText;
    calculatorDisplay.refresh = true;
}

function handleUnaryOperator(e){
    unaryResult = calculatorOperation.executeUnary(calculatorDisplay.content, e.target.innerText);
    calculatorDisplay.content = unaryResult;
    calculatorDisplay.render();
    renderCalculatorHistory();
    calculatorOperation.operandA = calculatorOperation.previousOperation.result;
    calculatorDisplay.refresh = true;
}


function handleEqualsButton(){
    calculatorExecutor();
    calculatorDisplay.refresh = true;
}

function calculatorExecutor(){
    if(calculatorOperation.operandA != null && calculatorOperation.operator != null){
        calculatorOperation.operandB = calculatorDisplay.content;
        result = calculatorOperation.execute();
        calculatorDisplay.content = result;
        calculatorDisplay.render();
        calculatorOperation.clear();
        renderCalculatorHistory()
    }
}

function renderCalculatorHistory(){
    calculatorOperation.addToOperationArray();
    latestHistoryDisplay.innerText = calculatorOperation.previousOperation.toString();
    var newListItem = "<li>"+calculatorOperation.previousOperation.toString()+"</li>";
    fullHistoryDisplay.innerHTML = newListItem + fullHistoryDisplay.innerHTML   
}

function toggleHistoryDisplay(){
    historyContainer.classList.toggle("show-full-history");
}