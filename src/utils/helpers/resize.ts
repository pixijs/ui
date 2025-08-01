import { Container } from 'pixi.js';

export function centerElement(view: Container, horPos?: number, verPos?: number)
{
    const canvas = document.getElementById('storybook-root');
    
    if (!canvas) return;

    if (view.width > 0)
    {
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
    }
    else
    {
        view.x = canvas.offsetWidth / 2;
    }

    if (view.height > 0)
    {
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
    else
    {
        view.y = canvas.offsetHeight / 2;
    }
}

export function centerView(view: Container)
{
    const canvas = document.getElementById('storybook-root');

    if (!canvas) return;

    view.x = canvas.offsetWidth / 2;
    view.y = canvas.offsetHeight / 2;
}
