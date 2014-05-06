// <reference path="../vendor/d.ts/url.d.ts" />
// <reference path="../vendor/d.ts/underscore.d.ts" />
// <reference path="../vendor/d.ts/zepto.d.ts" />
// <reference path="../common/d.ts/chrome.d.ts" />
// <reference path="../common/d.ts/pointMall.d.ts" />

declare var POINT_MALL_SHOPS_JSON_URL: string;

module credit.pointMall.background {
    var PointMallShopPath = POINT_MALL_SHOPS_JSON_URL;
    var PointMallShops: Shop[] = null;

    function checkPageAction(
        tabId: number,
        changeInfo: any,
        tab: chrome.tabs.Tab
        ): void
    {
        // ショップが未取得な場合
        if (!PointMallShops) {
            // 遅延して実行
            _.delay(() => {
                checkPageAction(tabId, changeInfo, tab);
            }, 10);

            return;
        }

        // 現在のホスト名を取得
        var hostname = url('hostname', tab.url);

        // 現在のホスト名にマッチしたショップのみを抽出する
        var matchedShops = _.filter(PointMallShops, (shop) => {
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
    function getShopJsonFromRemote(callback: (shops: Shop[]) => void): void {
        $.getJSON(PointMallShopPath, (data, status, xhr) => {
            if (_.isArray(data)) {
                callback(<Shop[]> data);
            }
        });
    }

    function getShopJSON(): void {
        // リモートから最新版を取得
        getShopJsonFromRemote((shops) => {
            PointMallShops = shops;
            chrome.storage.local.set({ "pointMallShops": shops });
        });

        // ローカルストレージから取得
        chrome.storage.local.get((items) => {
            var shops = <Shop[]> items["pointMallShops"];

            if (!PointMallShops && shops) {
                PointMallShops = shops;
            }
        });
    }
    
    getShopJSON();
    chrome.tabs.onUpdated.addListener(checkPageAction);
}
