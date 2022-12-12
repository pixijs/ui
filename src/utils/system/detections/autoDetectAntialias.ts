import { Device } from '../devices/Device';

/**
 * intelligently decides weather or not the app should use antialiasing or not.
 *
 * Antialiasing on generally looks better, especially for 3D content.
 * However the trad of is performance can slow down.
 *
 */
export function autoDetectAntialias(): boolean
{
    // TODO this can eventually be smarter..
    return Device.desktop;
}

