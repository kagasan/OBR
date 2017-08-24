var ParaNoiseRemove = [0, 1];
var ParaEstima = [5.0, 7.0];
var ParaBright = [5, 10];
var ParaHorizontal = [0, 1];

var ParaNum = 0;

function OBR(){
	if(firstimgflg==0){
		document.getElementById("Main").innerHTML = "<font color='red'>画像を選択してください。</font><br>この画像を保存して「画像選択」「実行」を試してみてください。<br><img src='img/50.png'>";
		return;
	}
	Binarize(ParaBright[(ParaNum&2?1:0)], ParaNoiseRemove[(ParaNum&8?1:0)]);
	if(MakeRow()==0 || ParaHorizontal[(ParaNum&1?1:0)]){
		MakeRow(1);
		MakeCol(1, ParaEstima[(ParaNum&4?1:0)]);
	}
	else{
		MakeCol(0, ParaEstima[(ParaNum&4?1:0)]);
	}
	FindDot();
}

function ParaChange(){
	ParaNum++;
	if(ParaNum>=16)ParaNum = 0;
	OBR();
}
