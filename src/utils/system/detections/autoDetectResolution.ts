/**
 * detects the best resolution that should be used for this application
 * high resolution = crisper images, but there are performance impacts.
 * most mobile devices have a very high DPI, too high for what we tend to do!
 * so we cap it a two by default
 *
 * @returns resolution to use
 */
export function autoDetectResolution(): number {
    return Math.min(window.devicePixelRatio, 2);
}
