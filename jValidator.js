/**********************************************************************************************
 * JavaScriptによるフォームの入力検証をサポートする。
 *
 * クライアントサイドでの入力検証を実装するためのJavaScriptフレームワーク。
 * 使い方、検証の追加方法や、自作検証の登録方法は同梱のマニュアルを参照。
 * 
 * このプラグインを使用するにはcommons.jsを先に参照する必要がある。
 *
 * @author IBM Ryohei Sonoda (FSI) 2010/04/13
 **********************************************************************************************/

/**============================================================================================
 * 検証情報を保持するValidationInfoクラス。
 * @param	fieldName	検証フィールド名
 * @param	msg		エラーメッセージ
 * @param	funcName	検証メソッド名
 * @param	params		検証メソッドに渡す引数 (省略可)
 =============================================================================================*/
var ValidationInfo = function (fieldName, msg, funcName, params) {
	this.fieldName = fieldName;
	this.msg       = msg;
	this.funcName  = funcName;
	this.params    = params;
}
ValidationInfo.prototype.toString = function () {
	return '{fieldName: ' + this.fieldName + ', msg: ' + this.msg +
		', funcName: ' + this.funcName + ', params: ' + params + '}';
}

/**============================================================================================
 * Validatorクラスを格納し、まとめて実行するValidatorManagerクラス。
 * @param	form		このインスタンスが検証を行うフォーム
 =============================================================================================*/
var ValidatorManager = function (form) {
	this.form = form;
	this.validators = [];
}
ValidatorManager.prototype.toString = function () {
	return '{formName: ' + this.form.name + ', formAction: ' + this.form.action +
		', validators: [' + validators.join() + ']}';
}

/* Validationを行うメソッドを格納するクラス変数 */
ValidatorManager.validationMethods = [];

/**============================================================================================
 * 検証用の関数をドキュメントに登録するクラスメソッド。
 * @param	name	Validationメソッド名
 * @param	func	入力検証を実装したFunctionオブジェクト
 =============================================================================================*/
ValidatorManager.registerValidation = function (name, func) {
	ValidatorManager.validationMethods[name] = func;
}

/**============================================================================================
 * ValidatorManagerにValidationInfoオブジェクトを追加する。
 * @param	fieldName	検証フィールド名
 * @param	msg			エラーメッセージ
 * @param	funcName	検証メソッド名
 * @param	params		検証メソッドに渡す引数 (省略可)
 =============================================================================================*/
ValidatorManager.prototype.add = function (fieldName, msg, funcName, params) {
	this.validators.push(new ValidationInfo(fieldName, msg, funcName, params));
}

/**============================================================================================
 * ValidatorManagerに登録されたすべての入力検証を実行する。
 * @param	errorCls	検証NGフィールドに設定するエラースタイルクラス名 (null可)
 * @param	func		エラーメッセージを受け取る関数。省略した場合はalertが呼ばれる。
 * @return	検証結果。エラーがなければtrue。
 =============================================================================================*/
ValidatorManager.prototype.validate = function (errorCls, func) {
	
	// エラーメッセージを格納する配列
	var errors = [];
	
	// 登録されたValidatorの数だけ繰り返す
	for (var i = 0, n = this.validators.length; i < n; i++) {
		
		// Validatorインスタンス
		var validator = this.validators[i];
		
		// 検証フィールド
		var field = this.form.elements[validator.fieldName];
		
		// フィールドが存在しない場合は処理を飛ばす
		if (!field) continue;
		
		// 検証メソッド
		var validationMethod = ValidatorManager.validationMethods[validator.funcName];
		
		// 検証メソッドが存在しない場合は処理を飛ばす
		if (!validationMethod) continue;
		
		// 検証メソッドを対象フィールドに対して実行
		var msg = validationMethod(field, validator.msg, validator.params);
		
		// 検証エラーだった場合（エラーメッセージが返ってきた場合）
		if (msg) {
			// フィールドにエラークラスを設定
			if (errorCls) addStyleClass(field, errorCls);
			
			// エラーメッセージ配列にメッセージを追加
			errors.push(msg);
		}
		// 検証エラーなしの場合
		else {
			// エラークラスを削除
			if (errorCls) removeStyleClass(field, errorCls);
		}
	}
	
	// エラー件数が1件以上あった場合
	if (errors.length > 0) {
		if (func) {	// エラー処理関数がある場合はそれを実行
			func(errors); return false;
		}
		alert(errors.join('\n'));
		return false;
	}
	
	// エラー件数が0件ならtrueを返す。
	return true;
}

