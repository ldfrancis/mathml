window.addEventListener("DOMContentLoaded", main);

const topics_open_svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
<path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>
</svg>
`;
const topics_close_svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
<path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
</svg>
`;

let topics_expand = false;
let topics_svg = topics_open_svg;

function main(){
    console.log("DOM IS READY!")
    const tool_bar_topics = document.querySelector("#tool-bar-topics")
    tool_bar_topics.addEventListener(
        "click", (event)=>{
            topics_expand = !topics_expand;
            topics_svg = topics_expand ? topics_close_svg : topics_open_svg;
            
            event.target.innerHTML = topics_svg;
            // event.target.style.backgroundColor = 
            console.log(topics_svg);
        }
    )
    tool_bar_topics.innerHTML = topics_open_svg;

}