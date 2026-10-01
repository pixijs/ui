import { Signal } from '../../src/utils/Signal';

describe('Signal', () =>
{
    it('calls listeners with the emitted arguments', () =>
    {
        const signal = new Signal<(a: number, b: string) => void>();
        const listener = jest.fn();

        signal.connect(listener);
        signal.emit(1, 'one');

        expect(listener).toHaveBeenCalledWith(1, 'one');
    });

    it('runs listeners by ascending order, then by connection order', () =>
    {
        const signal = new Signal<() => void>();
        const calls: string[] = [];

        signal.connect(() => calls.push('late'), 1);
        signal.connect(() => calls.push('first'));
        signal.connect(() => calls.push('early'), -1);
        signal.connect(() => calls.push('second'));
        signal.emit();

        expect(calls).toEqual(['early', 'first', 'second', 'late']);
    });

    it('stops calling a listener once its connection is disconnected', () =>
    {
        const signal = new Signal<() => void>();
        const listener = jest.fn();
        const connection = signal.connect(listener);

        expect(connection.disconnect()).toBe(true);
        expect(connection.disconnect()).toBe(false);
        signal.emit();

        expect(listener).not.toHaveBeenCalled();
        expect(signal.hasConnections()).toBe(false);
    });

    it('disconnects by callback', () =>
    {
        const signal = new Signal<() => void>();
        const listener = jest.fn();
        const connection = signal.connect(listener);

        expect(signal.disconnect(listener)).toBe(true);
        expect(signal.disconnect(listener)).toBe(false);
        expect(connection.disconnect()).toBe(false);
        signal.emit();

        expect(listener).not.toHaveBeenCalled();
    });

    it('disconnects every listener', () =>
    {
        const signal = new Signal<() => void>();
        const listener = jest.fn();

        signal.connect(listener);
        signal.connect(listener);
        expect(signal.getConnectionsCount()).toBe(2);

        signal.disconnectAll();
        signal.emit();

        expect(listener).not.toHaveBeenCalled();
        expect(signal.getConnectionsCount()).toBe(0);
    });

    it('skips a disabled listener without disconnecting it', () =>
    {
        const signal = new Signal<() => void>();
        const listener = jest.fn();
        const connection = signal.connect(listener);

        connection.enabled = false;
        signal.emit();
        expect(listener).not.toHaveBeenCalled();
        expect(signal.hasConnections()).toBe(true);

        connection.enabled = true;
        signal.emit();
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('runs a listener connected during an emit from the next emit on', () =>
    {
        const signal = new Signal<() => void>();
        const added = jest.fn();
        let connection: ReturnType<Signal<() => void>['connect']> | undefined;

        signal.connect(() =>
        {
            connection ??= signal.connect(added);
        });

        signal.emit();
        expect(added).not.toHaveBeenCalled();

        signal.emit();
        expect(added).toHaveBeenCalledTimes(1);
        expect(connection?.enabled).toBe(true);
    });

    it('does not run a listener disconnected earlier in the same emit', () =>
    {
        const signal = new Signal<() => void>();
        const second = jest.fn();

        signal.connect(() => signal.disconnect(second));
        signal.connect(second);
        signal.emit();

        expect(second).not.toHaveBeenCalled();
    });

    it('still runs the remaining listeners when one disconnects itself', () =>
    {
        const signal = new Signal<() => void>();
        const second = jest.fn();
        const connection = signal.connect(() => connection.disconnect());

        signal.connect(second);
        signal.emit();

        expect(second).toHaveBeenCalledTimes(1);
        expect(signal.getConnectionsCount()).toBe(1);
    });

    it('recovers after a listener throws', () =>
    {
        const signal = new Signal<() => void>();
        const added = jest.fn();
        let thrown = false;

        signal.connect(() =>
        {
            if (thrown) return;
            thrown = true;
            signal.connect(added);
            throw new Error('listener failed');
        });

        expect(() => signal.emit()).toThrow('listener failed');

        signal.emit();
        expect(added).toHaveBeenCalledTimes(1);
    });
});
