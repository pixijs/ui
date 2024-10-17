import { Container, Graphics, Text } from "pixi.js";
import { PixiStory, StoryFn } from "@pixi/storybook-renderer";
import { Button } from "../../Button";
import { centerElement } from "../../utils/helpers/resize";
import { argTypes, getDefaultArgs } from "../utils/argTypes";
import { action } from "@storybook/addon-actions";

const args = {
  color: "#A5E24D",
  size: 150,
  radius: 150,
  disabled: false,
  action: action("Button"),
};

export const UseGraphics: StoryFn<typeof args> = (
  { size, color, disabled, radius, action },
  context,
) =>
  new PixiStory<typeof args>({
    context,
    init: (view) => {
      const buttonView = new Container();
      const buttonBg = new Graphics()
        .roundRect(0, 0, size, size, radius)
        .fill(color);
      const text = new Text({ text: "🤙", style: { fontSize: 70 } });

      text.anchor.set(0.5);
      text.x = buttonBg.width / 2;
      text.y = buttonBg.height / 2;

      buttonView.addChild(buttonBg, text);

      // Component usage !!!
      const button = new Button(buttonView);

      button.enabled = !disabled;

      button.onPress.connect(() => action("onPress"));
      button.onDown.connect(() => action("onDown"));
      button.onUp.connect(() => action("onUp"));
      button.onHover.connect(() => action("onHover"));
      button.onOut.connect(() => action("onOut"));
      button.onUpOut.connect(() => action("onUpOut"));
      view.addChild(buttonView);

      centerElement(buttonView);
    },
    resize: (view) => centerElement(view.children[0]),
  });

export default {
  title: "Components/Button/Use Graphics",
  argTypes: argTypes(args),
  args: getDefaultArgs(args),
};
