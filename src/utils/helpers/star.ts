import { Graphics } from '@pixi/graphics';

export function drawStar(
    target: Graphics,
    x: number,
    y: number,
    points: number,
    innerRadius: number,
    outerRadius: number,
    angle: number
)
{
    const step = (Math.PI * 2) / points;
    const halfStep = step / 2;
    const start = (angle / 180) * Math.PI;

    let n;
    let dx;
    let dy;

    target.moveTo(x + (Math.cos(start) * outerRadius), y - (Math.sin(start) * outerRadius));

    for (n = 1; n <= points; ++n)
    {
        dx = x + (Math.cos(start + (step * n) - halfStep) * innerRadius);
        dy = y - (Math.sin(start + (step * n) - halfStep) * innerRadius);
        target.lineTo(dx, dy);
        dx = x + (Math.cos(start + (step * n)) * outerRadius);
        dy = y - (Math.sin(start + (step * n)) * outerRadius);
        target.lineTo(dx, dy);
    }
}
