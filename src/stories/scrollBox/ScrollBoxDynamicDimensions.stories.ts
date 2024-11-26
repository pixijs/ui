import { Graphics, RenderTexture, Sprite, Text, Texture } from "pixi.js";
import { PixiStory, StoryFn } from "@pixi/storybook-renderer";
import { FancyButton } from "../../FancyButton";
import { ScrollBox } from "../../ScrollBox";
import { centerElement } from "../../utils/helpers/resize";
import { defaultTextStyle } from "../../utils/helpers/styles";
import { argTypes, getDefaultArgs } from "../utils/argTypes";

const args = {
  fontColor: "#000000",
  backgroundColor: "#F5E3A9",
  itemsAmount: 1000,
};

export const UseDynamicDimensions: StoryFn<typeof args> = (
  { fontColor, itemsAmount, backgroundColor },
  context,
) =>
  new PixiStory({
    context,
    init(view) {
      const sizes: { w: number; h: number }[] = [
        { w: 320, h: 440 },
        { w: 630, h: 440 },
        { w: 630, h: 360 },
        { w: 320, h: 200 },
      ];
      const elementsWidth = 300;
      const elementsHeight = 80;
      const radius = 20;
      let currentSizeID = 0;

      // Component usage !!!
      const scrollBox = new ScrollBox({
        background: backgroundColor,
        elementsMargin: 10,
        width: sizes[currentSizeID].w,
        height: sizes[currentSizeID].h,
        radius,
        padding: 10,
      });

      const items = [];
      const resizeScrollBox = () => {
        currentSizeID++;

        if (currentSizeID >= sizes.length) {
          currentSizeID = 0;
        }

        const size = sizes[currentSizeID];

        scrollBox.width = size.w;
        scrollBox.height = size.h;
      };

      const defaultView = Sprite.from(Texture.WHITE);
      defaultView.width = elementsWidth;
      defaultView.height = elementsHeight;
      defaultView.tint = 0xa5e24d;

      const hoverView = Sprite.from(Texture.WHITE);
        hoverView.width = elementsWidth;
        hoverView.height = elementsHeight;
        hoverView.tint = 0xfec230;

        const pressedView = Sprite.from(Texture.WHITE);
        pressedView.width = elementsWidth;
        pressedView.height = elementsHeight;
        pressedView.tint = 0xfe6048;

      for (let i = 0; i < itemsAmount; i++) {
        const defaultView = Sprite.from(Texture.WHITE);
        defaultView.width = elementsWidth;
        defaultView.height = elementsHeight;
        defaultView.tint = 0xa5e24d;

        const hoverView = Sprite.from(Texture.WHITE);
        hoverView.width = elementsWidth;
        hoverView.height = elementsHeight;
        hoverView.tint = 0xfec230;

        const pressedView = Sprite.from(Texture.WHITE);
        pressedView.width = elementsWidth;
        pressedView.height = elementsHeight;
        pressedView.tint = 0xfe6048;

        const button = new FancyButton({
          defaultView,
          hoverView,
          pressedView,
          text: new Text({
            text: `Item ${i + 1}`,
            style: {
              ...defaultTextStyle,
              fill: fontColor,
            },
          }),
        });

        button.anchor.set(0);
        button.onPress.connect(() => resizeScrollBox());

        items.push(button);
      }

      console.time(`add ${itemsAmount} Items`);
      scrollBox.addItems(items);
      console.timeEnd(`add ${itemsAmount} Items`);

      view.addChild(scrollBox);
    },
    resize: (view) => centerElement(view.children[0]),
  });

export default {
  title: "Components/ScrollBox/Use Dynamic Dimensions",
  argTypes: argTypes(args),
  args: getDefaultArgs(args),
};
