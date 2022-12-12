import { Device } from '../devices/Device';

/**
 * Detects whether or not cache busting should be applied
 *
 * @returns whether cache busting should apply
 */
export function autoDetectCacheBusting(): boolean
{
    return Device.ie;
}
