// <reference path="../vendor/d.ts/url.d.ts" />
// <reference path="../vendor/d.ts/underscore.d.ts" />
// <reference path="../vendor/d.ts/zepto.d.ts" />
// <reference path="../common/d.ts/chrome.d.ts" />
// <reference path="../common/d.ts/orico.d.ts" />

declare var POINT_MALL_SHOPS_JSON_URL: string;

module orico.background {
    var OricoMallShopPath = POINT_MALL_SHOPS_JSON_URL;
    var OricoMallShops: orico.mall.Shop[] = null;

    function checkPageAction(
        tabId: number,
        changeInfo: any,
        tab: chrome.tabs.Tab
        ): void
    {
        // ショップが未取得な場合
        if (!OricoMallShops) {
            // 遅延して実行
            _.delay(() => {
                checkPageAction(tabId, changeInfo, tab);
            }, 10);

            return;
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

    // リモートから最新版を取得する
    function getShopJsonFromRemote(callback: (shops: orico.mall.Shop[]) => void): void {
        $.getJSON(OricoMallShopPath, (data, status, xhr) => {
            if (_.isArray(data)) {
                callback(<orico.mall.Shop[]> data);
            }
        });
    }

    function getShopJSON(): void {
        // リモートから最新版を取得
        getShopJsonFromRemote((shops) => {
            OricoMallShops = shops;
            chrome.storage.local.set({ oricoMallShops: shops });
        });

        // ローカルストレージから取得
        chrome.storage.local.get((items) => {
            var shops = <orico.mall.Shop[]> items["oricoMallShops"];

            if (!OricoMallShops && shops) {
                OricoMallShops = shops;
            }
        });
    }
    
    getShopJSON();
    chrome.tabs.onUpdated.addListener(checkPageAction);
}
