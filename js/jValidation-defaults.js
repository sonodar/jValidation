
/*
*********************************************************************************************
// jValidationによるフォーム入力検証用の標準検証メソッド群。
// 検証メソッドの定義、Validatorの登録を行う。
//
// 独自の検証メソッドを定義する場合はこのスクリプトを参考に作成するとよい。
//
// @author Sonoda Ryohei 2012/06/07 MIT Licence.
*********************************************************************************************
*/

(function() {
  var CompareType, ValidatorUtil;

  ValidatorUtil = (function() {

    function ValidatorUtil() {}

    ValidatorUtil.isHalfInt = function(value, sign) {
      return value.toString().test(sign ? /^[-\+]?[0-9]+$/ : /^[0-9]+$/);
    };

    ValidatorUtil.isHalfAlph = function(value) {
      return !value.toString().test(/[^a-zA-Z]/i);
    };

    ValidatorUtil.isHalfAlphInt = function(value) {
      return !value.toString().test(/[^a-zA-Z0-9]/i);
    };

    ValidatorUtil.isHalfNum = function(value) {
      var pattern;
      if (sign) {
        pattern = /^[-\+]?[0-9]+([\.,][0-9]*)?$|^[\.,][0-9]+$/;
      } else {
        pattern = /^[0-9]+([\.,][0-9]*)?$|^[\.,][0-9]+$/;
      }
      return value.toString().test(pattern);
    };

    ValidatorUtil.isRange = function(value, min, max) {
      return (min <= value && value <= max);
    };

    ValidatorUtil.isEmail = function(value, strict) {
      if (strict) {
        return value.toString().test(/^(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+\/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+\/=?\^`{}~|\-]+))*)|(?:"(?:\\[^\r\n]|[^\\"])*")))\@(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+\/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+\/=?\^`{}~|\-]+))*)|(?:\[(?:\\\S|[\x21-\x5a\x5e-\x7e])*\])))$/);
      } else {
        return value.toString().test(/^([-!#-\\'*+\\\/-9=?^-~]+(\\.[-!#-\\'*+\\\/-9=?^-~]+)*|"([]-~!#-[]|\\\\[-~])*")@[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?)*\\.([a-z]{2,4}|museum)$/i);
      }
    };

    ValidatorUtil.isDate = function(value) {
      var d, dateParts, dateStr, dd, mm, yyyy;
      dateStr = value.toString().replace(/^\s+|\s+$/g, '');
      if (!dateStr.test(/^([0-9]{0,2}[0-9]{2}[\/]([1-9]|0[1-9]|1[0-2])[\/]([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-1]))|([0-9]{0,2}[0-9]{2}[-]([1-9]|0[1-9]|1[0-2])[-]([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-1]))$/)) {
        return false;
      }
      dateParts = dateStr.replace(/\-/g, '/').split('/');
      if (dateParts.length !== 3) return false;
      yyyy = new Number(dateParts[0]);
      mm = new Number(dateParts[1] - 1);
      dd = new Number(dateParts[2]);
      if (yyyy.length === 2) {
        if (yyyy < 50) {
          yyyy = '20' + yyyy;
        } else {
          yyyy = '19' + yyyy;
        }
      }
      d = new Date(yyyy, mm, dd);
      return d.getFullYear() === yyyy && d.getMonth() === mm && d.getDate() === dd;
    };

    return ValidatorUtil;

  })();

  /* 検証メソッドを定義してValidatorManagerに登録する。
  */

  ValidatorManager.registerValidation('Required', function(field, msg) {
    if (this.isEmtpyField(field)) return msg;
  });

  ValidatorManager.registerValidation('HalfInt', function(field, msg, sign) {
    if (this.isEmtpyField(field)) return '';
    if (!ValidatorUtil.isHalfInt($(this.form.elements[field]).val(), sign)) {
      return msg;
    }
  });

  ValidatorManager.registerValidation('HalfAlph', function(field, msg) {
    if (this.isEmtpyField(field)) return '';
    if (!ValidatorUtil.isHalfAlph($(this.form.elements[field]).val())) return msg;
  });

  ValidatorManager.registerValidation('HalfAlphInt', function(field, msg) {
    if (this.isEmtpyField(field)) return '';
    if (!ValidatorUtil.isHalfAlphInt($(this.form.elements[field]).val())) {
      return msg;
    }
  });

  ValidatorManager.registerValidation('HalfNum', function(field, msg, sign) {
    if (this.isEmtpyField(field)) return '';
    if (!ValidatorUtil.isHalfNum($(this.form.elements[field]).val(), sign)) {
      return msg;
    }
  });

  ValidatorManager.registerValidation('Range', function(field, msg, params) {
    var max, min, value;
    min = params.min;
    max = params.max;
    if (!(max != null) || isNaN(max || !(min != null) || isNaN(min))) {
      throw "ValidatorManager#Range: min, maxには数値を指定してください。 {min=" + min + ", max=" + max + "}";
    }
    if (this.isEmtpyField(field)) return '';
    value = $(this.form.elements[field]).val();
    if (isNaN(value)) return '';
    if (!ValidatorUtil.isRange(value, min, max)) return msg;
  });

  ValidatorManager.registerValidation('Max', function(field, msg, max) {
    var value;
    if (!(max != null)) throw 'ValidatorManager#Max: maxを指定してください。';
    if (isNaN(max)) throw "ValidatorManager#Max: maxには数値を指定してください。 max=" + max;
    if (this.isEmtpyField(field)) return '';
    value = $(this.form.elements[field]).val();
    if (!isNaN(value && new Number(value > max))) return msg;
  });

  ValidatorManager.registerValidation('Min', function(field, msg, min) {
    var value;
    if (!(min != null)) throw 'ValidatorManager#Min: minを指定してください。';
    if (isNaN(min)) throw "ValidatorManager#Min: minには数値を指定してください。 min=" + min;
    if (this.isEmtpyField(field)) return '';
    value = $(this.form.elements[field]).val();
    if (!isNaN(value && new Number(value < min))) return msg;
  });

  ValidatorManager.registerValidation('Length', function(field, msg, params) {
    var max, min, strLength, _ref;
    min = params.min;
    max = params.max;
    if (!(max != null) || max <= 0 || isNaN(max || !(min != null) || min <= 0 || isNaN(min))) {
      throw "ValidatorManager#Length: min, maxには1以上の整数を指定してください。 {min=" + min + ", max=" + max + "}";
    }
    if (this.isEmtpyField(field)) return '';
    strLength = (_ref = $(this.form.elements[field]).val()) != null ? _ref.length : void 0;
    if (!ValidatorUtil.isRange(strLength, min, max)) return msg;
  });

  ValidatorManager.registerValidation('MaxLength', function(field, msg, max) {
    var _ref;
    if (!(max != null) || max <= 0 || isNaN(max)) {
      throw "ValidatorManager#MaxLength: maxには1以上の整数を指定してください。 max=" + max;
    }
    if (this.isEmtpyField(field)) return '';
    if (((_ref = $(this.form.elements[field]).val()) != null ? _ref.length : void 0) > max) {
      return msg;
    }
  });

  ValidatorManager.registerValidation('MinLength', function(field, msg, min) {
    var _ref;
    if (!(min != null) || min <= 0 || isNaN(min)) {
      throw "ValidatorManager#MinLength: minには1以上の整数を指定してください。 min=" + min;
    }
    if (this.isEmtpyField(field)) return '';
    if (((_ref = $(this.form.elements[field]).val()) != null ? _ref.length : void 0) < min) {
      return msg;
    }
  });

  ValidatorManager.registerValidation('Date', function(field, msg) {
    if (this.isEmtpyField(field)) return '';
    if (!ValidatorUtil.isDate($(this.form.elements[field]).val())) return msg;
  });

  ValidatorManager.registerValidation('DatePart', function(year, msg, params) {
    var dateValue, day, month;
    month = params.month;
    day = params.day;
    if (!month || !day) throw 'ValidatorManager#DatePart: 月、日のフィールド名を指定してください。';
    if (this.isEmtpyField(year || this.isEmtpyField(month || this.isEmtpyField(day)))) {
      return '';
    }
    dateValue = $(this.form.elements[year]).val();
    dateValue += '/' + $(this.form.elements[month]).val();
    dateValue += '/' + $(this.form.elements[day]).val();
    if (!ValidatorUtil.isDate(dateValue)) return msg;
  });

  ValidatorManager.registerValidation('Mask', function(field, msg, pattern) {
    if (!pattern) throw 'ValidatorManager#Mask: patternを指定してください。';
    if (this.isEmtpyField(field)) return '';
    if (!$(this.form.elements[field]).val().test(pattern)) return msg;
  });

  ValidatorManager.registerValidation('Email', function(field, msg, strict) {
    if (strict == null) strict = false;
    if (this.isEmtpyField(field)) return '';
    if (!ValidatorUtil.isEmail($(this.form.elements[field]).val(), strict)) {
      return msg;
    }
  });

  ValidatorManager.registerValidation('Equals', function(field, msg, target) {
    if (this.isEmtpyField(field)) return '';
    if (!target) {
      throw "ValidatorManager#Equals: " + field + "と等価チェックを行うフィールド名を指定してください。";
    }
    if ($(this.form.elements[field]).val() !== $(this.form.elements[target]).val()) {
      return msg;
    }
  });

  ValidatorManager.registerValidation('RequiredRefs', function(field, msg, params) {
    var checkExists, elm, elmName, nonPrerequisite, prerequisite, _i, _j, _len, _len2, _ref;
    prerequisite = params.prerequisite;
    nonPrerequisite = params.nonPrerequisite;
    if (!(prerequisite != null) && !(nonPrerequisite != null)) {
      throw 'ValidatorManager#RequiredRefs: prerequisite, nonPrerequisiteのいずれかを指定してください。';
    }
    checkExists = (_ref = params.checkExists) != null ? _ref : true;
    if (prerequisite != null) {
      for (_i = 0, _len = prerequisite.length; _i < _len; _i++) {
        elmName = prerequisite[_i];
        elm = this.form.elements[elmName];
        if (!(elm != null)) {
          if (checkExists) {
            throw "ValidatorManager#RequiredRefs: " + elmName + "フィールドが見つかりません。";
          } else {
            continue;
          }
        }
        if (!$(elm).val()) return '';
      }
    }
    if (nonPrerequisite != null) {
      for (_j = 0, _len2 = nonPrerequisite.length; _j < _len2; _j++) {
        elmName = nonPrerequisite[_j];
        elm = this.form.elements[elmName];
        if (!(elm != null)) {
          if (checkExists) {
            throw "ValidatorManager#RequiredRefs: " + elmName + "フィールドが見つかりません。";
          } else {
            continue;
          }
        }
        if ($(elm).val()) return '';
      }
    }
    if (this.isEmtpyField(field)) return msg;
  });

  CompareType = (function() {

    function CompareType(value) {
      this.value = value;
    }

    CompareType.EQUAL = new CompareType('EQUAL');

    CompareType.GREATER = new CompareType('GREATER');

    CompareType.LESS = new CompareType('LESS');

    CompareType.GREATER_EQUAL = new CompareType('GREATER_EQUAL');

    CompareType.LESS_EQUAL = new CompareType('LESS_EQUAL');

    return CompareType;

  })();

  ValidatorManager.registerValidation('CompareNumber', function(field, msg, params) {
    var compareType, targetName, targetValue, value, valule;
    targetName = params.targetName;
    compareType = params.compareType;
    if (!(this.form.elements[targetName] != null)) {
      throw "ValidatorManager#CompareNumber: " + this.form.name + "フォームに" + targetName + "フィールドが見つかりません。";
    }
    if (this.isEmtpyField(field || this.isEmtpyField(targetName))) return '';
    valule = $(this.form.elements[field]).val();
    targetValue = $(this.form.elements[targetName]).val();
    if (isNaN(value || isNaN(targetValue))) return '';
    value = new Number(value);
    targetValue = new Number(targetValue);
    switch (compareType) {
      case CompareType.EQUAL:
        if (value !== targetValue) return msg;
        break;
      case CompareType.GREATER:
        if (value <= targetValue) return msg;
        break;
      case CompareType.LESS:
        if (value >= targetValue) return msg;
        break;
      case CompareType.GREATER_EQUAL:
        if (value < targetValue) return msg;
        break;
      case CompareType.LESS_EQUAL:
        if (value > targetValue) return msg;
    }
  });

  /* 登録した検証メソッドをフィールドに設定するためのショートカットメソッド
  */

  ValidatorManager.prototype.addRequired = function(fieldName, msg) {
    return this.add(fieldName, msg, 'Required');
  };

  ValidatorManager.prototype.addHalfInt = function(fieldName, msg, sign) {
    if (sign == null) sign = false;
    return this.add(fieldName, msg, 'HalfInt', sign);
  };

  ValidatorManager.prototype.addHalfAlph = function(fieldName, msg) {
    return this.add(fieldName, msg, 'HalfAlph');
  };

  ValidatorManager.prototype.addHalfAlphInt = function(fieldName, msg) {
    return this.add(fieldName, msg, 'HalfAlphInt');
  };

  ValidatorManager.prototype.addHalfNum = function(fieldName, msg, sign) {
    if (sign == null) sign = false;
    return this.add(fieldName, msg, 'HalfNum', sign);
  };

  ValidatorManager.prototype.addRange = function(fieldName, msg, min, max) {
    return this.add(fieldName, msg, 'Range', {
      min: new Number(min),
      max: new Number(max)
    });
  };

  ValidatorManager.prototype.addMax = function(fieldName, msg, max) {
    return this.add(fieldName, msg, 'Max', new Number(max));
  };

  ValidatorManager.prototype.addMin = function(fieldName, msg, min) {
    return this.add(fieldName, msg, 'Min', new Number(mi));
  };

  ValidatorManager.prototype.addLength = function(fieldName, msg, min, max) {
    return this.add(fieldName, msg, 'Length', {
      min: new Number(min),
      max: new Number(max)
    });
  };

  ValidatorManager.prototype.addMaxLength = function(fieldName, msg, max) {
    return this.add(fieldName, msg, 'MaxLength', new Number(max));
  };

  ValidatorManager.prototype.addMinLength = function(fieldName, msg, min) {
    return this.add(fieldName, msg, 'MinLength', new Number(min));
  };

  ValidatorManager.prototype.addDate = function(fieldName, msg) {
    return this.add(fieldName, msg, 'Date');
  };

  ValidatorManager.prototype.addDatePart = function(msg, year, month, day) {
    return this.add(year, msg, 'DatePart', {
      month: month,
      day: day
    });
  };

  ValidatorManager.prototype.addMask = function(fieldName, msg, pattern) {
    return this.add(fieldName, msg, 'Mask', pattern);
  };

  ValidatorManager.prototype.addEmail = function(fieldName, msg) {
    return this.add(fieldName, msg, 'Email');
  };

  ValidatorManager.prototype.addEquals = function(fieldName, msg, targetName) {
    return this.add(fieldName, msg, 'Equals', targetName);
  };

  ValidatorManager.prototype.addRequiredRefs = function(fieldName, msg, prerequisite, nonPrerequisite, checkExists) {
    if (checkExists == null) checkExists = true;
    return this.add(fieldName, msg, 'RequiredRefs', {
      prerequisite: prerequisite,
      nonPrerequisite: nonPrerequisite,
      checkExists: checkExists
    });
  };

  ValidatorManager.prototype.addCompareNumber = function(fieldName, msg, targetName, compareType) {
    return this.add(fieldName, msg, 'CompareNumber', {
      targetName: targetName,
      compareType: compareType
    });
  };

}).call(this);
