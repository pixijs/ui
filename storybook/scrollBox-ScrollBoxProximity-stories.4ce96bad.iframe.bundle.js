(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[7189],{"./node_modules/@pixi/storybook-renderer/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{M4:()=>PixiStory});var _chunk_N3U6A7KW_mjs__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/storybook-renderer/dist/chunk-N3U6A7KW.mjs"),global__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/global/window.js"),global__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(global__WEBPACK_IMPORTED_MODULE_1__),_storybook_core_client__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("@storybook/core-client"),pixi_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/pixi.js/lib/index.mjs"),{window:globalWindow}=global__WEBPACK_IMPORTED_MODULE_1___default();globalWindow.STORYBOOK_ENV="PIXI";var api=(0,_storybook_core_client__WEBPACK_IMPORTED_MODULE_2__.start)(_chunk_N3U6A7KW_mjs__WEBPACK_IMPORTED_MODULE_0__.u),PixiStory=(api.forceReRender,api.clientApi.raw,class{constructor(options){this.view=new pixi_js__WEBPACK_IMPORTED_MODULE_3__.mcf,options.context.parameters.pixi.appReady.then((()=>{options.init(this.view)})),void 0!==options.update&&(this.update=ticker=>{options.update(this.view,ticker)}),void 0!==options.resize&&(this.resize=(width,height)=>{options.resize(this.view,width,height)}),void 0!==options.destroy&&(this.destroy=()=>{options.destroy(this.view)})}})},"./node_modules/@storybook/addon-actions/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{XI:()=>action});var v4=__webpack_require__("./node_modules/@storybook/addon-actions/node_modules/uuid/dist/esm-browser/v4.js"),external_STORYBOOK_MODULE_PREVIEW_API_=__webpack_require__("@storybook/preview-api"),external_STORYBOOK_MODULE_GLOBAL_=__webpack_require__("@storybook/global"),preview_errors=__webpack_require__("./node_modules/@storybook/core-events/dist/errors/preview-errors.mjs"),ADDON_ID="storybook/actions",EVENT_ID=`${ADDON_ID}/action-event`,config={depth:10,clearOnStoryChange:!0,limit:50},findProto=(obj,callback)=>{let proto=Object.getPrototypeOf(obj);return!proto||callback(proto)?proto:findProto(proto,callback)},serializeArg=a=>{if("object"==typeof(e=a)&&e&&findProto(e,(proto=>/^Synthetic(?:Base)?Event$/.test(proto.constructor.name)))&&"function"==typeof e.persist){let e=Object.create(a.constructor.prototype,Object.getOwnPropertyDescriptors(a));e.persist();let viewDescriptor=Object.getOwnPropertyDescriptor(e,"view"),view=viewDescriptor?.value;return"object"==typeof view&&"Window"===view?.constructor.name&&Object.defineProperty(e,"view",{...viewDescriptor,value:Object.create(view.constructor.prototype)}),e}var e;return a},generateId=()=>"object"==typeof crypto&&"function"==typeof crypto.getRandomValues?(0,v4.A)():Date.now().toString(36)+Math.random().toString(36).substring(2);function action(name,options={}){let actionOptions={...config,...options},handler=function(...args){if(options.implicit){let storyRenderer=("__STORYBOOK_PREVIEW__"in external_STORYBOOK_MODULE_GLOBAL_.global?external_STORYBOOK_MODULE_GLOBAL_.global.__STORYBOOK_PREVIEW__:void 0)?.storyRenders.find((render=>"playing"===render.phase||"rendering"===render.phase));if(storyRenderer){let deprecated=!window?.FEATURES?.disallowImplicitActionsInRenderV8,error=new preview_errors._U({phase:storyRenderer.phase,name,deprecated});if(!deprecated)throw error;console.warn(error)}}let channel=external_STORYBOOK_MODULE_PREVIEW_API_.addons.getChannel(),id=generateId(),serializedArgs=args.map(serializeArg),normalizedArgs=args.length>1?serializedArgs:serializedArgs[0],actionDisplayToEmit={id,count:0,data:{name,args:normalizedArgs},options:{...actionOptions,maxDepth:5+(actionOptions.depth||3),allowFunction:actionOptions.allowFunction||!1}};channel.emit(EVENT_ID,actionDisplayToEmit)};return handler.isAction=!0,handler}},"./src/stories/scrollBox/ScrollBoxProximity.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ProximityEvent:()=>ProximityEvent,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var pixi_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/pixi.js/lib/index.mjs"),_pixi_storybook_renderer__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@pixi/storybook-renderer/dist/index.mjs"),_FancyButton__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/FancyButton.ts"),_ScrollBox__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/ScrollBox.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/utils/helpers/resize.ts"),_utils_helpers_styles__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/utils/helpers/styles.ts"),_utils_HelpTypes__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/utils/HelpTypes.ts"),_utils_argTypes__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./src/stories/utils/argTypes.ts"),_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(e,r,t){return(r=function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:i+""}(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function _arrayLikeToArray(r,a){(null==a||a>r.length)&&(a=r.length);for(var e=0,n=Array(a);e<a;e++)n[e]=r[e];return n}var args={proximityRange:100,proximityDebounce:10,width:320,height:420,radius:20,elementsMargin:10,elementsPadding:10,elementsWidth:300,elementsHeight:80,itemsAmount:100,type:function _toConsumableArray(r){return function _arrayWithoutHoles(r){if(Array.isArray(r))return _arrayLikeToArray(r)}(r)||function _iterableToArray(r){if("undefined"!=typeof Symbol&&null!=r[Symbol.iterator]||null!=r["@@iterator"])return Array.from(r)}(r)||function _unsupportedIterableToArray(r,a){if(r){if("string"==typeof r)return _arrayLikeToArray(r,a);var t={}.toString.call(r).slice(8,-1);return"Object"===t&&r.constructor&&(t=r.constructor.name),"Map"===t||"Set"===t?Array.from(r):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?_arrayLikeToArray(r,a):void 0}}(r)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}(_utils_HelpTypes__WEBPACK_IMPORTED_MODULE_3__.q),fadeSpeed:.5},items=[],inRangeCache=[],ProximityEvent=function ProximityEvent(_ref,context){var width=_ref.width,height=_ref.height,radius=_ref.radius,elementsMargin=_ref.elementsMargin,elementsPadding=_ref.elementsPadding,elementsWidth=_ref.elementsWidth,elementsHeight=_ref.elementsHeight,itemsAmount=_ref.itemsAmount,proximityRange=_ref.proximityRange,proximityDebounce=_ref.proximityDebounce,type=_ref.type,fadeSpeed=_ref.fadeSpeed;return new _pixi_storybook_renderer__WEBPACK_IMPORTED_MODULE_1__.M4({context,init:function init(view){var shiftScroll="horizontal"===type,onPress=(0,_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_2__.XI)("Button pressed");items.length=0,inRangeCache.length=0;for(var _loop=function _loop(i){var button=new _FancyButton__WEBPACK_IMPORTED_MODULE_4__.w({defaultView:(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(0,0,elementsWidth,elementsHeight,radius).fill(10871373),hoverView:(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(0,0,elementsWidth,elementsHeight,radius).fill(16695856),pressedView:(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(0,0,elementsWidth,elementsHeight,radius).fill(16670792),text:new pixi_js__WEBPACK_IMPORTED_MODULE_0__.EYj({text:"Item ".concat(i+1),style:_objectSpread(_objectSpread({},_utils_helpers_styles__WEBPACK_IMPORTED_MODULE_5__.a),{},{fill:"#000000"})})});button.anchor.set(0),button.onPress.connect((function(){return onPress(i+1)})),button.alpha=0,items.push(button),inRangeCache.push(!1)},i=0;i<itemsAmount;i++)_loop(i);var scrollBox=new _ScrollBox__WEBPACK_IMPORTED_MODULE_6__.Z({background:"#F5E3A9",elementsMargin,width,height,radius,padding:elementsPadding,disableEasing:!1,globalScroll:!0,shiftScroll,type,proximityRange,proximityDebounce});scrollBox.addItems(items),scrollBox.onProximityChange.connect((function(_ref2){var index=_ref2.index,inRange=_ref2.inRange;inRangeCache[index]=inRange})),view.addChild(scrollBox)},resize:function resize(view){return(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_7__.E)(view.children[0])},update:function update(){items.forEach((function(item,index){var inRange=inRangeCache[index];inRange&&item.alpha<1?item.alpha+=.04*fadeSpeed:!inRange&&item.alpha>0&&(item.alpha-=.04*fadeSpeed)}))}})};const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:"import { Graphics, Text } from 'pixi.js';\nimport { PixiStory, StoryFn } from '@pixi/storybook-renderer';\nimport { FancyButton } from '../../FancyButton';\nimport { ListType } from '../../List';\nimport { ScrollBox } from '../../ScrollBox';\nimport { centerElement } from '../../utils/helpers/resize';\nimport { defaultTextStyle } from '../../utils/helpers/styles';\nimport { LIST_TYPE } from '../../utils/HelpTypes';\nimport { argTypes, getDefaultArgs } from '../utils/argTypes';\nimport { action } from '@storybook/addon-actions';\n\nconst args = {\n    proximityRange: 100,\n    proximityDebounce: 10,\n    width: 320,\n    height: 420,\n    radius: 20,\n    elementsMargin: 10,\n    elementsPadding: 10,\n    elementsWidth: 300,\n    elementsHeight: 80,\n    itemsAmount: 100,\n    type: [...LIST_TYPE],\n    fadeSpeed: 0.5,\n};\n\nconst items: FancyButton[] = [];\nconst inRangeCache: boolean[] = [];\n\nexport const ProximityEvent: StoryFn<\n    typeof args & { type: ListType }\n> = (\n    {\n        width,\n        height,\n        radius,\n        elementsMargin,\n        elementsPadding,\n        elementsWidth,\n        elementsHeight,\n        itemsAmount,\n        proximityRange,\n        proximityDebounce,\n        type,\n        fadeSpeed,\n    },\n    context,\n) =>\n    new PixiStory<typeof args>({\n        context,\n        init: (view) =>\n        {\n            const fontColor = '#000000';\n            const backgroundColor = '#F5E3A9';\n            const disableEasing = false;\n            const globalScroll = true;\n            const shiftScroll = type === 'horizontal';\n            const onPress = action('Button pressed');\n\n            items.length = 0;\n            inRangeCache.length = 0;\n\n            for (let i = 0; i < itemsAmount; i++)\n            {\n                const button = new FancyButton({\n                    defaultView: new Graphics()\n                        .roundRect(0, 0, elementsWidth, elementsHeight, radius)\n                        .fill(0xa5e24d),\n                    hoverView: new Graphics()\n                        .roundRect(0, 0, elementsWidth, elementsHeight, radius)\n                        .fill(0xfec230),\n                    pressedView: new Graphics()\n                        .roundRect(0, 0, elementsWidth, elementsHeight, radius)\n                        .fill(0xfe6048),\n                    text: new Text({\n                        text: `Item ${i + 1}`,\n                        style: {\n                            ...defaultTextStyle,\n                            fill: fontColor,\n                        },\n                    }),\n                });\n\n                button.anchor.set(0);\n                button.onPress.connect(() => onPress(i + 1));\n                button.alpha = 0;\n\n                items.push(button);\n                inRangeCache.push(false);\n            }\n\n            const scrollBox = new ScrollBox({\n                background: backgroundColor,\n                elementsMargin,\n                width,\n                height,\n                radius,\n                padding: elementsPadding,\n                disableEasing,\n                globalScroll,\n                shiftScroll,\n                type,\n                proximityRange,\n                proximityDebounce,\n            });\n\n            scrollBox.addItems(items);\n\n            // Handle on proximity change event.\n            scrollBox.onProximityChange.connect(({ index, inRange }) =>\n            {\n                inRangeCache[index] = inRange;\n            });\n\n            view.addChild(scrollBox);\n        },\n        resize: (view) => centerElement(view.children[0]),\n        update: () =>\n        {\n            items.forEach((item, index) =>\n            {\n                const inRange = inRangeCache[index];\n\n                // Fade in/out according to whether the item is within the specified range.\n                if (inRange && item.alpha < 1) item.alpha += 0.04 * fadeSpeed;\n                else if (!inRange && item.alpha > 0) item.alpha -= 0.04 * fadeSpeed;\n            });\n        },\n    });\n\nexport default {\n    title: 'Components/ScrollBox/Proximity Event',\n    argTypes: argTypes(args),\n    args: getDefaultArgs(args),\n};\n",locationsMap:{"proximity-event":{startLoc:{col:4,line:32},endLoc:{col:6,line:129},startBody:{col:4,line:32},endBody:{col:6,line:129}}}}},title:"Components/ScrollBox/Proximity Event",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_8__.U)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_8__.p)(args)},__namedExportsOrder=["ProximityEvent"]},"./src/utils/HelpTypes.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>BUTTON_EVENTS,q:()=>LIST_TYPE});var BUTTON_EVENTS=["onPress","onDown","onUp","onHover","onOut","onUpOut"],LIST_TYPE=["vertical","horizontal","bidirectional"]},"./node_modules/global/window.js":(module,__unused_webpack_exports,__webpack_require__)=>{var win;win="undefined"!=typeof window?window:void 0!==__webpack_require__.g?__webpack_require__.g:"undefined"!=typeof self?self:{},module.exports=win}}]);