//

var KANA = "　,あ,っ,い,わ,な,,に,,う,お,え,や,ぬ,の,ね,,ら,ー,り,を,た,,ち,,る,ろ,れ,よ,つ,と,て,,か,？,き,,は,,ひ,,く,こ,け,ゆ,ふ,ほ,へ,、,さ,。,し,ん,ま,,み,,す,そ,せ,,む,も,め@@@@@@@@,あ,っ,い,わ,にゃ,,に,,う,お,え,や,にゅ,にょ,ね,,りゃ,ー,り,を,ちゃ,,ち,,りゅ,りょ,れ,よ,ちゅ,ちょ,て,,きゃ,？,き,,ひゃ,,ひ,,きゅ,きょ,け,ゆ,ひゅ,ひょ,へ,、,しゃ,。,し,ん,みゃ,,み,,しゅ,しょ,せ,,みゅ,みょ,め@@@@@@@@,あ,っ,い,わ,な,,に,,う,お,え,や,ぬ,の,ね,,ら,ー,り,を,だ,,ぢ,,る,ろ,れ,よ,づ,ど,で,,が,？,ぎ,,ば,,び,,ぐ,ご,げ,ゆ,ぶ,ぼ,べ,、,ざ,。,じ,ん,ま,,み,,ず,ぞ,ぜ,,む,も,め@@@@@@@@,あ,っ,い,わ,な,,に,,う,お,え,や,ぬ,の,ね,,ら,ー,り,を,ぢゃ,,ち,,る,ろ,れ,よ,ぢゅ,ぢょ,て,,ぎゃ,？,き,,びゃ,,ひ,,ぎゅ,ぎょ,け,ゆ,びゅ,びょ,へ,、,じゃ,。,し,ん,ま,,み,,じゅ,じょ,せ,,む,も,め@@@@@@@@,あ,っ,い,わ,な,,に,,う,お,え,や,ぬ,の,ね,,ら,ー,り,を,た,,ち,,る,ろ,れ,よ,つ,と,て,,か,？,き,,ぱ,,ぴ,,く,こ,け,ゆ,ぷ,ぽ,ぺ,、,さ,。,し,ん,ま,,み,,す,そ,せ,,む,も,め@@@@@@@@,あ,っ,い,わ,な,,に,,う,お,え,や,ぬ,の,ね,,ら,ー,り,を,た,,ち,,る,ろ,れ,よ,つ,と,て,,か,？,き,,ぴゃ,,ひ,,く,こ,け,ゆ,ぴゅ,ぴょ,へ,、,さ,。,し,ん,ま,,み,,す,そ,せ,,む,も,め@@@@@@@@@@@@@@@@@@@@,1,っ,2,わ,な,,に,,3,9,6,や,ぬ,の,ね,,5,ー,8,を,た,,ち,,4,0,7,よ,つ,と,て,,か,？,き,ー,は,,ひ,,く,こ,け,ゆ,ふ,ほ,へ,、,さ,。,し,ん,ま,,み,,す,そ,せ,,む,も,め@@@";
var NXT = "0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,60,0,0,0@@@@@@@@0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,60,0,0,0@@@@@@@@0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,60,0,0,0@@@@@@@@0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,60,0,0,0@@@@@@@@0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,60,0,0,0@@@@@@@@0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,60,0,0,0@@@@@@@@@@@@@@@@@@@@0,60,0,60,0,0,0,0,8,60,60,60,0,0,0,0,16,60,0,60,0,0,0,0,24,60,60,60,0,0,0,0,32,0,0,0,0,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,60,0,0,0@@@";
var kana;
var nxt;

var debugmode = 0;

var ResultStr;

function CharaInit(){
	kana = KANA.split("@");
	for(var i=0; i<kana.length;i++){
		kana[i] = kana[i].split(",");
	}
	nxt = NXT.split("@");
	for(var i=0; i<nxt.length;i++){
		nxt[i] = nxt[i].split(",");
	}
}

function CheckDot(x, y){
	if (x < 2 || x + 2 >= ImgW || y < 2 || y + 2 >= ImgH)return -1;
	var cnt = 0;
	for (var dx = x - 2; dx <= x + 2; dx++){
		for (var dy = y - 2; dy <= y + 2; dy++){
			if (Bin[dy*ImgW + dx] == 0)cnt++;
		}
	}
	return cnt;
}

