(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[3223],{"./node_modules/@pixi/storybook-renderer/dist/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{M:()=>PixiStory});var global__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/global/window.js"),global__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(global__WEBPACK_IMPORTED_MODULE_0__),pixi_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/pixi.js/lib/index.mjs"),{window:globalWindow}=global__WEBPACK_IMPORTED_MODULE_0___default();globalWindow.STORYBOOK_ENV="PIXI";var PixiStory=class{constructor(options){this.view=new pixi_js__WEBPACK_IMPORTED_MODULE_1__.mcf,options.context.parameters.pixi.appReady.then((()=>{options.init(this.view)})),void 0!==options.update&&(this.update=ticker=>{options.update(this.view,ticker)}),void 0!==options.resize&&(this.resize=(width,height)=>{options.resize(this.view,width,height)}),void 0!==options.destroy&&(this.destroy=()=>{options.destroy(this.view)})}}},"./src/stories/select/SelectSprite.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{UseSprite:()=>UseSprite,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _pixi_storybook_renderer__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/storybook-renderer/dist/index.mjs"),_Select__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/Select.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/utils/helpers/resize.ts"),_utils_helpers_styles__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/utils/helpers/styles.ts"),_utils_argTypes__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/stories/utils/argTypes.ts"),_utils_loader__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/stories/utils/loader.ts");const args={dropDownHoverColor:"#A5E24D",fontColor:"#FFFFFF",fontSize:28,itemsAmount:100,onSelect:(0,__webpack_require__("./node_modules/@storybook/addon-actions/dist/index.mjs").XI)("Item selected")},UseSprite=({fontColor,fontSize,itemsAmount,dropDownHoverColor,onSelect},context)=>new _pixi_storybook_renderer__WEBPACK_IMPORTED_MODULE_0__.M({context,init:view=>{const assets=["select_closed.png","select_open.png"];let select;(0,_utils_loader__WEBPACK_IMPORTED_MODULE_2__.u)(assets).then((()=>{const textStyle={..._utils_helpers_styles__WEBPACK_IMPORTED_MODULE_3__.a,fill:fontColor,fontSize},items=function getItems(itemsAmount,text){const items=[];for(let i=0;i<itemsAmount;i++)items.push(`${text} ${i+1}`);return items}(itemsAmount,"Item");select=new _Select__WEBPACK_IMPORTED_MODULE_4__.l({closedBG:"select_closed.png",openBG:"select_open.png",textStyle,items:{items,backgroundColor:"RGBA(0, 0, 0, 0.0001)",hoverColor:dropDownHoverColor,width:200,height:50,textStyle,radius:25},selectedTextOffset:{y:-13},scrollBox:{width:200,height:350,radius:30,offset:{y:-16,x:24}}}),select.y=10,select.onSelect.connect(((_,text)=>{onSelect({id:select.value,text})})),view.addChild(select),(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_5__.E)(view,.5,0)}))},resize:view=>(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_5__.E)(view,.5,0)});const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Select/Use Sprite",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_6__.U)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_6__.p)(args)},__namedExportsOrder=["UseSprite"]},"./node_modules/global/window.js":(module,__unused_webpack_exports,__webpack_require__)=>{var win;win="undefined"!=typeof window?window:void 0!==__webpack_require__.g?__webpack_require__.g:"undefined"!=typeof self?self:{},module.exports=win}}]);