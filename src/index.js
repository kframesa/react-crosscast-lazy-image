import React from "react";
import PropTypes from "prop-types";

// Cache if we've seen an image before so we don't both with
// lazy-loading & fading in on subsequent mounts.
const imageCache = {};
const inImageCache = (props) => {
  const image = props.fluid || props.fixed;
  const type = props.type || "image";
  const ext = props.ext || ".jpg";
  const params = props.fluid
    ? `${
        image.height
          ? `${image.maxWidth}x${image.height}`
          : `maxw-${image.maxWidth}`
      }`
    : `${image.width}x${image.height}`;
  // Find src
  const src = `https://scontent.ccdn.cloud/${type}/${props.platformSlug}/${props.imageGuid}/${params}${ext}`;

  if (imageCache[src]) {
    return true;
  } else {
    imageCache[src] = true;
    return false;
  }
};

let io;
const listeners = [];

function getIO() {
  if (
    typeof io === `undefined` &&
    typeof window !== `undefined` &&
    window.IntersectionObserver
  ) {
    io = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          listeners.forEach((l) => {
            if (l[0] === entry.target) {
              // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
              if (entry.isIntersecting || entry.intersectionRatio > 0) {
                io.unobserve(l[0]);
                l[1]();
              }
            }
          });
        });
      },
      { rootMargin: `200px` }
    );
  }

  return io;
}

const listenToIntersections = (el, cb) => {
  getIO().observe(el);
  listeners.push([el, cb]);
};

const noscriptImg = (props) => {
  // Check if prop exists before adding each attribute to the string output below to prevent
  // HTML validation issues caused by empty values like width="" and height=""
  const src = props.src ? `src="${props.src}" ` : `src="" `; // required attribute
  const title = props.title ? `title="${props.title}" ` : ``;
  const alt = `alt="${props.alt}"`; // required attribute
  const width = props.width ? `width="${props.width}" ` : ``;
  const height = props.height ? `height="${props.height}" ` : ``;
  const opacity = props.opacity ? props.opacity : `1`;
  const transitionDelay = props.transitionDelay
    ? props.transitionDelay
    : `0.5s`;
  return `<img ${width}${height}${src}${alt}${title} style="position:absolute;top:0;left:0;transition:opacity 0.5s;transition-delay:${transitionDelay};opacity:${opacity};width:100%;height:100%;object-fit:cover;object-position:center"/>`;
};

const noscriptPicture = (props) => {
  // Check if prop exists before adding each attribute to the string output below to prevent
  // HTML validation issues caused by empty values like width="" and height=""
  const src = props.src ? `src="${props.src}" ` : `src="" `; // required attribute
  const srcSet = props.srcSet ? `srcset="${props.srcSet}" ` : `srcset="" `;
  const sizes = props.sizes ? `sizes="${props.sizes}" ` : `sizes="" `;
  const title = props.title ? `title="${props.title}" ` : ``;
  const alt = `alt="${props.alt}"`; // required attribute
  const width = props.width ? `width="${props.width}" ` : ``;
  const height = props.height ? `height="${props.height}" ` : ``;
  const opacity = props.opacity ? props.opacity : `1`;
  const transitionDelay = props.transitionDelay
    ? props.transitionDelay
    : `0.5s`;
  return `<picture><source ${srcSet.replace(
    /\.jpg|\.png/g,
    ".webp"
  )}${sizes} type='image/webp' /><source ${srcSet}${sizes} /><img ${width}${height}${src}${alt}${title} style="position:absolute;top:0;left:0;transition:opacity 0.5s;transition-delay:${transitionDelay};opacity:${opacity};width:100%;height:100%;object-fit:cover;object-position:center"/></picture>`;
};

const Img = React.forwardRef((props, ref) => {
  const { style, onLoad, onError, ...otherProps } = props;

  return (
    <img
      {...otherProps}
      onLoad={onLoad}
      onError={onError}
      ref={ref}
      style={{
        position: `absolute`,
        top: 0,
        left: 0,
        width: `100%`,
        height: `100%`,
        objectFit: `cover`,
        objectPosition: `center`,
        ...style,
      }}
    />
  );
});

Img.propTypes = {
  style: PropTypes.object,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
};

const Picture = React.forwardRef((props, ref) => {
  const { style, onLoad, onError, ...otherProps } = props;
  const { src, srcSet, sizes } = props;
  const source = srcSet ? srcSet : src;

  return (
    <picture>
      <source
        srcSet={source.replace(/\.jpg|\.png/g, ".webp")}
        sizes={sizes}
        type="image/webp"
      />
      <source srcSet={source} sizes={sizes} />
      <img
        {...otherProps}
        onLoad={onLoad}
        onError={onError}
        ref={ref}
        style={{
          position: `absolute`,
          top: 0,
          left: 0,
          width: `100%`,
          height: `100%`,
          objectFit: `cover`,
          objectPosition: `center`,
          ...style,
        }}
      />
    </picture>
  );
});

