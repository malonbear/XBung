;(function($, undefined) {
	//xbung数据结构
	window.xbung = {};
	window.xbung.common = {};
	//window.xbung.common.fn = {};
})(jQuery);

//添加taphold事件
;(function($, window, undefined) {
	var $document = $(document),
		triggerCustomEvent = function(obj, eventType, event) {
			var originalType = event.type;
			event.type = eventType;
			$.event.dispatch.call(obj, event);
			event.type = originalType;
		};
		
	$.event.special.taphold = {
		tapholdThreshold: 750,
		setup: function() {
			var thisObject = this,
				$this = $(thisObject);
			
			$this.bind('mousedown', function() {
				if(event.which && event.which !== 1) {
					return false;
				}
				var orignTarget = event.target;
				var	timer;
				var	clearTapHoldHandlers = function() {
						clearTimeout(timer);
						$document.off('mouseup', clearTapHoldHandlers);
					},
					clearAndTrigger = function() {
						clearTapHoldHandlers();
						triggerCustomEvent(thisObject, 'taphold', $.Event('taphold', {target: orignTarget}));
					};
					
				$document.on('mouseup', clearTapHoldHandlers);
				
				timer = setTimeout(clearAndTrigger, $.event.special.taphold.tapholdThreshold);
			});
		}
	};
	
	$.event.special.tapholdTouch = {
		tapholdTouchThreshold: 750,
		setup: function() {
			var thisObject = this,
				$this = $(thisObject);
			
			$this.bind('touchstart', function() {
				if(event.which && event.which !== 1) {
					return false;
				}
				var orignTarget = event.target;
				var	timer;
				var	clearTapHoldHandlers = function() {
						clearTimeout(timer);
						$document.off('touchend', clearTapHoldHandlers);
					},
					clearAndTrigger = function() {
						clearTapHoldHandlers();
						triggerCustomEvent(thisObject, 'tapholdTouch', $.Event('tapholdTouch', {target: orignTarget}));
					};
					
				$document.on('touchend', clearTapHoldHandlers);
				
				timer = setTimeout(clearAndTrigger, $.event.special.tapholdTouch.tapholdTouchThreshold);
			});
		}
	};
})(jQuery, this);

;(function($, undefined) {
	window.xbung.common.fn = {
		//点击改变背景颜色
		changeColorBG: function(event) {
			var target = $(event.target),
				$document = $(document),
				colorClsData = event.data,
				_touchendFn = function() {
					if(typeof(colorClsData) === 'undefined') {
						target.removeClass('clicked-normal-xb');
					} else {
						target.removeClass(colorClsData.colorCls);
					}
					$document.off('touchend',_touchendFn);
				};
			
		},
		
		//查找数据库，将每一个按钮显示的名称更新
		showNameBtnGrp: function(tblOri, tblLink, cntBtn) {
			var execSqlStmt = 'SELECT ' + tblLink + '.btnId, name, targetId FROM ' + tblOri +
							', ' + tblLink + ' WHERE ' + tblOri + '.id = ' + tblLink + 
							'.targetId LIMIT ' + cntBtn;
			var btnGrp = $('.key-xb:not(:last)');
			var db = window.xbung.db;
			btnGrp.append('<span class="icon-add-xb"></span>');
			db.transaction(function(tx) {
				tx.executeSql(execSqlStmt, [], function(tx, rs) {
					var rsLen = rs.rows.length;
					for(var i = 0; i < rsLen; i++) {
						var rsItem = rs.rows.item(i);
						btnGrp.eq(rsItem.btnId - 1)
							.text(rsItem.name)
							.remove('.icon-add-xb')
							.data('targetId', rsItem.targetId);
					}
				}, function(tx, err) {
					alert('showNameBtnGrp error =>' + err.source + ' :: ' + err.message);
				});
			});
		},
		
		//点击有效按钮后，状态转化为无效
		trStatOff: function() {
			var $this = $(this);
			var clickedTr = $this.parent();
			//状态变为off
			clickedTr.removeClass('tr-On-xb').addClass('tr-Off-xb');
			//焦点单元失去焦点,本行元素不能编辑
			clickedTr.children('.editable-xb').removeClass('focused-xb editable-xb');
			//图标变化，将on图标变为off图标
			$this.children().removeClass('icon-checkbox-on-xb').addClass('icon-checkbox-off-xb');
			//展开的行需要off掉
			if(clickedTr.hasClass('tr-open-xb')) {
				clickedTr.next().addClass('tr-Off-xb');
			};
		},
		
		//点击按钮后，状态转化为有效
		trStatOn: function(editableColCls) {
			var $this = $(this);
			var clickedTr = $this.parent();
			//状态变为off
			clickedTr.removeClass('tr-Off-xb').addClass('tr-On-xb');
			//本行元素能编辑
			for(var i = 0; i < editableColCls.length; i++) {
				clickedTr.children(editableColCls[i]).addClass('editable-xb');
			};
			//clickedTr.children('.editable-xb').removeClass('focused-xb, editable-xb');
			//图标变化，将off图标变为on图标
			$this.children().removeClass('icon-checkbox-off-xb').addClass('icon-checkbox-on-xb');
			//展开的行需要状态变为on
			if(clickedTr.hasClass('tr-open-xb')) {
				clickedTr.next().removeClass('tr-Off-xb');
			};
		},
		
		//点击more按钮，弹出more内容，同时根新各种类
		moreOpen: function(contentHtml) {
			var $this = $(this);
			var clickedTr = $this.parent();
			//状态是打开的
			clickedTr.addClass('tr-open-xb');

			//如果曾经打开过，就不需要添加内容了
			if(!clickedTr.next().hasClass('moreContent-xb')) {
				clickedTr
					.after(contentHtml)
					.next()
					.addClass('moreContent-xb');
			} else {
				clickedTr
					.next()
					.show();
			};
			//更换图标
			$this
				.children()
				.removeClass('icon-more-open-xb bgClr-gray-xb')
				.addClass('icon-more-close-xb bgClr-carrot-xb');
			//如果原始tr的状态是off的，需要是弹出的more内容同样是off
			if(clickedTr.hasClass('tr-Off-xb')) {
				clickedTr
					.next()
					.addClass('tr-Off-xb');
			} else {
				//如果原始tr的状态是on的，需要是弹出的more内容同样是on，移除off
				clickedTr
					.next()
					.removeClass('tr-Off-xb');
			};
		},
		
		//点击关闭more按钮，收缩more内容，同时根新各种类
		moreClose: function() {
			var $this = $(this);
			var clickedTr = $this.parent();
			clickedTr
				.removeClass('tr-open-xb')
				.next()
				.hide();
			$this
				.children()
				.addClass('icon-more-open-xb bgClr-gray-xb')
				.removeClass('icon-more-close-xb bgClr-carrot-xb');
		},
		
		//添加焦点
		focuse: function() {
			$('.focused-xb').removeClass('focused-xb');
			$(this).addClass('focused-xb');
		},
		
		//显示对话框
		showReveal: function() {
			$('.reveal-xb').show();
			$('.revealBG-xb').show();
		},
		
		//隐藏对话框
		hideReveal: function() {
			$('.reveal-xb').hide();
			$('.revealBG-xb').hide();
		}
	};
})(jQuery);