/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * 以降は、最初から用意してある検証用関数の登録処理。
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

/**============================================================================================
 * 必須入力チェック。
 * @param	fieldName	必須入力チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 =============================================================================================*/
ValidatorManager.registerValidation('Required', function (field, msg) {
	if ($value(field).length == 0) return msg;
	return '';
});
ValidatorManager.prototype.addRequired = function (fieldName, msg) {
	this.add(fieldName, msg, 'Required');
}

/**============================================================================================
 * 半角整数チェック。
 * @param	fieldName	半角整数チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 * @param	sign		符号を許可するかどうか。許可する場合はtrue。省略した場合は許可しない。
 =============================================================================================*/
ValidatorManager.registerValidation('HalfInt', function (field, msg, sign) {
	if ($value(field).isHalfInt(sign)) return '';
	return msg;
});
ValidatorManager.prototype.addHalfInt = function (fieldName, msg, sign) {
	this.add(fieldName, msg, 'HalfInt', sign);
}

/**============================================================================================
 * 半角英字チェック。
 * @param	fieldName	半角英字チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 =============================================================================================*/
ValidatorManager.registerValidation('HalfAlph', function (field, msg) {
	if ($value(field).isHalfAlph()) return '';
	return msg;
});
ValidatorManager.prototype.addHalfAlph = function (fieldName, msg) {
	this.add(fieldName, msg, 'HalfAlph');
}

/**============================================================================================
 * 半角英数字チェック。
 * @param	fieldName	半角英数字チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 =============================================================================================*/
ValidatorManager.registerValidation('HalfAlphInt', function (field, msg) {
	if ($value(field).isHalfAlphInt()) return '';
	return msg;
});
ValidatorManager.prototype.addHalfAlphInt = function (fieldName, msg) {
	this.add(fieldName, msg, 'HalfAlphInt');
}

/**============================================================================================
 * 半角数値(整数、少数)チェック。
 * @param	fieldName	半角数値(整数、少数)チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 * @param	sign		符号を許可するかどうか。許可する場合はtrue。
 =============================================================================================*/
ValidatorManager.registerValidation('HalfNum', function (field, msg, sign) {
	if ($value(field).isHalfNum(sign)) return '';
	return msg;
});
ValidatorManager.prototype.addHalfNum = function (fieldName, msg, sign) {
	this.add(fieldName, msg, 'HalfNum', sign);
}

/**============================================================================================
 * 数値範囲チェック。引数のmin, maxに数値以外を指定した場合は例外が発生する。
 * @param	fieldName	数値範囲チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 * @param	min			数値の許容最小値。
 * @param	max			数値の許容最大値。
 =============================================================================================*/
ValidatorManager.registerValidation('Range', function (field, msg, params) {
	var value = $value(field);
	if (!value.length || isNaN(value)) return '';
	var min = params.min;
	var max = params.max;
	if (isNaN(min) || isNaN(max))
		throw 'ValidatorManager#Range: min, maxには数値を指定してください。';
	if (value.isRange(min, max)) return '';
	return msg;
});
ValidatorManager.prototype.addRange = function (fieldName, msg, min, max) {
	var params = { min: eval(min), max: eval(max) };
	this.add(fieldName, msg, 'Range', params);
}

/**============================================================================================
 * 最大値チェック。引数のmaxに数値以外を指定した場合は例外が発生する。
 * @param	fieldName	最大値チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 * @param	max			数値の許容最大値。
 =============================================================================================*/
ValidatorManager.registerValidation('Max', function (field, msg, max) {
	if (isNaN(max)) throw 'ValidatorManager#Max: maxには数値を指定してください。';
	var value = $value(field);
	if (!isNaN(value) && value > max) return msg;
	return '';
});
ValidatorManager.prototype.addMax = function (fieldName, msg, max) {
	this.add(fieldName, msg, 'Max', max);
}

/**============================================================================================
 * 最小値チェック。引数のminに数値以外を指定した場合は例外が発生する。
 * @param	fieldName	最小値チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 * @param	min			数値の許容最小値。
 =============================================================================================*/
