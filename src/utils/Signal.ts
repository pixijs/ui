/** A handle to one listener, returned by {@link Signal.connect}. */
export interface SignalConnection
{
    /**
     * Removes the listener from its signal.
     * @returns `false` if it was already removed.
     */
    disconnect(): boolean;
    /** While `false`, the listener stays connected but is skipped on emit. */
    enabled: boolean;
}

interface SignalLink<THandler>
{
    callback: THandler;
    order: number;
    enabled: boolean;
    /** Connected during an emit that has not finished yet; skipped until it does. */
    pending: boolean;
    removed: boolean;
}

/**
 * A typed event: listeners subscribe with `connect` and are called with the arguments passed to `emit`.
 *
 * Listeners run in ascending `order`, then in the order they connected. A listener connected while the
 * signal is emitting first runs on the next emit; one disconnected while it is emitting does not run.
 * @example
 * const onChange = new Signal<(value: number) => void>();
 * const connection = onChange.connect((value) => console.log(value));
 *
 * onChange.emit(1); // logs 1
 * connection.disconnect();
 */
export class Signal<THandler extends (...args: any[]) => any>
{
    // Replaced, never mutated, so an emit in progress keeps iterating the list it started with.
    protected links: SignalLink<THandler>[] = [];
    protected emitDepth = 0;
    protected hasPendingLinks = false;

    /** @returns The number of connected listeners. */
    getConnectionsCount(): number
    {
        return this.links.length;
    }

    /** @returns `true` if at least one listener is connected. */
    hasConnections(): boolean
    {
        return this.links.length > 0;
    }

    /**
     * Subscribes a listener.
     * @param callback - Called with the arguments of every `emit`.
     * @param order - Listeners with a higher order run later. Defaults to 0.
     */
    connect(callback: THandler, order = 0): SignalConnection
    {
        const link: SignalLink<THandler> = {
            callback,
            order,
            enabled: true,
            pending: this.emitDepth > 0,
            removed: false,
        };

        if (link.pending) this.hasPendingLinks = true;

        let index = this.links.length;

        while (index > 0 && this.links[index - 1].order > order) index--;

        this.links = [...this.links.slice(0, index), link, ...this.links.slice(index)];

        return {
            disconnect: () => this.remove(link),
            get enabled()
            {
                return !link.removed && link.enabled && !link.pending;
            },
            set enabled(enabled: boolean)
            {
                link.enabled = enabled;
            },
        };
    }

    /**
     * Unsubscribes the first listener connected with this callback.
     * @param callback - The callback passed to `connect`.
     * @returns `false` if it was not connected.
     */
    disconnect(callback: THandler): boolean
    {
        const link = this.links.find((l) => l.callback === callback);

        return link ? this.remove(link) : false;
    }

    /** Unsubscribes every listener. */
    disconnectAll(): void
    {
        this.links.forEach((link) => (link.removed = true));
        this.links = [];
    }

    /**
     * Calls every enabled listener.
     * @param args - Passed to each listener.
     */
    emit(...args: Parameters<THandler>): void
    {
        const links = this.links;

        this.emitDepth++;

        try
        {
            for (const link of links)
            {
                if (!link.removed && link.enabled && !link.pending) link.callback(...args);
            }
        }
        finally
        {
            this.emitDepth--;

            if (this.emitDepth === 0 && this.hasPendingLinks)
            {
                this.links.forEach((link) => (link.pending = false));
                this.hasPendingLinks = false;
            }
        }
    }

    protected remove(link: SignalLink<THandler>): boolean
    {
        if (link.removed) return false;

        link.removed = true;
        this.links = this.links.filter((l) => l !== link);

        return true;
    }
}
