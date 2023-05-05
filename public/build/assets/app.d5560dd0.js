import { p as pushScopeId, a as popScopeId, d as defineComponent, n as nextTick, o as openBlock, c as createBlock, b as createElementBlock, r as renderSlot, e as normalizeProps, g as guardReactiveProps, f as normalizeClass, w as withScopeId, h as resolveComponent, i as createBaseVNode, F as Fragment, j as createCommentVNode, k as normalizeStyle, l as withKeys, m as withCtx, q as createVNode, s as ref, t as createApp, u as h, v as toDisplayString, x as mergeProps, y as shallowRef, z as unref, A as computed, B as reactive, C as inject, D as provide, E as watch, G as createStaticVNode, H as createTextVNode, I as renderList, J as withDirectives, K as resolveDirective, L as withModifiers } from "./vue.esm-bundler.ecfa1491.js";
const bootstrap_min = "";
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].includes(getBasePlacement(placement)) ? "x" : "y";
}
function getLengthFromAxis(axis) {
  return axis === "y" ? "height" : "width";
}
function computeCoordsFromPlacement(_ref) {
  let {
    reference,
    floating,
    placement
  } = _ref;
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  let coords;
  switch (getBasePlacement(placement)) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  switch (getAlignment(placement)) {
    case "start":
      coords[mainAxis] = coords[mainAxis] - (reference[length] / 2 - floating[length] / 2);
      break;
    case "end":
      coords[mainAxis] = coords[mainAxis] + (reference[length] / 2 - floating[length] / 2);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config2) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config2;
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement({
    ...rects,
    placement
  });
  let statefulPlacement = placement;
  let middlewareData = {};
  for (let i = 0; i < middleware.length; i++) {
    const {
      name,
      fn
    } = middleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: data != null ? data : {}
    };
    if (reset) {
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement({
          ...rects,
          placement: statefulPlacement
        }));
      }
      i = -1;
      continue;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getSideObjectFromPadding(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}
