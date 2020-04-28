
var activeBg=2;

function checkBg()
{
    var curPos = $("#sec1").offset();
    var curTop = curPos.top;
    var scrollTop = $(window).scrollTop();
    if (curTop+$("#sec1").height()/2 < scrollTop&&activeBg==2) {
     activeBg=3;
     if($(window).width()>700){
         document.getElementById("hero1").style.backgroundImage='url("/images/hero3.jpg")';
     }
     else{
        document.getElementById("hero1").style.backgroundImage='url("/images/hero3.1x.jpg")';
     }
    }
    else if(curTop+$("#sec1").height()/2 > scrollTop&&activeBg==3){
        activeBg=2;
        if($(window).width()>700){
            document.getElementById("hero1").style.backgroundImage='url("/images/hero2.jpg")';
        }
        else{
            document.getElementById("hero1").style.backgroundImage='url("/images/hero2.1x.jpg")';
        }
    }
}

$(window).scroll(checkBg);