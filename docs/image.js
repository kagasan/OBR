var img = new Image();
var imgflg = 0;
var firstimgflg = 0;

var cpyimg = new Image();

function ImageInit(){
	img.addEventListener("load", function(){
		if(imgflg){
			ParaNum = 0;
			firstimgflg = 1;
			imgflg=0;
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext('2d');
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			img.src = canvas.toDataURL();
			document.getElementById("Main").innerHTML = "<img src='" + img.src + "'></br>";
		}
	}, false);
	
	document.getElementById("selectfile").addEventListener("change", 
		function(evt){
			var file = evt.target.files;
			var reader = new FileReader();
			reader.readAsDataURL(file[0]);
			reader.onload = function(){
				imgflg=1;
				img.src = reader.result;
				document.getElementById("Main").innerHTML = "<img src='img/wait.gif'></br>";
			}
		},
	false);
}

//画像入力
window.onload = function(){
	
	ImageInit();
	
};

//画像回転
function Rotate(){
	Cutflg = -1;
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	canvas.width = cpyimg.height;
	canvas.height = cpyimg.width;
	ctx.save();
	ctx.translate(canvas.width/2, canvas.height/2);
	ctx.rotate(Math.PI/2);
	ctx.translate(-cpyimg.width/2, -cpyimg.height/2);
	ctx.drawImage(cpyimg, 0, 0);
	ctx.restore();
	cpyimg.src = canvas.toDataURL();
	document.getElementById("Main").innerHTML = "<img src='" + cpyimg.src + "'></br>";
}

//画像コピー
function imgTocpyimg(){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	if(img.width<=640 && img.height<=640){
		canvas.width = img.width;
		canvas.height = img.height;
		ImgH = img.height;
		ImgW = img.width;
		ctx.drawImage(img,0,0);
	}
	else{
		//画像が大きければ縮小する
		var w = img.width;
		var h = img.height;
		if(img.width>640 || img.height>640){
			w = 640;
			h = parseInt(img.height * 640 / img.width);
			if(img.width <= img.height){
				w = parseInt(img.width * 640 / img.height);
				h = 640;
			}
		}
		canvas.width = w;
		canvas.height = h;
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	}
	cpyimg.src = canvas.toDataURL();
}
function cpyimgToimg(){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	canvas.width = cpyimg.width;
	canvas.height = cpyimg.height;
	ctx.drawImage(cpyimg, 0, 0);
	img.src = canvas.toDataURL();
}

//画像調整
function Edit(){
	if(firstimgflg==0){
		document.getElementById("Main").innerHTML = "<font color='red'>画像を選択してください。</font><br>この画像を保存して「画像選択」「実行」を試してみてください。<br><img src='img/50.png'>";
		return;
	}
	imgTocpyimg();
	document.getElementById("Main").innerHTML = "<img src='" + cpyimg.src + "'></br>";
	document.getElementById("B1").innerHTML = '<img src="img/cancel.png"><p>キャンセル</p><a href="javascript:void(0);"onclick="EditCancel();"></a>';
	document.getElementById("B2").innerHTML = '<img src="img/cut.png"><p>トリミング</p><a href="javascript:void(0);"onclick="EditCut();"></a>';
	document.getElementById("B3").innerHTML = '<img src="img/rot.png"><p>90度回転</p><a href="javascript:void(0);"onclick="Rotate();"></a>';
	document.getElementById("B4").innerHTML = '<img src="img/done.png"><p>完了</p><a href="javascript:void(0);"onclick="EditDone();"></a>';
	
}

function EditCancel(){
	document.getElementById("Main").innerHTML = "<img src='" + img.src + "'></br>";
	document.getElementById("B1").innerHTML = '<img src="img/cam.png"><p>画像選択</p><input type="file" id="selectfile" class="selectfile" accept="image/*" style="cursor:pointer;">';
	document.getElementById("B2").innerHTML = '<img src="img/edit.png"><p>画像編集</p><a href="javascript:void(0);"onclick="Edit();"></a>';
	document.getElementById("B3").innerHTML = '<img src="img/find.png"><p>実行</p><a href="javascript:void(0);"onclick="OBR();"></a>';
	document.getElementById("B4").innerHTML = '<img src="img/info.png"><p>各種情報</p><a href="javascript:void(0);"onclick="HowTo();"></a>';
	ImageInit();
}

//トリミング用
var CutCanvas;
var CutCtx;
var Cutflg = -1;
var Cutx1, Cuty1;
var Cutx2, Cuty2;

function CutClick(e){
	function circle(x, y, r){
		CutCtx.fillStyle = "rgb(255,0,0)";
		CutCtx.beginPath();
		CutCtx.arc(x,y,r,0,Math.PI*2, true);
		CutCtx.fill();
	}
	if(Cutflg==0){
		Cutflg = 1;
		var rect = e.target.getBoundingClientRect();
		Cutx1 = e.clientX - rect.left;
		Cuty1 = e.clientY - rect.top;
		circle(Cutx1, Cuty1, 4);
	}
	else if(Cutflg == 1){
		Cutflg = -1;
		var rect = e.target.getBoundingClientRect();
		Cutx2 = e.clientX - rect.left;
		Cuty2 = e.clientY - rect.top;
		var w = Math.abs(Cutx1-Cutx2);
		var h = Math.abs(Cuty1-Cuty2);
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext('2d');
		canvas.width = w;
		canvas.height = h;
		ctx.drawImage(cpyimg, (Cutx1<Cutx2?-Cutx1:-Cutx2), (Cuty1<Cuty2?-Cuty1:-Cuty2));
		cpyimg.src = canvas.toDataURL();
		document.getElementById("Main").innerHTML = "<img src='" + cpyimg.src + "'></br>";
	}
}

function EditCut(){
	Cutflg = 0;
	document.getElementById("Main").innerHTML = "<font color='red'>トリミングする範囲を決める2点を選択してください。</font><br><canvas id='cutcanvas'></canvas>";
	CutCanvas = document.getElementById('cutcanvas');
	CutCtx = CutCanvas.getContext('2d');
	CutCanvas.width = cpyimg.width;
	CutCanvas.height = cpyimg.height;
	CutCtx.drawImage(cpyimg, 0, 0);
	CutCanvas.addEventListener('click', CutClick, false);
}

function EditDone(){
	cpyimgToimg();
	document.getElementById("Main").innerHTML = "<img src='" + img.src + "'></br>";
	document.getElementById("B1").innerHTML = '<img src="img/cam.png"><p>画像選択</p><input type="file" id="selectfile" class="selectfile" accept="image/*" style="cursor:pointer;">';
	document.getElementById("B2").innerHTML = '<img src="img/edit.png"><p>画像編集</p><a href="javascript:void(0);"onclick="Edit();"></a>';
	document.getElementById("B3").innerHTML = '<img src="img/find.png"><p>実行</p><a href="javascript:void(0);"onclick="OBR();"></a>';
	document.getElementById("B4").innerHTML = '<img src="img/info.png"><p>各種情報</p><a href="javascript:void(0);"onclick="HowTo();"></a>';
	ImageInit();
	ParaNum = 0;
}
