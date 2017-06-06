/*
recognition.js
点字を認識する
Ry1v, Ry2v, Cx1v, Cx2v -> Chsv, Chxv, Chyv
*/

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

function Recognition(){
	Chsv=[];
	Chxv=[];
	Chyv=[];
	
	for(var r=0;r<Ry1v.length;r+=3){
		var tenji = 0;
		var lsttenji = 0;
		for(var c=0;c<Cx1v.length;c+=2){
			lsttenji = tenji;
			tenji = 0;
			for(var i=0,b=1;i<2;i++){
				for(var j=0;j<3;j++,b<<=1){
					var x=((Ry1v[r+j]*ImgW)*(Cx2v[c+i]-Cx1v[c+i])+(Cx1v[c+i]*ImgH)*ImgW)/(ImgH*ImgW-(Cx2v[c+i]-Cx1v[c+i])*(Ry2v[r+j]-Ry1v[r+j]));
					var y=((Ry1v[r+j]*ImgW)*(ImgH)+(Cx1v[c+i]*ImgH)*(Ry2v[r+j]-Ry1v[r+j]))/(ImgH*ImgW-(Cx2v[c+i]-Cx1v[c+i])*(Ry2v[r+j]-Ry1v[r+j]));
					x=parseInt(x);
					y=parseInt(y);
					var cnt = CheckDot(x, y);
					if (cnt > 2){
						tenji += b;
					}
					if (cnt < 0)tenji -= 100;
				}
			}
			if (tenji < 0)continue;
			
			var X=((Ry1v[r]*ImgW)*(Cx2v[c]-Cx1v[c])+(Cx1v[c]*ImgH)*ImgW)/(ImgH*ImgW-(Cx2v[c]-Cx1v[c])*(Ry2v[r]-Ry1v[r]));
			var Y=((Ry1v[r]*ImgW)*(ImgH)+(Cx1v[c]*ImgH)*(Ry2v[r]-Ry1v[r]))/(ImgH*ImgW-(Cx2v[c]-Cx1v[c])*(Ry2v[r]-Ry1v[r]));
			
			X=parseInt(X);
			Y=parseInt(Y);
			
			Chsv.push(Normal[tenji]);
			Chxv.push(X);
			Chyv.push(Y);
		}
	}
}

var Normal = [
"","あ","っ","い","わ","な","","に",
"","う","お","え","や","ぬ","の","ね",
"","ら","ー","り","を","た","","ち",
"","る","ろ","れ","よ","つ","と","て",
"","か","？","き","","は","","ひ",
"","く","こ","け","ゆ","ふ","ほ","へ",
"、","さ","。","し","ん","ま","","み",
"","す","そ","せ","","む","も","め"
];