class CrossCastLazyImage extends React.Component {
  constructor(props) {
    super(props);

    // If this browser doesn't support the IntersectionObserver API
    // we default to start downloading the image right away.
    let isVisible = true;
    let imgLoaded = true;
    let IOSupported = false;
    let fadeIn = props.fadeIn;

    // If this image has already been loaded before then we can assume it's
    // already in the browser cache so it's cheap to just show directly.
    const seenBefore = inImageCache(props);

    if (
      !seenBefore &&
      typeof window !== `undefined` &&
      window.IntersectionObserver
    ) {
      isVisible = false;
      imgLoaded = false;
      IOSupported = true;
    }

    // Always don't render image while server rendering
    if (typeof window === `undefined`) {
      isVisible = false;
      imgLoaded = false;
    }

    const hasNoScript = this.props.fadeIn;

    this.state = {
      isVisible,
      imgLoaded,
      IOSupported,
      fadeIn,
      hasNoScript,
      seenBefore,
    };

    this.imageRef = React.createRef();
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }

  handleRef(ref) {
    if (this.state.IOSupported && ref) {
      listenToIntersections(ref, () => {
        this.setState({ isVisible: true });
      });
    }
  }

  handleImageLoaded() {
    this.setState({ imgLoaded: true });
    if (this.state.seenBefore) {
      this.setState({ fadeIn: false });
    }
    this.props.onLoad && this.props.onLoad();
  }

  createBrakePointsFixed() {
    const results = [];
    const image = this.props.fixed;
    const type = this.props.type || "image";
    const ext = this.props.ext || ".jpg";

    for (let i = 1; i < 3; i++) {
      const params = `${image.width * i}x${image.height * i}`;
      results.push(
        `https://scontent.ccdn.cloud/${type}/${this.props.platformSlug}/${this.props.imageGuid}/${params}${ext} ${i}x`
      );
    }
    return results.join(",");
  }

  createBrakePointsFluid(ratio) {
    const image = this.props.fluid;
    const type = this.props.type || "image";
    const ext = this.props.ext || ".jpg";
    const step = image.step || 150;
    let size = image.size || 150;
    const results = [];

    while (size < image.maxWidth) {
      const params = `${
        image.height ? `${size}x${Math.round(size * ratio)}` : `maxw-${size}`
      }`;
      results.push(
        `https://scontent.ccdn.cloud/${type}/${this.props.platformSlug}/${this.props.imageGuid}/${params}${ext} ${size}w`
      );
      size = size + step;
    }

    results.push(
      `https://scontent.ccdn.cloud/${type}/${this.props.platformSlug}/${
        this.props.imageGuid
      }/${
        image.height
          ? `${image.maxWidth}x${image.height}`
          : `maxw-${image.maxWidth}`
      }${ext} ${image.maxWidth}w`
    );
    return results.join(",");
  }

  getRatio(width, height) {
    if (width && height) return 1 / (width / height);
    return 0;
  }

