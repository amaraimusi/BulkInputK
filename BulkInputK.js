/**
 * 一括入力K
 * 
 * @note
 * 入力テキストエリアにTSV形式でデータを張り付けると、データがテーブル形式で表示される。
 * さらに一括登録ボタンを押すとデータをJSON形式でAJAX送信する。
 * 
 * @date 2018-10-16
 * @version 1.0.0
 * 
 */
class BulkInputK{
	
	
	/**
	 * コンストラクタ
	 * 
	 */
	constructor(){
		
	}
	
	/**
	 * 初期化
	 * 
	 * @param param
	 * - main_slt メイン要素のセレクタ
	 */
	init(param){
		this.param = this._setParamIfEmpty(param);
		
		console.log(this.param.main_slt);//■■■□□□■■■□□□■■■□□□)
		this.mainElm = jQuery(this.param.main_slt);
		
		var test_data_str = this._getTestDataStr(); // テストデータ文字列
		var html = "<textarea class='bik_ta' style='width:100%;height:100px'>" + test_data_str + "</textarea>";
		html += "<input class='bik_read_btn btn btn-primary btn-sm' type='button' value='読込' />";
		html += "<table class='bik_tbl table'><tbody></tbody></table>";
		
		this.mainElm.append(html);
		
		var readBtnElm = this.mainElm.find('.bik_read_btn');
		readBtnElm.click((e) => {
			this._previewData();
		});
		
		console.log('test=Ａ3');//■■■□□□■■■□□□■■■□□□)
	}

	
	/**
	 * If Param property is empty, set a value.
	 */
	_setParamIfEmpty(param){
		
		if(param == null) param = {};

		if(param['main_slt'] == null) throw new Error("Empty 'main_slt'")
		
		return param;
	}
	
	
	_previewData(){
		
		var taElm = this._getTaElm();
		var tblElm = this._getTblElm(); // プレビューテーブル要素を取得
		
		var data_str = taElm.val();
		var data = this._expansionData(data_str); // データ展開
		
		this._xssSanitaizeAll(data); // XSSサニタイズ
		console.log('test=Ａｘｘｘ2月');//■■■□□□■■■□□□■■■□□□)
		
		var tbody_html = '';
		for(var i in data){
			tbody_html += '<tr>';
			var ent = data[i];
			for(var e_i in ent){
				tbody_html += '<td>';
				var v = ent[e_i];
				tbody_html += v;
				tbody_html += '</td>';
			}
			tbody_html += '</tr>';
		}
		
		tblElm.find('tbody').html(tbody_html);
	}
	
	/**
	 * データ展開
	 * @param string data_str データ文字列
	 * @reutrn object データ
	 */
	_expansionData(data_str){
		var ary = data_str.split(/\r\n|\r|\n/);

		var data=[];//データ
		
		
		for (var i=0;i<ary.length;i++){
			var row=ary[i];
			var dd=row.split(/\t/);

			data.push(dd);

		}
		
		return data;
	}
	
	
	_getTaElm(){
		if(this.taElm == null){
			this.taElm = this.mainElm.find('.bik_ta');
		}
		return this.taElm;
	}
	
	
	/**
	 * プレビューテーブル要素を取得
	 * @return プレビューテーブル要素
	 */
	_getTblElm(){
		if(this.tblElm == null){
			this.tblElm = this.mainElm.find('.bik_tbl');
		}
		return this.tblElm;
	}
	
	
	
	/**
	 * テストAJAX
	 */
	execute(){
		var data={'neko':'ネコ','same':{'hojiro':'ホオジロザメ','shumoku':'シュモクザメ'},'xxx':111};

		data = this._escapeForAjax(data); // Ajax送信データ用エスケープ。実体参照（&lt; &gt; &amp; &）を記号に戻す。
		var json_str = JSON.stringify(data);//データをJSON文字列にする。

		// AJAX
		$.ajax({
			type: "POST",
			url: "test.php",
			data: "key1="+json_str,
			cache: false,
			dataType: "text",
		})
		.done((str_json, type) => {
			var ent;
			try{
				ent =jQuery.parseJSON(str_json);//パース
				jQuery("#res").html(str_json);
				
			}catch(e){
				alert('エラー');
				jQuery("#err").html(str_json);
				return;
			}
			
			this.test1();
		})
		.fail((jqXHR, statusText, errorThrown) => {
			jQuery('#err').html(jqXHR.responseText);
			alert(statusText);
		});
	}
	
	
	
	
	
	/**
	* データをXSSサニタイズする
	* 
	* Objectや配列型にも対応している。
	* @param multi サニタイズ前のデータ
	* @return サイニタイズ後のデータ
	* 
	*/
	_xssSanitaizeAll(data){
		if (typeof data == 'string'){
			
			if ( data != null || isNaN(data)) {
				data = data.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
				return data;
			}else{
				return data;
			}
		}else if (typeof data == 'object'){
			for(var i in data){
				data[i] = this._xssSanitaizeAll(data[i]);
			}
			return data;
		}else{
			return data;
		}
	}
	
	


	/**
	 * ローカルストレージにパラメータを保存する
	 */
	saveParam(){
		var lsParam = {};
		for(var i in self.saveKeys){
			var s_key = self.saveKeys[i];
			lsParam[s_key] = self.param[s_key];
		}
		var param_json = JSON.stringify(lsParam);
		localStorage.setItem(self.ls_key,param_json);
	}
	
	
	/**
	 * ローカルストレージで保存しているパラメータをクリアする
	 */
	clear(){
		localStorage.removeItem(self.ls_key);
	}

	
	/**
	 * テストデータ文字列を取得する
	 * @return string テストデータ文字列
	 */
	_getTestDataStr(){
		return "id&#x0009;コード&#x0009;名前&#x0009;備考&#13;1&#x0009;neko&#x0009;猫&#13;2&#x0009;yagi&#x0009;山羊&#x0009;草食&#13;3&#x0009;same&#x0009;鮫&#13;4&#x0009;wasi&#x0009;鷲&#13;5&#x0009;goki&#x0009;御器";
	}



	// Check empty.
	_empty(v){
		if(v == null || v == '' || v=='0'){
			return true;
		}else{
			if(typeof v == 'object'){
				if(Object.keys(v).length == 0){
					return true;
				}
			}
			return false;
		}
	}
	
	
}