async function detectOverflow(middlewareArguments, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = middlewareArguments;
  const {
    boundary = "clippingParents",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = options;
  const paddingObject = getSideObjectFromPadding(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = await platform2.getClippingClientRect({
    element: await platform2.isElement(element) ? element : element.contextElement || await platform2.getDocumentElement({
      element: elements.floating
    }),
    boundary,
    rootBoundary
  });
  const elementClientRect = rectToClientRect(await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect: elementContext === "floating" ? {
      ...rects.floating,
      x,
      y
    } : rects.reference,
    offsetParent: await platform2.getOffsetParent({
      element: elements.floating
    }),
    strategy
  }));
  return {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
}
const min$1 = Math.min;
const max$1 = Math.max;
function within(min$1$1, value, max$1$1) {
  return max$1(min$1$1, min$1(value, max$1$1));
}
const arrow = (options) => ({
  name: "arrow",
  options,
  async fn(middlewareArguments) {
    const {
      element,
      padding = 0
    } = options != null ? options : {};
    const {
      x,
      y,
      placement,
      rects,
      platform: platform2
    } = middlewareArguments;
    if (element == null) {
      return {};
    }
    const paddingObject = getSideObjectFromPadding(padding);
    const coords = {
      x,
      y
    };
    const basePlacement = getBasePlacement(placement);
    const axis = getMainAxisFromPlacement(basePlacement);
    const length = getLengthFromAxis(axis);
    const arrowDimensions = await platform2.getDimensions({
      element
    });
    const minProp = axis === "y" ? "top" : "left";
    const maxProp = axis === "y" ? "bottom" : "right";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await platform2.getOffsetParent({
      element
    });
    const clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    const centerToReference = endDiff / 2 - startDiff / 2;
    const min2 = paddingObject[minProp];
    const max2 = clientSize - arrowDimensions[length] - paddingObject[maxProp];
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = within(min2, center, max2);
    return {
      data: {
        [axis]: offset2,
        centerOffset: center - offset2
      }
    };
  }
});
const hash$1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (matched) => hash$1[matched]);
}
function getAlignmentSides(placement, rects) {
  const isStart = getAlignment(placement) === "start";
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  let mainAlignmentSide = mainAxis === "x" ? isStart ? "right" : "left" : isStart ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return {
    main: mainAlignmentSide,
    cross: getOppositePlacement(mainAlignmentSide)
  };
}
const hash = {
  start: "end",
  end: "start"
};
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (matched) => hash[matched]);
}
const basePlacements = ["top", "right", "bottom", "left"];
const allPlacements = /* @__PURE__ */ basePlacements.reduce((acc, basePlacement) => acc.concat(basePlacement, basePlacement + "-start", basePlacement + "-end"), []);
function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter((placement) => getAlignment(placement) === alignment), ...allowedPlacements.filter((placement) => getAlignment(placement) !== alignment)] : allowedPlacements.filter((placement) => getBasePlacement(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter((placement) => {
    if (alignment) {
      return getAlignment(placement) === alignment || (autoAlignment ? getOppositeAlignmentPlacement(placement) !== placement : false);
    }
    return true;
  });
}
const autoPlacement = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "autoPlacement",
    options,
    async fn(middlewareArguments) {
      var _middlewareData$autoP, _middlewareData$autoP2, _middlewareData$autoP3, _middlewareData$autoP4, _middlewareData$autoP5, _placementsSortedByLe;
      const {
        x,
        y,
        rects,
        middlewareData,
        placement
      } = middlewareArguments;
      const {
        alignment = null,
        allowedPlacements = allPlacements,
        autoAlignment = true,
        ...detectOverflowOptions
      } = options;
      if ((_middlewareData$autoP = middlewareData.autoPlacement) != null && _middlewareData$autoP.skip) {
        return {};
      }
      const placements2 = getPlacementList(alignment, autoAlignment, allowedPlacements);
      const overflow = await detectOverflow(middlewareArguments, detectOverflowOptions);
      const currentIndex = (_middlewareData$autoP2 = (_middlewareData$autoP3 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP3.index) != null ? _middlewareData$autoP2 : 0;
      const currentPlacement = placements2[currentIndex];
      const {
        main,
        cross
      } = getAlignmentSides(currentPlacement, rects);
      if (placement !== currentPlacement) {
        return {
          x,
          y,
          reset: {
            placement: placements2[0]
          }
        };
      }
      const currentOverflows = [overflow[getBasePlacement(currentPlacement)], overflow[main], overflow[cross]];
      const allOverflows = [...(_middlewareData$autoP4 = (_middlewareData$autoP5 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP5.overflows) != null ? _middlewareData$autoP4 : [], {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements2[currentIndex + 1];
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByLeastOverflow = allOverflows.slice().sort((a, b) => a.overflows[0] - b.overflows[0]);
      const placementThatFitsOnAllSides = (_placementsSortedByLe = placementsSortedByLeastOverflow.find((_ref) => {
        let {
          overflows
        } = _ref;
        return overflows.every((overflow2) => overflow2 <= 0);
      })) == null ? void 0 : _placementsSortedByLe.placement;
      return {
        data: {
          skip: true
        },
        reset: {
          placement: placementThatFitsOnAllSides != null ? placementThatFitsOnAllSides : placementsSortedByLeastOverflow[0].placement
        }
      };
    }
  };
};
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
const flip = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(middlewareArguments) {
      var _middlewareData$flip, _middlewareData$flip2;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement
      } = middlewareArguments;
      if ((_middlewareData$flip = middlewareData.flip) != null && _middlewareData$flip.skip) {
        return {};
      }
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        flipAlignment = true,
        ...detectOverflowOptions
      } = options;
      const basePlacement = getBasePlacement(placement);
      const isBasePlacement = basePlacement === initialPlacement;
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const placements2 = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(middlewareArguments, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[basePlacement]);
      }
      if (checkCrossAxis) {
        const {
          main,
          cross
        } = getAlignmentSides(placement, rects);
        overflows.push(overflow[main], overflow[cross]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side) => side <= 0)) {
        var _middlewareData$flip$, _middlewareData$flip3;
        const nextIndex = ((_middlewareData$flip$ = (_middlewareData$flip3 = middlewareData.flip) == null ? void 0 : _middlewareData$flip3.index) != null ? _middlewareData$flip$ : 0) + 1;
        const nextPlacement = placements2[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = "bottom";
        switch (fallbackStrategy) {
          case "bestFit": {
            var _overflowsData$slice$;
            const placement2 = (_overflowsData$slice$ = overflowsData.slice().sort((a, b) => a.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0) - b.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0))[0]) == null ? void 0 : _overflowsData$slice$.placement;
            if (placement2) {
              resetPlacement = placement2;
            }
            break;
          }
          case "initialPlacement":
            resetPlacement = initialPlacement;
            break;
        }
        return {
          data: {
            skip: true
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};
function convertValueToCoords(_ref) {
  let {
    placement,
    rects,
    value
  } = _ref;
  const basePlacement = getBasePlacement(placement);
  const multiplier = ["left", "top"].includes(basePlacement) ? -1 : 1;
  const rawValue = typeof value === "function" ? value({
    ...rects,
    placement
  }) : value;
  const {
    mainAxis,
    crossAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0
  } : {
    mainAxis: 0,
    crossAxis: 0,
    ...rawValue
  };
  return getMainAxisFromPlacement(basePlacement) === "x" ? {
    x: crossAxis,
    y: mainAxis * multiplier
  } : {
    x: mainAxis * multiplier,
    y: crossAxis
  };
}
const offset = function(value) {
  if (value === void 0) {
    value = 0;
  }
  return {
    name: "offset",
    options: value,
    fn(middlewareArguments) {
      const {
        x,
        y,
        placement,
        rects
      } = middlewareArguments;
      const diffCoords = convertValueToCoords({
        placement,
        rects,
        value
      });
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: diffCoords
      };
    }
  };
};
function getCrossAxis(axis) {
  return axis === "x" ? "y" : "x";
}
const shift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(middlewareArguments) {
      const {
        x,
        y,
        placement
      } = middlewareArguments;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = options;
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(middlewareArguments, detectOverflowOptions);
      const mainAxis = getMainAxisFromPlacement(getBasePlacement(placement));
      const crossAxis = getCrossAxis(mainAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = within(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = within(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...middlewareArguments,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      };
    }
  };
};
const size = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "size",
    options,
    async fn(middlewareArguments) {
      var _middlewareData$size;
      const {
        placement,
        rects,
        middlewareData
      } = middlewareArguments;
      const {
        apply,
        ...detectOverflowOptions
      } = options;
      if ((_middlewareData$size = middlewareData.size) != null && _middlewareData$size.skip) {
        return {};
      }
      const overflow = await detectOverflow(middlewareArguments, detectOverflowOptions);
      const basePlacement = getBasePlacement(placement);
      const isEnd = getAlignment(placement) === "end";
      let heightSide;
      let widthSide;
      if (basePlacement === "top" || basePlacement === "bottom") {
        heightSide = basePlacement;
        widthSide = isEnd ? "left" : "right";
      } else {
        widthSide = basePlacement;
        heightSide = isEnd ? "top" : "bottom";
      }
      const xMin = max$1(overflow.left, 0);
      const xMax = max$1(overflow.right, 0);
      const yMin = max$1(overflow.top, 0);
      const yMax = max$1(overflow.bottom, 0);
      const dimensions = {
        height: rects.floating.height - (["left", "right"].includes(placement) ? 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max$1(overflow.top, overflow.bottom)) : overflow[heightSide]),
        width: rects.floating.width - (["top", "bottom"].includes(placement) ? 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max$1(overflow.left, overflow.right)) : overflow[widthSide])
      };
      apply == null ? void 0 : apply({
        ...dimensions,
        ...rects
      });
      return {
        data: {
          skip: true
        },
        reset: {
          rects: true
        }
      };
    }
  };
};
function isWindow(value) {
  return (value == null ? void 0 : value.toString()) === "[object Window]";
}
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (!isWindow(node)) {
    const ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeName(node) {
  return isWindow(node) ? "" : node ? (node.nodeName || "").toLowerCase() : "";
}
function isHTMLElement(value) {
  return value instanceof getWindow(value).HTMLElement;
}
function isElement(value) {
  return value instanceof getWindow(value).Element;
}
function isNode(value) {
  return value instanceof getWindow(value).Node;
}
function isShadowRoot(node) {
  const OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function isScrollParent(element) {
  const {
    overflow,
    overflowX,
    overflowY
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
  const css = getComputedStyle$1(element);
  return css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].includes(css.willChange) || isFirefox && css.willChange === "filter" || isFirefox && (css.filter ? css.filter !== "none" : false);
}
const min = Math.min;
const max = Math.max;
const round = Math.round;
function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  const clientRect = element.getBoundingClientRect();
  let scaleX = 1;
  let scaleY = 1;
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }
  return {
    width: clientRect.width / scaleX,
    height: clientRect.height / scaleY,
    top: clientRect.top / scaleY,
    right: clientRect.right / scaleX,
    bottom: clientRect.bottom / scaleY,
    left: clientRect.left / scaleX,
    x: clientRect.left / scaleX,
    y: clientRect.top / scaleY
  };
}
function getDocumentElement(node) {
  return ((isNode(node) ? node.ownerDocument : node.document) || window.document).documentElement;
}
function getNodeScroll(element) {
  if (isWindow(element)) {
    return {
      scrollLeft: element.pageXOffset,
      scrollTop: element.pageYOffset
    };
  }
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}
function isScaled(element) {
  const rect = getBoundingClientRect(element);
  return round(rect.width) !== element.offsetWidth || round(rect.height) !== element.offsetHeight;
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const rect = getBoundingClientRect(element, isOffsetParentAnElement && isScaled(offsetParent));
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  return node.assignedSlot || node.parentNode || (isShadowRoot(node) ? node.host : null) || getDocumentElement(node);
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !["html", "body"].includes(getNodeName(currentNode))) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  const window2 = getWindow(element);
  let offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static" && !isContainingBlock(offsetParent))) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getDimensions(element) {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    ...rect,
    x: rect.x - scroll.scrollLeft + offsets.x,
    y: rect.y - scroll.scrollTop + offsets.y
  };
}
function getViewportRect(element) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    if (Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) < 0.01) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getDocumentRect(element) {
  var _element$ownerDocumen;
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  const width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  const height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body || html).direction === "rtl") {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getScrollParent(node) {
  if (["html", "body", "#document"].includes(getNodeName(node))) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}
function getScrollParents(node, list) {
  var _node$ownerDocument;
  if (list === void 0) {
    list = [];
  }
  const scrollParent = getScrollParent(node);
  const isBody = scrollParent === ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.body);
  const win = getWindow(scrollParent);
  const target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  const updatedList = list.concat(target);
  return isBody ? updatedList : updatedList.concat(getScrollParents(getParentNode(target)));
}
function contains(parent, child) {
  const rootNode = child.getRootNode == null ? void 0 : child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    do {
      if (next && parent === next) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
function getInnerBoundingClientRect(element) {
  const clientRect = getBoundingClientRect(element);
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  return {
    top,
    left,
    x: left,
    y: top,
    right: left + element.clientWidth,
    bottom: top + element.clientHeight,
    width: element.clientWidth,
    height: element.clientHeight
  };
}
function getClientRectFromClippingParent(element, clippingParent) {
  if (clippingParent === "viewport") {
    return rectToClientRect(getViewportRect(element));
  }
  if (isElement(clippingParent)) {
    return getInnerBoundingClientRect(clippingParent);
  }
  return rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  const clippingParents = getScrollParents(getParentNode(element));
  const canEscapeClipping = ["absolute", "fixed"].includes(getComputedStyle$1(element).position);
  const clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents.filter((clippingParent) => isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body");
}
function getClippingClientRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary
  } = _ref;
  const mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  const clippingParents = [...mainClippingParents, rootBoundary];
  const firstClippingParent = clippingParents[0];
  const clippingRect = clippingParents.reduce((accRect, clippingParent) => {
    const rect = getClientRectFromClippingParent(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingParent(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
const platform = {
  getElementRects: (_ref) => {
    let {
      reference,
      floating,
      strategy
    } = _ref;
    return {
      reference: getRectRelativeToOffsetParent(reference, getOffsetParent(floating), strategy),
      floating: {
        ...getDimensions(floating),
        x: 0,
        y: 0
      }
    };
  },
  convertOffsetParentRelativeRectToViewportRelativeRect: (args) => convertOffsetParentRelativeRectToViewportRelativeRect(args),
  getOffsetParent: (_ref2) => {
    let {
      element
    } = _ref2;
    return getOffsetParent(element);
  },
  isElement: (value) => isElement(value),
  getDocumentElement: (_ref3) => {
    let {
      element
    } = _ref3;
    return getDocumentElement(element);
  },
  getClippingClientRect: (args) => getClippingClientRect(args),
  getDimensions: (_ref4) => {
    let {
      element
    } = _ref4;
    return getDimensions(element);
  },
  getClientRects: (_ref5) => {
    let {
      element
    } = _ref5;
    return element.getClientRects();
  }
};
const computePosition = (reference, floating, options) => computePosition$1(reference, floating, {
  platform,
  ...options
});
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function assign$1(to, from) {
  for (const key in from) {
    if (Object.prototype.hasOwnProperty.call(from, key)) {
      if (typeof from[key] === "object" && to[key]) {
        assign$1(to[key], from[key]);
      } else {
        to[key] = from[key];
      }
    }
  }
}
const config = {
  disabled: false,
  distance: 5,
  skidding: 0,
  container: "body",
  boundary: void 0,
  instantMove: false,
  disposeTimeout: 5e3,
  popperTriggers: [],
  strategy: "absolute",
  preventOverflow: true,
  flip: true,
  shift: true,
  overflowPadding: 0,
  arrowPadding: 0,
  arrowOverflow: true,
  themes: {
    tooltip: {
      placement: "top",
      triggers: ["hover", "focus", "touch"],
      hideTriggers: (events) => [...events, "click"],
      delay: {
        show: 200,
        hide: 0
      },
      handleResize: false,
      html: false,
      loadingContent: "..."
    },
    dropdown: {
      placement: "bottom",
      triggers: ["click"],
      delay: 0,
      handleResize: true,
      autoHide: true
    },
    menu: {
      $extend: "dropdown",
      triggers: ["hover", "focus"],
      popperTriggers: ["hover", "focus"],
      delay: {
        show: 0,
        hide: 400
      }
    }
  }
};
function getDefaultConfig(theme, key) {
  let themeConfig = config.themes[theme] || {};
  let value;
  do {
    value = themeConfig[key];
    if (typeof value === "undefined") {
      if (themeConfig.$extend) {
        themeConfig = config.themes[themeConfig.$extend] || {};
      } else {
        themeConfig = null;
        value = config[key];
      }
    } else {
      themeConfig = null;
    }
  } while (themeConfig);
  return value;
}
function getThemeClasses(theme) {
  const result = [theme];
  let themeConfig = config.themes[theme] || {};
  do {
    if (themeConfig.$extend && !themeConfig.$resetCss) {
      result.push(themeConfig.$extend);
      themeConfig = config.themes[themeConfig.$extend] || {};
    } else {
      themeConfig = null;
    }
  } while (themeConfig);
  return result.map((c) => `v-popper--theme-${c}`);
}
function getAllParentThemes(theme) {
  const result = [theme];
  let themeConfig = config.themes[theme] || {};
  do {
    if (themeConfig.$extend) {
      result.push(themeConfig.$extend);
      themeConfig = config.themes[themeConfig.$extend] || {};
    } else {
      themeConfig = null;
    }
  } while (themeConfig);
  return result;
}
let supportsPassive = false;
if (typeof window !== "undefined") {
  supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, "passive", {
      get() {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {
  }
}
let isIOS = false;
if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
const placements = ["auto", "top", "bottom", "left", "right"].reduce((acc, base) => acc.concat([
  base,
  `${base}-start`,
  `${base}-end`
]), []);
const SHOW_EVENT_MAP = {
  hover: "mouseenter",
  focus: "focus",
  click: "click",
  touch: "touchstart"
};
const HIDE_EVENT_MAP = {
  hover: "mouseleave",
  focus: "blur",
  click: "click",
  touch: "touchend"
};
function removeFromArray(array, item) {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}
function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => {
    requestAnimationFrame(resolve);
  }));
}
const shownPoppers = [];
let hidingPopper = null;
const shownPoppersByTheme = {};
function getShownPoppersByTheme(theme) {
  let list = shownPoppersByTheme[theme];
  if (!list) {
    list = shownPoppersByTheme[theme] = [];
  }
  return list;
}
let Element = function() {
};
if (typeof window !== "undefined") {
  Element = window.Element;
}
function defaultPropFactory(prop) {
  return function(props) {
    return getDefaultConfig(props.theme, prop);
  };
}
const PROVIDE_KEY = "__floating-vue__popper";
var PrivatePopper = () => defineComponent({
  name: "VPopper",
  provide() {
    return {
      [PROVIDE_KEY]: {
        parentPopper: this
      }
    };
  },
  inject: {
    [PROVIDE_KEY]: { default: null }
  },
  props: {
    theme: {
      type: String,
      required: true
    },
    targetNodes: {
      type: Function,
      required: true
    },
    referenceNode: {
      type: Function,
      default: null
    },
    popperNode: {
      type: Function,
      required: true
    },
    shown: {
      type: Boolean,
      default: false
    },
    showGroup: {
      type: String,
      default: null
    },
    ariaId: {
      default: null
    },
    disabled: {
      type: Boolean,
      default: defaultPropFactory("disabled")
    },
    positioningDisabled: {
      type: Boolean,
      default: defaultPropFactory("positioningDisabled")
    },
    placement: {
      type: String,
      default: defaultPropFactory("placement"),
      validator: (value) => placements.includes(value)
    },
    delay: {
      type: [String, Number, Object],
      default: defaultPropFactory("delay")
    },
    distance: {
      type: [Number, String],
      default: defaultPropFactory("distance")
    },
    skidding: {
      type: [Number, String],
      default: defaultPropFactory("skidding")
    },
    triggers: {
      type: Array,
      default: defaultPropFactory("triggers")
    },
    showTriggers: {
      type: [Array, Function],
      default: defaultPropFactory("showTriggers")
    },
    hideTriggers: {
      type: [Array, Function],
      default: defaultPropFactory("hideTriggers")
    },
    popperTriggers: {
      type: Array,
      default: defaultPropFactory("popperTriggers")
    },
    popperShowTriggers: {
      type: [Array, Function],
      default: defaultPropFactory("popperShowTriggers")
    },
    popperHideTriggers: {
      type: [Array, Function],
      default: defaultPropFactory("popperHideTriggers")
    },
    container: {
      type: [String, Object, Element, Boolean],
      default: defaultPropFactory("container")
    },
    boundary: {
      type: [String, Element],
      default: defaultPropFactory("boundary")
    },
    strategy: {
      type: String,
      validator: (value) => ["absolute", "fixed"].includes(value),
      default: defaultPropFactory("strategy")
    },
    autoHide: {
      type: [Boolean, Function],
      default: defaultPropFactory("autoHide")
    },
    handleResize: {
      type: Boolean,
      default: defaultPropFactory("handleResize")
    },
    instantMove: {
      type: Boolean,
      default: defaultPropFactory("instantMove")
    },
    eagerMount: {
      type: Boolean,
      default: defaultPropFactory("eagerMount")
    },
    popperClass: {
      type: [String, Array, Object],
      default: defaultPropFactory("popperClass")
    },
    computeTransformOrigin: {
      type: Boolean,
      default: defaultPropFactory("computeTransformOrigin")
    },
    autoMinSize: {
      type: Boolean,
      default: defaultPropFactory("autoMinSize")
    },
    autoSize: {
      type: [Boolean, String],
      default: defaultPropFactory("autoSize")
    },
    autoMaxSize: {
      type: Boolean,
      default: defaultPropFactory("autoMaxSize")
    },
    autoBoundaryMaxSize: {
      type: Boolean,
      default: defaultPropFactory("autoBoundaryMaxSize")
    },
    preventOverflow: {
      type: Boolean,
      default: defaultPropFactory("preventOverflow")
    },
    overflowPadding: {
      type: [Number, String],
      default: defaultPropFactory("overflowPadding")
    },
    arrowPadding: {
      type: [Number, String],
      default: defaultPropFactory("arrowPadding")
    },
    arrowOverflow: {
      type: Boolean,
      default: defaultPropFactory("arrowOverflow")
    },
    flip: {
      type: Boolean,
      default: defaultPropFactory("flip")
    },
    shift: {
      type: Boolean,
      default: defaultPropFactory("shift")
    },
    shiftCrossAxis: {
      type: Boolean,
      default: defaultPropFactory("shiftCrossAxis")
    },
    noAutoFocus: {
      type: Boolean,
      default: defaultPropFactory("noAutoFocus")
    }
  },
  emits: [
    "show",
    "hide",
    "update:shown",
    "apply-show",
    "apply-hide",
    "close-group",
    "close-directive",
    "auto-hide",
    "resize",
    "dispose"
  ],
  data() {
    return {
      isShown: false,
      isMounted: false,
      skipTransition: false,
      classes: {
        showFrom: false,
        showTo: false,
        hideFrom: false,
        hideTo: true
      },
      result: {
        x: 0,
        y: 0,
        placement: "",
        strategy: this.strategy,
        arrow: {
          x: 0,
          y: 0,
          centerOffset: 0
        },
        transformOrigin: null
      },
      shownChildren: /* @__PURE__ */ new Set(),
      lastAutoHide: true
    };
  },
  computed: {
    popperId() {
      return this.ariaId != null ? this.ariaId : this.randomId;
    },
    shouldMountContent() {
      return this.eagerMount || this.isMounted;
    },
    slotData() {
      return {
        popperId: this.popperId,
        isShown: this.isShown,
        shouldMountContent: this.shouldMountContent,
        skipTransition: this.skipTransition,
        autoHide: typeof this.autoHide === "function" ? this.lastAutoHide : this.autoHide,
        show: this.show,
        hide: this.hide,
        handleResize: this.handleResize,
        onResize: this.onResize,
        classes: __spreadProps(__spreadValues({}, this.classes), {
          popperClass: this.popperClass
        }),
        result: this.positioningDisabled ? null : this.result,
        attrs: this.$attrs
      };
    },
    parentPopper() {
      var _a;
      return (_a = this[PROVIDE_KEY]) == null ? void 0 : _a.parentPopper;
    },
    hasPopperShowTriggerHover() {
      var _a, _b;
      return ((_a = this.popperTriggers) == null ? void 0 : _a.includes("hover")) || ((_b = this.popperShowTriggers) == null ? void 0 : _b.includes("hover"));
    }
  },
  watch: __spreadValues(__spreadValues({
    shown: "$_autoShowHide",
    disabled(value) {
      if (value) {
        this.dispose();
      } else {
        this.init();
      }
    },
    async container() {
      if (this.isShown) {
        this.$_ensureTeleport();
        await this.$_computePosition();
      }
    }
  }, [
    "triggers",
    "positioningDisabled"
  ].reduce((acc, prop) => {
    acc[prop] = "$_refreshListeners";
    return acc;
  }, {})), [
    "placement",
    "distance",
    "skidding",
    "boundary",
    "strategy",
    "overflowPadding",
    "arrowPadding",
    "preventOverflow",
    "shift",
    "shiftCrossAxis",
    "flip"
  ].reduce((acc, prop) => {
    acc[prop] = "$_computePosition";
    return acc;
  }, {})),
  created() {
    this.$_isDisposed = true;
    this.randomId = `popper_${[Math.random(), Date.now()].map((n) => n.toString(36).substring(2, 10)).join("_")}`;
    if (this.autoMinSize) {
      console.warn('[floating-vue] `autoMinSize` option is deprecated. Use `autoSize="min"` instead.');
    }
    if (this.autoMaxSize) {
      console.warn("[floating-vue] `autoMaxSize` option is deprecated. Use `autoBoundaryMaxSize` instead.");
    }
  },
  mounted() {
    this.init();
    this.$_detachPopperNode();
  },
  activated() {
    this.$_autoShowHide();
  },
  deactivated() {
    this.hide();
  },
  beforeUnmount() {
    this.dispose();
  },
  methods: {
    show({ event = null, skipDelay = false, force = false } = {}) {
      var _a, _b;
      if (((_a = this.parentPopper) == null ? void 0 : _a.lockedChild) && this.parentPopper.lockedChild !== this)
        return;
      this.$_pendingHide = false;
      if (force || !this.disabled) {
        if (((_b = this.parentPopper) == null ? void 0 : _b.lockedChild) === this) {
          this.parentPopper.lockedChild = null;
        }
        this.$_scheduleShow(event, skipDelay);
        this.$emit("show");
        this.$_showFrameLocked = true;
        requestAnimationFrame(() => {
          this.$_showFrameLocked = false;
        });
      }
      this.$emit("update:shown", true);
    },
    hide({ event = null, skipDelay = false } = {}) {
      var _a;
      if (this.$_hideInProgress)
        return;
      if (this.shownChildren.size > 0) {
        this.$_pendingHide = true;
        return;
      }
      if (this.hasPopperShowTriggerHover && this.$_isAimingPopper()) {
        if (this.parentPopper) {
          this.parentPopper.lockedChild = this;
          clearTimeout(this.parentPopper.lockedChildTimer);
          this.parentPopper.lockedChildTimer = setTimeout(() => {
            if (this.parentPopper.lockedChild === this) {
              this.parentPopper.lockedChild.hide({ skipDelay });
              this.parentPopper.lockedChild = null;
            }
          }, 1e3);
        }
        return;
      }
      if (((_a = this.parentPopper) == null ? void 0 : _a.lockedChild) === this) {
        this.parentPopper.lockedChild = null;
      }
      this.$_pendingHide = false;
      this.$_scheduleHide(event, skipDelay);
      this.$emit("hide");
      this.$emit("update:shown", false);
    },
    init() {
      var _a, _b;
      if (!this.$_isDisposed)
        return;
      this.$_isDisposed = false;
      this.isMounted = false;
      this.$_events = [];
      this.$_preventShow = false;
      this.$_referenceNode = (_b = (_a = this.referenceNode) == null ? void 0 : _a.call(this)) != null ? _b : this.$el;
      this.$_targetNodes = this.targetNodes().filter((e) => e.nodeType === e.ELEMENT_NODE);
      this.$_popperNode = this.popperNode();
      this.$_innerNode = this.$_popperNode.querySelector(".v-popper__inner");
      this.$_arrowNode = this.$_popperNode.querySelector(".v-popper__arrow-container");
      this.$_swapTargetAttrs("title", "data-original-title");
      this.$_detachPopperNode();
      if (this.triggers.length) {
        this.$_addEventListeners();
      }
      if (this.shown) {
        this.show();
      }
    },
    dispose() {
      if (this.$_isDisposed)
        return;
      this.$_isDisposed = true;
      this.$_removeEventListeners();
      this.hide({ skipDelay: true });
      this.$_detachPopperNode();
      this.isMounted = false;
      this.isShown = false;
      this.$_updateParentShownChildren(false);
      this.$_swapTargetAttrs("data-original-title", "title");
      this.$emit("dispose");
    },
    async onResize() {
      if (this.isShown) {
        await this.$_computePosition();
        this.$emit("resize");
      }
    },
    async $_computePosition() {
      var _a;
      if (this.$_isDisposed || this.positioningDisabled)
        return;
      const options2 = {
        strategy: this.strategy,
        middleware: []
      };
      if (this.distance || this.skidding) {
        options2.middleware.push(offset({
          mainAxis: this.distance,
          crossAxis: this.skidding
        }));
      }
      const isPlacementAuto = this.placement.startsWith("auto");
      if (isPlacementAuto) {
        options2.middleware.push(autoPlacement({
          alignment: (_a = this.placement.split("-")[1]) != null ? _a : ""
        }));
      } else {
        options2.placement = this.placement;
      }
      if (this.preventOverflow) {
        if (this.shift) {
          options2.middleware.push(shift({
            padding: this.overflowPadding,
            boundary: this.boundary,
            crossAxis: this.shiftCrossAxis
          }));
        }
        if (!isPlacementAuto && this.flip) {
          options2.middleware.push(flip({
            padding: this.overflowPadding,
            boundary: this.boundary
          }));
        }
      }
      options2.middleware.push(arrow({
        element: this.$_arrowNode,
        padding: this.arrowPadding
      }));
      if (this.arrowOverflow) {
        options2.middleware.push({
          name: "arrowOverflow",
          fn: ({ placement, rects, middlewareData }) => {
            let overflow;
            const { centerOffset } = middlewareData.arrow;
            if (placement.startsWith("top") || placement.startsWith("bottom")) {
              overflow = Math.abs(centerOffset) > rects.reference.width / 2;
            } else {
              overflow = Math.abs(centerOffset) > rects.reference.height / 2;
            }
            return {
              data: {
                overflow
              }
            };
          }
        });
      }
      if (this.autoMinSize || this.autoSize) {
        const autoSize = this.autoSize ? this.autoSize : this.autoMinSize ? "min" : null;
        options2.middleware.push({
          name: "autoSize",
          fn: ({ rects, placement, middlewareData }) => {
            var _a2;
            if ((_a2 = middlewareData.autoSize) == null ? void 0 : _a2.skip) {
              return {};
            }
            let width;
            let height;
            if (placement.startsWith("top") || placement.startsWith("bottom")) {
              width = rects.reference.width;
            } else {
              height = rects.reference.height;
            }
            this.$_innerNode.style[autoSize === "min" ? "minWidth" : autoSize === "max" ? "maxWidth" : "width"] = width != null ? `${width}px` : null;
            this.$_innerNode.style[autoSize === "min" ? "minHeight" : autoSize === "max" ? "maxHeight" : "height"] = height != null ? `${height}px` : null;
            return {
              data: {
                skip: true
              },
              reset: {
                rects: true
              }
            };
          }
        });
      }
      if (this.autoMaxSize || this.autoBoundaryMaxSize) {
        this.$_innerNode.style.maxWidth = null;
        this.$_innerNode.style.maxHeight = null;
        options2.middleware.push(size({
          boundary: this.boundary,
          padding: this.overflowPadding,
          apply: ({ width, height }) => {
            this.$_innerNode.style.maxWidth = width != null ? `${width}px` : null;
            this.$_innerNode.style.maxHeight = height != null ? `${height}px` : null;
          }
        }));
      }
      const data = await computePosition(this.$_referenceNode, this.$_popperNode, options2);
      Object.assign(this.result, {
        x: data.x,
        y: data.y,
        placement: data.placement,
        strategy: data.strategy,
        arrow: __spreadValues(__spreadValues({}, data.middlewareData.arrow), data.middlewareData.arrowOverflow)
      });
    },
    $_scheduleShow(event = null, skipDelay = false) {
      this.$_updateParentShownChildren(true);
      this.$_hideInProgress = false;
      clearTimeout(this.$_scheduleTimer);
      if (hidingPopper && this.instantMove && hidingPopper.instantMove && hidingPopper !== this.parentPopper) {
        hidingPopper.$_applyHide(true);
        this.$_applyShow(true);
        return;
      }
      if (skipDelay) {
        this.$_applyShow();
      } else {
        this.$_scheduleTimer = setTimeout(this.$_applyShow.bind(this), this.$_computeDelay("show"));
      }
    },
    $_scheduleHide(event = null, skipDelay = false) {
      if (this.shownChildren.size > 0) {
        this.$_pendingHide = true;
        return;
      }
      this.$_updateParentShownChildren(false);
      this.$_hideInProgress = true;
      clearTimeout(this.$_scheduleTimer);
      if (this.isShown) {
        hidingPopper = this;
      }
      if (skipDelay) {
        this.$_applyHide();
      } else {
        this.$_scheduleTimer = setTimeout(this.$_applyHide.bind(this), this.$_computeDelay("hide"));
      }
    },
    $_computeDelay(type) {
      const delay = this.delay;
      return parseInt(delay && delay[type] || delay || 0);
    },
    async $_applyShow(skipTransition = false) {
      clearTimeout(this.$_disposeTimer);
      clearTimeout(this.$_scheduleTimer);
      this.skipTransition = skipTransition;
      if (this.isShown) {
        return;
      }
      this.$_ensureTeleport();
      await nextFrame();
      await this.$_computePosition();
      await this.$_applyShowEffect();
      if (!this.positioningDisabled) {
        this.$_registerEventListeners([
          ...getScrollParents(this.$_referenceNode),
          ...getScrollParents(this.$_popperNode)
        ], "scroll", () => {
          this.$_computePosition();
        });
      }
    },
    async $_applyShowEffect() {
      if (this.$_hideInProgress)
        return;
      if (this.computeTransformOrigin) {
        const bounds = this.$_referenceNode.getBoundingClientRect();
        const popperWrapper = this.$_popperNode.querySelector(".v-popper__wrapper");
        const parentBounds = popperWrapper.parentNode.getBoundingClientRect();
        const x = bounds.x + bounds.width / 2 - (parentBounds.left + popperWrapper.offsetLeft);
        const y = bounds.y + bounds.height / 2 - (parentBounds.top + popperWrapper.offsetTop);
        this.result.transformOrigin = `${x}px ${y}px`;
      }
      this.isShown = true;
      this.$_applyAttrsToTarget({
        "aria-describedby": this.popperId,
        "data-popper-shown": ""
      });
      const showGroup = this.showGroup;
      if (showGroup) {
        let popover;
        for (let i = 0; i < shownPoppers.length; i++) {
          popover = shownPoppers[i];
          if (popover.showGroup !== showGroup) {
            popover.hide();
            popover.$emit("close-group");
          }
        }
      }
      shownPoppers.push(this);
      document.body.classList.add("v-popper--some-open");
      for (const theme of getAllParentThemes(this.theme)) {
        getShownPoppersByTheme(theme).push(this);
        document.body.classList.add(`v-popper--some-open--${theme}`);
      }
      this.$emit("apply-show");
      this.classes.showFrom = true;
      this.classes.showTo = false;
      this.classes.hideFrom = false;
      this.classes.hideTo = false;
      await nextFrame();
      this.classes.showFrom = false;
      this.classes.showTo = true;
      if (!this.noAutoFocus)
        this.$_popperNode.focus();
    },
    async $_applyHide(skipTransition = false) {
      if (this.shownChildren.size > 0) {
        this.$_pendingHide = true;
        this.$_hideInProgress = false;
        return;
      }
      clearTimeout(this.$_scheduleTimer);
      if (!this.isShown) {
        return;
      }
      this.skipTransition = skipTransition;
      removeFromArray(shownPoppers, this);
      if (shownPoppers.length === 0) {
        document.body.classList.remove("v-popper--some-open");
      }
      for (const theme of getAllParentThemes(this.theme)) {
        const list = getShownPoppersByTheme(theme);
        removeFromArray(list, this);
        if (list.length === 0) {
          document.body.classList.remove(`v-popper--some-open--${theme}`);
        }
      }
      if (hidingPopper === this) {
        hidingPopper = null;
      }
      this.isShown = false;
      this.$_applyAttrsToTarget({
        "aria-describedby": void 0,
        "data-popper-shown": void 0
      });
      clearTimeout(this.$_disposeTimer);
      const disposeTime = getDefaultConfig(this.theme, "disposeTimeout");
      if (disposeTime !== null) {
        this.$_disposeTimer = setTimeout(() => {
          if (this.$_popperNode) {
            this.$_detachPopperNode();
            this.isMounted = false;
          }
        }, disposeTime);
      }
      this.$_removeEventListeners("scroll");
      this.$emit("apply-hide");
      this.classes.showFrom = false;
      this.classes.showTo = false;
      this.classes.hideFrom = true;
      this.classes.hideTo = false;
      await nextFrame();
      this.classes.hideFrom = false;
      this.classes.hideTo = true;
    },
    $_autoShowHide() {
      if (this.shown) {
        this.show();
      } else {
        this.hide();
      }
    },
    $_ensureTeleport() {
      if (this.$_isDisposed)
        return;
      let container = this.container;
      if (typeof container === "string") {
        container = window.document.querySelector(container);
      } else if (container === false) {
        container = this.$_targetNodes[0].parentNode;
      }
      if (!container) {
        throw new Error("No container for popover: " + this.container);
      }
      container.appendChild(this.$_popperNode);
      this.isMounted = true;
    },
    $_addEventListeners() {
      const handleShow = (event) => {
        if (this.isShown && !this.$_hideInProgress) {
          return;
        }
        event.usedByTooltip = true;
        !this.$_preventShow && this.show({ event });
      };
      this.$_registerTriggerListeners(this.$_targetNodes, SHOW_EVENT_MAP, this.triggers, this.showTriggers, handleShow);
      this.$_registerTriggerListeners([this.$_popperNode], SHOW_EVENT_MAP, this.popperTriggers, this.popperShowTriggers, handleShow);
      const handleHide = (event) => {
        if (event.usedByTooltip) {
          return;
        }
        this.hide({ event });
      };
      this.$_registerTriggerListeners(this.$_targetNodes, HIDE_EVENT_MAP, this.triggers, this.hideTriggers, handleHide);
      this.$_registerTriggerListeners([this.$_popperNode], HIDE_EVENT_MAP, this.popperTriggers, this.popperHideTriggers, handleHide);
    },
    $_registerEventListeners(targetNodes, eventType, handler) {
      this.$_events.push({ targetNodes, eventType, handler });
      targetNodes.forEach((node) => node.addEventListener(eventType, handler, supportsPassive ? {
        passive: true
      } : void 0));
    },
    $_registerTriggerListeners(targetNodes, eventMap, commonTriggers, customTrigger, handler) {
      let triggers = commonTriggers;
      if (customTrigger != null) {
        triggers = typeof customTrigger === "function" ? customTrigger(triggers) : customTrigger;
      }
      triggers.forEach((trigger) => {
        const eventType = eventMap[trigger];
        if (eventType) {
          this.$_registerEventListeners(targetNodes, eventType, handler);
        }
      });
    },
    $_removeEventListeners(filterEventType) {
      const newList = [];
      this.$_events.forEach((listener) => {
        const { targetNodes, eventType, handler } = listener;
        if (!filterEventType || filterEventType === eventType) {
          targetNodes.forEach((node) => node.removeEventListener(eventType, handler));
        } else {
          newList.push(listener);
        }
      });
      this.$_events = newList;
    },
    $_refreshListeners() {
      if (!this.$_isDisposed) {
        this.$_removeEventListeners();
        this.$_addEventListeners();
      }
    },
    $_handleGlobalClose(event, touch = false) {
      if (this.$_showFrameLocked)
        return;
      this.hide({ event });
      if (event.closePopover) {
        this.$emit("close-directive");
      } else {
        this.$emit("auto-hide");
      }
      if (touch) {
        this.$_preventShow = true;
        setTimeout(() => {
          this.$_preventShow = false;
        }, 300);
      }
    },
    $_detachPopperNode() {
      this.$_popperNode.parentNode && this.$_popperNode.parentNode.removeChild(this.$_popperNode);
    },
    $_swapTargetAttrs(attrFrom, attrTo) {
      for (const el of this.$_targetNodes) {
        const value = el.getAttribute(attrFrom);
        if (value) {
          el.removeAttribute(attrFrom);
          el.setAttribute(attrTo, value);
        }
      }
    },
    $_applyAttrsToTarget(attrs) {
      for (const el of this.$_targetNodes) {
        for (const n in attrs) {
          const value = attrs[n];
          if (value == null) {
            el.removeAttribute(n);
          } else {
            el.setAttribute(n, value);
          }
        }
      }
    },
    $_updateParentShownChildren(value) {
      let parent = this.parentPopper;
      while (parent) {
        if (value) {
          parent.shownChildren.add(this.randomId);
        } else {
          parent.shownChildren.delete(this.randomId);
          if (parent.$_pendingHide) {
            parent.hide();
          }
        }
        parent = parent.parentPopper;
      }
    },
    $_isAimingPopper() {
      const referenceBounds = this.$_referenceNode.getBoundingClientRect();
      if (mouseX >= referenceBounds.left && mouseX <= referenceBounds.right && mouseY >= referenceBounds.top && mouseY <= referenceBounds.bottom) {
        const popperBounds = this.$_popperNode.getBoundingClientRect();
        const vectorX = mouseX - mousePreviousX;
        const vectorY = mouseY - mousePreviousY;
        const distance = popperBounds.left + popperBounds.width / 2 - mousePreviousX + (popperBounds.top + popperBounds.height / 2) - mousePreviousY;
        const newVectorLength = distance + popperBounds.width + popperBounds.height;
        const edgeX = mousePreviousX + vectorX * newVectorLength;
        const edgeY = mousePreviousY + vectorY * newVectorLength;
        return lineIntersectsLine(mousePreviousX, mousePreviousY, edgeX, edgeY, popperBounds.left, popperBounds.top, popperBounds.left, popperBounds.bottom) || lineIntersectsLine(mousePreviousX, mousePreviousY, edgeX, edgeY, popperBounds.left, popperBounds.top, popperBounds.right, popperBounds.top) || lineIntersectsLine(mousePreviousX, mousePreviousY, edgeX, edgeY, popperBounds.right, popperBounds.top, popperBounds.right, popperBounds.bottom) || lineIntersectsLine(mousePreviousX, mousePreviousY, edgeX, edgeY, popperBounds.left, popperBounds.bottom, popperBounds.right, popperBounds.bottom);
      }
      return false;
    }
  },
  render() {
    return this.$slots.default(this.slotData);
  }
});
if (typeof document !== "undefined" && typeof window !== "undefined") {
  if (isIOS) {
    document.addEventListener("touchstart", handleGlobalMousedown, supportsPassive ? {
      passive: true,
      capture: true
    } : true);
    document.addEventListener("touchend", handleGlobalTouchend, supportsPassive ? {
      passive: true,
      capture: true
    } : true);
  } else {
    window.addEventListener("mousedown", handleGlobalMousedown, true);
    window.addEventListener("click", handleGlobalClick, true);
  }
  window.addEventListener("resize", computePositionAllShownPoppers);
}
function handleGlobalMousedown(event) {
  for (let i = 0; i < shownPoppers.length; i++) {
    const popper = shownPoppers[i];
    try {
      const popperContent = popper.popperNode();
      popper.$_mouseDownContains = popperContent.contains(event.target);
    } catch (e) {
    }
  }
}
function handleGlobalClick(event) {
  handleGlobalClose(event);
}
function handleGlobalTouchend(event) {
  handleGlobalClose(event, true);
}
function handleGlobalClose(event, touch = false) {
  const preventClose = {};
  for (let i = shownPoppers.length - 1; i >= 0; i--) {
    const popper = shownPoppers[i];
    try {
      const contains2 = popper.$_containsGlobalTarget = isContainingEventTarget(popper, event);
      popper.$_pendingHide = false;
      requestAnimationFrame(() => {
        popper.$_pendingHide = false;
        if (preventClose[popper.randomId])
          return;
        if (shouldAutoHide(popper, contains2, event)) {
          popper.$_handleGlobalClose(event, touch);
          if (!event.closeAllPopover && event.closePopover && contains2) {
            let parent2 = popper.parentPopper;
            while (parent2) {
              preventClose[parent2.randomId] = true;
              parent2 = parent2.parentPopper;
            }
            return;
          }
          let parent = popper.parentPopper;
          while (parent) {
            if (shouldAutoHide(parent, parent.$_containsGlobalTarget, event)) {
              parent.$_handleGlobalClose(event, touch);
            } else {
              break;
            }
            parent = parent.parentPopper;
          }
        }
      });
    } catch (e) {
    }
  }
}
function isContainingEventTarget(popper, event) {
  const popperContent = popper.popperNode();
  return popper.$_mouseDownContains || popperContent.contains(event.target);
}
function shouldAutoHide(popper, contains2, event) {
  return event.closeAllPopover || event.closePopover && contains2 || getAutoHideResult(popper, event) && !contains2;
}
function getAutoHideResult(popper, event) {
  if (typeof popper.autoHide === "function") {
    const result = popper.autoHide(event);
    popper.lastAutoHide = result;
    return result;
  }
  return popper.autoHide;
}
function computePositionAllShownPoppers(event) {
  for (let i = 0; i < shownPoppers.length; i++) {
    const popper = shownPoppers[i];
    popper.$_computePosition(event);
  }
}
let mousePreviousX = 0;
let mousePreviousY = 0;
let mouseX = 0;
let mouseY = 0;
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (event) => {
    mousePreviousX = mouseX;
    mousePreviousY = mouseY;
    mouseX = event.clientX;
    mouseY = event.clientY;
  }, supportsPassive ? {
    passive: true
  } : void 0);
}
function lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}
var _export_sfc$1 = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$6 = {
  extends: PrivatePopper()
};
function _sfc_render$3$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "reference",
    class: normalizeClass(["v-popper", {
      "v-popper--shown": _ctx.slotData.isShown
    }])
  }, [
    renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(_ctx.slotData)))
  ], 2);
}
var Popper$1 = /* @__PURE__ */ _export_sfc$1(_sfc_main$6, [["render", _sfc_render$3$1]]);
function getInternetExplorerVersion() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
  }
  var trident = ua.indexOf("Trident/");
  if (trident > 0) {
    var rv = ua.indexOf("rv:");
    return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
  }
  var edge = ua.indexOf("Edge/");
  if (edge > 0) {
    return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
  }
  return -1;
}
let isIE;
function initCompat() {
  if (!initCompat.init) {
    initCompat.init = true;
    isIE = getInternetExplorerVersion() !== -1;
  }
}
var script = {
  name: "ResizeObserver",
  props: {
    emitOnMount: {
      type: Boolean,
      default: false
    },
    ignoreWidth: {
      type: Boolean,
      default: false
    },
    ignoreHeight: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "notify"
  ],
  mounted() {
    initCompat();
    nextTick(() => {
      this._w = this.$el.offsetWidth;
      this._h = this.$el.offsetHeight;
      if (this.emitOnMount) {
        this.emitSize();
      }
    });
    const object = document.createElement("object");
    this._resizeObject = object;
    object.setAttribute("aria-hidden", "true");
    object.setAttribute("tabindex", -1);
    object.onload = this.addResizeHandlers;
    object.type = "text/html";
    if (isIE) {
      this.$el.appendChild(object);
    }
    object.data = "about:blank";
    if (!isIE) {
      this.$el.appendChild(object);
    }
  },
  beforeUnmount() {
    this.removeResizeHandlers();
  },
  methods: {
    compareAndNotify() {
      if (!this.ignoreWidth && this._w !== this.$el.offsetWidth || !this.ignoreHeight && this._h !== this.$el.offsetHeight) {
        this._w = this.$el.offsetWidth;
        this._h = this.$el.offsetHeight;
        this.emitSize();
      }
    },
    emitSize() {
      this.$emit("notify", {
        width: this._w,
        height: this._h
      });
    },
    addResizeHandlers() {
      this._resizeObject.contentDocument.defaultView.addEventListener("resize", this.compareAndNotify);
      this.compareAndNotify();
    },
    removeResizeHandlers() {
      if (this._resizeObject && this._resizeObject.onload) {
        if (!isIE && this._resizeObject.contentDocument) {
          this._resizeObject.contentDocument.defaultView.removeEventListener("resize", this.compareAndNotify);
        }
        this.$el.removeChild(this._resizeObject);
        this._resizeObject.onload = null;
        this._resizeObject = null;
      }
    }
  }
};
const _withId = /* @__PURE__ */ withScopeId();
pushScopeId("data-v-b329ee4c");
const _hoisted_1$2$1 = {
  class: "resize-observer",
  tabindex: "-1"
};
popScopeId();
const render = /* @__PURE__ */ _withId((_ctx, _cache, $props, $setup, $data, $options) => {
  return openBlock(), createBlock("div", _hoisted_1$2$1);
});
script.render = render;
script.__scopeId = "data-v-b329ee4c";
script.__file = "src/components/ResizeObserver.vue";
var PrivateThemeClass = (prop = "theme") => ({
  computed: {
    themeClass() {
      return getThemeClasses(this[prop]);
    }
  }
});
const _sfc_main$5$1 = defineComponent({
  name: "VPopperContent",
  components: {
    ResizeObserver: script
  },
  mixins: [
    PrivateThemeClass()
  ],
  props: {
    popperId: String,
    theme: String,
    shown: Boolean,
    mounted: Boolean,
    skipTransition: Boolean,
    autoHide: Boolean,
    handleResize: Boolean,
    classes: Object,
    result: Object
  },
  emits: [
    "hide",
    "resize"
  ],
  methods: {
    toPx(value) {
      if (value != null && !isNaN(value)) {
        return `${value}px`;
      }
      return null;
    }
  }
});
const _hoisted_1$1$1 = ["id", "aria-hidden", "tabindex", "data-popper-placement"];
const _hoisted_2$1$1 = {
  ref: "inner",
  class: "v-popper__inner"
};
const _hoisted_3$6 = /* @__PURE__ */ createBaseVNode("div", { class: "v-popper__arrow-outer" }, null, -1);
const _hoisted_4$5 = /* @__PURE__ */ createBaseVNode("div", { class: "v-popper__arrow-inner" }, null, -1);
const _hoisted_5$6 = [
  _hoisted_3$6,
  _hoisted_4$5
];
function _sfc_render$2$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ResizeObserver = resolveComponent("ResizeObserver");
  return openBlock(), createElementBlock("div", {
    id: _ctx.popperId,
    ref: "popover",
    class: normalizeClass(["v-popper__popper", [
      _ctx.themeClass,
      _ctx.classes.popperClass,
      {
        "v-popper__popper--shown": _ctx.shown,
        "v-popper__popper--hidden": !_ctx.shown,
        "v-popper__popper--show-from": _ctx.classes.showFrom,
        "v-popper__popper--show-to": _ctx.classes.showTo,
        "v-popper__popper--hide-from": _ctx.classes.hideFrom,
        "v-popper__popper--hide-to": _ctx.classes.hideTo,
        "v-popper__popper--skip-transition": _ctx.skipTransition,
        "v-popper__popper--arrow-overflow": _ctx.result && _ctx.result.arrow.overflow,
        "v-popper__popper--no-positioning": !_ctx.result
      }
    ]]),
    style: normalizeStyle(_ctx.result ? {
      position: _ctx.result.strategy,
      transform: `translate3d(${Math.round(_ctx.result.x)}px,${Math.round(_ctx.result.y)}px,0)`
    } : void 0),
    "aria-hidden": _ctx.shown ? "false" : "true",
    tabindex: _ctx.autoHide ? 0 : void 0,
    "data-popper-placement": _ctx.result ? _ctx.result.placement : void 0,
    onKeyup: _cache[2] || (_cache[2] = withKeys(($event) => _ctx.autoHide && _ctx.$emit("hide"), ["esc"]))
  }, [
    createBaseVNode("div", {
      class: "v-popper__backdrop",
      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.autoHide && _ctx.$emit("hide"))
    }),
    createBaseVNode("div", {
      class: "v-popper__wrapper",
      style: normalizeStyle(_ctx.result ? {
        transformOrigin: _ctx.result.transformOrigin
      } : void 0)
    }, [
      createBaseVNode("div", _hoisted_2$1$1, [
        _ctx.mounted ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createBaseVNode("div", null, [
            renderSlot(_ctx.$slots, "default")
          ]),
          _ctx.handleResize ? (openBlock(), createBlock(_component_ResizeObserver, {
            key: 0,
            onNotify: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("resize", $event))
          })) : createCommentVNode("", true)
        ], 64)) : createCommentVNode("", true)
      ], 512),
      createBaseVNode("div", {
        ref: "arrow",
        class: "v-popper__arrow-container",
        style: normalizeStyle(_ctx.result ? {
          left: _ctx.toPx(_ctx.result.arrow.x),
          top: _ctx.toPx(_ctx.result.arrow.y)
        } : void 0)
      }, _hoisted_5$6, 4)
    ], 4)
  ], 46, _hoisted_1$1$1);
}
var PrivatePopperContent = /* @__PURE__ */ _export_sfc$1(_sfc_main$5$1, [["render", _sfc_render$2$1]]);
var PrivatePopperMethods = {
  methods: {
    show(...args) {
      return this.$refs.popper.show(...args);
    },
    hide(...args) {
      return this.$refs.popper.hide(...args);
    },
    dispose(...args) {
      return this.$refs.popper.dispose(...args);
    },
    onResize(...args) {
      return this.$refs.popper.onResize(...args);
    }
  }
};
const _sfc_main$4$1 = defineComponent({
  name: "VPopperWrapper",
  components: {
    Popper: Popper$1,
    PopperContent: PrivatePopperContent
  },
  mixins: [
    PrivatePopperMethods,
    PrivateThemeClass("finalTheme")
  ],
  props: {
    theme: {
      type: String,
      default: null
    }
  },
  computed: {
    finalTheme() {
      var _a;
      return (_a = this.theme) != null ? _a : this.$options.vPopperTheme;
    }
  },
  methods: {
    getTargetNodes() {
      return Array.from(this.$el.children).filter((node) => node !== this.$refs.popperContent.$el);
    }
  }
});
function _sfc_render$1$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PopperContent = resolveComponent("PopperContent");
  const _component_Popper = resolveComponent("Popper");
  return openBlock(), createBlock(_component_Popper, {
    ref: "popper",
    theme: _ctx.finalTheme,
    "target-nodes": _ctx.getTargetNodes,
    "popper-node": () => _ctx.$refs.popperContent.$el,
    class: normalizeClass([
      _ctx.themeClass
    ])
  }, {
    default: withCtx(({
      popperId,
      isShown,
      shouldMountContent,
      skipTransition,
      autoHide,
      show,
      hide,
      handleResize,
      onResize,
      classes,
      result
    }) => [
      renderSlot(_ctx.$slots, "default", {
        shown: isShown,
        show,
        hide
      }),
      createVNode(_component_PopperContent, {
        ref: "popperContent",
        "popper-id": popperId,
        theme: _ctx.finalTheme,
        shown: isShown,
        mounted: shouldMountContent,
        "skip-transition": skipTransition,
        "auto-hide": autoHide,
        "handle-resize": handleResize,
        classes,
        result,
        onHide: hide,
        onResize
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "popper", {
            shown: isShown,
            hide
          })
        ]),
        _: 2
      }, 1032, ["popper-id", "theme", "shown", "mounted", "skip-transition", "auto-hide", "handle-resize", "classes", "result", "onHide", "onResize"])
    ]),
    _: 3
  }, 8, ["theme", "target-nodes", "popper-node", "class"]);
}
var PrivatePopperWrapper = /* @__PURE__ */ _export_sfc$1(_sfc_main$4$1, [["render", _sfc_render$1$1]]);
const _sfc_main$3$1 = defineComponent(__spreadProps(__spreadValues({}, PrivatePopperWrapper), {
  name: "VDropdown",
  vPopperTheme: "dropdown"
}));
const _sfc_main$2$1 = defineComponent(__spreadProps(__spreadValues({}, PrivatePopperWrapper), {
  name: "VMenu",
  vPopperTheme: "menu"
}));
const _sfc_main$1$1 = defineComponent(__spreadProps(__spreadValues({}, PrivatePopperWrapper), {
  name: "VTooltip",
  vPopperTheme: "tooltip"
}));
const _sfc_main$7 = defineComponent({
  name: "VTooltipDirective",
  components: {
    Popper: PrivatePopper(),
    PopperContent: PrivatePopperContent
  },
  mixins: [
    PrivatePopperMethods
  ],
  inheritAttrs: false,
  props: {
    theme: {
      type: String,
      default: "tooltip"
    },
    html: {
      type: Boolean,
      default: (props) => getDefaultConfig(props.theme, "html")
    },
    content: {
      type: [String, Number, Function],
      default: null
    },
    loadingContent: {
      type: String,
      default: (props) => getDefaultConfig(props.theme, "loadingContent")
    }
  },
  data() {
    return {
      asyncContent: null
    };
  },
  computed: {
    isContentAsync() {
      return typeof this.content === "function";
    },
    loading() {
      return this.isContentAsync && this.asyncContent == null;
    },
    finalContent() {
      if (this.isContentAsync) {
        return this.loading ? this.loadingContent : this.asyncContent;
      }
      return this.content;
    }
  },
  watch: {
    content: {
      handler() {
        this.fetchContent(true);
      },
      immediate: true
    },
    async finalContent() {
      await this.$nextTick();
      this.$refs.popper.onResize();
    }
  },
  created() {
    this.$_fetchId = 0;
  },
  methods: {
    fetchContent(force) {
      if (typeof this.content === "function" && this.$_isShown && (force || !this.$_loading && this.asyncContent == null)) {
        this.asyncContent = null;
        this.$_loading = true;
        const fetchId = ++this.$_fetchId;
        const result = this.content(this);
        if (result.then) {
          result.then((res) => this.onResult(fetchId, res));
        } else {
          this.onResult(fetchId, result);
        }
      }
    },
    onResult(fetchId, result) {
      if (fetchId !== this.$_fetchId)
        return;
      this.$_loading = false;
      this.asyncContent = result;
    },
    onShow() {
      this.$_isShown = true;
      this.fetchContent();
    },
    onHide() {
      this.$_isShown = false;
    }
  }
});
const _hoisted_1$6 = ["innerHTML"];
const _hoisted_2$6 = ["textContent"];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PopperContent = resolveComponent("PopperContent");
  const _component_Popper = resolveComponent("Popper");
  return openBlock(), createBlock(_component_Popper, mergeProps({ ref: "popper" }, _ctx.$attrs, {
    theme: _ctx.theme,
    "popper-node": () => _ctx.$refs.popperContent.$el,
    onApplyShow: _ctx.onShow,
    onApplyHide: _ctx.onHide
  }), {
    default: withCtx(({
      popperId,
      isShown,
      shouldMountContent,
      skipTransition,
      autoHide,
      hide,
      handleResize,
      onResize,
      classes,
      result
    }) => [
      createVNode(_component_PopperContent, {
        ref: "popperContent",
        class: normalizeClass({
          "v-popper--tooltip-loading": _ctx.loading
        }),
        "popper-id": popperId,
        theme: _ctx.theme,
        shown: isShown,
        mounted: shouldMountContent,
        "skip-transition": skipTransition,
        "auto-hide": autoHide,
        "handle-resize": handleResize,
        classes,
        result,
        onHide: hide,
        onResize
      }, {
        default: withCtx(() => [
          _ctx.html ? (openBlock(), createElementBlock("div", {
            key: 0,
            innerHTML: _ctx.finalContent
          }, null, 8, _hoisted_1$6)) : (openBlock(), createElementBlock("div", {
            key: 1,
            textContent: toDisplayString(_ctx.finalContent)
          }, null, 8, _hoisted_2$6))
        ]),
        _: 2
      }, 1032, ["class", "popper-id", "theme", "shown", "mounted", "skip-transition", "auto-hide", "handle-resize", "classes", "result", "onHide", "onResize"])
    ]),
    _: 1
  }, 16, ["theme", "popper-node", "onApplyShow", "onApplyHide"]);
}
var PrivateTooltipDirective = /* @__PURE__ */ _export_sfc$1(_sfc_main$7, [["render", _sfc_render$5]]);
const TARGET_CLASS = "v-popper--has-tooltip";
function getPlacement(options2, modifiers) {
  let result = options2.placement;
  if (!result && modifiers) {
    for (const pos of placements) {
      if (modifiers[pos]) {
        result = pos;
      }
    }
  }
  if (!result) {
    result = getDefaultConfig(options2.theme || "tooltip", "placement");
  }
  return result;
}
function getOptions(el, value, modifiers) {
  let options2;
  const type = typeof value;
  if (type === "string") {
    options2 = { content: value };
  } else if (value && type === "object") {
    options2 = value;
  } else {
    options2 = { content: false };
  }
  options2.placement = getPlacement(options2, modifiers);
  options2.targetNodes = () => [el];
  options2.referenceNode = () => el;
  return options2;
}
let directiveApp;
let directives;
let uid = 0;
function ensureDirectiveApp() {
  if (directiveApp)
    return;
  directives = ref([]);
  directiveApp = createApp({
    name: "VTooltipDirectiveApp",
    setup() {
      return {
        directives
      };
    },
    render() {
      return this.directives.map((directive) => {
        return h(PrivateTooltipDirective, __spreadProps(__spreadValues({}, directive.options), {
          shown: directive.shown || directive.options.shown,
          key: directive.id
        }));
      });
    },
    devtools: {
      hide: true
    }
  });
  const mountTarget = document.createElement("div");
  document.body.appendChild(mountTarget);
  directiveApp.mount(mountTarget);
}
function createTooltip(el, value, modifiers) {
  ensureDirectiveApp();
  const options2 = ref(getOptions(el, value, modifiers));
  const shown = ref(false);
  const item = {
    id: uid++,
    options: options2,
    shown
  };
  directives.value.push(item);
  if (el.classList) {
    el.classList.add(TARGET_CLASS);
  }
  const result = el.$_popper = {
    options: options2,
    item,
    show() {
      shown.value = true;
    },
    hide() {
      shown.value = false;
    }
  };
  return result;
}
function destroyTooltip(el) {
  if (el.$_popper) {
    const index = directives.value.indexOf(el.$_popper.item);
    if (index !== -1)
      directives.value.splice(index, 1);
    delete el.$_popper;
    delete el.$_popperOldShown;
    delete el.$_popperMountTarget;
  }
  if (el.classList) {
    el.classList.remove(TARGET_CLASS);
  }
}
function bind(el, { value, modifiers }) {
  const options2 = getOptions(el, value, modifiers);
  if (!options2.content || getDefaultConfig(options2.theme || "tooltip", "disabled")) {
    destroyTooltip(el);
  } else {
    let directive;
    if (el.$_popper) {
      directive = el.$_popper;
      directive.options.value = options2;
    } else {
      directive = createTooltip(el, value, modifiers);
    }
    if (typeof value.shown !== "undefined" && value.shown !== el.$_popperOldShown) {
      el.$_popperOldShown = value.shown;
      value.shown ? directive.show() : directive.hide();
    }
  }
}
var PrivateVTooltip = {
  beforeMount: bind,
  updated: bind,
  beforeUnmount(el) {
    destroyTooltip(el);
  }
};
function addListeners(el) {
  el.addEventListener("click", onClick);
  el.addEventListener("touchstart", onTouchStart, supportsPassive ? {
    passive: true
  } : false);
}
function removeListeners(el) {
  el.removeEventListener("click", onClick);
  el.removeEventListener("touchstart", onTouchStart);
  el.removeEventListener("touchend", onTouchEnd);
  el.removeEventListener("touchcancel", onTouchCancel);
}
function onClick(event) {
  const el = event.currentTarget;
  event.closePopover = !el.$_vclosepopover_touch;
  event.closeAllPopover = el.$_closePopoverModifiers && !!el.$_closePopoverModifiers.all;
}
function onTouchStart(event) {
  if (event.changedTouches.length === 1) {
    const el = event.currentTarget;
    el.$_vclosepopover_touch = true;
    const touch = event.changedTouches[0];
    el.$_vclosepopover_touchPoint = touch;
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchCancel);
  }
}
function onTouchEnd(event) {
  const el = event.currentTarget;
  el.$_vclosepopover_touch = false;
  if (event.changedTouches.length === 1) {
    const touch = event.changedTouches[0];
    const firstTouch = el.$_vclosepopover_touchPoint;
    event.closePopover = Math.abs(touch.screenY - firstTouch.screenY) < 20 && Math.abs(touch.screenX - firstTouch.screenX) < 20;
    event.closeAllPopover = el.$_closePopoverModifiers && !!el.$_closePopoverModifiers.all;
  }
}
function onTouchCancel(event) {
  const el = event.currentTarget;
  el.$_vclosepopover_touch = false;
}
var PrivateVClosePopper = {
  beforeMount(el, { value, modifiers }) {
    el.$_closePopoverModifiers = modifiers;
    if (typeof value === "undefined" || value) {
      addListeners(el);
    }
  },
  updated(el, { value, oldValue, modifiers }) {
    el.$_closePopoverModifiers = modifiers;
    if (value !== oldValue) {
      if (typeof value === "undefined" || value) {
        addListeners(el);
      } else {
        removeListeners(el);
      }
    }
  },
  beforeUnmount(el) {
    removeListeners(el);
  }
};
function install(app2, options2 = {}) {
  if (app2.$_vTooltipInstalled)
    return;
  app2.$_vTooltipInstalled = true;
  assign$1(config, options2);
  app2.directive("tooltip", PrivateVTooltip);
  app2.directive("close-popper", PrivateVClosePopper);
  app2.component("VTooltip", _sfc_main$1$1);
  app2.component("VDropdown", _sfc_main$3$1);
  app2.component("VMenu", _sfc_main$2$1);
}
const plugin = {
  version: "2.0.0-beta.20",
  install,
  options: config
};
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/build/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  const links = document.getElementsByTagName("link");
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    const isBaseRelative = !!importerUrl;
    if (isBaseRelative) {
      for (let i = links.length - 1; i >= 0; i--) {
        const link2 = links[i];
        if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
          return;
        }
      }
    } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
