// <reference path="../vendor/d.ts/url.d.ts" />
// <reference path="../vendor/d.ts/underscore.d.ts" />
// <reference path="../vendor/d.ts/zepto.d.ts" />
// <reference path="../common/d.ts/chrome.d.ts" />
// <reference path="../common/d.ts/orico.d.ts" />

module orico.background {
    var OricoMallShopPath = "../orico_mall.json";
    var OricoMallShops: orico.mall.Shop[] = null;

    function checkPageAction(
        tabId: number,
        changeInfo: any,
        tab: chrome.tabs.Tab
        ): void
    {
        // ショップが未取得な場合
        if (OricoMallShops == null) {
            // 遅延して実行
            _.delay(() => {
                checkPageAction(tabId, changeInfo, tab);
            }, 10);
        }

        // 現在のホスト名を取得
        var hostname = url('hostname', tab.url);

        // 現在のホスト名にマッチしたショップのみを抽出する
        var matchedShops = _.filter(OricoMallShops, (shop) => {
            // 後方一致
            return hostname.slice(-shop.hostName.length) == shop.hostName;
        });

        // マッチしたショップが無い場合
        if (matchedShops.length == 0) {
            return;
        }

        // ページアクションを表示
        chrome.pageAction.show(tabId);
        
    }

    function getShopJSON(): void {
        $.getJSON(OricoMallShopPath, (data, status, xhr) => {
            if (_.isArray(data)) {
                OricoMallShops = <orico.mall.Shop[]> data;
                chrome.storage.local.set({ oricoMallShops: data });
            }
        });
    }
    
    getShopJSON();
    chrome.tabs.onUpdated.addListener(checkPageAction);
}
