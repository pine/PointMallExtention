declare module chrome {
    module tabs {
        interface Tab {
            url: string;
        }

        interface QueryInfo {
            active?: boolean;
            pinned?: boolean;
            highlighted?: boolean;
            currentWindow?: boolean;
            lastFocusedWindow?: boolean;
            status?: string;
            title?: string;
            url?: string;
            windowId?: number;
            windowType?: string;
            index?: number;
        }

        interface TabsUpdatedEvent {
            addListener(callback: (tabId: number, changeInfo: {}, tab: chrome.tabs.Tab) => void): void;
        }

        interface UpdateProperties {
            url?: string;
            active?: boolean;
            highlighted?: boolean;
            selected?: boolean;
            pinned?: boolean;
            openerTabId?: number;
        }

        interface UpdateFunction {
            (updateProperties: UpdateProperties, callback?: (tab?: Tab) => void): void;
            (tabId: number, updateProperties: UpdateProperties, callback?: (tab?: Tab) => void): void;
        }
    }

    module storage {
        interface StorageArea {
            /**
            * Gets one or more items from storage.
            */
            get(callback: (items: { [key: string]: any }) => void): void;
            get(key: string, callback: (items: { [key: string]: any }) => void): void;
            get(keys: string[], callback: (items: { [key: string]: any }) => void): void;
            get(keys: { [key: string]: any }, callback: (items: { [key: string]: any }) => void): void;

            /**
            * Sets multiple items.
            */
            set(items: { [key: string]: any }, callback?: () => void): void;

            /**
            * Removes one or more items from storage.
            */
            remove(key: string, callback?: () => void): void;
            remove(keys: string[], callback?: () => void): void;

            /**
            * Removes all items from storage.
            */
            clear(callback?: () => void): void;
        }

        interface StorageChange {
            oldValue?: any;
            newValue?: any;
        }

        interface StorageChangedEvent {
            addListener(callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void): void;
        }
    }
}

declare module chrome {
    module tabs {
        var query: (queryInfo: QueryInfo, callbackt: (resul: Tab[]) => void) => void;

        /**
        * Modifies the properties of a tab. Properties that are not specified in updateProperties are not modified.
        */
        var update: UpdateFunction;

        var onUpdated: TabsUpdatedEvent;
    }

    module pageAction {
        var show: (tabId: number) => void;
    }

    module storage {
        var local: StorageArea;
        var sync: StorageArea;
        var managed: StorageArea;
        var onChanged: StorageChangedEvent;
    }
}