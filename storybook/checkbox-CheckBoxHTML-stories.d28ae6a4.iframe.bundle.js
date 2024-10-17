"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[6213],{"./src/stories/checkbox/CheckBoxHTML.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{UseHtml:()=>UseHtml,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var pixi_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/pixi.js/lib/index.mjs"),_CheckBox__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/CheckBox.ts"),_List__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/List.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/utils/helpers/resize.ts"),_utils_helpers_styles__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/utils/helpers/styles.ts"),_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/stories/utils/argTypes.ts"),_utils_color__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/stories/utils/color.ts");const args={text:"Checkbox",textColor:"#FFFFFF",color:"#F1D583",borderColor:"#DCB000",fillBorderColor:"#FFFFFF",fillColor:"#A5E24D",width:50,height:50,radius:11,amount:3,checked:!1,onPress:(0,__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs").XI)("Checkbox")},UseHtml=({text,amount,checked,textColor,borderColor,fillBorderColor,fillColor,color,width,height,radius,onPress})=>{const view=new _List__WEBPACK_IMPORTED_MODULE_2__.B({type:"vertical",elementsMargin:10});color=(0,_utils_color__WEBPACK_IMPORTED_MODULE_3__.o)(color),borderColor=(0,_utils_color__WEBPACK_IMPORTED_MODULE_3__.o)(borderColor),fillColor=(0,_utils_color__WEBPACK_IMPORTED_MODULE_3__.o)(fillColor),fillBorderColor=(0,_utils_color__WEBPACK_IMPORTED_MODULE_3__.o)(fillBorderColor);for(let i=0;i<amount;i++){const checkBox=new _CheckBox__WEBPACK_IMPORTED_MODULE_4__.o({text:`${text} ${i+1}`,TextClass:pixi_js__WEBPACK_IMPORTED_MODULE_0__.xni,checked,style:{unchecked:(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(-2,-2,width+4,height+4,radius).fill(borderColor).roundRect(0,0,width,height,radius).fill(color),checked:(new pixi_js__WEBPACK_IMPORTED_MODULE_0__.A1g).roundRect(-2,-2,width+4,height+4,radius).fill(borderColor).roundRect(0,0,width,height,radius).fill(color).roundRect(3,3,width-6,height-6,radius).fill(fillBorderColor).roundRect(5,5,width-10,height-10,radius).fill(fillColor),text:{..._utils_helpers_styles__WEBPACK_IMPORTED_MODULE_5__.a,fontSize:22,fill:textColor}}});checkBox.onCheck.connect((checked=>{onPress(`checkBox ${i+1} ${checked}`)})),view.addChild(checkBox)}return{view,resize:()=>(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_6__.E)(view)}},__WEBPACK_DEFAULT_EXPORT__={title:"Components/Checkbox/Use Html",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__.U)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__.p)(args)},__namedExportsOrder=["UseHtml"]},"./src/CheckBox.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{o:()=>CheckBox});var lib=__webpack_require__("./node_modules/pixi.js/lib/index.mjs"),dist=__webpack_require__("./node_modules/typed-signals/dist/index.js"),Switcher=__webpack_require__("./src/Switcher.ts");var view=__webpack_require__("./src/utils/helpers/view.ts");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,_toPropertyKey(descriptor.key),descriptor)}}function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:String(i)}function _setPrototypeOf(o,p){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){return o.__proto__=p,o},_setPrototypeOf(o,p)}function _createSuper(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct();return function _createSuperInternal(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return function _possibleConstructorReturn(self,call){if(call&&("object"===_typeof(call)||"function"==typeof call))return call;if(void 0!==call)throw new TypeError("Derived constructors may only return object or undefined");return function _assertThisInitialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}(self)}(this,result)}}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function _getPrototypeOf(o){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)},_getPrototypeOf(o)}var CheckBox=function(_Switcher){!function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),Object.defineProperty(subClass,"prototype",{writable:!1}),superClass&&_setPrototypeOf(subClass,superClass)}(CheckBox,_Switcher);var _super=_createSuper(CheckBox);function CheckBox(options){var _options$TextClass,_this;return function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,CheckBox),(_this=_super.call(this))._textClass=null!==(_options$TextClass=options.TextClass)&&void 0!==_options$TextClass?_options$TextClass:lib.EYj,_this.text=options.text,_this.style=options.style,_this.checked=options.checked,_this.triggerEvents=["onPress"],_this.innerView.cursor="pointer",_this.onCheck=new dist.HN,_this.onChange.connect((function(){return _this.onCheck.emit(_this.checked)})),_this}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(CheckBox,[{key:"addLabel",value:function addLabel(text,style){var _this$_style,_this2=this;text&&(this.labelText=new this._textClass({text:null!=text?text:"",style:null!=style?style:null===(_this$_style=this._style)||void 0===_this$_style?void 0:_this$_style.text}),this.addChild(this.labelText),this.labelText.cursor="pointer",this.labelText.eventMode="static",this.labelText.on("pointertap",(function(){return _this2.checked=!_this2.checked})))}},{key:"text",get:function get(){var _this$labelText$text,_this$labelText;return null!==(_this$labelText$text=null===(_this$labelText=this.labelText)||void 0===_this$labelText?void 0:_this$labelText.text)&&void 0!==_this$labelText$text?_this$labelText$text:""},set:function set(text){text?this.labelText?this.labelText.text=text:this.addLabel(text):function cleanup(element){element&&(element.parent&&element.parent.removeChild(element),element.destroy(),element=null)}(this.labelText)}},{key:"style",get:function get(){return this._style},set:function set(style){var wasChecked=this.checked;this._style=style;var _style$textOffset$x,_style$textOffset,_style$textOffset$y,_style$textOffset2,unchecked=style.unchecked,checked=style.checked,uncheckedView=(0,view.K)(unchecked),checkedView=(0,view.K)(checked);(this.views=[uncheckedView,checkedView],wasChecked?(checkedView.visible=!0,this.active=1):uncheckedView.visible=!0,this.labelText)?(checkedView.visible=!0,this.active=1,style.text&&(this.labelText.style=style.text),this.labelText.x=uncheckedView.width+10+(null!==(_style$textOffset$x=null===(_style$textOffset=style.textOffset)||void 0===_style$textOffset?void 0:_style$textOffset.x)&&void 0!==_style$textOffset$x?_style$textOffset$x:0),this.labelText.y=(uncheckedView.height-this.labelText.height)/2+(null!==(_style$textOffset$y=null===(_style$textOffset2=style.textOffset)||void 0===_style$textOffset2?void 0:_style$textOffset2.y)&&void 0!==_style$textOffset$y?_style$textOffset$y:0)):uncheckedView.visible=!0}},{key:"checked",get:function get(){return 1===this.active},set:function set(checked){this.switch(checked?1:0)}},{key:"forceCheck",value:function forceCheck(checked){this.forceSwitch(checked?1:0)}}]),CheckBox}(Switcher.i)},"./src/stories/utils/color.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{o:()=>getColor});var pixi_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/pixi.js/lib/index.mjs");function getColor(color){if("transparent"!==color&&void 0!==color)return pixi_js__WEBPACK_IMPORTED_MODULE_0__.Q1f.shared.setValue(color).toNumber()}},"./src/utils/helpers/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{a:()=>defaultTextStyle});var defaultTextStyle={fill:16777215,fontSize:42,fontWeight:"bold",dropShadow:{color:0,alpha:.5,distance:0,blur:3,angle:0}}}}]);