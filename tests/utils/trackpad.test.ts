import { Point } from 'pixi.js';
import ScrollSpring from '../../src/utils/trackpad/ScrollSpring';
import { SlidingNumber } from '../../src/utils/trackpad/SlidingNumber';
import { Spring } from '../../src/utils/trackpad/Spring';
import { Trackpad } from '../../src/utils/trackpad/Trackpad';

describe('Spring', () =>
{
    it('applies default options', () =>
    {
        const spring = new Spring();

        expect(spring.max).toBe(160);
        expect(spring.damp).toBe(0.8);
        expect(spring.springiness).toBe(0.1);
    });

    it('accepts custom options', () =>
    {
        const spring = new Spring({ max: 10, damp: 0.5, springiness: 0.2 });

        expect(spring.max).toBe(10);
        expect(spring.damp).toBe(0.5);
        expect(spring.springiness).toBe(0.2);
    });

    it('exposes settable options', () =>
    {
        const spring = new Spring();

        spring.max = 5;
        spring.damp = 0.1;
        spring.springiness = 0.9;

        expect(spring.max).toBe(5);
        expect(spring.damp).toBe(0.1);
        expect(spring.springiness).toBe(0.9);
    });

    it('moves x towards tx on update', () =>
    {
        const spring = new Spring();

        spring.tx = 100;
        spring.update();

        expect(spring.x).toBeGreaterThan(0);
        expect(spring.x).toBeLessThanOrEqual(100);
    });

    it('clamps positive velocity to max', () =>
    {
        const spring = new Spring({ max: 1, damp: 1, springiness: 1 });

        spring.tx = 10000;
        spring.update();

        expect(spring.dx).toBe(1);
    });

    it('clamps negative velocity to -max', () =>
    {
        const spring = new Spring({ max: 1, damp: 1, springiness: 1 });

        spring.tx = -10000;
        spring.update();

        expect(spring.dx).toBe(-1);
    });

    it('resets all state', () =>
    {
        const spring = new Spring();

        spring.tx = 50;
        spring.update();
        spring.reset();

        expect(spring.x).toBe(0);
        expect(spring.ax).toBe(0);
        expect(spring.dx).toBe(0);
        expect(spring.tx).toBe(0);
    });
});

describe('ScrollSpring', () =>
{
    it('starts undone', () =>
    {
        const spring = new ScrollSpring();

        expect(spring.done).toBe(false);
        expect(spring.to).toBe(0);
    });

    it('settles onto the target when speed already points at it', () =>
    {
        const spring = new ScrollSpring();

        spring.start(10, 0, 100);
        for (let i = 0; i < 500 && !spring.done; i++) spring.update();

        expect(spring.done).toBe(true);
        expect(spring.update()).toBe(100);
    });

    it('corrects speed that points away from the target', () =>
    {
        const spring = new ScrollSpring();

        spring.start(-50, 0, 100);
        const first = spring.update();

        expect(Number.isFinite(first)).toBe(true);

        for (let i = 0; i < 500 && !spring.done; i++) spring.update();
        expect(spring.done).toBe(true);
    });

    it('exposes a no-op cancel to match the ease interface', () =>
    {
        const spring = new ScrollSpring();

        expect(() => spring.cancel()).not.toThrow();
    });
});

