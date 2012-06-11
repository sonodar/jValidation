###
*********************************************************************************************
// jValidationによるフォーム入力検証用の標準検証メソッド群。
// 検証メソッドの定義、Validatorの登録を行う。
//
// 独自の検証メソッドを定義する場合はこのスクリプトを参考に作成するとよい。
//
// @author Sonoda Ryohei 2012/06/07 MIT Licence.
*********************************************************************************************
###

#********************************************************************************************
# 検証メソッド定義クラス。
#********************************************************************************************
class ValidatorUtil
	
	# 半角整数チェック
	@isHalfInt = (value, sign) ->
		pattern = if sign then /^[-\+]?[0-9]+$/ else /^[0-9]+$/
		pattern.test value.toString()
	
	# 半角英字チェック
	@isHalfAlph = (value) -> not /[^a-zA-Z]/.test value.toString()
	
	# 半角英数字チェック
	@isHalfAlphInt = (value) -> not /[^a-zA-Z0-9]/.test value.toString()
	
	# 半角数値チェック
	@isHalfNum = (value, sign) ->
		if sign
			pattern = /^[-\+]?[0-9]+([\.,][0-9]*)?$|^[\.,][0-9]+$/
		else
			pattern = /^[0-9]+([\.,][0-9]*)?$|^[\.,][0-9]+$/
		pattern.test value.toString()
	
	# 範囲チェック
	@isRange = (value, min, max) ->
		_min; _max; _val
		if typeof value is "string"
			_min = min.toString(); _max = max.toString()
			_val = value.toString()
		else if not isNaN value
			_min = new Number min; _max = new Number max
			_val = new Number value
		else
			return min <= value <= max
		if _min > _max then throw new "ValidatorUtil#isRange min<=maxとなるように引数を指定してください"
		_min <= _val <= _max
	
	# メールアドレスチェック
	@isEmail = (value, strict) ->
		pattern = 
			if strict
				///
				(?:(?:[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+(?:\.[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+)*)|
				(?:"(?:[\x21\x23-\x5B\x5D-\x7E]|(?:\\(?:[\x21-\x7E]|[\x20\x09])))*")|
				(?:(?:(?:[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+)|(?:"(?:[\x21\x23-\x5B\x5D-\x7E]|
				(?:\\(?:[\x21-\x7E]|[\x20\x09])))*"))(?:\.(?:(?:[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+)|
				(?:"(?:[\x21\x23-\x5B\x5D-\x7E]|(?:\\(?:[\x21-\x7E]|[\x20\x09])))*")))*))@
				(?:(?:[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+(?:\.[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+)*)|
				(?:(?:[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+)(?:\.(?:[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+))*))
				///i
			else
				/^[0-9a-z\-_.!#$\%\&'*+\/=?^`\{\}\|~]+@[a-z\-]+(?:\.[a-z\-]+)\.[a-z\-]+$/i
		pattern.test value.toString()

	# 日付書式チェック
	@isDate = (value) ->
		
		# 文字列をトリムして保持
		dateStr = value.toString().replace(/^\s+|\s+$/g, '')
		
		# 正規表現で書式チェック
		if not ///
			^(?:([0-9]{0,2}[0-9]{2})[/](0[1-9]|1[0-2]|[1-9])[/](0[1-9]|1[0-9]|2[0-9]|3[0-1]|[1-9]))|
			(?:([0-9]{0,2}[0-9]{2})-(0[1-9]|1[0-2]|[1-9])-(0[1-9]|1[0-9]|2[0-9]|3[0-1]|[1-9]))|
			(?:([0-9]{0,2}[0-9]{2})年(0[1-9]|1[0-2]|[1-9])月(0[1-9]|1[0-9]|2[0-9]|3[0-1]|[1-9])日)$
			///.test dateStr
			return false

		# 日付を年、月、日に分割
		dateParts = dateStr.replace(/[\-年月]/g, '/').replace(/日/, '').split '/'
		if dateParts.length != 3 then return false

		yyyy = dateParts[0] - 0
		mm = dateParts[1] - 0
		dd = dateParts[2] - 0

		if dateParts[0].length == 2
			yyyy = if yyyy < 50 then '20' + yyyy - 0 else '19' + yyyy - 0

		# 分割した値を日付に変換する
		d = new Date yyyy, mm - 1, dd
		
		# 日付変換前と後で値が変わっていなければtrue
		d.getFullYear() is yyyy and d.getMonth() + 1 is mm and d.getDate() is dd

###
検証メソッドを定義してValidateManagerに登録する。
###

#============================================================================================
# 必須入力チェック。
# @param	fieldName	必須入力チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
#============================================================================================
ValidateManager.registerValidation 'Required', (field, msg) ->
	msg if @isEmtpyField field

#============================================================================================
# 半角整数チェック。
# @param	fieldName	半角整数チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
# @param	sign		符号を許可するかどうか。許可する場合はtrue。省略した場合は許可しない。
#============================================================================================
ValidateManager.registerValidation 'HalfInt', (field, msg, sign) ->
	if @isEmtpyField field then return ''
	msg if not ValidatorUtil.isHalfInt $(@form.elements[field]).val(), sign

#============================================================================================
# 半角英字チェック。
# @param	fieldName	半角英字チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
#============================================================================================
ValidateManager.registerValidation 'HalfAlph', (field, msg) ->
	if @isEmtpyField field then return ''
	msg if not ValidatorUtil.isHalfAlph $(@form.elements[field]).val()

#============================================================================================
# 半角英数字チェック。
# @param	fieldName	半角英数字チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
#============================================================================================
ValidateManager.registerValidation 'HalfAlphInt', (field, msg) ->
	if @isEmtpyField field then return ''
	msg if not ValidatorUtil.isHalfAlphInt $(@form.elements[field]).val()

#============================================================================================
# 半角数値(整数、少数)チェック。
# @param	fieldName	半角数値(整数、少数)チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
# @param	sign		符号を許可するかどうか。許可する場合はtrue。
#============================================================================================
ValidateManager.registerValidation 'HalfNum', (field, msg, sign) ->
	if @isEmtpyField field then return ''
	msg if not ValidatorUtil.isHalfNum $(@form.elements[field]).val(), sign

#============================================================================================
# 数値範囲チェック。引数のmin, maxに数値以外を指定した場合は例外が発生する。
# @param	fieldName	数値範囲チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
# @param	params.min	数値の許容最小値。
# @param	params.max	数値の許容最大値。
#============================================================================================
ValidateManager.registerValidation 'Range', (field, msg, params) ->

	{min} = params; {max} = params
	if not max? or isNaN max or not min? or isNaN min
		throw "ValidateManager#Range: min, maxには数値を指定してください。 {min=#{min}, max=#{max}}"

	if @isEmtpyField field then return ''

	# 数値以外の場合は検証OK
	value = $(@form.elements[field]).val()
	if isNaN value then return ''

	msg if not ValidatorUtil.isRange value, min, max

#============================================================================================
# 最大値チェック。引数のmaxに数値以外を指定した場合は例外が発生する。
# @param	fieldName	最大値チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
# @param	max			数値の許容最大値。
#============================================================================================
ValidateManager.registerValidation 'Max',  (field, msg, max) ->
	if not max? then throw 'ValidateManager#Max: maxを指定してください。'
	if isNaN max then throw "ValidateManager#Max: maxには数値を指定してください。 max=#{max}"
	if @isEmtpyField field then return ''
	value = $(@form.elements[field]).val()
	msg if not isNaN value and new Number value > max

#============================================================================================
# 最小値チェック。引数のminに数値以外を指定した場合は例外が発生する。
# @param	fieldName	最小値チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
# @param	min			数値の許容最小値。
#============================================================================================
ValidateManager.registerValidation 'Min', (field, msg, min) ->
	if not min? then throw 'ValidateManager#Min: minを指定してください。'
	if isNaN min then throw "ValidateManager#Min: minには数値を指定してください。 min=#{min}"
	if @isEmtpyField field then return ''
	value = $(@form.elements[field]).val()
	msg if not isNaN value and new Number value < min

#============================================================================================
# 文字数チェック。引数のmin, maxに数値以外を指定した場合は例外が発生する。
# @param	fieldName	文字数チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
# @param	params.min	文字数の許容最小値。
# @param	params.max	文字数の許容最大値。
#============================================================================================
ValidateManager.registerValidation 'Length', (field, msg, params) ->

	{min} = params; {max} = params
	if not max? or max <= 0 or isNaN max or not min? or min <= 0 or isNaN min
		throw "ValidateManager#Length: min, maxには1以上の整数を指定してください。 {min=#{min}, max=#{max}}"
	if @isEmtpyField field then return ''
	strLength = $(@form.elements[field]).val()?.length
	msg if not ValidatorUtil.isRange strLength, min, max

#============================================================================================
# 最大文字数チェック。引数のmaxに数値以外を指定した場合は例外が発生する。
# @param	fieldName	最大文字数チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
# @param	max			文字数の許容最大値。
#============================================================================================
ValidateManager.registerValidation 'MaxLength', (field, msg, max) ->
	if not max? or max <= 0 or isNaN max
		throw "ValidateManager#MaxLength: maxには1以上の整数を指定してください。 max=#{max}"
	if @isEmtpyField field then return ''
	msg if $(@form.elements[field]).val()?.length > max

#============================================================================================
# 最小文字数チェック。引数のminに数値以外を指定した場合は例外が発生する。
# @param	fieldName	最小文字数チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
# @param	min			文字数の許容最小値。
#============================================================================================
ValidateManager.registerValidation 'MinLength', (field, msg, min) ->
	if not min? or min <= 0 or isNaN min
		throw "ValidateManager#MinLength: minには1以上の整数を指定してください。 min=#{min}"
	if @isEmtpyField field then return ''
	msg if $(@form.elements[field]).val()?.length < min

#============================================================================================
# 日付妥当性チェック。(yy)yy-(M)M-(d)d, (yy)yy/(M)M/(d)d 以外の日付書式、または、
# 2001/02/29などの存在しない日付のチェックを行う。
# @param	fieldName	日付妥当性チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
#============================================================================================
ValidateManager.registerValidation 'Date', (field, msg) ->
	if @isEmtpyField field then return ''
	msg if not ValidatorUtil.isDate $(@form.elements[field]).val()

#============================================================================================
# 年、月、日のフィールドを指定して日付書式と日付妥当性をチェック。
# @param	msg				検証エラーの場合のエラーメッセージ
# @param	year			年のフィールド名 (name属性値)
# @param	params.month	月のフィールド名 (name属性値)
# @param	params.day		日のフィールド名 (name属性値)
#============================================================================================
ValidateManager.registerValidation 'DatePart', (year, msg, params) ->
	{month} = params; {day} = params
	if not month or not day
		throw 'ValidateManager#DatePart: 月、日のフィールド名を指定してください。'
	# フィールド未入力の場合は検証OK
	if @isEmtpyField year or @isEmtpyField month or @isEmtpyField day then return ''
	dateValue = $(@form.elements[year]).val()
	dateValue += '/' + $(@form.elements[month]).val()
	dateValue += '/' + $(@form.elements[day]).val()
	msg if not ValidatorUtil.isDate dateValue

#============================================================================================
# 正規表現チェック。
# @param	fieldName	正規表現チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
# @param	pattern		正規表現パターン。このパターンにマッチしないと検証NGとなる。
#============================================================================================
ValidateManager.registerValidation 'Mask', (field, msg, pattern) ->
	if not pattern
		throw 'ValidateManager#Mask: patternを指定してください。'
	if @isEmtpyField field then return ''
	msg if not $(@form.elements[field]).val().test pattern

#============================================================================================
# メールアドレス書式チェック。
# @param	fieldName	メールアドレス書式チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
# @param	strict		RFC2822準拠の厳密なメールアドレスチェックをするかどうか。
#						省略した場合はfalse(厳密なチェックをしない)。
#============================================================================================
ValidateManager.registerValidation 'Email', (field, msg, strict = false) ->
	if @isEmtpyField field then return ''
	msg if not ValidatorUtil.isEmail $(@form.elements[field]).val(), strict

#============================================================================================
# 等価チェック。
# @param	fieldName	等価チェックを行うフィールド名 (name属性値)
# @param	msg			検証エラーの場合のエラーメッセージ
# @param	targetName	等価比較対象フィールド名 (name属性値)
#============================================================================================
ValidateManager.registerValidation 'Equals', (field, msg, target) ->
	if @isEmtpyField field then return ''
	if not target
		throw "ValidateManager#Equals: #{field}と等価チェックを行うフィールド名を指定してください。"
	msg if $(@form.elements[field]).val() isnt $(@form.elements[target]).val()

#============================================================================================
# 関連必須入力チェック。
# @param	fieldName				関連必須入力チェックを行うフィールド名 (name属性値)
# @param	msg						検証エラーの場合のエラーメッセージ
# @param	params.prerequisite		入力前提フィールド名(name属性値)の配列 (省略可)
# @param	params.nonPrerequisite	未入力前提フィールド名(name属性値)の配列 (省略可)
# @param	params.checkExists		前提フィールドが見つからない場合にエラーとするかどうか。
#									falseを指定すると、フィールドが見つからない場合は無視する。
#									省略した場合はtrue(見つからない場合にエラーをスロー)。
#============================================================================================
ValidateManager.registerValidation 'RequiredRefs', (field, msg, params) ->

	{prerequisite} = params; {nonPrerequisite} = params

	if not prerequisite? and not nonPrerequisite?
		throw 'ValidateManager#RequiredRefs: prerequisite, nonPrerequisiteのいずれかを指定してください。'

	checkExists = params.checkExists ? true

	# 入力前提フィールド
	if prerequisite?
		for elmName in prerequisite
			elm = @form.elements[elmName]
			if not elm?
				if checkExists
					throw "ValidateManager#RequiredRefs: #{elmName}フィールドが見つかりません。"
				else
					continue
			# 入力前提フィールドが未入力の場合は検証OKとする
			if not $(elm).val() then return ''

	# 未入力前提フィールド
	if nonPrerequisite?
		for elmName in nonPrerequisite
			elm = @form.elements[elmName]
			if not elm?
				if checkExists
					throw "ValidateManager#RequiredRefs: #{elmName}フィールドが見つかりません。"
				else
					continue
			# 未入力前提フィールドが入力済みの場合は検証OKとする
			if $(elm).val() then return ''

	# 上記前提条件をクリアしていた場合のみ、対象フィールドの必須チェックを行う
	msg if @isEmtpyField field

#********************************************************************************************
# 数値比較タイプの列挙クラス。
#********************************************************************************************
class CompareType
	constructor: (@value) ->
	@EQUAL        : new CompareType 'EQUAL'
	@GREATER      : new CompareType 'GREATER'
	@LESS         : new CompareType 'LESS'
	@GREATER_EQUAL: new CompareType 'GREATER_EQUAL'
	@LESS_EQUAL   : new CompareType 'LESS_EQUAL'

#============================================================================================
# 数値大小比較チェック。
# @param	fieldName		数値大小比較チェックを行うフィールド名 (name属性値)
# @param	msg				検証エラーの場合のエラーメッセージ
# @param	targetName		比較対象フィールド名 (name属性値)
# @param	compareType		比較方法 (EQUAL, GREATER, LESS, GREATER_EQUAL, LESS_EQUAL)
#============================================================================================
ValidateManager.registerValidation 'CompareNumber', (field, msg, params) ->
	{targetName} = params; {compareType} = params
	
	if not @form.elements[targetName]?
		throw "ValidateManager#CompareNumber: #{@form.name}フォームに#{targetName}フィールドが見つかりません。"
	
	# どちらかが未入力の場合は検証OKとする
	if @isEmtpyField field or @isEmtpyField targetName then return ''

	value = $(@form.elements[field]).val()
	targetValue = $(@form.elements[targetName]).val()

	# どちらかが数値以外の場合は検証OKとする
	if isNaN value or isNaN targetValue then return '';

	value = new Number value; targetValue = new Number targetValue

	switch compareType
		when CompareType.EQUAL
			if value isnt targetValue then return msg
		when CompareType.GREATER
			if value <= targetValue then return msg
		when CompareType.LESS
			if value >= targetValue then return msg
		when CompareType.GREATER_EQUAL
			if value < targetValue then return msg
		when CompareType.LESS_EQUAL
			if value > targetValue then return msg

###
登録した検証メソッドをフィールドに設定するためのショートカットメソッド
###
ValidateManager::addRequired = (fieldName, msg) -> @add fieldName, msg, 'Required'
ValidateManager::addHalfInt = (fieldName, msg, sign = false) -> @add fieldName, msg, 'HalfInt', sign
ValidateManager::addHalfAlph = (fieldName, msg) -> @add fieldName, msg, 'HalfAlph'
ValidateManager::addHalfAlphInt = (fieldName, msg) -> @add fieldName, msg, 'HalfAlphInt'
ValidateManager::addHalfNum = (fieldName, msg, sign = false) -> @add fieldName, msg, 'HalfNum', sign
ValidateManager::addRange = (fieldName, msg, min, max) -> @add fieldName, msg, 'Range', {min: new Number(min), max: new Number(max)}
ValidateManager::addMax = (fieldName, msg, max) -> @add fieldName, msg, 'Max', new Number max
ValidateManager::addMin = (fieldName, msg, min) -> @add fieldName, msg, 'Min', new Number mi
ValidateManager::addLength = (fieldName, msg, min, max) -> @add fieldName, msg, 'Length', {min: new Number(min), max: new Number(max)}
ValidateManager::addMaxLength = (fieldName, msg, max) -> @add fieldName, msg, 'MaxLength', new Number max
ValidateManager::addMinLength = (fieldName, msg, min) -> @add fieldName, msg, 'MinLength', new Number min
ValidateManager::addDate = (fieldName, msg) -> @add fieldName, msg, 'Date'
ValidateManager::addDatePart = (msg, year, month, day) -> @add year, msg, 'DatePart', {month, day}
ValidateManager::addMask = (fieldName, msg, pattern) -> @add fieldName, msg, 'Mask', pattern
ValidateManager::addEmail = (fieldName, msg) -> @add fieldName, msg, 'Email'
ValidateManager::addEquals = (fieldName, msg, targetName) -> @add fieldName, msg, 'Equals', targetName
ValidateManager::addRequiredRefs = (fieldName, msg, prerequisite, nonPrerequisite, checkExists = true) ->
	@add fieldName, msg, 'RequiredRefs', {prerequisite, nonPrerequisite, checkExists}
ValidateManager::addCompareNumber = (fieldName, msg, targetName, compareType) ->
	@add fieldName, msg, 'CompareNumber', {targetName, compareType}