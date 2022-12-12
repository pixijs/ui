/**
 * checks to see if a WebGL context should render transparently.
 * this needs to be true for some devices with the specific Mali GPU sets
 * otherwise, the app will flicker like crazy!
 *
 * Bit of a crazy way todo GPU detection, but so it goes!
 */
export function autoDetectTransparency(): boolean
{
    const canvas = document.createElement('canvas');
    let gl: WebGLRenderingContext;
    let debugInfo;
    let renderer: string;
    let transparent = false;

    try
    {
        gl = canvas.getContext('webgl');
        debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        const sub = renderer.substring(0, 8);

        if (sub === 'Mali-400' || sub === 'Mali-450')
        {
            // Kindle fire has a know issue where it flickers like mad if the renderer is not set to transparent
            transparent = true;
        }
    }
    catch (e)
    {
        console.warn('WebGL or renderer info not supported!');
    }

    return transparent;
}
