document.getElementById("jjmt").onclick=function(){
    if(this.className==""){
        this.className="en";
        document.getElementById("gjmt").className="";
    }
}
document.getElementById("gjmt").onclick=function(){
    if(this.className==""){
        this.className="en";
        document.getElementById("jjmt").className="";
    }
}
/////////////////////////////////////////
var n=0
	function move (){
		if(n>-800){
			n=n-1 
			}
		else{
			n=0
			}
		$(".movebox").css("left",n)
		}
	var t1=setInterval(move,50)
	$(".movebox"). mouseenter(                           
		function(){
			clearInterval(t1);
			}
	).mouseleave(
		function(){
			t1=setInterval(move,50)
			}
	)