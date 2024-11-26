import { Container, Sprite, Text } from "pixi.js";
import { PixiStory, StoryFn } from "@pixi/storybook-renderer";
import { FancyButton } from "../../FancyButton";
import { List } from "../../List";
import { centerElement } from "../../utils/helpers/resize";
import { defaultTextStyle } from "../../utils/helpers/styles";
import { argTypes, getDefaultArgs } from "../utils/argTypes";
import { getColor } from "../utils/color";
import { preload } from "../utils/loader";
import { action } from "@storybook/addon-actions";

const args = {
  type: [null, "horizontal", "vertical"],
  fontColor: "#000000",
  elementsMargin: 29,
  itemsAmount: 10000,
  onPress: action("Button pressed"),
};

export const UseSprite: StoryFn<
  typeof args & { type: "horizontal" | "vertical" }
> = ({ fontColor, elementsMargin, itemsAmount, onPress, type }, context) =>
  new PixiStory<typeof args>({
    context,
    init: (view) => {
      const assets = [
        `SmallButton.png`,
        `SmallButton-hover.png`,
        `SmallButton-pressed.png`,
      ];

      preload(assets).then(() => {
        const items: Container[] = createItems(
          itemsAmount,
          getColor(fontColor),
          onPress,
        );

        // Component usage !!!
        const list = new List({
          type,
          vertPadding: 70,
          horPadding: 50,
          elementsMargin,
        });

        console.time(`Add ${itemsAmount} items`);
        list.addItems(items);
        console.timeEnd(`Add ${itemsAmount} items`);

        view.addChild(list);

        centerElement(view);
      });
    },
    // resize: centerElement,
  });

function createItems(
  itemsAmount: number,
  fontColor: number,
  onPress: (buttonID: number) => void,
): FancyButton[] {
  const items = [];

  for (let i = 0; i < itemsAmount; i++) {
    const button = new FancyButton({
      defaultView: `SmallButton.png`,
      hoverView: `SmallButton-hover.png`,
      pressedView: `SmallButton-pressed.png`,
      text: new Text({
        text: i + 1,
        style: {
          ...defaultTextStyle,
          fontSize: 68,
          fill: fontColor,
        },
      }),
      textOffset: {
        x: 0,
        y: -7,
      },
    });

    button.scale.set(0.5);

    button.onPress.connect(() => onPress(i + 1));

    items.push(button);
  }

  return items;
}

export default {
  title: "Components/List/Use Sprite",
  argTypes: argTypes(args),
  args: getDefaultArgs(args),
};
