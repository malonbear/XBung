;(function($, undefined) {
	window.xbung.product = {};
	window.xbung.product.fn = {};
	
	//检查每一行是否有输入，排除输入为空格的情况，当有输入的情况下，添加勾选的图标
	var checkBlank = function() {
		var $input = $(this),
			$tr = $input.parents('tr'),
			value = $input.val() + '',
			$inDBStat = $tr.children('.tbStat-xb'),
			pattBlank = new RegExp('\\S');
		
		if(pattBlank.test(value)) {
			var stat = $inDBStat.html();
			if(stat === '') {
				$tr
					.addClass('tr-On-xb')//状态为激活
					.children('.tbStat-xb')
					.append('<span class="icon-checkbox-xb icon-checkbox-on-xb"></span>');
			};
		} else {
			var allInput = $tr.find('input'),
				clear = true,
				content;
			allInput.each(function() {
				content = $(this).val() + '';
				if(pattBlank.test(content)) {
					clear = false;
					return false;
				};
			});
			
			if(clear === true) {
				$inDBStat.empty();
				$tr.removeClass('tr-On-xb');
			};
		};
	},
	
	//提交时，对提交内容进行检测,并存在数据库
	submitProduct = function() {
		var $productTr = $('tr.tr-On-xb'),
			pattBlank = new RegExp('\\S'),//检查空白字符
			pattNum = new RegExp('^\\d*\\.?\\d*$'),//检查数字
			pattSQL1 = new RegExp("\\'"),//不能输入英文单引号，防止SQL错误
			pattSQL2 = new RegExp('\\"'),//不能输入英文双引号，防止SQL错误
			submitOK = true,
			db = window.xbung.db;
			
		var _inDBProduct = function() {
			db.transaction(function(tx) {
				$productTr.each(function() {
					var $this = $(this),
						productName = $this.find('.productName-xb input').val(),
						productCost = $this.find('.productCost-xb input').val(),
						productDescription = $this.find('.productDescription-xb input').val();
						
					var execSqlStmt = 'INSERT INTO product(name, cost, description) VALUE(\"' +
						productName + '\", ' + productCost + '\", ' + productDescription + '\")';
						
					tx.executeSql(execSqlStmt, [], null, function(tx, err) {
						alert('插入product表失败！\n' + err.source + '::' + err.message);
					});
				});
			});
		};
		
		$productTr.each(function() {
			var $this = $(this),
				productName = $this.find('.productName-xb input').val();
				if(pattBlank.test(productName) === false || pattSQL1.test(productName) === true || pattSQL2.test(productName) === true) {
					submitOK = false;
					$(this).addClass('trErro');
					return true;
				};
				
			//检查是不是数字
			var productCost = $this.find('.productCost-xb input').val();
			if(pattBlank.test(productCost) === false || 
				pattNum.test(productCost) === false || 
				pattSQL1.test(productCost) === true || 
				pattSQL2.test(productCost) === true) {
				submitOK = false;
				$(this).addClass('trErro');
				return true;
			};
			
			var productDescription = $this.find('.productDescription-xb input').val();
			if(pattBlank.test(productDescription) === false || 
				pattSQL1.test(productDescription) === true || 
				pattSQL2.test(productDescription) === true) {
				submitOK = false;
				$(this).addClass('trErro');
				return true;
			};
			$this.removeClass('trErro');
		});
		
		if(submitOK === true) {
			_inDBProduct();
		} else {
			alert('数据格式有问题，请修改后提交！')
		};
	},
	
	//当点击下一页，上一页时，在界面显示内容
	showProductPage = function(pageNum) {
		var db = window.xbung.db,
			$trProduct = $('#productTblID tbody tr'),
			rowCnt = $trProduct.size(),
			start = (pageNum - 1) * rowCnt;
		
		var _showRsFn = function(txShowRs, rsShowRs) {
			var rsLenShowRs = rsShowRs.rows.length,
				i = 0,
				contentTr = '<td class="productName-xb"></td>' +
							'<td class="productCost-xb"></td>' +
							'<td class="productDescription-xb"></td>' +
							'<td class="tbEdit-xb"></td>' +
							'<td class="tbMore-xb"></td>'; 
    			$trProduct
    				.removeClass()
    				.empty()
    				.append(contentTr)
    				.each(function() {
    					var $this = $(this);
    					//$this.append(contentTr);
    					if(i < rsLenShowRs) {
    						var rsItem = rsShowRs.rows.item(i);
    						i++;
    						$this.addClass('tr-On-xb');
    						$this.children('.productName-xb').text(rsItem.name);
    						$this.children('.productCost-xb').text(rsItem.cost);
    						$this.children('.productDescription-xb').text(rsItem.description);
    						$this.children('.tbEdit-xb').html('<span class="icon-18-w-xb icon-edit-18-xb icon-18-borderR-xb bgClr-gray-xb"></span>');
    						$this.children('.tbMore-xb').html('<span class="icon-18-w-xb icon-more-open-xb icon-18-borderR-xb bgClr-gray-xb"></span>');
    					};
    				});
		};
		
		var _countFn = function(tx, rs) {
			var rsLen = rs.rows.item(0).cnt;
			if(start < rsLen) {
				db.transaction(function(txShowRs) {
					var execSqlStmt = 'SELECT name, cost, description FROM product LIMIT ' + rowCnt + ' OFFSET ' + start;
					txShowRs.executeSql(execSqlStmt, [], _showRsFn, function(txShowRs, err) {
						alert('lookup table product error => ' + err.source + ' :: ' + err.message);
					});
				});
			};
		};
		
		db.transaction(function(tx) {
			var execSqlStmt = 'SELECT count(*) AS cnt FROM product';
			tx.executeSql(execSqlStmt, [], _countFn, function(tx, err) {
				alert('lookup table product count error => ' + err.source + ' :: ' + err.message);
			});
		});
	};
	
	//加入全局变量
	window.xbung.product.fn = {
		checkBlank: checkBlank,
		submitProduct: submitProduct,
		showProductPage: showProductPage
	};
})(jQuery);	

;$(document).ready(function() {
//document.addEventListener("deviceready", onDeviceReady, false);
//function onDeviceReady() {
//数据库操作，建立各种table
;(function($, undefined) {
	//建立数据库类实例
	database = new Database();
	
	//新建或者打开数据库
	var db = database.openDatabase();
	//添加为全局变量，便于调用
	window.xbung.db = db;
	
	//做实验，先显示第一页
	window.xbung.product.fn.showProductPage(1);
	
})(jQuery);	

//};
;(function($, undefined) {
	//点击增加按钮，弹出对话框
	$('#addProductID').on('touchend', window.xbung.common.fn.showReveal);
	
	//点击背景，对话框消失
	$('.revealBG-xb').on('touchend', window.xbung.common.fn.hideReveal);
	
	//输入产品数据后，显示对应的图标，包括表示有效的绿色勾等
	$('#productInDBTbl input').on('keyup change', window.xbung.product.fn.checkBlank);
})(jQuery);	
});