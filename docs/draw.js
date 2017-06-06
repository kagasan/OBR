/*
draw.js
点字内容を重ねて表示する
Chsv, Chxv, Chyv -> img
*/

function Draw(){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	function GetColor(R,G,B){
		return "rgb("+R+","+G+","+B+")";
	}
	function DrawString(x, y, s, color = GetColor(0,0,0), size=16, font="メイリオ"){
		ctx.font = ""+size+"px"+" '"+font+"'";
		ctx.fillStyle = color;
		ctx.fillText(s,x,y+size);
	}
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img,0,0);
	
	for(var i=0;i<Chsv.length;i++){
		DrawString(Chxv[i], Chyv[i], Chsv[i], GetColor(255,0,0));
	}
	
	img.src = canvas.toDataURL();
	document.getElementById("OutputImage").innerHTML = "<img src='" + img.src + "'></br>";
}