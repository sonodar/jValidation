describe("jValidationのテスト", function() {

    describe("ValidationInfo", function() {
    	it("フィールド名、エラーメッセージ、検証メソッド名、検証パラメータを保持する", function() {
    	  var info = new ValidationInfo("testFieldName", "test message", "testFunc", {hoge:"hoge", test: "test"});
    	  expect(info.fieldName).toEqual("testFieldName");
    	  expect(info.msg).toEqual("test message");
    	  expect(info.funcName).toEqual("testFunc");
    	  expect(info.params.hoge).toEqual("hoge");
    	  expect(info.params.test).toEqual("test");
    	});
    	it("toStringメソッドでJSON形式の出力が可能", function() {
    	  var info = new ValidationInfo("hoge", "moge", "fuge", "hage");
    	  expect(info.toString()).toEqual(
    	    "{fieldName:hoge, msg:moge, funcName:fuge, params:hage}");
    	});
    });

});