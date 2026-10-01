/**
 * Protected methods that subclasses overrode to customise typing before v2.4.0, when text was
 * rebuilt from `keydown`. Typed text now comes from the hidden native field's `input` event, so
 * these are no longer called for it and an override of them silently stops having an effect.
 */
const LEGACY_METHODS: Record<string, string> = {
    onKeyUp: 'onKeyUp() is no longer called; text comes from the native field through onInput(). '
        + 'If it was the workaround for https://github.com/pixijs/ui/issues/257, remove it.',
    onPaste: 'onPaste() is no longer called; the native field pastes on its own and reports it through onInput().',
    _add: '_add() is no longer called for typed text, so an override that filters or rewrites characters is '
        + 'bypassed. Override onInput() to adjust this.input.value before calling super.onInput().',
    _delete: '_delete() is no longer called for Backspace; deletion comes from the native field through onInput().',
};

const RELEASE_NOTES = 'https://github.com/pixijs/ui/releases/tag/v2.4.0';

/** Classes already checked, so each one is reported once however many instances it has. */
const checked = new WeakSet<object>();

/**
 * Warns once per class when a subclass of `base` overrides methods that typing no longer goes
 * through, or overrides onInput() expecting the event it used to receive. Call it once the
 * instance is fully constructed, so overrides declared as class fields are seen too.
 * @param instance - the input being checked.
 * @param base - the class whose own members do not count as overrides.
 * @param base.prototype - its prototype, where the search stops.
 */
export function warnLegacyOverrides(instance: object, base: { prototype: object }): void
{
    const ctor = instance.constructor;

    if (checked.has(ctor)) return;
    checked.add(ctor);

    const found = new Map<string, string>();
    const consider = (holder: object) =>
    {
        for (const name of Object.keys(LEGACY_METHODS))
        {
            if (Object.prototype.hasOwnProperty.call(holder, name)) found.set(name, LEGACY_METHODS[name]);
        }

        const onInput = Object.getOwnPropertyDescriptor(holder, 'onInput')?.value;

        if (typeof onInput === 'function' && onInput.length > 0 && !found.has('onInput'))
        {
            found.set('onInput', 'onInput() no longer receives the InputEvent; read this.input.value instead.');
        }
    };

    consider(instance);

    let proto = Object.getPrototypeOf(instance);

    while (proto && proto !== base.prototype)
    {
        consider(proto);
        proto = Object.getPrototypeOf(proto);
    }

    if (!found.size) return;

    console.warn(
        `@pixi/ui Input: ${ctor.name || 'a subclass of Input'} overrides methods that typing no longer goes `
        + `through since v2.4.0:\n${[...found.values()].map((m) => `- ${m}`).join('\n')}\nSee ${RELEASE_NOTES}`,
    );
}
