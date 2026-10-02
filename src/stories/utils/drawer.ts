import { Container } from 'pixi.js';
import { Drawer } from '../../Drawer';
import { centerView } from '../../utils/helpers/resize';

/**
 * Story resize handler for drawers: centres the view and gives each drawer in it the renderer size,
 * so it anchors to the real screen edges. Storybook calls it once the app is ready and on every
 * window resize; measuring the root during init can catch it before the canvas has its final size.
 * @param view - the story view.
 * @param width - renderer width.
 * @param height - renderer height.
 */
export function resizeDrawerStory(view: Container, width: number, height: number)
{
    centerView(view);

    for (const child of view.children)
    {
        if (child instanceof Drawer)
        {
            child.setScreenSize(width, height);
        }
    }
}
