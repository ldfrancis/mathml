window.addEventListener("DOMContentLoaded", main);


let topics_expand = false;

function main(){
    console.log("DOM IS READY!");

    const tool_bar_topics = document.querySelector("#tool-bar-topics");
    const topics_svg_open = tool_bar_topics.querySelector("#topics-svg-open");
    const topics_svg_close = tool_bar_topics.querySelector("#topics-svg-close");
    const side_box = document.querySelector(".side-box");
    const side_box_resizer = document.querySelector(".side-box-resizer");
    let isResizing = false;
    let sideBoxOriginalWidth, sideBoxBoundingBox;

    topics_svg_open.style.display = "none";

    tool_bar_topics.addEventListener(
        "click", (event)=>{
            topics_expand = !topics_expand;
            if(topics_expand){
                topics_svg_close.style.display = "none";
                topics_svg_open.style.display = "block";
                side_box.style.display = "none";
            }
            else{
                topics_svg_close.style.display = "block";
                topics_svg_open.style.display = "none";
                side_box.style.display = "block";
            }
        }
    )

    side_box_resizer.addEventListener("mousedown", (event)=>{
        isResizing = true;
        sideBoxOriginalWidth = side_box.offsetWidth;
        sideBoxBoundingBox = side_box.getBoundingClientRect();

        document.addEventListener("mousemove", resizeSideBox);
        document.addEventListener("mouseup", stopResizeSideBox);
    })

    function resizeSideBox(event){
        let sideBoxResizerBoundingBox = side_box_resizer.getBoundingClientRect();
        const dx = parseInt(event.clientX-(sideBoxBoundingBox.x+sideBoxBoundingBox.width-sideBoxResizerBoundingBox.width/2)); 
        console.log(dx);

        const width = Math.max(220, sideBoxOriginalWidth + dx)

        side_box.style.width = width +"px";
    }

    function stopResizeSideBox(){
        if(isResizing){
            isResizing = false;
            document.removeEventListener("mousemove", resizeSideBox);
            document.removeEventListener("mouseup", stopResizeSideBox)
        }
        
    }
}