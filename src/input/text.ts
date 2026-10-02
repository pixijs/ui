/**
 * Cuts a string to a length in UTF-16 code units without splitting a surrogate pair, so the
 * result never holds a lone surrogate.
 * @param text - string to cut.
 * @param maxLength - length to cut to.
 */
export function clampLength(text: string, maxLength: number): string
{
    if (text.length <= maxLength) return text;

    const last = text.charCodeAt(maxLength - 1);
    const end = last >= 0xD800 && last <= 0xDBFF ? maxLength - 1 : maxLength;

    return text.substring(0, end);
}

/**
 * The class of a character for word selection: letters, digits and underscore form words,
 * whitespace is a gap, and anything else is punctuation.
 * @param ch - one character.
 */
export function characterKind(ch: string): 'word' | 'space' | 'other'
{
    if ((/[\p{L}\p{N}_]/u).test(ch)) return 'word';

    return (/\s/).test(ch) ? 'space' : 'other';
}

/**
 * The run of like characters (word, whitespace or punctuation) around an index, as a double
 * click selects it in a native field.
 * @param text - text to look in.
 * @param index - position to expand from.
 * @returns start and end of the run, or undefined for empty text.
 */
export function wordRangeAt(text: string, index: number): [number, number] | undefined
{
    const textLength = text.length;

    if (!textLength) return undefined;

    let pivot = Math.min(index, textLength - 1);

    // A click just past a word belongs to that word, not to the gap after it.
    if (pivot > 0 && characterKind(text[pivot]) === 'space' && characterKind(text[pivot - 1]) !== 'space')
    {
        pivot--;
    }

    const target = characterKind(text[pivot]);
    let start = pivot;
    let end = pivot + 1;

    while (start > 0 && characterKind(text[start - 1]) === target) start--;
    while (end < textLength && characterKind(text[end]) === target) end++;

    return [start, end];
}
