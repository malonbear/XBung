;(function($, undefined) {
	window.xbung.index = {};
	window.xbung.index.fn = {};
	
		//当每行的价格或者数量被列为焦点的时候，更新每一行的价格总数
	var	updateTotalTr = function() {
			var focusedTr = $('.focused-xb').parent();
			if(focusedTr.length !== 0) {
				var priceStr = focusedTr.children('.productPrice-xb').text();
				var numStr = focusedTr.children('.productNum-xb').text();
				
				//价格和数量都不为空才计算
				if((priceStr !== '') && (numStr !== '')) {
					//界面上面小数点前后分别有一个空格，便于使用者观看，在计算的时候需要去掉这两个空格
					priceStr = priceStr.replace(/ . /, '.');
					//只有一个小数点，为了计算，将其赋值为0
					if(priceStr === '.') {
						priceStr = '0';
					};
					
					var price = parseFloat(priceStr);
					var num = parseInt(numStr);
					//每一行的总价格
					var totalTr = price * num;
					var totalTrStr;
					//javascript 对于小数不能精确表示，可能出现6.0在计算时是6.0000000001，需要保存6位小数，解决计算时候精度引起的问题,同时去掉小数后面末尾的0
					totalTr = parseFloat(totalTr.toFixed(6));
					//转化为字符串显示在界面上，同时小数点恢复前后有一个空格，显示便于观看
					totalTrStr = totalTr + '';
					totalTrStr = totalTrStr.replace(/\./, ' . ');
					focusedTr.children('.productTotal-xb').text(totalTrStr);
				} else {
					focusedTr.children('.productTotal-xb').text('0');
				};
			};
		},
		
		//更新所有商品的总价格
		updateTotal = function() {
			// updateTotalTr();
			var total = 0;
			$('.productTotal-xb:not(empty)').each(function() {
				var $this = $(this);
				//只有状态是有效时，才将这一行的价格纳入总价格
				//var statOn = $this.parent().children('.tbStat-xb').find('.icon-checkbox-on-xb');
				if($this.parent().hasClass('tr-On-xb')) {
					var totalTrStr = $this.text();
					//界面上面小数点前后分别有一个空格，便于使用者观看，在计算的时候需要去掉这两个空格
					totalTrStr = totalTrStr.replace(/ . /, '.');
					var totalTr = parseFloat(totalTrStr);
					total += totalTr;
				};
			});
			
			//javascript 对于小数不能精确表示，可能出现6.0在计算时是6.0000000001，需要保存6位小数，解决计算时候精度引起的问题,同时去掉小数后面末尾的0
			total = parseFloat(total.toFixed(6));
			//界面显示
			$('#totalMoneyID').text(total);
		},
		
		//添加按钮点击事件，当点击一个按钮，在recording栏增加相应输入的name
		addRecording = function() {
			var $clickedProduct = $(this),
				clickedProductName = $clickedProduct.text(),
				clickedProductId = $clickedProduct.data('targetId');
				
			if(clickedProductName !== '') {
				var $recordingFillTr = $('.tbStat-xb:empty:first').parent();
				if($recordingFillTr.length === 0) {
					var recodingTr = '<tr class="tr-On-xb">' +
    							'<td class="tbStat-xb"></td>' +
    							'<td class="productName-xb"></td>' +
    							'<td class="productPrice-xb"></td>' +
    							'<td class="productNum-xb"></td>' +
    							'<td class="productTotal-xb"></td>' +
    							'<td class="tbMore-xb"></td>' +
    						'</tr>';
    				$('#recordingTblID').append(recodingTr);
				};
				
				$recordingFillTr = $('.tbStat-xb:empty:first').parent();
				$recordingFillTr.addClass('tr-On-xb');
				//状态为激活
				$recordingFillTr
					.children('.tbStat-xb')
					.append('<span class="icon-checkbox-xb icon-checkbox-on-xb"></span>');
				//记录栏产品名称
				$recordingFillTr
					.children('.productName-xb')
					.text(clickedProductName)
					.data('targetId', clickedProductId);
				//初始化总价为0
				$recordingFillTr
					.children('.productTotal-xb')
					.text('0');
				//更多按钮的图标
				$recordingFillTr
					.children('.tbMore-xb')
					.append('<span class="icon-18-w-xb icon-more-open-xb icon-18-borderR-xb bgClr-gray-xb"></span>');
				//去除原来的焦点，便于将焦点集中到新的一行
				$('.focused-xb').removeClass('focused-xb');
				//新的焦点
				$recordingFillTr
					.children('.productPrice-xb')
					.addClass('focused-xb');
				//数量和单价可编辑
				$recordingFillTr
					.children('.productPrice-xb, .productNum-xb')
					.addClass('editable-xb');
			};
		},
		
		//点击勾选按钮后，状态变为无效，需要清空工作和重新计算价格总数
		trStatOffFn = function() {
			window.xbung.common.fn.trStatOff.call(this, arguments);
			updateTotal();
		},
		
		//点击无效勾选按钮后，状态变为有效，需要清空工作和重新计算价格总数
		trStatOnFn = function() {
			window.xbung.common.fn.trStatOn.call(this, ['.productPrice-xb', '.productNum-xb']);
			updateTotal();
		},
		
		//点击关闭more按钮，收缩more内容，同时根新各种类
		recodingMoreOpen = function() {
			var contentHtml = '<tr>' +
								'<td></td>' +
								'<td colspan="4"><div></div></td>' +
								'<td></td>' +
								'</tr>';
			window.xbung.common.fn.moreOpen.call(this,contentHtml);
		},
		
		//点击关闭more按钮，收缩more内容，同时根新各种类
		recodingMoreClose = function() {
			window.xbung.common.fn.moreClose.call(this, arguments);
		},
		
		//点击数字按钮后，对焦点区域输入数字
		addNum = function() {
			var focusedCell = $('.focused-xb');
			if(focusedCell.length === 1) {
				var text = focusedCell.text() + $(this).text();
				focusedCell.text(text);
			};
			updateTotalTr();
			updateTotal();
		},
		
		//点击小数点后，添加小数点
		dotClicked = function() {
			var focusedCell = $('.focused-xb');
			if(focusedCell.length === 1) {
				if(focusedCell.hasClass('productPrice-xb')) {
					var text = focusedCell.text(); 
					if(text.match(' . ') === null) {
						focusedCell.text(text + ' . ');
					};
				};
			};
			updateTotalTr();
			updateTotal();
		},
		
		//点击后退按钮，对焦点区域的数字进行删除最后一个数字
		backSpace = function() {
			var focusedCell = $('.focused-xb');
			if(focusedCell.length === 1) {
				var text = focusedCell.text();
				var len = text.length;
				if(len !== 0) {
					//如果有小数点需要删除3个字符，因为小数点前后有空格
					if(text.slice(len - 1) === ' ') {
						text = text.slice(0, len - 3);
						focusedCell.text(text);
					} else {
						text = text.slice(0, len - 1);
						focusedCell.text(text);
					};
				};
			};
			updateTotalTr();
			updateTotal();
		},
		
		//清除所有记录
		clearRecording = function(event) {
			event.preventDefault();
			var recordingTrTotal = '';
			var recordingTr = '<tr>' +
    							'<td class="tbStat-xb"></td>' +
    							'<td class="productName-xb"></td>' +
    							'<td class="productPrice-xb"></td>' +
    							'<td class="productNum-xb"></td>' +
    							'<td class="productTotal-xb"></td>' +
    							'<td class="tbMore-xb"></td>' +
    						'</tr>';
    		$('#recordingTblID tbody').empty();
    		for(var i = 0;i < 5;i++) {
    			recordingTrTotal += recordingTr;
    		};
    		$('#recordingTblID tbody').append(recordingTrTotal);
    		$('#totalMoneyID').text('0');
		},
		
		//点击确定按钮，焦点区域后移动，直到最后一个可编辑单元
		numKeyOkClicked = function() {
			var $editCell = $('.editable-xb');
			var len = $editCell.length;
			for(var i = 0; i < len; i++) {
				if($editCell.eq(i).hasClass('focused-xb') && (i !== len - 1)) {
					$editCell.eq(i).removeClass('focused-xb');
					$editCell.eq(i + 1).addClass('focused-xb');
					break;
				};
			};
		},
		
		//计算数据总行数
		dataRowCnt = function() {
			var rowCnt = Database.rowCnt_product();
			return rowCnt;
		},
		//当点击下一页，上一页时，在界面显示内容
		showProductPage = function(pageNum) {
			var db = window.xbung.db,
				$trProduct = $('#productTblID tbody tr'),
				rowCnt = $trProduct.size(),
				start = (pageNum - 1) * rowCnt,
				contentTr = '<td class="productName-xb"></td>' +
							'<td class="productCost-xb"></td>' +
							'<td class="productDescription-xb"></td>';
			
			var _showRsFn = function(txShowRs, rsShowRs) {
				var rsLenShowRs = rsShowRs.rows.length,
					i = 0;
								// '<td class="tbEdit-xb"></td>' +
								// '<td class="tbMore-xb"></td>'; 
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
	    						// $this.addClass('tr-On-xb');
	    						$this.children('.productName-xb').text(rsItem.name);
	    						$this.children('.productCost-xb').text(rsItem.cost);
	    						$this.children('.productDescription-xb').text(rsItem.description);
	    						// $this.children('.tbEdit-xb').html('<span class="icon-18-w-xb icon-edit-18-xb icon-18-borderR-xb bgClr-gray-xb"></span>');
	    						// $this.children('.tbMore-xb').html('<span class="icon-18-w-xb icon-more-open-xb icon-18-borderR-xb bgClr-gray-xb"></span>');
	    					};
	    				});
			};
			
			/*
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
			
			*/
			
			
			if(pageNum == 0) { //没有数据，显示为空
				$trProduct
    				.removeClass()
    				.empty()
    				.append(contentTr);
			} else {
				db.transaction(function(txShowRs) {
					var execSqlStmt = 'SELECT name, cost, description FROM product LIMIT ' + rowCnt + ' OFFSET ' + start;
					txShowRs.executeSql(execSqlStmt, [], _showRsFn, function(txShowRs, err) {
						alert('lookup table product error => ' + err.source + ' :: ' + err.message);
					});
				});
			};
		},
		
		//显示产品界面
		showProductReveal = function() {
				
			var editProductPageObj = {
				btnGrpID: 'productTblPageBtnGrpID',
				showPageFn: showProductPage,
				dataRowCntFn: dataRowCnt,
				listPageCnt: 9
			};
			
			var editProductPage = new Pagination(editProductPageObj);
			
			var hideRelEventFn = function() {
				editProductPage.relEventFn();
			};
			//显示背景和框
			window.xbung.common.fn.showReveal('productTblRevealID', hideRelEventFn);
			//在框中填入第一页数据
			//显示page的内容，初始化各种事件
			editProductPage.init();
		};
		
		window.xbung.index.fn = {
			updateTotal: updateTotal,
			addRecording: addRecording,
			trStatOffFn: trStatOffFn,
			trStatOnFn: trStatOnFn,
			recodingMoreOpen: recodingMoreOpen,
			recodingMoreClose: recodingMoreClose,
			addNum: addNum,
			dotClicked: dotClicked,
			backSpace: backSpace,
			clearRecording: clearRecording,
			numKeyOkClicked: numKeyOkClicked,
			showProductPage: showProductPage,
			showProductReveal: showProductReveal
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
	
	database.delTbl();
	
	//创建数据库表，设置各种标志，得到数据库表的行数
	database.init();
	
	database.insertProductData();
	
	window.xbung.common.fn.showNameBtnGrp('product', 'productBtnGrp', 17);
	
})(jQuery);	

