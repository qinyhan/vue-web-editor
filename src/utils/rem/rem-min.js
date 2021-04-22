// window.onload = function () {
    let resize = function () {
        // let body = document.getElementsByTagName('body')
        let html = document.documentElement
        let psdW = 750  //psd设计图宽度
        let W = window.innerWidth;
        if(W >= 750){
            // html.style.maxWidth = "750px"
            html.style.margin = "auto"
            html.style.fontSize = "625%"
            // html.style.fontSize = "50px"
        }else{
            let fs = W / psdW;
            html.style.fontSize = (fs * 625) + "%"
        }
    };
    resize();
    window.onresize = function () {
        resize()
    }
// }
