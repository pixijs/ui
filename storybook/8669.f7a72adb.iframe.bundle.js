"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[8669],{"./src/Button.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{$:()=>Button,E:()=>ButtonContainer});var lib=__webpack_require__("./node_modules/pixi.js/lib/index.mjs"),dist=__webpack_require__("./node_modules/typed-signals/dist/index.js");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,_toPropertyKey(o.key),o)}}function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:i+""}function Button_typeof(o){return Button_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},Button_typeof(o)}function Button_classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}function Button_defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,Button_toPropertyKey(o.key),o)}}function Button_createClass(e,r,t){return r&&Button_defineProperties(e.prototype,r),t&&Button_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function Button_toPropertyKey(t){var i=function Button_toPrimitive(t,r){if("object"!=Button_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=Button_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==Button_typeof(i)?i:i+""}function _callSuper(t,o,e){return o=_getPrototypeOf(o),function _possibleConstructorReturn(t,e){if(e&&("object"==Button_typeof(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(t)}(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],_getPrototypeOf(t).constructor):o.apply(t,e))}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},_getPrototypeOf(t)}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&_setPrototypeOf(t,e)}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},_setPrototypeOf(t,e)}var Button=function(_ButtonEvents){function Button(view){var _this;return Button_classCallCheck(this,Button),_this=_callSuper(this,Button),view&&(_this.view=view,_this.enabled=!0),_this}return _inherits(Button,_ButtonEvents),Button_createClass(Button,[{key:"view",get:function get(){return this._view},set:function set(view){!!this._view&&this.disconnectEvents(this._view),this._view=view,this.connectEvents(this._view)}},{key:"enabled",get:function get(){return"static"===this.view.eventMode},set:function set(enabled){this.view?(this.view.eventMode=enabled?"static":"auto",this.view.cursor=enabled?"pointer":"default",!enabled&&this.isDown&&this.processUp()):console.error("Button view is not set. Please set it before enabling the button.")}}])}(function(){return function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}((function ButtonEvents(){!function _classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}(this,ButtonEvents),this.onPress=new dist.HN,this.onDown=new dist.HN,this.onUp=new dist.HN,this.onHover=new dist.HN,this.onOut=new dist.HN,this.onUpOut=new dist.HN}),[{key:"connectEvents",value:function connectEvents(view){lib.FrL.any?(view.on("pointerdown",this.processDown,this),view.on("pointerup",this.processUp,this),view.on("pointerupoutside",this.processUpOut,this),view.on("pointerout",this.processOut,this),view.on("pointertap",this.processPress,this),view.on("pointerover",this.processOver,this)):(view.on("mousedown",this.processDown,this),view.on("mouseup",this.processUp,this),view.on("mouseupoutside",this.processUpOut,this),view.on("mouseout",this.processOut,this),view.on("click",this.processPress,this),view.on("mouseover",this.processOver,this))}},{key:"disconnectEvents",value:function disconnectEvents(view){lib.FrL.any?(view.off("pointerdown",this.processDown,this),view.off("pointerup",this.processUp,this),view.off("pointerupoutside",this.processUpOut,this),view.off("pointerout",this.processOut,this),view.off("pointertap",this.processPress,this),view.off("pointerover",this.processOver,this)):(view.off("mousedown",this.processDown,this),view.off("mouseup",this.processUp,this),view.off("mouseupoutside",this.processUpOut,this),view.off("mouseout",this.processOut,this),view.off("click",this.processPress,this),view.off("mouseover",this.processOver,this))}},{key:"processDown",value:function processDown(e){this._isDown=!0,this.onDown.emit(this,e),this.down(e)}},{key:"processUp",value:function processUp(e){this._isDown&&(this.onUp.emit(this,e),this.up(e)),this._isDown=!1}},{key:"processUpOut",value:function processUpOut(e){this._isDown&&(this.onUp.emit(this,e),this.onUpOut.emit(this,e),this.up(e),this.upOut(e)),this._isDown=!1}},{key:"processOut",value:function processOut(e){this._isMouseIn&&(this._isMouseIn=!1,this.onOut.emit(this,e),this.out(e))}},{key:"processPress",value:function processPress(e){this._isDown=!1,this.onPress.emit(this,e),this.press(e)}},{key:"processOver",value:function processOver(e){lib.FrL.any||(this._isMouseIn=!0,this.onHover.emit(this,e),this.hover(e))}},{key:"down",value:function down(_e){}},{key:"up",value:function up(_e){}},{key:"upOut",value:function upOut(_e){}},{key:"out",value:function out(_e){}},{key:"press",value:function press(_e){}},{key:"hover",value:function hover(_e){}},{key:"isDown",get:function get(){return this._isDown}}])}()),ButtonContainer=function(_Container){function ButtonContainer(view){var _this2;return Button_classCallCheck(this,ButtonContainer),(_this2=_callSuper(this,ButtonContainer)).button=new Button(_this2),_this2.button.enabled=!0,view&&_this2.addChild(view),_this2.onPress=_this2.button.onPress,_this2.onDown=_this2.button.onDown,_this2.onUp=_this2.button.onUp,_this2.onHover=_this2.button.onHover,_this2.onOut=_this2.button.onOut,_this2.onUpOut=_this2.button.onUpOut,_this2}return _inherits(ButtonContainer,_Container),Button_createClass(ButtonContainer,[{key:"enabled",get:function get(){return this.button.enabled},set:function set(enabled){this.button.enabled=enabled}}])}(lib.mcf)},"./src/FancyButton.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{w:()=>FancyButton});var lib=__webpack_require__("./node_modules/pixi.js/lib/index.mjs"),tweedle_es=__webpack_require__("./node_modules/tweedle.js/dist/tweedle.es.js"),Button=__webpack_require__("./src/Button.ts");function fitToView(parent,child){var padding=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,uniformScaling=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],scaleX=child.scale.x,scaleY=child.scale.y;if(!parent)throw new Error("Parent is not defined");var maxWidth=parent.width-2*padding,maxHeight=parent.height-2*padding,widthOverflow=maxWidth-Math.round(child.width),heightOverflow=maxHeight-Math.round(child.height);if(widthOverflow<0&&(scaleX=maxWidth/(child.width/scaleX)),heightOverflow<0&&(scaleY=maxHeight/(child.height/scaleY)),scaleX<=0||scaleY<=0)child.scale.set(0);else if(uniformScaling||child.scale.x===child.scale.y){var scale=Math.min(scaleX,scaleY);child.scale.set(scale,scale)}else{var ratio=child.scale.x/child.scale.y;widthOverflow<heightOverflow?child.scale.set(scaleX,scaleX/ratio):child.scale.set(scaleY*ratio,scaleY)}}var helpers_view=__webpack_require__("./src/utils/helpers/view.ts");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,_toPropertyKey(o.key),o)}}function _callSuper(t,o,e){return o=_getPrototypeOf(o),function _possibleConstructorReturn(t,e){if(e&&("object"==_typeof(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(t)}(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],_getPrototypeOf(t).constructor):o.apply(t,e))}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t})()}function _superPropGet(t,o,e,r){var p=_get(_getPrototypeOf(1&r?t.prototype:t),o,e);return 2&r&&"function"==typeof p?function(t){return p.apply(e,t)}:p}function _get(){return _get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(e,t,r){var p=_superPropBase(e,t);if(p){var n=Object.getOwnPropertyDescriptor(p,t);return n.get?n.get.call(arguments.length<3?e:r):n.value}},_get.apply(null,arguments)}function _superPropSet(t,e,o,r,p,f){return function _set(e,r,t,o,f){if(!set(e,r,t,o||e)&&f)throw new TypeError("failed to set property");return t}(_getPrototypeOf(f?t.prototype:t),e,o,r,p)}function set(e,r,t,o){return set="undefined"!=typeof Reflect&&Reflect.set?Reflect.set:function(e,r,t,o){var f,i=_superPropBase(e,r);if(i){if((f=Object.getOwnPropertyDescriptor(i,r)).set)return f.set.call(o,t),!0;if(!f.writable)return!1}if(f=Object.getOwnPropertyDescriptor(o,r)){if(!f.writable)return!1;f.value=t,Object.defineProperty(o,r,f)}else _defineProperty(o,r,t);return!0},set(e,r,t,o)}function _superPropBase(t,o){for(;!{}.hasOwnProperty.call(t,o)&&null!==(t=_getPrototypeOf(t)););return t}function _getPrototypeOf(t){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},_getPrototypeOf(t)}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},_setPrototypeOf(t,e)}function _defineProperty(e,r,t){return(r=_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=_typeof(t)||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=_typeof(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==_typeof(i)?i:i+""}var FancyButton=function(_ButtonContainer){function FancyButton(options){var _ref2,_ref3,_this;!function _classCallCheck(a,n){if(!(a instanceof n))throw new TypeError("Cannot call a class as a function")}(this,FancyButton),_defineProperty(_this=_callSuper(this,FancyButton),"defaultDuration",100),_defineProperty(_this,"innerView",new lib.mcf),_defineProperty(_this,"_views",{}),_defineProperty(_this,"_defaultTextScale",{x:1,y:1}),_defineProperty(_this,"_defaultIconScale",{x:1,y:1}),_defineProperty(_this,"_defaultTextAnchor",{x:.5,y:.5}),_defineProperty(_this,"_defaultIconAnchor",{x:.5,y:.5}),_this.options=null!=options?options:{};var _ref=null!=options?options:{},defaultView=_ref.defaultView,hoverView=_ref.hoverView,pressedView=_ref.pressedView,disabledView=_ref.disabledView,text=_ref.text,padding=_ref.padding,offset=_ref.offset,textOffset=_ref.textOffset,iconOffset=_ref.iconOffset,textScale=_ref.defaultTextScale,iconScale=_ref.defaultIconScale,textAnchor=_ref.defaultTextAnchor,iconAnchor=_ref.defaultIconAnchor,scale=_ref.scale,anchor=_ref.anchor,anchorX=_ref.anchorX,anchorY=_ref.anchorY,icon=_ref.icon,animations=_ref.animations;return _this.addChild(_this.innerView),_this.anchor=new lib.oA$({_onUpdate:function _onUpdate(){return _this.updateAnchor()}}),_this.anchor.set(null!==(_ref2=null!=anchorX?anchorX:anchor)&&void 0!==_ref2?_ref2:0,null!==(_ref3=null!=anchorY?anchorY:anchor)&&void 0!==_ref3?_ref3:0),_this.padding=null!=padding?padding:0,_this.offset=offset,_this.textOffset=textOffset,_this.iconOffset=iconOffset,_this.defaultTextScale=textScale,_this.defaultIconScale=iconScale,_this.defaultTextAnchor=textAnchor,_this.defaultIconAnchor=iconAnchor,_this.scale.set(null!=scale?scale:1),animations&&(_this.animations=animations,lib.RvI.shared.add((function(){return tweedle_es.YJ.shared.update()}))),_this.setState("default"),_this.defaultView=defaultView,_this.hoverView=hoverView,_this.pressedView=pressedView,_this.disabledView=disabledView,_this.text=text,_this.iconView=icon,_this.initStateControl(),_this}return function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&_setPrototypeOf(t,e)}(FancyButton,_ButtonContainer),function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}(FancyButton,[{key:"text",get:function get(){var _this$_views$textView;return null===(_this$_views$textView=this._views.textView)||void 0===_this$_views$textView?void 0:_this$_views$textView.text},set:function set(text){text&&0!==text?this._views.textView?this._views.textView.text=text.toString():this.createTextView(text):this.removeView("textView")}},{key:"enabled",get:function get(){return this.button.enabled},set:function set(enabled){this.button.enabled=enabled,this.setState(enabled?"default":"disabled")}},{key:"setState",value:function setState(newState){if(arguments.length>1&&void 0!==arguments[1]&&arguments[1]||this.state!==newState){var currentView=this.getStateView(this.state);currentView&&(currentView.visible=!1),this.state=newState;var activeView=this.getStateView(newState);activeView&&(this.setOffset(activeView,newState,this.offset),activeView.visible=!0),this.updateAnchor(),this.playAnimations(newState)}}},{key:"createTextView",value:function createTextView(text){var _this$options;if(this._views.textView=function getTextView(text){return"string"==typeof text||"number"==typeof text?new lib.EYj({text:String(text)}):text}(text),void 0===(null===(_this$options=this.options)||void 0===_this$options?void 0:_this$options.defaultTextScale)){var _this$_views$textView2=this._views.textView.scale,x=_this$_views$textView2.x,y=_this$_views$textView2.y;this._defaultTextScale={x,y}}this.innerView.addChild(this._views.textView),this.adjustTextView(this.state)}},{key:"setOffset",value:function setOffset(view,state,offset){var _stateOffset$x,_stateOffset$y,stateOffset=offset?offset[state]:{x:0,y:0},defaultStateOffset=null==offset?void 0:offset.default;if(stateOffset)view.x+=null!==(_stateOffset$x=stateOffset.x)&&void 0!==_stateOffset$x?_stateOffset$x:0,view.y+=null!==(_stateOffset$y=stateOffset.y)&&void 0!==_stateOffset$y?_stateOffset$y:0;else if(defaultStateOffset){var _defaultStateOffset$x,_defaultStateOffset$y;view.x+=null!==(_defaultStateOffset$x=defaultStateOffset.x)&&void 0!==_defaultStateOffset$x?_defaultStateOffset$x:0,view.y+=null!==(_defaultStateOffset$y=defaultStateOffset.y)&&void 0!==_defaultStateOffset$y?_defaultStateOffset$y:0}else if(offset.x||offset.y){var _offset$x,_offset$y;view.x+=null!==(_offset$x=offset.x)&&void 0!==_offset$x?_offset$x:0,view.y+=null!==(_offset$y=offset.y)&&void 0!==_offset$y?_offset$y:0}}},{key:"getStateView",value:function getStateView(state){var _ref4,_this$_views$hoverVie,_ref5,_ref6,_this$_views$pressedV,_ref7,_this$_views$disabled,_this$_views$defaultV;if(this._views)switch(state){case"hover":return null!==(_ref4=null!==(_this$_views$hoverVie=this._views.hoverView)&&void 0!==_this$_views$hoverVie?_this$_views$hoverVie:this._views.defaultView)&&void 0!==_ref4?_ref4:void 0;case"pressed":return null!==(_ref5=null!==(_ref6=null!==(_this$_views$pressedV=this._views.pressedView)&&void 0!==_this$_views$pressedV?_this$_views$pressedV:this._views.hoverView)&&void 0!==_ref6?_ref6:this._views.defaultView)&&void 0!==_ref5?_ref5:void 0;case"disabled":return null!==(_ref7=null!==(_this$_views$disabled=this._views.disabledView)&&void 0!==_this$_views$disabled?_this$_views$disabled:this._views.defaultView)&&void 0!==_ref7?_ref7:void 0;case"default":return null!==(_this$_views$defaultV=this._views.defaultView)&&void 0!==_this$_views$defaultV?_this$_views$defaultV:void 0;default:return}}},{key:"adjustTextView",value:function adjustTextView(state){if(this.text){var activeView=this.getStateView(this.state),_this$_defaultTextAnc=this._defaultTextAnchor,anchorX=_this$_defaultTextAnc.x,anchorY=_this$_defaultTextAnc.y;if(activeView){if(this.options.ignoreRefitting||this._views.textView.scale.set(this._defaultTextScale.x,this._defaultTextScale.y),"default"===this.contentFittingMode&&fitToView(activeView,this._views.textView,this.padding,!1),"fill"===this.contentFittingMode){this._views.textView.scale.set(1);var availableWidth=activeView.width-2*this.padding,availableHeight=activeView.height-2*this.padding,targetScaleX=availableWidth/this._views.textView.width,targetScaleY=availableHeight/this._views.textView.height,scale=Math.min(targetScaleX,targetScaleY);this._views.textView.scale.set(scale*this._defaultTextScale.x,scale*this._defaultTextScale.y)}this._views.textView.x=activeView.x+activeView.width/2,this._views.textView.y=activeView.y+activeView.height/2}this._views.textView.anchor.set(anchorX,anchorY),this.setOffset(this._views.textView,state,this.textOffset)}}},{key:"adjustIconView",value:function adjustIconView(state){if(this._views.iconView){var activeView=this.getStateView(state);if(activeView){if(this.options.ignoreRefitting||this._views.iconView.scale.set(this._defaultIconScale.x,this._defaultIconScale.y),"default"===this.contentFittingMode&&fitToView(activeView,this._views.iconView,this.padding,!1),"fill"===this.contentFittingMode){this._views.iconView.scale.set(1);var availableWidth=activeView.width-2*this.padding,availableHeight=activeView.height-2*this.padding,targetScaleX=availableWidth/this._views.iconView.width,targetScaleY=availableHeight/this._views.iconView.height,scale=Math.min(targetScaleX,targetScaleY);this._views.iconView.scale.set(scale*this._defaultIconScale.x,scale*this._defaultIconScale.y)}var _this$_defaultIconAnc=this._defaultIconAnchor,anchorX=_this$_defaultIconAnc.x,anchorY=_this$_defaultIconAnc.y;"anchor"in this._views.iconView?this._views.iconView.anchor.set(anchorX,anchorY):this._views.iconView.pivot.set(anchorX*(this._views.iconView.width/this._views.iconView.scale.x),anchorY*(this._views.iconView.height/this._views.iconView.scale.y)),this._views.iconView.x=activeView.x+activeView.width/2,this._views.iconView.y=activeView.y+activeView.height/2,this.setOffset(this._views.iconView,state,this.iconOffset)}}}},{key:"updateAnchor",value:function updateAnchor(){var _this$anchor$x,_this$anchor$y;if(this._views){var anchorX=null!==(_this$anchor$x=this.anchor.x)&&void 0!==_this$anchor$x?_this$anchor$x:0,anchorY=null!==(_this$anchor$y=this.anchor.y)&&void 0!==_this$anchor$y?_this$anchor$y:0;if([this._views.defaultView,this._views.hoverView,this._views.pressedView,this._views.disabledView].forEach((function(view){var _anchor;view&&(null===(_anchor=view.anchor)||void 0===_anchor||_anchor.set(0),view.x=-view.width*anchorX,view.y=-view.height*anchorY)})),this._views.defaultView){var _this$_views$defaultV2=this._views.defaultView,x=_this$_views$defaultV2.x,y=_this$_views$defaultV2.y,width=_this$_views$defaultV2.width,height=_this$_views$defaultV2.height;this.hitArea=new lib.M_G(x,y,width,height)}this.adjustIconView(this.state),this.adjustTextView(this.state)}}},{key:"contentFittingMode",get:function get(){var _this$options$content;return null!==(_this$options$content=this.options.contentFittingMode)&&void 0!==_this$options$content?_this$options$content:"default"},set:function set(mode){this.options.contentFittingMode=mode}},{key:"defaultView",get:function get(){return this._views.defaultView},set:function set(view){this.updateView("defaultView",view)}},{key:"hoverView",get:function get(){return this._views.hoverView},set:function set(view){this.updateView("hoverView",view),this._views.hoverView&&"hover"!==this.state&&(this._views.hoverView.visible=!1)}},{key:"pressedView",get:function get(){return this._views.pressedView},set:function set(view){this.updateView("pressedView",view),this._views.pressedView&&(this._views.pressedView.visible=!1)}},{key:"disabledView",get:function get(){return this._views.disabledView},set:function set(view){this.updateView("disabledView",view),this._views.disabledView&&(this._views.disabledView.visible=!1)}},{key:"updateView",value:function updateView(viewType,view){var _this$options2;void 0!==view&&(this.removeView(viewType),null!==view&&(null!==(_this$options2=this.options)&&void 0!==_this$options2&&_this$options2.nineSliceSprite&&("string"==typeof view?this._views[viewType]=new lib.QL7({texture:lib.gPd.from(view),leftWidth:this.options.nineSliceSprite[0],topHeight:this.options.nineSliceSprite[1],rightWidth:this.options.nineSliceSprite[2],bottomHeight:this.options.nineSliceSprite[3]}):view instanceof lib.gPd?this._views[viewType]=new lib.QL7({texture:view,leftWidth:this.options.nineSliceSprite[0],topHeight:this.options.nineSliceSprite[1],rightWidth:this.options.nineSliceSprite[2],bottomHeight:this.options.nineSliceSprite[3]}):console.warn("NineSliceSprite can not be used with views set as Container. Pass the texture or texture name as instead of the Container extended instance.")),this._views[viewType]||(this._views[viewType]=(0,helpers_view.K)(view)),this.setOffset(this._views[viewType],this.state,this.offset),this._views[viewType].parent||this.innerView.addChild(this._views[viewType]),this.updateAnchor(),this._views.iconView&&this.innerView.addChild(this._views.iconView),this._views.textView&&this.innerView.addChild(this._views.textView),this.setState(this.state,!0)))}},{key:"removeView",value:function removeView(viewType){this._views[viewType]&&(this.innerView.removeChild(this._views[viewType]),this._views[viewType]=null)}},{key:"textView",get:function get(){return this._views.textView},set:function set(textView){void 0!==textView&&(this.removeView("textView"),null!==textView&&this.createTextView(textView))}},{key:"iconView",get:function get(){return this._views.iconView},set:function set(view){var _this$options3;if(void 0!==view&&(this.removeView("iconView"),null!==view)){if(this._views.iconView=(0,helpers_view.K)(view),void 0===(null===(_this$options3=this.options)||void 0===_this$options3?void 0:_this$options3.defaultIconScale)){var _this$_views$iconView=this._views.iconView.scale,x=_this$_views$iconView.x,y=_this$_views$iconView.y;this._defaultIconScale={x,y}}this._views.iconView.parent||this.innerView.addChild(this._views.iconView),this.setState(this.state,!0)}}},{key:"playAnimations",value:function playAnimations(state){var _this$animations$stat;if(this.animations){if("default"===state&&!this.originalInnerViewState){var _this$animations;this.originalInnerViewState={x:this.innerView.x,y:this.innerView.y,width:this.innerView.width,height:this.innerView.height,scale:{x:this.innerView.scale.x,y:this.innerView.scale.y}};var _defaultStateAnimatio,_defaultStateAnimatio2,_defaultStateAnimatio3,_defaultStateAnimatio4,_defaultStateAnimatio5,_defaultStateAnimatio6,defaultStateAnimation=null===(_this$animations=this.animations)||void 0===_this$animations?void 0:_this$animations.default;if(defaultStateAnimation)return this.innerView.x=null!==(_defaultStateAnimatio=defaultStateAnimation.props.x)&&void 0!==_defaultStateAnimatio?_defaultStateAnimatio:this.originalInnerViewState.x,this.innerView.y=null!==(_defaultStateAnimatio2=defaultStateAnimation.props.y)&&void 0!==_defaultStateAnimatio2?_defaultStateAnimatio2:this.originalInnerViewState.y,this.innerView.width=null!==(_defaultStateAnimatio3=defaultStateAnimation.props.width)&&void 0!==_defaultStateAnimatio3?_defaultStateAnimatio3:this.originalInnerViewState.width,this.innerView.height=null!==(_defaultStateAnimatio4=defaultStateAnimation.props.height)&&void 0!==_defaultStateAnimatio4?_defaultStateAnimatio4:this.originalInnerViewState.height,this.innerView.scale.x=null!==(_defaultStateAnimatio5=defaultStateAnimation.props.scale.x)&&void 0!==_defaultStateAnimatio5?_defaultStateAnimatio5:this.originalInnerViewState.scale.x,void(this.innerView.scale.y=null!==(_defaultStateAnimatio6=defaultStateAnimation.props.scale.y)&&void 0!==_defaultStateAnimatio6?_defaultStateAnimatio6:this.originalInnerViewState.scale.y)}var stateAnimation=null!==(_this$animations$stat=this.animations[state])&&void 0!==_this$animations$stat?_this$animations$stat:this.animations.default;if(stateAnimation){var data=stateAnimation;return this.defaultDuration=data.duration,void new tweedle_es.K(this.innerView).to(data.props,data.duration).start()}new tweedle_es.K(this.innerView).to(this.originalInnerViewState,this.defaultDuration).start()}}},{key:"initStateControl",value:function initStateControl(){var _this2=this;this.onDown.connect((function(){_this2.setState("pressed")})),this.onUp.connect((function(){lib.FrL.any?_this2.setState("default"):_this2.setState("hover")})),this.onUpOut.connect((function(){_this2.setState("default")})),this.onOut.connect((function(){_this2.button.isDown||_this2.setState("default")})),this.onPress.connect((function(){lib.FrL.any?_this2.setState("default"):_this2.setState("hover")})),this.onHover.connect((function(){_this2.button.isDown||(lib.FrL.any?_this2.setState("default"):_this2.setState("hover"))}))}},{key:"padding",get:function get(){return this._padding},set:function set(padding){this._padding=padding,this.adjustTextView(this.state),this.adjustIconView(this.state)}},{key:"offset",get:function get(){return this._offset},set:function set(offset){this._offset=offset,this.updateAnchor()}},{key:"textOffset",get:function get(){return this._textOffset},set:function set(textOffset){this._textOffset=textOffset,this.adjustTextView(this.state)}},{key:"defaultTextScale",get:function get(){return this.defaultTextScale},set:function set(scale){var _scale$x,_scale$y;if(void 0!==scale){this.options.defaultTextScale=scale;var isNumber="number"==typeof scale;this._defaultTextScale.x=isNumber?scale:null!==(_scale$x=scale.x)&&void 0!==_scale$x?_scale$x:1,this._defaultTextScale.y=isNumber?scale:null!==(_scale$y=scale.y)&&void 0!==_scale$y?_scale$y:1,this.adjustTextView(this.state)}}},{key:"defaultIconScale",get:function get(){return this.defaultIconScale},set:function set(scale){var _scale$x2,_scale$y2;if(void 0!==scale){this.options.defaultIconScale=scale;var isNumber="number"==typeof scale;this._defaultIconScale.x=isNumber?scale:null!==(_scale$x2=scale.x)&&void 0!==_scale$x2?_scale$x2:1,this._defaultIconScale.y=isNumber?scale:null!==(_scale$y2=scale.y)&&void 0!==_scale$y2?_scale$y2:1,this.adjustIconView(this.state)}}},{key:"defaultTextAnchor",get:function get(){return this.defaultTextAnchor},set:function set(anchor){var _anchor$x,_anchor$y;if(void 0!==anchor){this.options.defaultTextAnchor=anchor;var isNumber="number"==typeof anchor;this._defaultTextAnchor.x=isNumber?anchor:null!==(_anchor$x=anchor.x)&&void 0!==_anchor$x?_anchor$x:1,this._defaultTextAnchor.y=isNumber?anchor:null!==(_anchor$y=anchor.y)&&void 0!==_anchor$y?_anchor$y:1,this.adjustTextView(this.state)}}},{key:"defaultIconAnchor",get:function get(){return this.defaultIconAnchor},set:function set(anchor){var _anchor$x2,_anchor$y2;if(void 0!==anchor){this.options.defaultIconAnchor=anchor;var isNumber="number"==typeof anchor;this._defaultIconAnchor.x=isNumber?anchor:null!==(_anchor$x2=anchor.x)&&void 0!==_anchor$x2?_anchor$x2:1,this._defaultIconAnchor.y=isNumber?anchor:null!==(_anchor$y2=anchor.y)&&void 0!==_anchor$y2?_anchor$y2:1,this.adjustIconView(this.state)}}},{key:"width",get:function get(){return _superPropGet(FancyButton,"width",this,1)},set:function set(width){var _this$options4;null!==(_this$options4=this.options)&&void 0!==_this$options4&&_this$options4.nineSliceSprite?(this._views.defaultView&&(this._views.defaultView.width=width),this._views.hoverView&&(this._views.hoverView.width=width),this._views.pressedView&&(this._views.pressedView.width=width),this._views.disabledView&&(this._views.disabledView.width=width),this.adjustTextView(this.state),this.adjustIconView(this.state),this.updateAnchor()):_superPropSet(FancyButton,"width",width,this,1,1)}},{key:"height",get:function get(){return _superPropGet(FancyButton,"height",this,1)},set:function set(height){var _this$options5;null!==(_this$options5=this.options)&&void 0!==_this$options5&&_this$options5.nineSliceSprite?(this._views.defaultView&&(this._views.defaultView.height=height),this._views.hoverView&&(this._views.hoverView.height=height),this._views.pressedView&&(this._views.pressedView.height=height),this._views.disabledView&&(this._views.disabledView.height=height),this.adjustTextView(this.state),this.adjustIconView(this.state),this.updateAnchor()):_superPropSet(FancyButton,"height",height,this,1,1)}},{key:"setSize",value:function setSize(value,height){var _this$options6;null!==(_this$options6=this.options)&&void 0!==_this$options6&&_this$options6.nineSliceSprite?(this._views.defaultView&&this._views.defaultView.setSize(value,height),this._views.hoverView&&this._views.hoverView.setSize(value,height),this._views.pressedView&&this._views.pressedView.setSize(value,height),this._views.disabledView&&this._views.disabledView.setSize(value,height),this.adjustTextView(this.state),this.adjustIconView(this.state),this.updateAnchor()):_superPropGet(FancyButton,"setSize",this,3)([value,height])}}])}(Button.E)},"./src/stories/utils/argTypes.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}__webpack_require__.d(__webpack_exports__,{U:()=>argTypes,p:()=>getDefaultArgs});var controls={select:{control:{type:"select"}},check:{control:{type:"check"}},color:{control:{type:"color"}},amount:{control:{type:"range"}},type:{control:{type:"radio"}},date:{control:{type:"date"}},switch:{control:{type:"boolean"}}},argTypes=function argTypes(args){var exportArgTypes={};for(var key in args)if("number"==typeof args[key]){var min=0,arg=args[key];key.includes("font")&&(min=1),exportArgTypes[key]=arg>=0?arg>=100?{control:{type:"range",min,max:1e3,step:10}}:arg>10?{control:{type:"range",min,max:100,step:1}}:0!==arg&&arg<1?{control:{type:"range",min:0,max:1,step:.1}}:{control:{type:"range",min,max:10,step:1}}:arg<=-100?{control:{type:"range",min:-1e3,max:1e3,step:10}}:arg<-10?{control:{type:"range",min:-100,max:100,step:10}}:0!==arg&&arg>-1?{control:{type:"range",min:-1,max:0,step:.1}}:{control:{type:"range",min:-10,max:10,step:1}}}else switch(getArgType(key)&&(exportArgTypes[key]=getArgType(key)),_typeof(args[key])){case"object":exportArgTypes[key]=controls.select,Array.isArray(args[key])?exportArgTypes[key].options=args[key]:exportArgTypes[key].options=Object.keys(args).map((function(key){return args[key]}));break;case"boolean":exportArgTypes[key]=controls.switch}return exportArgTypes};function getArgType(type){for(var control in controls)if(type.toLowerCase().indexOf(control)>-1)return controls[control]}var getDefaultArgs=function getDefaultArgs(args){var exportArgs={};for(var key in args)if("object"===_typeof(args[key]))Array.isArray(args[key])&&(exportArgs[key]=args[key][0]);else exportArgs[key]=args[key];return exportArgs}},"./src/utils/helpers/resize.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function centerElement(view,horPos,verPos){var canvas=document.getElementById("storybook-root");view.width>0?view.x=0===horPos?0:horPos?canvas.offsetWidth*horPos-view.width/2:canvas.offsetWidth/2-view.width/2:view.x=canvas.offsetWidth/2,view.height>0?view.y=0===verPos?0:verPos?canvas.offsetHeight*verPos-view.height/2:canvas.offsetHeight/2-view.height/2:view.y=canvas.offsetHeight/2}function centerView(view){var canvas=document.getElementById("storybook-root");view.x=canvas.offsetWidth/2,view.y=canvas.offsetHeight/2}__webpack_require__.d(__webpack_exports__,{E:()=>centerElement,l:()=>centerView})},"./src/utils/helpers/view.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{K:()=>getView});var pixi_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/pixi.js/lib/index.mjs");function getView(view){return"string"==typeof view?pixi_js__WEBPACK_IMPORTED_MODULE_0__.kxk.from(view):view instanceof pixi_js__WEBPACK_IMPORTED_MODULE_0__.gPd?new pixi_js__WEBPACK_IMPORTED_MODULE_0__.kxk(view):view}}}]);