/*! For license information please see progressBar-ProgressBarSprite-stories.676a6ae4.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[670],{"./src/stories/progressBar/ProgressBarSprite.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Sprite:()=>Sprite,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _utils_argTypes__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/stories/utils/argTypes.ts"),_ProgressBar__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/ProgressBar.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/utils/helpers/resize.ts"),_utils_loader__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/stories/utils/loader.ts"),_List__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/List.ts"),args={value:50,animate:!0,vertical:!1},Sprite=function Sprite(_ref){var progressBar,value=_ref.value,animate=_ref.animate,vertical=_ref.vertical,view=new _List__WEBPACK_IMPORTED_MODULE_0__.a({type:"vertical",elementsMargin:10});(0,_utils_loader__WEBPACK_IMPORTED_MODULE_1__.M)(["slider_bg.png","slider_progress.png"]).then((function(){progressBar=new _ProgressBar__WEBPACK_IMPORTED_MODULE_2__.k({bg:"slider_bg.png",fill:"slider_progress.png",progress:value,fillPaddings:{top:3,left:4.5}}),view.addChild(progressBar),vertical?(progressBar.rotation=-Math.PI/2,view.y+=view.height/2):view.x+=-view.width/2}));var isFilling=!0;return{view,resize:function resize(){(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_3__.w)(view),vertical&&(view.y+=view.height)},update:function update(){animate&&(isFilling?value++:value--,value>150?isFilling=!1:value<-50&&(isFilling=!0),progressBar&&(progressBar.progress=value))}}};const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:"import { argTypes, getDefaultArgs } from '../utils/argTypes';\nimport { ProgressBar } from '../../ProgressBar';\nimport { centerElement } from '../../utils/helpers/resize';\nimport { preload } from '../utils/loader';\nimport type { StoryFn } from '@storybook/types';\nimport { List } from '../../List';\n\nconst args = {\n    value: 50,\n    animate: true,\n    vertical: false\n};\n\nexport const Sprite: StoryFn = ({ value, animate, vertical }: any) =>\n{\n    const view = new List({ type: 'vertical', elementsMargin: 10 });\n\n    const assets = ['slider_bg.png', 'slider_progress.png'];\n\n    let progressBar: ProgressBar;\n\n    preload(assets).then(() =>\n    {\n        // Component usage !!!\n        progressBar = new ProgressBar({\n            bg: 'slider_bg.png',\n            fill: 'slider_progress.png',\n            progress: value,\n            fillPaddings: {\n                top: 3,\n                left: 4.5,\n            }\n        });\n\n        view.addChild(progressBar);\n\n        if (vertical)\n        {\n            progressBar.rotation = -Math.PI / 2;\n            view.y += view.height / 2;\n        }\n        else\n        {\n            view.x += -view.width / 2;\n        }\n    });\n\n    let isFilling = true;\n\n    return {\n        view,\n        resize: () =>\n        {\n            centerElement(view);\n            if (vertical)\n            {\n                view.y += view.height;\n            }\n        },\n        update: () =>\n        {\n            if (!animate)\n            {\n                return;\n            }\n\n            isFilling ? value++ : value--;\n\n            if (value > 150)\n            {\n                isFilling = false;\n            }\n            else if (value < -50)\n            {\n                isFilling = true;\n            }\n\n            if (progressBar)\n            {\n                progressBar.progress = value;\n            }\n        }\n    };\n};\n\nexport default {\n    title: 'Components/ProgressBar/Sprite',\n    argTypes: argTypes(args),\n    args: getDefaultArgs(args)\n};\n",locationsMap:{sprite:{startLoc:{col:31,line:14},endLoc:{col:1,line:84},startBody:{col:31,line:14},endBody:{col:1,line:84}}}}},title:"Components/ProgressBar/Sprite",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_4__.P)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_4__.V)(args)};var __namedExportsOrder=["Sprite"]},"./src/ProgressBar.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{k:()=>ProgressBar});var _pixi_display__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/display/lib/index.mjs"),_pixi_core__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@pixi/core/lib/index.mjs"),_pixi_sprite__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@pixi/sprite/lib/index.mjs"),_utils_helpers_view__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/utils/helpers/view.ts"),_pixi_mesh_extras__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@pixi/mesh-extras/lib/index.mjs"),_pixi_graphics__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@pixi/graphics/lib/index.mjs");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function _construct(Parent,args,Class){return _construct=_isNativeReflectConstruct()?Reflect.construct.bind():function _construct(Parent,args,Class){var a=[null];a.push.apply(a,args);var instance=new(Function.bind.apply(Parent,a));return Class&&_setPrototypeOf(instance,Class.prototype),instance},_construct.apply(null,arguments)}function _toConsumableArray(arr){return function _arrayWithoutHoles(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr)}(arr)||function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,_toPropertyKey(descriptor.key),descriptor)}}function _get(){return _get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function _get(target,property,receiver){var base=_superPropBase(target,property);if(base){var desc=Object.getOwnPropertyDescriptor(base,property);return desc.get?desc.get.call(arguments.length<3?target:receiver):desc.value}},_get.apply(this,arguments)}function set(target,property,value,receiver){return set="undefined"!=typeof Reflect&&Reflect.set?Reflect.set:function set(target,property,value,receiver){var desc,base=_superPropBase(target,property);if(base){if((desc=Object.getOwnPropertyDescriptor(base,property)).set)return desc.set.call(receiver,value),!0;if(!desc.writable)return!1}if(desc=Object.getOwnPropertyDescriptor(receiver,property)){if(!desc.writable)return!1;desc.value=value,Object.defineProperty(receiver,property,desc)}else _defineProperty(receiver,property,value);return!0},set(target,property,value,receiver)}function _set(target,property,value,receiver,isStrict){if(!set(target,property,value,receiver||target)&&isStrict)throw new TypeError("failed to set property");return value}function _superPropBase(object,property){for(;!Object.prototype.hasOwnProperty.call(object,property)&&null!==(object=_getPrototypeOf(object)););return object}function _setPrototypeOf(o,p){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function _setPrototypeOf(o,p){return o.__proto__=p,o},_setPrototypeOf(o,p)}function _createSuper(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct();return function _createSuperInternal(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return function _possibleConstructorReturn(self,call){if(call&&("object"===_typeof(call)||"function"==typeof call))return call;if(void 0!==call)throw new TypeError("Derived constructors may only return object or undefined");return _assertThisInitialized(self)}(this,result)}}function _assertThisInitialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function _getPrototypeOf(o){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf.bind():function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)},_getPrototypeOf(o)}function _defineProperty(obj,key,value){return(key=_toPropertyKey(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}var ProgressBar=function(_Container){!function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),Object.defineProperty(subClass,"prototype",{writable:!1}),superClass&&_setPrototypeOf(subClass,superClass)}(ProgressBar,_Container);var _super=_createSuper(ProgressBar);function ProgressBar(options){var _this;return function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,ProgressBar),_defineProperty(_assertThisInitialized(_this=_super.call(this)),"progressStart",0),_defineProperty(_assertThisInitialized(_this),"_progress",0),_this.options=options,_this.innerView=new _pixi_display__WEBPACK_IMPORTED_MODULE_0__.W2,_this.addChild(_this.innerView),null!=options&&options.bg&&null!=options&&options.fill&&_this.init(options),_this}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(ProgressBar,[{key:"init",value:function init(_ref){var bg=_ref.bg,fill=_ref.fill,fillPaddings=_ref.fillPaddings,progress=_ref.progress;this.setBackground(bg),this.setFill(fill,fillPaddings),this.progress=progress}},{key:"setBackground",value:function setBackground(bg){var _this$options;this.bg&&this.bg.destroy(),null!==(_this$options=this.options)&&void 0!==_this$options&&_this$options.nineSlicePlane&&("string"==typeof bg?this.bg=_construct(_pixi_mesh_extras__WEBPACK_IMPORTED_MODULE_3__.ZT,[_pixi_core__WEBPACK_IMPORTED_MODULE_1__.xE.from(bg)].concat(_toConsumableArray(this.options.nineSlicePlane.bg))):console.warn("NineSlicePlane can not be used with views set as Container.")),bg instanceof _pixi_graphics__WEBPACK_IMPORTED_MODULE_4__.TC&&(this.bg=bg),!this.bg&&("string"==typeof bg||bg instanceof _pixi_sprite__WEBPACK_IMPORTED_MODULE_2__.j)&&(this.bg=(0,_utils_helpers_view__WEBPACK_IMPORTED_MODULE_5__.v)(bg)),this.innerView.addChildAt(this.bg,0)}},{key:"setFill",value:function setFill(fill,fillPadding){var _this$options2,_fillPadding$left,_fillPadding$top;if(this.fill&&this.fill.destroy(),this.bg instanceof _pixi_sprite__WEBPACK_IMPORTED_MODULE_2__.j&&fill===this.bg)console.warn("Can not use same Sprite instance for bg and fill.");else{null!==(_this$options2=this.options)&&void 0!==_this$options2&&_this$options2.nineSlicePlane&&("string"==typeof fill?this.fill=_construct(_pixi_mesh_extras__WEBPACK_IMPORTED_MODULE_3__.ZT,[_pixi_core__WEBPACK_IMPORTED_MODULE_1__.xE.from(fill)].concat(_toConsumableArray(this.options.nineSlicePlane.fill))):console.warn("NineSlicePlane can not be used with views set as Container.")),this.fill||(fill instanceof _pixi_graphics__WEBPACK_IMPORTED_MODULE_4__.TC?this.fill=fill:this.fill=(0,_utils_helpers_view__WEBPACK_IMPORTED_MODULE_5__.v)(fill)),this.innerView.addChildAt(this.fill,1);var offsetX=null!==(_fillPadding$left=null==fillPadding?void 0:fillPadding.left)&&void 0!==_fillPadding$left?_fillPadding$left:0,offsetY=null!==(_fillPadding$top=null==fillPadding?void 0:fillPadding.top)&&void 0!==_fillPadding$top?_fillPadding$top:0;this.fill.x=offsetX,this.fill.y=offsetY,this.fillMask&&(this.fill.mask=null,this.fillMask.destroy());var leftWidth=this.fill.width/2,rightWidth=this.fill.width/2,topHeight=this.fill.height/2,bottomHeight=this.fill.height/2,texture=_pixi_core__WEBPACK_IMPORTED_MODULE_1__.xE.WHITE;this.fill instanceof _pixi_sprite__WEBPACK_IMPORTED_MODULE_2__.j&&this.fill.texture&&(texture=this.fill.texture),this.fillMask=new _pixi_mesh_extras__WEBPACK_IMPORTED_MODULE_3__.ZT(texture,leftWidth,topHeight,rightWidth,bottomHeight),this.fill.addChild(this.fillMask),this.fill.mask=this.fillMask}}},{key:"validate",value:function validate(progress){return(progress=Math.round(progress))<0?0:progress>100?100:progress}},{key:"progress",get:function get(){return this._progress},set:function set(progress){this._progress=this.validate(progress),this.fill&&this.fillMask&&(this.fillMask.width=this.fill.width/100*(this._progress-this.progressStart),this.fillMask.x=this.progressStart/100*this.fill.width,this.fillMask.height=this.fill.height)}},{key:"width",get:function get(){return _get(_getPrototypeOf(ProgressBar.prototype),"width",this)},set:function set(width){var _this$options3;if(null!==(_this$options3=this.options)&&void 0!==_this$options3&&_this$options3.nineSlicePlane){if(this.bg&&(this.bg.width=width),this.fill){var _this$options$fillPad,_this$options$fillPad2,_this$options$fillPad3,_this$options$fillPad4,leftPadding=null!==(_this$options$fillPad=null===(_this$options$fillPad2=this.options.fillPaddings)||void 0===_this$options$fillPad2?void 0:_this$options$fillPad2.left)&&void 0!==_this$options$fillPad?_this$options$fillPad:0,rightPadding=null!==(_this$options$fillPad3=null===(_this$options$fillPad4=this.options.fillPaddings)||void 0===_this$options$fillPad4?void 0:_this$options$fillPad4.right)&&void 0!==_this$options$fillPad3?_this$options$fillPad3:0;this.fill.width=width-leftPadding-rightPadding,this.fillMask.width=width-leftPadding-rightPadding}this.progress=this._progress}else _set(_getPrototypeOf(ProgressBar.prototype),"width",width,this,!0)}},{key:"height",get:function get(){return _get(_getPrototypeOf(ProgressBar.prototype),"height",this)},set:function set(height){var _this$options4;if(null!==(_this$options4=this.options)&&void 0!==_this$options4&&_this$options4.nineSlicePlane){if(this.bg&&(this.bg.height=height),this.fill){var _this$options$fillPad5,_this$options$fillPad6,_this$options$fillPad7,_this$options$fillPad8,topPadding=null!==(_this$options$fillPad5=null===(_this$options$fillPad6=this.options.fillPaddings)||void 0===_this$options$fillPad6?void 0:_this$options$fillPad6.top)&&void 0!==_this$options$fillPad5?_this$options$fillPad5:0,bottomPadding=null!==(_this$options$fillPad7=null===(_this$options$fillPad8=this.options.fillPaddings)||void 0===_this$options$fillPad8?void 0:_this$options$fillPad8.bottom)&&void 0!==_this$options$fillPad7?_this$options$fillPad7:0;this.fill.height=height-topPadding-bottomPadding,this.fillMask.height=height-topPadding-bottomPadding}this.progress=this._progress}else _set(_getPrototypeOf(ProgressBar.prototype),"height",height,this,!0)}}]),ProgressBar}(_pixi_display__WEBPACK_IMPORTED_MODULE_0__.W2)},"./src/stories/utils/loader.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{M:()=>preload});var _pixi_assets__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/assets/lib/index.mjs");function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function _regeneratorRuntime(){_regeneratorRuntime=function _regeneratorRuntime(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function define(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{define({},"")}catch(t){define=function define(t,e,r){return t[e]=r}}function wrap(t,e,r,n){var i=e&&e.prototype instanceof Generator?e:Generator,a=Object.create(i.prototype),c=new Context(n||[]);return o(a,"_invoke",{value:makeInvokeMethod(t,r,c)}),a}function tryCatch(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=wrap;var h="suspendedStart",l="suspendedYield",f="executing",s="completed",y={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}var p={};define(p,a,(function(){return this}));var d=Object.getPrototypeOf,v=d&&d(d(values([])));v&&v!==r&&n.call(v,a)&&(p=v);var g=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(p);function defineIteratorMethods(t){["next","throw","return"].forEach((function(e){define(t,e,(function(t){return this._invoke(e,t)}))}))}function AsyncIterator(t,e){function invoke(r,o,i,a){var c=tryCatch(t[r],t,o);if("throw"!==c.type){var u=c.arg,h=u.value;return h&&"object"==_typeof(h)&&n.call(h,"__await")?e.resolve(h.__await).then((function(t){invoke("next",t,i,a)}),(function(t){invoke("throw",t,i,a)})):e.resolve(h).then((function(t){u.value=t,i(u)}),(function(t){return invoke("throw",t,i,a)}))}a(c.arg)}var r;o(this,"_invoke",{value:function value(t,n){function callInvokeWithMethodAndArg(){return new e((function(e,r){invoke(t,n,e,r)}))}return r=r?r.then(callInvokeWithMethodAndArg,callInvokeWithMethodAndArg):callInvokeWithMethodAndArg()}})}function makeInvokeMethod(e,r,n){var o=h;return function(i,a){if(o===f)throw new Error("Generator is already running");if(o===s){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=maybeInvokeDelegate(c,n);if(u){if(u===y)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===h)throw o=s,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=f;var p=tryCatch(e,r,n);if("normal"===p.type){if(o=n.done?s:l,p.arg===y)continue;return{value:p.arg,done:n.done}}"throw"===p.type&&(o=s,n.method="throw",n.arg=p.arg)}}}function maybeInvokeDelegate(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,maybeInvokeDelegate(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),y;var i=tryCatch(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,y;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,y):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,y)}function pushTryEntry(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function resetTryEntry(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function Context(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(pushTryEntry,this),this.reset(!0)}function values(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function next(){for(;++o<e.length;)if(n.call(e,o))return next.value=e[o],next.done=!1,next;return next.value=t,next.done=!0,next};return i.next=i}}throw new TypeError(_typeof(e)+" is not iterable")}return GeneratorFunction.prototype=GeneratorFunctionPrototype,o(g,"constructor",{value:GeneratorFunctionPrototype,configurable:!0}),o(GeneratorFunctionPrototype,"constructor",{value:GeneratorFunction,configurable:!0}),GeneratorFunction.displayName=define(GeneratorFunctionPrototype,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===GeneratorFunction||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,GeneratorFunctionPrototype):(t.__proto__=GeneratorFunctionPrototype,define(t,u,"GeneratorFunction")),t.prototype=Object.create(g),t},e.awrap=function(t){return{__await:t}},defineIteratorMethods(AsyncIterator.prototype),define(AsyncIterator.prototype,c,(function(){return this})),e.AsyncIterator=AsyncIterator,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new AsyncIterator(wrap(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},defineIteratorMethods(g),define(g,u,"Generator"),define(g,a,(function(){return this})),define(g,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function next(){for(;r.length;){var t=r.pop();if(t in e)return next.value=t,next.done=!1,next}return next.done=!0,next}},e.values=values,Context.prototype={constructor:Context,reset:function reset(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(resetTryEntry),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function stop(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function dispatchException(e){if(this.done)throw e;var r=this;function handle(n,o){return a.type="throw",a.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return handle("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),u=n.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return handle(i.catchLoc,!0);if(this.prev<i.finallyLoc)return handle(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return handle(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return handle(i.finallyLoc)}}}},abrupt:function abrupt(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,y):this.complete(a)},complete:function complete(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),y},finish:function finish(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),resetTryEntry(r),y}},catch:function _catch(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;resetTryEntry(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function delegateYield(e,r,n){return this.delegate={iterator:values(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),y}},e}function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function preload(_x){return _preload.apply(this,arguments)}function _preload(){return _preload=function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}(_regeneratorRuntime().mark((function _callee(assets){return _regeneratorRuntime().wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:return _context.next=2,_pixi_assets__WEBPACK_IMPORTED_MODULE_0__.de.load(assets);case 2:case"end":return _context.stop()}}),_callee)}))),_preload.apply(this,arguments)}}}]);