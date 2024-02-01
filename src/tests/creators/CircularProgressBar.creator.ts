import { Container } from 'pixi.js';
import { CreatorFunction } from '.';

const creatorFunction: CreatorFunction = (view) =>
{
    return new Container();
};

export default creatorFunction;