function DebugBin(){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	canvas.width = ImgW;
	canvas.height = ImgH;
	var Data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = Data.data;
	for(var i=0,j=0;j<Bin.length;i+=4,j++){
		data[i] = Bin[j];
		data[i+1] = Bin[j];
		data[i+2] = Bin[j];
		data[i+3] = 255;
	}
	ctx.putImageData(Data,0,0);
	document.getElementById("Main").innerHTML += "<img src='" + canvas.toDataURL() + "'></br>";
}
function DebugFind(){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	function line(x1, y1, x2, y2){
		ctx.lineWidth = 1;
		ctx.strokeStyle="rgb(255,0,0)";
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	function circle(x, y, r){
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.beginPath();
		ctx.arc(x,y,r,0,Math.PI*2, true);
		ctx.fill();
	}
	canvas.width = ImgW;
	canvas.height = ImgH;
	var Data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = Data.data;
	for(var i=0,j=0;j<Gray.length;i+=4,j++){
		data[i] = Gray[j];
		data[i+1] = Gray[j];
		data[i+2] = Gray[j];
		data[i+3] = 255;
	}
	ctx.putImageData(Data,0,0);
	
	for(var i=0;i<ColLines[0].length;i++){
		line(ColLines[0][i][0], 0, ColLines[0][i][1], ImgH);
		line(ColLines[1][i][0], 0, ColLines[1][i][1], ImgH);
	}
	for(var i=0;i<RowLines[0].length;i++){
		line(0, RowLines[0][i][0], ImgW, RowLines[0][i][1]);
		line(0, RowLines[1][i][0], ImgW, RowLines[1][i][1]);
		line(0, RowLines[2][i][0], ImgW, RowLines[2][i][1]);
	}
	for(var i=0; i<RowLines[0].length;i++){
		var flg = 0;
		for(var j=0;j<ColLines[0].length;j++){
			var bit = 0;
			var cx, cy;
			for(var w = 0,b=1;w<2;w++){
				for(var h=0;h<3;h++,b+=b){
					var p1y = RowLines[h][i][0];
					var p2x = ColLines[w][j][1];
					var p3y = RowLines[h][i][1];
					var p4x = ColLines[w][j][0];
					var s1 = ((p4x - p2x)*(p1y - ImgH) - ImgH*p2x) / 2.0;
					var s2 = ((p4x - p2x)*(ImgH - p3y) + ImgH*(p2x - ImgW)) / 2.0;
					var x = parseInt(ImgW*s1 / (s1 + s2));
					var y = parseInt(p1y + (p3y - p1y)*s1 / (s1 + s2));
					if (w == 0 && h == 0){
						cx = x;
						cy = y;
					}
					if (CheckDot(x, y) > 2){
						bit += b;
						circle(x, y, 4);
					}
				}
			}
			//DrawKana(cx, cy, kana[flg][bit]);
			flg = nxt[flg][bit];
		}
	}
	
	document.getElementById("Main").innerHTML += "<img src='" + canvas.toDataURL() + "'></br>";
}

function FindDot(){
	CharaInit();
	
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	//文字列
	function DrawKana(x, y, s){
		if(s.length>1)x-=16;
		ctx.font = "16px 'メイリオ'";
		ctx.fillStyle = "rgb(255,0,0)";
		ctx.fillText(s,x,y+16);
	}
	canvas.width = ImgW;
	canvas.height = ImgH;
	var Data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = Data.data;
	for(var i=0,j=0;j<Gray.length;i+=4,j++){
		data[i] = Gray[j];
		data[i+1] = Gray[j];
		data[i+2] = Gray[j];
		data[i+3] = 255;
	}
	ctx.putImageData(Data,0,0);
	ResultStr = "";
	for(var i=0; i<RowLines[0].length;i++){
		var flg = 0;
		for(var j=0;j<ColLines[0].length;j++){
			var bit = 0;
			var cx, cy;
			for(var w = 0,b=1;w<2;w++){
				for(var h=0;h<3;h++,b+=b){
					var p1y = RowLines[h][i][0];
					var p2x = ColLines[w][j][1];
					var p3y = RowLines[h][i][1];
					var p4x = ColLines[w][j][0];
					var s1 = ((p4x - p2x)*(p1y - ImgH) - ImgH*p2x) / 2.0;
					var s2 = ((p4x - p2x)*(ImgH - p3y) + ImgH*(p2x - ImgW)) / 2.0;
					var x = parseInt(ImgW*s1 / (s1 + s2));
					var y = parseInt(p1y + (p3y - p1y)*s1 / (s1 + s2));
					if (w == 0 && h == 0){
						cx = x;
						cy = y;
					}
					if (CheckDot(x, y) > 2){
						bit += b;
						//circle(x, y, 4);
					}
				}
			}
			DrawKana(cx, cy, kana[flg][bit]);
			ResultStr += kana[flg][bit];
			flg = nxt[flg][bit];
		}
		ResultStr += "<br>";
	}
	
	document.getElementById("Main").innerHTML = "<img src='" + canvas.toDataURL() + "'></br>";
	document.getElementById("Main").innerHTML += "<hr>";
	document.getElementById("Main").innerHTML += "<b>認識結果</b><br>";
	document.getElementById("Main").innerHTML += ResultStr;
	document.getElementById("Main").innerHTML += "<hr>";
	if(debugmode)DebugBin();
	if(debugmode)DebugFind();
	document.getElementById("Main").innerHTML += "<font color='red'>うまくいかないときは？</font><br>";
	document.getElementById("Main").innerHTML += "照明や撮影角度を変えてやり直してみてください。<br>";
	document.getElementById("Main").innerHTML += "もしくは<a href='javascript:void(0);'onclick='PoseChange();'>回転させてもう一回。</a><br>";
	document.getElementById("Main").innerHTML += "もしくは<a href='javascript:void(0);'onclick='ParaChange();'>パラメータを変えてもう一回。</a><br>";
	//document.getElementById("Main").innerHTML += "もしくは<a href='javascript:void(0);'onclick='OBR(5, 7.0);'>パラメータを変えてもう一回。</a><br>";
	document.getElementById("Main").innerHTML += "（端末によって性能が異なるため、全くうまくいかない端末もあります...。）<br>";
}

function DebugModeOn(){
	debugmode = 1;
	HowTo();
}
