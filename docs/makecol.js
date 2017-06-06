/*
makecol.js
縦線を検出する
Bin, ImgH, ImgW -> Cx1v, Cx2v
*/

var x1_0, x2_0, tx1, tx2, colst, colen;

//(x, y)を通る最も縦線らしい直線を探す
function XYToBestX1X2(x, y){
	var best = [-1, 0, 0];
	var xst = (x-100<0?0:x-100);
	var xen = (x+100<ImgW?x+100:ImgW);
	for(var x1 = xst; x1<xen; x1++){
		var cnt=0;
		var x2 = x1 + ImgH*(x - x1) / y;
		if (x2 < x - 100 || x + 100 <= x2)continue;
		for (var yi = 0; yi < ImgH; yi++){
			var xi = parseInt(x1 + yi*(x2 - x1) / ImgH);
			if (xi < 0 || ImgW <= xi)continue;
			if (Bin[yi*ImgW + xi] == 0)cnt++;
		}
		if (best[0]<cnt){
			best[0] = cnt;
			best[1] = x1;
			best[2] = x2;
		}
	}
	
	return best;
}

//直線の集合のパラメータを推定する
function HoughCol(){
	var x1v = [];
	var x2v = [];
	var scv = [];
	for (var x = 0; x < ImgW; x++){
		for (var y = 1; y < ImgH && x < ImgW; y++){
			if (Bin[y*ImgW + x])continue;
			var x1x2 = XYToBestX1X2(x, y);
			scv.push(x1x2[0]);
			x1v.push(x1x2[1]);
			x2v.push(x1x2[2]);
			x += 5;
		}
	}
	
	
	var best = 0.0;
	for (var i = 0; i < x1v.length; i++){
		for (var j = 0; j < i; j++){
			var a = x2v[j] - x2v[i];
			var b = x1v[j] - x1v[i];
			if (Math.abs(a*a + b*b) < 0.000000001)continue;
			var tmp = Math.hypot(a, b);
			a /= tmp;
			b /= tmp;
			var sum = 0.0;
			for (var k = 0; k < x1v.length; k++){
				var d = a *(x1v[k] - x1v[i]) - b*(x2v[k] - x2v[i]);
				if ((a*a + b*b)*(scv[k] / 10)*(scv[k] / 10) - d*d < 0)continue;
				var t1 = (a*(x2v[k] - x2v[i]) + b*(x1v[k] - x1v[i]) + Math.sqrt((a*a + b*b)*(scv[k] / 10)*(scv[k] / 10) - d*d)) / (a*a + b*b);
				var t2 = (a*(x2v[k] - x2v[i]) + b*(x1v[k] - x1v[i]) - Math.sqrt((a*a + b*b)*(scv[k] / 10)*(scv[k] / 10) - d*d)) / (a*a + b*b);
				sum += Math.hypot(t1*a - t2*a, t1*b - t2*b);
			}
			if (best < sum){
				best = sum;
				x2_0 = x2v[i];
				x1_0 = x1v[i];
				tx2 = a;
				tx1 = b;
			}
		}
	}
}


function MakeCol(){
	//初期化
	Cx1v = [];
	Cx2v = [];
	
	//直線のパラメータを探す
	HoughCol();
	
	//始点と終点
	colst = -1000;
	colen = 1000;
	//2分探索で始点を探す
	for (var i = 0, ng = -1000, ok = 0; i < 15; i++){
		var p = (ng + ok) / 2;
		var x1 = x1_0 + p * tx1;
		var x2 = x2_0 + p * tx2;
		if ((x1 > ImgW && x2 > ImgW) || (x1 < 0 || x2 < 0))ng = p;
		else ok = p;
		colst = ok;
	}
	//2分探索で終点を探す
	for (var i = 0, ok = 0, ng = 1000; i < 15; i++){
		var p = (ng + ok) / 2;
		var x1 = x1_0 + p * tx1;
		var x2 = x2_0 + p * tx2;
		if ((x1 > ImgW && x2 > ImgW) || (x1 < 0 || x2 < 0))ng = p;
		else ok = p;
		colen = ok;
	}
	
	colst -= 20;
	colen += 20;
	
	//ピーク検出
	var vec = [];
	var lstst = -114514;
	var lsten = -114514;
	var befsc = -1;
	var befst = colst - 1;
	var flg = 0;//直前が下降
	for (var i = colst; i <= colen; i++){
		var x1 = x1_0 + i * tx1;
		var x2 = x2_0 + i * tx2;
		var cnt = 0;
		for (var y = 0; y < ImgH; y++){
			var x = parseInt(x1 + y*(x2 - x1) / ImgH);
			if (x < 0 || ImgW <= x)continue;
			if (Bin[y*ImgW + x] == 0)cnt++;
		}
		
		//上昇
		if (befsc<cnt){
			befst = i;
			flg = 0;
		}
		//下降
		if (befsc>cnt && flg == 0){
			flg = 1;
			var p = (befst + i) / 2;
			if (befsc < 10);
			else if ((lstst + lsten) / 2 + 4 < p){
				if (lstst != -114514)vec.push((lstst + lsten) / 2);
				lstst = befst;
				lsten = i;
			}
			else lsten = i;
		}
		befsc = cnt;
	}
	if (lstst != -114514)vec.push((lstst + lsten) / 2);
	
	//縦線の割り振り
	if (vec.length < 2)return;
	if (vec[0] * tx1 > vec[vec.length - 1] * tx1)vec.reverse();
	
	
	var lstc = 1;
	for (var i = 0; i < vec.length; i++){
		var cur = 0;
		if (i == 0)cur = 0;
		else if (i == vec.length - 1)cur = 1;
		else if ((vec[i] - vec[i - 1])*tx1<(vec[i + 1] - vec[i])*tx1)cur = 1;
		
		if (lstc == 0 && cur == 1){
			Cx1v.push(parseInt(x1_0 + vec[i - 1] * tx1));
			Cx1v.push(parseInt(x1_0 + vec[i] * tx1));
			Cx2v.push(parseInt(x2_0 + vec[i - 1] * tx2));
			Cx2v.push(parseInt(x2_0 + vec[i] * tx2));
		}
		lstc = cur;
	}
}
