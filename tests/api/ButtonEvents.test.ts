import { Container, isMobile } from 'pixi.js';
import { Button } from '../../src/Button';

const withMobile = (value: boolean, run: () => void) =>
{
    const original = isMobile.any;

    (isMobile as any).any = value;
    try { run(); }
    finally { (isMobile as any).any = original; }
};

describe('ButtonEvents wiring', () =>
{
    it.each([['desktop', false], ['mobile', true]] as const)(
        'connects and fires the full event set on %s',
        (_label, mobile) =>
        {
            withMobile(mobile, () =>
            {
                const view = new Container();
                const button = new Button(view);
                const seen: string[] = [];

                button.onDown.connect(() => seen.push('down'));
                button.onUp.connect(() => seen.push('up'));
                button.onUpOut.connect(() => seen.push('upOut'));
                button.onOut.connect(() => seen.push('out'));
                button.onPress.connect(() => seen.push('press'));
                button.onHover.connect(() => seen.push('hover'));

                view.emit(mobile ? 'pointerover' : 'mouseover', {} as any);
                view.emit(mobile ? 'pointerdown' : 'mousedown', {} as any);
                view.emit(mobile ? 'pointerup' : 'mouseup', {} as any);
                view.emit(mobile ? 'pointertap' : 'click', {} as any);
                view.emit(mobile ? 'pointerout' : 'mouseout', {} as any);

                expect(seen).toContain('down');
                expect(seen).toContain('up');
                expect(seen).toContain('press');
                expect(seen.includes('out')).toBe(!mobile);
                expect(seen.includes('hover')).toBe(!mobile);
            });
        },
    );

    it('disconnects the previous view when a new one is assigned', () =>
    {
        const first = new Container();
        const second = new Container();
        const button = new Button(first);
        const seen: string[] = [];

        button.onDown.connect(() => seen.push('down'));
        button.view = second;

        first.emit('mousedown', {} as any);
        expect(seen).toHaveLength(0);

        second.emit('mousedown', {} as any);
        expect(seen).toEqual(['down']);
    });

    it('emits upOut and up together after a down', () =>
    {
        const view = new Container();
        const button = new Button(view);
        const seen: string[] = [];

        button.onUp.connect(() => seen.push('up'));
        button.onUpOut.connect(() => seen.push('upOut'));

        view.emit('mousedown', {} as any);
        view.emit('mouseupoutside', {} as any);

        expect(seen).toEqual(['up', 'upOut']);
    });

    it('does not emit up or upOut without a preceding down', () =>
    {
        const view = new Container();
        const button = new Button(view);
        const seen: string[] = [];

        button.onUp.connect(() => seen.push('up'));
        button.onUpOut.connect(() => seen.push('upOut'));

        view.emit('mouseup', {} as any);
        view.emit('mouseupoutside', {} as any);

        expect(seen).toHaveLength(0);
    });

    it('does not emit out without a preceding over', () =>
    {
        const view = new Container();
        const button = new Button(view);
        const seen: string[] = [];

        button.onOut.connect(() => seen.push('out'));
        view.emit('mouseout', {} as any);

        expect(seen).toHaveLength(0);
    });

    it('tracks isDown across the press cycle', () =>
    {
        const view = new Container();
        const button = new Button(view);

        expect(button.isDown).toBe(false);
        view.emit('mousedown', {} as any);
        expect(button.isDown).toBe(true);
        view.emit('mouseup', {} as any);
        expect(button.isDown).toBe(false);
    });

    it('releases a held button when disabled', () =>
    {
        const view = new Container();
        const button = new Button(view);

        view.emit('mousedown', {} as any);
        expect(button.isDown).toBe(true);

        button.enabled = false;
        expect(button.isDown).toBe(false);
        expect(button.enabled).toBe(false);
    });

    it('logs instead of throwing when enabling a viewless button', () =>
    {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        const button = new Button();

        button.enabled = true;

        expect(spy).toHaveBeenCalled();
        expect(button.enabled).toBe(false);
        spy.mockRestore();
    });

    it('exposes overridable lifecycle hooks', () =>
    {
        const view = new Container();
        const button = new Button(view);

        expect(() =>
        {
            button.down();
            button.up();
            button.upOut();
            button.out();
            button.press();
            button.hover();
        }).not.toThrow();
    });
});
