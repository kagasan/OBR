/*
y1 = y1_0 + i * ty1;
y2 = y2_0 + i * ty2;
*/
var y1_0, ty1;
var y2_0, ty2;

var rowst, rowen;
var RowLines;

//
function XYToBESTY1Y2(x, y, L=100, horizontal = 0){
	if(L>100)L=100;
	if(L<10)L=10;
	if(horizontal)L=1;
	var besty1, besty2;
	var best = -1;
	var yst = (y - L < 0 ? 0 : y - L);
	var yen = (y + L < ImgH ? y + L : ImgH);
	for (var y1 = yst; y1 < yen; y1++){
		var cnt = 0;
		var y2 = parseInt(y1 + ImgW*(y - y1) / x);
		if (y2 < y - L || y + L <= y2)continue;
		for (var xi = 0; xi < ImgW; xi++){
			var yi = parseInt(y1 + xi*(y2 - y1) / ImgW);
			if (yi < 0 || ImgH <= yi)continue;
			if (Bin[yi*ImgW + xi] == 0)cnt++;
		}
		if (best < cnt){
			best = cnt;
			besty1 = y1;
			besty2 = y2;
		}
	}
	return [besty1, besty2, best];
}

//横直線の候補を推定
function HoughRow(horizontal = 0){
	var y1v=[], y2v=[], scv=[];
	for(var y=0;y<ImgH;y++){
		for(var x=1;x<ImgW && y<ImgH; x++){
			if(Bin[y*ImgW + x])continue;
			var tmp = XYToBESTY1Y2(x, y, parseInt(ZeroNumCol/4), horizontal);
			y1v.push(tmp[0]);
			y2v.push(tmp[1]);
			scv.push(tmp[2]);
			y+=5;
		}
		if(y1v.length > 30)break;
	}
	
	//回帰
	var best = 0.0;
	for (var i = 0; i < y1v.length; i++){
		for (var j = 0; j < i; j++){
			var a = y2v[j] - y2v[i];
			var b = y1v[j] - y1v[i];
			if (Math.abs(a*a + b*b) < 0.000000001)continue;
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
			if (best < sum && (!(a*b<0.0))){
				best = sum;
				y2_0 = y2v[i];
				y1_0 = y1v[i];
				ty2 = a;
				ty1 = b;
			}
		}
	}
}

function MakeRow(horizontal = 0){
	
	HoughRow(horizontal);
	
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
	
	var Yvec = [];
	for(var i=0;i<vec.length;i++){
		Yvec.push([y1_0 + vec[i] * ty1, y2_0 + vec[i] * ty2]);
	}
	Yvec.sort(function(a,b){
		if(a[0]<b[0])return -1;
		if(a[0]>b[0])return 1;
		return 0;
	});
	
	RowLines = [];
	RowLines[0] = [];
	RowLines[1] = [];
	RowLines[2] = [];
	for(var i=2;i<Yvec.length;i++){
		var f = 1;
		if (i - 3 >= 0){
			if ((Yvec[i - 2][0] - Yvec[i - 3][0] < Yvec[i - 1][0] - Yvec[i - 2][0])
			|| (Yvec[i - 2][1] - Yvec[i - 3][1] < Yvec[i - 1][1] - Yvec[i - 2][1]))f = 0;
		}
		if (i + 1 < Yvec.length){
			if ((Yvec[i][0] - Yvec[i - 1][0] > Yvec[i + 1][0] - Yvec[i][0])
			|| (Yvec[i][1] - Yvec[i - 1][1] > Yvec[i + 1][1] - Yvec[i][1]))f = 0;
		}
		if (f){
			RowLines[0].push(Yvec[i - 2]);
			RowLines[1].push(Yvec[i - 1]);
			RowLines[2].push(Yvec[i]);
			i += 2;
		}
	}
	return RowLines[0].length;
}
