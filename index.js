"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// Cache if we've seen an image before so we don't both with
// lazy-loading & fading in on subsequent mounts.
var imageCache = {};

var inImageCache = function inImageCache(props) {
  var image = props.fluid || props.fixed;
  var type = props.type;
  var ext = props.ext || ".jpg";
  var params = props.fluid ? "".concat(image.height ? "".concat(image.maxWidth, "x").concat(image.height) : "maxw-".concat(image.maxWidth)) : "".concat(image.width, "x").concat(image.height); // Find src

  var src = "https://scontent.ccdn.cloud/".concat(type, "/").concat(props.platformSlug, "/").concat(props.imageGuid, "/").concat(params).concat(ext);

  if (imageCache[src]) {
    return true;
  } else {
    imageCache[src] = true;
    return false;
  }
};

var io;
var listeners = [];

function getIO() {
  if (typeof io === "undefined" && typeof window !== "undefined" && window.IntersectionObserver) {
    io = new window.IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        listeners.forEach(function (l) {
          if (l[0] === entry.target) {
            // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              io.unobserve(l[0]);
              l[1]();
            }
          }
        });
      });
    }, {
      rootMargin: "200px"
    });
  }

  return io;
}

var listenToIntersections = function listenToIntersections(el, cb) {
  getIO().observe(el);
  listeners.push([el, cb]);
};

var noscriptImg = function noscriptImg(props) {
  // Check if prop exists before adding each attribute to the string output below to prevent
  // HTML validation issues caused by empty values like width="" and height=""
  var src = props.src ? "src=\"".concat(props.src, "\" ") : "src=\"\" "; // required attribute

  var title = props.title ? "title=\"".concat(props.title, "\" ") : "";
  var alt = "alt=\"".concat(props.alt, "\""); // required attribute

  var width = props.width ? "width=\"".concat(props.width, "\" ") : "";
  var height = props.height ? "height=\"".concat(props.height, "\" ") : "";
  var opacity = props.opacity ? props.opacity : "1";
  var transitionDelay = props.transitionDelay ? props.transitionDelay : "0.5s";
  return "<img ".concat(width).concat(height).concat(src).concat(alt).concat(title, "style=\"position:absolute;top:0;left:0;transition:opacity 0.5s;transition-delay:").concat(transitionDelay, ";opacity:").concat(opacity, ";width:100%;height:100%;object-fit:cover;object-position:center\"/>");
};

var Img = _react["default"].forwardRef(function (props, ref) {
  var style = props.style,
      onLoad = props.onLoad,
      onError = props.onError,
      otherProps = _objectWithoutProperties(props, ["style", "onLoad", "onError"]);

  return _react["default"].createElement("img", _extends({}, otherProps, {
    onLoad: onLoad,
    onError: onError,
    ref: ref,
    style: _objectSpread({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center"
    }, style)
  }));
});

Img.propTypes = {
  style: _propTypes["default"].object,
  onError: _propTypes["default"].func,
  onLoad: _propTypes["default"].func
};

