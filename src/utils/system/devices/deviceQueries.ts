import type { ParsedDeviceQuery } from './Device';
import { Device } from './Device';

export function isIPhone6(query: ParsedDeviceQuery): boolean
{
    if (!(query.type === 'device' && query.value === 'iPhone6')) return false;

    if (Device.ios)
    {
        if (window.outerHeight === 667 && window.outerWidth === 375 && window.devicePixelRatio === 3)
        {
            return true;
        }
    }

    return false;
}

export function isGalaxyS5(query: ParsedDeviceQuery): boolean
{
    if (!(query.type === 'device' && query.value === 's5')) return false;

    if (Device.android)
    {
        if (window.outerHeight === 560 && window.outerWidth === 360 && window.devicePixelRatio === 3)
        {
            return true;
        }
    }

    return false;
}

export function isKindle(query: ParsedDeviceQuery): boolean
{
    if (!(query.type === 'device' && query.value === 'kindle')) return false;

    const ua = navigator.userAgent;

    return (/Kindle|Silk|KFAPW|KFARWI|KFASWI|KFFOWI|KFJW|KFMEWI|KFOT|KFSAW|KFSOWI|KFTBW|KFTHW|KFTT|WFFOWI/i).test(ua);
}
