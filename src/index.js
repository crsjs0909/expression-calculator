function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    return new ExpressionParser(expr).eval();
}


class ExpressionParser {
    constructor(str) {
        this.src = str.replace(/ /g, '');
        this.ptr = 0;
    }


    eval() {
        let init = [];
        init.push(this.nextOperand());
        while (this.hasNext()) {
            init.push(this.nextOperator());
            init.push(this.nextOperand());
        }
        let genFirst = [];
        let fPtr = 1;

        genFirst.push(init[0]);
        while (fPtr < init.length) {
            let token = init[fPtr];
            if (token === "*" || token === "/") {
                let lOp = genFirst[genFirst.length - 1];
                let rOp = init[++fPtr];
                let res;
                switch (token) {
                    case "*":
                        res = lOp * rOp;
                        break;
                    case "/":
                        if (rOp===0){
                            throw "TypeError: Devision by zero."
                        }
                        res = lOp / rOp;
                        break;
                }
                genFirst[genFirst.length - 1] = res;
                fPtr++;
            }
            else {
                genFirst.push(init[fPtr++]);
            }
        }
        let result;
        let sPtr = 1;
        result = genFirst[0];
        while (sPtr < genFirst.length) {
            let operator = genFirst[sPtr++];
            let rOp = genFirst[sPtr++];
            //
            let tmp=result;
            //
            switch (operator) {
                case "+":
                    result = result + rOp;
                    break;
                case "-":
                    result = result - rOp;
                    break;
            }
        }
        return result;
    }

    nextOperator() {
        let op = this.src.charAt(this.ptr++);
        if (!this.isOperator(op)) {
            if (this.isBracket(op)) {
                throw "ExpressionError: Brackets must be paired";
            }
            else {
                throw "NOT OPERATOR: " + op;
            }
        }
        return op;
    }

    nextOperand() {
        let sign = 1;
        let firstChar = this.src.charAt(this.ptr);
        if (firstChar === "-") {
            sign = -1;
            this.ptr++;
            firstChar = this.src.charAt(this.ptr)
        } else if (firstChar === "+") {
            sign = 1;
            this.ptr++;
            firstChar = this.src.charAt(this.ptr)
        }
        if (firstChar === ")") {
            throw "ExpressionError: Brackets must be paired";
        }
        else if (firstChar === "(") {
            let depth = 1;
            this.ptr++;
            let start = this.ptr;
            while (this.ptr < this.src.length && depth > 0) {
                if (this.src.charAt(this.ptr) === "(") {
                    depth++;
                }
                else if (this.src.charAt(this.ptr) === ")") {
                    depth--;
                }
                this.ptr++;
            }
            if (depth > 0) {
                throw "ExpressionError: Brackets must be paired";
            }
            let nestedExpression = this.src.substr(start, this.ptr - start - 1);
            return sign * new ExpressionParser(nestedExpression).eval();
        }
        else {
            let start = this.ptr;
            while (this.isDigit(this.src.charAt(this.ptr))) {
                this.ptr++
            }
            return parseInt(this.src.substr(start, this.ptr));
        }

    }

    isDigit(ch) {
        return ch >= "0" && ch <="9";
    }

    isOperator(ch) {
        return ch === "+"
            || ch === "-"
            || ch === "/"
            || ch === "*";
    }

    isBracket(ch){
        return ch === ")" || ch === "(";
    }

    hasNext() {
        return this.ptr < this.src.length;
    }
}


module.exports = {
    expressionCalculator
}