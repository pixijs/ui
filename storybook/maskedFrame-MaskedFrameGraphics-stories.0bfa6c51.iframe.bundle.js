"use strict";(self.webpackChunk_pixi_ui=self.webpackChunk_pixi_ui||[]).push([[977],{"./src/stories/maskedFrame/MaskedFrameGraphics.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{UseGraphics:()=>UseGraphics,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@pixi/graphics/lib/index.mjs"),_pixi_display__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@pixi/display/lib/index.mjs"),_pixi_sprite__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@pixi/sprite/lib/index.mjs"),_pixi_core__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@pixi/core/lib/index.mjs"),_MaskedFrame__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/MaskedFrame.ts"),_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/stories/utils/argTypes.ts"),_utils_loader__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/stories/utils/loader.ts"),_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/utils/helpers/resize.ts"),args={borderColor:"#FFFFFF",borderWidth:10,radius:250},UseGraphics=function UseGraphics(_ref){var borderColor=_ref.borderColor,radius=_ref.radius,borderWidth=_ref.borderWidth,view=new _pixi_display__WEBPACK_IMPORTED_MODULE_1__.W2;return(0,_utils_loader__WEBPACK_IMPORTED_MODULE_4__.z)(["avatar-01.png"]).then((function(){borderColor=Number(borderColor.replace("#","0x"));var target=new _pixi_sprite__WEBPACK_IMPORTED_MODULE_2__.j(_pixi_core__WEBPACK_IMPORTED_MODULE_3__.xE.from("avatar-01.png")),frame=new _MaskedFrame__WEBPACK_IMPORTED_MODULE_5__.O({target,mask:getMask(target.width,target.height,radius),borderWidth,borderColor});view.addChild(frame),(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_6__.w)(view)})),{view,resize:function resize(){return(0,_utils_helpers_resize__WEBPACK_IMPORTED_MODULE_6__.w)(view)}}};function getMask(width,height,radius){var isCircle=width===height&&radius>=width/2,mask=new _pixi_graphics__WEBPACK_IMPORTED_MODULE_0__.TC;return isCircle?mask.beginFill(0).drawCircle(width/2,height/2,width/2):mask.beginFill(0).drawRoundedRect(0,0,width,height,radius),mask}const __WEBPACK_DEFAULT_EXPORT__={parameters:{storySource:{source:"import { Graphics } from '@pixi/graphics';\nimport { Container } from '@pixi/display';\nimport { Sprite } from '@pixi/sprite';\nimport { Texture } from '@pixi/core';\nimport { MaskedFrame } from '../../MaskedFrame';\nimport { argTypes, getDefaultArgs } from '../utils/argTypes';\nimport { preloadAssets } from '../utils/loader';\nimport { centerElement } from '../../utils/helpers/resize';\n\nconst args = {\n    borderColor: '#FFFFFF',\n    borderWidth: 10,\n    radius: 250,\n};\n\n// TODO: implement preloading\nexport const UseGraphics = ({ borderColor, radius, borderWidth }: any) =>\n{\n    const view = new Container();\n\n    const assets = [`avatar-01.png`];\n\n    preloadAssets(assets).then(() =>\n    {\n        borderColor = Number(borderColor.replace('#', '0x'));\n\n        const target = new Sprite(Texture.from(`avatar-01.png`));\n\n        // Component usage !!!\n        const frame = new MaskedFrame({\n            target,\n            mask: getMask(target.width, target.height, radius),\n            borderWidth,\n            borderColor,\n        });\n\n        view.addChild(frame);\n\n        centerElement(view);\n    });\n\n    return { view, resize: () => centerElement(view) };\n};\n\nfunction getMask(width: number, height: number, radius: number): Graphics\n{\n    const isCircle = width === height && radius >= width / 2;\n\n    const mask = new Graphics();\n\n    if (isCircle)\n    {\n        mask.beginFill(0x000000).drawCircle(width / 2, height / 2, width / 2);\n    }\n    else\n    {\n        mask.beginFill(0x000000).drawRoundedRect(0, 0, width, height, radius);\n    }\n\n    return mask;\n}\n\nexport default {\n    title: 'Components/MaskedFrame/Use Graphics',\n    argTypes: argTypes(args),\n    args: getDefaultArgs(args),\n};\n",locationsMap:{"use-graphics":{startLoc:{col:27,line:17},endLoc:{col:1,line:43},startBody:{col:27,line:17},endBody:{col:1,line:43}}}}},title:"Components/MaskedFrame/Use Graphics",argTypes:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__.P)(args),args:(0,_utils_argTypes__WEBPACK_IMPORTED_MODULE_7__.V)(args)};var __namedExportsOrder=["UseGraphics"]}}]);