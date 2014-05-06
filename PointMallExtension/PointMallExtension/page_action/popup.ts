// <reference path="../vendor/d.ts/url.d.ts" />
// <reference path="../vendor/d.ts/underscore.d.ts" />
// <reference path="../vendor/d.ts/zepto.d.ts" />
// <reference path="../vendor/d.ts/knockout.d.ts" />
// <reference path="../common/d.ts/chrome.d.ts" />
// <reference path="../common/d.ts/pointMall.d.ts" />
// <reference path="../common/d.ts/common.d.ts" />

module credit.pointMall.pageAction {
    var shopsElement = $('.shop-list');
    var loginButtonElement = $('.button.login');

    function show(shops: Shop[]): void {
        chrome.tabs.query({ active: true }, function (tabs) {
            var tab = tabs[0];
            
            // 現在のタブのホスト名を取得
            var hostname = url("hostname", tab.url);

            // 現在のホスト名にマッチしたショップのみを抽出する
            var matchedShops = _.filter(shops, (shop) => {
                // 後方一致
                return hostname.slice(-shop.hostName.length) == shop.hostName;
            });

            // 該当するショップを列挙する
            _.each(matchedShops, (shop) => {
                var li = $('<li />')
                var label = $('<label />');

                $('<input type="radio" name="shop" />')
                    .val(shop.pointMallUrl)
                    .appendTo(label);

                label.append(shop.name);
                li.append(label);
                shopsElement.append(li);
            });

            shopsElement.find('[type="radio"]').first().prop('checked', true);
        });
    }

    function login(): void {
        var checkedShop = shopsElement.find(':checked');

        if (checkedShop.length > 0) {
            chrome.tabs.update({
                url: checkedShop.val()
            });

            window.close();
        }
    }

    // ショップ一覧を取得
    chrome.storage.local.get((items) => {
        var shops = <Shop[]> items["pointMallShops"];

        if (shops) {
            show(shops);
        }
    });

    // イベントハンドラを設定
    loginButtonElement.on('click', login);

    // ポイントモール固有値を設定
    $('.point-mall-name').text(POINT_MALL_NAME);
    $('.point-mall-link').attr('href', POINT_MALL_URL);

    $("body").addClass(CREDIT_CARD_ISSUER.toLowerCase());
}