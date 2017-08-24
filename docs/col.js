//row.jsのcol版
/*
x1 = x1_0 + i * tx1
x2 = x2_0 + i * tx2
*/
var x1_0, x2_0;
var tx1, tx2;
var colst, colen;
var ColLines;

function XYToBestX1X2(x, y, L = 100, horizontal = 0){
	if(L>100)L=100;
	if(L<10)L=10;
	if(horizontal)L = 1;
	var bestx1;
	var bestx2;
	var best = -1;
	var xst = (x - L < 0 ? 0 : x - L);
	var xen = (x + L < ImgW ? x + L : ImgW);
	for (var x1 = xst; x1 < xen; x1++){
		var cnt = 0;
		var x2 = parseInt(x1 + ImgH*(x - x1) / y);
		if (x2 < x - L || x + L <= x2)continue;
		for (var yi = 0; yi < ImgH; yi++){
			var xi = parseInt(x1 + yi*(x2 - x1) / ImgH);
			if (xi < 0 || ImgW <= xi)continue;
			if (Bin[yi*ImgW + xi] == 0)cnt++;
		}
		if (best<cnt){
			best = cnt;
			bestx1 = x1;
			bestx2 = x2;
		}
	}
	return [bestx1, bestx2, best];
}

function HoughCol(horizontal = 0){
	var x1v = [], x2v = [], scv = [];
	for(var x=0;x<ImgW;x++){
		for(var y=1;y<ImgH && x<ImgW;y++){
			if(Bin[y*ImgW+x])continue;
			var tmp = XYToBestX1X2(x, y, ZeroNumRow / 5, horizontal);
			x1v.push(tmp[0]);
			x2v.push(tmp[1]);
			scv.push(tmp[2]);
			x+=5;
		}
		if(x1v.length>30)break;
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
			if (best < sum && (!(a*b<0.0))){
				best = sum;
				x2_0 = x2v[i];
				x1_0 = x1v[i];
				tx2 = a;
				tx1 = b;
			}
		}
	}
}

function MakeCol(horizontal = 0, estima = 5.0){
	HoughCol(horizontal);
	
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
			if (befsc < (ZeroNumCol/50));//<10
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
	
	var Xvec = [];
	for(var i=0;i<vec.length;i++){
		Xvec.push([x1_0 + vec[i] * tx1, x2_0 + vec[i] * tx2]);
	}
	Xvec.sort(function(a,b){
		if(a[0]<b[0])return -1;
		if(a[0]>b[0])return 1;
		return 0;
	});
	
	//推定
	for (var i = 0, L = Xvec.length; i + 2 < L; i++){
		var p1 = [Xvec[i][0] - Xvec[i + 2][0] + Xvec[i + 1][0], Xvec[i][1] - Xvec[i + 2][1] + Xvec[i + 1][1]];
		if (i == 0 && Xvec[i + 2][0] - Xvec[i + 1][0] > estima && Xvec[i + 2][1] - Xvec[i + 1][1] > estima)Xvec.push(p1);
		else if (i>=1 
			&& 1.7*(Xvec[i][0] - Xvec[i - 1][0] - Xvec[i + 2][0] + Xvec[i + 1][0]) > (Xvec[i + 2][0] - Xvec[i + 1][0])
			&& 1.7*(Xvec[i][1] - Xvec[i - 1][1] - Xvec[i + 2][1] + Xvec[i + 1][1]) > (Xvec[i + 2][1] - Xvec[i + 1][1])
			&& Xvec[i + 2][0] - Xvec[i + 1][0] > estima && Xvec[i + 2][1] - Xvec[i + 1][1] > estima
			){
			var f = 1;
			for (var j = L; j<Xvec.length; j++){
				if (Math.abs(p1[0] - Xvec[j][0])<estima && Math.abs(p1[1] - Xvec[j][1])<estima){
					f = 0;
				}
			}
			if(f)Xvec.push(p1);
		}
		var p2 = [Xvec[i + 2][0] + Xvec[i + 1][0] - Xvec[i][0], Xvec[i + 2][1] + Xvec[i + 1][1] - Xvec[i][1]];
		if (i + 3 == L && Xvec[i + 1][0] - Xvec[i][0] > estima && Xvec[i + 1][1] - Xvec[i][1] > estima)Xvec.push(p2);
		else if (i+3<L
			&& 1.7*(Xvec[i + 3][0] - Xvec[i + 2][0] - Xvec[i + 1][0] + Xvec[i][0]) > (Xvec[i + 1][0] - Xvec[i][0])
			&& 1.7*(Xvec[i + 3][1] - Xvec[i + 2][1] - Xvec[i + 1][1] + Xvec[i][1]) > (Xvec[i + 1][1] - Xvec[i][1])
			&& Xvec[i + 1][0] - Xvec[i][0] > estima && Xvec[i + 1][1] - Xvec[i][1] > estima
			){
			var f = 1;
			for (var j = L; j<Xvec.length; j++){
				if (Math.abs(p2[0] - Xvec[j][0])<estima && Math.abs(p2[1] - Xvec[j][1])<estima){
					f = 0;
				}
			}
			if (f)Xvec.push(p2);
		}
	}
	Xvec.sort(function(a,b){
		if(a[0]<b[0])return -1;
		if(a[0]>b[0])return 1;
		return 0;
	});
	//ここまで推定
	
	ColLines = [];
	ColLines[0] = [];
	ColLines[1] = [];
	
	for (var i = 1; i < Xvec.length;i++){
		var f = 1;
		if (i -2 >= 0){//左側チェック
			if (Xvec[i - 1][0] - Xvec[i - 2][0] < Xvec[i][0] - Xvec[i - 1][0]
			 || Xvec[i - 1][1] - Xvec[i - 2][1] < Xvec[i][1] - Xvec[i - 1][1])f = 0;
		}
		if (i+1<Xvec.length){//右側チェック
			if (Xvec[i][0] - Xvec[i - 1][0] > Xvec[i + 1][0] - Xvec[i][0]
			 || Xvec[i][1] - Xvec[i - 1][1] > Xvec[i + 1][1] - Xvec[i][1])f = 0;
		}
		if (f){
			ColLines[0].push(Xvec[i - 1]);
			ColLines[1].push(Xvec[i]);
			i++;
		}
	}
	
}
