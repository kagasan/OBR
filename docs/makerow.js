/*
makerow.js
横線を検出する
Bin, ImgH, ImgW -> Ry1v, Ry2v
*/

var y1_0, y2_0, ty1, ty2, rowst, rowen;

//(x, y)を通る最も横線らしい直線を探す
function XYToBestY1Y2(x, y){
	var best = [-1, 0, 0];
	var yst = (y-100<0?0:y-100);
	var yen = (y+100<ImgH?y+100:ImgH);
	for(var y1 = yst; y1<yen; y1++){
		var cnt=0;
		var y2 = y1+ImgW*(y - y1) / x;
		if (y2 < y - 100 || y + 100 <= y2)continue;
		for (var xi = 0; xi < ImgW; xi++){
			var yi = parseInt(y1 + xi*(y2 - y1) / ImgW);
			if (yi < 0 || ImgH <= yi)continue;
			if (Bin[yi*ImgW + xi] == 0)cnt++;
		}
		if (best[0] < cnt){
			best[0] = cnt;
			best[1]=y1;
			best[2]=y2;
		}
	}
	return best;
}

//直線の集合のパラメータを推定する
function HoughRow(){
	var y1v = [];
	var y2v = [];
	var scv = [];
	for(var y=0;y<ImgH;y++){
		for(var x=1;x<ImgW&&y<ImgH;x++){
			if(Bin[y*ImgW+x])continue;
			var y1y2 = XYToBestY1Y2(x, y);
			scv.push(y1y2[0]);
			y1v.push(y1y2[1]);
			y2v.push(y1y2[2]);
			y += 5;
		}
	}
	var best = 0.0;
	for (var i = 0; i < y1v.length; i++){
		for (var j = 0; j < i; j++){
			var a = y2v[j] - y2v[i];
			var b = y1v[j] - y1v[i];
			if(Math.abs(a*a+b*b)<0.000000001)continue;
			var tmp = Math.hypot(a, b);
			a /= tmp;
			b /= tmp;
			var sum = 0.0;
			for(var k = 0; k < y1v.length; k++){
				var d = a*(y1v[k]-y1v[i])-b*(y2v[k]-y2v[i]);
				if((a*a+b*b)*(scv[k]/10)*(scv[k]/10)-d*d<0)continue;
				var t1 = (a*(y2v[k] - y2v[i]) + b*(y1v[k] - y1v[i]) + Math.sqrt((a*a + b*b)*(scv[k] / 10)*(scv[k] / 10) - d*d)) / (a*a + b*b);
				var t2 = (a*(y2v[k] - y2v[i]) + b*(y1v[k] - y1v[i]) - Math.sqrt((a*a + b*b)*(scv[k] / 10)*(scv[k] / 10) - d*d)) / (a*a + b*b);
				sum += Math.hypot(t1*a - t2*a, t1*b - t2*b);
			}
			if (best < sum){
				best = sum;
				y2_0 = y2v[i];
				y1_0 = y1v[i];
				ty2 = a;
				ty1 = b;
			}
		}
	}
}


