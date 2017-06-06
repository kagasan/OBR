//画像
var img = new Image();

//グレースケールデータ
var Gray;

//画像情報(高さ, 幅)
var ImgH, ImgW;

//2値データ
var Bin;

//横線
var Ry1v, Ry2v;

//縦線
var Cx1v, Cx2v;

//墨字
var Chsv, Chxv, Chyv;

//実行関数
function OBR(){
	MakeGray();
	MakeBin();
	
	MakeRow();
	MakeCol();
	Recognition();
	Draw();
}
