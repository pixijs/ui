import { Container, Graphics, NineSliceSprite, Sprite, Texture } from 'pixi.js';
import { Button } from '../../src/Button';
import { Dialog } from '../../src/Dialog';
import { FancyButton } from '../../src/FancyButton';

const g = (w = 400, h = 300) => new Graphics().rect(0, 0, w, h).fill(0xffffff);
const slice = [2, 2, 2, 2] as [number, number, number, number];

describe('Dialog backdrop', () =>
{
    it('builds a default backdrop', () =>
    {
        const dialog = new Dialog({ background: g() });

        expect((dialog as any).backdrop).toBeInstanceOf(Sprite);
    });

    it('applies backdrop colour and alpha', () =>
    {
        const dialog = new Dialog({ background: g(), backdropColor: 0xff0000, backdropAlpha: 0.25 });

        expect((dialog as any).backdrop.alpha).toBe(0.25);
    });

    it('accepts a custom backdrop view', () =>
    {
        const backdrop = g(10, 10);
        const dialog = new Dialog({ background: g(), backdrop });

        expect((dialog as any).backdrop).toBe(backdrop);
    });

    it('closes on a backdrop tap when configured', () =>
    {
        const dialog = new Dialog({ background: g(), closeOnBackdropClick: true });

        dialog.open();
        (dialog as any).backdrop.emit('pointertap', {} as any);

        expect(dialog.isOpen).toBe(false);
    });

    it('ignores a backdrop tap by default', () =>
    {
        const dialog = new Dialog({ background: g() });

        dialog.open();
        (dialog as any).backdrop.emit('pointertap', {} as any);

        expect(dialog.isOpen).toBe(true);
    });
});

describe('Dialog background', () =>
{
    it('builds a nine-slice background from a Texture', () =>
    {
        const dialog = new Dialog({ background: Texture.WHITE, nineSliceSprite: slice, width: 300, height: 200 });

        expect((dialog as any).innerView).toBeInstanceOf(NineSliceSprite);
    });

    it('warns when a nine-slice background is given a Container', () =>
    {
        const spy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

        // eslint-disable-next-line no-new
        new Dialog({ background: g(), nineSliceSprite: slice });

        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    it('sizes a Graphics background', () =>
    {
        const dialog = new Dialog({ background: g(), width: 320, height: 240 });

        expect((dialog as any).innerView.width).toBe(320);
    });

    it('anchors a Sprite background', () =>
    {
        const dialog = new Dialog({ background: new Sprite(Texture.WHITE) });

        expect((dialog as any).innerView.anchor.x).toBe(0.5);
    });
});

describe('Dialog content', () =>
{
    it('renders a title', () =>
    {
        const dialog = new Dialog({ background: g(), title: 'Confirm' });

        expect((dialog as any).titleText.text).toBe('Confirm');
    });

    it('renders string content', () =>
    {
        const dialog = new Dialog({ background: g(), content: 'Are you sure?' });

        expect((dialog as any).scrollBox.items.length).toBe(1);
    });

    it('renders numeric content', () =>
    {
        const dialog = new Dialog({ background: g(), content: 42 });

        expect((dialog as any).scrollBox.items.length).toBe(1);
    });

    it('renders a container as content', () =>
    {
        const dialog = new Dialog({ background: g(), content: g(50, 50) });

        expect((dialog as any).scrollBox.items.length).toBe(1);
    });

    it('renders an array of containers as content', () =>
    {
        const dialog = new Dialog({ background: g(), content: [g(50, 50), g(50, 50)] });

        expect((dialog as any).scrollBox.items.length).toBe(2);
    });

    it('offsets content below the title', () =>
    {
        const dialog = new Dialog({ background: g(), title: 'T', content: 'body', padding: 20 });

        expect((dialog as any).scrollBox.y).toBeGreaterThanOrEqual(20);
    });

    it('accounts for the title when sizing the scroll box', () =>
    {
        const dialog = new Dialog({ background: g(), title: 'T', content: 'body', width: 400, height: 300 });

        expect((dialog as any).scrollBox.height).toBeGreaterThan(0);
    });
});

describe('Dialog buttons', () =>
{
    it('builds buttons from options', () =>
    {
        const dialog = new Dialog({ background: g(), buttons: [{ text: 'OK' }, { text: 'Cancel' }] });

        expect((dialog as any).buttonContainer.children.length).toBe(2);
    });

    it('emits onSelect with the button text', () =>
    {
        const dialog = new Dialog({ background: g(), buttons: [{ text: 'OK' }] });
        const seen: Array<[number, string]> = [];

        dialog.onSelect.connect((i, t) => seen.push([i, t]));
        (dialog as any).buttonContainer.children[0].onPress.emit();

        expect(seen).toEqual([[0, 'OK']]);
    });

    it('accepts a FancyButton instance', () =>
    {
        const button = new FancyButton({ defaultView: g(80, 30), text: 'Go' });
        const dialog = new Dialog({ background: g(), buttons: [button] });
        const seen: Array<[number, string]> = [];

        dialog.onSelect.connect((i, t) => seen.push([i, t]));
        button.onPress.emit();

        expect(seen).toEqual([[0, 'Go']]);
    });

    it('accepts a Button instance', () =>
    {
        const button = new Button(new Container());
        const dialog = new Dialog({ background: g(), buttons: [button] });
        const seen: Array<[number, string]> = [];

        dialog.onSelect.connect((i, t) => seen.push([i, t]));
        button.onPress.emit();

        expect(seen).toEqual([[0, '']]);
    });

    it('ignores an empty button list', () =>
    {
        const dialog = new Dialog({ background: g(), buttons: [] });

        expect((dialog as any).buttonContainer.children.length).toBe(0);
    });

    it('honours buttonList layout options', () =>
    {
        const dialog = new Dialog({
            background: g(), buttons: [{ text: 'A' }, { text: 'B' }], buttonList: { elementsMargin: 25 },
        });

        expect((dialog as any).buttonContainer.elementsMargin).toBe(25);
    });
});

describe('Dialog open and close', () =>
{
    it('starts hidden', () =>
    {
        const dialog = new Dialog({ background: g() });

        expect(dialog.visible).toBe(false);
        expect(dialog.isOpen).toBe(false);
    });

    it('opens without animation', () =>
    {
        const dialog = new Dialog({ background: g() });

        dialog.open();

        expect(dialog.visible).toBe(true);
        expect(dialog.isOpen).toBe(true);
    });

    it('closes without animation and emits onClose', () =>
    {
        const dialog = new Dialog({ background: g() });
        let closed = false;

        dialog.onClose.connect(() => { closed = true; });
        dialog.open();
        dialog.close();

        expect(dialog.isOpen).toBe(false);
        expect(closed).toBe(true);
    });

    it('opens with an animation', () =>
    {
        const dialog = new Dialog({
            background: g(), animations: { open: { props: { alpha: 1 }, duration: 50 } },
        });

        dialog.open();

        expect(dialog.isOpen).toBe(true);
    });

    it('closes with an animation', () =>
    {
        const dialog = new Dialog({
            background: g(), animations: { close: { props: { alpha: 0 }, duration: 50 } },
        });

        dialog.open();

        expect(() => dialog.close()).not.toThrow();
    });

    it('aliases show and hide', () =>
    {
        const dialog = new Dialog({ background: g() });

        dialog.show();
        expect(dialog.isOpen).toBe(true);

        dialog.hide();
        expect(dialog.isOpen).toBe(false);
    });
});