  render() {
    const {
      title,
      alt,
      platformSlug,
      imageGuid,
      style = {},
      imgStyle = {},
      placeholderStyle = {},
      fluid,
      fixed,
      backgroundColor,
      width,
      height,
      type = "image",
      aspectRatio,
    } = this.props;

    const ext = this.props.ext || ".jpg";

    const bgColor =
      typeof backgroundColor === `boolean` ? `lightgray` : backgroundColor;

    const imagePlaceholderStyle = {
      opacity: this.state.imgLoaded ? 0 : 1,
      transition: `opacity 0.5s`,
      transitionDelay: this.state.imgLoaded ? `0.5s` : `0.25s`,
      ...imgStyle,
      ...placeholderStyle,
    };

    const imageStyle = {
      opacity: this.state.imgLoaded || this.state.fadeIn === false ? 1 : 0,
      transition: this.state.fadeIn === true ? `opacity 0.5s` : `none`,
      ...imgStyle,
    };

    const placeholderImageProps = {
      title,
      alt: !this.state.isVisible ? alt : ``,
      style: imagePlaceholderStyle,
    };
    const ratio = aspectRatio || this.getRatio(width, height);
    let params;
    let image;
    let divStyle;
    let bgPlaceholderStyles;
    let srcSet;
    let sizes;

    if (fluid) {
      image = fluid;
      divStyle = {
        position: `relative`,
        overflow: `hidden`,
        ...style,
      };

      if (ratio !== 0) {
        divStyle = {
          ...divStyle,
          paddingBottom: `${(ratio * 100).toFixed(2)}%`,
        };
      }

      bgPlaceholderStyles = {
        backgroundColor: bgColor,
        position: `absolute`,
        top: 0,
        bottom: 0,
        opacity: !this.state.imgLoaded ? 1 : 0,
        transitionDelay: `0.35s`,
        right: 0,
        left: 0,
      };
      srcSet = this.createBrakePointsFluid(ratio);
      sizes = image.sizes ? image.sizes.join(", ") : "";
      params = `${
        image.height
          ? `${image.maxWidth}x${image.height}`
          : `maxw-${image.maxWidth}`
      }`;
    }

    if (fixed) {
      image = fixed;
      divStyle = {
        position: `relative`,
        overflow: `hidden`,
        display: `inline-block`,
        width: image.width,
        height: image.height,
        ...style,
      };
      bgPlaceholderStyles = {
        backgroundColor: bgColor,
        width: image.width,
        height: image.height,
        opacity: !this.state.imgLoaded ? 1 : 0,
        transitionDelay: `0.25s`,
      };
      srcSet = this.createBrakePointsFixed();
      params = `${image.width}x${image.height}`;
    }

    if (style.display === `inherit`) {
      delete divStyle.display;
    }

    if (fluid || fixed) {
      image.src = `https://scontent.ccdn.cloud/${type}/${platformSlug}/${imageGuid}/${params}${ext}`;

      return (
        <div style={divStyle} ref={this.handleRef}>
          {/* Show a blurred version. */}
          {!bgColor && ext === ".gif" && (
            <Img
              src={`https://scontent.ccdn.cloud/${type}/${platformSlug}/${imageGuid}/maxw-20${ext}`}
              {...placeholderImageProps}
            />
          )}

          {!bgColor && ext !== ".gif" && (
            <Picture
              src={`https://scontent.ccdn.cloud/${type}/${platformSlug}/${imageGuid}/maxw-20${ext}`}
              {...placeholderImageProps}
            />
          )}

          {/* Show a solid background color. */}
          {bgColor && <div title={title} style={bgPlaceholderStyles} />}

          {/* Once the image is visible (or the browser doesn't support IntersectionObserver), start downloading the image */}
          {this.state.isVisible && ext === ".gif" && (
            <Img
              alt={alt}
              title={title}
              srcSet={srcSet}
              sizes={sizes}
              src={image.src}
              style={imageStyle}
              ref={this.imageRef}
              onLoad={this.handleImageLoaded}
              onError={this.props.onError}
            />
          )}

          {this.state.isVisible && ext !== ".gif" && (
            <Picture
              alt={alt}
              title={title}
              srcSet={srcSet}
              sizes={sizes}
              src={image.src}
              style={imageStyle}
              ref={this.imageRef}
              onLoad={this.handleImageLoaded}
              onError={this.props.onError}
            />
          )}

          {/* Show the original image during server-side rendering if JavaScript is disabled */}
          {this.state.hasNoScript && ext === ".gif" && (
            <noscript
              dangerouslySetInnerHTML={{
                __html: noscriptImg({ alt, title, ...image }),
              }}
            />
          )}

          {this.state.hasNoScript && ext !== ".gif" && (
            <noscript
              dangerouslySetInnerHTML={{
                __html: noscriptPicture({ alt, title, ...image }),
              }}
            />
          )}
        </div>
      );
    }
    return null;
  }
}

CrossCastLazyImage.defaultProps = {
  platformSlug:
    process.env.PLATFORM_SLUG || process.env.REACT_APP_PLATFORM_SLUG,
  fadeIn: true,
  alt: ``,
  imgFormat: true,
  quality: true,
};

const fixedObject = PropTypes.shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
});

const fluidObject = PropTypes.shape({
  maxWidth: PropTypes.number.isRequired,
  height: PropTypes.number,
  step: PropTypes.number,
  size: PropTypes.number,
  sizes: PropTypes.arrayOf(PropTypes.string),
  aspectRatio: PropTypes.number,
});

CrossCastLazyImage.propTypes = {
  fixed: fixedObject,
  fluid: fluidObject,
  fadeIn: PropTypes.bool,
  title: PropTypes.string,
  alt: PropTypes.string,
  platformSlug: PropTypes.string,
  imageGuid: PropTypes.string.isRequired,
  style: PropTypes.object,
  imgStyle: PropTypes.object,
  placeholderStyle: PropTypes.object,
  backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  imgFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  quality: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default CrossCastLazyImage;
