"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[1210],{"./src/stories/select/SelectHTMLText.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{UseHTMLText:()=>UseHTMLText,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var pixi_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/pixi.js/lib/index.mjs"),_Select__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/Select.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/utils/helpers/resize.ts"),_utils_helpers_styles__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/utils/helpers/styles.ts"),_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/stories/utils/argTypes.ts"),_utils_color__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/stories/utils/color.ts"),_utils_loader__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/stories/utils/loader.ts");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(e,r,t){return(r=function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:i+""}(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}var args={backgroundColor:"#F5E3A9",dropDownBackgroundColor:"#F5E3A9",dropDownHoverColor:"#A5E24D",fontColor:"#000000",fontSize:28,width:250,height:50,radius:15,itemsAmount:5,onSelect:(0,__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs").XI)("Item selected")},UseHTMLText=function UseHTMLText(_ref){var fontColor=_ref.fontColor,fontSize=_ref.fontSize,width=_ref.width,height=_ref.height,radius=_ref.radius,itemsAmount=_ref.itemsAmount,backgroundColor=_ref.backgroundColor,dropDownBackgroundColor=_ref.dropDownBackgroundColor,dropDownHoverColor=_ref.dropDownHoverColor,onSelect=_ref.onSelect,view=new pixi_js__WEBPACK_IMPORTED_MODULE_0__.mcf;backgroundColor=(0,_utils_color__WEBPACK_IMPORTED_MODULE_2__.o)(backgroundColor),fontColor=(0,_utils_color__WEBPACK_IMPORTED_MODULE_2__.o)(fontColor),dropDownBackgroundColor=(0,_utils_color__WEBPACK_IMPORTED_MODULE_2__.o)(dropDownBackgroundColor);var hoverColor=(0,_utils_color__WEBPACK_IMPORTED_MODULE_2__.o)(dropDownHoverColor),textStyle=_objectSpread(_objectSpread({},_utils_helpers_styles__WEBPACK_IMPORTED_MODULE_3__.a),{},{fill:fontColor,fontSize}),items=function getItems(itemsAmount,text){for(var items=[],i=0;i<itemsAmount;i++)items.push("".concat(text," ").concat(i+1));return items}(itemsAmount,"Item"),select=new _Select__WEBPACK_IMPORTED_MODULE_4__.l({closedBG:getClosedBG(backgroundColor,width,height,radius),openBG:getOpenBG(dropDownBackgroundColor,width,height,radius),textStyle,TextClass:pixi_js__WEBPACK_IMPORTED_MODULE_0__.xni,items:{items,backgroundColor,hoverColor,width,height,textStyle,TextClass:pixi_js__WEBPACK_IMPORTED_MODULE_0__.xni,radius},scrollBox:{width,height:5*height,radius}});return select.y=10,select.onSelect.connect((function(_,text){onSelect({id:select.value,text})})),view.addChild(select),{view,resize:function resize(){return(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_5__.E)(view,.5,0)}}};function getClosedBG(backgroundColor,width,height,radius){var closedBG=(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(0,0,width,height,radius).fill(backgroundColor);return(0,_utils_loader__WEBPACK_IMPORTED_MODULE_6__.u)(["arrow_down.png"]).then((function(){var arrowDown=pixi_js__WEBPACK_IMPORTED_MODULE_0__.kxk.from("arrow_down.png");arrowDown.anchor.set(.5),arrowDown.x=.9*width,arrowDown.y=height/2,closedBG.addChild(arrowDown)})),closedBG}function getOpenBG(backgroundColor,width,height,radius){var openBG=(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(0,0,width,6*height,radius).fill(backgroundColor);return(0,_utils_loader__WEBPACK_IMPORTED_MODULE_6__.u)(["arrow_down.png"]).then((function(){var arrowUp=pixi_js__WEBPACK_IMPORTED_MODULE_0__.kxk.from("arrow_down.png");arrowUp.angle=180,arrowUp.anchor.set(.5),arrowUp.x=.9*width,arrowUp.y=height/2,openBG.addChild(arrowUp)})),openBG}const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:"import { Container, Graphics, HTMLText, Sprite } from 'pixi.js';\nimport { Select } from '../../Select';\nimport { centerElement } from '../../utils/helpers/resize';\nimport { defaultTextStyle } from '../../utils/helpers/styles';\nimport { argTypes, getDefaultArgs } from '../utils/argTypes';\nimport { getColor } from '../utils/color';\nimport { preload } from '../utils/loader';\nimport { action } from '@storybook/addon-actions';\n\nimport type { StoryFn } from '@storybook/types';\n\nconst args = {\n    backgroundColor: '#F5E3A9',\n    dropDownBackgroundColor: '#F5E3A9',\n    dropDownHoverColor: '#A5E24D',\n    fontColor: '#000000',\n    fontSize: 28,\n    width: 250,\n    height: 50,\n    radius: 15,\n    itemsAmount: 5,\n    onSelect: action('Item selected'),\n};\n\nexport const UseHTMLText: StoryFn = ({\n    fontColor,\n    fontSize,\n    width,\n    height,\n    radius,\n    itemsAmount,\n    backgroundColor,\n    dropDownBackgroundColor,\n    dropDownHoverColor,\n    onSelect,\n}: any) =>\n{\n    const view = new Container();\n\n    backgroundColor = getColor(backgroundColor);\n    fontColor = getColor(fontColor);\n    dropDownBackgroundColor = getColor(dropDownBackgroundColor);\n    const hoverColor = getColor(dropDownHoverColor);\n    const textStyle = { ...defaultTextStyle, fill: fontColor, fontSize };\n\n    const items = getItems(itemsAmount, 'Item');\n\n    // Component usage !!!\n    // Important: in order scroll to work, you have to call update() method in your game loop.\n    const select = new Select({\n        closedBG: getClosedBG(backgroundColor, width, height, radius),\n        openBG: getOpenBG(dropDownBackgroundColor, width, height, radius),\n        textStyle,\n        TextClass: HTMLText,\n        items: {\n            items,\n            backgroundColor,\n            hoverColor,\n            width,\n            height,\n            textStyle,\n            TextClass: HTMLText,\n            radius,\n        },\n        scrollBox: {\n            width,\n            height: height * 5,\n            radius,\n        },\n    });\n\n    select.y = 10;\n\n    select.onSelect.connect((_, text) =>\n    {\n        onSelect({\n            id: select.value,\n            text,\n        });\n    });\n\n    view.addChild(select);\n\n    return {\n        view,\n        resize: () => centerElement(view, 0.5, 0),\n    };\n};\n\nfunction getClosedBG(backgroundColor: number, width: number, height: number, radius: number)\n{\n    const closedBG = new Graphics().roundRect(0, 0, width, height, radius).fill(backgroundColor);\n\n    preload(['arrow_down.png']).then(() =>\n    {\n        const arrowDown = Sprite.from('arrow_down.png');\n\n        arrowDown.anchor.set(0.5);\n        arrowDown.x = width * 0.9;\n        arrowDown.y = height / 2;\n        closedBG.addChild(arrowDown);\n    });\n\n    return closedBG;\n}\n\nfunction getOpenBG(backgroundColor: number, width: number, height: number, radius: number)\n{\n    const openBG = new Graphics().roundRect(0, 0, width, height * 6, radius).fill(backgroundColor);\n\n    preload(['arrow_down.png']).then(() =>\n    {\n        const arrowUp = Sprite.from('arrow_down.png');\n\n        arrowUp.angle = 180;\n        arrowUp.anchor.set(0.5);\n        arrowUp.x = width * 0.9;\n        arrowUp.y = height / 2;\n        openBG.addChild(arrowUp);\n    });\n\n    return openBG;\n}\n\nfunction getItems(itemsAmount: number, text: string): string[]\n{\n    const items: string[] = [];\n\n    for (let i = 0; i < itemsAmount; i++)\n    {\n        items.push(`${text} ${i + 1}`);\n    }\n\n    return items;\n}\n\nexport default {\n    title: 'Components/Select/Use HTML Text',\n    argTypes: argTypes(args),\n    args: getDefaultArgs(args),\n};\n",locationsMap:{"use-html-text":{startLoc:{col:36,line:25},endLoc:{col:1,line:88},startBody:{col:36,line:25},endBody:{col:1,line:88}}}}},title:"Components/Select/Use HTML Text",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__.U)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__.p)(args)},__namedExportsOrder=["UseHTMLText"]},"./src/stories/utils/color.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{o:()=>getColor});var pixi_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/pixi.js/lib/index.mjs");function getColor(color){if("transparent"!==color&&void 0!==color)return pixi_js__WEBPACK_IMPORTED_MODULE_0__.Q1f.shared.setValue(color).toNumber()}}}]);