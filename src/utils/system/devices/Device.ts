import type { TierResult } from 'detect-gpu';
import { getGPUTier } from 'detect-gpu';
import { UAParser } from 'ua-parser-js';

import { autoDetectStorage, StorageType } from '../detections/autoDetectStorage';
import { DetectAVIF } from '../detections/images/detectAVIF';
import { DetectWebp } from '../detections/images/detectWebP';
import { isGalaxyS5, isIPhone6, isKindle } from './deviceQueries';

export type DeviceParserType = 'browser' | 'os' | 'device' | 'gpu';
export type ParsedDeviceQuery = {type: DeviceParserType; value: string};
export type DeviceQueryFunction = (query: ParsedDeviceQuery) => boolean;

export enum GPU_TIER
    {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
}

/**
 * This class gives us all the info we need on the device being used!
 * this is exported as a singleton and is powered by https://www.npmjs.com/package/ua-parser-js
 * under the hood
 *
 * There are two main ways to interact with this class
 *
 * 1. Queries
 *      - using a simple query syntax you can ask powerful questions about what device you are on.
 *      for examples...
 *          - Device.query('browser:chrome--os:ios--device:iPhone6')
 *          - Device.query('browser:desktop--os:mac')
 *          - Device.query('browser:version:86--browser:chrome')
 *          - Device.query('gpu:3')
 *      The first query will check if the browser is chrome, on an ios device, and is the iPhone6
 *
 *      For a full list of result check here https://www.npmjs.com/package/ua-parser-js
 *      NOTE: all results in the link above are formatted to lowercase and any spaces replaced with '-'. Except for device models
 *
 * 2. Simple Checks
 *      - you can ask Device simpler questions like so
 *          - Device.isBrowser('chrome')
 *          - Device.isOS('android')
 *          - Device.isDevice('tablet')
 *          - Device.isOS('version:6').
 *          - Device.isGPU('2') || Device.isGPU(GPU_TIER.MEDIUM).
 *      NOTE: when you use these simpler methods you do parse in `browser`, `os`, `device`, 'gpu'
 *
 * All results are cached so there is no additional performance penalty after it is first parsed
 *
 * There are a couple of custom rules that you will not find on the ua-parser site:
 * - os:mobile
 * - os:desktop
 * - device:mobile
 * - device:phone
 * - device:tablet
 *
 * There are also 3 custom query functions installed by default which give you access to
 * - device:kindle
 * - device:iPhone6
 * - device:s5
 * You can add your own using `Device.addQuery(func)`
 */
export class DeviceClass
{
    public allowGPUData = true;
    public gpuData: TierResult;
    public uaData: UAParser.IResult;
    public readonly isLocalStorageAllowed: boolean;
    public readonly isSessionStorageAllowed: boolean;
    public supportedFileFormats = {
        webp: false,
        avif: false,
    };

    private readonly customQueries: DeviceQueryFunction[] = [];

    private readonly caches: Record<string, Record<string, boolean>> = {
        query: {},
        browser: {},
        os: {},
        device: {},
        custom: {},
    };

    constructor()
    {
        this.uaData = new UAParser().getResult();
        this.isLocalStorageAllowed = autoDetectStorage(StorageType.LOCAL);
        this.isSessionStorageAllowed = autoDetectStorage(StorageType.SESSION);

        this._checkIPadPro();
    }

    get desktop(): boolean
    {
        return !(this.uaData.device.type === 'tablet' || this.uaData.device.type === 'mobile');
    }

    get mobile(): boolean
    {
        return this.isDevice('mobile');
    }

    get phone(): boolean
    {
        return this.isDevice('phone');
    }

    get tablet(): boolean
    {
        return this.isDevice('tablet');
    }

    get android(): boolean
    {
        return this.uaData.os.name === 'Android';
    }

    get ios(): boolean
    {
        return this.uaData.os.name === 'iOS';
    }

    get kindle(): boolean
    {
        return this.isDevice('kindle');
    }

    get ie(): boolean
    {
        return this.uaData.browser.name === 'IE';
    }

    get gpu(): number
    {
        if (!this.gpuData?.tier)
        {
            console.warn('[Device] GPU data has not been initialised, returning default tier value');

            return 2;
        }

        return this.gpuData.tier;
    }

    /**
     * Initialises async data about the device
     */
    public async init(): Promise<void>
    {
        if (this.gpuData) return;

        this.supportedFileFormats.webp = await DetectWebp();
        this.supportedFileFormats.avif = await DetectAVIF();

        if (!this.allowGPUData) return;
        this.gpuData = await getGPUTier();
    }

    /**
     * Adds a set of functions to the list to check against
     * @param funcs - functions to check against
     */
    public addQuery(...funcs: DeviceQueryFunction[]): void
    {
        this.customQueries.push(...funcs);
    }

    /**
     * Returns whether or not the query is true for this device
     * @param query - query to be parsed
     */
    public query(query: string): boolean
    {
        const cachedRes = this.checkCache(query, 'query');

        if (cachedRes !== null) return cachedRes;

        const splitMatches = this.parseQuery(query);

        let matches = true;

        for (let i = 0; i < splitMatches.length; i++)
        {
            const value = splitMatches[i];

            switch (value.type)
            {
                case 'browser':
                    matches = this.isBrowser(value.value);
                    break;
                case 'os':
                    matches = this.isOS(value.value);
                    break;
                case 'device':
                    matches = this.isDevice(value.value);
                    break;
                case 'gpu':
                    matches = this.isGPU(value.value);
                    break;
                default:
                    matches = this.checkCustom(value);
                    break;
            }

            if (!matches) break;
        }

        this.addToCache(query, matches, 'query');

        return matches;
    }

