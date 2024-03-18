"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[977],{"./src/stories/maskedFrame/MaskedFrameGraphics.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{UseGraphics:()=>UseGraphics,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/graphics/lib/index.mjs"),_pixi_display__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@pixi/display/lib/index.mjs"),_pixi_sprite__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@pixi/sprite/lib/index.mjs"),_MaskedFrame__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/MaskedFrame.ts"),_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/stories/utils/argTypes.ts"),_utils_loader__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/stories/utils/loader.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/utils/helpers/resize.ts"),_utils_color__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/stories/utils/color.ts"),args={borderColor:"#FFFFFF",borderWidth:10,radius:250},UseGraphics=function UseGraphics(_ref){var borderColor=_ref.borderColor,radius=_ref.radius,borderWidth=_ref.borderWidth,view=new _pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2;return(0,_utils_loader__WEBPACK_IMPORTED_MODULE_3__.M)(["avatar-01.png"]).then((function(){borderColor=(0,_utils_color__WEBPACK_IMPORTED_MODULE_4__.Lq)(borderColor);var target=_pixi_sprite__WEBPACK_IMPORTED_MODULE_2__.j.from("avatar-01.png"),frame=new _MaskedFrame__WEBPACK_IMPORTED_MODULE_5__.O({target,mask:getMask(target.width,target.height,radius),borderWidth,borderColor});view.addChild(frame),(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_6__.w)(view)})),{view,resize:function resize(){return(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_6__.w)(view)}}};function getMask(width,height,radius){var isCircle=width===height&&radius>=width/2,mask=new _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__.TC;return isCircle?mask.beginFill(0).drawCircle(width/2,height/2,width/2):mask.beginFill(0).drawRoundedRect(0,0,width,height,radius),mask}const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:"import { Graphics } from '@pixi/graphics';\nimport { Container } from '@pixi/display';\nimport { Sprite } from '@pixi/sprite';\nimport { MaskedFrame } from '../../MaskedFrame';\nimport { argTypes, getDefaultArgs } from '../utils/argTypes';\nimport { preload } from '../utils/loader';\nimport { centerElement } from '../../utils/helpers/resize';\nimport { getColor } from '../utils/color';\n\nconst args = {\n    borderColor: '#FFFFFF',\n    borderWidth: 10,\n    radius: 250\n};\n\n// TODO: implement preloading\nexport const UseGraphics = ({ borderColor, radius, borderWidth }: any) =>\n{\n    const view = new Container();\n\n    const assets = [`avatar-01.png`];\n\n    preload(assets).then(() =>\n    {\n        borderColor = getColor(borderColor);\n\n        const target = Sprite.from(`avatar-01.png`);\n\n        // Component usage !!!\n        const frame = new MaskedFrame({\n            target,\n            mask: getMask(target.width, target.height, radius),\n            borderWidth,\n            borderColor\n        });\n\n        view.addChild(frame);\n\n        centerElement(view);\n    });\n\n    return { view, resize: () => centerElement(view) };\n};\n\nfunction getMask(width: number, height: number, radius: number): Graphics\n{\n    const isCircle = width === height && radius >= width / 2;\n\n    const mask = new Graphics();\n\n    if (isCircle)\n    {\n        mask.beginFill(0x000000).drawCircle(width / 2, height / 2, width / 2);\n    }\n    else\n    {\n        mask.beginFill(0x000000).drawRoundedRect(0, 0, width, height, radius);\n    }\n\n    return mask;\n}\n\nexport default {\n    title: 'Components/MaskedFrame/Use Graphics',\n    argTypes: argTypes(args),\n    args: getDefaultArgs(args)\n};\n",locationsMap:{"use-graphics":{startLoc:{col:27,line:17},endLoc:{col:1,line:43},startBody:{col:27,line:17},endBody:{col:1,line:43}}}}},title:"Components/MaskedFrame/Use Graphics",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__.P)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__.V)(args)};var __namedExportsOrder=["UseGraphics"]},"./src/stories/utils/color.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Lq:()=>getColor});var pixi_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/pixi.js/lib/index.mjs");function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(r,l){var t=null==r?null:"undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(null!=t){var e,n,i,u,a=[],f=!0,o=!1;try{if(i=(t=t.call(r)).next,0===l){if(Object(t)!==t)return;f=!1}else for(;!(f=(e=i.call(t)).done)&&(a.push(e.value),a.length!==l);f=!0);}catch(r){o=!0,n=r}finally{try{if(!f&&null!=t.return&&(u=t.return(),Object(u)!==u))return}finally{if(o)throw n}}return a}}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function getColor(color){if("transparent"!==color&&void 0!==color)switch(_typeof(color)){case"string":if(color.startsWith("#")||color.startsWith("0x"))return pixi_js__WEBPACK_IMPORTED_MODULE_0__.P6Y.string2hex(color);if(color.startsWith("rgba("))return function rgba2Hex(_ref){var _ref2=_slicedToArray(_ref,3),r=_ref2[0],g=_ref2[1],b=_ref2[2];return Number("0x".concat(getHex(r)).concat(getHex(g)).concat(getHex(b)))}(color.slice(5,-1).split(",").map((function(v){return parseInt(v,10)})));if(color.startsWith("rgb(")){var _rgbData=color.slice(5,-1).split(",").map((function(v){return parseInt(v,10)}));return pixi_js__WEBPACK_IMPORTED_MODULE_0__.P6Y.rgb2hex(_rgbData)}if(color.startsWith("hsla(")){var _colorData2$map2=_slicedToArray(color.slice(5,-1).split(",").map((function(v){return parseInt(v,10)})),3);return function hsl2Hex(h,s,l){l/=100;var a=s*Math.min(l,1-l)/100,f=function f(n){var k=(n+h/30)%12,color=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*color).toString(16).padStart(2,"0")};return pixi_js__WEBPACK_IMPORTED_MODULE_0__.P6Y.string2hex("#".concat(f(0)).concat(f(8)).concat(f(4)))}(_colorData2$map2[0],_colorData2$map2[1],_colorData2$map2[2])}throw new Error("Unknown color format: ".concat(color));case"number":return color;default:return parseInt(color,16)}}function getHex(n){var hex=n.toString(16);return 1===hex.length?"0".concat(hex):hex}}}]);