
/*
*********************************************************************************************
// JavaScriptによるフォームの入力検証をサポートする。
//
// クライアントサイドでの入力検証を実装するためのJavaScriptフレームワーク。
// 使い方、検証の追加方法や、自作検証の登録方法は同梱のマニュアルを参照。
//
// @author Sonoda Ryohei 2012/06/07 MIT Licence.
*********************************************************************************************
*/

(function() {
  var ValidationInfo, ValidatorManager;

  ValidationInfo = (function() {

    function ValidationInfo(fieldName, msg, funcName, params) {
      this.fieldName = fieldName;
      this.msg = msg;
      this.funcName = funcName;
      this.params = params;
    }

    ValidationInfo.prototype.toString = function() {
      return "{\n	fieldName:" + this.fieldName + ",\n	msg:" + this.msg + ",\n	funcName:" + this.funcName + ",\n	params:" + this.params + "\n}";
    };

    return ValidationInfo;

  })();

  ValidatorManager = (function() {
    var _error, _validateerror, _validatesuccess;

    function ValidatorManager(form) {
      this.form = form;
      this.validations = [];
    }

    ValidatorManager.prototype.toString = function() {
      return "{\n	formName:" + this.form.name + ",\n	formAction:" + this.form.action + ",\n	validations: [" + (this.validations.join(',')) + "]\n}";
    };

    ValidatorManager.prototype.add = function(fieldName, msg, funcName, params) {
      return this.validations.push(new ValidationInfo(fieldName, msg, funcName, params));
    };

    ValidatorManager.validationMethods = [];

    ValidatorManager.registerValidation = function(name, func) {
      return this.validationMethods[name] = func;
    };

    ValidatorManager.prototype.isEmtpyField = function(fieldName) {
      var _ref, _ref2;
      return (((_ref = $(this.form.elements[fieldName])) != null ? (_ref2 = _ref.val()) != null ? _ref2.length : void 0 : void 0) != null) > 0;
    };

    _validateerror = function(field, msg) {
      return $(field).addClass("validate-error");
    };

    _validatesuccess = function(field) {
      return $(field).removeClass("validate-error");
    };

    _error = function(errors) {
      return alert(errors.join('\n'));
    };

    ValidatorManager.prototype.validate = function(onvalidateerror, onvalidatesuccess, onsuccess, onerror, checkExists) {
      var errors, field, msg, validation, validationMethod, _i, _len, _ref;
      if (onvalidateerror == null) onvalidateerror = _validateerror;
      if (onvalidatesuccess == null) onvalidatesuccess = _validatesuccess;
      if (onsuccess == null) onsuccess = null;
      if (onerror == null) onerror = _error;
      if (checkExists == null) checkExists = false;
      errors = [];
      _ref = this.validations;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        validation = _ref[_i];
        validationMethod = this.validationMethods[validation.funcName];
        if (!(validationMethod != null)) {
          throw "" + validation.funcName + "という検証メソッドは登録されていません。";
        }
        field = this.form.elements[validation.fieldName];
        if (!(field != null)) {
          if (checkExists) {
            throw "" + this.form.name + "フォームに" + validation.fieldName + "フィールドが見つかりません。";
          } else {
            continue;
          }
        }
        msg = validationMethod(field, validation.msg, validation.params);
        if (msg) {
          onvalidateerror(field, msg);
        } else {
          onvalidatesuccess(field);
        }
      }
      if (errors.length === 0) {
        if (onsuccess != null) onsuccess;
        return true;
      }
      onerror(errors);
      return false;
    };

    return ValidatorManager;

  })();

}).call(this);
