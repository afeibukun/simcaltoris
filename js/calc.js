let calculatorOperation = new Operation();
let calculatorDisplay = new Display('.calc-display');
let calculatorHistory = [];

let currentTheme = initializeTheme();
setActiveIndicator();

let latestHistoryDisplay = document.querySelector('.calc-latest-history-display');
let fullHistoryDisplay = document.querySelector('.calc-history-display ul');
let historyContainer = document.querySelector('.calc-history-display-container');

var btnToggleHistoryDisplay = document.querySelector('.history-expand-toggler');
btnToggleHistoryDisplay.addEventListener("click", toggleHistoryDisplay);

var btnNavigationMenu = document.querySelector('.btn-menu-navigation');
btnNavigationMenu.addEventListener("click", toggleMenu);

var btnSubMenu = document.querySelector('.has-sub-menu>a');
btnSubMenu.addEventListener("click", toggleSubMenu);

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

var themeSelectors = document.querySelectorAll('.btn-select-theme');
themeSelectors.forEach(function(themeSelector){
    themeSelector.addEventListener("click", selectTheme);
});

var btnSaveTheme = document.querySelector(".btn-save-theme");
btnSaveTheme.addEventListener("click", saveTheme);

document.querySelector(".btn-download-history").addEventListener("click", historyToFile);

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

function toggleMenu(){
    document.querySelector('.calculator-menu').classList.toggle("show-menu");
}

function toggleSubMenu(){
    document.querySelector('.has-sub-menu').classList.toggle("show-sub-menu");
}

function initializeTheme(){
    var bodyElement = document.querySelector('body');
    var currentTheme = "default";
    if(typeof(Storage) !== "undefined"){
        currentTheme = localStorage.getItem("current_theme");
        if(currentTheme != null){
            bodyElement.className = "";
            bodyElement.classList.add(currentTheme+"-theme");
        }else{
            bodyElement.classList.add("default-theme");
        }
    }
    return currentTheme;
}

function selectTheme(e){
    if(e.target.classList.contains("select-theme-light")){
        currentTheme = "default";   
    }else if(e.target.classList.contains("select-theme-dark")){
        currentTheme = "dark"
    }

    setActiveIndicator();
    var bodyElement = document.querySelector('body');
    bodyElement.className = "";
    bodyElement.classList.add(currentTheme+"-theme");
}

function saveTheme(){
    localStorage.setItem("current_theme", currentTheme);
    btnSaveTheme.classList.add("theme-saved");
    setTimeout(() => btnSaveTheme.classList.remove("theme-saved"), 5000);
}

function setActiveIndicator(){
    document.querySelectorAll('.theme-selector-indicator').forEach(function(selectorIndicator){
        selectorIndicator.classList.remove("active");
    });

    if(currentTheme == "dark"){
        document.querySelector('.theme-selector-indicator.theme-dark').classList.add("active");
    }else if(currentTheme == "light" || currentTheme == "default"){
        document.querySelector('.theme-selector-indicator.theme-light').classList.add("active");
    }
}

function prepareArrayForFile(){
    var content = "";
    var count= 0;
    Operation.operationArray.forEach(function(AnOperation){
        count++;
        content +=  "Operation " + count +"\n";
        content += AnOperation.toString() + "\n";
        content += "\n";
    });

    return content;
}
function historyToFile(){
    var content = prepareArrayForFile();
    var filename = "downloadHistory_simCaltoris_"+Date.now()+".txt";
    var link = document.createElement("a");
    link.setAttribute("href", 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    link.setAttribute("download", filename);
    document.body.appendChild(link); // Required for FF
    link.click(); 
    // uri = "data:application/octet-stream," + encodeURIComponent(content);
    // location.href= uri;
}