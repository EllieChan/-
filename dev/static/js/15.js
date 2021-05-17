(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[15],{

/***/ "./src/api/system/dict/type.js":
/*!*************************************!*\
  !*** ./src/api/system/dict/type.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\").default;\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.listType = listType;\nexports.getType = getType;\nexports.addType = addType;\nexports.updateType = updateType;\nexports.delType = delType;\nexports.clearCache = clearCache;\nexports.optionselect = optionselect;\n\nvar _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ \"./src/utils/request.js\"));\n\n// 查询字典类型列表\nfunction listType(query) {\n  return (0, _request.default)({\n    url: '/system/dict/type/list',\n    method: 'get',\n    params: query\n  });\n} // 查询字典类型详细\n\n\nfunction getType(dictId) {\n  return (0, _request.default)({\n    url: '/system/dict/type/' + dictId,\n    method: 'get'\n  });\n} // 新增字典类型\n\n\nfunction addType(data) {\n  return (0, _request.default)({\n    url: '/system/dict/type',\n    method: 'post',\n    data: data\n  });\n} // 修改字典类型\n\n\nfunction updateType(data) {\n  return (0, _request.default)({\n    url: '/system/dict/type',\n    method: 'put',\n    data: data\n  });\n} // 删除字典类型\n\n\nfunction delType(dictId) {\n  return (0, _request.default)({\n    url: '/system/dict/type/' + dictId,\n    method: 'delete'\n  });\n} // 清理参数缓存\n\n\nfunction clearCache() {\n  return (0, _request.default)({\n    url: '/system/dict/type/clearCache',\n    method: 'delete'\n  });\n} // 获取字典选择框列表\n\n\nfunction optionselect() {\n  return (0, _request.default)({\n    url: '/system/dict/type/optionselect',\n    method: 'get'\n  });\n}\n\n//# sourceURL=webpack:///./src/api/system/dict/type.js?");

/***/ })

}]);