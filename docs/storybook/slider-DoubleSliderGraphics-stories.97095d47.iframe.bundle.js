"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[234],{"./src/stories/slider/DoubleSliderGraphics.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Double:()=>Double,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/graphics/lib/index.mjs"),_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs"),_Layout__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/Layout.ts"),_utils_argTypes__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/stories/utils/argTypes.ts"),_DoubleSlider__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/DoubleSlider.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/utils/helpers/resize.ts"),args={meshColor:"#35b600",fillColor:"#ff4545",borderColor:"#FFFFFF",backgroundColor:"#F1D583",fontColor:"#FFFFFF",min:0,max:100,value1:15,value2:85,width:450,height:35,radius:25,fontSize:20,border:5,handleBorder:3,showValue:!0,onChange:(0,_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_1__.aD)("Slider changed")},Double=function Double(_ref){var min=_ref.min,max=_ref.max,value1=_ref.value1,value2=_ref.value2,meshColor=_ref.meshColor,borderColor=_ref.borderColor,backgroundColor=_ref.backgroundColor,fillColor=_ref.fillColor,width=_ref.width,height=_ref.height,radius=_ref.radius,fontSize=_ref.fontSize,fontColor=_ref.fontColor,border=_ref.border,handleBorder=_ref.handleBorder,showValue=_ref.showValue,onChange=_ref.onChange,view=new _Layout__WEBPACK_IMPORTED_MODULE_2__.Ar({type:"vertical",elementsMargin:10});meshColor=Number(meshColor.replace("#","0x")),fillColor=Number(fillColor.replace("#","0x")),borderColor=Number(borderColor.replace("#","0x")),backgroundColor=Number(backgroundColor.replace("#","0x"));var bg=(new _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__.TC).beginFill(borderColor).drawRoundedRect(0,0,width,height,radius).beginFill(backgroundColor).drawRoundedRect(border,border,width-2*border,height-2*border,radius),fill=(new _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__.TC).beginFill(borderColor).drawRoundedRect(0,0,width,height,radius).beginFill(fillColor).drawRoundedRect(border,border,width-2*border,height-2*border,radius),slider1=(new _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__.TC).beginFill(borderColor).drawCircle(0,0,20+handleBorder).beginFill(meshColor).drawCircle(0,0,20).endFill(),slider2=(new _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__.TC).beginFill(borderColor).drawCircle(0,0,20+handleBorder).beginFill(meshColor).drawCircle(0,0,20).endFill(),doubleSlider=new _DoubleSlider__WEBPACK_IMPORTED_MODULE_3__.D({bg,fill,slider1,slider2,min,max,value1,value2,valueTextStyle:{fill:fontColor,fontSize},showValue});return doubleSlider.onChange.connect((function(value1,value2){onChange("Slider changed > ".concat(value1," - ").concat(value2))})),view.addChild(doubleSlider),{view,resize:function resize(){return(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_4__.w)(view)}}};const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:"import { Graphics as PixiGraphics } from '@pixi/graphics';\nimport { action } from '@storybook/addon-actions';\nimport { Layout } from '../../Layout';\nimport { argTypes, getDefaultArgs } from '../utils/argTypes';\nimport { DoubleSlider } from '../../DoubleSlider';\nimport { centerElement } from '../../utils/helpers/resize';\n\nconst args = {\n    meshColor: '#35b600',\n    fillColor: '#ff4545',\n    borderColor: '#FFFFFF',\n    backgroundColor: '#F1D583',\n    fontColor: '#FFFFFF',\n    min: 0,\n    max: 100,\n    value1: 15,\n    value2: 85,\n    width: 450,\n    height: 35,\n    radius: 25,\n    fontSize: 20,\n    border: 5,\n    handleBorder: 3,\n    showValue: true,\n    onChange: action('Slider changed'),\n};\n\nexport const Double = ({\n    min,\n    max,\n    value1,\n    value2,\n    meshColor,\n    borderColor,\n    backgroundColor,\n    fillColor,\n    width,\n    height,\n    radius,\n    fontSize,\n    fontColor,\n    border,\n    handleBorder,\n    showValue,\n    onChange,\n}: any) =>\n{\n    const view = new Layout({ type: 'vertical', elementsMargin: 10 });\n\n    meshColor = Number(meshColor.replace('#', '0x'));\n    fillColor = Number(fillColor.replace('#', '0x'));\n    borderColor = Number(borderColor.replace('#', '0x'));\n    backgroundColor = Number(backgroundColor.replace('#', '0x'));\n\n    const bg = new PixiGraphics()\n        .beginFill(borderColor)\n        .drawRoundedRect(0, 0, width, height, radius)\n        .beginFill(backgroundColor)\n        .drawRoundedRect(\n            border,\n            border,\n            width - (border * 2),\n            height - (border * 2),\n            radius,\n        );\n\n    const fill = new PixiGraphics()\n        .beginFill(borderColor)\n        .drawRoundedRect(0, 0, width, height, radius)\n        .beginFill(fillColor)\n        .drawRoundedRect(\n            border,\n            border,\n            width - (border * 2),\n            height - (border * 2),\n            radius,\n        );\n\n    const slider1 = new PixiGraphics()\n        .beginFill(borderColor)\n        .drawCircle(0, 0, 20 + handleBorder)\n        .beginFill(meshColor)\n        .drawCircle(0, 0, 20)\n        .endFill();\n\n    const slider2 = new PixiGraphics()\n        .beginFill(borderColor)\n        .drawCircle(0, 0, 20 + handleBorder)\n        .beginFill(meshColor)\n        .drawCircle(0, 0, 20)\n        .endFill();\n\n    const doubleSlider = new DoubleSlider({\n        bg,\n        fill,\n        slider1,\n        slider2,\n        min,\n        max,\n        value1,\n        value2,\n        valueTextStyle: {\n            fill: fontColor,\n            fontSize,\n        },\n        showValue,\n    });\n\n    doubleSlider.onChange.connect((value1, value2) =>\n    {\n        onChange(`Slider changed > ${value1} - ${value2}`);\n    });\n\n    view.addChild(doubleSlider);\n\n    return { view, resize: () => centerElement(view) };\n};\n\nexport default {\n    title: 'UI components/Slider/Graphics',\n    argTypes: argTypes(args),\n    args: getDefaultArgs(args),\n};\n",locationsMap:{double:{startLoc:{col:22,line:28},endLoc:{col:1,line:117},startBody:{col:22,line:28},endBody:{col:1,line:117}}}}},title:"UI components/Slider/Graphics",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_5__.P)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_5__.V)(args)};var __namedExportsOrder=["Double"]},"./src/DoubleSlider.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{D:()=>DoubleSlider});var _pixi_core__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/core/lib/index.mjs"),_pixi_display__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@pixi/display/lib/index.mjs"),_pixi_graphics__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@pixi/graphics/lib/index.mjs"),_pixi_sprite__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@pixi/sprite/lib/index.mjs"),_pixi_text__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@pixi/text/lib/index.mjs"),typed_signals__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/typed-signals/dist/index.js");function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,_toPropertyKey(descriptor.key),descriptor)}}function _setPrototypeOf(o,p){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){return o.__proto__=p,o},_setPrototypeOf(o,p)}function _createSuper(Derived){var hasNativeReflectConstruct=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return _possibleConstructorReturn(this,result)}}function _possibleConstructorReturn(self,call){if(call&&("object"===_typeof(call)||"function"==typeof call))return call;if(void 0!==call)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(self)}function _assertThisInitialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}function _getPrototypeOf(o){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)},_getPrototypeOf(o)}function _defineProperty(obj,key,value){return(key=_toPropertyKey(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}var DoubleSlider=function(_Container){!function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),Object.defineProperty(subClass,"prototype",{writable:!1}),superClass&&_setPrototypeOf(subClass,superClass)}(DoubleSlider,_Container);var _super=_createSuper(DoubleSlider);function DoubleSlider(options){var _this;!function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,DoubleSlider),_defineProperty(_assertThisInitialized(_this=_super.call(this)),"dragging1",0),_defineProperty(_assertThisInitialized(_this),"dragging2",0),_defineProperty(_assertThisInitialized(_this),"percent1",0),_defineProperty(_assertThisInitialized(_this),"percent2",100),_defineProperty(_assertThisInitialized(_this),"value1",0),_defineProperty(_assertThisInitialized(_this),"value2",0),_defineProperty(_assertThisInitialized(_this),"onChange",new typed_signals__WEBPACK_IMPORTED_MODULE_5__.MZ),_this.options=options;var bg="string"==typeof options.bg?new _pixi_sprite__WEBPACK_IMPORTED_MODULE_3__.j(_pixi_core__WEBPACK_IMPORTED_MODULE_0__.xE.from(options.bg)):options.bg;if(_this.bg=new _pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2,_this.bg.addChild(bg),_this.addChild(_this.bg),options.fill){var _options$fillOffset$x,_options$fillOffset,_options$fillOffset$y,_options$fillOffset2,fill="string"==typeof options.fill?new _pixi_sprite__WEBPACK_IMPORTED_MODULE_3__.j(_pixi_core__WEBPACK_IMPORTED_MODULE_0__.xE.from(options.fill)):options.fill;_this.fill=new _pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2,_this.fill.addChild(fill);var offsetX=null!==(_options$fillOffset$x=null===(_options$fillOffset=options.fillOffset)||void 0===_options$fillOffset?void 0:_options$fillOffset.x)&&void 0!==_options$fillOffset$x?_options$fillOffset$x:0,offsetY=null!==(_options$fillOffset$y=null===(_options$fillOffset2=options.fillOffset)||void 0===_options$fillOffset2?void 0:_options$fillOffset2.y)&&void 0!==_options$fillOffset$y?_options$fillOffset$y:0;_this.fill.x=(_this.bg.width-_this.fill.width)/2+offsetX,_this.fill.y=(_this.bg.height-_this.fill.height)/2+offsetY,_this.fillMask=new _pixi_graphics__WEBPACK_IMPORTED_MODULE_2__.TC,_this.fill.addChild(_this.fillMask),_this.fill.mask=_this.fillMask,_this.addChild(_this.fill)}var slider1="string"==typeof options.slider1?new _pixi_sprite__WEBPACK_IMPORTED_MODULE_3__.j(_pixi_core__WEBPACK_IMPORTED_MODULE_0__.xE.from(options.slider1)):options.slider1;slider1 instanceof _pixi_sprite__WEBPACK_IMPORTED_MODULE_3__.j&&slider1.anchor.set(.5),slider1.x=slider1.width/2,_this.slider1=new _pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2,_this.slider1.addChild(slider1),_this.slider1.y=_this.bg.height/2;var slider2="string"==typeof options.slider2?new _pixi_sprite__WEBPACK_IMPORTED_MODULE_3__.j(_pixi_core__WEBPACK_IMPORTED_MODULE_0__.xE.from(options.slider2)):options.slider2;return slider2 instanceof _pixi_sprite__WEBPACK_IMPORTED_MODULE_3__.j&&slider2.anchor.set(.5),slider2.x=slider2.width/2,_this.slider2=new _pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2,_this.slider2.addChild(slider2),_this.slider2.y=_this.bg.height/2,_this.addChild(_this.slider2,_this.slider1),options.showValue&&(_this.slider1Text=new _pixi_text__WEBPACK_IMPORTED_MODULE_4__.xv("",options.valueTextStyle||{fill:16777215}),_this.slider1Text.anchor.set(.5),_this.addChild(_this.slider1Text)),options.showValue&&(_this.slider2Text=new _pixi_text__WEBPACK_IMPORTED_MODULE_4__.xv("",options.valueTextStyle||{fill:16777215}),_this.slider2Text.anchor.set(.5),_this.addChild(_this.slider2Text)),_this.validateSettings(),_this.makeScrollable(),_this.update(),_this}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(DoubleSlider,[{key:"validateSettings",value:function validateSettings(){var _ref,_options$value,_ref2,_options$value2,options=this.options;options.min||(options.min=0),options.max||(options.max=100),options.value1<options.min&&(options.value1=options.min),options.value2>options.max&&(options.value2=options.max),this.value1=null!==(_ref=null!==(_options$value=options.value1)&&void 0!==_options$value?_options$value:options.min)&&void 0!==_ref?_ref:0,this.percent1=100*this.value1/options.max,this.value2=null!==(_ref2=null!==(_options$value2=options.value2)&&void 0!==_options$value2?_options$value2:options.min)&&void 0!==_ref2?_ref2:0,this.percent2=100*this.value2/options.max;var scale=options.max-options.min,scaledVal1=this.value1-options.min,scaledVal2=this.value2-options.min;this.percent1=100*scaledVal1/scale,this.percent2=100*scaledVal2/scale}},{key:"makeScrollable",value:function makeScrollable(){this.interactive=!0,this.slider1.interactive=!0,this.slider2.interactive=!0,this.bg.interactive=!0;var onDragStart1=this.onDragStart1,onDragMove1=this.onDragMove1,onDragEnd1=this.onDragEnd1,onSetByClick=this.onSetByClick,onDragStart2=this.onDragStart2,onDragMove2=this.onDragMove2,onDragEnd2=this.onDragEnd2;this.slider1.on("pointerdown",onDragStart1,this).on("pointermove",onDragMove1,this).on("pointerup",onDragEnd1,this).on("pointerupoutside",onDragEnd1,this),this.slider2.on("pointerdown",onDragStart2,this).on("pointermove",onDragMove2,this).on("pointerup",onDragEnd2,this).on("pointerupoutside",onDragEnd2,this),this.bg.on("pointerdown",onSetByClick,this),this.on("pointerupoutside",onDragEnd1,this)}},{key:"onSetByClick",value:function onSetByClick(event){var _this$onChange,pos=event.currentTarget.parent.worldTransform.applyInverse(event.global).x-this.slider2.width/2;pos<0&&(pos=0);var maxPos=this.bg.width-this.slider2.width;if(pos>maxPos&&(pos=maxPos),pos<this.slider1.x)this.setSlider1Val(pos);else if(pos>this.slider2.x)this.setSlider2Val(pos);else{pos-this.slider1.x<this.slider2.x-pos?this.setSlider1Val(pos):this.setSlider2Val(pos)}this.update(),null===(_this$onChange=this.onChange)||void 0===_this$onChange||_this$onChange.emit(this.value1,this.value2)}},{key:"onDragStart1",value:function onDragStart1(event){var obj=event.currentTarget;obj.dragData=event,this.dragging1=1,obj.dragPointerStart=obj.parent.worldTransform.applyInverse(event.global),obj.dragObjStart=new _pixi_core__WEBPACK_IMPORTED_MODULE_0__.E9,obj.dragObjStart.copyFrom(obj.position),obj.dragGlobalStart=new _pixi_core__WEBPACK_IMPORTED_MODULE_0__.E9,obj.dragGlobalStart.copyFrom(event.data.global)}},{key:"onDragMove1",value:function onDragMove1(event){var obj=event.currentTarget;if(this.dragging1){var _obj$dragGlobalStart,_obj$dragGlobalStart2,data=obj.dragData;if(1===this.dragging1)Math.abs(data.global.x-(null===(_obj$dragGlobalStart=obj.dragGlobalStart)||void 0===_obj$dragGlobalStart?void 0:_obj$dragGlobalStart.x))+Math.abs(data.global.y-(null===(_obj$dragGlobalStart2=obj.dragGlobalStart)||void 0===_obj$dragGlobalStart2?void 0:_obj$dragGlobalStart2.y))>=3&&(this.dragging1=2);if(2===this.dragging1){var dragPointerEnd=obj.parent.worldTransform.applyInverse(data.global),pos=obj.dragObjStart.x+(dragPointerEnd.x-obj.dragPointerStart.x);pos<0&&(pos=0),pos>this.slider2.x&&(pos=this.slider2.x);var maxPos=this.bg.width-this.slider1.width;pos>maxPos&&(pos=maxPos),this.setSlider1Val(pos),this.update()}}}},{key:"setSlider1Val",value:function setSlider1Val(pos){var maxPos=this.bg.width-this.slider1.width;this.percent1=Math.round(pos/maxPos*100),this.value1=this.options.min+Math.round((this.options.max-this.options.min)/100*this.percent1)}},{key:"onDragEnd1",value:function onDragEnd1(){var _this$onChange2;this.dragging1&&(this.dragging1=0,null===(_this$onChange2=this.onChange)||void 0===_this$onChange2||_this$onChange2.emit(this.value1,this.value2))}},{key:"onDragStart2",value:function onDragStart2(event){var obj=event.currentTarget;obj.dragData=event.data,this.dragging2=1,obj.dragPointerStart=obj.parent.worldTransform.applyInverse(event.global),obj.dragObjStart=new _pixi_core__WEBPACK_IMPORTED_MODULE_0__.E9,obj.dragObjStart.copyFrom(obj.position),obj.dragGlobalStart=new _pixi_core__WEBPACK_IMPORTED_MODULE_0__.E9,obj.dragGlobalStart.copyFrom(event.data.global)}},{key:"onDragMove2",value:function onDragMove2(event){var obj=event.currentTarget;if(this.dragging2){var _obj$dragGlobalStart3,_obj$dragGlobalStart4,data=obj.dragData;if(1===this.dragging2)Math.abs(data.global.x-(null===(_obj$dragGlobalStart3=obj.dragGlobalStart)||void 0===_obj$dragGlobalStart3?void 0:_obj$dragGlobalStart3.x))+Math.abs(data.global.y-(null===(_obj$dragGlobalStart4=obj.dragGlobalStart)||void 0===_obj$dragGlobalStart4?void 0:_obj$dragGlobalStart4.y))>=3&&(this.dragging2=2);if(2===this.dragging2){var dragPointerEnd=obj.parent.worldTransform.applyInverse(data.global),pos=obj.dragObjStart.x+(dragPointerEnd.x-obj.dragPointerStart.x);pos<this.slider1.x&&(pos=this.slider1.x);var maxPos=this.bg.width-this.slider2.width;pos>maxPos&&(pos=maxPos),this.setSlider2Val(pos),this.update()}}}},{key:"setSlider2Val",value:function setSlider2Val(pos){var maxPos=this.bg.width-this.slider2.width;this.percent2=Math.round(pos/maxPos*100),this.value2=this.options.min+Math.round((this.options.max-this.options.min)/100*this.percent2)}},{key:"onDragEnd2",value:function onDragEnd2(){var _this$onChange3;this.dragging2&&(this.dragging2=0,null===(_this$onChange3=this.onChange)||void 0===_this$onChange3||_this$onChange3.emit(this.value1,this.value2))}},{key:"update",value:function update(){var _this$onChange4,position1=(this.bg.width-this.slider1.width)/100*this.percent1,position2=(this.bg.width-this.slider2.width)/100*this.percent2;this.slider1.x=position1,this.slider2.x=position2;var startPoint=this.bg.width/100*this.percent1,endPoint=this.bg.width/100*this.percent2;if(this.fillMask&&this.fillMask.clear().lineStyle(0).beginFill(16777215).drawRect(startPoint,0,endPoint-startPoint,this.fill.height),this.options.showValue){var _this$options$valueTe,_this$options$valueTe2,_this$options$valueTe3,_this$options$valueTe4,_this$options$valueTe5,_this$options$valueTe6,_this$options$valueTe7,_this$options$valueTe8;this.slider1Text.text=this.value1,this.slider2Text.text=this.value2;var slider1PosX=this.slider1.x+this.slider1.width/2,slider1PosY=this.slider1.y;this.slider1Text.x=slider1PosX+(null!==(_this$options$valueTe=null===(_this$options$valueTe2=this.options.valueTextOffset)||void 0===_this$options$valueTe2?void 0:_this$options$valueTe2.x)&&void 0!==_this$options$valueTe?_this$options$valueTe:0),this.slider1Text.y=slider1PosY+(null!==(_this$options$valueTe3=null===(_this$options$valueTe4=this.options.valueTextOffset)||void 0===_this$options$valueTe4?void 0:_this$options$valueTe4.y)&&void 0!==_this$options$valueTe3?_this$options$valueTe3:0);var slider2PosX=this.slider2.x+this.slider2.width/2,slider2PosY=this.slider2.y;this.slider2Text.x=slider2PosX+(null!==(_this$options$valueTe5=null===(_this$options$valueTe6=this.options.valueTextOffset)||void 0===_this$options$valueTe6?void 0:_this$options$valueTe6.x)&&void 0!==_this$options$valueTe5?_this$options$valueTe5:0),this.slider2Text.y=slider2PosY+(null!==(_this$options$valueTe7=null===(_this$options$valueTe8=this.options.valueTextOffset)||void 0===_this$options$valueTe8?void 0:_this$options$valueTe8.y)&&void 0!==_this$options$valueTe7?_this$options$valueTe7:0)}null===(_this$onChange4=this.onChange)||void 0===_this$onChange4||_this$onChange4.emit(this.value1,this.value2)}}]),DoubleSlider}(_pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2)}}]);