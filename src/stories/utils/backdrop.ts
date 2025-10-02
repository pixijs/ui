import { Container, Sprite, Texture, Ticker } from 'pixi.js';

/**
 * Creates a scrolling bunny grid backdrop with overlay
 * @param scrollSpeed - The speed and direction of scrolling
 * (positive = top-left to bottom-right, negative = top-right to bottom-left, defaults to 2)
 * @param width - The width of the backdrop container (defaults to 10000)
 * @param height - The height of the backdrop container (defaults to 10000)
 * @returns A Container with scrolling bunnies and a semi-transparent overlay
 */
export function createBunnyBackdrop(scrollSpeed: number = 2, width: number = 10000, height: number = 10000): Container
{
    const container = new Container();
    const bunnyTexture = Texture.from('bunny.png');
    const bunnies: Sprite[] = [];

    const cols = 50;
    const rows = 50;
    const bunnySize = 52;
    const spacingX = width / cols;
    const spacingY = height / rows;

    for (let row = 0; row < rows; row++)
    {
        for (let col = 0; col < cols; col++)
        {
            const bunny = new Sprite(bunnyTexture);

            bunny.x = col * spacingX;
            bunny.y = row * spacingY;
            bunny.width = bunnySize;
            bunny.height = bunnySize;

            bunnies.push(bunny);
            container.addChild(bunny);
        }
    }

    const speedX = scrollSpeed;
    const speedY = Math.abs(scrollSpeed);

    Ticker.shared.add(() =>
    {
        bunnies.forEach((bunny) =>
        {
            bunny.x += speedX;
            bunny.y += speedY;

            if (speedX > 0)
            {
                if (bunny.x > width) bunny.x -= width + spacingX;
            }
            else if (bunny.x < -bunnySize)
            {
                bunny.x += width + spacingX;
            }

            if (bunny.y > height) bunny.y -= height + spacingY;
        });
    });

    const overlay = new Sprite(Texture.WHITE);

    overlay.tint = 0x000000;
    overlay.alpha = 0.5;
    overlay.width = width;
    overlay.height = height;
    container.addChildAt(overlay, 0);

    return container;
}
