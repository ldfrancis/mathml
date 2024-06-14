String.prototype.format = function() {
    let args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
        ;
    });
};

// Systems of Linear Equations
export class SysLinearEqnsMat extends HTMLElement{
    
    constructor(){
        super();
        this.name = "Systems of Linear Equations and Matrices";
        this.state = {
            is2D: true,
            coeffs2d: {
                "x1-1": 4,
                "x2-1": 4,
                "b1": 5,
                "x1-2": 2,
                "x2-2": -4,
                "b2": 1
            },
            solution2d: "Line Intersection",
        }
    }

    async connectedCallback(){
        const header = document.createElement("div");
        const sysLinEqnButton = document.createElement("div");
        const matricesButton = document.createElement("div");
        const contentBlock = document.createElement("div");
        let contentChoice = null;
        const thisElement = this;

        header.className = "main-content-choices";
        contentBlock.className = "main-content-block";
        sysLinEqnButton.className = "main-content-choice";
        matricesButton.className = "main-content-choice";
        sysLinEqnButton.textContent = "System of Linear Equations";
        matricesButton.textContent = "Matrices";
        contentChoice = sysLinEqnButton;

        sysLinEqnButton.style.width = "200px";
        sysLinEqnButton.style.backgroundColor = "#cdd";
        header.append(sysLinEqnButton, matricesButton);

        header.addEventListener("click", (event)=>{

            event.preventDefault();
            if(event.target.className == "main-content-choice"){
                if (contentChoice != null){
                    contentChoice.style.backgroundColor = null;
                }
                event.target.style.backgroundColor = "#cdd";
                if(event.target.textContent == "System of Linear Equations" && contentChoice.textContent != event.target.textContent){
                    this.renderSysLinEqns(contentBlock);
                }
                if(event.target.textContent == "Matrices" && contentChoice.textContent != event.target.textContent){
                    this.renderMatrices(contentBlock);
                }
                contentChoice = event.target;
            }
        })



        this.appendChild(header);
        await this.renderSysLinEqns(contentBlock);

    }

    async getVisualChoicesMarkUp(){
        const result = await fetch("./components/topics/SysLinearEqnMat/visualChoices.html");
        const markup = await result.text()
        return markup
    }

    async get2DEquationsMarkup(){
        const result = await fetch("/components/topics/SysLinearEqnMat/equations2D.html");
        const markup   = await result.text();
        return markup
    }

    async get3DEquationsMarkup(){
        const result = await fetch("/components/topics/SysLinearEqnMat/equations3D.html");
        const markup   = await result.text();
        return markup
    }

    renderMatrices(contentBlock){
        contentBlock.innerHTML = "";
        this.appendChild(contentBlock);
    }

