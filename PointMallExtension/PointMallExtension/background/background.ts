// <reference path="../vendor/d.ts/url.d.ts" />
// <reference path="../vendor/d.ts/underscore.d.ts" />
// <reference path="../vendor/d.ts/zepto.d.ts" />
// <reference path="../vendor/d.ts/chrome.d.ts" />
// <reference path="../common/d.ts/pointMall.d.ts" />

declare var POINT_MALL_SHOPS_JSON_URL: string;

module credit.pointMall.background {
    var PointMallShopPath = POINT_MALL_SHOPS_JSON_URL;
    var PointMallShops: Shop[] = null;

    function addPageActionChecker(
        listener: (tabId: number, tab: chrome.tabs.Tab) => void
        ): void {

        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.url) {
                tab.url = changeInfo.url;
            }

            listener(tabId, tab);
        });

        chrome.tabs.onCreated.addListener((tab) => {
            listener(tab.id, tab);
        });

        chrome.tabs.onMoved.addListener((tabId, moveInfo) => {
            chrome.tabs.get(tabId, (tab) => {
                listener(tabId, tab);
            });
        });

        chrome.tabs.onAttached.addListener((tabId, attachInfo) => {
            chrome.tabs.get(tabId, (tab) => {
                listener(tabId, tab);
            });
        });

        chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
            chrome.tabs.get(addedTabId, (tab) => {
                listener(addedTabId, tab);
            });
        });
    }

    function checkPageAction(
        tabId: number,
        tab: chrome.tabs.Tab
        ): void
    {
        // ショップが未取得な場合
        if (!PointMallShops) {
            // 遅延して実行
            _.delay(() => {
                checkPageAction(tabId, tab);
            }, 10);

            return;
        }

        // URL がまだ存在しない場合は処理を中断する
        if (!tab.url) {
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
        chrome.pageAction.setIcon({ tabId: tabId, path: chrome.extension.getURL('/assets/icons/icon19.png') });
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
    addPageActionChecker(checkPageAction);
}