var CrossCastLazyImage =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CrossCastLazyImage, _React$Component);

  function CrossCastLazyImage(props) {
    var _this;

    _classCallCheck(this, CrossCastLazyImage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CrossCastLazyImage).call(this, props)); // If this browser doesn't support the IntersectionObserver API
    // we default to start downloading the image right away.

    var isVisible = true;
    var imgLoaded = true;
    var IOSupported = false;
    var fadeIn = props.fadeIn; // If this image has already been loaded before then we can assume it's
    // already in the browser cache so it's cheap to just show directly.

    var seenBefore = inImageCache(props);

    if (!seenBefore && typeof window !== "undefined" && window.IntersectionObserver) {
      isVisible = false;
      imgLoaded = false;
      IOSupported = true;
    } // Always don't render image while server rendering


    if (typeof window === "undefined") {
      isVisible = false;
      imgLoaded = false;
    }

    var hasNoScript = _this.props.fadeIn;
    _this.state = {
      isVisible: isVisible,
      imgLoaded: imgLoaded,
      IOSupported: IOSupported,
      fadeIn: fadeIn,
      hasNoScript: hasNoScript,
      seenBefore: seenBefore
    };
    _this.imageRef = _react["default"].createRef();
    _this.handleImageLoaded = _this.handleImageLoaded.bind(_assertThisInitialized(_this));
    _this.handleRef = _this.handleRef.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(CrossCastLazyImage, [{
    key: "handleRef",
    value: function handleRef(ref) {
      var _this2 = this;

      if (this.state.IOSupported && ref) {
        listenToIntersections(ref, function () {
          _this2.setState({
            isVisible: true
          });
        });
      }
    }
  }, {
    key: "handleImageLoaded",
    value: function handleImageLoaded() {
      this.setState({
        imgLoaded: true
      });

      if (this.state.seenBefore) {
        this.setState({
          fadeIn: false
        });
      }

      this.props.onLoad && this.props.onLoad();
    }
  }, {
    key: "createBrakePointsFixed",
    value: function createBrakePointsFixed() {
      var results = [];
      var image = this.props.fixed;
      var type = this.props.type;
      var ext = this.props.ext || ".jpg";

      for (var i = 1; i < 3; i++) {
        var params = "".concat(image.width * i, "x").concat(image.height * i);
        results.push("https://scontent.ccdn.cloud/".concat(type, "/").concat(this.props.platformSlug, "/").concat(this.props.imageGuid, "/").concat(params).concat(ext, " ").concat(i, "x"));
      }

      return results.join(",");
    }
  }, {
    key: "createBrakePointsFluid",
    value: function createBrakePointsFluid(ratio) {
      var image = this.props.fluid;
      var type = this.props.type;
      var ext = this.props.ext || ".jpg";
      var step = image.step || 150;
      var size = image.size || 150;
      var results = [];

      while (size < image.maxWidth) {
        var params = "".concat(image.height ? "".concat(size, "x").concat(Math.round(size * ratio)) : "maxw-".concat(size));
        results.push("https://scontent.ccdn.cloud/".concat(type, "/").concat(this.props.platformSlug, "/").concat(this.props.imageGuid, "/").concat(params).concat(ext, " ").concat(size, "w"));
        size = size + step;
      }

      results.push("https://scontent.ccdn.cloud/".concat(type, "/").concat(this.props.platformSlug, "/").concat(this.props.imageGuid, "/").concat(image.height ? "".concat(image.maxWidth, "x").concat(image.height) : "maxw-".concat(image.maxWidth)).concat(ext, " ").concat(image.maxWidth, "w"));
      return results.join(",");
    }
  }, {
    key: "getRatio",
    value: function getRatio(width, height) {
      if (width && height) return 1 / (width / height);
      return 0;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          alt = _this$props.alt,
          platformSlug = _this$props.platformSlug,
          imageGuid = _this$props.imageGuid,
          _this$props$style = _this$props.style,
          style = _this$props$style === void 0 ? {} : _this$props$style,
          _this$props$imgStyle = _this$props.imgStyle,
          imgStyle = _this$props$imgStyle === void 0 ? {} : _this$props$imgStyle,
          _this$props$placehold = _this$props.placeholderStyle,
          placeholderStyle = _this$props$placehold === void 0 ? {} : _this$props$placehold,
          fluid = _this$props.fluid,
          fixed = _this$props.fixed,
          backgroundColor = _this$props.backgroundColor,
          width = _this$props.width,
          height = _this$props.height,
          _this$props$type = _this$props.type,
          type = _this$props$type === void 0 ? "image" : _this$props$type;
      var ext = this.props.ext || ".jpg";
      var bgColor = typeof backgroundColor === "boolean" ? "lightgray" : backgroundColor;

      var imagePlaceholderStyle = _objectSpread({
        opacity: this.state.imgLoaded ? 0 : 1,
        transition: "opacity 0.5s",
        transitionDelay: this.state.imgLoaded ? "0.5s" : "0.25s"
      }, imgStyle, {}, placeholderStyle);

      var imageStyle = _objectSpread({
        opacity: this.state.imgLoaded || this.state.fadeIn === false ? 1 : 0,
        transition: this.state.fadeIn === true ? "opacity 0.5s" : "none"
      }, imgStyle);

      var placeholderImageProps = {
        title: title,
        alt: !this.state.isVisible ? alt : "",
        style: imagePlaceholderStyle
      };
      var ratio = this.getRatio(width, height);
      var params;
      var image;
      var divStyle;
      var bgPlaceholderStyles;
      var srcSet;
      var sizes;

      if (fluid) {
        image = fluid;
        divStyle = _objectSpread({
          position: "relative",
          overflow: "hidden"
        }, style);

        if (ratio !== 0) {
          divStyle = _objectSpread({}, divStyle, {
            paddingBottom: "".concat((ratio * 100).toFixed(2), "%")
          });
        }

        bgPlaceholderStyles = {
          backgroundColor: bgColor,
          position: "absolute",
          top: 0,
          bottom: 0,
          opacity: !this.state.imgLoaded ? 1 : 0,
          transitionDelay: "0.35s",
          right: 0,
          left: 0
        };
        srcSet = this.createBrakePointsFluid(ratio);
        sizes = image.sizes ? image.sizes.join(", ") : "";
        params = "".concat(image.height ? "".concat(image.maxWidth, "x").concat(image.height) : "maxw-".concat(image.maxWidth));
      }

      if (fixed) {
        image = fixed;
        divStyle = _objectSpread({
          position: "relative",
          overflow: "hidden",
          display: "inline-block",
          width: image.width,
          height: image.height
        }, style);
        bgPlaceholderStyles = {
          backgroundColor: bgColor,
          width: image.width,
          height: image.height,
          opacity: !this.state.imgLoaded ? 1 : 0,
          transitionDelay: "0.25s"
        };
        srcSet = this.createBrakePointsFixed();
        params = "".concat(image.width, "x").concat(image.height);
      }

      if (style.display === "inherit") {
        delete divStyle.display;
      }

      if (fluid || fixed) {
        image.src = "https://scontent.ccdn.cloud/".concat(type, "/").concat(platformSlug, "/").concat(imageGuid, "/").concat(params).concat(ext);
        return _react["default"].createElement("div", {
          style: divStyle,
          ref: this.handleRef
        }, !bgColor && _react["default"].createElement(Img, _extends({
          src: "https://scontent.ccdn.cloud/".concat(type, "/").concat(platformSlug, "/").concat(imageGuid, "/maxw-20").concat(ext)
        }, placeholderImageProps)), bgColor && _react["default"].createElement("div", {
          title: title,
          style: bgPlaceholderStyles
        }), this.state.isVisible && _react["default"].createElement(Img, {
          alt: alt,
          title: title,
          srcSet: srcSet,
          sizes: sizes,
          src: image.src,
          style: imageStyle,
          ref: this.imageRef,
          onLoad: this.handleImageLoaded,
          onError: this.props.onError
        }), this.state.hasNoScript && _react["default"].createElement("noscript", {
          dangerouslySetInnerHTML: {
            __html: noscriptImg(_objectSpread({
              alt: alt,
              title: title
            }, image))
          }
        }));
      }

      return null;
    }
  }]);

  return CrossCastLazyImage;
}(_react["default"].Component);