ValidatorManager.registerValidation('Min', function (field, msg, min) {
	if (isNaN(min)) throw 'ValidatorManager#Min: minには数値を指定してください。';
	var value = $value(field);
	if (!isNaN(value) && value < min) return msg;
	return '';
});
ValidatorManager.prototype.addMin = function (fieldName, msg, min) {
	this.add(fieldName, msg, 'Min', min);
}

/**============================================================================================
 * 文字数チェック。引数のmin, maxに数値以外を指定した場合は例外が発生する。
 * @param	fieldName	文字数チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 * @param	min			文字数の許容最小値。
 * @param	max			文字数の許容最大値。
 =============================================================================================*/
ValidatorManager.registerValidation('Length', function (field, msg, params) {
	var min = params.min, max = params.max;
	if (isNaN(min) || isNaN(max))
		throw 'ValidatorManager#Length: min, maxには数値を指定してください。';
	if ($value(field).length.isRange(min, max)) return '';
	return msg;
});

ValidatorManager.prototype.addLength = function (fieldName, msg, min, max) {
	var params = { min: eval(min), max: eval(max) };
	this.add(fieldName, msg, 'Length', params);
}

/**============================================================================================
 * 最大文字数チェック。引数のmaxに数値以外を指定した場合は例外が発生する。
 * @param	fieldName	最大文字数チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 * @param	max			文字数の許容最大値。
 =============================================================================================*/
ValidatorManager.registerValidation('MaxLength', function (field, msg, max) {
	if (isNaN(max)) throw 'ValidatorManager#MaxLength: maxには数値を指定してください。';
	if ($value(field).length > max) return msg;
	return '';
});
ValidatorManager.prototype.addMaxLength = function (fieldName, msg, max) {
	this.add(fieldName, msg, 'MaxLength', max);
}

/**============================================================================================
 * 最小文字数チェック。引数のminに数値以外を指定した場合は例外が発生する。
 * @param	fieldName	最小文字数チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 * @param	min			文字数の許容最小値。
 =============================================================================================*/
ValidatorManager.registerValidation('MinLength', function (field, msg, min) {
	if (isNaN(min)) throw 'ValidatorManager#MinLength: minには数値を指定してください。';
	if ($value(field).length < min) return msg;
	return '';
});
ValidatorManager.prototype.addMinLength = function (fieldName, msg, min) {
	this.add(fieldName, msg, 'MinLength', min);
}

/**============================================================================================
 * 日付妥当性チェック。(yy)yy-(M)M-(d)d, (yy)yy/(M)M/(d)d 以外の日付書式、または、
 * 2001/02/29などの存在しない日付のチェックを行う。
 * @param	fieldName	日付妥当性チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 =============================================================================================*/
ValidatorManager.registerValidation('Date', function (field, msg) {
	if ($value(field).isDate()) return '';
	return msg;
});
ValidatorManager.prototype.addDate = function (fieldName, msg) {
	this.add(fieldName, msg, 'Date');
}

/**============================================================================================
 * 年、月、日のフィールドを指定して日付書式と日付妥当性をチェック。
 * @param	msg		検証エラーの場合のエラーメッセージ
 * @param	year	年のフィールド名 (name属性値)
 * @param	month	月のフィールド名 (name属性値)
 * @param	day		日のフィールド名 (name属性値)
 =============================================================================================*/
ValidatorManager.registerValidation('DatePart', function (year, msg, params) {
	var month = params.month, day = params.day;
	if(!month || !day) return '';
	var value = $value(year) + '/' + $value(month) + '/' + $value(day);
	if (value.isDate()) return '';
	return msg;
});
ValidatorManager.prototype.addDatePart = function (msg, year, month, day) {
	var params = { month: $value(this.form.elements[month]), day: $value(this.form.elements[day]) };
	this.add(year, msg, 'DatePart', params);
}

/**============================================================================================
 * 正規表現チェック。
 * @param	fieldName	正規表現チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 * @param	pattern		正規表現パターン。このパターンにマッチしないと検証NGとなる。
 =============================================================================================*/
ValidatorManager.registerValidation('Mask', function (field, msg, pattern) {
	if ($value(field).test(pattern)) return '';
	return msg;
});
ValidatorManager.prototype.addMask = function (fieldName, msg, pattern) {
	this.add(fieldName, msg, 'Mask', pattern);
}

/**============================================================================================
 * メールアドレス書式チェック。
 * @param	fieldName	メールアドレス書式チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 =============================================================================================*/