/*!
  * vue-router v4.1.6
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
const isBrowser = typeof window !== "undefined";
function isESModule(obj) {
  return obj.__esModule || obj[Symbol.toStringTag] === "Module";
}
const assign = Object.assign;
function applyToParams(fn, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = isArray(value) ? value.map(fn) : fn(value);
  }
  return newParams;
}
const noop = () => {
};
const isArray = Array.isArray;
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash2 = "";
  const hashPos = location2.indexOf("#");
  let searchPos = location2.indexOf("?");
  if (hashPos < searchPos && hashPos >= 0) {
    searchPos = -1;
  }
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash2 = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash2,
    path,
    query,
    hash: hash2
  };
}
function stringifyURL(stringifyQuery2, location2) {
  const query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function stripBase(pathname, base) {
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
    return pathname;
  return pathname.slice(base.length) || "/";
}
function isSameRouteLocation(stringifyQuery2, a, b) {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length)
    return false;
  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a, b) {
  return isArray(a) ? isEquivalentArray(a, b) : isArray(b) ? isEquivalentArray(b, a) : a === b;
}
function isEquivalentArray(a, b) {
  return isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (segment === ".")
      continue;
    if (segment === "..") {
      if (position > 1)
        position--;
    } else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
}
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
function normalizeBase(base) {
  if (!base) {
    if (isBrowser) {
      const baseEl = document.querySelector("base");
      base = baseEl && baseEl.getAttribute("href") || "/";
      base = base.replace(/^\w+:\/\/[^\/]+/, "");
    } else {
      base = "/";
    }
  }
  if (base[0] !== "/" && base[0] !== "#")
    base = "/" + base;
  return removeTrailingSlash(base);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location2) {
  return base.replace(BEFORE_HASH_RE, "#") + location2;
}
function getElementPosition(el, offset2) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset2.behavior,
    left: elRect.left - docRect.left - (offset2.left || 0),
    top: elRect.top - docRect.top - (offset2.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function scrollToPosition(position) {
  let scrollToOptions;
  if ("el" in position) {
    const positionEl = position.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      return;
    }
    scrollToOptions = getElementPosition(el, position);
  } else {
    scrollToOptions = position;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
  }
}
function getScrollKey(path, delta) {
  const position = history.state ? history.state.position - delta : -1;
  return position + path;
}
const scrollPositions = /* @__PURE__ */ new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
let createBaseLocation = () => location.protocol + "//" + location.host;
function createCurrentLocation(base, location2) {
  const { pathname, search, hash: hash2 } = location2;
  const hashPos = base.indexOf("#");
  if (hashPos > -1) {
    let slicePos = hash2.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
    let pathFromHash = hash2.slice(slicePos);
    if (pathFromHash[0] !== "/")
      pathFromHash = "/" + pathFromHash;
    return stripBase(pathFromHash, "");
  }
  const path = stripBase(pathname, base);
  return path + search + hash2;
}
function useHistoryListeners(base, historyState, currentLocation, replace) {
  let listeners = [];
  let teardowns = [];
  let pauseState = null;
  const popStateHandler = ({ state }) => {
    const to = createCurrentLocation(base, location);
    const from = currentLocation.value;
    const fromState = historyState.value;
    let delta = 0;
    if (state) {
      currentLocation.value = to;
      historyState.value = state;
      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }
      delta = fromState ? state.position - fromState.position : 0;
    } else {
      replace(to);
    }
    listeners.forEach((listener) => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
      });
    });
  };
  function pauseListeners() {
    pauseState = currentLocation.value;
  }
  function listen(callback) {
    listeners.push(callback);
    const teardown = () => {
      const index = listeners.indexOf(callback);
      if (index > -1)
        listeners.splice(index, 1);
    };
    teardowns.push(teardown);
    return teardown;
  }
  function beforeUnloadListener() {
    const { history: history2 } = window;
    if (!history2.state)
      return;
    history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
  }
  function destroy() {
    for (const teardown of teardowns)
      teardown();
    teardowns = [];
    window.removeEventListener("popstate", popStateHandler);
    window.removeEventListener("beforeunload", beforeUnloadListener);
  }
  window.addEventListener("popstate", popStateHandler);
  window.addEventListener("beforeunload", beforeUnloadListener);
  return {
    pauseListeners,
    listen,
    destroy
  };
}
function buildState(back, current, forward, replaced = false, computeScroll = false) {
  return {
    back,
    current,
    forward,
    replaced,
    position: window.history.length,
    scroll: computeScroll ? computeScrollPosition() : null
  };
}
function useHistoryStateNavigation(base) {
  const { history: history2, location: location2 } = window;
  const currentLocation = {
    value: createCurrentLocation(base, location2)
  };
  const historyState = { value: history2.state };
  if (!historyState.value) {
    changeLocation(currentLocation.value, {
      back: null,
      current: currentLocation.value,
      forward: null,
      position: history2.length - 1,
      replaced: true,
      scroll: null
    }, true);
  }
  function changeLocation(to, state, replace2) {
    const hashIndex = base.indexOf("#");
    const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
    try {
      history2[replace2 ? "replaceState" : "pushState"](state, "", url);
      historyState.value = state;
    } catch (err) {
      {
        console.error(err);
      }
      location2[replace2 ? "replace" : "assign"](url);
    }
  }
  function replace(to, data) {
    const state = assign({}, history2.state, buildState(
      historyState.value.back,
      to,
      historyState.value.forward,
      true
    ), data, { position: historyState.value.position });
    changeLocation(to, state, true);
    currentLocation.value = to;
  }
  function push(to, data) {
    const currentState = assign(
      {},
      historyState.value,
      history2.state,
      {
        forward: to,
        scroll: computeScrollPosition()
      }
    );
    changeLocation(currentState.current, currentState, true);
    const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
    changeLocation(to, state, false);
    currentLocation.value = to;
  }
  return {
    location: currentLocation,
    state: historyState,
    push,
    replace
  };
}
function createWebHistory(base) {
  base = normalizeBase(base);
  const historyNavigation = useHistoryStateNavigation(base);
  const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
  function go(delta, triggerListeners = true) {
    if (!triggerListeners)
      historyListeners.pauseListeners();
    history.go(delta);
  }
  const routerHistory = assign({
    location: "",
    base,
    go,
    createHref: createHref.bind(null, base)
  }, historyNavigation, historyListeners);
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => historyNavigation.location.value
  });
  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => historyNavigation.state.value
  });
  return routerHistory;
}
function isRouteLocation(route) {
  return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
const NavigationFailureSymbol = Symbol("");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  const score = [];
  let pattern = options.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [90];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict)
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i = 1; i < match.length; i++) {
      const value = match[i] || "";
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (isArray(param) && !repeatable) {
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          }
          const text = isArray(param) ? param.join("/") : param;
          if (!text) {
            if (optional) {
              if (segment.length < 2) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }
    return path || "/";
  }
  return {
    re,
    score,
    keys,
    parse,
    stringify
  };
}
function compareScoreArray(a, b) {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    if (diff)
      return diff;
    i++;
  }
  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    if (comp)
      return comp;
    i++;
  }
  if (Math.abs(bScore.length - aScore.length) === 1) {
    if (isLastScoreNegative(aScore))
      return 1;
    if (isLastScoreNegative(bScore))
      return -1;
  }
  return bScore.length - aScore.length;
}
function isLastScoreNegative(score) {
  const last = score[score.length - 1];
  return score.length > 0 && last[last.length - 1] < 0;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer = "";
  }
  function addCharToBuffer() {
    buffer += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher = assign(parser, {
    record,
    parent,
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes2, globalOptions) {
  const matchers = [];
  const matcherMap = /* @__PURE__ */ new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [
      mainNormalizedRecord
    ];
    if ("alias" in record) {
      const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases) {
        normalizedRecords.push(assign({}, mainNormalizedRecord, {
          components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
          path: alias,
          aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
        }));
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher))
          removeRoute(record.name);
      }
      if (mainNormalizedRecord.children) {
        const children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher;
      if (matcher.record.components && Object.keys(matcher.record.components).length || matcher.record.name || matcher.record.redirect) {
        insertMatcher(matcher);
      }
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index = matchers.indexOf(matcherRef);
      if (index > -1) {
        matchers.splice(index, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    let i = 0;
    while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && (matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i])))
      i++;
    matchers.splice(i, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve(location2, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;
    if ("name" in location2 && location2.name) {
      matcher = matcherMap.get(location2.name);
      if (!matcher)
        throw createRouterError(1, {
          location: location2
        });
      name = matcher.record.name;
      params = assign(
        paramsFromLocation(
          currentLocation.params,
          matcher.keys.filter((k) => !k.optional).map((k) => k.name)
        ),
        location2.params && paramsFromLocation(location2.params, matcher.keys.map((k) => k.name))
      );
      path = matcher.stringify(params);
    } else if ("path" in location2) {
      path = location2.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name = matcher.record.name;
      params = assign({}, currentLocation.params, location2.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes2.forEach((route) => addRoute(route));
  return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
}
function paramsFromLocation(params, keys) {
  const newParams = {};
  for (const key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  return {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: void 0,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in record ? record.components || null : record.component && { default: record.component }
  };
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (const name in record.components)
      propsObject[name] = typeof props === "boolean" ? props : props[name];
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
  const options = {};
  for (const key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }
  return options;
}
function isRecordChildOf(record, parent) {
  return parent.children.some((child) => child === record || isRecordChildOf(record, child));
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text) {
  return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text) {
  return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
  try {
    return decodeURIComponent("" + text);
  } catch (err) {
  }
  return "" + text;
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    const eqPos = searchParam.indexOf("=");
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    const values = isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (const key in query) {
    const value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
const matchedRouteKey = Symbol("");
const viewDepthKey = Symbol("");
const routerKey = Symbol("");
const routeLocationKey = Symbol("");
const routerViewLocationKey = Symbol("");
function useCallbacks() {
  let handlers = [];
  function add(handler) {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i > -1)
        handlers.splice(i, 1);
    };
  }
  function reset() {
    handlers = [];
  }
  return {
    add,
    list: () => handlers,
    reset
  };
}
function guardToPromiseFn(guard, to, from, record, name) {
  const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve, reject) => {
    const next = (valid) => {
      if (valid === false) {
        reject(createRouterError(4, {
          from,
          to
        }));
      } else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") {
          enterCallbackArray.push(valid);
        }
        resolve();
      }
    };
    const guardReturn = guard.call(record && record.instances[name], to, from, next);
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        const options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.components[name] = resolvedComponent;
          const options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name)();
        }));
      }
    }
  }
  return guards;
}
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function useLink(props) {
  const router2 = inject(routerKey);
  const currentRoute = inject(routeLocationKey);
  const route = computed(() => router2.resolve(unref(props.to)));
  const activeRecordIndex = computed(() => {
    const { matched } = route.value;
    const { length } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index > -1)
      return index;
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index;
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      return router2[unref(props.replace) ? "replace" : "push"](
        unref(props.to)
      ).catch(noop);
    }
    return Promise.resolve();
  }
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink,
  setup(props, { slots }) {
    const link = reactive(useLink(props));
    const { options } = inject(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && slots.default(link);
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent({
  name: "RouterView",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  compatConfig: { MODE: 3 },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const injectedDepth = inject(viewDepthKey, 0);
    const depth = computed(() => {
      let initialDepth = unref(injectedDepth);
      const { matched } = routeToDisplay.value;
      let matchedRoute;
      while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
        initialDepth++;
      }
      return initialDepth;
    });
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
    provide(viewDepthKey, computed(() => depth.value + 1));
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
      }
    }, { flush: "post" });
    return () => {
      const route = routeToDisplay.value;
      const currentName = props.name;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[currentName];
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route });
      }
      const routePropsOption = matchedRoute.props[currentName];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return normalizeSlot(slots.default, { Component: component, route }) || component;
    };
  }
});
function normalizeSlot(slot, data) {
  if (!slot)
    return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter(options) {
  const matcher = createRouterMatcher(options.routes, options);
  const parseQuery$1 = options.parseQuery || parseQuery;
  const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  const routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = applyToParams.bind(null, decode);
  function addRoute(parentOrRoute, route) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name) {
    const recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if ("path" in rawLocation) {
      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      const targetParams = assign({}, rawLocation.params);
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }
      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(rawLocation.params)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash2 = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash2),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);
    return assign({
      fullPath,
      hash: hash2,
      query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
        newTargetLocation.params = {};
      }
      return assign({
        query: to.query,
        hash: to.hash,
        params: "path" in newTargetLocation ? {} : to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve(to);
    const from = currentRoute.value;
    const data = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(
        assign(locationAsObject(shouldRedirect), {
          state: typeof shouldRedirect === "object" ? assign({}, data, shouldRedirect.state) : data,
          force,
          replace: replace2
        }),
        redirectedFrom || targetLocation
      );
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(
        from,
        from,
        true,
        false
      );
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? isNavigationFailure(error, 2) ? error : markAsReady(error) : triggerError(error, toLocation, from)).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(failure2, 2)) {
          return pushWithRedirect(
            assign({
              replace: replace2
            }, locationAsObject(failure2.to), {
              state: typeof failure2.to === "object" ? assign({}, data, failure2.to.state) : data,
              force
            }),
            redirectedFrom || toLocation
          );
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of to.matched) {
        if (record.beforeEnter && !from.matched.includes(record)) {
          if (isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    for (const guard of afterGuards.list())
      guard(to, from, failure);
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign({
          scroll: isFirstNavigation && state && state.scroll
        }, data));
      else
        routerHistory.push(toLocation.fullPath, data);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    if (removeHistoryListener)
      return;
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      if (!router2.listening)
        return;
      const toLocation = resolve(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(error, 4 | 8)) {
          return error;
        }
        if (isNavigationFailure(error, 2)) {
          pushWithRedirect(
            error.to,
            toLocation
          ).then((failure) => {
            if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop);
          return Promise.reject();
        }
        if (info.delta) {
          routerHistory.go(-info.delta, false);
        }
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(
          toLocation,
          from,
          false
        );
        if (failure) {
          if (info.delta && !isNavigationFailure(failure, 8)) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop);
    });
  }
  let readyHandlers = useCallbacks();
  let errorHandlers = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorHandlers.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve2, reject) => {
      readyHandlers.add([resolve2, reject]);
    });
  }
  function markAsReady(err) {
    if (!ready) {
      ready = !err;
      setupListeners();
      readyHandlers.list().forEach(([resolve2, reject]) => err ? reject(err) : resolve2());
      readyHandlers.reset();
    }
    return err;
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta) => routerHistory.go(delta);
  let started;
  const installedApps = /* @__PURE__ */ new Set();
  const router2 = {
    currentRoute,
    listening: true,
    addRoute,
    removeRoute,
    hasRoute,
    getRoutes,
    resolve,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorHandlers.add,
    isReady,
    install(app2) {
      const router3 = this;
      app2.component("RouterLink", RouterLink);
      app2.component("RouterView", RouterView);
      app2.config.globalProperties.$router = router3;
      Object.defineProperty(app2.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      if (isBrowser && !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        reactiveRoute[key] = computed(() => currentRoute.value[key]);
      }
      app2.provide(routerKey, router3);
      app2.provide(routeLocationKey, reactive(reactiveRoute));
      app2.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app2.unmount;
      installedApps.add(app2);
      app2.unmount = function() {
        installedApps.delete(app2);
        if (installedApps.size < 1) {
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          removeHistoryListener = null;
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }
        unmountApp();
      };
    }
  };
  return router2;
}
function runGuardQueue(guards) {
  return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
const LogisticsHomeComponent = () => __vitePreload(() => import("./HomeComponent.e062945e.js"), true ? ["assets/HomeComponent.e062945e.js","assets/vue.esm-bundler.ecfa1491.js","assets/jquery.8baacbdb.js"] : void 0);
const LogisticsEntryComponent = () => __vitePreload(() => import("./EntryComponent.561abb49.js"), true ? ["assets/EntryComponent.561abb49.js","assets/vue.esm-bundler.ecfa1491.js","assets/jquery.8baacbdb.js","assets/jquery.dataTables.min.70653878.js"] : void 0);
const LogisticsEntriesComponent = () => __vitePreload(() => import("./EntriesComponent.fadf5b73.js"), true ? ["assets/EntriesComponent.fadf5b73.js","assets/vue.esm-bundler.ecfa1491.js","assets/jquery.8baacbdb.js","assets/jquery.dataTables.min.70653878.js"] : void 0);
const LogisticsInventoryComponent = () => __vitePreload(() => import("./InventoryComponent.c2308401.js"), true ? ["assets/InventoryComponent.c2308401.js","assets/vue.esm-bundler.ecfa1491.js","assets/jquery.8baacbdb.js","assets/jquery.dataTables.min.70653878.js","assets/icon-jpg.b5720497.js"] : void 0);
const LogisticsOutputComponent = () => __vitePreload(() => import("./OutputComponent.3d128c8d.js"), true ? ["assets/OutputComponent.3d128c8d.js","assets/vue.esm-bundler.ecfa1491.js","assets/jquery.8baacbdb.js","assets/jquery.dataTables.min.70653878.js"] : void 0);
const LogisticsOutputsComponent = () => __vitePreload(() => import("./OutputsComponent.917d60c0.js"), true ? ["assets/OutputsComponent.917d60c0.js","assets/vue.esm-bundler.ecfa1491.js","assets/jquery.8baacbdb.js","assets/jquery.dataTables.min.70653878.js"] : void 0);
const LogisticsEntryDetailComponent = () => __vitePreload(() => import("./EntryDetailComponent.67eb1313.js"), true ? ["assets/EntryDetailComponent.67eb1313.js","assets/vue.esm-bundler.ecfa1491.js","assets/icon-jpg.b5720497.js"] : void 0);
const LogisticsOutputDetailComponent = () => __vitePreload(() => import("./OutputDetailComponent.0bcb4430.js"), true ? ["assets/OutputDetailComponent.0bcb4430.js","assets/vue.esm-bundler.ecfa1491.js","assets/icon-jpg.b5720497.js"] : void 0);
const AdminComponent = () => __vitePreload(() => import("./HomeComponent.b4370c18.js"), true ? ["assets/HomeComponent.b4370c18.js","assets/vue.esm-bundler.ecfa1491.js"] : void 0);
const AdminSystemsComponent = () => __vitePreload(() => import("./SystemsComponent.9db5f0c9.js"), true ? ["assets/SystemsComponent.9db5f0c9.js","assets/vue.esm-bundler.ecfa1491.js","assets/jquery.8baacbdb.js","assets/jquery.dataTables.min.70653878.js"] : void 0);
const AdminUsersComponent = () => __vitePreload(() => import("./UsersComponent.61c81a14.js"), true ? ["assets/UsersComponent.61c81a14.js","assets/vue.esm-bundler.ecfa1491.js"] : void 0);
const AdminRolesComponent = () => __vitePreload(() => import("./RolesComponent.c3ef9c73.js"), true ? ["assets/RolesComponent.c3ef9c73.js","assets/vue.esm-bundler.ecfa1491.js"] : void 0);
const AdminSecurityComponent = () => __vitePreload(() => import("./SecurityComponent.7c644a3a.js"), true ? ["assets/SecurityComponent.7c644a3a.js","assets/vue.esm-bundler.ecfa1491.js"] : void 0);
const AdminWarehousesComponent = () => __vitePreload(() => import("./WarehousesComponent.5fb2c7ee.js"), true ? ["assets/WarehousesComponent.5fb2c7ee.js","assets/vue.esm-bundler.ecfa1491.js"] : void 0);
const routes = [
  {
    path: "/semtinel/public/admin",
    name: "admin.home",
    component: AdminComponent
  },
  {
    path: "/semtinel/public/admin/systems",
    name: "admin.systems",
    component: AdminSystemsComponent
  },
  {
    path: "/semtinel/public/admin/users",
    name: "admin.users",
    component: AdminUsersComponent
  },
  {
    path: "/semtinel/public/admin/roles",
    name: "admin.roles",
    component: AdminRolesComponent
  },
  {
    path: "/semtinel/public/admin/security",
    name: "admin.security",
    component: AdminSecurityComponent
  },
  {
    path: "/semtinel/public/admin/warehouses",
    name: "admin.warehouses",
    component: AdminWarehousesComponent
  },
  {
    path: "/semtinel/public/logistics",
    name: "logistics.home",
    component: LogisticsHomeComponent
  },
  {
    path: "/semtinel/public/logistics/entry",
    name: "logistics.entry",
    component: LogisticsEntryComponent
  },
  {
    path: "/semtinel/public/logistics/entries",
    name: "logistics.entries",
    component: LogisticsEntriesComponent
  },
  {
    path: "/semtinel/public/logistics/inventory",
    name: "logistics.inventory",
    component: LogisticsInventoryComponent
  },
  {
    path: "/semtinel/public/logistics/output",
    name: "logistics.output",
    component: LogisticsOutputComponent
  },
  {
    path: "/semtinel/public/logistics/outputs",
    name: "logistics.outputs",
    component: LogisticsOutputsComponent
  },
  {
    path: "/semtinel/public/logistics/entry.detail/:entry",
    name: "logistics.entry.detail",
    component: LogisticsEntryDetailComponent,
    props: true
  },
  {
    path: "/semtinel/public/logistics/output.detail/:output",
    name: "logistics.output.detail",
    component: LogisticsOutputDetailComponent,
    props: true
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});
const _hoisted_1$5 = { class: "mt-2" };
const _hoisted_2$5 = {
  class: "nav nav-pills nav-sidebar flex-column",
  "data-widget": "treeview",
  role: "menu",
  "data-accordion": "false"
};
const _hoisted_3$5 = /* @__PURE__ */ createStaticVNode('<li class="nav-header">CONFIGURACI\xD3N</li><li class="nav-item"><a href="#" class="nav-link"><i class="nav-icon mdi mdi-application-brackets-outline"></i><p class="text">Sistemas</p></a></li>', 2);
const _hoisted_5$5 = /* @__PURE__ */ createStaticVNode('<a href="#" class="nav-link"><i class="nav-icon mdi mdi-account-group-outline"></i><p> Usuarios <i class="right fas fa-angle-left"></i></p></a><ul class="nav nav-treeview"><li class="nav-item"><a href="#" class="nav-link"><i class="nav-icon mdi mdi-account-multiple"></i><p class="text">Usuarios</p></a></li><li class="nav-item"><a href="#" class="nav-link"><i class="nav-icon mdi mdi-account-star"></i><p class="text">Roles</p></a></li><li class="nav-item"><a href="#" class="nav-link"><i class="nav-icon mdi mdi-account-key"></i><p class="text">Permisos</p></a></li></ul>', 2);
const _hoisted_7$5 = [
  _hoisted_5$5
];
const _hoisted_8$4 = /* @__PURE__ */ createBaseVNode("a", {
  href: "#",
  class: "nav-link"
}, [
  /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-file-tree" }),
  /* @__PURE__ */ createBaseVNode("p", null, [
    /* @__PURE__ */ createTextVNode(" Estructuras "),
    /* @__PURE__ */ createBaseVNode("i", { class: "right fas fa-angle-left" })
  ])
], -1);
const _hoisted_9$4 = { class: "nav nav-treeview" };
const _hoisted_10$4 = /* @__PURE__ */ createBaseVNode("li", { class: "nav-item" }, [
  /* @__PURE__ */ createBaseVNode("a", {
    href: "#",
    class: "nav-link"
  }, [
    /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-plus-network nav-icon" }),
    /* @__PURE__ */ createBaseVNode("p", null, "OBES")
  ])
], -1);
const _hoisted_11$4 = { class: "nav-item" };
const _hoisted_12$3 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-plus-network nav-icon" }, null, -1);
const _hoisted_13$2 = /* @__PURE__ */ createBaseVNode("p", null, "Proyectos", -1);
const _hoisted_14$2 = [
  _hoisted_12$3,
  _hoisted_13$2
];
const _hoisted_15$2 = /* @__PURE__ */ createStaticVNode('<li class="nav-header">NOTIFICACIONES</li><li class="nav-item"><a href="#" class="nav-link"><i class="nav-icon far fa-circle text-danger"></i><p class="text">Importante</p></a></li><li class="nav-item"><a href="#" class="nav-link"><i class="nav-icon far fa-circle text-warning"></i><p>Alerta</p></a></li><li class="nav-item"><a href="#" class="nav-link"><i class="nav-icon far fa-circle text-info"></i><p>Informati\xF3n</p></a></li>', 4);
const _sfc_main$5 = {
  __name: "SidebarComponent",
  setup(__props) {
    const url = window.location.href;
    const pages = [
      "tree_structures",
      "new_structure"
    ];
    let page_active = "";
    for (const key in pages) {
      if (url.toLowerCase().indexOf(pages[key]) >= 0)
        page_active = pages[key];
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("nav", _hoisted_1$5, [
        createBaseVNode("ul", _hoisted_2$5, [
          _hoisted_3$5,
          createBaseVNode("li", {
            class: normalizeClass(["nav-item", unref(page_active) == "users" ? "menu-is-opening menu-open" : ""])
          }, _hoisted_7$5, 2),
          createBaseVNode("li", {
            class: normalizeClass(["nav-item", unref(page_active) == "tree_structures" ? "menu-is-opening menu-open" : ""])
          }, [
            _hoisted_8$4,
            createBaseVNode("ul", _hoisted_9$4, [
              _hoisted_10$4,
              createBaseVNode("li", _hoisted_11$4, [
                createBaseVNode("a", {
                  id: "lnk-tree-structures",
                  href: "tree_structures",
                  class: normalizeClass(["nav-link", unref(page_active) == "tree_structures" ? "active" : ""])
                }, _hoisted_14$2, 2)
              ])
            ])
          ], 2),
          _hoisted_15$2
        ])
      ]);
    };
  }
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$4 = {
  async setup() {
    const tree = ref({});
    await axios.get("api/tree_structures").then(function(response) {
      if (response.data.success) {
        tree.value = response.data.tree;
        console.log(tree.value);
      }
    }).catch(function(error) {
      error_txt = "Ha ocurrido un error. Por favor, prueba nuevamente.";
      return;
    });
    return { tree };
  }
};
const _hoisted_1$4 = { class: "card" };
const _hoisted_2$4 = /* @__PURE__ */ createBaseVNode("div", { class: "card-header" }, [
  /* @__PURE__ */ createBaseVNode("h3", { class: "card-title" }, " Polos activos ")
], -1);
const _hoisted_3$4 = { class: "card-body" };
const _hoisted_4$4 = { id: "structures-tree" };
const _hoisted_5$4 = ["id"];
const _hoisted_6$4 = { href: "#" };
const _hoisted_7$4 = /* @__PURE__ */ createBaseVNode("i", { class: "fas fa-map-marker-alt" }, null, -1);
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$4, [
    _hoisted_2$4,
    createBaseVNode("div", _hoisted_3$4, [
      createBaseVNode("ul", _hoisted_4$4, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.tree, (pole, index) => {
          return openBlock(), createElementBlock("li", {
            key: index,
            id: `p${pole.id}`
          }, [
            createBaseVNode("a", _hoisted_6$4, [
              _hoisted_7$4,
              createTextVNode("\xA0\xA0" + toDisplayString(pole.name), 1)
            ])
          ], 8, _hoisted_5$4);
        }), 128))
      ])
    ])
  ]);
}
const TreestructuresComponent = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
const _sfc_main$3 = {
  props: {
    pagetitle: {
      type: String,
      default: "T\xEDtulo",
      required: true
    },
    breadcrumbs: {
      type: Boolean,
      default: false
    },
    navbar: {
      type: Array,
      default: () => [{ page: "", link: "", tooltip: "", active: false }]
    },
    pole_project: {
      type: Boolean,
      default: false,
      required: false
    },
    pole: {
      type: String,
      default: "Polo",
      required: false
    },
    project: {
      type: String,
      default: "Proyecto",
      required: false
    }
  }
};
const _hoisted_1$3 = { class: "content-header px-0 py-1" };
const _hoisted_2$3 = { class: "container-fluid" };
const _hoisted_3$3 = { class: "row mb-2" };
const _hoisted_4$3 = { class: "col-md-6 px-2" };
const _hoisted_5$3 = { class: "col-sm-6 px-2" };
const _hoisted_6$3 = {
  key: 0,
  class: "breadcrumb float-sm-right"
};
const _hoisted_7$3 = { key: 1 };
const _hoisted_8$3 = { key: 1 };
const _hoisted_9$3 = { class: "text-right" };
const _hoisted_10$3 = /* @__PURE__ */ createBaseVNode("span", null, "Polo:", -1);
const _hoisted_11$3 = /* @__PURE__ */ createBaseVNode("span", null, "Proyecto:", -1);
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  const _directive_tooltip = resolveDirective("tooltip");
  return openBlock(), createElementBlock("section", _hoisted_1$3, [
    createBaseVNode("div", _hoisted_2$3, [
      createBaseVNode("div", _hoisted_3$3, [
        createBaseVNode("div", _hoisted_4$3, [
          createBaseVNode("h4", null, toDisplayString($props.pagetitle), 1)
        ]),
        createBaseVNode("div", _hoisted_5$3, [
          $props.breadcrumbs ? (openBlock(), createElementBlock("ol", _hoisted_6$3, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($props.navbar, (item, idx) => {
              return openBlock(), createElementBlock("li", {
                key: idx,
                class: normalizeClass(["breadcrumb-item", item["active"] ? "active" : ""])
              }, [
                !item["active"] ? withDirectives((openBlock(), createBlock(_component_router_link, {
                  key: 0,
                  to: item["link"],
                  class: "page-nav"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(item["page"]), 1)
                  ]),
                  _: 2
                }, 1032, ["to"])), [
                  [_directive_tooltip, item["tooltip"]]
                ]) : createCommentVNode("", true),
                item["active"] ? (openBlock(), createElementBlock("span", _hoisted_7$3, toDisplayString(item["page"]), 1)) : createCommentVNode("", true)
              ], 2);
            }), 128))
          ])) : createCommentVNode("", true),
          $props.pole_project ? (openBlock(), createElementBlock("div", _hoisted_8$3, [
            createBaseVNode("h6", _hoisted_9$3, [
              _hoisted_10$3,
              createTextVNode(" " + toDisplayString($props.pole) + "\xA0\xA0\xA0\xA0\xA0\xA0\xA0", 1),
              _hoisted_11$3,
              createTextVNode(" " + toDisplayString($props.project), 1)
            ])
          ])) : createCommentVNode("", true)
        ])
      ])
    ])
  ]);
}
const PageHeader = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = {
  data: function() {
    return {
      session: JSON.parse(sessionStorage.getItem("semtinel")),
      pole: "",
      pole_name: "",
      projects: [],
      project: "",
      project_name: ""
    };
  },
  watch: {},
  methods: {
    changePole: function(pole_id, pole_abbr, pole_name) {
      let cmp = this, projects = [];
      cmp.pole = pole_abbr;
      cmp.pole_name = pole_name;
      cmp.session.projects.map(function(value, key) {
        if (value.id_pole == pole_id)
          projects.push(value);
      });
      cmp.projects = projects;
      cmp.project = cmp.projects[0]["id"];
      cmp.project_name = cmp.projects[0]["name"];
      localStorage.setItem("stnel_logist_pole", cmp.pole);
      localStorage.setItem("stnel_logist_project", cmp.project);
      cmp.$router.push("/semtinel/public/logistics");
    },
    changeProject: function(project_id, project_name) {
      let cmp = this;
      cmp.project = project_id;
      cmp.project_name = project_name;
      localStorage.setItem("stnel_logist_project", cmp.project);
      cmp.$router.push("/semtinel/public/logistics");
    }
  },
  created() {
    this.pole = this.session.poles[0]["abbr"];
    this.changePole(this.session.poles[0]["id"], this.session.poles[0]["abbr"], this.session.poles[0]["name"]);
  }
};
const _hoisted_1$2 = { class: "content-sidebar" };
const _hoisted_2$2 = /* @__PURE__ */ createBaseVNode("div", { class: "sidebar-header" }, [
  /* @__PURE__ */ createBaseVNode("h5", null, "Configuraci\xF3n")
], -1);
const _hoisted_3$2 = { class: "sidebar-config" };
const _hoisted_4$2 = /* @__PURE__ */ createBaseVNode("div", { class: "config-header" }, "POLO", -1);
const _hoisted_5$2 = { class: "config-item" };
const _hoisted_6$2 = {
  name: "app_pole",
  size: "1",
  class: "form-control mb-2"
};
const _hoisted_7$2 = ["value", "onClick"];
const _hoisted_8$2 = { class: "sidebar-config" };
const _hoisted_9$2 = /* @__PURE__ */ createBaseVNode("div", { class: "config-header" }, "PROYECTO", -1);
const _hoisted_10$2 = { class: "config-item" };
const _hoisted_11$2 = {
  name: "app_pole",
  size: "1",
  class: "form-control mb-2"
};
const _hoisted_12$2 = ["value", "onClick"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_tooltip = resolveDirective("tooltip");
  return openBlock(), createElementBlock("section", _hoisted_1$2, [
    _hoisted_2$2,
    createBaseVNode("div", _hoisted_3$2, [
      _hoisted_4$2,
      createBaseVNode("div", _hoisted_5$2, [
        withDirectives((openBlock(), createElementBlock("select", _hoisted_6$2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.session.poles, (option, index) => {
            return openBlock(), createElementBlock(Fragment, { key: index }, [
              option["name"] != "Todos" ? (openBlock(), createElementBlock("option", {
                key: 0,
                value: option["abbr"],
                onClick: withModifiers(($event) => $options.changePole(option["id"], option["abbr"], option["name"]), ["stop"])
              }, toDisplayString(option["name"]), 9, _hoisted_7$2)) : createCommentVNode("", true)
            ], 64);
          }), 128))
        ])), [
          [_directive_tooltip, "Polo " + _ctx.pole_name]
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_8$2, [
      _hoisted_9$2,
      createBaseVNode("div", _hoisted_10$2, [
        withDirectives((openBlock(), createElementBlock("select", _hoisted_11$2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.projects, (option, index) => {
            return openBlock(), createElementBlock("option", {
              key: index,
              value: option["id"],
              onClick: withModifiers(($event) => $options.changeProject(option["id"], option["name"]), ["stop"])
            }, toDisplayString(option["name"]), 9, _hoisted_12$2);
          }), 128))
        ])), [
          [_directive_tooltip, "Obra " + _ctx.project_name]
        ])
      ])
    ])
  ]);
}
const ControlSidebarComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = {
  data: function() {
    return {
      app_name: "admin",
      page_active: "home"
    };
  },
  watch: {
    $route(to, from) {
      this.page_active = this.$root.page_active;
    }
  }
};
const _hoisted_1$1 = { class: "mt-2" };
const _hoisted_2$1 = {
  class: "nav nav-pills nav-sidebar flex-column nav-child-indent",
  "data-widget": "treeview",
  role: "menu",
  "data-accordion": "false"
};
const _hoisted_3$1 = /* @__PURE__ */ createBaseVNode("li", { class: "nav-header" }, "SEMTINEL", -1);
const _hoisted_4$1 = { class: "nav-item" };
const _hoisted_5$1 = /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-cog" }, null, -1);
const _hoisted_6$1 = /* @__PURE__ */ createBaseVNode("p", null, [
  /* @__PURE__ */ createTextVNode(" Configuraci\xF3n "),
  /* @__PURE__ */ createBaseVNode("i", { class: "right fas fa-angle-left" })
], -1);
const _hoisted_7$1 = [
  _hoisted_5$1,
  _hoisted_6$1
];
const _hoisted_8$1 = { class: "nav nav-treeview" };
const _hoisted_9$1 = { class: "nav-item" };
const _hoisted_10$1 = /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-application-brackets-outline" }, null, -1);
const _hoisted_11$1 = /* @__PURE__ */ createBaseVNode("p", { class: "text" }, "Sistemas", -1);
const _hoisted_12$1 = { class: "nav-item" };
const _hoisted_13$1 = /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-account-multiple" }, null, -1);
const _hoisted_14$1 = /* @__PURE__ */ createBaseVNode("p", { class: "text" }, "Usuarios", -1);
const _hoisted_15$1 = { class: "nav-item" };
const _hoisted_16$1 = /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-badge-account-horizontal" }, null, -1);
const _hoisted_17$1 = /* @__PURE__ */ createBaseVNode("p", { class: "text" }, "Roles", -1);
const _hoisted_18$1 = { class: "nav-item" };
const _hoisted_19$1 = /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-account-key" }, null, -1);
const _hoisted_20$1 = /* @__PURE__ */ createBaseVNode("p", { class: "text" }, "Permisos", -1);
const _hoisted_21 = /* @__PURE__ */ createBaseVNode("a", {
  href: "#",
  class: "nav-link"
}, [
  /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-file-tree" }),
  /* @__PURE__ */ createBaseVNode("p", null, [
    /* @__PURE__ */ createTextVNode(" Estructuras "),
    /* @__PURE__ */ createBaseVNode("i", { class: "right fas fa-angle-left" })
  ])
], -1);
const _hoisted_22 = { class: "nav nav-treeview" };
const _hoisted_23 = /* @__PURE__ */ createBaseVNode("li", { class: "nav-item" }, [
  /* @__PURE__ */ createBaseVNode("a", {
    href: "#",
    class: "nav-link"
  }, [
    /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-plus-network nav-icon" }),
    /* @__PURE__ */ createBaseVNode("p", null, "OBES")
  ])
], -1);
const _hoisted_24 = { class: "nav-item" };
const _hoisted_25 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-plus-network nav-icon" }, null, -1);
const _hoisted_26 = /* @__PURE__ */ createBaseVNode("p", null, "Proyectos", -1);
const _hoisted_27 = [
  _hoisted_25,
  _hoisted_26
];
const _hoisted_28 = { class: "nav-item" };
const _hoisted_29 = /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-truck-check" }, null, -1);
const _hoisted_30 = /* @__PURE__ */ createBaseVNode("p", null, [
  /* @__PURE__ */ createTextVNode(" Log\xEDstica "),
  /* @__PURE__ */ createBaseVNode("i", { class: "right fas fa-angle-left" })
], -1);
const _hoisted_31 = [
  _hoisted_29,
  _hoisted_30
];
const _hoisted_32 = { class: "nav nav-treeview" };
const _hoisted_33 = { class: "nav-item" };
const _hoisted_34 = /* @__PURE__ */ createBaseVNode("i", { class: "mdi mdi-warehouse nav-icon" }, null, -1);
const _hoisted_35 = /* @__PURE__ */ createBaseVNode("p", null, "Almacenes", -1);
const _hoisted_36 = /* @__PURE__ */ createStaticVNode('<li class="nav-header">NOTIFICACIONES</li><li class="nav-item"><a href="#" class="nav-link"><i class="nav-icon far fa-circle text-danger"></i><p class="text">Importante</p></a></li><li class="nav-item"><a href="#" class="nav-link"><i class="nav-icon far fa-circle text-warning"></i><p>Alerta</p></a></li><li class="nav-item"><a href="#" class="nav-link"><i class="nav-icon far fa-circle text-info"></i><p>Informati\xF3n</p></a></li>', 4);
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  return openBlock(), createElementBlock("nav", _hoisted_1$1, [
    createBaseVNode("ul", _hoisted_2$1, [
      _hoisted_3$1,
      createBaseVNode("li", _hoisted_4$1, [
        createBaseVNode("a", {
          href: "#",
          class: normalizeClass(["nav-link", _ctx.page_active == "systems" || _ctx.page_active == "users" || _ctx.page_active == "roles" || _ctx.page_active == "security" ? "active" : ""])
        }, _hoisted_7$1, 2),
        createBaseVNode("ul", _hoisted_8$1, [
          createBaseVNode("li", _hoisted_9$1, [
            createVNode(_component_router_link, {
              to: "/semtinel/public/admin/systems",
              class: normalizeClass(["nav-link", _ctx.app_name == "admin" && _ctx.page_active == "systems" ? "active" : ""])
            }, {
              default: withCtx(() => [
                _hoisted_10$1,
                _hoisted_11$1
              ]),
              _: 1
            }, 8, ["class"])
          ]),
          createBaseVNode("li", _hoisted_12$1, [
            createVNode(_component_router_link, {
              to: "/semtinel/public/admin/users",
              class: normalizeClass(["nav-link", _ctx.app_name == "admin" && _ctx.page_active == "users" ? "active" : ""])
            }, {
              default: withCtx(() => [
                _hoisted_13$1,
                _hoisted_14$1
              ]),
              _: 1
            }, 8, ["class"])
          ]),
          createBaseVNode("li", _hoisted_15$1, [
            createVNode(_component_router_link, {
              to: "/semtinel/public/admin/roles",
              class: normalizeClass(["nav-link", _ctx.app_name == "admin" && _ctx.page_active == "roles" ? "active" : ""])
            }, {
              default: withCtx(() => [
                _hoisted_16$1,
                _hoisted_17$1
              ]),
              _: 1
            }, 8, ["class"])
          ]),
          createBaseVNode("li", _hoisted_18$1, [
            createVNode(_component_router_link, {
              to: "/semtinel/public/admin/security",
              class: normalizeClass(["nav-link", _ctx.app_name == "admin" && _ctx.page_active == "security" ? "active" : ""])
            }, {
              default: withCtx(() => [
                _hoisted_19$1,
                _hoisted_20$1
              ]),
              _: 1
            }, 8, ["class"])
          ])
        ])
      ]),
      createBaseVNode("li", {
        class: normalizeClass(["nav-item", _ctx.page_active == "tree_structures" ? "menu-is-opening menu-open" : ""])
      }, [
        _hoisted_21,
        createBaseVNode("ul", _hoisted_22, [
          _hoisted_23,
          createBaseVNode("li", _hoisted_24, [
            createBaseVNode("a", {
              id: "lnk-tree-structures",
              href: "tree_structures",
              class: normalizeClass(["nav-link", _ctx.page_active == "tree_structures" ? "active" : ""])
            }, _hoisted_27, 2)
          ])
        ])
      ], 2),
      createBaseVNode("li", _hoisted_28, [
        createBaseVNode("a", {
          href: "#",
          class: normalizeClass(["nav-link", _ctx.page_active == "warehouse" ? "active" : ""])
        }, _hoisted_31, 2),
        createBaseVNode("ul", _hoisted_32, [
          createBaseVNode("li", _hoisted_33, [
            createVNode(_component_router_link, {
              to: "/semtinel/public/admin/warehouses",
              class: normalizeClass(["nav-link", _ctx.app_name == "admin" && _ctx.page_active == "warehouse" ? "active" : ""])
            }, {
              default: withCtx(() => [
                _hoisted_34,
                _hoisted_35
              ]),
              _: 1
            }, 8, ["class"])
          ])
        ])
      ]),
      _hoisted_36
    ])
  ]);
}
const AdminSidebarComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = {
  data: function() {
    return {
      app_name: "logistics",
      page_active: "home"
    };
  },
  watch: {
    $route(to, from) {
      this.page_active = this.$root.page_active;
    }
  }
};
const _hoisted_1 = { class: "mt-2" };
const _hoisted_2 = {
  class: "nav nav-pills nav-sidebar flex-column",
  "data-widget": "treeview",
  role: "menu",
  "data-accordion": "false"
};
const _hoisted_3 = /* @__PURE__ */ createBaseVNode("li", { class: "nav-header" }, "RECEPCI\xD3N", -1);
const _hoisted_4 = {
  key: 0,
  class: "nav-item"
};
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-truck-check-outline" }, null, -1);
const _hoisted_6 = /* @__PURE__ */ createBaseVNode("p", { class: "text" }, "Nueva Entrada", -1);
const _hoisted_7 = { class: "nav-item" };
const _hoisted_8 = /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-format-list-bulleted-square" }, null, -1);
const _hoisted_9 = /* @__PURE__ */ createBaseVNode("p", { class: "text" }, "Todas las Entradas", -1);
const _hoisted_10 = /* @__PURE__ */ createBaseVNode("li", { class: "nav-header" }, "INVENTARIOS", -1);
const _hoisted_11 = { class: "nav-item" };
const _hoisted_12 = /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-inbox-full" }, null, -1);
const _hoisted_13 = /* @__PURE__ */ createBaseVNode("p", { class: "text" }, "Inventarios en obra", -1);
const _hoisted_14 = /* @__PURE__ */ createBaseVNode("li", { class: "nav-header" }, "DESPACHO", -1);
const _hoisted_15 = {
  key: 1,
  class: "nav-item"
};
const _hoisted_16 = /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-cart-arrow-right" }, null, -1);
const _hoisted_17 = /* @__PURE__ */ createBaseVNode("p", { class: "text" }, "Nueva Salida", -1);
const _hoisted_18 = { class: "nav-item" };
const _hoisted_19 = /* @__PURE__ */ createBaseVNode("i", { class: "nav-icon mdi mdi-format-list-bulleted-square" }, null, -1);
const _hoisted_20 = /* @__PURE__ */ createBaseVNode("p", { class: "text" }, "Todas las Salidas", -1);
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  return openBlock(), createElementBlock("nav", _hoisted_1, [
    createBaseVNode("ul", _hoisted_2, [
      _hoisted_3,
      "logistics.api.store.entry" in _ctx.$root.session.permissions ? (openBlock(), createElementBlock("li", _hoisted_4, [
        createVNode(_component_router_link, {
          to: "/semtinel/public/logistics/entry",
          class: normalizeClass(["nav-link", _ctx.app_name == "logistics" && _ctx.page_active == "entry" ? "active" : ""])
        }, {
          default: withCtx(() => [
            _hoisted_5,
            _hoisted_6
          ]),
          _: 1
        }, 8, ["class"])
      ])) : createCommentVNode("", true),
      createBaseVNode("li", _hoisted_7, [
        createVNode(_component_router_link, {
          to: "/semtinel/public/logistics/entries",
          class: normalizeClass(["nav-link", _ctx.app_name == "logistics" && _ctx.page_active == "entries" ? "active" : ""])
        }, {
          default: withCtx(() => [
            _hoisted_8,
            _hoisted_9
          ]),
          _: 1
        }, 8, ["class"])
      ]),
      _hoisted_10,
      createBaseVNode("li", _hoisted_11, [
        createVNode(_component_router_link, {
          to: "/semtinel/public/logistics/inventory",
          class: normalizeClass(["nav-link", _ctx.app_name == "logistics" && _ctx.page_active == "inventory" ? "active" : ""])
        }, {
          default: withCtx(() => [
            _hoisted_12,
            _hoisted_13
          ]),
          _: 1
        }, 8, ["class"])
      ]),
      _hoisted_14,
      "logistics.api.store.output" in _ctx.$root.session.permissions ? (openBlock(), createElementBlock("li", _hoisted_15, [
        createVNode(_component_router_link, {
          to: "/semtinel/public/logistics/output",
          class: normalizeClass(["nav-link", _ctx.app_name == "logistics" && _ctx.page_active == "output" ? "active" : ""])
        }, {
          default: withCtx(() => [
            _hoisted_16,
            _hoisted_17
          ]),
          _: 1
        }, 8, ["class"])
      ])) : createCommentVNode("", true),
      createBaseVNode("li", _hoisted_18, [
        createVNode(_component_router_link, {
          to: "/semtinel/public/logistics/outputs",
          class: normalizeClass(["nav-link", _ctx.app_name == "logistics" && _ctx.page_active == "outputs" ? "active" : ""])
        }, {
          default: withCtx(() => [
            _hoisted_19,
            _hoisted_20
          ]),
          _: 1
        }, 8, ["class"])
      ])
    ])
  ]);
}
const LogisticsSidebarComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
const app = createApp({
  data() {
    return {
      appurl: "",
      apps: {
        "admin": "systems,users,roles,security,warehouse",
        "logistics": "entry,entries,inventory,output,outputs"
      },
      app_name: "semtinel",
      page_active: "home",
      cart_items: [],
      cart_quantity: 0,
      cart_warehouse: "",
      cart_totals: {
        price_total: 0
      },
      session: JSON.parse(sessionStorage.getItem("semtinel"))
    };
  },
  async created() {
  },
  mounted() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  },
  watch: {
    $route(to, from) {
      this.setAppActive(to.fullPath);
    }
  },
  methods: {
    setAppActive: function(url = "home") {
      const cmp = this;
      if (url == "home") {
        cmp.app_name = "semtinel";
        cmp.page_active = "home";
      } else {
        cmp.appurl = url;
        let url_parts = url.split("/"), app_name_assigned = false, page_active_assigned = false;
        for (const appname in cmp.apps) {
          const pages = cmp.apps[appname].split(",");
          for (const key_page in pages) {
            for (const key_part in url_parts) {
              if (url_parts[key_part] == appname) {
                cmp.app_name = appname;
                app_name_assigned = true;
              }
              if (url_parts[key_part] == pages[key_page]) {
                cmp.page_active = pages[key_page];
                page_active_assigned = true;
              }
            }
          }
        }
        if (app_name_assigned && !page_active_assigned) {
          cmp.page_active = "home";
        }
      }
    },
    changeAppActive: function() {
      LogisticsSidebarComponent.data.page_active = "home";
    },
    goToInventory: function() {
      this.$refs.CartClose.click();
      this.$router.push("/semtinel/public/logistics/inventory");
    },
    goToOutput: function() {
      this.$refs.CartClose.click();
      this.$router.push("/semtinel/public/logistics/output");
    },
    calcTotalsCart: function() {
      let cmp = this;
      if (cmp.cart_quantity == 0) {
        cmp.cart_warehouse = "";
        return;
      }
      cmp.cart_totals.price_total = 0;
      cmp.cart_items.map(function(product) {
        cmp.cart_totals.price_total += parseFloat(product.price_total);
      });
    },
    removeFromCart: function(idx) {
      let cmp = this;
      cmp.cart_items.splice(idx, 1);
      cmp.cart_quantity -= 1;
      cmp.calcTotalsCart();
    }
  }
});
app.component("sidebar-component", _sfc_main$5);
app.component("tree-structures", TreestructuresComponent);
app.component("header-content", PageHeader);
app.component("control-sidebar", ControlSidebarComponent);
app.component("admin-sidebar", AdminSidebarComponent);
app.component("logistics-sidebar", LogisticsSidebarComponent);
app.use(router);
app.use(plugin);
app.mount("#app");
app.mounted;
export {
  PageHeader as P,
  _export_sfc as _
};