CrossCastLazyImage.defaultProps = {
  platformSlug: process.env.PLATFORM_SLUG || process.env.REACT_APP_PLATFORM_SLUG,
  fadeIn: true,
  alt: "",
  imgFormat: true,
  quality: true
};

var fixedObject = _propTypes["default"].shape({
  width: _propTypes["default"].number.isRequired,
  height: _propTypes["default"].number.isRequired
});

var fluidObject = _propTypes["default"].shape({
  maxWidth: _propTypes["default"].number.isRequired,
  height: _propTypes["default"].number,
  step: _propTypes["default"].number,
  size: _propTypes["default"].number,
  sizes: _propTypes["default"].arrayOf(_propTypes["default"].string)
});

CrossCastLazyImage.propTypes = {
  fixed: fixedObject,
  fluid: fluidObject,
  fadeIn: _propTypes["default"].bool,
  title: _propTypes["default"].string,
  alt: _propTypes["default"].string,
  platformSlug: _propTypes["default"].string,
  imageGuid: _propTypes["default"].string.isRequired,
  style: _propTypes["default"].object,
  imgStyle: _propTypes["default"].object,
  placeholderStyle: _propTypes["default"].object,
  backgroundColor: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].bool]),
  onLoad: _propTypes["default"].func,
  onError: _propTypes["default"].func,
  imgFormat: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].bool]),
  quality: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].bool])
};
var _default = CrossCastLazyImage;
exports["default"] = _default;