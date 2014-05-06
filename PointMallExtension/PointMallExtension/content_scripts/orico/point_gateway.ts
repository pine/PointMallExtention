/// <reference path="../../vendor/d.ts/zepto.d.ts" />

module orico {
    var title = document.title;

    if (title.indexOf('ログイン') > -1) {
        var loginForm = $('#mainForm');
        var loginId = $('#loginId');
        var loginPassword = $('#password');
        var loginCaptcha = $('[name="captchaString"]');
        var loginButton = $('#connectLogin');

        
        // Enter でログイン
        loginCaptcha.on('keypress', function (event) {
            var ENTER = 13;

            if (event.keyCode === ENTER) {
                loginButton.click();
            }
        });

        // LastPass の自動入力が終了したらフォーカスを当てる
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
                        // 入力欄にフォーカスを当てる
                        loginCaptcha.focus();
                    }
                }
            };
        })());
    }
} 