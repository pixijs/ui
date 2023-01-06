import { Container } from 'pixi.js';

export function centerElement(
    view: Container,
    horPos?: number,
    verPos?: number,
)
{
    const canvas = document.getElementById('storybook-root');

    if (horPos === 0)
    {
        view.x = 0;
    }
    else if (horPos)
    {
        view.x = (canvas.offsetWidth * horPos) - (view.width / 2);
    }
    else
    {
        view.x = (canvas.offsetWidth / 2) - (view.width / 2);
    }

    if (verPos === 0)
    {
        view.y = 0;
    }
    else if (verPos)
    {
        view.y = (canvas.offsetHeight * verPos) - (view.height / 2);
    }
    else
    {
        view.y = (canvas.offsetHeight / 2) - (view.height / 2);
    }
}
