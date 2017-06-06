/*
image.js
OBRする前の簡単な処理
img -> img
*/

//画像入力
window.onload = function(){
	document.getElementById("selectfile").addEventListener("change", 
		function(evt){
			var file = evt.target.files;
			var reader = new FileReader();
			reader.readAsDataURL(file[0]);
			reader.onload = function(){
				img.src = reader.result;
				document.getElementById("OutputImage").innerHTML = "<img src='" + img.src + "'></br>";
			}
		},
	false);
	
};

//画像縮小
function Small(WLimit=320, HLimit=320){
	if(img.width<=WLimit && img.height<=HLimit)return;
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	var w = img.width;
	var h = img.height;
	if(img.width>WLimit || img.height>HLimit){
		w = WLimit;
		h = parseInt(img.height * WLimit / img.width);
		if(img.width <= img.height){
			w = parseInt(img.width * HLimit / img.height);
			h = HLimit;
		}
	}
	canvas.width = w;
	canvas.height = h;
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	
	img.src = canvas.toDataURL();
	document.getElementById("OutputImage").innerHTML = "<img src='" + img.src + "'></br>";
}

//画像回転
function Rotate(){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	canvas.width = img.height;
	canvas.height = img.width;
	ctx.save();
	ctx.translate(canvas.width/2, canvas.height/2);
	ctx.rotate(Math.PI/2);
	ctx.translate(-img.width/2, -img.height/2);
	ctx.drawImage(img, 0, 0);
	ctx.restore();
	img.src = canvas.toDataURL();
	document.getElementById("OutputImage").innerHTML = "<img src='" + img.src +  "'></br>";
}
