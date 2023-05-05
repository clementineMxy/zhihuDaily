'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var CacheContext = /*#__PURE__*/React__default.createContext();

var CREATE = 'CREATE'; //创建

var CREATED = 'CREATED'; //创建成功

var ACTIVE = 'ACTIVE'; //激活

var DESTROY = 'DESTROY'; //销毁

function cacheReducer() {
  var cacheStates = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      type = _ref.type,
      payload = _ref.payload;

  switch (type) {
    case CREATE:
      return _objectSpread2(_objectSpread2({}, cacheStates), {}, _defineProperty({}, payload.cacheId, {
        scrolls: {},
        cacheId: payload.cacheId,
        element: payload.element,
        status: CREATE
      }));

    case CREATED:
      return _objectSpread2(_objectSpread2({}, cacheStates), {}, _defineProperty({}, payload.cacheId, _objectSpread2(_objectSpread2({}, cacheStates[payload.cacheId]), {}, {
        doms: payload.doms,
        status: CREATED
      })));

    case ACTIVE:
      return _objectSpread2(_objectSpread2({}, cacheStates), {}, _defineProperty({}, payload.cacheId, _objectSpread2(_objectSpread2({}, cacheStates[payload.cacheId]), {}, {
        status: ACTIVE
      })));

    case DESTROY:
      return _objectSpread2(_objectSpread2({}, cacheStates), {}, _defineProperty({}, payload.cacheId, _objectSpread2(_objectSpread2({}, cacheStates[payload.cacheId]), {}, {
        status: DESTROY
      })));

    default:
      return cacheStates;
  }
}

function KeepAliveProvider(props) {
  var _useReducer = React.useReducer(cacheReducer, {}),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      cacheStates = _useReducer2[0],
      dispatch = _useReducer2[1];

  var mount = React.useCallback(function (_ref) {
    var cacheId = _ref.cacheId,
        element = _ref.element;

    if (cacheStates[cacheId]) {
      var cacheState = cacheStates[cacheId];

      if (cacheState.status === DESTROY) {
        var doms = cacheState.doms;
        doms.forEach(function (dom) {
          return dom.parentNode.removeChild(dom);
        });
        dispatch({
          type: CREATE,
          payload: {
            cacheId: cacheId,
            element: element
          }
        });
      }
    } else {
      dispatch({
        type: CREATE,
        payload: {
          cacheId: cacheId,
          element: element
        }
      });
    }
  }, [cacheStates]);
  var handleScroll = React.useCallback(function (cacheId, _ref2) {
    var target = _ref2.target;

    if (cacheStates[cacheId]) {
      var scrolls = cacheStates[cacheId].scrolls;
      scrolls[target] = target.scrollTop;
    }
  }, [cacheStates]);
  return /*#__PURE__*/React__default.createElement(CacheContext.Provider, {
    value: {
      mount: mount,
      cacheStates: cacheStates,
      dispatch: dispatch,
      handleScroll: handleScroll
    }
  }, props.children, Object.values(cacheStates).filter(function (cacheState) {
    return cacheState.status !== DESTROY;
  }).map(function (_ref3) {
    var cacheId = _ref3.cacheId,
        element = _ref3.element;
    return /*#__PURE__*/React__default.createElement("div", {
      id: "cache_".concat(cacheId),
      key: cacheId,
      ref: function ref(dom) {
        var cacheState = cacheStates[cacheId];

        if (dom && (!cacheState.doms || cacheState.status === DESTROY)) {
          var doms = Array.from(dom.childNodes);
          dispatch({
            type: CREATED,
            payload: {
              cacheId: cacheId,
              doms: doms
            }
          });
        }
      }
    }, element);
  }));
}

function withKeepAlive(OldComponent, _ref) {
  var _ref$cacheId = _ref.cacheId,
      cacheId = _ref$cacheId === void 0 ? window.location.pathname : _ref$cacheId,
      _ref$scroll = _ref.scroll,
      scroll = _ref$scroll === void 0 ? false : _ref$scroll;
  return function (props) {
    var _useContext = React.useContext(CacheContext),
        mount = _useContext.mount,
        cacheStates = _useContext.cacheStates,
        dispatch = _useContext.dispatch,
        handleScroll = _useContext.handleScroll;

    var ref = React.useRef(null);
    React.useEffect(function () {
      if (scroll) {
        ref.current.addEventListener('scroll', handleScroll.bind(null, cacheId), true);
      }
    }, [handleScroll]);
    React.useEffect(function () {
      var cacheState = cacheStates[cacheId];

      if (cacheState && cacheState.doms && cacheState.status !== DESTROY) {
        var doms = cacheState.doms;
        doms.forEach(function (dom) {
          return ref.current.appendChild(dom);
        });

        if (scroll) {
          doms.forEach(function (dom) {
            if (cacheState.scrolls[dom]) dom.scrollTop = cacheState.scrolls[dom];
          });
        }
      } else {
        mount({
          cacheId: cacheId,
          element: /*#__PURE__*/React__default.createElement(OldComponent, _extends({}, props, {
            dispatch: dispatch
          }))
        });
      }
    }, [cacheStates, dispatch, mount, props]);
    return /*#__PURE__*/React__default.createElement("div", {
      id: "keepalive_".concat(cacheId),
      ref: ref
    });
  };
}

exports.KeepAliveProvider = KeepAliveProvider;
exports.withKeepAlive = withKeepAlive;
//# sourceMappingURL=index.js.map
