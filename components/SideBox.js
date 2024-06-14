import { isTouchEvent } from "../utils/events.js";
import fetchData from "../utils/data.js";

const sideBoxContent = `

`;

export class SideBox extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        let isResizing = false;
        let sideBoxOriginalWidth, sideBoxBoundingBox;

        this.className = "side-box";
        this.style.display = "block";
        this.innerHTML = sideBoxContent;
        const sideBoxObject = this;

        // const side_box_resizer = this.querySelector(".side-box-resizer");
        // const side_box_resizer_bar = this.querySelector(".side-box-resizer-bar");
        const sideBoxContentElement = this.querySelector(".side-box-content");
        const topicSelectEvent = new CustomEvent("topicSelectEvent", {});
        
        fetchData().then((result)=>{
            const elements = result.map(element => {
                const name = Object.keys(element)[0];
                const elem = document.createElement("div");
                elem.className = "topic";
                elem.textContent = name;
                return elem
            })
            elements.forEach(element => {
                
                element.addEventListener("click", (event)=>{
                    if(!(state.sideBox.topic === null)){
                        state.sideBox.topic.style.backgroundColor = null;
                    }
                    element.style.backgroundColor = "#cdd";
                    state.sideBox.topic = element;
                    window.dispatchEvent(topicSelectEvent);

                    // if
                })
                
                sideBoxObject.appendChild(element);
            });
            
        });

        

        window.addEventListener("toolBarToggleEvent", toggleSideBox);
        // side_box_resizer.addEventListener("mousedown", startSideBoxResize)
        // side_box_resizer.addEventListener("touchstart", startSideBoxResize)

        // sideBoxBoundingBox = state.sideBox.boundingBox;

        function toggleSideBox(event){
            event.preventDefault();
            if(!state.toolBar.isTopicsExpanded){
                sideBoxObject.style.display = "none";
            }
            else{
                sideBoxObject.style.display = "block";
            }   
        }

        // function startSideBoxResize(event){
        //     isResizing = true;
        //     sideBoxOriginalWidth = sideBoxObject.offsetWidth;
        //     sideBoxBoundingBox = sideBoxObject.getBoundingClientRect();
        //     side_box_resizer_bar.style.backgroundColor = "#088";
    
        //     document.addEventListener("mousemove", resizeSideBox);
        //     document.addEventListener("mouseup", stopResizeSideBox);
    
        //     document.addEventListener("touchmove", resizeSideBox);
        //     document.addEventListener("touchend", stopResizeSideBox);
        //     document.addEventListener("touchcancel", stopResizeSideBox);
        // }
    
        // function resizeSideBox(event){
        //     let sideBoxResizerBoundingBox = side_box_resizer.getBoundingClientRect();
        //     let clientX;
        //     if (isTouchEvent(event)){
        //         const touch = event.touches[0];
        //         clientX = touch.clientX;
        //     }
        //     else{
        //         clientX = event.clientX;
        //     }
        //     const dx = parseInt(clientX-(sideBoxBoundingBox.x+sideBoxBoundingBox.width-sideBoxResizerBoundingBox.width/2)); 
    
        //     const width = Math.max(220, sideBoxOriginalWidth + dx)
    
        //     sideBoxObject.style.width = width +"px";
        // }
    
        // function stopResizeSideBox(){
        //     if(isResizing){
        //         isResizing = false;
    
        //         side_box_resizer_bar.style.backgroundColor = "#ccc";
    
        //         document.removeEventListener("mousemove", resizeSideBox);
        //         document.removeEventListener("mouseup", stopResizeSideBox)
    
        //         document.removeEventListener("touchmove", resizeSideBox);
        //         document.removeEventListener("touchend", stopResizeSideBox);
        //         document.removeEventListener("touchcancel", stopResizeSideBox);
    
        //     }
        // }
    }

}

customElements.define("mf-side-box", SideBox);