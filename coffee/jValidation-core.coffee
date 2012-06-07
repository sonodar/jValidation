###
*********************************************************************************************
// JavaScriptによるフォームの入力検証をサポートする。
//
// クライアントサイドでの入力検証を実装するためのJavaScriptフレームワーク。
// 使い方、検証の追加方法や、自作検証の登録方法は同梱のマニュアルを参照。
//
// @author Sonoda Ryohei 2012/06/07 MIT Licence.
*********************************************************************************************
###

#********************************************************************************************
# 検証情報を保持するValidationInfoクラス。
#********************************************************************************************
class ValidationInfo
	#========================================================================================
	# コンストラクタ
	# @param	fieldName	検証フィールド名
	# @param	msg			デフォルトエラーメッセージ
	# @param	funcName	検証メソッド名
	# @param	params		検証メソッドに渡す引数 (省略可)
	#========================================================================================
	constructor: (@fieldName, @msg, @funcName, @params) ->

	# JSON文字列出力
	toString: ->
		"""
		{
			fieldName:#{@fieldName},
			msg:#{@msg},
			funcName:#{@funcName},
			params:#{@params}
		}
		"""

#********************************************************************************************
# Validatorクラスを格納し、まとめて実行するValidatorManagerクラス。
#********************************************************************************************
class ValidatorManager
	#========================================================================================
	# コンストラクタ
	# @param	form		このインスタンスが検証を行うフォーム
	#========================================================================================
	constructor: (@form) -> @validations = []

	# JSON文字列出力
	toString: ->
		"""
		{
			formName:#{@form.name},
			formAction:#{@form.action},
			validations: [#{@validations.join(',')}]
		}
		"""

	#========================================================================================
	# ValidatorManagerにValidationInfoオブジェクトを追加する。
	# @param	fieldName	検証フィールド名
	# @param	msg			デフォルトエラーメッセージ
	# @param	funcName	検証メソッド名
	# @param	params		検証メソッドに渡す引数 (省略可)
	#========================================================================================
	add: (fieldName, msg, funcName, params) ->
		@validations.push new ValidationInfo fieldName, msg, funcName, params

	# Validationを行うメソッドを格納する配列クラス変数。
	@validationMethods = []	

	#========================================================================================
	# 検証用の関数を登録するクラスメソッド。
	# 基本的にプロジェクトの共通JS内で行われる。ユーザ画面からは呼ばない。
	# @param	name	Validationメソッド名
	# @param	func	入力検証を実装したFunctionオブジェクト
	#========================================================================================
	@registerValidation = (name, func) -> @validationMethods[name] = func

	#========================================================================================
	# 検証対象フィールドの未入力チェック
	# @param	fieldName	検証フィールド名
	#========================================================================================
	isEmtpyField: (fieldName) -> $(@form.elements[fieldName])?.val()?.length? > 0

	#========================================================================================
	# フィールド検証エラー時のデフォルトコールバック関数。対象フィールドのクラスに"validate-error"を追加する。
	# @param	field		検証フィールド
	# @param	msg			検証エラーメッセージ
	#========================================================================================
	_validateerror = (field, msg) -> $(field).addClass "validate-error"

	#========================================================================================
	# フィールド検証エラー時のデフォルトコールバック関数。対象フィールドのクラスから"validate-error"を削除する。
	# @param	field		検証フィールド
	#========================================================================================
	_validatesuccess = (field) -> $(field).removeClass "validate-error"

	#========================================================================================
	# 検証エラー完了時のデフォルトコールバック関数。エラーメッセージをalert表示する。
	# @param	errors		検証エラーメッセージ配列
	#========================================================================================
	_error = (errors) -> alert errors.join('\n')

	#========================================================================================
	# ValidatorManagerに登録されたすべての入力検証を実行する。
	# @param	onvalidateerror		各検証エラー発生時のコールバック関数。フィールドエレメントとエラーメッセージを受け取る。
	#								省略した場合は、対象フィールドのクラスに"validate-error"を追加する。
	# @param	onvalidatesuccess	各検証成功時のコールバック関数。フィールドエレメントを受け取る。
	#								省略した場合は、対象フィールドのクラスから"validate-error"を削除する。
	# @param	onsuccess			検証成功時のコールバック関数。省略した場合は何もしない。
	# @param	onerror				検証完了時のコールバック関数。エラーがなかった場合は実行されない。
	#								エラーメッセージのリストを受け取る。
	#								省略した場合は最後にエラーメッセージをまとめたalertが表示される。
	# @param	checkExists			存在しないフィールドに対するValidationが登録されていた場合にエラーとするかどうか。
	#								省略した場合はfalse(エラーにせず、無視する)。
	# @return	検証結果。エラーが1件でも発生したらfalse、エラーが全くなければtrue。
	#========================================================================================
	validate: (onvalidateerror = _validateerror, onvalidatesuccess = _validatesuccess, onsuccess = null, onerror = _error, checkExists = false) ->

		errors = []		# エラーメッセージを格納する配列	
		
		# 登録されたValidatorの数だけ繰り返す
		for validation in @validations
			
			# 登録済み検証用メソッドを取得する
			validationMethod = @validationMethods[validation.funcName]
			
			# 検証メソッドが存在しない場合はエラー
			if not validationMethod?
				throw "#{validation.funcName}という検証メソッドは登録されていません。"

			# 検証フィールドをFormから取得
			field = @form.elements[validation.fieldName]
			
			# フィールドが存在しない場合はエラー、もしくは処理を飛ばす
			if not field? 
				if checkExists
					throw "#{@form.name}フォームに#{validation.fieldName}フィールドが見つかりません。"
				else
					continue
			
			# 検証メソッドを対象フィールドに対して実行
			msg = validationMethod field, validation.msg, validation.params
			
			# 検証成否によってコールバック関数を実行
			if msg
				onvalidateerror field, msg
			else
				onvalidatesuccess field
		
		# エラーがない場合はコールバックを実行後、trueを返して処理終了
		if errors.length == 0
			if onsuccess? then onsuccess
			return true

		# エラー処理関数実行
		onerror errors; return false