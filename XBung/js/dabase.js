//数据库类
var Database = function() {};

//得到product的行数
Database.rowCnt_product = function() {
	var rowCnt = parseInt(window.localStorage.getItem('rowCnt_product'));
	return rowCnt;
};

//rowCnt_product = rowCnt_product + 1
Database.rowCntPlus_product = function() {
	var rowCnt = parseInt(window.localStorage.getItem('rowCnt_product'));
	rowCnt = rowCnt + 1;
	window.localStorage.setItem('rowCnt_product', rowCnt);
};

//rowCnt_product = rowCnt_product + num
Database.rowCntPlusNum_product = function(num) {
	var rowCnt = parseInt(window.localStorage.getItem('rowCnt_product'));
	rowCnt = rowCnt + num;
	window.localStorage.setItem('rowCnt_product', rowCnt);
};

Database.fn = Database.prototype;

Database.fn.openDatabase = function() {
	this.db = window.openDatabase("xbung", "1.0", "xbung db", 1000000);
	if(!this.db) {
		alert('连接数据库失败！');
		return false;
	};
	
	return this.db;
};

//创建table
Database.fn.createTable = function() {
	this.db.transaction(function(tx) {
		//product table
		var execSqlStmt = 'CREATE TABLE IF NOT EXISTS product (id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
			'name TEXT NOT NULL UNIQUE, cost REAL NOT NULL, description TEXT)';
		tx.executeSql(execSqlStmt, null, null, function(tx, err) {
			alert('创建product表失败！\n' + err.source + '::' + err.message);
		});
		
		//productBtnGrp table
		execSqlStmt = 'CREATE TABLE IF NOT EXISTS productBtnGrp (btnId INTEGER PRIMARY KEY AUTOINCREMENT, targetId INTEGER)';
		tx.executeSql(execSqlStmt, null, null, function(tx, err) {
			alert('创建productBtnGrp表失败！\n' + err.source + '::' + err.message);
		});
	});
};

//初始化工作
Database.fn.init = function() {
	var bInit = window.localStorage.getItem('bInit');
	//还没有初始化，需要初始化
	if(bInit === null) {
		//设置初始化标志
		window.localStorage.setItem('bInit', true);
		//创建各种表
		this.createTable();
		//产品表初始化个数为0
		window.localStorage.setItem('rowCnt_product', 0);
	}
};

//删除table
Database.fn.delTbl = function() {
	var bInit = window.localStorage.getItem('bInit');
	if(bInit === null) {
	this.db.transaction(function(tx) {
	//productBtnGrp
		var queryStmt = 'DROP TABLE productBtnGrp';
		tx.executeSql(queryStmt, null, null, function(tx, err) {
			alert('删除productBtnGrp失败！\n' + 
				err.source + '::' + err.message);
		});
		
		queryStmt = 'DROP TABLE product';
		tx.executeSql(queryStmt, null, null, function(tx, err) {
			alert('删除product失败！\n' + 
				err.source + '::' + err.message);
		});
	});
	window.localStorage.clear();
	};
};

//添加数据
Database.fn.insertProductData = function() {
	var bInit = window.localStorage.getItem('bInit');
	//还没有初始化，需要初始化
	if(bInit === null) {
		this.db.transaction(function(tx) {
			/*//删除product数据
			var queryStmt = 'DELETE FROM product WHERE 1==1';
			tx.executeSql(queryStmt, null, null, function(tx, err) {
				alert('删除product数据失败！\n' + 
					err.source + '::' + err.message);
			});*/
			//向product添加数据
			var queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("苹果", 5000, "好手机")';
			tx.executeSql(queryStmt, null, null, function(tx, err) {
				alert('插入product数据失败！\n' + 
					err.source + '::' + err.message);
			});
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("三星", 4000, "一般")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("华为", 2000, "一般")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("小米", 1500.5, "一般")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("htc", 2300, "一般")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("海尔", 900, "一般")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("索尼", 4700, "一般")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("LG", 3700, "")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("中兴", 700, "差")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("夏普", 2700, "一般")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("coolpad", 500, "差")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("长虹", 300, "差")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("黑莓", 4100, "一般")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("索尼爱立信", 2900, "一般")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("facebook", 700, "一般")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("谷歌", 1900, "")';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO product (name, cost, description) VALUES ("微软", 4700.7, "还可以")';
			tx.executeSql(queryStmt);
			
			
			
			/*queryStmt = 'DELETE FROM productBtnGrp WHERE 1==1';
			tx.executeSql(queryStmt, null, null, function(tx, err) {
				alert('删除productBtnGrp数据失败！\n' + 
					err.source + '::' + err.message);
			});*/
			
			queryStmt = 'INSERT INTO productBtnGrp (targetId) VALUES (1)';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO productBtnGrp (targetId) VALUES (2)';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO productBtnGrp (targetId) VALUES (3)';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO productBtnGrp (targetId) VALUES (4)';
			tx.executeSql(queryStmt);
			queryStmt = 'INSERT INTO productBtnGrp (targetId) VALUES (5)';
			tx.executeSql(queryStmt);
		});
	Database.rowCntPlusNum_product(17);
	};
}
