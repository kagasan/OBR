var Gray;
var Bin;
var ImgW, ImgH;

//分布状態の変数
var ZeroNum;
var ZeroNumCol;
var ZeroNumColFlg = [];
var ZeroNumRow;
var ZeroNumRowFlg = [];

//膨張
function Expansion(){
	ZeroNum = 0;
	ZeroNumCol = 0;
	ZeroNumColFlg = [];
	for(var i=0;i<ImgW;i++)ZeroNumColFlg.push(0);
	ZeroNumRow = 0;
	ZeroNumRowFlg = [];
	for(var i=0;i<ImgH;i++)ZeroNumRowFlg.push(0);
	var tmp = [];
	for(var y= 0;y<ImgH;y++){
		for(var x=0;x<ImgW;x++){
			if(y==0 || x==0 || y+1==ImgH || x+1==ImgW){
				tmp.push(255);
				continue;
			}
			if(Bin[y*ImgW+x]==0)tmp.push(0);
			else if(Bin[(y)*ImgW+(x-1)]==0 || Bin[(y)*ImgW+(x+1)]==0 || Bin[(y-1)*ImgW+(x)]==0 || Bin[(y+1)*ImgW+(x)]==0)tmp.push(0);
			else tmp.push(255);
		}
	}
	for(var y=0, i=0;y<ImgH;y++){
		for(var x=0;x<ImgW;x++,i++){
			Bin[i] = tmp[i];
			if(Bin[i]==0){
				ZeroNum++;
				if(ZeroNumColFlg[x]==0){
					ZeroNumColFlg[x]=1;
					ZeroNumCol++;
				}
				if(ZeroNumRowFlg[y]==0){
					ZeroNumRowFlg[y]=1;
					ZeroNumRow++;
				}
			}
		}
	}
}

//収縮
function Contraction(){
	ZeroNum = 0;
	ZeroNumCol = 0;
	ZeroNumColFlg = [];
	for(var i=0;i<ImgW;i++)ZeroNumColFlg.push(0);
	ZeroNumRow = 0;
	ZeroNumRowFlg = [];
	for(var i=0;i<ImgH;i++)ZeroNumRowFlg.push(0);
	var tmp = [];
	for(var y= 0;y<ImgH;y++){
		for(var x=0;x<ImgW;x++){
			if(y==0 || x==0 || y+1==ImgH || x+1==ImgW){
				tmp.push(255);
				continue;
			}
			if(Bin[y*ImgW+x]==255)tmp.push(255);
			else if(Bin[(y)*ImgW+(x-1)]==255 || Bin[(y)*ImgW+(x+1)]==255 || Bin[(y-1)*ImgW+(x)]==255 || Bin[(y+1)*ImgW+(x)]==255)tmp.push(255);
			else tmp.push(0);
		}
	}
	for(var y=0, i=0;y<ImgH;y++){
		for(var x=0;x<ImgW;x++,i++){
			Bin[i] = tmp[i];
			if(Bin[i]==0){
				ZeroNum++;
				if(ZeroNumColFlg[x]==0){
					ZeroNumColFlg[x]=1;
					ZeroNumCol++;
				}
				if(ZeroNumRowFlg[y]==0){
					ZeroNumRowFlg[y]=1;
					ZeroNumRow++;
				}
			}
		}
	}
}

function Binarize(L=5, NoiseRemove = 0){
	//グレースケールデータ作成
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	
	if(img.width<=320 && img.height<=320){
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
		if(img.width>320 || img.height>320){
			w = 320;
			h = parseInt(img.height * 320 / img.width);
			if(img.width <= img.height){
				w = parseInt(img.width * 320 / img.height);
				h = 320;
			}
		}
		canvas.width = w;
		canvas.height = h;
		ImgH = h;
		ImgW = w;
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	}
	var Data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = Data.data;
	Gray=[];
	for(var i=0;i<data.length;i+=4){
		Gray.push((data[i]+data[i+1]+data[i+2])/3);
	}
	
	//カーネルの作成
	var Kernel = [];
	var K = 19;//カーネルサイズ(奇数)
	var hK = parseInt(K/2);//half Kernel
	var sigma = 7.0;//σ
	var s2 = sigma*sigma;//σ^2
	var Ksum = 0.0;
	for(var i=0;i<K;i++){
		var y=i-hK;
		var g = 1.0/(2.0*Math.PI*s2)*Math.exp(-y*y/(2.0*s2));
		Ksum+=g;
		Kernel.push(g);
	}
	for(var i=0;i<K;i++){
		Kernel[i]/=Ksum;
	}
	
	//縦方向ぼかし
	var tmpBlr = [];
	for(var y = 0; y < ImgH; y++){
		for(var x = 0; x<ImgW; x++){
			var sum = 0.0;
			for(var i = 0; i < K; i++){
				var ty = y + i - hK;
				if(ty < 0)ty = 0;
				if(ty >= ImgH)ty = ImgH - 1;
				sum += Kernel[i] * Gray[ty * ImgW + x];
			}
			tmpBlr.push(sum);
		}
	}
	
	//横方向ぼかしと2値化
	Bin = [];
	
	ZeroNum = 0;
	ZeroNumCol = 0;
	ZeroNumColFlg = [];
	for(var i=0;i<ImgW;i++)ZeroNumColFlg.push(0);
	ZeroNumRow = 0;
	ZeroNumRowFlg = [];
	for(var i=0;i<ImgH;i++)ZeroNumRowFlg.push(0);
	
	for(var y = 0; y < ImgH; y++){
		for(var x = 0; x < ImgW; x++){
			var sum = 0.0;
			for(var i = 0; i < K; i++){
				var tx = x + i - hK;
				if(tx < 0)tx = 0;
				if(tx >= ImgW)tx = ImgW -1;
				sum += Kernel[i] * tmpBlr[y * ImgW + tx];
			}
			if(sum - Gray[y*ImgW+x] < L)Bin.push(255);
			else{
				Bin.push(0);
				ZeroNum++;
				if(ZeroNumColFlg[x]==0){
					ZeroNumColFlg[x]=1;
					ZeroNumCol++;
				}
				if(ZeroNumRowFlg[y]==0){
					ZeroNumRowFlg[y]=1;
					ZeroNumRow++;
				}
			}
		}
	}
	for(var i= 0;i<NoiseRemove;i++)Contraction();
	for(var i= 0;i<NoiseRemove;i++)Expansion();
	
	//確認
	/*
	for(var i=0, j = 0;i<data.length;i+=4,j++){
		data[i] = Bin[j];
		data[i+1] = Bin[j];
		data[i+2] = Bin[j];
		data[i+3] = 255;
	}
	ctx.putImageData(Data,0,0);
	
	document.getElementById("Main").innerHTML = "<img src='" + canvas.toDataURL() + "'></br>";
	*/
}
