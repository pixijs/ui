export function getTitle(title: string): string
{
    const split =  title.split('/');

    return split[split.length - 1];
}
