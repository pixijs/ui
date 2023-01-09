"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[606],{"./src/stories/select/SelectGraphics.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Graphics:()=>Graphics,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/graphics/lib/index.mjs"),_pixi_display__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@pixi/display/lib/index.mjs"),_pixi_core__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@pixi/core/lib/index.mjs"),_pixi_sprite__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@pixi/sprite/lib/index.mjs"),_utils_argTypes__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./src/stories/utils/argTypes.ts"),_Select__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/Select.ts"),_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs"),_utils_loader__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./src/stories/utils/loader.ts"),_utils_helpers_styles__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/utils/helpers/styles.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/utils/helpers/resize.ts");function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var args={backgroundColor:"#F5E3A9",dropDownBackgroundColor:"#F5E3A9",dropDownHoverColor:"#A5E24D",fontColor:"#000000",fontSize:28,width:250,height:50,radius:15,itemsCount:100,onSelect:(0,_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_4__.aD)("Item selected")},Graphics=function Graphics(_ref){var fontColor=_ref.fontColor,fontSize=_ref.fontSize,width=_ref.width,height=_ref.height,radius=_ref.radius,itemsCount=_ref.itemsCount,backgroundColor=_ref.backgroundColor,dropDownBackgroundColor=_ref.dropDownBackgroundColor,dropDownHoverColor=_ref.dropDownHoverColor,onSelect=_ref.onSelect,view=new _pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2;backgroundColor=Number(backgroundColor.replace("#","0x")),fontColor=Number(fontColor.replace("#","0x")),dropDownBackgroundColor=Number(dropDownBackgroundColor.replace("#","0x"));var hoverColor=Number(dropDownHoverColor.replace("#","0x")),textStyle=_objectSpread(_objectSpread({},_utils_helpers_styles__WEBPACK_IMPORTED_MODULE_5__.B),{},{fill:fontColor,fontSize}),items=function getItems(itemsCount,text){for(var items=[],i=0;i<itemsCount;i++)items.push("".concat(text," ").concat(i+1));return items}(itemsCount,"Item"),select=new _Select__WEBPACK_IMPORTED_MODULE_6__.P({closedBG:getClosedBG(backgroundColor,width,height,radius),openBG:getOpenBG(dropDownBackgroundColor,width,height,radius),textStyle,items:{items,backgroundColor,hoverColor,width,height,textStyle,radius},scrollBox:{height:5*height,radius}});return select.y=10,select.onSelect.connect((function(_,text){onSelect(select.value,text)})),view.addChild(select),{view,resize:function resize(){return(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_7__.w)(view,.5,0)},update:function update(){return select.update()},startup:function startup(app){app.renderer.events.rootBoundary.moveOnAll=!0}}};function getClosedBG(backgroundColor,width,height,radius){var closedBG=(new _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__.TC).beginFill(backgroundColor).drawRoundedRect(0,0,width,height,radius);return(0,_utils_loader__WEBPACK_IMPORTED_MODULE_8__.z)(["arrow_down.png"]).then((function(){var arrowDown=new _pixi_sprite__WEBPACK_IMPORTED_MODULE_3__.j(_pixi_core__WEBPACK_IMPORTED_MODULE_2__.xE.from("arrow_down.png"));arrowDown.anchor.set(.5),arrowDown.x=.9*width,arrowDown.y=height/2,closedBG.addChild(arrowDown)})),closedBG}function getOpenBG(backgroundColor,width,height,radius){var openBG=(new _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__.TC).beginFill(backgroundColor).drawRoundedRect(0,0,width,6*height,radius);return(0,_utils_loader__WEBPACK_IMPORTED_MODULE_8__.z)(["arrow_down.png"]).then((function(){var arrowUp=new _pixi_sprite__WEBPACK_IMPORTED_MODULE_3__.j(_pixi_core__WEBPACK_IMPORTED_MODULE_2__.xE.from("arrow_down.png"));arrowUp.angle=180,arrowUp.anchor.set(.5),arrowUp.x=.9*width,arrowUp.y=height/2,openBG.addChild(arrowUp)})),openBG}const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:"import { Graphics as PixiGraphics } from '@pixi/graphics';\nimport { Container } from '@pixi/display';\nimport { Texture } from '@pixi/core';\nimport { Sprite } from '@pixi/sprite';\nimport { argTypes, getDefaultArgs } from '../utils/argTypes';\nimport { Select } from '../../Select';\nimport { action } from '@storybook/addon-actions';\nimport { preloadAssets } from '../utils/loader';\nimport { defaultTextStyle } from '../../utils/helpers/styles';\nimport { centerElement } from '../../utils/helpers/resize';\nimport type { Application } from '@pixi/app';\n\nconst args = {\n    backgroundColor: '#F5E3A9',\n    dropDownBackgroundColor: '#F5E3A9',\n    dropDownHoverColor: '#A5E24D',\n    fontColor: '#000000',\n    fontSize: 28,\n    width: 250,\n    height: 50,\n    radius: 15,\n    itemsCount: 100,\n    onSelect: action('Item selected'),\n};\n\nexport const Graphics = ({\n    fontColor,\n    fontSize,\n    width,\n    height,\n    radius,\n    itemsCount,\n    backgroundColor,\n    dropDownBackgroundColor,\n    dropDownHoverColor,\n    onSelect,\n}: any) =>\n{\n    const view = new Container();\n\n    backgroundColor = Number(backgroundColor.replace('#', '0x'));\n    fontColor = Number(fontColor.replace('#', '0x'));\n    dropDownBackgroundColor = Number(\n        dropDownBackgroundColor.replace('#', '0x'),\n    );\n    const hoverColor = Number(dropDownHoverColor.replace('#', '0x'));\n    const textStyle = { ...defaultTextStyle, fill: fontColor, fontSize };\n\n    const items = getItems(itemsCount, 'Item');\n\n    // Component usage !!!\n    // Important: in order scroll to work, you have to call update() method in your game loop.\n    const select = new Select({\n        closedBG: getClosedBG(backgroundColor, width, height, radius),\n        openBG: getOpenBG(dropDownBackgroundColor, width, height, radius),\n        textStyle,\n        items: {\n            items,\n            backgroundColor,\n            hoverColor,\n            width,\n            height,\n            textStyle,\n            radius,\n        },\n        scrollBox: {\n            height: height * 5,\n            radius,\n        },\n    });\n\n    select.y = 10;\n\n    select.onSelect.connect((_, text) =>\n    {\n        onSelect(select.value, text);\n    });\n\n    view.addChild(select);\n\n    return {\n        view,\n        resize: () => centerElement(view, 0.5, 0),\n        update: () => select.update(),\n        startup: (app: Application) => { app.renderer.events.rootBoundary.moveOnAll = true; }\n    };\n};\n\nfunction getClosedBG(\n    backgroundColor: number,\n    width: number,\n    height: number,\n    radius: number,\n)\n{\n    const closedBG = new PixiGraphics()\n        .beginFill(backgroundColor)\n        .drawRoundedRect(0, 0, width, height, radius);\n\n    preloadAssets(['arrow_down.png']).then(() =>\n    {\n        const arrowDown = new Sprite(Texture.from('arrow_down.png'));\n\n        arrowDown.anchor.set(0.5);\n        arrowDown.x = width * 0.9;\n        arrowDown.y = height / 2;\n        closedBG.addChild(arrowDown);\n    });\n\n    return closedBG;\n}\n\nfunction getOpenBG(\n    backgroundColor: number,\n    width: number,\n    height: number,\n    radius: number,\n)\n{\n    const openBG = new PixiGraphics()\n        .beginFill(backgroundColor)\n        .drawRoundedRect(0, 0, width, height * 6, radius);\n\n    preloadAssets(['arrow_down.png']).then(() =>\n    {\n        const arrowUp = new Sprite(Texture.from('arrow_down.png'));\n\n        arrowUp.angle = 180;\n        arrowUp.anchor.set(0.5);\n        arrowUp.x = width * 0.9;\n        arrowUp.y = height / 2;\n        openBG.addChild(arrowUp);\n    });\n\n    return openBG;\n}\n\nfunction getItems(itemsCount: number, text: string): string[]\n{\n    const items: string[] = [];\n\n    for (let i = 0; i < itemsCount; i++)\n    {\n        items.push(`${text} ${i + 1}`);\n    }\n\n    return items;\n}\n\nexport default {\n    title: 'UI components/Select/Graphics',\n    argTypes: argTypes(args),\n    args: getDefaultArgs(args),\n};\n",locationsMap:{graphics:{startLoc:{col:24,line:26},endLoc:{col:1,line:87},startBody:{col:24,line:26},endBody:{col:1,line:87}}}}},title:"UI components/Select/Graphics",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_9__.P)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_9__.V)(args)};var __namedExportsOrder=["Graphics"]}}]);