/*
makebin.js
グレースケール画像と2値画像を作成する
img -> Gray -> Bin, ImgH, ImgW
*/

//グレースケールデータ作成
function MakeGray(){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext('2d');
	canvas.width = img.width;
	canvas.height = img.height;
	ImgH = img.height;
	ImgW = img.width;
	ctx.drawImage(img,0,0);
	var Data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = Data.data;
	Gray=[];
	for(var i=0;i<data.length;i+=4){
		Gray.push((data[i]+data[i+1]+data[i+2])/3);
	}
}

function MakeBin(){
	//グレースケールデータ作成
	MakeGray();
	
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
	for(var y = 0; y < ImgH; y++){
		for(var x = 0; x < ImgW; x++){
			var sum = 0.0;
			for(var i = 0; i < K; i++){
				var tx = x + i - hK;
				if(tx < 0)tx = 0;
				if(tx >= ImgW)tx = ImgW -1;
				sum += Kernel[i] * tmpBlr[y * ImgW + tx];
			}
			if(sum - Gray[y*ImgW+x] < 5)Bin.push(255);
			else Bin.push(0);
		}
	}
}