function MakeRow(){
	//初期化
	Ry1v = [];
	Ry2v = [];
	
	//直線のパラメータを探す
	HoughRow();
	
	//始点と終点
	rowst = -1000;
	rowen = 1000;
	
	//2分探索で始点を探す
	for (var i = 0, ng = -1000, ok = 0; i < 15; i++){
		var p = (ng + ok) / 2;
		var y1 = y1_0 + p * ty1;
		var y2 = y2_0 + p * ty2;
		if ((y1 > ImgH && y2 > ImgH) || (y1 < 0 || y2 < 0))ng = p;
		else ok = p;
		rowst = ok;
	}
	//2分探索で終点を探す
	for (var i = 0, ok = 0, ng = 1000; i < 15; i++){
		var p = (ng + ok) / 2;
		var y1 = y1_0 + p * ty1;
		var y2 = y2_0 + p * ty2;
		if ((y1 > ImgH && y2 > ImgH) || (y1 < 0 || y2 < 0))ng = p;
		else ok = p;
		rowen = ok;
	}
	rowst -= 20;
	rowen += 20;
	
	//ピーク検出
	var vec = [];
	var lstst = -114514;
	var lsten = -114514;
	var befsc = -1;
	var befst = rowst - 1;
	var flg = 0;//直前が下降
	for (var i = rowst; i <= rowen; i++){
		var y1 = y1_0 + i * ty1;
		var y2 = y2_0 + i * ty2;
		var cnt = 0;
		for (var x = 0; x < ImgW; x++){
			var y = parseInt(y1 + x*(y2 - y1) / ImgW);
			if (y < 0 || ImgH <= y)continue;
			if (Bin[y*ImgW + x] == 0)cnt++;
		}
		
		//上昇
		if (befsc<cnt){
			befst = i;
			flg = 0;
		}
		//下降
		if (befsc>cnt && flg==0){
			flg = 1;
			var p = (befst + i) / 2;
			if (befsc < 10);
			else if ((lstst+lsten)/2 + 4 < p){
				if (lstst != -114514)vec.push((lstst + lsten) / 2);
				lstst = befst;
				lsten = i;
			}
			else lsten = i;
		}
		befsc = cnt;
	}
	if (lstst != -114514)vec.push((lstst + lsten) / 2);
	
	
	//横線の割り振り
	if (vec.length < 2)return;
	if (vec[0] * ty1 > vec[vec.length - 1] * ty1)vec.reverse();
	
	var lstr=2;
	var lstlstr=2;
	for (var i = 0; i < vec.length;i++){
		var cur=1;
		if (i == 0)cur = 0;
		else if (i == vec.length - 1)cur=2;
		else if (1.0*(vec[i]-vec[i-1])*ty1>2.0*(vec[i+1]-vec[i])*ty1)cur=0;
		else if (2.0*(vec[i] - vec[i - 1])*ty1<1.0*(vec[i + 1] - vec[i])*ty1)cur=2;
		
		if (lstlstr == 0 && lstr == 1 && cur == 2){
			Ry1v.push(parseInt(y1_0 + vec[i - 2] * ty1));
			Ry1v.push(parseInt(y1_0 + vec[i - 1] * ty1));
			Ry1v.push(parseInt(y1_0 + vec[i] * ty1));
			Ry2v.push(parseInt(y2_0 + vec[i - 2] * ty2));
			Ry2v.push(parseInt(y2_0 + vec[i - 1] * ty2));
			Ry2v.push(parseInt(y2_0 + vec[i] * ty2));
		}

		lstlstr = lstr;
		lstr = cur;
	}
	
}

function DrawRow(){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	function GetColor(R,G,B){
		return "rgb("+R+","+G+","+B+")";
	}
	function DrawLine(x1, y1, x2, y2, color = GetColor(0,0,0), thickness = 1){
		ctx.lineWidth = thickness;
		ctx.strokeStyle=color;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img,0,0);
	/*
	var Data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = Data.data;
	for(var i=0;i<data.length;i+=4){
		data[i]=Bin[i/4];
		data[i+1]=Bin[i/4];
		data[i+2]=Bin[i/4];
		data[i+3]=255;
	}
	ctx.putImageData(Data, 0, 0);
	
	
	for (var i = rowst; i <= rowen; i++){
		var y1 = y1_0 + i * ty1;
		var y2 = y2_0 + i * ty2;
		var cnt = 0;
		for (var x = 0; x < ImgW; x++){
			var y = parseInt(y1 + x*(y2 - y1) / ImgW);
			if (y < 0 || ImgH <= y)continue;
			if (Bin[y*ImgW + x] == 0)cnt++;
		}
		if (cnt > 30)DrawLine(0,y1,ImgW,y2,GetColor(255,0,0));
	}
	
	*/
	
	for(var i=0;i<Ry1v.length;i++){
		DrawLine(0,Ry1v[i],ImgW,Ry2v[i],GetColor(255,0,0));
	}
	
	img.src = canvas.toDataURL();
	document.getElementById("OutputImage").innerHTML = "<img src='" + img.src + "'></br>";
}
