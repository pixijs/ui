(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[4183],{"./node_modules/@pixi/storybook-renderer/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{M4:()=>PixiStory});var _chunk_N3U6A7KW_mjs__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/storybook-renderer/dist/chunk-N3U6A7KW.mjs"),global__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/global/window.js"),global__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(global__WEBPACK_IMPORTED_MODULE_1__),_storybook_core_client__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("@storybook/core-client"),pixi_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/pixi.js/lib/index.mjs"),{window:globalWindow}=global__WEBPACK_IMPORTED_MODULE_1___default();globalWindow.STORYBOOK_ENV="PIXI";var api=(0,_storybook_core_client__WEBPACK_IMPORTED_MODULE_2__.start)(_chunk_N3U6A7KW_mjs__WEBPACK_IMPORTED_MODULE_0__.u),PixiStory=(api.forceReRender,api.clientApi.raw,class{constructor(options){this.view=new pixi_js__WEBPACK_IMPORTED_MODULE_3__.mcf,options.context.parameters.pixi.appReady.then((()=>{options.init(this.view)})),void 0!==options.update&&(this.update=ticker=>{options.update(this.view,ticker)}),void 0!==options.resize&&(this.resize=(width,height)=>{options.resize(this.view,width,height)}),void 0!==options.destroy&&(this.destroy=()=>{options.destroy(this.view)})}})},"./node_modules/@storybook/addon-actions/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{XI:()=>action});var v4=__webpack_require__("./node_modules/@storybook/addon-actions/node_modules/uuid/dist/esm-browser/v4.js"),external_STORYBOOK_MODULE_PREVIEW_API_=__webpack_require__("@storybook/preview-api"),external_STORYBOOK_MODULE_GLOBAL_=__webpack_require__("@storybook/global"),preview_errors=__webpack_require__("./node_modules/@storybook/core-events/dist/errors/preview-errors.mjs"),ADDON_ID="storybook/actions",EVENT_ID=`${ADDON_ID}/action-event`,config={depth:10,clearOnStoryChange:!0,limit:50},findProto=(obj,callback)=>{let proto=Object.getPrototypeOf(obj);return!proto||callback(proto)?proto:findProto(proto,callback)},serializeArg=a=>{if("object"==typeof(e=a)&&e&&findProto(e,(proto=>/^Synthetic(?:Base)?Event$/.test(proto.constructor.name)))&&"function"==typeof e.persist){let e=Object.create(a.constructor.prototype,Object.getOwnPropertyDescriptors(a));e.persist();let viewDescriptor=Object.getOwnPropertyDescriptor(e,"view"),view=viewDescriptor?.value;return"object"==typeof view&&"Window"===view?.constructor.name&&Object.defineProperty(e,"view",{...viewDescriptor,value:Object.create(view.constructor.prototype)}),e}var e;return a},generateId=()=>"object"==typeof crypto&&"function"==typeof crypto.getRandomValues?(0,v4.A)():Date.now().toString(36)+Math.random().toString(36).substring(2);function action(name,options={}){let actionOptions={...config,...options},handler=function(...args){if(options.implicit){let storyRenderer=("__STORYBOOK_PREVIEW__"in external_STORYBOOK_MODULE_GLOBAL_.global?external_STORYBOOK_MODULE_GLOBAL_.global.__STORYBOOK_PREVIEW__:void 0)?.storyRenders.find((render=>"playing"===render.phase||"rendering"===render.phase));if(storyRenderer){let deprecated=!window?.FEATURES?.disallowImplicitActionsInRenderV8,error=new preview_errors._U({phase:storyRenderer.phase,name,deprecated});if(!deprecated)throw error;console.warn(error)}}let channel=external_STORYBOOK_MODULE_PREVIEW_API_.addons.getChannel(),id=generateId(),serializedArgs=args.map(serializeArg),normalizedArgs=args.length>1?serializedArgs:serializedArgs[0],actionDisplayToEmit={id,count:0,data:{name,args:normalizedArgs},options:{...actionOptions,maxDepth:5+(actionOptions.depth||3),allowFunction:actionOptions.allowFunction||!1}};channel.emit(EVENT_ID,actionDisplayToEmit)};return handler.isAction=!0,handler}},"./src/stories/list/ListGraphics.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{UseGraphics:()=>UseGraphics,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var pixi_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/pixi.js/lib/index.mjs"),_pixi_storybook_renderer__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@pixi/storybook-renderer/dist/index.mjs"),_FancyButton__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/FancyButton.ts"),_List__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/List.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/utils/helpers/resize.ts"),_utils_helpers_styles__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/utils/helpers/styles.ts"),_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/stories/utils/argTypes.ts");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(e,r,t){return(r=function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:i+""}(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}var args={type:[null,"horizontal","vertical"],fontColor:"#000000",bgColor:"#f5e3a9",width:271,height:270,radius:20,elementsMargin:10,topPadding:20,leftPadding:20,rightPadding:20,elementsWidth:70,elementsHeight:70,itemsAmount:9,onPress:(0,__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs").XI)("Button pressed")},UseGraphics=function UseGraphics(_ref,context){var type=_ref.type,fontColor=_ref.fontColor,bgColor=_ref.bgColor,width=_ref.width,height=_ref.height,elementsMargin=_ref.elementsMargin,topPadding=_ref.topPadding,leftPadding=_ref.leftPadding,rightPadding=_ref.rightPadding,elementsWidth=_ref.elementsWidth,elementsHeight=_ref.elementsHeight,radius=_ref.radius,itemsAmount=_ref.itemsAmount,onPress=_ref.onPress;return new _pixi_storybook_renderer__WEBPACK_IMPORTED_MODULE_1__.M4({context,init:function init(view){for(var viewGraphics=(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(0,0,width,height,radius).fill(bgColor),items=[],_loop=function _loop(i){var button=new _FancyButton__WEBPACK_IMPORTED_MODULE_3__.w({defaultView:(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(0,0,elementsWidth,elementsHeight,radius).fill(10871373),hoverView:(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(0,0,elementsWidth,elementsHeight,radius).fill(16695856),pressedView:(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(0,0,elementsWidth,elementsHeight,radius).fill(16670792),text:new pixi_js__WEBPACK_IMPORTED_MODULE_0__.EYj({text:i+1,style:_objectSpread(_objectSpread({},_utils_helpers_styles__WEBPACK_IMPORTED_MODULE_4__.a),{},{fontSize:28,fill:fontColor})})});button.anchor.set(0),button.onPress.connect((function(){return onPress(i+1)})),items.push(button)},i=0;i<itemsAmount;i++)_loop(i);var list=new _List__WEBPACK_IMPORTED_MODULE_5__.B({elementsMargin,topPadding,leftPadding,rightPadding,type});viewGraphics.addChild(list),view.addChild(viewGraphics),items.forEach((function(item){return list.addChild(item)}))},resize:function resize(view){return(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_6__.E)(view.children[0])}})};const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:"import { Graphics, Text } from 'pixi.js';\nimport { PixiStory, StoryFn } from '@pixi/storybook-renderer';\nimport { FancyButton } from '../../FancyButton';\nimport { List } from '../../List';\nimport { centerElement } from '../../utils/helpers/resize';\nimport { defaultTextStyle } from '../../utils/helpers/styles';\nimport { argTypes, getDefaultArgs } from '../utils/argTypes';\nimport { action } from '@storybook/addon-actions';\n\nconst args = {\n    type: [null, 'horizontal', 'vertical'],\n    fontColor: '#000000',\n    bgColor: '#f5e3a9',\n    width: 271,\n    height: 270,\n    radius: 20,\n    elementsMargin: 10,\n    topPadding: 20,\n    leftPadding: 20,\n    rightPadding: 20,\n    elementsWidth: 70,\n    elementsHeight: 70,\n    itemsAmount: 9,\n    onPress: action('Button pressed'),\n};\n\nexport const UseGraphics: StoryFn<typeof args & { type: 'horizontal' | 'vertical' }> = (\n    {\n        type,\n        fontColor,\n        bgColor,\n        width,\n        height,\n        elementsMargin,\n        topPadding,\n        leftPadding,\n        rightPadding,\n        elementsWidth,\n        elementsHeight,\n        radius,\n        itemsAmount,\n        onPress,\n    },\n    context,\n) =>\n    new PixiStory<typeof args>({\n        context,\n        init: (view) =>\n        {\n            const viewGraphics = new Graphics()\n                .roundRect(0, 0, width, height, radius)\n                .fill(bgColor);\n\n            const items = [];\n\n            for (let i = 0; i < itemsAmount; i++)\n            {\n                const button = new FancyButton({\n                    defaultView: new Graphics()\n                        .roundRect(0, 0, elementsWidth, elementsHeight, radius)\n                        .fill(0xa5e24d),\n                    hoverView: new Graphics()\n                        .roundRect(0, 0, elementsWidth, elementsHeight, radius)\n                        .fill(0xfec230),\n                    pressedView: new Graphics()\n                        .roundRect(0, 0, elementsWidth, elementsHeight, radius)\n                        .fill(0xfe6048),\n                    text: new Text({\n                        text: i + 1,\n                        style: {\n                            ...defaultTextStyle,\n                            fontSize: 28,\n                            fill: fontColor,\n                        },\n                    }),\n                });\n\n                button.anchor.set(0);\n                button.onPress.connect(() => onPress(i + 1));\n\n                items.push(button);\n            }\n\n            // Component usage !!!\n            const list = new List({\n                elementsMargin,\n                topPadding,\n                leftPadding,\n                rightPadding,\n                type,\n            });\n\n            viewGraphics.addChild(list);\n            view.addChild(viewGraphics);\n            items.forEach((item) => list.addChild(item));\n        },\n        resize: (view) => centerElement(view.children[0]),\n    });\n\nexport default {\n    title: 'Components/List/Use Graphics',\n    argTypes: argTypes(args),\n    args: getDefaultArgs(args),\n};\n",locationsMap:{"use-graphics":{startLoc:{col:87,line:27},endLoc:{col:6,line:98},startBody:{col:87,line:27},endBody:{col:6,line:98}}}}},title:"Components/List/Use Graphics",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__.U)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__.p)(args)},__namedExportsOrder=["UseGraphics"]},"./src/List.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,_toPropertyKey(o.key),o)}}function _callSuper(t,o,e){return o=_getPrototypeOf(o),function _possibleConstructorReturn(t,e){if(e&&("object"==_typeof(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(t)}(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],_getPrototypeOf(t).constructor):o.apply(t,e))}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},_getPrototypeOf(t)}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},_setPrototypeOf(t,e)}function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:i+""}__webpack_require__.d(__webpack_exports__,{B:()=>List});var List=function(_ref){function List(options){var _options$items,_this;return function _classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}(this,List),function _defineProperty(e,r,t){return(r=_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}(_this=_callSuper(this,List),"children",[]),options&&_this.init(options),null==options||null===(_options$items=options.items)||void 0===_options$items||_options$items.forEach((function(item){return _this.addChild(item)})),_this.on("added",(function(){return _this.arrangeChildren()})),_this.on("childAdded",(function(){return _this.arrangeChildren()})),_this}return function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&_setPrototypeOf(t,e)}(List,_ref),function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}(List,[{key:"init",value:function init(options){var _this2=this;this.options=options,null!=options&&options.type&&(this.type=options.type),null!=options&&options.children&&options.children.forEach((function(child){return _this2.addChild(child)}))}},{key:"type",get:function get(){return this._type},set:function set(type){this._type=type,this.arrangeChildren()}},{key:"elementsMargin",get:function get(){var _this$options$element,_this$options;return null!==(_this$options$element=null===(_this$options=this.options)||void 0===_this$options?void 0:_this$options.elementsMargin)&&void 0!==_this$options$element?_this$options$element:0},set:function set(margin){if(!this.options)throw new Error("List has not been initiated!");this.options.elementsMargin=margin,this.arrangeChildren()}},{key:"padding",get:function get(){var _this$options$padding,_this$options2;return null!==(_this$options$padding=null===(_this$options2=this.options)||void 0===_this$options2?void 0:_this$options2.padding)&&void 0!==_this$options$padding?_this$options$padding:0},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.padding=padding,this.options.vertPadding=padding,this.options.horPadding=padding,this.options.leftPadding=padding,this.options.rightPadding=padding,this.options.topPadding=padding,this.options.bottomPadding=padding,this.arrangeChildren()}},{key:"vertPadding",get:function get(){var _ref2,_this$options$vertPad,_this$options3;return null!==(_ref2=null!==(_this$options$vertPad=null===(_this$options3=this.options)||void 0===_this$options3?void 0:_this$options3.vertPadding)&&void 0!==_this$options$vertPad?_this$options$vertPad:this.padding)&&void 0!==_ref2?_ref2:0},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.vertPadding=padding,this.options.topPadding=padding,this.options.bottomPadding=padding,this.arrangeChildren()}},{key:"horPadding",get:function get(){var _ref3,_this$options$horPadd,_this$options4;return null!==(_ref3=null!==(_this$options$horPadd=null===(_this$options4=this.options)||void 0===_this$options4?void 0:_this$options4.horPadding)&&void 0!==_this$options$horPadd?_this$options$horPadd:this.padding)&&void 0!==_ref3?_ref3:0},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.horPadding=padding,this.options.leftPadding=padding,this.options.rightPadding=padding,this.arrangeChildren()}},{key:"leftPadding",get:function get(){var _this$options$leftPad,_this$options5;return null!==(_this$options$leftPad=null===(_this$options5=this.options)||void 0===_this$options5?void 0:_this$options5.leftPadding)&&void 0!==_this$options$leftPad?_this$options$leftPad:this.horPadding},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.leftPadding=padding,this.arrangeChildren()}},{key:"rightPadding",get:function get(){var _this$options$rightPa,_this$options6;return null!==(_this$options$rightPa=null===(_this$options6=this.options)||void 0===_this$options6?void 0:_this$options6.rightPadding)&&void 0!==_this$options$rightPa?_this$options$rightPa:this.horPadding},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.rightPadding=padding,this.arrangeChildren()}},{key:"topPadding",get:function get(){var _this$options$topPadd,_this$options7;return null!==(_this$options$topPadd=null===(_this$options7=this.options)||void 0===_this$options7?void 0:_this$options7.topPadding)&&void 0!==_this$options$topPadd?_this$options$topPadd:this.vertPadding},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.topPadding=padding,this.arrangeChildren()}},{key:"bottomPadding",get:function get(){var _this$options$bottomP,_this$options8;return null!==(_this$options$bottomP=null===(_this$options8=this.options)||void 0===_this$options8?void 0:_this$options8.bottomPadding)&&void 0!==_this$options$bottomP?_this$options$bottomP:this.vertPadding},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.bottomPadding=padding,this.arrangeChildren()}},{key:"arrangeChildren",value:function arrangeChildren(){var _this$options$element2,_this$options9,_this$parent,_this3=this,maxHeight=0,x=this.leftPadding,y=this.topPadding,elementsMargin=null!==(_this$options$element2=null===(_this$options9=this.options)||void 0===_this$options9?void 0:_this$options9.elementsMargin)&&void 0!==_this$options$element2?_this$options$element2:0,maxWidth=null===(_this$parent=this.parent)||void 0===_this$parent?void 0:_this$parent.width;this.rightPadding&&(maxWidth-=this.rightPadding),this.children.forEach((function(child,id){switch(_this3.type){case"vertical":child.y=y,child.x=x,y+=elementsMargin+child.height;break;case"horizontal":child.x=x,child.y=y,x+=elementsMargin+child.width;break;default:child.x=x,child.y=y,child.x+child.width>maxWidth&&id>0&&(y+=elementsMargin+maxHeight,x=_this3.leftPadding,child.x=x,child.y=y,maxHeight=0),maxHeight=Math.max(maxHeight,child.height),x+=elementsMargin+child.width}}))}},{key:"removeItem",value:function removeItem(itemID){var child=this.children[itemID];child&&(this.removeChild(child),this.arrangeChildren())}}])}(__webpack_require__("./node_modules/pixi.js/lib/index.mjs").mcf)},"./src/utils/helpers/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{a:()=>defaultTextStyle});var defaultTextStyle={fill:16777215,fontSize:42,fontWeight:"bold",dropShadow:{color:0,alpha:.5,distance:0,blur:3,angle:0}}},"./node_modules/global/window.js":(module,__unused_webpack_exports,__webpack_require__)=>{var win;win="undefined"!=typeof window?window:void 0!==__webpack_require__.g?__webpack_require__.g:"undefined"!=typeof self?self:{},module.exports=win}}]);