;(function($, undefined) {
	//产品按钮
	var productKeyBtnGrp = $('.key-xb:not(:last)');

	
	
	//产品按钮绑定tapholdouch事件，激发后，按键缩小，可以添加按钮的名称，处于可编辑状态
	var editProductFn = function() {
		$('.mask-xb').show();
		$('.key-xb').animate({
			padding: '10px',
			borderWidth: '6px 7px 7px 6px',
		}, 'fast');
		//长按键盘后，取消点击按钮就记录产品的事件
		productKeyBtnGrp.off('touchend', window.xbung.index.fn.addRecording);
		//取消tapholdTouch事件，以免引起多次触发
		$(this).off('tapholdTouch', editProductFn);
		//显示产品框
		$('#productKeyID').on('touchstart', window.xbung.index.fn.showProductReveal);
		
	};
		
	//长按后缩小按钮,出于可编辑状态
	$('#productKeyID').on('tapholdTouch', editProductFn);
	
	//点击屏蔽层，恢复原状
	var unEditProductFn = function() {
		$('.key-xb').animate({
			padding: '16px',
			borderWidth: '0px 1px 1px 0px',
		}, 'fast');
		//恢复tapholdTouch事件，长按后可处于可编辑状态
		$('#productKeyID').on('tapholdTouch', editProductFn);
		//取消点击显示产品框
		$('#productKeyID').off('touchstart', window.xbung.index.fn.showProductReveal);
		//恢复点击按钮就记录产品
		productKeyBtnGrp.on('touchend', window.xbung.index.fn.addRecording);
		$('.mask-xb').hide();
	};
	$('.mask-xb').on('touchstart', unEditProductFn);
	
	//恢复点击按钮就记录产品
	productKeyBtnGrp.on('touchend', window.xbung.index.fn.addRecording);
	//点击勾选按钮后，状态变为无效，需要清空工作和重新计算价格总数
	$('#recordingTblID').on('touchstart', '.tr-On-xb .tbStat-xb', window.xbung.index.fn.trStatOffFn);
	//点击无效勾选按钮后，状态变为有效，需要清空工作和重新计算价格总数
	$('#recordingTblID').on('touchstart', '.tr-Off-xb .tbStat-xb', window.xbung.index.fn.trStatOnFn);
	
	//点击more按钮，弹出more的内容
	//$('#recordingTblID').on('touchstart', 'tr:not(.tr-open-xb) .tbMore-xb', window.xbung.index.fn.recodingMoreOpen);
	$('#recordingTblID').on('touchstart', 'td.tbMore-xb', window.xbung.index.fn.recodingMoreOpen);
	//点击关闭more按钮，收缩more的内容
	$('#recordingTblID').on('touchstart', 'tr.tr-open-xb td.tbMore-xb', window.xbung.index.fn.recodingMoreClose);
	//对点击的可编加td添加焦点
	$('#recordingTblID').on('touchstart', '.editable-xb', window.xbung.common.fn.focuse);
	
	//点击数字按钮，在焦点区域输入数字
	$('.numKey-xb').on('touchstart', window.xbung.index.fn.addNum);
	//点击小数点按钮，在焦点区域输入小数点
	$('#dotID').on('touchstart', window.xbung.index.fn.dotClicked);
	//点击backspace按钮，删除最后一位数
	$('#backspaceKeyID').on('touchstart', window.xbung.index.fn.backSpace);
	//点击清空按钮，清空所有内容
	$('#clearRecordingID').on('touchstart', window.xbung.index.fn.clearRecording);
	//点击确定按钮，焦点区域后移动，直到最后一个可编辑单元
	$('#numKeyOKID').on('touchstart', window.xbung.index.fn.numKeyOkClicked);
	//
})(jQuery);	
//};
});