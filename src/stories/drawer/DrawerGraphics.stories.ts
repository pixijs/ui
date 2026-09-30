import { Graphics, Text } from 'pixi.js';
import { PixiStory, StoryContext } from '@pixi/storybook-renderer';
import { Drawer } from '../../Drawer';
import { centerView } from '../../utils/helpers/resize';
import { colors, defaultTextStyle } from '../../utils/helpers/styles';
import { argTypes, getDefaultArgs } from '../utils/argTypes';
import { getColor } from '../utils/color';
import { loremText } from '../utils/loremText';
import { action } from '@storybook/addon-actions';

const args = {
    width: 400,
    height: 300,
    radius: 20,
    padding: 20,
    position: 'bottom',
    backgroundColor: colors.pannelColor,
    backgroundBorderColor: colors.pannelBorderColor,
    backdropColor: '#000000',
    backdropAlpha: 0.5,
    contentColor: colors.textColor,
    closeOnBackdropClick: true,
    swipeToClose: true,
};

type Args = typeof args;

export const BottomDrawer = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    width,
                    height,
                    radius,
                    padding,
                    backgroundColor,
                    backgroundBorderColor,
                    backdropColor,
                    backdropAlpha,
                    contentColor,
                    closeOnBackdropClick,
                    swipeToClose,
                } = args;

                const drawer = new Drawer({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(backgroundColor)
                        .stroke({
                            color: backgroundBorderColor,
                            width: 1,
                        }),
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    content: new Text({
                        text: loremText,
                        style: {
                            ...defaultTextStyle,
                            fontSize: 16,
                            align: 'center',
                            fontWeight: 'normal',
                            wordWrapWidth: width - (2 * padding) - padding,
                            wordWrap: true,
                            lineHeight: 20,
                            fill: getColor(contentColor),
                        },
                    }),
                    width,
                    height,
                    padding,
                    position: 'bottom',
                    closeOnBackdropClick,
                    swipeToClose,
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                drawer.onClose.connect(() =>
                {
                    action('onClose')('Drawer closed');
                    setTimeout(() => drawer.open(), 1000);
                });

                // Set screen size for proper positioning
                const canvas = document.getElementById('storybook-root');

                if (canvas)
                {
                    drawer.setScreenSize(canvas.offsetWidth, canvas.offsetHeight);
                }

                view.addChild(drawer);
                drawer.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(args),
};

export const TopDrawer = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    width,
                    height,
                    radius,
                    padding,
                    backgroundColor,
                    backgroundBorderColor,
                    backdropColor,
                    backdropAlpha,
                    contentColor,
                    closeOnBackdropClick,
                    swipeToClose,
                } = args;

                const drawer = new Drawer({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(backgroundColor)
                        .stroke({
                            color: backgroundBorderColor,
                            width: 1,
                        }),
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    content: new Text({
                        text: 'Swipe up to close this drawer',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 18,
                            align: 'center',
                            wordWrapWidth: width - (2 * padding),
                            wordWrap: true,
                            fill: getColor(contentColor),
                        },
                    }),
                    width,
                    height,
                    padding,
                    position: 'top',
                    closeOnBackdropClick,
                    swipeToClose,
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                drawer.onClose.connect(() =>
                {
                    action('onClose')('Drawer closed');
                    setTimeout(() => drawer.open(), 1000);
                });

                // Set screen size for proper positioning
                const canvas = document.getElementById('storybook-root');

                if (canvas)
                {
                    drawer.setScreenSize(canvas.offsetWidth, canvas.offsetHeight);
                }

                view.addChild(drawer);
                drawer.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(args),
};

export const LeftDrawer = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    width,
                    height,
                    radius,
                    padding,
                    backgroundColor,
                    backgroundBorderColor,
                    backdropColor,
                    backdropAlpha,
                    contentColor,
                    closeOnBackdropClick,
                    swipeToClose,
                } = args;

                const drawer = new Drawer({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(backgroundColor)
                        .stroke({
                            color: backgroundBorderColor,
                            width: 1,
                        }),
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    content: new Text({
                        text: 'Swipe left to close',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 18,
                            align: 'center',
                            wordWrapWidth: width - (2 * padding),
                            wordWrap: true,
                            fill: getColor(contentColor),
                        },
                    }),
                    width,
                    height,
                    padding,
                    position: 'left',
                    closeOnBackdropClick,
                    swipeToClose,
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                drawer.onClose.connect(() =>
                {
                    action('onClose')('Drawer closed');
                    setTimeout(() => drawer.open(), 1000);
                });

                // Set screen size for proper positioning
                const canvas = document.getElementById('storybook-root');

                if (canvas)
                {
                    drawer.setScreenSize(canvas.offsetWidth, canvas.offsetHeight);
                }

                view.addChild(drawer);
                drawer.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(args),
};

export const RightDrawer = {
    render: (args: Args, ctx: StoryContext) =>
        new PixiStory({
            context: ctx,
            init: (view) =>
            {
                const {
                    width,
                    height,
                    radius,
                    padding,
                    backgroundColor,
                    backgroundBorderColor,
                    backdropColor,
                    backdropAlpha,
                    contentColor,
                    closeOnBackdropClick,
                    swipeToClose,
                } = args;

                const drawer = new Drawer({
                    background: new Graphics()
                        .roundRect(0, 0, width, height, radius)
                        .fill(backgroundColor)
                        .stroke({
                            color: backgroundBorderColor,
                            width: 1,
                        }),
                    backdropColor: getColor(backdropColor),
                    backdropAlpha,
                    content: new Text({
                        text: 'Swipe right to close',
                        style: {
                            ...defaultTextStyle,
                            fontSize: 18,
                            align: 'center',
                            wordWrapWidth: width - (2 * padding),
                            wordWrap: true,
                            fill: getColor(contentColor),
                        },
                    }),
                    width,
                    height,
                    padding,
                    position: 'right',
                    closeOnBackdropClick,
                    swipeToClose,
                    animations: {
                        open: { props: {}, duration: 300 },
                        close: { props: {}, duration: 300 },
                    },
                });

                drawer.onClose.connect(() =>
                {
                    action('onClose')('Drawer closed');
                    setTimeout(() => drawer.open(), 1000);
                });

                // Set screen size for proper positioning
                const canvas = document.getElementById('storybook-root');

                if (canvas)
                {
                    drawer.setScreenSize(canvas.offsetWidth, canvas.offsetHeight);
                }

                view.addChild(drawer);
                drawer.open();
            },
            resize: centerView,
        }),
    args: getDefaultArgs(args),
};

export default {
    title: 'Components/Drawer/Use Graphics',
    argTypes: argTypes(args),
    args: getDefaultArgs(args),
};
