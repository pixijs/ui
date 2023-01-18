"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[41],{"./src/stories/slider/SliderGraphics.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Single:()=>Single,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/graphics/lib/index.mjs"),_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs"),_Layout__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/Layout.ts"),_utils_argTypes__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/stories/utils/argTypes.ts"),_Slider__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/Slider.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/utils/helpers/resize.ts"),args={meshColor:"#35b600",fillColor:"#ff4545",borderColor:"#FFFFFF",backgroundColor:"#F1D583",fontColor:"#FFFFFF",min:0,max:100,value:50,width:450,height:35,radius:25,fontSize:20,border:3,handleBorder:3,showValue:!0,onChange:(0,_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_1__.aD)("Slider changed")},Single=function Single(_ref,context){var min=_ref.min,max=_ref.max,value=_ref.value,meshColor=_ref.meshColor,borderColor=_ref.borderColor,backgroundColor=_ref.backgroundColor,fillColor=_ref.fillColor,handleBorder=_ref.handleBorder,width=_ref.width,height=_ref.height,radius=_ref.radius,fontSize=_ref.fontSize,fontColor=_ref.fontColor,border=_ref.border,onChange=_ref.onChange,showValue=_ref.showValue;context.parameters.pixi.app.renderer.events.rootBoundary.moveOnAll=!0;var view=new _Layout__WEBPACK_IMPORTED_MODULE_2__.Ar({type:"vertical",elementsMargin:10});meshColor=Number(meshColor.replace("#","0x")),fillColor=Number(fillColor.replace("#","0x")),borderColor=Number(borderColor.replace("#","0x")),backgroundColor=Number(backgroundColor.replace("#","0x"));var bg=(new _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__.TC).beginFill(borderColor).drawRoundedRect(0,0,width,height,radius).beginFill(backgroundColor).drawRoundedRect(border,border,width-2*border,height-2*border,radius),fill=(new _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__.TC).beginFill(borderColor).drawRoundedRect(0,0,width,height,radius).beginFill(fillColor).drawRoundedRect(border,border,width-2*border,height-2*border,radius),slider=(new _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__.TC).beginFill(borderColor).drawCircle(0,0,20+handleBorder).beginFill(meshColor).drawCircle(0,0,20).endFill(),singleSlider=new _Slider__WEBPACK_IMPORTED_MODULE_3__.i({bg,fill,slider,min,max,value,valueTextStyle:{fill:fontColor,fontSize},showValue});return singleSlider.onChange.connect((function(value){onChange("Slider changed > ".concat(value))})),view.addChild(singleSlider),{view,resize:function resize(){return(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_4__.w)(view)}}};const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:"import { Graphics } from '@pixi/graphics';\nimport { action } from '@storybook/addon-actions';\nimport { Layout } from '../../Layout';\nimport { argTypes, getDefaultArgs } from '../utils/argTypes';\nimport { Slider } from '../../Slider';\nimport { centerElement } from '../../utils/helpers/resize';\nimport type { StoryFn } from '@storybook/types';\n\nconst args = {\n    meshColor: '#35b600',\n    fillColor: '#ff4545',\n    borderColor: '#FFFFFF',\n    backgroundColor: '#F1D583',\n    fontColor: '#FFFFFF',\n    min: 0,\n    max: 100,\n    value: 50,\n    width: 450,\n    height: 35,\n    radius: 25,\n    fontSize: 20,\n    border: 3,\n    handleBorder: 3,\n    showValue: true,\n    onChange: action('Slider changed'),\n};\n\nexport const Single: StoryFn = ({\n    min,\n    max,\n    value,\n    meshColor,\n    borderColor,\n    backgroundColor,\n    fillColor,\n    handleBorder,\n    width,\n    height,\n    radius,\n    fontSize,\n    fontColor,\n    border,\n    onChange,\n    showValue,\n}: any, context) =>\n{\n    const { app } = context.parameters.pixi;\n\n    app.renderer.events.rootBoundary.moveOnAll = true;\n\n    const view = new Layout({ type: 'vertical', elementsMargin: 10 });\n\n    meshColor = Number(meshColor.replace('#', '0x'));\n    fillColor = Number(fillColor.replace('#', '0x'));\n    borderColor = Number(borderColor.replace('#', '0x'));\n    backgroundColor = Number(backgroundColor.replace('#', '0x'));\n\n    const bg = new Graphics()\n        .beginFill(borderColor)\n        .drawRoundedRect(0, 0, width, height, radius)\n        .beginFill(backgroundColor)\n        .drawRoundedRect(\n            border,\n            border,\n            width - (border * 2),\n            height - (border * 2),\n            radius,\n        );\n\n    const fill = new Graphics()\n        .beginFill(borderColor)\n        .drawRoundedRect(0, 0, width, height, radius)\n        .beginFill(fillColor)\n        .drawRoundedRect(\n            border,\n            border,\n            width - (border * 2),\n            height - (border * 2),\n            radius,\n        );\n\n    const slider = new Graphics()\n        .beginFill(borderColor)\n        .drawCircle(0, 0, 20 + handleBorder)\n        .beginFill(meshColor)\n        .drawCircle(0, 0, 20)\n        .endFill();\n\n    const singleSlider = new Slider({\n        bg,\n        fill,\n        slider,\n        min,\n        max,\n        value,\n        valueTextStyle: {\n            fill: fontColor,\n            fontSize,\n        },\n        showValue,\n    });\n\n    singleSlider.onChange.connect((value) =>\n    {\n        onChange(`Slider changed > ${value}`);\n    });\n\n    view.addChild(singleSlider);\n\n    return {\n        view,\n        resize: () => centerElement(view),\n    };\n};\n\nexport default {\n    title: 'Components/Slider/Graphics',\n    argTypes: argTypes(args),\n    args: getDefaultArgs(args),\n};\n",locationsMap:{single:{startLoc:{col:31,line:28},endLoc:{col:1,line:114},startBody:{col:31,line:28},endBody:{col:1,line:114}}}}},title:"Components/Slider/Graphics",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_5__.P)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_5__.V)(args)};var __namedExportsOrder=["Single"]},"./src/Slider.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{i:()=>Slider});var _pixi_core__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/core/lib/index.mjs"),_pixi_display__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@pixi/display/lib/index.mjs"),_pixi_graphics__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@pixi/graphics/lib/index.mjs"),_pixi_sprite__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@pixi/sprite/lib/index.mjs"),_pixi_text__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@pixi/text/lib/index.mjs"),typed_signals__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/typed-signals/dist/index.js"),_utils_helpers_hitbox__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/utils/helpers/hitbox.ts"),_utils_helpers_view__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/utils/helpers/view.ts");function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,_toPropertyKey(descriptor.key),descriptor)}}function _setPrototypeOf(o,p){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){return o.__proto__=p,o},_setPrototypeOf(o,p)}function _createSuper(Derived){var hasNativeReflectConstruct=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return _possibleConstructorReturn(this,result)}}function _possibleConstructorReturn(self,call){if(call&&("object"===_typeof(call)||"function"==typeof call))return call;if(void 0!==call)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(self)}function _assertThisInitialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}function _getPrototypeOf(o){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)},_getPrototypeOf(o)}function _defineProperty(obj,key,value){return(key=_toPropertyKey(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}var Slider=function(_Container){!function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),Object.defineProperty(subClass,"prototype",{writable:!1}),superClass&&_setPrototypeOf(subClass,superClass)}(Slider,_Container);var _super=_createSuper(Slider);function Slider(options){var _this;!function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,Slider),_defineProperty(_assertThisInitialized(_this=_super.call(this)),"dragging",0),_defineProperty(_assertThisInitialized(_this),"percent",100),_defineProperty(_assertThisInitialized(_this),"value",0),_defineProperty(_assertThisInitialized(_this),"onChange",new typed_signals__WEBPACK_IMPORTED_MODULE_5__.MZ),_this.options=options;var bg=(0,_utils_helpers_view__WEBPACK_IMPORTED_MODULE_6__.X)(options.bg);if(_this.bg=new _pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2,_this.bg.addChild(bg),_this.addChild(_this.bg),options.fill){var _options$fillOffset$x,_options$fillOffset,_options$fillOffset$y,_options$fillOffset2,fill=(0,_utils_helpers_view__WEBPACK_IMPORTED_MODULE_6__.X)(options.fill);_this.fill=new _pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2,_this.fill.addChild(fill);var offsetX=null!==(_options$fillOffset$x=null===(_options$fillOffset=options.fillOffset)||void 0===_options$fillOffset?void 0:_options$fillOffset.x)&&void 0!==_options$fillOffset$x?_options$fillOffset$x:0,offsetY=null!==(_options$fillOffset$y=null===(_options$fillOffset2=options.fillOffset)||void 0===_options$fillOffset2?void 0:_options$fillOffset2.y)&&void 0!==_options$fillOffset$y?_options$fillOffset$y:0;_this.fill.x=(_this.bg.width-_this.fill.width)/2+offsetX,_this.fill.y=(_this.bg.height-_this.fill.height)/2+offsetY,_this.fillMask=new _pixi_graphics__WEBPACK_IMPORTED_MODULE_2__.TC,_this.fill.addChild(_this.fillMask),_this.fill.mask=_this.fillMask,_this.addChild(_this.fill)}var slider=(0,_utils_helpers_view__WEBPACK_IMPORTED_MODULE_6__.X)(options.slider);return slider.x=slider.width/2,_this.slider=new _pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2,_this.slider.addChild(slider),slider instanceof _pixi_sprite__WEBPACK_IMPORTED_MODULE_3__.j&&slider.anchor.set(.5),_this.slider.y=_this.bg.height/2,_this.addChild(_this.slider),options.showValue&&(_this.valueText=new _pixi_text__WEBPACK_IMPORTED_MODULE_4__.xv("",options.valueTextStyle||{fill:16777215}),_this.valueText.anchor.set(.5),_this.addChild(_this.valueText)),_this.makeScrollable(),_this.validateSettings(),_this.update(),_this}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(Slider,[{key:"validateSettings",value:function validateSettings(){var _ref,_options$value,options=this.options;options.min||(options.min=0),options.max||(options.max=100),options.value<options.min&&(options.value=options.min),options.value>options.max&&(options.value=options.max),this.value=null!==(_ref=null!==(_options$value=options.value)&&void 0!==_options$value?_options$value:options.min)&&void 0!==_ref?_ref:0,this.percent=100*this.value/options.max;var scale=options.max-options.min,scaledVal=this.value-options.min;this.percent=100*scaledVal/scale}},{key:"makeScrollable",value:function makeScrollable(){this.interactive=!0,this.slider.interactive=!0,this.bg.interactive=!0;var onSetByClick=this.onSetByClick,onDragStart=this.onDragStart,onDragMove=this.onDragMove,onDragEnd=this.onDragEnd;this.slider.on("pointerdown",onDragStart,this).on("pointermove",onDragMove,this).on("pointerup",onDragEnd,this).on("pointerupoutside",onDragEnd,this),this.bg.on("pointerdown",onSetByClick,this),this.on("pointerupoutside",onDragEnd,this),(0,_utils_helpers_hitbox__WEBPACK_IMPORTED_MODULE_7__.h)(this.fill,this.valueText)}},{key:"onSetByClick",value:function onSetByClick(event){var _this$onChange,pos=event.currentTarget.parent.worldTransform.applyInverse(event.global).x-this.slider.width/2;pos<0&&(pos=0),pos<0&&(pos=0);var maxPos=this.bg.width-this.slider.width;pos>maxPos&&(pos=maxPos),this.percent=Math.round(pos/maxPos*100),this.value=this.options.min+Math.round((this.options.max-this.options.min)/100*this.percent),this.update(),null===(_this$onChange=this.onChange)||void 0===_this$onChange||_this$onChange.emit(this.value)}},{key:"onDragStart",value:function onDragStart(event){var obj=event.currentTarget;obj.dragData=event,this.dragging=1,obj.dragPointerStart=obj.parent.worldTransform.applyInverse(event.global),obj.dragObjStart=new _pixi_core__WEBPACK_IMPORTED_MODULE_0__.E9,obj.dragObjStart.copyFrom(obj.position),obj.dragGlobalStart=new _pixi_core__WEBPACK_IMPORTED_MODULE_0__.E9,obj.dragGlobalStart.copyFrom(event.data.global)}},{key:"onDragMove",value:function onDragMove(event){var obj=event.currentTarget;if(this.dragging){var _obj$dragGlobalStart,_obj$dragGlobalStart2,data=obj.dragData;if(1===this.dragging)Math.abs(data.global.x-(null===(_obj$dragGlobalStart=obj.dragGlobalStart)||void 0===_obj$dragGlobalStart?void 0:_obj$dragGlobalStart.x))+Math.abs(data.global.y-(null===(_obj$dragGlobalStart2=obj.dragGlobalStart)||void 0===_obj$dragGlobalStart2?void 0:_obj$dragGlobalStart2.y))>=3&&(this.dragging=2);if(2===this.dragging){var dragPointerEnd=obj.parent.worldTransform.applyInverse(data.global),pos=obj.dragObjStart.x+(dragPointerEnd.x-obj.dragPointerStart.x);pos<0&&(pos=0);var maxPos=this.bg.width-this.slider.width;pos>maxPos&&(pos=maxPos),this.percent=Math.round(pos/maxPos*100),this.value=this.options.min+Math.round((this.options.max-this.options.min)/100*this.percent),this.update()}}}},{key:"onDragEnd",value:function onDragEnd(){var _this$onChange2;this.dragging&&(this.dragging=0,null===(_this$onChange2=this.onChange)||void 0===_this$onChange2||_this$onChange2.emit(this.value))}},{key:"update",value:function update(pos){var _this$onChange3,position=null!=pos?pos:(this.bg.width-this.slider.width)/100*this.percent;this.slider.x=position;var endPoint=this.bg.width/100*this.percent;if(this.fillMask&&this.fillMask.clear().lineStyle(0).beginFill(16777215).drawRect(0,0,endPoint-0,this.fill.height),this.options.showValue){var _this$options$valueTe,_this$options$valueTe2,_this$options$valueTe3,_this$options$valueTe4;this.valueText.text=this.value;var sliderPosX=this.slider.x+this.slider.width/2,sliderPosY=this.slider.y;this.valueText.x=sliderPosX+(null!==(_this$options$valueTe=null===(_this$options$valueTe2=this.options.valueTextOffset)||void 0===_this$options$valueTe2?void 0:_this$options$valueTe2.x)&&void 0!==_this$options$valueTe?_this$options$valueTe:0),this.valueText.y=sliderPosY+(null!==(_this$options$valueTe3=null===(_this$options$valueTe4=this.options.valueTextOffset)||void 0===_this$options$valueTe4?void 0:_this$options$valueTe4.y)&&void 0!==_this$options$valueTe3?_this$options$valueTe3:0)}null===(_this$onChange3=this.onChange)||void 0===_this$onChange3||_this$onChange3.emit(this.value)}}]),Slider}(_pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2)},"./src/utils/helpers/hitbox.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{h:()=>removeHitBox});var _pixi_core__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/core/lib/index.mjs");function removeHitBox(){for(var _len=arguments.length,obj=new Array(_len),_key=0;_key<_len;_key++)obj[_key]=arguments[_key];obj.forEach((function(o){return o&&(o.hitArea=new _pixi_core__WEBPACK_IMPORTED_MODULE_0__.Ae)}))}}}]);