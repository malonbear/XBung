//pagination
var Pagination = function(obj) {
	//显示数据的列表ID，字符串
	//this._listID = obj.listID;
	//操作的按键组ID，字符串
	this._btnGrpID = obj.btnGrpID;
	//显示一页数据
	this._showPageFn = obj.showPageFn;
	//计算数据库中数据总行数，并返回
	this._dataRowCntFn = obj.dataRowCntFn;
	//界面显示列表一共有多少行？
	this._listPageCnt = obj.listPageCnt;
	//跳转按钮组
	this._$btnGrp = $('#' + this._btnGrpID);
	//跳转按钮
	this._$showPageBtn = this._$btnGrp.find('.showPage-xb');
	//next
	this._$nextBtn = this._$btnGrp.find('.next-xb');
	//previous
	this._$prevBtn = this._$btnGrp.find('.previous-xb');
	//start
	this._$pageStartBtn = this._$btnGrp.find('.pageStart-xb');
	//end
	this._$pageEndBtn = this._$btnGrp.find('.pageEnd-xb');
	//设置goto界面显示的当前页和总页数
	showCurTotalPage = function(cur, total) {
		this._$showPageBtn.text(cur + '/' + total);
	};
	//next事件函数
	this.nextFn = function(event) {
		var thiz = event.data.context;
		var curPage = thiz._$showPageBtn.data('status').curPage,
			totalPage = thiz._$showPageBtn.data('status').totalPage;
			
		//当前页为最后一页，直接返回
		if(curPage == totalPage) {
			return;
		};
		
		//设置goto界面显示的当前页和总页数
		showCurTotalPage.call(thiz, curPage + 1, totalPage);
		//显示下一页
		thiz._showPageFn(curPage + 1);
		
		thiz._$showPageBtn.data('status').curPage = curPage + 1;
		
		//如果下一页为最后一页，则disable下一页按钮
		if(thiz._$showPageBtn.data('status').curPage == totalPage) {
			thiz._$nextBtn.addClass('.disableBtn-xb');
		};
	};
	
	//previous事件函数
	this.prevFn = function(event) {
		var thiz = event.data.context;
		var curPage = thiz._$showPageBtn.data('status').curPage,
			totalPage = thiz._$showPageBtn.data('status').totalPage;
		
		
		
		//当前页为第一页，直接返回
		if(curPage == 1) {
			return;
		};
		//设置goto界面显示的当前页和总页数
		showCurTotalPage.call(thiz, curPage - 1, totalPage);
		//显示上一页
		thiz._showPageFn(curPage - 1);
		
		thiz._$showPageBtn.data('status').curPage = curPage - 1;
		
		//如果上一页为第一页，则disable上一页按钮
		if(thiz._$showPageBtn.data('status').curPage == 1) {
			thiz._$prevBtn.addClass('.disableBtn-xb');
		};
	};
	
	//第一页
	this.startFn = function(event) {
		var thiz = event.data.context;
		var curPage = thiz._$showPageBtn.data('status').curPage,
			totalPage = thiz._$showPageBtn.data('status').totalPage;
		
		//设置goto界面显示的当前页和总页数
		showCurTotalPage.call(thiz, 1, totalPage);
		
		//显示第一页
		thiz._showPageFn(1);
		
		thiz._$showPageBtn.data('status').curPage = 1;
		
		//如果上一页为第一页，则disable上一页按钮
		thiz._$prevBtn.addClass('.disableBtn-xb');
	};
	
	//最后一页
	this.endFn = function(event) {
		var thiz = event.data.context;
		var curPage = thiz._$showPageBtn.data('status').curPage,
			totalPage = thiz._$showPageBtn.data('status').totalPage;
			
		//设置goto界面显示的当前页和总页数
		showCurTotalPage.call(thiz, totalPage, totalPage);
		
		//显示第一页
		thiz._showPageFn(totalPage);
		
		thiz._$showPageBtn.data('status').curPage = totalPage;
		
		//如果上一页为第一页，则disable上一页按钮
		thiz._$nextBtn.addClass('.disableBtn-xb');
	};
	
	//初始话各种事件
	this._initEventFn = function() {
		this._$nextBtn.on('touchstart', {context: this}, this.nextFn);
		this._$prevBtn.on('touchstart', {context: this}, this.prevFn);
		this._$pageStartBtn.on('touchstart', {context: this}, this.startFn);
		this._$pageEndBtn.on('touchstart', {context: this}, this.endFn);
	};
	
	//取消各种事件
	this._relEventFn = function() {
		this._$nextBtn.off('touchstart', {context: this}, this.nextFn);
		this._$prevBtn.off('touchstart', {context: this}, this.prevFn);
		this._$pageStartBtn.off('touchstart', {context: this}, this.startFn);
		this._$pageEndBtn.off('touchstart', {context: this}, this.endFn);
	};
};

Pagination.fn = Pagination.prototype;

//初始化，显示第一个
Pagination.fn.init = function() {
	var $list = $(this._listID);
	
	//数据库中数据行数
	var dataRowCnt = this._dataRowCntFn();
	
	//显示第一页在界面上
	if(dataRowCnt > 0) {
		this._showPageFn(1);
		//总共的页数
		var totalPage = Math.ceil(dataRowCnt / this._listPageCnt);
		//当前页数
		var curPage = 1;
		
		//设置goto界面显示的当前页和总页数
		showCurTotalPage.call(this, curPage, totalPage);
		
		//记录总的页数和当前页数
		this._$showPageBtn.data('status', {totalPage: totalPage, curPage: 1});
		
		//如果当前为第一页或者最后一页，disable当前的对应按钮
		if(curPage == 1) {
			this._$prevBtn.addClass('.disableBtn-xb');
		};
		
		if(curPage == totalPage) {
			this._$nextBtn.addClass('.disableBtn-xb');
		};
		
		//初始化各种事件
		this._initEventFn();
	} else {
		this._showPageFn(0);
		
		//设置goto界面显示的当前页和总页数
		showCurTotalPage.call(this, 0, 0);
		
		//所有按钮无法点动
		//跳转按钮
		this._$showPageBtn.addClass('.disableBtn-xb');
		//next
		this._$nextBtn.addClass('.disableBtn-xb');
		//previous
		this._$prevBtn.addClass('.disableBtn-xb');
		//start
		this._$pageStartBtn.addClass('.disableBtn-xb');
		//end
		this._$pageEndBtn.addClass('.disableBtn-xb');
	};
};

//释放各种事件按钮
Pagination.fn.relEventFn = function() {
	this._relEventFn();
};