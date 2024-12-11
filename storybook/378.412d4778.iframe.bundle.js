"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[378],{"./src/List.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,_toPropertyKey(o.key),o)}}function _callSuper(t,o,e){return o=_getPrototypeOf(o),function _possibleConstructorReturn(t,e){if(e&&("object"==_typeof(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(t)}(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],_getPrototypeOf(t).constructor):o.apply(t,e))}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},_getPrototypeOf(t)}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},_setPrototypeOf(t,e)}function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:i+""}__webpack_require__.d(__webpack_exports__,{B:()=>List});var List=function(_ref){function List(options){var _options$items,_this;return function _classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}(this,List),function _defineProperty(e,r,t){return(r=_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}(_this=_callSuper(this,List),"children",[]),options&&_this.init(options),null==options||null===(_options$items=options.items)||void 0===_options$items||_options$items.forEach((function(item){return _this.addChild(item)})),_this.on("added",(function(){return _this.arrangeChildren()})),_this.on("childAdded",(function(){return _this.arrangeChildren()})),_this}return function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&_setPrototypeOf(t,e)}(List,_ref),function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}(List,[{key:"init",value:function init(options){var _this2=this;this.options=options,null!=options&&options.type&&(this.type=options.type),null!=options&&options.children&&options.children.forEach((function(child){return _this2.addChild(child)}))}},{key:"type",get:function get(){return this._type},set:function set(type){this._type=type,this.arrangeChildren()}},{key:"elementsMargin",get:function get(){var _this$options$element,_this$options;return null!==(_this$options$element=null===(_this$options=this.options)||void 0===_this$options?void 0:_this$options.elementsMargin)&&void 0!==_this$options$element?_this$options$element:0},set:function set(margin){if(!this.options)throw new Error("List has not been initiated!");this.options.elementsMargin=margin,this.arrangeChildren()}},{key:"padding",get:function get(){var _this$options$padding,_this$options2;return null!==(_this$options$padding=null===(_this$options2=this.options)||void 0===_this$options2?void 0:_this$options2.padding)&&void 0!==_this$options$padding?_this$options$padding:0},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.padding=padding,this.options.vertPadding=padding,this.options.horPadding=padding,this.options.leftPadding=padding,this.options.rightPadding=padding,this.options.topPadding=padding,this.options.bottomPadding=padding,this.arrangeChildren()}},{key:"vertPadding",get:function get(){var _ref2,_this$options$vertPad,_this$options3;return null!==(_ref2=null!==(_this$options$vertPad=null===(_this$options3=this.options)||void 0===_this$options3?void 0:_this$options3.vertPadding)&&void 0!==_this$options$vertPad?_this$options$vertPad:this.padding)&&void 0!==_ref2?_ref2:0},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.vertPadding=padding,this.options.topPadding=padding,this.options.bottomPadding=padding,this.arrangeChildren()}},{key:"horPadding",get:function get(){var _ref3,_this$options$horPadd,_this$options4;return null!==(_ref3=null!==(_this$options$horPadd=null===(_this$options4=this.options)||void 0===_this$options4?void 0:_this$options4.horPadding)&&void 0!==_this$options$horPadd?_this$options$horPadd:this.padding)&&void 0!==_ref3?_ref3:0},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.horPadding=padding,this.options.leftPadding=padding,this.options.rightPadding=padding,this.arrangeChildren()}},{key:"leftPadding",get:function get(){var _this$options$leftPad,_this$options5;return null!==(_this$options$leftPad=null===(_this$options5=this.options)||void 0===_this$options5?void 0:_this$options5.leftPadding)&&void 0!==_this$options$leftPad?_this$options$leftPad:this.horPadding},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.leftPadding=padding,this.arrangeChildren()}},{key:"rightPadding",get:function get(){var _this$options$rightPa,_this$options6;return null!==(_this$options$rightPa=null===(_this$options6=this.options)||void 0===_this$options6?void 0:_this$options6.rightPadding)&&void 0!==_this$options$rightPa?_this$options$rightPa:this.horPadding},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.rightPadding=padding,this.arrangeChildren()}},{key:"topPadding",get:function get(){var _this$options$topPadd,_this$options7;return null!==(_this$options$topPadd=null===(_this$options7=this.options)||void 0===_this$options7?void 0:_this$options7.topPadding)&&void 0!==_this$options$topPadd?_this$options$topPadd:this.vertPadding},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.topPadding=padding,this.arrangeChildren()}},{key:"bottomPadding",get:function get(){var _this$options$bottomP,_this$options8;return null!==(_this$options$bottomP=null===(_this$options8=this.options)||void 0===_this$options8?void 0:_this$options8.bottomPadding)&&void 0!==_this$options$bottomP?_this$options$bottomP:this.vertPadding},set:function set(padding){if(!this.options)throw new Error("List has not been initiated!");this.options.bottomPadding=padding,this.arrangeChildren()}},{key:"arrangeChildren",value:function arrangeChildren(){var _this$options$element2,_this$options9,_this$parent,_this3=this,maxHeight=0,x=this.leftPadding,y=this.topPadding,elementsMargin=null!==(_this$options$element2=null===(_this$options9=this.options)||void 0===_this$options9?void 0:_this$options9.elementsMargin)&&void 0!==_this$options$element2?_this$options$element2:0,maxWidth=null===(_this$parent=this.parent)||void 0===_this$parent?void 0:_this$parent.width;this.rightPadding&&(maxWidth-=this.rightPadding),this.children.forEach((function(child,id){switch(_this3.type){case"vertical":child.y=y,child.x=x,y+=elementsMargin+child.height;break;case"horizontal":child.x=x,child.y=y,x+=elementsMargin+child.width;break;default:child.x=x,child.y=y,child.x+child.width>maxWidth&&id>0&&(y+=elementsMargin+maxHeight,x=_this3.leftPadding,child.x=x,child.y=y,maxHeight=0),maxHeight=Math.max(maxHeight,child.height),x+=elementsMargin+child.width}}))}},{key:"removeItem",value:function removeItem(itemID){var child=this.children[itemID];child&&(this.removeChild(child),this.arrangeChildren())}}])}(__webpack_require__("./node_modules/pixi.js/lib/index.mjs").mcf)},"./src/ScrollBox.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>ScrollBox});var lib=__webpack_require__("./node_modules/pixi.js/lib/index.mjs"),dist=__webpack_require__("./node_modules/typed-signals/dist/index.js"),List=__webpack_require__("./src/List.ts");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,_toPropertyKey(o.key),o)}}function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:i+""}var Spring=function(){return function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}((function Spring(){var options=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};!function _classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}(this,Spring),this.x=0,this.ax=0,this.dx=0,this.tx=0,this._options=options,this._options.max=options.max||160,this._options.damp=options.damp||.8,this._options.springiness=options.springiness||.1}),[{key:"update",value:function update(){this.ax=(this.tx-this.x)*this._options.springiness,this.dx+=this.ax,this.dx*=this._options.damp,this.dx<-this._options.max?this.dx=-this._options.max:this.dx>this._options.max&&(this.dx=this._options.max),this.x+=this.dx}},{key:"reset",value:function reset(){this.x=0,this.ax=0,this.dx=0,this.tx=0}},{key:"max",get:function get(){return this._options.max},set:function set(value){this._options.max=value}},{key:"damp",get:function get(){return this._options.damp},set:function set(value){this._options.damp=value}},{key:"springiness",get:function get(){return this._options.springiness},set:function set(value){this._options.springiness=value}}])}();function ScrollSpring_typeof(o){return ScrollSpring_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},ScrollSpring_typeof(o)}function ScrollSpring_defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,ScrollSpring_toPropertyKey(o.key),o)}}function ScrollSpring_toPropertyKey(t){var i=function ScrollSpring_toPrimitive(t,r){if("object"!=ScrollSpring_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=ScrollSpring_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==ScrollSpring_typeof(i)?i:i+""}var ScrollSpring=function(){return function ScrollSpring_createClass(e,r,t){return r&&ScrollSpring_defineProperties(e.prototype,r),t&&ScrollSpring_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}((function ScrollSpring(){!function ScrollSpring_classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}(this,ScrollSpring),this._spring=new Spring,this._pos=0,this.to=0}),[{key:"start",value:function start(speed,pos,to){this._speed=speed,this._pos=pos,this.to=to,this.done=!1,this._spring.x=this._pos,this._spring.tx=this.to;var diff=this.to-this._pos,toDirection=Math.abs(diff)/diff,currentDirection=Math.abs(this._speed)/this._speed;this._correctSpeed=toDirection!==currentDirection}},{key:"update",value:function update(){if(this._correctSpeed)this._speed*=.6,Math.abs(this._speed)<2&&(this._correctSpeed=!1),this._pos+=this._speed,this._spring.x=this._pos;else{var diff=this.to-this._pos;Math.abs(diff)<.05?(this._pos=this.to,this.done=!0):(this._spring.tx=this.to,this._spring.update(),this._pos=this._spring.x)}return this._pos}},{key:"cancel",value:function cancel(){}}])}();function SlidingNumber_typeof(o){return SlidingNumber_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},SlidingNumber_typeof(o)}function SlidingNumber_defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,SlidingNumber_toPropertyKey(o.key),o)}}function _defineProperty(e,r,t){return(r=SlidingNumber_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function SlidingNumber_toPropertyKey(t){var i=function SlidingNumber_toPrimitive(t,r){if("object"!=SlidingNumber_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=SlidingNumber_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==SlidingNumber_typeof(i)?i:i+""}var SlidingNumber=function(){return function SlidingNumber_createClass(e,r,t){return r&&SlidingNumber_defineProperties(e.prototype,r),t&&SlidingNumber_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}((function SlidingNumber(){var _options$constrain,_options$maxSpeed,_options$ease,options=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};!function SlidingNumber_classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}(this,SlidingNumber),_defineProperty(this,"position",0),_defineProperty(this,"constrain",!0),_defineProperty(this,"min",0),_defineProperty(this,"max",0),_defineProperty(this,"maxSpeed",400),_defineProperty(this,"_offset",0),_defineProperty(this,"_prev",0),_defineProperty(this,"_speed",0),_defineProperty(this,"_targetSpeed",0),_defineProperty(this,"_speedChecker",0),_defineProperty(this,"_grab",0),this.constrain=null===(_options$constrain=options.constrain)||void 0===_options$constrain||_options$constrain,this.maxSpeed=null!==(_options$maxSpeed=options.maxSpeed)&&void 0!==_options$maxSpeed?_options$maxSpeed:400,this._ease=null!==(_options$ease=options.ease)&&void 0!==_options$ease?_options$ease:new ScrollSpring}),[{key:"value",get:function get(){return this.position},set:function set(n){this._speed=0,this.position=n}},{key:"grab",value:function grab(offset){this._grab=offset,this._offset=this.position-offset,this._speedChecker=0,this._targetSpeed=this._speed=0,this._hasStopped=!1}},{key:"hold",value:function hold(newPosition){this._speedChecker++,this.position=newPosition+this._offset,this._speedChecker>1&&(this._targetSpeed=this.position-this._prev),this._speed+=(this._targetSpeed-this._speed)/2,this._speed>this.maxSpeed?this._speed=this.maxSpeed:this._speed<-this.maxSpeed&&(this._speed=-this.maxSpeed),this._prev=this.position,this.constrain&&(this._activeEase=null,this.position>this.min?this.position-=(this.position-this.min)/1.5:this.position<this.max&&(this.position+=(this.max-this.position)/1.5))}},{key:"slide",value:function slide(){var instant=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this._hasStopped||(this.constrain?this._updateConstrain(instant):this._updateDefault())}},{key:"moveAmount",get:function get(){return-(this.position-this._offset-this._grab)}},{key:"_updateDefault",value:function _updateDefault(){this._speed*=.9,this.position+=this._speed,(this._speed<0?-1*this._speed:this._speed)<.01&&(this._hasStopped=!0)}},{key:"_updateConstrain",value:function _updateConstrain(){var instant=arguments.length>0&&void 0!==arguments[0]&&arguments[0],max=this.max;instant?(this.value>0&&(this.value=0),this.value>0&&(this.value=0),this.value<this.max&&(this.value=this.max),this.value<this.max&&(this.value=this.max)):this.position>this.min||this.position<max||this._activeEase?(this._activeEase||(this._activeEase=this._ease,this.position>this.min?this._activeEase.start(this._speed,this.position,this.min):this._activeEase.start(this._speed,this.position,max)),this.position=this._activeEase.update(),this._activeEase.done&&(this.position=this._activeEase.to,this._speed=0,this._activeEase=null)):this._updateDefault()}}])}();function Trackpad_typeof(o){return Trackpad_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},Trackpad_typeof(o)}function Trackpad_defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,Trackpad_toPropertyKey(o.key),o)}}function Trackpad_toPropertyKey(t){var i=function Trackpad_toPrimitive(t,r){if("object"!=Trackpad_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=Trackpad_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==Trackpad_typeof(i)?i:i+""}var Trackpad=function(){return function Trackpad_createClass(e,r,t){return r&&Trackpad_defineProperties(e.prototype,r),t&&Trackpad_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}((function Trackpad(options){var _options$disableEasin;!function Trackpad_classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}(this,Trackpad),function Trackpad_defineProperty(e,r,t){return(r=Trackpad_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}(this,"disableEasing",!1),this.xAxis=new SlidingNumber({ease:options.xEase,maxSpeed:options.maxSpeed,constrain:options.constrain}),this.yAxis=new SlidingNumber({ease:options.yEase,maxSpeed:options.maxSpeed,constrain:options.constrain}),this.disableEasing=null!==(_options$disableEasin=options.disableEasing)&&void 0!==_options$disableEasin&&_options$disableEasin,this._frame=new lib.M_G,this._bounds=new lib.M_G,this._globalPosition=new lib.bRX}),[{key:"pointerDown",value:function pointerDown(pos){this._globalPosition=pos,this.xAxis.grab(pos.x),this.yAxis.grab(pos.y),this._isDown=!0}},{key:"pointerUp",value:function pointerUp(){this._isDown=!1}},{key:"pointerMove",value:function pointerMove(pos){this._globalPosition=pos}},{key:"update",value:function update(){this._dirty&&(this._dirty=!1,this.xAxis.min=this._bounds.left,this.xAxis.min=this._bounds.right-this._frame.width,this.xAxis.min=this._bounds.top,this.xAxis.min=this._bounds.bottom-this._frame.height),this._isDown?(this.xAxis.hold(this._globalPosition.x),this.yAxis.hold(this._globalPosition.y)):(this.xAxis.slide(this.disableEasing),this.yAxis.slide(this.disableEasing))}},{key:"resize",value:function resize(w,h){this._frame.x=0,this._frame.width=w,this._frame.y=0,this._frame.height=h,this._dirty=!0}},{key:"setBounds",value:function setBounds(minX,maxX,minY,maxY){this._bounds.x=minX,this._bounds.width=maxX-minX,this._bounds.y=minY,this._bounds.height=maxY-minY,this._dirty=!0}},{key:"x",get:function get(){return this.xAxis.value}},{key:"y",get:function get(){return this.yAxis.value}}])}();function ScrollBox_typeof(o){return ScrollBox_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},ScrollBox_typeof(o)}function ScrollBox_defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,ScrollBox_toPropertyKey(o.key),o)}}function _callSuper(t,o,e){return o=_getPrototypeOf(o),function _possibleConstructorReturn(t,e){if(e&&("object"==ScrollBox_typeof(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(t)}(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],_getPrototypeOf(t).constructor):o.apply(t,e))}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function _superPropGet(t,o,e,r){var p=_get(_getPrototypeOf(1&r?t.prototype:t),o,e);return 2&r&&"function"==typeof p?function(t){return p.apply(e,t)}:p}function _get(){return _get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(e,t,r){var p=function _superPropBase(t,o){for(;!{}.hasOwnProperty.call(t,o)&&null!==(t=_getPrototypeOf(t)););return t}(e,t);if(p){var n=Object.getOwnPropertyDescriptor(p,t);return n.get?n.get.call(arguments.length<3?e:r):n.value}},_get.apply(null,arguments)}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},_getPrototypeOf(t)}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},_setPrototypeOf(t,e)}function ScrollBox_defineProperty(e,r,t){return(r=ScrollBox_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function ScrollBox_toPropertyKey(t){var i=function ScrollBox_toPrimitive(t,r){if("object"!=ScrollBox_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=ScrollBox_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==ScrollBox_typeof(i)?i:i+""}var ScrollBox=function(_Container){function ScrollBox(options){var _this;return function ScrollBox_classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}(this,ScrollBox),ScrollBox_defineProperty(_this=_callSuper(this,ScrollBox),"__width",0),ScrollBox_defineProperty(_this,"__height",0),ScrollBox_defineProperty(_this,"_dimensionChanged",!1),ScrollBox_defineProperty(_this,"isDragging",0),ScrollBox_defineProperty(_this,"interactiveStorage",[]),ScrollBox_defineProperty(_this,"visibleItems",[]),ScrollBox_defineProperty(_this,"ticker",lib.RvI.shared),ScrollBox_defineProperty(_this,"onMouseScrollBinding",_this.onMouseScroll.bind(_this)),ScrollBox_defineProperty(_this,"isOver",!1),ScrollBox_defineProperty(_this,"proximityStatusCache",[]),ScrollBox_defineProperty(_this,"proximityCheckFrameCounter",0),ScrollBox_defineProperty(_this,"onProximityChange",new dist.HN),ScrollBox_defineProperty(_this,"onScroll",new dist.HN),options&&_this.init(options),_this.ticker.add(_this.update,_this),_this}return function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&_setPrototypeOf(t,e)}(ScrollBox,_Container),function ScrollBox_createClass(e,r,t){return r&&ScrollBox_defineProperties(e.prototype,r),t&&ScrollBox_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}(ScrollBox,[{key:"init",value:function init(options){var _options$proximityRan,_options$globalScroll,_options$shiftScroll;this.options=options,this.setBackground(options.background),this.__width=options.width|this.background.width,this.__height=options.height|this.background.height,this.proximityRange=null!==(_options$proximityRan=options.proximityRange)&&void 0!==_options$proximityRan?_options$proximityRan:0,this.list||(this.list=new List.B,_superPropGet(ScrollBox,"addChild",this,3)([this.list])),this.list.init({type:options.type,elementsMargin:options.elementsMargin,padding:options.padding,vertPadding:options.vertPadding,horPadding:options.horPadding,topPadding:options.topPadding,bottomPadding:options.bottomPadding,leftPadding:options.leftPadding,rightPadding:options.rightPadding}),this.addItems(options.items),this.hasBounds&&(this.addMask(),this.makeScrollable()),this._trackpad.xAxis.value=0,this._trackpad.yAxis.value=0,this.options.globalScroll=null===(_options$globalScroll=options.globalScroll)||void 0===_options$globalScroll||_options$globalScroll,this.options.shiftScroll=null!==(_options$shiftScroll=options.shiftScroll)&&void 0!==_options$shiftScroll&&_options$shiftScroll,this.resize()}},{key:"hasBounds",get:function get(){return!!this.__width||!!this.__height}},{key:"addItems",value:function addItems(items){var _this2=this;null!=items&&items.length&&items.forEach((function(item){return _this2.addItem(item)}))}},{key:"removeItems",value:function removeItems(){this.proximityStatusCache.length=0,this.list.removeChildren()}},{key:"addItem",value:function addItem(){for(var _this3=this,_len=arguments.length,items=new Array(_len),_key=0;_key<_len;_key++)items[_key]=arguments[_key];if(items.length>1)items.forEach((function(item){return _this3.addItem(item)}));else{var child=items[0];child.width&&child.height||console.error("ScrollBox item should have size"),child.eventMode="static",this.list.addChild(child),this.proximityStatusCache.push(!1),this.options.disableDynamicRendering||(child.renderable=this.isItemVisible(child))}return this.resize(),items[0]}},{key:"removeItem",value:function removeItem(itemID){this.list.removeItem(itemID),this.proximityStatusCache.splice(itemID,1),this.resize()}},{key:"isItemVisible",value:function isItemVisible(item){var padding=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,isVertical="vertical"===this.options.type||!this.options.type,isVisible=!1,list=this.list;if(isVertical){var posY=item.y+list.y;posY+item.height>=-padding&&posY<=this.options.height+padding&&(isVisible=!0)}else{var posX=item.x+list.x;posX+item.width>=-padding&&posX<=this.options.width+padding&&(isVisible=!0)}return isVisible}},{key:"items",get:function get(){var _this$list$children,_this$list;return null!==(_this$list$children=null===(_this$list=this.list)||void 0===_this$list?void 0:_this$list.children)&&void 0!==_this$list$children?_this$list$children:[]}},{key:"setBackground",value:function setBackground(background){this.background&&this.removeChild(this.background),this.options.background=background,this.background=new lib.A1g,this.addChildAt(this.background,0),this.resize()}},{key:"addMask",value:function addMask(){this.borderMask||(this.borderMask=new lib.A1g,_superPropGet(ScrollBox,"addChild",this,3)([this.borderMask]),this.mask=this.borderMask),this.resize()}},{key:"makeScrollable",value:function makeScrollable(){var _this4=this;this._trackpad||(this._trackpad=new Trackpad({disableEasing:this.options.disableEasing})),this.on("pointerdown",(function(e){_this4.renderAllItems(),_this4.isDragging=1,_this4.dragStarTouchPoint=_this4.worldTransform.applyInverse(e.global),_this4._trackpad.pointerDown(_this4.dragStarTouchPoint);var listTouchPoint=_this4.list.worldTransform.applyInverse(e.global);_this4.visibleItems.forEach((function(item){item.x<listTouchPoint.x&&item.x+item.width>listTouchPoint.x&&item.y<listTouchPoint.y&&item.y+item.height>listTouchPoint.y&&(_this4.pressedChild=item)}))})),this.on("pointerup",(function(){_this4.isDragging=0,_this4._trackpad.pointerUp(),_this4.restoreItemsInteractivity(),_this4.pressedChild=null,_this4.stopRenderHiddenItems()})),this.on("pointerover",(function(){_this4.isOver=!0})),this.on("pointerout",(function(){_this4.isOver=!1})),this.on("pointerupoutside",(function(){_this4.isDragging=0,_this4._trackpad.pointerUp(),_this4.restoreItemsInteractivity(),_this4.pressedChild=null,_this4.stopRenderHiddenItems()})),this.on("globalpointermove",(function(e){var _this4$onScroll;if(_this4.isDragging){var isVertical="horizontal"!==_this4.options.type,touchPoint=_this4.worldTransform.applyInverse(e.global);if(_this4.dragStarTouchPoint){var _this4$options$dragTr,dragTrashHold=null!==(_this4$options$dragTr=_this4.options.dragTrashHold)&&void 0!==_this4$options$dragTr?_this4$options$dragTr:10;if("horizontal"===_this4.options.type){var xDist=touchPoint.x-_this4.dragStarTouchPoint.x;Math.abs(xDist)>dragTrashHold&&(_this4.isDragging=2)}else{var yDist=touchPoint.y-_this4.dragStarTouchPoint.y;Math.abs(yDist)>dragTrashHold&&(_this4.isDragging=2)}}_this4.dragStarTouchPoint&&2!==_this4.isDragging||(_this4._trackpad.pointerMove(touchPoint),_this4.pressedChild&&(_this4.revertClick(_this4.pressedChild),_this4.pressedChild=null),null===(_this4$onScroll=_this4.onScroll)||void 0===_this4$onScroll||_this4$onScroll.emit(isVertical?_this4.scrollY:_this4.scrollX))}})),document.addEventListener("wheel",this.onMouseScrollBinding,!0)}},{key:"setInteractive",value:function setInteractive(interactive){this.eventMode=interactive?"static":"auto"}},{key:"listHeight",get:function get(){return this.list.height+this.list.topPadding+this.list.bottomPadding}},{key:"listWidth",get:function get(){return this.list.width+this.list.leftPadding+this.list.rightPadding}},{key:"resize",value:function resize(){var force=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(this.hasBounds){if(this.renderAllItems(),this.borderMask&&(force||this._dimensionChanged||this.lastWidth!==this.listWidth||this.lastHeight!==this.listHeight)){this.options.width||(this.__width+=this.listWidth),this.options.height||(this.__height+=this.listHeight),this.borderMask.clear().roundRect(0,0,this.__width,this.__height,0|this.options.radius).fill(16711935).stroke(0),this.borderMask.eventMode="none";var color=this.options.background;this.background.clear().roundRect(0,0,this.__width,this.__height,0|this.options.radius).fill({color:null!=color?color:0,alpha:color?1:1e-7}),"horizontal"===this.options.type?this.setInteractive(this.listWidth>this.__width):this.setInteractive(this.listHeight>this.__height),this.lastWidth=this.listWidth,this.lastHeight=this.listHeight}if(this._trackpad){var maxWidth=this.borderMask.width-this.list.width-this.list.leftPadding-this.list.rightPadding,maxHeight=this.borderMask.height-this.list.height-this.list.topPadding-this.list.bottomPadding;"vertical"===this.options.type?this._trackpad.yAxis.max=-Math.abs(maxHeight):("horizontal"===this.options.type||(this._trackpad.yAxis.max=-Math.abs(maxHeight)),this._trackpad.xAxis.max=-Math.abs(maxWidth))}this._dimensionChanged?(this.list.arrangeChildren(),this.stopRenderHiddenItems(),this._dimensionChanged=!1):this.updateVisibleItems(),this.lastScrollX=null,this.lastScrollY=null}}},{key:"onMouseScroll",value:function onMouseScroll(event){if(this.isOver||this.options.globalScroll){this.renderAllItems();var scrollOnX=this.options.shiftScroll?void 0!==event.deltaX||void 0!==event.deltaY:void 0!==event.deltaX;if("horizontal"===this.options.type&&scrollOnX){var _this$onScroll,delta=this.options.shiftScroll?event.deltaX:event.deltaY,targetPos=this.list.x-delta;if(this.listWidth<this.__width)this._trackpad.xAxis.value=0;else{var min=this.__width-this.listWidth;this._trackpad.xAxis.value=Math.min(0,Math.max(min,targetPos))}null===(_this$onScroll=this.onScroll)||void 0===_this$onScroll||_this$onScroll.emit(this._trackpad.xAxis.value)}else if(void 0!==event.deltaY){var _this$onScroll2,_targetPos=this.list.y-event.deltaY;if(this.listHeight<this.__height)this._trackpad.yAxis.value=0;else{var _min=this.__height-this.listHeight;this._trackpad.yAxis.value=Math.min(0,Math.max(_min,_targetPos))}null===(_this$onScroll2=this.onScroll)||void 0===_this$onScroll2||_this$onScroll2.emit(this._trackpad.yAxis.value)}this.stopRenderHiddenItems()}}},{key:"scrollBottom",value:function scrollBottom(){this.interactive?this.scrollTo(this.list.children.length-1):this.scrollTop()}},{key:"scrollTop",value:function scrollTop(){this.renderAllItems(),this._trackpad.xAxis.value=0,this._trackpad.yAxis.value=0,this.stopRenderHiddenItems()}},{key:"renderAllItems",value:function renderAllItems(){clearTimeout(this.stopRenderHiddenItemsTimeout),this.stopRenderHiddenItemsTimeout=null,this.options.disableDynamicRendering||this.items.forEach((function(child){child.renderable=!0}))}},{key:"stopRenderHiddenItems",value:function stopRenderHiddenItems(){var _this5=this;this.options.disableDynamicRendering||(this.stopRenderHiddenItemsTimeout&&(clearTimeout(this.stopRenderHiddenItemsTimeout),this.stopRenderHiddenItemsTimeout=null),this.stopRenderHiddenItemsTimeout=setTimeout((function(){return _this5.updateVisibleItems()}),2e3))}},{key:"updateVisibleItems",value:function updateVisibleItems(){var _this6=this;this.visibleItems.length=0,this.items.forEach((function(child){child.renderable=_this6.isItemVisible(child),_this6.visibleItems.push(child)}))}},{key:"scrollTo",value:function scrollTo(elementID){if(this.interactive){var target=this.list.children[elementID];target&&(this.renderAllItems(),this._trackpad.xAxis.value="horizontal"===this.options.type?this.__width-target.x-target.width-this.list.rightPadding:0,this._trackpad.yAxis.value=this.options.type&&"vertical"!==this.options.type?0:this.__height-target.y-target.height-this.list.bottomPadding,this.stopRenderHiddenItems())}}},{key:"scrollToPosition",value:function scrollToPosition(_ref){var x=_ref.x,y=_ref.y;void 0===x&&void 0===y||(this.renderAllItems(),void 0!==x&&(this.scrollX=-x),void 0!==y&&(this.scrollY=-y),this.stopRenderHiddenItems())}},{key:"height",get:function get(){return this.__height},set:function set(value){this.__height=value,this._dimensionChanged=!0,this.resize(),this.scrollTop()}},{key:"width",get:function get(){return this.__width},set:function set(value){this.__width=value,this._dimensionChanged=!0,this.resize(),this.scrollTop()}},{key:"setSize",value:function setSize(value,height){var _value$height,_height;"object"===ScrollBox_typeof(value)?(height=null!==(_value$height=value.height)&&void 0!==_value$height?_value$height:value.width,value=value.width):height=null!==(_height=height)&&void 0!==_height?_height:value;this.__width=value,this.__height=height,this._dimensionChanged=!0,this.resize(),this.scrollTop()}},{key:"getSize",value:function getSize(out){return(out=out||{width:0,height:0}).width=this.__width,out.height=this.__height,out}},{key:"scrollX",get:function get(){return this._trackpad.xAxis.value},set:function set(value){this._trackpad.xAxis.value=value}},{key:"scrollY",get:function get(){return this._trackpad.yAxis.value},set:function set(value){this._trackpad.yAxis.value=value}},{key:"update",value:function update(){var _this7=this;if(this.list){this._trackpad.update();var _this$options$proximi,type="horizontal"===this.options.type?"x":"y";if(this.list[type]!==this._trackpad[type]&&(this.list[type]=this._trackpad[type]),!this.options.disableProximityCheck&&(this._trackpad.x!==this.lastScrollX||this._trackpad.y!==this.lastScrollY))this.proximityCheckFrameCounter++,this.proximityCheckFrameCounter>=(null!==(_this$options$proximi=this.options.proximityDebounce)&&void 0!==_this$options$proximi?_this$options$proximi:10)&&(this.items.forEach((function(item,index){var inRange=_this7.isItemVisible(item,_this7.proximityRange);inRange!==_this7.proximityStatusCache[index]&&(_this7.proximityStatusCache[index]=inRange,_this7.onProximityChange.emit({item,index,inRange}))})),this.lastScrollX=this._trackpad.x,this.lastScrollY=this._trackpad.y,this.proximityCheckFrameCounter=0)}}},{key:"destroy",value:function destroy(options){this.ticker.remove(this.update,this),document.removeEventListener("wheel",this.onMouseScrollBinding,!0),this.background.destroy(),this.list.destroy(),_superPropGet(ScrollBox,"destroy",this,3)([options])}},{key:"restoreItemsInteractivity",value:function restoreItemsInteractivity(){this.interactiveStorage.forEach((function(element){element.item.eventMode=element.eventMode})),this.interactiveStorage.length=0}},{key:"revertClick",value:function revertClick(item){var _this8=this;"auto"!==item.eventMode&&(lib.FrL.any?item.emit("pointerupoutside",null):item.emit("mouseupoutside",null),this.interactiveStorage.push({item,eventMode:item.eventMode}),item.eventMode="auto"),item instanceof lib.mcf&&item.children&&item.children.forEach((function(child){return _this8.revertClick(child)}))}},{key:"scrollHeight",get:function get(){return this.list.height}},{key:"scrollWidth",get:function get(){return this.list.width}}])}(lib.mcf)},"./src/utils/helpers/styles.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{a:()=>defaultTextStyle});var defaultTextStyle={fill:16777215,fontSize:42,fontWeight:"bold",dropShadow:{color:0,alpha:.5,distance:0,blur:3,angle:0}}}}]);