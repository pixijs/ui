/*! For license information please see scrollBox-ScrollBoxSprite-stories.10e6077f.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[935],{"./src/stories/scrollBox/ScrollBoxSprite.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{UseSprite:()=>UseSprite,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _pixi_sprite__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/sprite/lib/index.mjs"),_pixi_display__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@pixi/display/lib/index.mjs"),_pixi_text__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@pixi/text/lib/index.mjs"),_utils_argTypes__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./src/stories/utils/argTypes.ts"),_ScrollBox__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/ScrollBox.ts"),_FancyButton__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./src/FancyButton.ts"),_utils_helpers_styles__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./src/utils/helpers/styles.ts"),_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs"),_utils_loader__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/stories/utils/loader.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/utils/helpers/resize.ts"),_utils_color__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/stories/utils/color.ts");function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var args={fontColor:"#000000",elementsMargin:6,itemsAmount:100,disableEasing:!1,onPress:(0,_storybook_addon_actions__WEBPACK_IMPORTED_MODULE_3__.aD)("Button pressed")},UseSprite=function UseSprite(_ref){var fontColor=_ref.fontColor,elementsMargin=_ref.elementsMargin,itemsAmount=_ref.itemsAmount,onPress=_ref.onPress,disableEasing=_ref.disableEasing;fontColor=(0,_utils_color__WEBPACK_IMPORTED_MODULE_4__.Lq)(fontColor);var view=new _pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2;return(0,_utils_loader__WEBPACK_IMPORTED_MODULE_5__.M)(["window.png","SmallButton.png","SmallButton-hover.png","SmallButton-pressed.png"]).then((function(){var window=_pixi_sprite__WEBPACK_IMPORTED_MODULE_0__.j.from("window.png"),title=new _pixi_text__WEBPACK_IMPORTED_MODULE_2__.xv("Levels",{fill:0,fontSize:40});title.anchor.set(.5),window.addChild(title),title.x=window.width/2,title.y=25,view.addChild(window);var items=function createItems(itemsAmount,fontColor,onPress){for(var items=[],_loop=function _loop(i){var button=new _FancyButton__WEBPACK_IMPORTED_MODULE_8__.s({defaultView:"SmallButton.png",hoverView:"SmallButton-hover.png",pressedView:"SmallButton-pressed.png",text:new _pixi_text__WEBPACK_IMPORTED_MODULE_2__.xv(i+1,_objectSpread(_objectSpread({},_utils_helpers_styles__WEBPACK_IMPORTED_MODULE_9__.B),{},{fontSize:68,fill:fontColor})),textOffset:{x:0,y:-7}});button.anchor.set(0),button.scale.set(.5),button.onPress.connect((function(){return onPress(i+1)})),items.push(button)},i=0;i<itemsAmount;i++)_loop(i);return items}(itemsAmount,fontColor,onPress),scrollBox=new _ScrollBox__WEBPACK_IMPORTED_MODULE_6__.D({elementsMargin,width:window.width-80,height:window.height-90,vertPadding:18,radius:5,disableEasing});scrollBox.addItems(items),scrollBox.x=window.width/2-scrollBox.width/2,scrollBox.y=window.height/2-scrollBox.height/2+18,window.addChild(scrollBox),(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_7__.w)(view)})),{view,resize:function resize(){return(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_7__.w)(view)}}};const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:"import { Sprite } from '@pixi/sprite';\nimport { Container } from '@pixi/display';\nimport { Text } from '@pixi/text';\nimport { argTypes, getDefaultArgs } from '../utils/argTypes';\nimport { ScrollBox } from '../../ScrollBox';\nimport { FancyButton } from '../../FancyButton';\nimport { defaultTextStyle } from '../../utils/helpers/styles';\nimport { action } from '@storybook/addon-actions';\nimport { preload } from '../utils/loader';\nimport { centerElement } from '../../utils/helpers/resize';\nimport type { StoryFn } from '@storybook/types';\nimport { getColor } from '../utils/color';\n\nconst args = {\n    fontColor: '#000000',\n    elementsMargin: 6,\n    itemsAmount: 100,\n    disableEasing: false,\n    onPress: action('Button pressed')\n};\n\nexport const UseSprite: StoryFn = ({ fontColor, elementsMargin, itemsAmount, onPress, disableEasing }: any) =>\n{\n    fontColor = getColor(fontColor);\n\n    const view = new Container();\n\n    const assets = [`window.png`, `SmallButton.png`, `SmallButton-hover.png`, `SmallButton-pressed.png`];\n\n    preload(assets).then(() =>\n    {\n        const window = Sprite.from(`window.png`);\n        const title = new Text(`Levels`, { fill: 0x000000, fontSize: 40 });\n\n        title.anchor.set(0.5);\n        window.addChild(title);\n        title.x = window.width / 2;\n        title.y = 25;\n\n        view.addChild(window);\n\n        const items: Container[] = createItems(itemsAmount, fontColor, onPress);\n\n        // Component usage !!!\n        const scrollBox = new ScrollBox({\n            elementsMargin,\n            width: window.width - 80,\n            height: window.height - 90,\n            vertPadding: 18,\n            radius: 5,\n            disableEasing\n        });\n\n        scrollBox.addItems(items);\n\n        scrollBox.x = (window.width / 2) - (scrollBox.width / 2);\n        scrollBox.y = (window.height / 2) - (scrollBox.height / 2) + 18;\n\n        window.addChild(scrollBox);\n\n        centerElement(view);\n    });\n\n    return {\n        view,\n        resize: () => centerElement(view)\n    };\n};\n\nfunction createItems(itemsAmount: number, fontColor: number, onPress: (buttonID: number) => void): FancyButton[]\n{\n    const items = [];\n\n    for (let i = 0; i < itemsAmount; i++)\n    {\n        const button = new FancyButton({\n            defaultView: `SmallButton.png`,\n            hoverView: `SmallButton-hover.png`,\n            pressedView: `SmallButton-pressed.png`,\n            text: new Text(i + 1, {\n                ...defaultTextStyle,\n                fontSize: 68,\n                fill: fontColor\n            }),\n            textOffset: {\n                x: 0,\n                y: -7\n            }\n        });\n\n        button.anchor.set(0);\n        button.scale.set(0.5);\n\n        button.onPress.connect(() => onPress(i + 1));\n\n        items.push(button);\n    }\n\n    return items;\n}\n\nexport default {\n    title: 'Components/ScrollBox/Use Sprite',\n    argTypes: argTypes(args),\n    args: getDefaultArgs(args)\n};\n",locationsMap:{"use-sprite":{startLoc:{col:34,line:22},endLoc:{col:1,line:68},startBody:{col:34,line:22},endBody:{col:1,line:68}}}}},title:"Components/ScrollBox/Use Sprite",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_10__.P)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_10__.V)(args)};var __namedExportsOrder=["UseSprite"]},"./src/stories/utils/loader.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{M:()=>preload});var _pixi_assets__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/assets/lib/index.mjs");function _typeof(obj){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function _regeneratorRuntime(){_regeneratorRuntime=function _regeneratorRuntime(){return exports};var exports={},Op=Object.prototype,hasOwn=Op.hasOwnProperty,defineProperty=Object.defineProperty||function(obj,key,desc){obj[key]=desc.value},$Symbol="function"==typeof Symbol?Symbol:{},iteratorSymbol=$Symbol.iterator||"@@iterator",asyncIteratorSymbol=$Symbol.asyncIterator||"@@asyncIterator",toStringTagSymbol=$Symbol.toStringTag||"@@toStringTag";function define(obj,key,value){return Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}),obj[key]}try{define({},"")}catch(err){define=function define(obj,key,value){return obj[key]=value}}function wrap(innerFn,outerFn,self,tryLocsList){var protoGenerator=outerFn&&outerFn.prototype instanceof Generator?outerFn:Generator,generator=Object.create(protoGenerator.prototype),context=new Context(tryLocsList||[]);return defineProperty(generator,"_invoke",{value:makeInvokeMethod(innerFn,self,context)}),generator}function tryCatch(fn,obj,arg){try{return{type:"normal",arg:fn.call(obj,arg)}}catch(err){return{type:"throw",arg:err}}}exports.wrap=wrap;var ContinueSentinel={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}var IteratorPrototype={};define(IteratorPrototype,iteratorSymbol,(function(){return this}));var getProto=Object.getPrototypeOf,NativeIteratorPrototype=getProto&&getProto(getProto(values([])));NativeIteratorPrototype&&NativeIteratorPrototype!==Op&&hasOwn.call(NativeIteratorPrototype,iteratorSymbol)&&(IteratorPrototype=NativeIteratorPrototype);var Gp=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(IteratorPrototype);function defineIteratorMethods(prototype){["next","throw","return"].forEach((function(method){define(prototype,method,(function(arg){return this._invoke(method,arg)}))}))}function AsyncIterator(generator,PromiseImpl){function invoke(method,arg,resolve,reject){var record=tryCatch(generator[method],generator,arg);if("throw"!==record.type){var result=record.arg,value=result.value;return value&&"object"==_typeof(value)&&hasOwn.call(value,"__await")?PromiseImpl.resolve(value.__await).then((function(value){invoke("next",value,resolve,reject)}),(function(err){invoke("throw",err,resolve,reject)})):PromiseImpl.resolve(value).then((function(unwrapped){result.value=unwrapped,resolve(result)}),(function(error){return invoke("throw",error,resolve,reject)}))}reject(record.arg)}var previousPromise;defineProperty(this,"_invoke",{value:function value(method,arg){function callInvokeWithMethodAndArg(){return new PromiseImpl((function(resolve,reject){invoke(method,arg,resolve,reject)}))}return previousPromise=previousPromise?previousPromise.then(callInvokeWithMethodAndArg,callInvokeWithMethodAndArg):callInvokeWithMethodAndArg()}})}function makeInvokeMethod(innerFn,self,context){var state="suspendedStart";return function(method,arg){if("executing"===state)throw new Error("Generator is already running");if("completed"===state){if("throw"===method)throw arg;return doneResult()}for(context.method=method,context.arg=arg;;){var delegate=context.delegate;if(delegate){var delegateResult=maybeInvokeDelegate(delegate,context);if(delegateResult){if(delegateResult===ContinueSentinel)continue;return delegateResult}}if("next"===context.method)context.sent=context._sent=context.arg;else if("throw"===context.method){if("suspendedStart"===state)throw state="completed",context.arg;context.dispatchException(context.arg)}else"return"===context.method&&context.abrupt("return",context.arg);state="executing";var record=tryCatch(innerFn,self,context);if("normal"===record.type){if(state=context.done?"completed":"suspendedYield",record.arg===ContinueSentinel)continue;return{value:record.arg,done:context.done}}"throw"===record.type&&(state="completed",context.method="throw",context.arg=record.arg)}}}function maybeInvokeDelegate(delegate,context){var methodName=context.method,method=delegate.iterator[methodName];if(void 0===method)return context.delegate=null,"throw"===methodName&&delegate.iterator.return&&(context.method="return",context.arg=void 0,maybeInvokeDelegate(delegate,context),"throw"===context.method)||"return"!==methodName&&(context.method="throw",context.arg=new TypeError("The iterator does not provide a '"+methodName+"' method")),ContinueSentinel;var record=tryCatch(method,delegate.iterator,context.arg);if("throw"===record.type)return context.method="throw",context.arg=record.arg,context.delegate=null,ContinueSentinel;var info=record.arg;return info?info.done?(context[delegate.resultName]=info.value,context.next=delegate.nextLoc,"return"!==context.method&&(context.method="next",context.arg=void 0),context.delegate=null,ContinueSentinel):info:(context.method="throw",context.arg=new TypeError("iterator result is not an object"),context.delegate=null,ContinueSentinel)}function pushTryEntry(locs){var entry={tryLoc:locs[0]};1 in locs&&(entry.catchLoc=locs[1]),2 in locs&&(entry.finallyLoc=locs[2],entry.afterLoc=locs[3]),this.tryEntries.push(entry)}function resetTryEntry(entry){var record=entry.completion||{};record.type="normal",delete record.arg,entry.completion=record}function Context(tryLocsList){this.tryEntries=[{tryLoc:"root"}],tryLocsList.forEach(pushTryEntry,this),this.reset(!0)}function values(iterable){if(iterable){var iteratorMethod=iterable[iteratorSymbol];if(iteratorMethod)return iteratorMethod.call(iterable);if("function"==typeof iterable.next)return iterable;if(!isNaN(iterable.length)){var i=-1,next=function next(){for(;++i<iterable.length;)if(hasOwn.call(iterable,i))return next.value=iterable[i],next.done=!1,next;return next.value=void 0,next.done=!0,next};return next.next=next}}return{next:doneResult}}function doneResult(){return{value:void 0,done:!0}}return GeneratorFunction.prototype=GeneratorFunctionPrototype,defineProperty(Gp,"constructor",{value:GeneratorFunctionPrototype,configurable:!0}),defineProperty(GeneratorFunctionPrototype,"constructor",{value:GeneratorFunction,configurable:!0}),GeneratorFunction.displayName=define(GeneratorFunctionPrototype,toStringTagSymbol,"GeneratorFunction"),exports.isGeneratorFunction=function(genFun){var ctor="function"==typeof genFun&&genFun.constructor;return!!ctor&&(ctor===GeneratorFunction||"GeneratorFunction"===(ctor.displayName||ctor.name))},exports.mark=function(genFun){return Object.setPrototypeOf?Object.setPrototypeOf(genFun,GeneratorFunctionPrototype):(genFun.__proto__=GeneratorFunctionPrototype,define(genFun,toStringTagSymbol,"GeneratorFunction")),genFun.prototype=Object.create(Gp),genFun},exports.awrap=function(arg){return{__await:arg}},defineIteratorMethods(AsyncIterator.prototype),define(AsyncIterator.prototype,asyncIteratorSymbol,(function(){return this})),exports.AsyncIterator=AsyncIterator,exports.async=function(innerFn,outerFn,self,tryLocsList,PromiseImpl){void 0===PromiseImpl&&(PromiseImpl=Promise);var iter=new AsyncIterator(wrap(innerFn,outerFn,self,tryLocsList),PromiseImpl);return exports.isGeneratorFunction(outerFn)?iter:iter.next().then((function(result){return result.done?result.value:iter.next()}))},defineIteratorMethods(Gp),define(Gp,toStringTagSymbol,"Generator"),define(Gp,iteratorSymbol,(function(){return this})),define(Gp,"toString",(function(){return"[object Generator]"})),exports.keys=function(val){var object=Object(val),keys=[];for(var key in object)keys.push(key);return keys.reverse(),function next(){for(;keys.length;){var key=keys.pop();if(key in object)return next.value=key,next.done=!1,next}return next.done=!0,next}},exports.values=values,Context.prototype={constructor:Context,reset:function reset(skipTempReset){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(resetTryEntry),!skipTempReset)for(var name in this)"t"===name.charAt(0)&&hasOwn.call(this,name)&&!isNaN(+name.slice(1))&&(this[name]=void 0)},stop:function stop(){this.done=!0;var rootRecord=this.tryEntries[0].completion;if("throw"===rootRecord.type)throw rootRecord.arg;return this.rval},dispatchException:function dispatchException(exception){if(this.done)throw exception;var context=this;function handle(loc,caught){return record.type="throw",record.arg=exception,context.next=loc,caught&&(context.method="next",context.arg=void 0),!!caught}for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i],record=entry.completion;if("root"===entry.tryLoc)return handle("end");if(entry.tryLoc<=this.prev){var hasCatch=hasOwn.call(entry,"catchLoc"),hasFinally=hasOwn.call(entry,"finallyLoc");if(hasCatch&&hasFinally){if(this.prev<entry.catchLoc)return handle(entry.catchLoc,!0);if(this.prev<entry.finallyLoc)return handle(entry.finallyLoc)}else if(hasCatch){if(this.prev<entry.catchLoc)return handle(entry.catchLoc,!0)}else{if(!hasFinally)throw new Error("try statement without catch or finally");if(this.prev<entry.finallyLoc)return handle(entry.finallyLoc)}}}},abrupt:function abrupt(type,arg){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc<=this.prev&&hasOwn.call(entry,"finallyLoc")&&this.prev<entry.finallyLoc){var finallyEntry=entry;break}}finallyEntry&&("break"===type||"continue"===type)&&finallyEntry.tryLoc<=arg&&arg<=finallyEntry.finallyLoc&&(finallyEntry=null);var record=finallyEntry?finallyEntry.completion:{};return record.type=type,record.arg=arg,finallyEntry?(this.method="next",this.next=finallyEntry.finallyLoc,ContinueSentinel):this.complete(record)},complete:function complete(record,afterLoc){if("throw"===record.type)throw record.arg;return"break"===record.type||"continue"===record.type?this.next=record.arg:"return"===record.type?(this.rval=this.arg=record.arg,this.method="return",this.next="end"):"normal"===record.type&&afterLoc&&(this.next=afterLoc),ContinueSentinel},finish:function finish(finallyLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.finallyLoc===finallyLoc)return this.complete(entry.completion,entry.afterLoc),resetTryEntry(entry),ContinueSentinel}},catch:function _catch(tryLoc){for(var i=this.tryEntries.length-1;i>=0;--i){var entry=this.tryEntries[i];if(entry.tryLoc===tryLoc){var record=entry.completion;if("throw"===record.type){var thrown=record.arg;resetTryEntry(entry)}return thrown}}throw new Error("illegal catch attempt")},delegateYield:function delegateYield(iterable,resultName,nextLoc){return this.delegate={iterator:values(iterable),resultName,nextLoc},"next"===this.method&&(this.arg=void 0),ContinueSentinel}},exports}function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function preload(_x){return _preload.apply(this,arguments)}function _preload(){return _preload=function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}(_regeneratorRuntime().mark((function _callee(assets){return _regeneratorRuntime().wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:return _context.next=2,_pixi_assets__WEBPACK_IMPORTED_MODULE_0__.de.load(assets);case 2:case"end":return _context.stop()}}),_callee)}))),_preload.apply(this,arguments)}}}]);