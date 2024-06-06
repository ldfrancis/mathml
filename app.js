window.addEventListener("DOMContentLoaded", main);


let topics_expand = false;

function main(){
    console.log("DOM IS READY!");

    const tool_bar_topics = document.querySelector("#tool-bar-topics");
    const topics_svg_open = tool_bar_topics.querySelector("#topics-svg-open");
    const topics_svg_close = tool_bar_topics.querySelector("#topics-svg-close");
    const side_box = document.querySelector(".side-box");
    const side_box_resizer = document.querySelector(".side-box-resizer");
    const side_box_resizer_bar = document.querySelector(".side-box-resizer-bar");
    let isResizing = false;
    let sideBoxOriginalWidth, sideBoxBoundingBox;

    topics_svg_open.style.display = "none";

    tool_bar_topics.addEventListener("click", toggleSideBox)
    tool_bar_topics.addEventListener("touch", toggleSideBox)
    side_box_resizer.addEventListener("mousedown", startSideBoxResize)
    side_box_resizer.addEventListener("touchstart", startSideBoxResize)

    function isTouchEvent(event) {
        return 'touches' in event;
    }

    function toggleSideBox(event){
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

    function startSideBoxResize(event){
        isResizing = true;
        sideBoxOriginalWidth = side_box.offsetWidth;
        sideBoxBoundingBox = side_box.getBoundingClientRect();
        side_box_resizer_bar.style.backgroundColor = "#088";

        document.addEventListener("mousemove", resizeSideBox);
        document.addEventListener("mouseup", stopResizeSideBox);

        document.addEventListener("touchmove", resizeSideBox);
        document.addEventListener("touchend", stopResizeSideBox);
        document.addEventListener("touchcancel", stopResizeSideBox);
    }

    function resizeSideBox(event){
        let sideBoxResizerBoundingBox = side_box_resizer.getBoundingClientRect();
        let clientX;
        if (isTouchEvent(event)){
            const touch = event.touches[0];
            clientX = touch.clientX;
        }
        else{
            clientX = event.clientX;
        }
        const dx = parseInt(clientX-(sideBoxBoundingBox.x+sideBoxBoundingBox.width-sideBoxResizerBoundingBox.width/2)); 
        console.log(dx);

        const width = Math.max(220, sideBoxOriginalWidth + dx)

        side_box.style.width = width +"px";
    }

    function stopResizeSideBox(){
        if(isResizing){
            isResizing = false;

            side_box_resizer_bar.style.backgroundColor = "#ccc";

            document.removeEventListener("mousemove", resizeSideBox);
            document.removeEventListener("mouseup", stopResizeSideBox)

            document.removeEventListener("touchmove", resizeSideBox);
            document.removeEventListener("touchend", stopResizeSideBox);
            document.removeEventListener("touchcancel", stopResizeSideBox);

        }
        
    }
}