ValidatorManager.registerValidation('Email', function (field, msg) {
	if ($value(field).isEmail()) return '';
	return msg;
});
ValidatorManager.prototype.addEmail = function (fieldName, msg) {
	this.add(fieldName, msg, 'Email');
}

/**============================================================================================
 * 等価チェック。
 * @param	fieldName	等価チェックを行うフィールド名 (name属性値)
 * @param	msg			検証エラーの場合のエラーメッセージ
 * @param	targetName	等価比較対象フィールド名 (name属性値)
 =============================================================================================*/
ValidatorManager.registerValidation('Equals', function (field, msg, target) {
	if (!target) return '';
	if ($value(field) == $value(target)) return '';
	return msg;
});
ValidatorManager.prototype.addEquals = function (fieldName, msg, targetName) {
	var target = this.form.elements[targetName];
	this.add(fieldName, msg, 'Equals', target);
}

/**============================================================================================
 * 関連必須入力チェック。
 * @param	fieldName			関連必須入力チェックを行うフィールド名 (name属性値)
 * @param	msg					検証エラーの場合のエラーメッセージ
 * @param	prerequisite		入力前提フィールド名(name属性値)の配列
 * @param	nonPrerequisite		未入力前提フィールド名(name属性値)の配列 (省略可)
 =============================================================================================*/
ValidatorManager.registerValidation('RequiredRefs', function (field, msg, params) {
	var fields = params.prerequisite; var e;
	if (fields) {
		for (var i = 0, n = fields.length; i < n; i++) {
			e = fields[i];
			// フィールドが存在しない場合は検証しない。
			if (!e) return;
			// 未入力なら検証しない。
			if (!$value(e)) return '';
		}
	}
	fields = params.nonPrerequisite;
	if (fields) {
		for (var i = 0, n = fields.length; i < n; i++) {
			e = fields[i];
			// フィールドが存在しない場合は検証しない。
			if (!e) return;
			// 入力済みなら検証しない。
			if ($value(e)) return '';
		}
	}
	if ($value(field)) return '';
	return msg;
});
ValidatorManager.prototype.addRequiredRefs = function (fieldName, msg, prerequisite, nonPrerequisite) {
	var fields1 = [], fields2 = [];
	if (prerequisite) {
		for (var i = 0, n = prerequisite.length; i < n; i++) {
			fields1.push(this.form.elements[prerequisite[i]]);
		}
	}
	if (nonPrerequisite) {
		for (var i = 0, n = nonPrerequisite.length; i < n; i++) {
			fields2.push(this.form.elements[nonPrerequisite[i]]);
		}
	}
	var params = { prerequisite: fields1, nonPrerequisite: fields2 };
	this.add(fieldName, msg, 'RequiredRefs', params);
}

/**============================================================================================
 * 数値大小比較チェック。
 * @param	fieldName		数値大小比較チェックを行うフィールド名 (name属性値)
 * @param	msg				検証エラーの場合のエラーメッセージ
 * @param	targetName		比較対象フィールド名 (name属性値)
 * @param	compareMode		比較方法 (EQUAL, GREATER, LESS, GREATER_EQUAL, LESS_EQUAL)
 =============================================================================================*/
var EQUAL         = 'EQUAL';
var GREATER       = 'GREATER';
var LESS          = 'LESS';
var GREATER_EQUAL = 'GREATER_EQUAL';
var LESS_EQUAL    = 'LESS_EQUAL';
/*--------------------------------------------------------------------------------------------*/
ValidatorManager.registerValidation('CompareNumber', function (field, msg, params) {
	var target = params.target, compareMode = params.compareMode;
	if (!target) return '';
	var valule = $value(field), targetValue = $value(target);
	if (isNaN(value) || isNaN(targetValue)) return '';
	if (compareMode == EQUAL         && value == targetValue) return '';
	if (compareMode == GREATER       && value >  targetValue) return '';
	if (compareMode == LESS          && value <  targetValue) return '';
	if (compareMode == GREATER_EQUAL && value >= targetValue) return '';
	if (compareMode == LESS_EQUAL    && value <= targetValue) return '';
	return msg;
});
ValidatorManager.prototype.addCompareNumber = function (fieldName, msg, targetName, compareMode) {
	var params = { target: this.form.elements[targetName], compareMode: compareMode };
	this.add(fieldName, msg, 'CompareNumber', params);
}
