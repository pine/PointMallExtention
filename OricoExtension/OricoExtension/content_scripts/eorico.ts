/// <reference path="../vendor/d.ts/zepto.d.ts" />

module orico {
    var title = document.title;

    // ログイン画面
    if (title.indexOf('ログイン') > -1) {
        var loginForm = $('form');
        var loginId = $('[name="LoginId"]');
        var loginPassword = $('[name="Pwd"]');
        var loginButton = $('[alt="ログイン"]');

        // パスワード欄 Enter でログイン
        loginPassword.on('keypress', (e) => {
            var ENTER = 13;

            if (e.keyCode == ENTER) {
                loginButton.click();
            }
        });

        // LastPass の自動入力が終了したらログイン
        // 自動入力の判定に、フォームへの入力開始時間の差を見る
        loginForm.on('change', (() => {
            var AUTO_INPUT_DIFF_MAX = 100; // ms
            var idInputDate = null;
            var passwordInputDate = null;

            return () => {
                if (loginId.val() && !idInputDate) {
                    idInputDate = new Date();
                }

                if (loginPassword.val() && !passwordInputDate) {
                    passwordInputDate = new Date();
                }

                if (idInputDate && passwordInputDate) {
                    var diff = Math.abs(idInputDate - passwordInputDate);

                    if (diff < AUTO_INPUT_DIFF_MAX) {
                        loginButton.click();
                    }
                }
            };
        })());
    }

    // 画像認証
    else if (title.indexOf('認証') > -1) {
        var token = $('[name="token"]');

        token.focus();
    }
}

