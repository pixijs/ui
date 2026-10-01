import { TapCounter } from '../../src/input/TapCounter';

describe('TapCounter', () =>
{
    it('counts quick presses at one spot as a sequence', () =>
    {
        const taps = new TapCounter();

        expect(taps.next(10, 10, false, 1000)).toBe(1);
        expect(taps.next(10, 10, false, 1200)).toBe(2);
        expect(taps.next(11, 10, false, 1400)).toBe(3);
    });

    it('starts over after the mouse window of 500 ms', () =>
    {
        const taps = new TapCounter();

        taps.next(10, 10, false, 1000);

        expect(taps.next(10, 10, false, 1500)).toBe(2);
        expect(taps.next(10, 10, false, 2001)).toBe(1);
    });

    it('starts over when a press lands further than 12 px away', () =>
    {
        const taps = new TapCounter();

        taps.next(10, 10, false, 1000);

        expect(taps.next(22, 10, false, 1100)).toBe(2);
        expect(taps.next(40, 10, false, 1200)).toBe(1);
    });

    it('gives a finger a wider spot and a shorter window', () =>
    {
        const taps = new TapCounter();

        taps.next(10, 10, true, 1000);

        // 25 px away is still the same spot for a finger, not for a mouse.
        expect(taps.next(35, 10, true, 1100)).toBe(2);

        // 400 ms is within the mouse window but past the touch one.
        expect(taps.next(35, 10, true, 1500)).toBe(1);
    });

    it('defaults to the current time', () =>
    {
        const now = jest.spyOn(performance, 'now').mockReturnValue(5000);
        const taps = new TapCounter();

        taps.next(0, 0);
        now.mockReturnValue(5100);

        expect(taps.next(0, 0)).toBe(2);

        now.mockRestore();
    });
});
