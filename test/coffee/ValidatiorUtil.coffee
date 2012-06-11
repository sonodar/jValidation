describe "ValidatorUtil#検証メソッドのテスト", ->

    describe "isHalfInt(str, sign)", ->
        it "strが半角整数かどうかをチェックする", ->
          expect(ValidatorUtil.isHalfInt "123").toBeTruthy()
          expect(ValidatorUtil.isHalfInt "abc").not.toBeTruthy()
          expect(ValidatorUtil.isHalfInt "1a2b3c").not.toBeTruthy()
          expect(ValidatorUtil.isHalfInt "+123").not.toBeTruthy()
          expect(ValidatorUtil.isHalfInt "-123").not.toBeTruthy()
          expect(ValidatorUtil.isHalfInt "1.23").not.toBeTruthy()

        it "signを指定した場合、+-記号を許容する", ->
          expect(ValidatorUtil.isHalfInt "123",true).toBeTruthy()
          expect(ValidatorUtil.isHalfInt "abc",true).not.toBeTruthy()
          expect(ValidatorUtil.isHalfInt "1a2b3c",true).not.toBeTruthy()
          expect(ValidatorUtil.isHalfInt "+123",true).toBeTruthy()
          expect(ValidatorUtil.isHalfInt "-123",true).toBeTruthy()
          expect(ValidatorUtil.isHalfInt "-1.23",true).not.toBeTruthy()

    describe "isHalfAlph(str)", ->      
        it "strが半角英字かどうかをチェックする", ->
          expect(ValidatorUtil.isHalfAlph "abcDEF").toBeTruthy()
          expect(ValidatorUtil.isHalfAlph "123").not.toBeTruthy()
          expect(ValidatorUtil.isHalfAlph "1a2b3c").not.toBeTruthy()
          expect(ValidatorUtil.isHalfAlph "ＡＢＣｄｅｆ").not.toBeTruthy()
          expect(ValidatorUtil.isHalfAlph "あいうえお").not.toBeTruthy()

    describe "isHalfAlphInt(str)", ->
        it "strが半角英数字かどうかをチェックする", ->
          expect(ValidatorUtil.isHalfAlphInt "abcDEF").toBeTruthy()
          expect(ValidatorUtil.isHalfAlphInt "123").toBeTruthy()
          expect(ValidatorUtil.isHalfAlphInt "1a2b3c").toBeTruthy()
          expect(ValidatorUtil.isHalfAlphInt "ＡＢＣ123").not.toBeTruthy()
          expect(ValidatorUtil.isHalfAlphInt "abc１２３").not.toBeTruthy()

    describe "isHalfNum(str, sign)", ->
        it "strが半角数値かどうかをチェックする", ->
          expect(ValidatorUtil.isHalfNum "123").toBeTruthy()
          expect(ValidatorUtil.isHalfNum "abc").not.toBeTruthy()
          expect(ValidatorUtil.isHalfNum "1a2b3c").not.toBeTruthy()
          expect(ValidatorUtil.isHalfNum "+123").not.toBeTruthy()
          expect(ValidatorUtil.isHalfNum "-123").not.toBeTruthy()
          expect(ValidatorUtil.isHalfNum "1.23").toBeTruthy()
          expect(ValidatorUtil.isHalfNum "1.23.00").not.toBeTruthy()

        it "signを指定した場合、+-記号を許容する", ->
          expect(ValidatorUtil.isHalfNum "123",true).toBeTruthy()
          expect(ValidatorUtil.isHalfNum "abc",true).not.toBeTruthy()
          expect(ValidatorUtil.isHalfNum "1a2b3c",true).not.toBeTruthy()
          expect(ValidatorUtil.isHalfNum "+123",true).toBeTruthy()
          expect(ValidatorUtil.isHalfNum "-123",true).toBeTruthy()
          expect(ValidatorUtil.isHalfNum "-1.23",true).toBeTruthy()
          expect(ValidatorUtil.isHalfNum "-1.23.00").not.toBeTruthy()

    describe "isRange(val, min, max)", ->
        it "valがmin以上、max以下の値かどうかをチェックする", ->
          expect(ValidatorUtil.isRange "1", "0", "2").toBeTruthy()
          expect(ValidatorUtil.isRange -1, 0, 2).not.toBeTruthy()
          expect(ValidatorUtil.isRange 3, 0, 2).not.toBeTruthy()
          expect(ValidatorUtil.isRange "5", -1, 2).not.toBeTruthy()
          expect(ValidatorUtil.isRange "5", 5, "5").toBeTruthy()

    describe "isEmail(str, strict)", ->
        it "strがメールアドレスかどうかをチェックする", ->
          expect(ValidatorUtil.isEmail "sonodar@fsi.co.jp").toBeTruthy()
          expect(ValidatorUtil.isEmail "sonodar@fsi@co.jp").not.toBeTruthy()
          expect(ValidatorUtil.isEmail "sonoda..r@fsi.co.jp").toBeTruthy()
          expect(ValidatorUtil.isEmail "sonodar/fsi.co.jp").not.toBeTruthy()

        it "strがRFC2822準拠のメールアドレスかどうかをチェックする", ->
          expect(ValidatorUtil.isEmail "sonodar@fsi.co.jp", true).toBeTruthy()
          expect(ValidatorUtil.isEmail "sonodar@fsi@co.jp", true).toBeTruthy()
          expect(ValidatorUtil.isEmail "sonoda..r@fsi.co.jp", true).toBeTruthy()
          expect(ValidatorUtil.isEmail "sonodar/fsi.co.jp", true).not.toBeTruthy()

    describe "isDate(str)", ->
        describe "strが日付文字列かどうかをチェックする", ->
          it "'(yy)yy/MM/dd'形式", ->
            expect(ValidatorUtil.isDate "2012/05/12").toBeTruthy()
            expect(ValidatorUtil.isDate "2012/5/12").toBeTruthy()
            expect(ValidatorUtil.isDate "99/05/12").toBeTruthy()
            expect(ValidatorUtil.isDate "49/5/2").toBeTruthy()
          it "'(yy)yy-MM-dd'形式", ->
            expect(ValidatorUtil.isDate "2012-05-12").toBeTruthy()
            expect(ValidatorUtil.isDate "2012-5-12").toBeTruthy()
            expect(ValidatorUtil.isDate "99-05-12").toBeTruthy()
            expect(ValidatorUtil.isDate "49-5-2").toBeTruthy()
          it "'(yy)yy年MM月dd日'形式", ->
            expect(ValidatorUtil.isDate "2012年05月12日").toBeTruthy()
            expect(ValidatorUtil.isDate "2012年5月12日").toBeTruthy()
            expect(ValidatorUtil.isDate "99年05月12日").toBeTruthy()
            expect(ValidatorUtil.isDate "49年5月2日").toBeTruthy()
          it "エラー書式", ->
            expect(ValidatorUtil.isDate "2012/05-12").not.toBeTruthy()
            expect(ValidatorUtil.isDate "2012-02-29").toBeTruthy()
            expect(ValidatorUtil.isDate "2011-02-29").not.toBeTruthy()
            expect(ValidatorUtil.isDate "2013-13-04").not.toBeTruthy()