class Operation{
    static operationArray = [];
    constructor (operandA = null, operandB = null, operator = null, result = null, previousOperation = null){
        this.operandA = operandA;
        this.operandB = operandB;
        this.operator = operator;
        this.result = result;
        this.previousOperation = previousOperation;
    }
    execute(){
        var result = 0;
        switch (this.operator){
            case "+":
                result = this.add();
                break;
            case "-":
                result = this.subtract();
                break;
            case "x":
                result = this.multiply();
                break;
            case "÷":
                result = this.divide();
                break;
            default:
                result = Error;
        }
        
        this.previousOperation = this.sustainOperation(this.operandA, this.operandB, this.operator, result+"");

        return result+"";
    }

    executeUnary(value, functionSlug){
        var result = 0;
        switch (functionSlug){
            case "%":
                result = value / 100;
                break;
            case "+/-":
                result = -1 * value;
                break;
            default:
                result = Error;
        }
        
        this.previousOperation = this.sustainOperation(value, null, functionSlug, result+"");

        return result+"";
    }

    add(){
        return parseFloat(this.operandA) + parseFloat(this.operandB);
    }

    subtract(){
        return parseFloat(this.operandA) - parseFloat(this.operandB);
    }

    divide(){    
        if(parseFloat(this.operandB) != 0){
        var result = parseFloat(this.operandA) / parseFloat(this.operandB);
        }else var result = Error;
        
        return result;
    }

    multiply(){
        return parseFloat(this.operandA) * parseFloat(this.operandB);
    }

    clear(exempt=[]){
        if(exempt.indexOf('operandA') < 0){
            this.operandA = null;
        }
        if(exempt.indexOf('operandB') < 0){
            this.operandB = null;
        }
        if(exempt.indexOf('operator') < 0){
            this.operator = null;
        }
        if(exempt.indexOf('result') < 0){
            this.result = null;
        }
        
    }

    operatorType(){
        var result ="";
        if(this.operator == "+" || this.operator == "-" || this.operator == "x" || this.operator == "÷"){
            result = "binary";
        }else if(this.operator == "+/-" || this.operator == "%"){
            result = "unary";
        }

        return result;
    }

    isValidOperation(){
        var valid = false;
        if(this.operatorType == "binary" && this.operandA != null && this.operandB != null){
            valid = true;
        }else if(this.operatorType == "unary" && this.operandA != null){
            valid = true;
        }

        return valid;
    }

    toArray(){
        var newArray = [];
        newArray['operandA'] = this.operandA; 
        newArray['operandB'] = this.operandB; 
        newArray['operator'] = this.operator;
        newArray['result'] = this.result;
        return newArray
    }
    toString(){
        var result = "";
        if(this.operatorType() == "binary"){
            result = this.operandA + " " + this.operator + " " + this.operandB
        }else if(this.operatorType() == "unary"){
            if (this.operator == "+/-"){
                result = "-( "+this.operandA + " )";
            }else{
            result = this.operandA + " " + this.operator;
            }
        }
        if(this.result != null){
            result += " = " + this.result
        }
        return result;
    }

    sustainOperation(operandA, operandB = null, operator, result=null){
        return new Operation(operandA, operandB, operator, result)
    }

    addToOperationArray(){
        Operation.operationArray.push(this.previousOperation);
    }    
}

class Display{
    constructor ( displayBoard=null, content = "0", refresh = true){
        this.content = content;
        this.refresh = refresh;
        this.displayBoard = displayBoard;
        if(this.displayBoard){
            this.render();
        }
    }

    addContent(newContent){
        if(this.refresh){
            if(newContent != "0" && newContent != "."){
                this.content = newContent;
                this.refresh = false;
            }else if(newContent == "."){
                this.content = "0.";
                this.refresh = false;
            }
        }else{
            if(newContent == "."){
                if(this.content.indexOf('.') > -1){
                    newContent = '';
                }
            }
            this.content += newContent
        }
    }
    render(){
        var display = document.querySelector(this.displayBoard);
        display.innerText = this.content + "";
    }

    clear(){
        this.refresh = true;
        this.content = "0";
        this.render();
    }

    clearLastCharacter(){
        if(this.content != "0"){
            this.content = this.content.slice(0,-1);
        }
        if(this.content == "" || this.content==""){
            this.content = "0";
            this.refresh = true;
        }
        this.render();
    }
}