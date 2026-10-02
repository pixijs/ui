import { Graphics, NineSliceSprite, Sprite, Text, Texture } from 'pixi.js';
import { FancyButton } from '../../src/FancyButton';

const g = (w = 100, h = 50) => new Graphics().rect(0, 0, w, h).fill(0xffffff);
const slice = [2, 2, 2, 2] as [number, number, number, number];

describe('FancyButton views', () =>
{
    it('constructs with no options', () =>
    {
        expect(() => new FancyButton()).not.toThrow();
    });

    it('accepts all four state views', () =>
    {
        const button = new FancyButton({
            defaultView: g(), hoverView: g(), pressedView: g(), disabledView: g(),
        });

        expect(button.defaultView).toBeDefined();
        expect(button.hoverView).toBeDefined();
        expect(button.pressedView).toBeDefined();
        expect(button.disabledView).toBeDefined();
    });

    it('falls back through the state view chain', () =>
    {
        const button = new FancyButton({ defaultView: g() });

        expect((button as any).getStateView('hover')).toBe(button.defaultView);
        expect((button as any).getStateView('pressed')).toBe(button.defaultView);
        expect((button as any).getStateView('disabled')).toBe(button.defaultView);
        expect((button as any).getStateView('nonsense')).toBeUndefined();
    });

    it('prefers the hover view for the pressed state when no pressed view exists', () =>
    {
        const button = new FancyButton({ defaultView: g(), hoverView: g() });

        expect((button as any).getStateView('pressed')).toBe(button.hoverView);
    });

    it('replaces a view on reassignment', () =>
    {
        const button = new FancyButton({ defaultView: g() });
        const replacement = g(20, 20);

        button.defaultView = replacement;

        expect(button.defaultView).toBe(replacement);
    });

    it('ignores an undefined view assignment', () =>
    {
        const button = new FancyButton({ defaultView: g() });
        const before = button.defaultView;

        button.hoverView = undefined;

        expect(button.defaultView).toBe(before);
    });

    it('clears a view when assigned null', () =>
    {
        const button = new FancyButton({ defaultView: g(), hoverView: g() });

        (button as any).hoverView = null;

        expect(button.hoverView).toBeUndefined();
    });

    it('removes a view by type', () =>
    {
        const button = new FancyButton({ defaultView: g(), hoverView: g() });

        button.removeView('hoverView');

        expect(button.hoverView).toBeUndefined();
    });

    it('builds nine-slice views from a Texture', () =>
    {
        const button = new FancyButton({ defaultView: Texture.WHITE, nineSliceSprite: slice });

        expect(button.defaultView).toBeInstanceOf(NineSliceSprite);
    });

    it('warns when a nine-slice view is given a Container', () =>
    {
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

        // eslint-disable-next-line no-new
        new FancyButton({ defaultView: g(), nineSliceSprite: slice });

        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});

describe('FancyButton text and icon', () =>
{
    it('creates a text view from a string', () =>
    {
        const button = new FancyButton({ defaultView: g(), text: 'hello' });

        expect(button.text).toBe('hello');
    });

    it('updates existing text in place', () =>
    {
        const button = new FancyButton({ defaultView: g(), text: 'a' });

        button.text = 'b';

        expect(button.text).toBe('b');
    });

    it('removes the text view when set empty', () =>
    {
        const button = new FancyButton({ defaultView: g(), text: 'a' });

        button.text = '';

        expect(button.textView).toBeUndefined();
    });

    it('accepts a Text instance as textView', () =>
    {
        const button = new FancyButton({ defaultView: g() });

        button.textView = new Text({ text: 'x' });

        expect(button.text).toBe('x');
    });

    it('clears the text view when assigned null', () =>
    {
        const button = new FancyButton({ defaultView: g(), text: 'a' });

        button.textView = null;

        expect(button.textView).toBeUndefined();
    });

    it('accepts an icon view', () =>
    {
        const button = new FancyButton({ defaultView: g(), icon: g(20, 20) });

        expect(button.iconView).toBeDefined();
    });

    it('replaces an icon view', () =>
    {
        const button = new FancyButton({ defaultView: g(), icon: g(20, 20) });

        button.iconView = g(30, 30);

        expect(button.iconView).toBeDefined();
    });

    it('anchors a Sprite icon via its anchor', () =>
    {
        const button = new FancyButton({ defaultView: g(), icon: new Sprite(Texture.WHITE) });

        expect(button.iconView).toBeInstanceOf(Sprite);
    });
});

describe('FancyButton state', () =>
{
    it('starts in the default state', () =>
    {
        expect(new FancyButton({ defaultView: g() }).state).toBe('default');
    });

    it('moves to the disabled state when disabled', () =>
    {
        const button = new FancyButton({ defaultView: g(), disabledView: g() });

        button.enabled = false;

        expect(button.state).toBe('disabled');
        expect(button.enabled).toBe(false);
    });

    it('returns to default when re-enabled', () =>
    {
        const button = new FancyButton({ defaultView: g(), disabledView: g() });

        button.enabled = false;
        button.enabled = true;

        expect(button.state).toBe('default');
    });

    it('ignores a redundant setState', () =>
    {
        const button = new FancyButton({ defaultView: g() });

        button.setState('default');

        expect(button.state).toBe('default');
    });

    it('re-applies state when forced', () =>
    {
        const button = new FancyButton({ defaultView: g() });

        expect(() => button.setState('default', true)).not.toThrow();
    });

    it.each(['hover', 'pressed', 'disabled'] as const)('switches to %s', (state) =>
    {
        const button = new FancyButton({
            defaultView: g(), hoverView: g(), pressedView: g(), disabledView: g(),
        });

        button.setState(state);

        expect(button.state).toBe(state);
    });
});

describe('FancyButton layout', () =>
{
    it('applies a numeric padding', () =>
    {
        const button = new FancyButton({ defaultView: g(), text: 'hi', padding: 12 });

        expect(button.padding).toBe(12);
    });

    it('applies a flat offset', () =>
    {
        const button = new FancyButton({ defaultView: g(), offset: { x: 5, y: 6 } });

        expect(button.offset).toEqual({ x: 5, y: 6 });
    });

    it('applies a per-state offset', () =>
    {
        const button = new FancyButton({ defaultView: g(), hoverView: g(), offset: { hover: { x: 3, y: 4 } } });

        button.setState('hover');

        expect(button.offset).toEqual({ hover: { x: 3, y: 4 } });
    });

    it('falls back to the default-state offset', () =>
    {
        const button = new FancyButton({ defaultView: g(), hoverView: g(), offset: { default: { x: 2, y: 2 } } });

        button.setState('hover');

        expect(button.state).toBe('hover');
    });

    it('applies a text offset', () =>
    {
        const button = new FancyButton({ defaultView: g(), text: 'hi', textOffset: { x: 1, y: 2 } });

        expect(button.textOffset).toEqual({ x: 1, y: 2 });
    });

    it('applies an icon offset', () =>
    {
        const button = new FancyButton({ defaultView: g(), icon: g(10, 10), iconOffset: { x: 1, y: 2 } });

        expect(button.iconOffset).toEqual({ x: 1, y: 2 });
    });

    it('applies a uniform anchor', () =>
    {
        const button = new FancyButton({ defaultView: g(), anchor: 0.5 });

        expect(button.anchor.x).toBe(0.5);
        expect(button.anchor.y).toBe(0.5);
    });

    it('applies split anchors', () =>
    {
        const button = new FancyButton({ defaultView: g(), anchorX: 0.25, anchorY: 0.75 });

        expect(button.anchor.x).toBe(0.25);
        expect(button.anchor.y).toBe(0.75);
    });

    it('applies an overall scale', () =>
    {
        const button = new FancyButton({ defaultView: g(), scale: 2 });

        expect(button.scale.x).toBe(2);
    });
});

describe('FancyButton contentFittingMode', () =>
{
    it.each(['default', 'fill', 'none'] as const)('accepts %s', (mode) =>
    {
        const button = new FancyButton({
            defaultView: g(200, 200), text: 'hello', icon: g(10, 10), contentFittingMode: mode,
        });

        expect(button.contentFittingMode).toBe(mode);
    });

    it('defaults to "default"', () =>
    {
        expect(new FancyButton({ defaultView: g() }).contentFittingMode).toBe('default');
    });

    it('is settable after construction', () =>
    {
        const button = new FancyButton({ defaultView: g(), text: 'hi' });

        button.contentFittingMode = 'none';

        expect(button.contentFittingMode).toBe('none');
    });
});

describe('FancyButton animations', () =>
{
    it('plays a configured state animation', () =>
    {
        const button = new FancyButton({
            defaultView: g(),
            hoverView: g(),
            animations: { hover: { props: { scale: { x: 1.1, y: 1.1 } }, duration: 50 } },
        });

        expect(() => button.setState('hover')).not.toThrow();
    });

    it('falls back to the default animation', () =>
    {
        const button = new FancyButton({
            defaultView: g(),
            hoverView: g(),
            animations: { default: { props: { scale: { x: 1, y: 1 } }, duration: 50 } },
        });

        expect(() => button.setState('hover')).not.toThrow();
    });

    it('animates back to the original state when none is configured', () =>
    {
        const button = new FancyButton({
            defaultView: g(),
            pressedView: g(),
            animations: { hover: { props: { scale: { x: 1.1, y: 1.1 } }, duration: 50 } },
        });

        expect(() => button.setState('pressed')).not.toThrow();
    });
});

describe('FancyButton sizing', () =>
{
    it('routes size through nine-slice views', () =>
    {
        const button = new FancyButton({
            defaultView: Texture.WHITE,
            hoverView: Texture.WHITE,
            pressedView: Texture.WHITE,
            disabledView: Texture.WHITE,
            nineSliceSprite: slice,
        });

        button.width = 300;
        button.height = 60;

        expect((button.defaultView as NineSliceSprite).width).toBe(300);
        expect((button.defaultView as NineSliceSprite).height).toBe(60);
    });

    it('routes setSize through nine-slice views', () =>
    {
        const button = new FancyButton({
            defaultView: Texture.WHITE,
            hoverView: Texture.WHITE,
            pressedView: Texture.WHITE,
            disabledView: Texture.WHITE,
            nineSliceSprite: slice,
        });

        button.setSize(120, 40);

        expect((button.defaultView as NineSliceSprite).width).toBe(120);
    });

    it('falls back to Container sizing without nine-slice', () =>
    {
        const button = new FancyButton({ defaultView: g() });

        button.width = 300;
        button.height = 60;

        expect(button.width).toBeCloseTo(300, 0);
        expect(() => button.setSize(100, 50)).not.toThrow();
    });
});
