import { topicsMap } from "../utils/topics.js";

export class MainContent extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        const thisElement = this;

        thisElement.className = "main-content";
        
        window.addEventListener("topicSelectEvent", topicSelectHandler);
        function topicSelectHandler(event){
            const element = document.createElement(topicsMap[state.sideBox.topic.textContent]);
            thisElement.innerHTML = "";
            thisElement.appendChild(element);
            console.log(element);
        }

        
    }

}


customElements.define("mf-main-content", MainContent)