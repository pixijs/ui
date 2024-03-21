"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[1105],{"./src/stories/slider/SliderGraphics.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Single:()=>Single,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var pixi_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/pixi.js/lib/index.mjs"),_pixi_storybook_renderer__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@pixi/storybook-renderer/dist/index.mjs"),_List__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/List.ts"),_Slider__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/Slider.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/utils/helpers/resize.ts"),_utils_argTypes__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/stories/utils/argTypes.ts"),args={meshColor:"#a5e34d",fillColor:"#00b1dd",borderColor:"#FFFFFF",backgroundColor:"#fe6048",fontColor:"#FFFFFF",min:0,max:100,value:50,width:450,height:35,radius:25,fontSize:20,border:3,handleBorder:3,showValue:!0,onChange:(0,__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs").XI)("Slider")},Single=function Single(_ref,context){var min=_ref.min,max=_ref.max,value=_ref.value,meshColor=_ref.meshColor,borderColor=_ref.borderColor,backgroundColor=_ref.backgroundColor,fillColor=_ref.fillColor,handleBorder=_ref.handleBorder,width=_ref.width,height=_ref.height,radius=_ref.radius,fontSize=_ref.fontSize,fontColor=_ref.fontColor,border=_ref.border,onChange=_ref.onChange,showValue=_ref.showValue;return new _pixi_storybook_renderer__WEBPACK_IMPORTED_MODULE_1__.M4({context,init:function init(view){var list=new _List__WEBPACK_IMPORTED_MODULE_3__.B({type:"vertical",elementsMargin:10}),bg=(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(0,0,width,height,radius).fill(borderColor).roundRect(border,border,width-2*border,height-2*border,radius).fill(backgroundColor),fill=(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(0,0,width,height,radius).fill(borderColor).roundRect(border,border,width-2*border,height-2*border,radius).fill(fillColor),slider=(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).circle(0,0,20+handleBorder).fill(borderColor).circle(0,0,20).fill(meshColor),singleSlider=new _Slider__WEBPACK_IMPORTED_MODULE_4__.A({bg,fill,slider,min,max,value,valueTextStyle:{fill:fontColor,fontSize},showValue});singleSlider.value=value,singleSlider.onUpdate.connect((function(value){return onChange("".concat(value))})),list.addChild(singleSlider),view.addChild(list)},resize:function resize(view){return(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_5__.E)(view.children[0])}})};const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:"import { Graphics } from 'pixi.js';\nimport { PixiStory, StoryFn } from '@pixi/storybook-renderer';\nimport { List } from '../../List';\nimport { Slider } from '../../Slider';\nimport { centerElement } from '../../utils/helpers/resize';\nimport { argTypes, getDefaultArgs } from '../utils/argTypes';\nimport { action } from '@storybook/addon-actions';\n\nconst args = {\n    meshColor: '#a5e34d',\n    fillColor: '#00b1dd',\n    borderColor: '#FFFFFF',\n    backgroundColor: '#fe6048',\n    fontColor: '#FFFFFF',\n    min: 0,\n    max: 100,\n    value: 50,\n    width: 450,\n    height: 35,\n    radius: 25,\n    fontSize: 20,\n    border: 3,\n    handleBorder: 3,\n    showValue: true,\n    onChange: action('Slider')\n};\n\nexport const Single: StoryFn<typeof args> = ({\n    min,\n    max,\n    value,\n    meshColor,\n    borderColor,\n    backgroundColor,\n    fillColor,\n    handleBorder,\n    width,\n    height,\n    radius,\n    fontSize,\n    fontColor,\n    border,\n    onChange,\n    showValue,\n}, context) =>\n    new PixiStory<typeof args>({\n        context,\n        init: (view) =>\n        {\n            const list = new List({ type: 'vertical', elementsMargin: 10 });\n            const bg = new Graphics()\n                .roundRect(0, 0, width, height, radius)\n                .fill(borderColor)\n                .roundRect(border, border, width - (border * 2), height - (border * 2), radius)\n                .fill(backgroundColor);\n\n            const fill = new Graphics()\n                .roundRect(0, 0, width, height, radius)\n                .fill(borderColor)\n                .roundRect(border, border, width - (border * 2), height - (border * 2), radius)\n                .fill(fillColor);\n\n            const slider = new Graphics()\n                .circle(0, 0, 20 + handleBorder)\n                .fill(borderColor)\n                .circle(0, 0, 20)\n                .fill(meshColor);\n\n            // Component usage\n            const singleSlider = new Slider({\n                bg,\n                fill,\n                slider,\n                min,\n                max,\n                value,\n                valueTextStyle: {\n                    fill: fontColor,\n                    fontSize\n                },\n                showValue\n            });\n\n            singleSlider.value = value;\n\n            singleSlider.onUpdate.connect((value) => onChange(`${value}`));\n\n            list.addChild(singleSlider);\n\n            view.addChild(list);\n        },\n        resize: (view) => centerElement(view.children[0])\n    });\n\nexport default {\n    title: 'Components/Slider/Graphics',\n    argTypes: argTypes(args),\n    args: getDefaultArgs(args)\n};\n",locationsMap:{single:{startLoc:{col:44,line:28},endLoc:{col:6,line:93},startBody:{col:44,line:28},endBody:{col:6,line:93}}}}},title:"Components/Slider/Graphics",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_6__.U)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_6__.p)(args)},__namedExportsOrder=["Single"]},"./src/Slider.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>Slider});var typed_signals__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/typed-signals/dist/index.js");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,_toPropertyKey(descriptor.key),descriptor)}}function _get(){return _get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function _get(target,property,receiver){var base=_superPropBase(target,property);if(base){var desc=Object.getOwnPropertyDescriptor(base,property);return desc.get?desc.get.call(arguments.length<3?target:receiver):desc.value}},_get.apply(this,arguments)}function set(target,property,value,receiver){return set="undefined"!=typeof Reflect&&Reflect.set?Reflect.set:function set(target,property,value,receiver){var desc,base=_superPropBase(target,property);if(base){if((desc=Object.getOwnPropertyDescriptor(base,property)).set)return desc.set.call(receiver,value),!0;if(!desc.writable)return!1}if(desc=Object.getOwnPropertyDescriptor(receiver,property)){if(!desc.writable)return!1;desc.value=value,Object.defineProperty(receiver,property,desc)}else _defineProperty(receiver,property,value);return!0},set(target,property,value,receiver)}function _set(target,property,value,receiver,isStrict){if(!set(target,property,value,receiver||target)&&isStrict)throw new TypeError("failed to set property");return value}function _superPropBase(object,property){for(;!Object.prototype.hasOwnProperty.call(object,property)&&null!==(object=_getPrototypeOf(object)););return object}function _setPrototypeOf(o,p){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){return o.__proto__=p,o},_setPrototypeOf(o,p)}function _createSuper(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct();return function _createSuperInternal(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return function _possibleConstructorReturn(self,call){if(call&&("object"===_typeof(call)||"function"==typeof call))return call;if(void 0!==call)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(self)}(this,result)}}function _assertThisInitialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function _getPrototypeOf(o){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)},_getPrototypeOf(o)}function _defineProperty(obj,key,value){return(key=_toPropertyKey(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:String(i)}var Slider=function(_SliderBase){!function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),Object.defineProperty(subClass,"prototype",{writable:!1}),superClass&&_setPrototypeOf(subClass,superClass)}(Slider,_SliderBase);var _super=_createSuper(Slider);function Slider(options){var _options$value,_this;return function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,Slider),_this=_super.call(this,function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}({slider1:options.slider,value1:options.value},options)),_defineProperty(_assertThisInitialized(_this),"onUpdate",new typed_signals__WEBPACK_IMPORTED_MODULE_0__.HN),_defineProperty(_assertThisInitialized(_this),"onChange",new typed_signals__WEBPACK_IMPORTED_MODULE_0__.HN),_this.sliderOptions=options,_this.value=null!==(_options$value=options.value)&&void 0!==_options$value?_options$value:_this.min,_this.updateSlider(),_this}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(Slider,[{key:"value",get:function get(){return this._value1},set:function set(value){var _this$onUpdate;value!==this._value1&&(value<this.min&&(value=this.min),value>this.max&&(value=this.max),this._value1=value,this.updateSlider(),null===(_this$onUpdate=this.onUpdate)||void 0===_this$onUpdate||_this$onUpdate.emit(this.value))}},{key:"max",get:function get(){return _get(_getPrototypeOf(Slider.prototype),"max",this)},set:function set(value){_set(_getPrototypeOf(Slider.prototype),"max",value,this,!0),this.updateSlider()}},{key:"min",get:function get(){return _get(_getPrototypeOf(Slider.prototype),"min",this)},set:function set(value){_set(_getPrototypeOf(Slider.prototype),"min",value,this,!0),this.updateSlider()}},{key:"slider",set:function set(value){this.slider1=value,this.updateSlider()}},{key:"update",value:function update(event){var _this$bg;if(_get(_getPrototypeOf(Slider.prototype),"update",this).call(this,event),this.dragging){var x=event.currentTarget.parent.worldTransform.applyInverse(event.global).x;this.progress=this.validate(x/(null===(_this$bg=this.bg)||void 0===_this$bg?void 0:_this$bg.width)*100),this.value=this.min+(this.max-this.min)/100*this.progress}}},{key:"change",value:function change(){var _this$onChange;null===(_this$onChange=this.onChange)||void 0===_this$onChange||_this$onChange.emit(this.value)}},{key:"updateSlider",value:function updateSlider(){var _this$value,_this$bg2,_this$bg3,_this$sliderOptions;if(this.progress=((null!==(_this$value=this.value)&&void 0!==_this$value?_this$value:this.min)-this.min)/(this.max-this.min)*100,this._slider1.x=(null===(_this$bg2=this.bg)||void 0===_this$bg2?void 0:_this$bg2.width)/100*this.progress-this._slider1.width/2,this._slider1.y=(null===(_this$bg3=this.bg)||void 0===_this$bg3?void 0:_this$bg3.height)/2,null!==(_this$sliderOptions=this.sliderOptions)&&void 0!==_this$sliderOptions&&_this$sliderOptions.showValue){var _this$sliderOptions$v,_this$sliderOptions$v2,_this$sliderOptions$v3,_this$sliderOptions$v4;this.value1Text.text="".concat(Math.round(this.value));var sliderPosX=this._slider1.x+this._slider1.width/2,sliderPosY=this._slider1.y;this.value1Text.x=sliderPosX+(null!==(_this$sliderOptions$v=null===(_this$sliderOptions$v2=this.sliderOptions.valueTextOffset)||void 0===_this$sliderOptions$v2?void 0:_this$sliderOptions$v2.x)&&void 0!==_this$sliderOptions$v?_this$sliderOptions$v:0),this.value1Text.y=sliderPosY+(null!==(_this$sliderOptions$v3=null===(_this$sliderOptions$v4=this.sliderOptions.valueTextOffset)||void 0===_this$sliderOptions$v4?void 0:_this$sliderOptions$v4.y)&&void 0!==_this$sliderOptions$v3?_this$sliderOptions$v3:0)}}},{key:"width",get:function get(){return _get(_getPrototypeOf(Slider.prototype),"width",this)},set:function set(value){_set(_getPrototypeOf(Slider.prototype),"width",value,this,!0),this.updateSlider()}},{key:"height",get:function get(){return _get(_getPrototypeOf(Slider.prototype),"height",this)},set:function set(value){_set(_getPrototypeOf(Slider.prototype),"height",value,this,!0),this.updateSlider()}}]),Slider}(__webpack_require__("./src/SliderBase.ts").t)}}]);