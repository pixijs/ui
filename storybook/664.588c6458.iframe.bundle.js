"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[664],{"./src/CheckBox.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{J:()=>CheckBox});var lib=__webpack_require__("./node_modules/@pixi/text/lib/index.mjs"),dist=__webpack_require__("./node_modules/typed-signals/dist/index.js");function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,(arg=descriptor.key,key=void 0,key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string"),"symbol"===_typeof(key)?key:String(key)),descriptor)}var arg,key}function _setPrototypeOf(o,p){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){return o.__proto__=p,o},_setPrototypeOf(o,p)}function _createSuper(Derived){var hasNativeReflectConstruct=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return function _possibleConstructorReturn(self,call){if(call&&("object"===_typeof(call)||"function"==typeof call))return call;if(void 0!==call)throw new TypeError("Derived constructors may only return object or undefined");return function _assertThisInitialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}(self)}(this,result)}}function _getPrototypeOf(o){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)},_getPrototypeOf(o)}var CheckBox=function(_Switcher){!function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),Object.defineProperty(subClass,"prototype",{writable:!1}),superClass&&_setPrototypeOf(subClass,superClass)}(CheckBox,_Switcher);var _super=_createSuper(CheckBox);function CheckBox(options){var _this;return function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,CheckBox),(_this=_super.call(this)).text=options.text,_this.style=options.style,_this.checked=options.checked,_this.triggerEvents=["onPress"],_this.innerView.cursor="pointer",_this.onCheck=new dist.MZ,_this.onChange.connect((function(){return _this.onCheck.emit(_this.checked)})),_this}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(CheckBox,[{key:"addLabel",value:function addLabel(text,style){var _this$_style,_this2=this;text&&(this.label=new lib.xv(null!=text?text:"",null!=style?style:null===(_this$_style=this._style)||void 0===_this$_style?void 0:_this$_style.text),this.addChild(this.label),this.label.cursor="pointer",this.label.eventMode="static",this.label.on("pointertap",(function(){return _this2.checked=!_this2.checked})))}},{key:"text",get:function get(){var _this$label$text,_this$label;return null!==(_this$label$text=null===(_this$label=this.label)||void 0===_this$label?void 0:_this$label.text)&&void 0!==_this$label$text?_this$label$text:""},set:function set(text){text?this.label?this.label.text=text:this.addLabel(text):function cleanup(element){element&&(element.parent&&element.parent.removeChild(element),element.destroy(),element=null)}(this.label)}},{key:"style",get:function get(){return this._style},set:function set(style){this._style=style;var unchecked=style.unchecked,checked=style.checked;this.views=[unchecked,checked];var _style$textOffset$x,_style$textOffset,_style$textOffset$y,_style$textOffset2,uncheckedView=this.views[0];this.label&&(style.text&&(this.label.style=style.text),this.label.x=uncheckedView.width+10+(null!==(_style$textOffset$x=null===(_style$textOffset=style.textOffset)||void 0===_style$textOffset?void 0:_style$textOffset.x)&&void 0!==_style$textOffset$x?_style$textOffset$x:0),this.label.y=(uncheckedView.height-this.label.height)/2+(null!==(_style$textOffset$y=null===(_style$textOffset2=style.textOffset)||void 0===_style$textOffset2?void 0:_style$textOffset2.y)&&void 0!==_style$textOffset$y?_style$textOffset$y:0))}},{key:"checked",get:function get(){return 1===this.active},set:function set(checked){this.switch(checked?1:0)}},{key:"forceCheck",value:function forceCheck(checked){this.forceSwitch(checked?1:0)}}]),CheckBox}(__webpack_require__("./src/Switcher.ts").T)},"./src/List.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,_toPropertyKey(descriptor.key),descriptor)}}function _setPrototypeOf(o,p){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){return o.__proto__=p,o},_setPrototypeOf(o,p)}function _createSuper(Derived){var hasNativeReflectConstruct=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return function _possibleConstructorReturn(self,call){if(call&&("object"===_typeof(call)||"function"==typeof call))return call;if(void 0!==call)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(self)}(this,result)}}function _assertThisInitialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}function _getPrototypeOf(o){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)},_getPrototypeOf(o)}function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}__webpack_require__.d(__webpack_exports__,{a:()=>List});var List=function(_Container){!function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),Object.defineProperty(subClass,"prototype",{writable:!1}),superClass&&_setPrototypeOf(subClass,superClass)}(List,_Container);var _super=_createSuper(List);function List(options){var _options$items,_this;return function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,List),function _defineProperty(obj,key,value){return(key=_toPropertyKey(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}(_assertThisInitialized(_this=_super.call(this)),"children",[]),options&&_this.init(options),null==options||null===(_options$items=options.items)||void 0===_options$items||_options$items.forEach((function(item){return _this.addChild(item)})),_this.on("added",(function(){return _this.arrangeChildren()})),_this.on("childAdded",(function(){return _this.arrangeChildren()})),_this}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(List,[{key:"init",value:function init(options){var _this2=this;this.options=options,null!=options&&options.type&&(this.type=options.type),null!=options&&options.children&&options.children.forEach((function(child){return _this2.addChild(child)}))}},{key:"type",get:function get(){return this._type},set:function set(type){this._type=type,this.arrangeChildren()}},{key:"elementsMargin",get:function get(){return this.options.elementsMargin},set:function set(margin){this.options.elementsMargin=margin,this.arrangeChildren()}},{key:"vertPadding",get:function get(){return this.options.vertPadding},set:function set(padding){this.options.vertPadding=padding,this.arrangeChildren()}},{key:"horPadding",get:function get(){return this.options.horPadding},set:function set(padding){this.options.horPadding=padding,this.arrangeChildren()}},{key:"arrangeChildren",value:function arrangeChildren(){var _this$options$horPadd,_this$options,_this$options$vertPad,_this$options2,_this$options$element,_this$options3,_this$parent,_this$options4,_this3=this,x=null!==(_this$options$horPadd=null===(_this$options=this.options)||void 0===_this$options?void 0:_this$options.horPadding)&&void 0!==_this$options$horPadd?_this$options$horPadd:0,y=null!==(_this$options$vertPad=null===(_this$options2=this.options)||void 0===_this$options2?void 0:_this$options2.vertPadding)&&void 0!==_this$options$vertPad?_this$options$vertPad:0,elementsMargin=null!==(_this$options$element=null===(_this$options3=this.options)||void 0===_this$options3?void 0:_this$options3.elementsMargin)&&void 0!==_this$options$element?_this$options$element:0,maxWidth=null===(_this$parent=this.parent)||void 0===_this$parent?void 0:_this$parent.width;null!==(_this$options4=this.options)&&void 0!==_this$options4&&_this$options4.horPadding&&(maxWidth-=this.options.horPadding),this.children.forEach((function(child,id){switch(_this3.type){case"vertical":child.y=y,child.x=x,y+=elementsMargin+child.height;break;case"horizontal":child.x=x,child.y=y,x+=elementsMargin+child.width;break;default:var _this3$options$horPad,_this3$options;if(child.x=x,child.y=y,child.x+child.width>=maxWidth&&id>0)y+=elementsMargin+child.height,x=null!==(_this3$options$horPad=null===(_this3$options=_this3.options)||void 0===_this3$options?void 0:_this3$options.horPadding)&&void 0!==_this3$options$horPad?_this3$options$horPad:0,child.x=x,child.y=y;x+=elementsMargin+child.width}}))}}]),List}(__webpack_require__("./node_modules/@pixi/display/lib/index.mjs").W2)},"./src/RadioGroup.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{E:()=>RadioGroup});var _pixi_display__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/display/lib/index.mjs"),typed_signals__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/typed-signals/dist/index.js"),_List__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/List.ts");function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,_toPropertyKey(descriptor.key),descriptor)}}function _setPrototypeOf(o,p){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){return o.__proto__=p,o},_setPrototypeOf(o,p)}function _createSuper(Derived){var hasNativeReflectConstruct=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return function _possibleConstructorReturn(self,call){if(call&&("object"===_typeof(call)||"function"==typeof call))return call;if(void 0!==call)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(self)}(this,result)}}function _assertThisInitialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}function _getPrototypeOf(o){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)},_getPrototypeOf(o)}function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}var RadioGroup=function(_Container){!function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),Object.defineProperty(subClass,"prototype",{writable:!1}),superClass&&_setPrototypeOf(subClass,superClass)}(RadioGroup,_Container);var _super=_createSuper(RadioGroup);function RadioGroup(options){var _this;return function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,RadioGroup),function _defineProperty(obj,key,value){return(key=_toPropertyKey(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}(_assertThisInitialized(_this=_super.call(this)),"items",[]),options&&_this.init(options),_this.onChange=new typed_signals__WEBPACK_IMPORTED_MODULE_1__.MZ,_this}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(RadioGroup,[{key:"init",value:function init(options){var _options$selectedItem;this.options=options,this.value=options.items[options.selectedItem||0].label.text,this.selected=null!==(_options$selectedItem=options.selectedItem)&&void 0!==_options$selectedItem?_options$selectedItem:0,this.innerView?(this.innerView.type=options.type,this.innerView.elementsMargin=options.elementsMargin):this.innerView=new _List__WEBPACK_IMPORTED_MODULE_2__.a({type:options.type,elementsMargin:options.elementsMargin}),this.addItems(options.items),this.addChild(this.innerView),this.selectItem(this.selected)}},{key:"addItems",value:function addItems(items){var _this2=this;items.forEach((function(checkBox,id){checkBox.onChange.connect((function(){return _this2.selectItem(id)})),_this2.items.push(checkBox),_this2.innerView.addChild(checkBox)}))}},{key:"removeItems",value:function removeItems(ids){var _this3=this;ids.forEach((function(id){var item=_this3.items[id];item&&(item.onChange.disconnectAll(),_this3.innerView.removeChild(item),_this3.items.splice(id,1))}))}},{key:"selectItem",value:function selectItem(id){this.items.forEach((function(item,key){item.forceCheck(key===id)})),this.selected!==id&&this.onChange.emit(id,this.items[id].label.text),this.value=this.options.items[id].label.text,this.selected=id}}]),RadioGroup}(_pixi_display__WEBPACK_IMPORTED_MODULE_0__.W2)},"./src/utils/helpers/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{B:()=>defaultTextStyle});var defaultTextStyle=new(__webpack_require__("./node_modules/@pixi/text/lib/index.mjs").pn)({fill:16777215,fontSize:42,fontWeight:"bold",dropShadow:!0,dropShadowAlpha:.5,dropShadowDistance:0,dropShadowBlur:3})}}]);