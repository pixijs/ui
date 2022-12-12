// detect if storage is available AND usable
// (https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)

// TODO: resolve eslint issue: https://github.com/typescript-eslint/typescript-eslint/issues/1824
export enum StorageType
{ //eslint-disable-line
    LOCAL = 'local',
    SESSION = 'session',
}

export function autoDetectStorage(type: StorageType): boolean
{
    let storage: Storage;

    try
    {
        storage = type === StorageType.LOCAL ? window.localStorage : window.sessionStorage;
        const x = '__storage_test__';

        storage.setItem(x, x);
        storage.removeItem(x);

        return true;
    }
    catch (e)
    {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22
            // Firefox
            || e.code === 1014
            // test name field too, because code might not be present
            // everything except Firefox
            || e.name === 'QuotaExceededError'
            // Firefox
            || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
            // acknowledge QuotaExceededError only if there's something already stored
            && (storage && storage.length !== 0);
    }
}