    async renderSysLinEqns(contentBlock){
        const visualChoices = document.createElement("div");
        const content = document.createElement("div");
        const header = document.createElement("h3");
        const markup2d = await this.get2DEquationsMarkup();
        const markup3d = await this.get3DEquationsMarkup();
        const choices = await this.getVisualChoicesMarkUp()
        const controls = document.createElement("div");
        const canvas2d = document.createElement("canvas");
        const canvas3d = document.createElement("canvas");
        const thisElement = this;

        // canvas 2d
        const width = 600;
        const height = 600;
        canvas2d.width = width;
        canvas2d.height = height;
        const context2d = canvas2d.getContext("2d");

        //
        const canvas1 = document.createElement("canvas");
        const canvas2 = document.createElement("canvas");
        const container = document.createElement("div");
        const context1 = canvas1.getContext("2d");
        const context2 = canvas2.getContext("2d");
        canvas1.width = 400;
        canvas1.height = 600;
        canvas2.width = 600;
        canvas2.height = 600;
        canvas1.className = "linear-2d-right";
        container.className = "linear-2d-container";
        container.append(canvas1, canvas2);

        this.linearContainer2d = container;
        this.lineContainer2d = canvas2d;
        this.linearContainer2d_context1 = context1;
        this.linearContainer2d_context2 = context2;
        this.context2d = context2d;
        
        //

        header.textContent = "System of Linear Equations";
        visualChoices.innerHTML = choices;
        content.innerHTML = markup2d;

        controls.append(visualChoices, content)
        contentBlock.append(controls, canvas2d);
        this.appendChild(contentBlock);
        this.renderCanvas2d(context2d);

        const radios = document.querySelectorAll('input[name="dimension"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (event) => {
                const lastElement = contentBlock.lastElementChild;
                if(event.target.value == "2d"){
                    content.innerHTML = markup2d;
                    const child = thisElement.state.solution2d == "Line Intersection" ? canvas2d : container;
                    contentBlock.replaceChild(child, lastElement);
                    thisElement.addListenersFor2dInputs(context2d);
                    thisElement.addListenersfor2dSolutions(context2d);
                }
                else{
                    content.innerHTML = markup3d;
                    contentBlock.replaceChild(canvas3d, lastElement);
                }
                
            });
        });

        // solution choices
        const elements = this.querySelectorAll(".solution-choice");
        elements.forEach((elem)=>{
            if(elem.textContent == thisElement.state.solution2d){
                elem.style.backgroundColor = "#cdd";
            }
        });

        thisElement.addListenersFor2dInputs(context2d);
        thisElement.addListenersfor2dSolutions(context2d);
        // thisElement.addListenersFor2dSolution();
        this.contentBlock = contentBlock;
    }

    addListenersfor2dSolutions(context){
        const thisElement = this;
        const elements = this.querySelectorAll(".solution-choice");
        elements.forEach((elem)=>{
            elem.addEventListener("click", handleClick);
        })

        function handleClick(event){
            elements.forEach(e => {e.style.backgroundColor = null});
            event.target.style.backgroundColor = "#cdd";
            thisElement.state.solution2d = event.target.textContent;
            
            // change lower canvas
            const lastElement = thisElement.contentBlock.lastElementChild;
            const child = thisElement.state.solution2d == "Line Intersection" ? thisElement.lineContainer2d : thisElement.linearContainer2d;
            thisElement.contentBlock.replaceChild(child, lastElement);

            thisElement.renderCanvas2d(context);
        }   
    }

    addListenersFor2dInputs(context){
        const dims = [[1,1], [1,2],[2,1],[2,2]];
        const thisElement = this;

        dims.forEach((elem)=>{
            const inputElem = thisElement.querySelector(`#x${elem[0]}-${elem[1]}`);
            inputElem.value = thisElement.state.coeffs2d[`x${elem[0]}-${elem[1]}`];
            inputElem.addEventListener("input", handleInput);
            if (elem[1] == 2){
                inputElem.style.color = "red";
            }
            else{
                inputElem.style.color = "blue";
            }
            if(elem[0]==1 && elem[1]==2){
                const inputElem1 = thisElement.querySelector(`#b${elem[0]}`);
                const inputElem2 = thisElement.querySelector(`#b${elem[1]}`);
                inputElem1.style.color = "blue";
                inputElem2.style.color = "red";
                inputElem1.value = thisElement.state.coeffs2d[`b${elem[0]}`];
                inputElem2.value = thisElement.state.coeffs2d[`b${elem[1]}`];
                inputElem1.addEventListener("input", handleInput);
                inputElem2.addEventListener("input", handleInput);
            }
        })
        
        
        function handleInput(event){
            thisElement.state.coeffs2d[event.target.id] = event.target.value;
            thisElement.renderCanvas2d(context);

        }

    }

  
    renderCanvas2d(context){
        console.log(this.state.solution2d);
        if (this.state.is2D && this.state.solution2d == "Line Intersection"){
            this.renderLineIntersection(context);
        }
        else{
            this.renderLinearCombination2d(context);
        }
    }

    renderLinearCombination2d(context){
        const ctx1 = this.linearContainer2d_context1;
        const ctx2 = this.linearContainer2d_context2;
        // ctx1.fillStyle = "blue";
        // ctx1.fillRect(0,0, 400, 400);

        // ctx2.fillStyle = "red";
        // ctx2.fillRect(0,0, 400, 400);

        // console.log(ctx2);
        
    }

    renderLineIntersection(context){
        const width = context.canvas.width;
        const height = context.canvas.height;

        context.fillStyle = "#fff";
        context.fillRect(0,0,width,height);

        const unit = 100;
        let vert = height;
        let hori = width;
        context.strokeStyle = "rgba(0,0,0,0.2)";
        context.lineWidth = 0.5;
        const x = width/unit;
        const x_min = -x;
        const x_max = x;
        const y = height/unit;
        const y_min = -y;
        const y_max = y;
        const x1_1 = this.state.coeffs2d["x1-1"];
        const x2_1 = this.state.coeffs2d["x2-1"];
        const b1 = this.state.coeffs2d["b1"];
        const x1_2 = this.state.coeffs2d["x1-2"];
        const x2_2 = this.state.coeffs2d["x2-2"];
        const b2 = this.state.coeffs2d["b2"];
        let midWidth = null;
        let midHeight = null;

        // GRID        
        context.beginPath();
        while(vert > 0){
            context.moveTo(0, vert);
            context.lineTo(width, vert);
            vert -= unit;
            if(vert >= height/2){
                midHeight = vert;
            }
        }

        while(hori > 0){
            context.moveTo(hori, 0);
            context.lineTo(hori, height);
            hori -= unit;
            if(hori >= width/2){
                midWidth = hori;
            }
        }
        context.stroke();

        // Center Line (Cross)
        context.strokeStyle = "rgba(0,0,0,0.5)";
        context.lineWidth = 2;
        context.save();
        context.translate(midWidth, midHeight);
        context.scale(1, -1);
        context.beginPath();
        context.moveTo(-x*unit,0);
        context.lineTo(x*unit,0);
        
        context.moveTo(0,-y*unit);
        context.lineTo(0,y*unit);
        context.stroke();

        // Line 1 
        context.beginPath();
        context.strokeStyle = "#00f";
        if(x1_1 != 0 && x2_1 != 0){
            context.moveTo(x_min*unit, ((b1-x1_1*x_min)/x2_1)*unit);
            context.lineTo(x_max*unit, ((b1-x1_1*x_max)/x2_1)*unit);
        }
        else if(x1_1 != 0 && x2_1 == 0){
            context.moveTo((b1/x1_1)*unit, y_min*unit);
            context.lineTo((b1/x1_1)*unit, y_max*unit);
        }
        else if(x1_1 == 0 && x2_1 != 0){
            context.moveTo(x_min*unit, (b1/x2_1)*unit);
            context.lineTo(x_max*unit, (b1/x2_1)*unit);
        }
        context.stroke();

        // Line 2
        context.beginPath();
        context.strokeStyle = "#f00";
        if(x1_2 != 0 && x2_2 != 0){
            context.moveTo(x_min*unit, ((b2-x1_2*x_min)/x2_2)*unit);
            context.lineTo(x_max*unit, ((b2-x1_2*x_max)/x2_2)*unit);
        }
        else if(x1_2 != 0 && x2_2 == 0){
            context.moveTo((b2/x1_2)*unit, y_min*unit);
            context.lineTo((b2/x1_2)*unit, y_max*unit);
        }
        else if(x1_2 == 0 && x2_2 != 0){
            context.moveTo(x_min*unit, (b2/x2_2)*unit);
            context.lineTo(x_max*unit, (b2/x2_2)*unit);
        }
        context.stroke();

        // intersection
        // x2 = (b-c1x1)/c2
        // x1 = 
        const x1_res = (x2_1*b2 - x2_2*b1)/(x2_1*x1_2 - x1_1*x2_2);
        const x2_res = (b1 - x1_1*x1_res)/x2_1;
        context.save();
        context.beginPath();
        context.fillStyle = "black";
        context.arc(x1_res*unit, x2_res*unit, 5, 0, Math.PI*2);
        context.fill();
        context.restore();
        context.save();
        context.scale(1,-1);
        context.font = "18px Arial";
        context.fillStyle = "black";
        context.fillText(`(${x1_res.toFixed(2)}, ${x2_res.toFixed(2)})`, x1_res*unit, -x2_res*unit);
        
        context.font = "20px Arial";
        let cordWidth = (midWidth-context.measureText("x1").width)-2;
        context.fillText("x", cordWidth, 15);
        context.font = "15px Arial";
        context.fillText("1", cordWidth+context.measureText("x").width, 18);
        
        context.font = "20px Arial";
        cordWidth = (-context.measureText("x2").width)-2;
        context.fillText("x", cordWidth, -midHeight+18);
        context.font = "15px Arial";
        context.fillText("2", cordWidth+context.measureText("x").width+2, -midHeight+21);

        context.restore();

        // Legend Text
        context.restore();
        context.save();
    
        context.fillStyle = 'blue';
        let eqn = x2_1 >= 0 ? `${x1_1}x1 + ${x2_1}x2 = ${b1}` : `${x1_1}x1 - ${x2_1}x2 = ${b1}`;
        let part2 = x2_1 >= 0 ? ` + ${x2_1}x` : `  - ${-x2_1}x`
        writeEquation(context, eqn,    `${x1_1}x`, part2, ` = ${b1}`, 20);
        context.fillStyle = "red";
        eqn = x2_2 >= 0 ? `${x1_2}x1 + ${x2_2}x2 = ${b2}` : `${x1_2}x1 - ${x2_2}x2 = ${b2}`;
        part2 = x2_2 >= 0 ? ` + ${x2_2}x` : `  - ${-x2_2}x`
        writeEquation(context, eqn,    `${x1_2}x`, part2, ` = ${b2}`, 40);
        context.restore();
       
        function writeEquation(context, eqn, part1, part2, part3, h=20){
            context.font = '18px Arial';
            let start_width = width - (context.measureText(eqn).width+10);

            const eqn2 = "2x1 - 4x2 = 1";
            context.save();
            context.fillText(part1, start_width, h);
            start_width += context.measureText(part1).width;
            context.font = "15px Arial";
            context.fillText("1", start_width, h+5);
            start_width += context.measureText("1").width;
            context.restore();
            context.fillText(part2, start_width, h);
            start_width += context.measureText(part2).width;
            context.save();
            context.font = "15px Arial";
            context.fillText("2", start_width, h+5);
            start_width += context.measureText("2").width;
            context.restore();
            context.fillText(part3, start_width, h);

        }
        
    }

    renderCanvas3d(canvas3d){

    }



   

}

customElements.define("mf-syslineareqnsmat", SysLinearEqnsMat);