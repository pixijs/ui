import { Device } from './Device';

/**
 * Requests to make the device go fullscreen
 * @remarks This only works for android devices
 */
export function requestFullScreen(): void {
    if (!Device.android) return;
    const body = document.body as any;

    if (body.mozRequestFullScreen) {
        body.mozRequestFullScreen();
    } else if (body.webkitRequestFullScreen) {
        body.webkitRequestFullScreen();
    }
}
