var imgno=1;
const last=3;
function imgUrl(n=1){return `/images/hero${n}.jpg`;}

window.setInterval(()=>{
if(++imgno>last){
    imgno=1;
}
var url=imgUrl(imgno);
document.getElementById('hero').style.backgroundImage=`url(${url})`;
},4000)