describe('SlidingNumber', () =>
{
    it('applies default options', () =>
    {
        const n = new SlidingNumber();

        expect(n.constrain).toBe(true);
        expect(n.maxSpeed).toBe(400);
    });

    it('accepts custom options', () =>
    {
        const n = new SlidingNumber({ constrain: false, maxSpeed: 10 });

        expect(n.constrain).toBe(false);
        expect(n.maxSpeed).toBe(10);
    });

    it('resets speed when value is assigned', () =>
    {
        const n = new SlidingNumber();

        n.value = 42;

        expect(n.value).toBe(42);
    });

    it('tracks an offset from the grab point', () =>
    {
        const n = new SlidingNumber({ constrain: false });

        n.value = 100;
        n.grab(20);
        n.hold(30);

        expect(n.position).toBe(110);
    });

    it('reports moveAmount relative to the grab', () =>
    {
        const n = new SlidingNumber({ constrain: false });

        n.grab(0);
        n.hold(25);

        expect(typeof n.moveAmount).toBe('number');
    });

    it('clamps hold speed to maxSpeed', () =>
    {
        const n = new SlidingNumber({ constrain: false, maxSpeed: 5 });

        n.grab(0);
        n.hold(1000);
        n.hold(2000);

        expect((n as any)._speed).toBeLessThanOrEqual(5);
    });

    it('clamps hold speed to -maxSpeed', () =>
    {
        const n = new SlidingNumber({ constrain: false, maxSpeed: 5 });

        n.grab(0);
        n.hold(-1000);
        n.hold(-2000);

        expect((n as any)._speed).toBeGreaterThanOrEqual(-5);
    });

    it('decays to a stop when unconstrained', () =>
    {
        const n = new SlidingNumber({ constrain: false });

        n.grab(0);
        n.hold(10);
        for (let i = 0; i < 2000; i++) n.slide();

        expect((n as any)._hasStopped).toBe(true);
    });

    it('ignores slide once stopped', () =>
    {
        const n = new SlidingNumber({ constrain: false });

        (n as any)._hasStopped = true;
        const before = n.position;

        n.slide();

        expect(n.position).toBe(before);
    });

    it('snaps instantly past the upper edge when constrained', () =>
    {
        const n = new SlidingNumber({ constrain: true });

        n.min = 0;
        n.max = -100;
        n.value = 50;
        n.slide(true);

        expect(n.value).toBe(0);
    });

    it('snaps instantly past the lower edge when constrained', () =>
    {
        const n = new SlidingNumber({ constrain: true });

        n.min = 0;
        n.max = -100;
        n.value = -500;
        n.slide(true);

        expect(n.value).toBe(-100);
    });

    it('eases back into range when constrained', () =>
    {
        const n = new SlidingNumber({ constrain: true });

        n.min = 0;
        n.max = -100;
        n.value = 50;
        for (let i = 0; i < 500; i++) n.slide();

        expect(n.position).toBeLessThanOrEqual(1);
    });

    it('pulls back towards min while held past the edge', () =>
    {
        const n = new SlidingNumber({ constrain: true });

        n.min = 0;
        n.max = -100;
        n.grab(0);
        n.hold(300);

        expect(n.position).toBeLessThan(300);
    });

    it('pulls back towards max while held past the edge', () =>
    {
        const n = new SlidingNumber({ constrain: true });

        n.min = 0;
        n.max = -100;
        n.grab(0);
        n.hold(-300);

        expect(n.position).toBeGreaterThan(-300);
    });
});

describe('Trackpad', () =>
{
    it('forwards a pointer down to both axes', () =>
    {
        const trackpad = new Trackpad({});

        trackpad.pointerDown(new Point(10, 20));
        trackpad.update();

        expect(typeof trackpad.x).toBe('number');
        expect(typeof trackpad.y).toBe('number');
    });

    it('slides both axes once the pointer is released', () =>
    {
        const trackpad = new Trackpad({});

        trackpad.pointerDown(new Point(10, 20));
        trackpad.pointerMove(new Point(30, 40));
        trackpad.update();
        trackpad.pointerUp();

        expect(() => trackpad.update()).not.toThrow();
    });

    it('honours disableEasing', () =>
    {
        const trackpad = new Trackpad({ disableEasing: true });

        expect((trackpad as any).disableEasing).toBe(true);
    });

    it('passes maxSpeed and constrain through to both axes', () =>
    {
        const trackpad = new Trackpad({ maxSpeed: 7, constrain: false });

        expect(trackpad.xAxis.maxSpeed).toBe(7);
        expect(trackpad.yAxis.maxSpeed).toBe(7);
        expect(trackpad.xAxis.constrain).toBe(false);
        expect(trackpad.yAxis.constrain).toBe(false);
    });

    it('accepts custom easing implementations', () =>
    {
        const ease = () => ({ done: true, to: 0, start: () => undefined, update: () => 0 });
        const trackpad = new Trackpad({ xEase: ease(), yEase: ease() });

        expect(trackpad.xAxis).toBeDefined();
        expect(trackpad.yAxis).toBeDefined();
    });
});