    /**
     * Returns whether or not the specified browser is being used
     * @param value - value to test
     */
    public isBrowser(value: string): boolean
    {
        const cachedRes = this.checkCache(value, 'browser');

        if (cachedRes !== null) return cachedRes;

        const tests = [
            () => this.checkCustom({ type: 'browser', value }),
            () =>
            {
                const isVersion = value.split(':');

                if (isVersion.length > 1)
                {
                    return this.uaData.browser.version.split('.')[0] === isVersion[1];
                }

                return false;
            },
            () => this.supportedFileFormats[value as 'webp' | 'avif'] ?? false,
            () => this.uaData.browser.name.toLowerCase().replace(' ', '-') === value,
        ];

        return this.checkTests(tests, value, 'browser');
    }

    /**
     * Returns whether or not the specified OS is being used
     * @param value - value to test
     */
    public isOS(value: string): boolean
    {
        const cachedRes = this.checkCache(value, 'os');

        if (cachedRes !== null) return cachedRes;

        const tests = [
            () => this.checkCustom({ type: 'os', value }),
            () =>
            {
                const isVersion = value.split(':');

                if (isVersion.length > 1)
                {
                    return this.uaData.os.version.split('.')[0] === isVersion[1];
                }

                return false;
            },
            () =>
            {
                if (value === 'mobile' || value === 'desktop')
                {
                    return value === 'mobile' ? !this.desktop : this.desktop;
                }

                return false;
            },
            () => this.uaData.os.name.toLowerCase().replace(' ', '-') === value,
        ];

        return this.checkTests(tests, value, 'os');
    }

    /**
     * Returns whether or not the specified device is being used
     * @param value - value to test
     */
    public isDevice(value: string): boolean
    {
        const cachedRes = this.checkCache(value, 'device');

        if (cachedRes !== null) return cachedRes;

        const tests = [
            () => this.checkCustom({ type: 'device', value }),
            () =>
            {
                if (value === 'tablet') return this.uaData.device.type === 'tablet';

                return false;
            },
            () =>
            {
                if (value === 'mobile') return this.uaData.device.type === 'tablet' || this.uaData.device.type === 'mobile';

                return false;
            },
            () =>
            {
                if (value === 'phone')
                {
                    return this.uaData.device.type === 'mobile';
                }

                return false;
            },
            () => this.uaData.device.model === value,
        ];

        return this.checkTests(tests, value, 'device');
    }

    /**
     * Returns whether or not the devices GPU is the correct tier
     * @param value - value to test
     */
    public isGPU(value: string | GPU_TIER): boolean
    {
        return this.gpu === Number(value);
    }

    /**
     * Splits the query into its individual pieces ready to be processed
     * @param query - query to be parsed
     */
    private parseQuery(query: string): ParsedDeviceQuery[]
    {
        return query.split('--').map((query): ParsedDeviceQuery =>
        {
            const split = query.split(':').filter((value) => value !== ':');

            return { type: split.shift() as DeviceParserType, value: split.join(':') };
        });
    }

    /**
     * Checks all the custom query functions to see if any of them match
     * @param value - value to be checked
     */
    private checkCustom(value: ParsedDeviceQuery): boolean
    {
        const cachedRes = this.checkCache(JSON.stringify(value), 'custom');

        if (cachedRes !== null) return cachedRes;

        for (let i = 0; i < this.customQueries.length; i++)
        {
            const queryTest = this.customQueries[i];

            if (queryTest(value))
            {
                this.addToCache(JSON.stringify(value), true, 'custom');

                return true;
            }
        }
        this.addToCache(JSON.stringify(value), false, 'custom');

        return false;
    }

    private checkCache(query: string, cacheType: string): boolean
    {
        if (this.caches[cacheType][query])
        {
            return this.caches[cacheType][query];
        }

        return null;
    }

    private checkTests(tests: (() => boolean)[], value: string, type: string): boolean
    {
        let res = false;

        for (let i = 0; i < tests.length; i++)
        {
            res = tests[i]();

            if (res) break;
        }

        this.addToCache(value, res, type);

        return res;
    }

    private addToCache(query: string, result: boolean, cacheType: string): void
    {
        this.caches[cacheType][query] = result;
    }

    private _checkIPadPro(): void
    {
        const userAgent = this.uaData.ua;
        const isMacOS = (/Mac OS/).test(userAgent) && !((/like Mac OS/).test(userAgent));
        const touchCheck = 'ontouchstart' in window;

        if (isMacOS && touchCheck)
        {
            this.uaData.device.type = 'tablet';
            this.uaData.device.vendor = 'apple';
            this.uaData.device.model = 'ipad-pro';
            console.warn('[Device]: OS cannot be determined on this device');
        }
    }
}

const Device = new DeviceClass();

Device.addQuery(isIPhone6, isGalaxyS5, isKindle);

export {
    Device,
};
