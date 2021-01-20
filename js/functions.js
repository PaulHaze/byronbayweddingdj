/*! jRespond.js v 0.10 | Author: Jeremy Fields [jeremy.fields@viget.com], 2013 | License: MIT */
!(function (a, b, c) {
  typeof module === 'object' && module && typeof module.exports === 'object'
    ? (module.exports = c)
    : ((a[b] = c),
      typeof define === 'function' &&
        define.amd &&
        define(b, [], function () {
          return c;
        }));
})(
  this,
  'jRespond',
  (function (a, b, c) {
    return function (a) {
      const b = [];
      const d = [];
      const e = a;
      let f = '';
      let g = '';
      let i = 0;
      const j = 100;
      const k = 500;
      let l = k;
      const m = function () {
        let a = 0;
        return (a =
          typeof window.innerWidth !== 'number'
            ? document.documentElement.clientWidth !== 0
              ? document.documentElement.clientWidth
              : document.body.clientWidth
            : window.innerWidth);
      };
      const n = function (a) {
        if (a.length === c) o(a);
        else for (let b = 0; b < a.length; b++) o(a[b]);
      };
      var o = function (a) {
        const e = a.breakpoint;
        const h = a.enter || c;
        b.push(a),
          d.push(!1),
          r(e) &&
            (h !== c && h.call(null, { entering: f, exiting: g }),
            (d[b.length - 1] = !0));
      };
      const p = function () {
        for (var a = [], e = [], h = 0; h < b.length; h++) {
          const i = b[h].breakpoint;
          const j = b[h].enter || c;
          const k = b[h].exit || c;
          i === '*'
            ? (j !== c && a.push(j), k !== c && e.push(k))
            : r(i)
            ? (j === c || d[h] || a.push(j), (d[h] = !0))
            : (k !== c && d[h] && e.push(k), (d[h] = !1));
        }
        for (var l = { entering: f, exiting: g }, m = 0; m < e.length; m++)
          e[m].call(null, l);
        for (let n = 0; n < a.length; n++) a[n].call(null, l);
      };
      const q = function (a) {
        for (var b = !1, c = 0; c < e.length; c++)
          if (a >= e[c].enter && a <= e[c].exit) {
            b = !0;
            break;
          }
        b && f !== e[c].label
          ? ((g = f), (f = e[c].label), p())
          : b || f === '' || ((f = ''), p());
      };
      var r = function (a) {
        if (typeof a === 'object') {
          if (a.join().indexOf(f) >= 0) return !0;
        } else {
          if (a === '*') return !0;
          if (typeof a === 'string' && f === a) return !0;
        }
      };
      var s = function () {
        const a = m();
        a !== i ? ((l = j), q(a)) : (l = k), (i = a), setTimeout(s, l);
      };
      return (
        s(),
        {
          addFunc(a) {
            n(a);
          },
          getBreakpoint() {
            return f;
          },
        }
      );
    };
  })(this, this.document),
);

const $ = jQuery.noConflict();

// Scrolled
$.fn.scrollEnd = function (callback, timeout) {
  $(this).scroll(function () {
    const container = $(this);
    if (container.data('scrollTimeout')) {
      clearTimeout(container.data('scrollTimeout'));
    }
    container.data('scrollTimeout', setTimeout(callback, timeout));
  });
};

(function () {
  let lastTime = 0;
  const vendors = ['ms', 'moz', 'webkit', 'o'];
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
    window.cancelAnimationFrame =
      window[`${vendors[x]}CancelAnimationFrame`] ||
      window[`${vendors[x]}CancelRequestAnimationFrame`];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
})();

function debounce(func, wait, immediate) {
  let timeout;
  let args;
  let context;
  let timestamp;
  let result;
  return function () {
    context = this;
    args = arguments;
    timestamp = new Date();
    const later = function () {
      const last = new Date() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    if (callNow) result = func.apply(context, args);
    return result;
  };
}

function onScrollSliderParallax() {
  SEMICOLON.slider.sliderParallax();
  SEMICOLON.slider.sliderElementsFade();
}

var SEMICOLON = SEMICOLON || {};

(function ($) {
  // USE STRICT

  SEMICOLON.initialize = {
    init() {
      SEMICOLON.initialize.defaults();
      SEMICOLON.initialize.pageTransition();
      SEMICOLON.initialize.goToTop();
      SEMICOLON.initialize.lazyLoad();
      SEMICOLON.initialize.lightbox();
      SEMICOLON.initialize.resizeVideos();
      SEMICOLON.initialize.dataResponsiveClasses();
      SEMICOLON.initialize.dataResponsiveHeights();
      SEMICOLON.initialize.stickFooterOnSmall();
    },

    execFunc(functionName, context) {
      const args = Array.prototype.slice.call(arguments, 2);
      const namespaces = functionName.split('.');
      const func = namespaces.pop();

      for (let i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
      }

      if (typeof context[func] !== 'undefined') {
        return context[func].apply(context, args);
      }
      console.log(`${functionName} Function does not exist`);
    },

    execPlugin(element, settings) {
      window.scwEvents = window.scwEvents || {};
      let pluginActive = false;
      let pluginLinkingInterval;

      if (settings.trigger && !scwEvents[settings.trigger]) {
        pluginLinkingInterval = setInterval(
          (function plugFn() {
            const pluginFnExec = Function(`return ${settings.pluginfn}`)();
            if (pluginFnExec) {
              $(window).trigger(settings.trigger);
              scwEvents[settings.trigger] = true;
              clearInterval(pluginLinkingInterval);
            }
            return plugFn;
          })(),
          1000,
        );
      } else {
        pluginActive = true;
      }

      if (settings.execfn) {
        if (settings.trigger && !pluginActive) {
          $(window).on(settings.trigger, function () {
            SEMICOLON.initialize.execFunc(settings.execfn, window, element);
          });
        } else {
          SEMICOLON.initialize.execFunc(settings.execfn, window, element);
        }
      }

      if (settings.class) {
        $body.addClass(settings.class);
      }
    },

    jsLinking(element, settings) {
      if (element.length < 1) {
        return false;
      }

      if (
        settings.hiddendisable &&
        element.filter(':hidden').length == element.length
      ) {
        return false;
      }

      const pluginFnExec = Function(`return ${settings.pluginfn}`)();
      let jsPath = 'js/';
      let file;
      let disableAJAX = false;

      if (typeof scwJsPath !== 'undefined') {
        jsPath = `${scwJsPath}/`;
      }

      if (
        typeof scwDisableJsAJAX !== 'undefined' &&
        scwDisableJsAJAX === true
      ) {
        disableAJAX = true;
      }

      if (/^(f|ht)tps?:\/\//i.test(window.decodeURIComponent(settings.file))) {
        file = settings.file;
      } else {
        file = jsPath + settings.file;
      }

      if (pluginFnExec) {
        SEMICOLON.initialize.execPlugin(element, settings);
      } else if (!disableAJAX) {
        $.ajax({
          url: file,
          dataType: 'script',
          cache: true,
          crossDomain: true,
          timeout: 5000,
        })
          .done(function () {
            SEMICOLON.initialize.execPlugin(element, settings);
          })
          .fail(function () {
            console.log(settings.error);
          });
      } else {
        console.log(settings.error);
      }
    },

    functions(settings) {
      let element;
      let parent;
      let item;

      if (typeof settings.element === 'object' && settings.element !== null) {
        if (settings.element.parent !== 'undefined') {
          parent = settings.element.parent;
        }
        if (settings.element.el !== 'undefined') {
          settings.element = settings.element.el;
        }
      }

      if (settings.element) {
        item = settings.element;
      } else {
        item = settings.default;
      }

      if (parent === 'object') {
        element = parent.find(item);
      } else {
        element = $(item);
      }

      this.jsLinking(element, settings);
    },

    defaults() {
      const easingJs = {
        default: 'body',
        file: 'plugins.easing.js',
        error: 'plugins.easing.js: Plugin could not be loaded',
        pluginfn: 'typeof jQuery.easing["easeOutQuad"] !== "undefined"',
        trigger: 'pluginEasingReady',
        class: 'has-plugin-easing',
      };

      const bootstrapJs = {
        default: 'body',
        file: 'plugins.bootstrap.js',
        error: 'plugins.bootstrap.js: Plugin could not be loaded',
        pluginfn: 'typeof bootstrap !== "undefined"',
        trigger: 'pluginBootstrapReady',
        class: 'has-plugin-bootstrap',
      };

      const jRes = jRespond([
        {
          label: 'smallest',
          enter: 0,
          exit: 575,
        },
        {
          label: 'handheld',
          enter: 576,
          exit: 767,
        },
        {
          label: 'tablet',
          enter: 768,
          exit: 991,
        },
        {
          label: 'laptop',
          enter: 992,
          exit: 1199,
        },
        {
          label: 'desktop',
          enter: 1200,
          exit: 10000,
        },
      ]);

      jRes.addFunc([
        {
          breakpoint: 'desktop',
          enter() {
            $body.addClass('device-xl');
          },
          exit() {
            $body.removeClass('device-xl');
          },
        },
        {
          breakpoint: 'laptop',
          enter() {
            $body.addClass('device-lg');
          },
          exit() {
            $body.removeClass('device-lg');
          },
        },
        {
          breakpoint: 'tablet',
          enter() {
            $body.addClass('device-md');
          },
          exit() {
            $body.removeClass('device-md');
          },
        },
        {
          breakpoint: 'handheld',
          enter() {
            $body.addClass('device-sm');
          },
          exit() {
            $body.removeClass('device-sm');
          },
        },
        {
          breakpoint: 'smallest',
          enter() {
            $body.addClass('device-xs');
          },
          exit() {
            $body.removeClass('device-xs');
          },
        },
      ]);

      SEMICOLON.initialize.functions(easingJs);
      SEMICOLON.initialize.functions(bootstrapJs);

      if (!'IntersectionObserver' in window) {
        const intersectObserve = {
          default: 'body',
          file: 'intersection-observer.js',
          error: 'intersection-observer.js: Plugin could not be loaded',
          pluginfn: 'typeof window.IntersectionObserver !== "undefined"',
          trigger: 'intersectObservePolyfill',
          class: 'has-polyfill-intersection-observer',
        };

        SEMICOLON.initialize.functions(intersectObserve);
      }
    },

    goToTop() {
      let elementScrollSpeed = $goToTopEl.attr('data-speed');
      let elementScrollEasing = $goToTopEl.attr('data-easing');

      if (!elementScrollSpeed) {
        elementScrollSpeed = 700;
      }
      if (!elementScrollEasing) {
        elementScrollEasing = 'easeOutQuad';
      }

      $goToTopEl.off('click').on('click', function () {
        $('body,html').stop(true).animate(
          {
            scrollTop: 0,
          },
          Number(elementScrollSpeed),
          elementScrollEasing,
        );
        return false;
      });
    },

    goToTopScroll() {
      const elementMobile = $goToTopEl.attr('data-mobile');
      let elementOffset = $goToTopEl.attr('data-offset');

      if (!elementOffset) {
        elementOffset = 450;
      }

      if (
        elementMobile != 'true' &&
        ($body.hasClass('device-sm') || $body.hasClass('device-xs'))
      ) {
        return true;
      }

      if ($window.scrollTop() > Number(elementOffset)) {
        $goToTopEl.fadeIn();
        $body.addClass('gototop-active');
      } else {
        $goToTopEl.fadeOut();
        $body.removeClass('gototop-active');
      }
    },

    lightbox(element) {
      const settings = {
        element,
        default: '[data-lightbox]',
        file: 'plugins.lightbox.js',
        error: 'plugins.lightbox.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_lightboxInit',
        pluginfn: '$().magnificPopup',
        trigger: 'pluginLightboxReady',
        class: 'has-plugin-lightbox',
      };

      SEMICOLON.initialize.functions(settings);
    },

    modal(element) {
      const settings = {
        element,
        default: '.modal-on-load',
        file: 'plugins.lightbox.js',
        error: 'plugins.lightbox.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_modalInit',
        pluginfn: '$().magnificPopup',
        trigger: 'pluginLightboxReady',
        class: 'has-plugin-lightbox',
      };

      SEMICOLON.initialize.functions(settings);
    },

    resizeVideos() {
      const settings = {
        default:
          'iframe[src*="youtube"],iframe[src*="vimeo"],iframe[src*="dailymotion"],iframe[src*="maps.google.com"],iframe[src*="google.com/maps"]',
        file: 'plugins.fitvids.js',
        error: 'plugins.fitvids.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_resizeVideosInit',
        pluginfn: '$().fitVids',
        trigger: 'pluginfitVidsReady',
        class: 'has-plugin-fitvids',
      };

      SEMICOLON.initialize.functions(settings);
    },

    pageTransition() {
      const settings = {
        default: '.page-transition',
        file: 'plugins.pagetransition.js',
        error: 'plugins.pagetransition.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_pageTransitionInit',
        pluginfn: '$().animsition',
        trigger: 'pluginPageTransitionReady',
        class: 'has-plugin-animsition',
      };

      SEMICOLON.initialize.functions(settings);
    },

    lazyLoad(element) {
      const settings = {
        element,
        default: '.lazy',
        file: 'plugins.lazyload.js',
        error: 'plugins.lazyload.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_lazyLoadInit',
        pluginfn: 'typeof LazyLoad !== "undefined"',
        trigger: 'pluginlazyLoadReady',
        class: 'has-plugin-lazyload',
      };

      SEMICOLON.initialize.functions(settings);
    },

    topScrollOffset() {
      let topOffsetScroll = 0;

      if (
        ($body.hasClass('device-xl') || $body.hasClass('device-lg')) &&
        !SEMICOLON.isMobile.any()
      ) {
        if ($header.hasClass('sticky-header')) {
          if ($pagemenu.hasClass('dots-menu')) {
            topOffsetScroll = 100;
          } else {
            topOffsetScroll = 144;
          }
        } else if ($pagemenu.hasClass('dots-menu')) {
          topOffsetScroll = 140;
        } else {
          topOffsetScroll = 184;
        }

        if (!$pagemenu.length) {
          if ($header.hasClass('sticky-header')) {
            topOffsetScroll = 100;
          } else {
            topOffsetScroll = 140;
          }
        }
      } else {
        topOffsetScroll = 40;
      }

      return topOffsetScroll;
    },

    dataResponsiveClasses() {
      const settings = {
        default:
          '[data-class-xl],[data-class-lg],[data-class-md],[data-class-sm],[data-class-xs]',
        file: 'plugins.dataclasses.js',
        error: 'plugins.dataclasses.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_dataClassesInit',
        pluginfn: 'typeof scwDataClassesPlugin !== "undefined"',
        trigger: 'pluginDataClassesReady',
        class: 'has-plugin-dataclasses',
      };

      SEMICOLON.initialize.functions(settings);
    },

    dataResponsiveHeights() {
      const settings = {
        default:
          '[data-height-xl],[data-height-lg],[data-height-md],[data-height-sm],[data-height-xs]',
        file: 'plugins.dataheights.js',
        error: 'plugins.dataheights.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_dataHeightsInit',
        pluginfn: 'typeof scwDataHeightsPlugin !== "undefined"',
        trigger: 'pluginDataHeightsReady',
        class: 'has-plugin-dataheights',
      };

      SEMICOLON.initialize.functions(settings);
    },

    stickFooterOnSmall() {
      $footer.css({ 'margin-top': '' });
      const windowH = $window.height();
      const wrapperH = $wrapper.height();

      if (
        !$body.hasClass('sticky-footer') &&
        $footer.length > 0 &&
        $wrapper.has('#footer')
      ) {
        if (windowH > wrapperH) {
          $footer.css({ 'margin-top': windowH - wrapperH });
        }
      }
    },
  };

  SEMICOLON.header = {
    init() {
      SEMICOLON.header.initialize();
      SEMICOLON.header.menufunctions();
      SEMICOLON.header.fullWidthMenu();
      SEMICOLON.header.stickyMenu();
      SEMICOLON.header.stickyPageMenu();
      SEMICOLON.header.sideHeader();
      SEMICOLON.header.sidePanel();
      SEMICOLON.header.onePageScroll();
      SEMICOLON.header.logo();
      SEMICOLON.header.topsearch();
      SEMICOLON.header.topcart();
      SEMICOLON.header.miscFunctions();
    },

    initialize() {
      if ($headerWrap.length > 0) {
        if ($('.header-wrap-clone').length < 1) {
          $headerWrap.after('<div class="header-wrap-clone"></div>');
        }
        $headerWrapClone = $('.header-wrap-clone');
      }

      if ($pagemenu.length > 0) {
        $pagemenu
          .find('#page-menu-wrap')
          .after('<div class="page-menu-wrap-clone"></div>');
        $pageMenuClone = $('.page-menu-wrap-clone');
      }

      const menuItemSubs = $('.menu-item:has(.sub-menu-container)');

      menuItemSubs.addClass('sub-menu'); // , .primary-menu.with-arrows > .menu-container > .menu-item:has(.sub-menu-container) > .menu-link > div:not(:has(.icon-angle-down))
      $(
        '.top-links-item:has(.top-links-sub-menu,.top-links-section) > a:not(:has(.icon-angle-down)), .menu-item:not(.mega-menu-title):has(.sub-menu-container) > .menu-link > div:not(:has(.icon-angle-down)), .page-menu-item:has(.page-menu-sub-menu) > a > div:not(:has(.icon-angle-down))',
      ).append('<i class="icon-angle-down"></i>');
      $(
        '.menu-item:not(.mega-menu-title):has(.sub-menu-container):not(:has(.sub-menu-trigger))',
      ).append('<button class="sub-menu-trigger icon-chevron-right"></button>');

      SEMICOLON.header.menuInvert();
    },

    menuInvert(subMenuEl) {
      const submenus =
        subMenuEl ||
        $('.mega-menu-content, .sub-menu-container, .top-links-section');

      submenus.children().css({ display: 'block' });
      submenus.css({ display: 'block' });
      submenus.each(function (index, element) {
        const $menuChildElement = $(element);
        const menuChildOffset = $menuChildElement.offset();
        const menuChildWidth = $menuChildElement.width();

        if (windowWidth - (menuChildWidth + menuChildOffset.left) < 0) {
          $menuChildElement.addClass('menu-pos-invert');
        }
      });
      submenus.children().css({ display: '' });
      submenus.css({ display: '' });
    },

    includeOffset() {
      if ($headerInc.length < 1) {
        return true;
      }

      let headerInc = $header.outerHeight();
      if (
        $header.hasClass('floating-header') ||
        $headerInc.hasClass('include-topbar')
      ) {
        headerInc += $header.offset().top;
      }
      $headerInc.css({ 'margin-top': -headerInc });
      SEMICOLON.slider.sliderParallax();
    },

    menufunctions() {
      const menuItemSubs = $('.menu-item:has(.sub-menu-container)');
      const menuItemSubsLinks = menuItemSubs.children('.menu-link');
      const submenusT = '.mega-menu-content, .sub-menu-container';
      const submenus = $(submenusT);
      const menuItemT = '.menu-item';
      const subMenuT = '.sub-menu';
      let menuSpeed = primaryMenu.attr('data-trigger-speed') || 200;
      const subMenuTriggerT = '.sub-menu-trigger';
      let menuItemTrigger;

      menuSpeed = Number(menuSpeed);

      menuItemTrigger = menuItemSubs.children(subMenuTriggerT);

      if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
        setTimeout(function () {
          if ($headerWrapClone.length > 0) {
            $headerWrapClone.css({ height: $headerWrap.outerHeight() });
          }
          SEMICOLON.header.includeOffset();
        }, 1000);
        primaryMenu.find(submenus).css({ display: '' });
      } else {
        $headerInc.css({ 'margin-top': '' });
      }

      if (
        $body.hasClass('overlay-menu') &&
        primaryMenu.hasClass('on-click') &&
        ($body.hasClass('device-xl') || $body.hasClass('device-lg'))
      ) {
        menuItemSubsLinks.off('click').on('click', function (e) {
          const triggerEl = $(this);
          triggerEl
            .parents(subMenuT)
            .siblings()
            .find(submenus)
            .stop(true, true)
            .slideUp(menuSpeed);
          triggerEl
            .parent(menuItemT)
            .children(submenusT)
            .stop(true, true)
            .slideToggle(menuSpeed);
          e.preventDefault();
        });
      } else if (
        ($body.hasClass('side-header') && primaryMenu.hasClass('on-click')) ||
        $body.hasClass('device-md') ||
        $body.hasClass('device-sm') ||
        $body.hasClass('device-xs')
      ) {
        menuItemTrigger.removeClass('icon-rotate-90');
        $(menuItemT)
          .find(submenus)
          .filter(':not(:animated)')
          .stop(true, true)
          .slideUp(menuSpeed, function () {
            $body.toggleClass('primary-menu-open', false);
          });

        menuItemTrigger = menuItemTrigger.add(
          menuItemSubsLinks.filter('[href^="#"]'),
        );

        menuItemTrigger.off('click').on('click', function (e) {
          const triggerEl = $(this);
          triggerEl
            .parents(subMenuT)
            .siblings()
            .find(subMenuTriggerT)
            .removeClass('icon-rotate-90');
          triggerEl
            .parents(subMenuT)
            .siblings()
            .find(submenus)
            .filter(':not(:animated)')
            .stop(true, true)
            .slideUp(menuSpeed);
          triggerEl
            .parent(menuItemT)
            .children(submenusT)
            .filter(':not(:animated)')
            .stop(true, true)
            .slideToggle(menuSpeed);

          const subMenuTriggerEl = triggerEl
            .parent(menuItemT)
            .children(subMenuTriggerT);

          if (!subMenuTriggerEl.hasClass('icon-rotate-90')) {
            subMenuTriggerEl.addClass('icon-rotate-90');
          } else {
            subMenuTriggerEl.removeClass('icon-rotate-90');
          }

          e.preventDefault();
        });
      } else if (
        ($body.hasClass('overlay-menu') || $body.hasClass('side-header')) &&
        ($body.hasClass('device-xl') || $body.hasClass('device-lg'))
      ) {
        primaryMenu.find(submenus).stop(true, true).slideUp(menuSpeed);
        $(menuItemT).hover(
          function (e) {
            $(this).children(submenusT).stop(true, true).slideDown(menuSpeed);
          },
          function () {
            $(this).children(submenusT).stop(true, true).slideUp(menuSpeed);
          },
        );
      } else if (primaryMenu.hasClass('on-click')) {
        menuItemSubsLinks.off('click').on('click', function (e) {
          const triggerEl = $(this);
          triggerEl
            .parents(subMenuT)
            .siblings()
            .find(submenus)
            .removeClass('d-block');
          triggerEl
            .parent(menuItemT)
            .children(submenusT)
            .toggleClass('d-block');
          e.preventDefault();
        });
      }

      if (
        $('.top-links').hasClass('on-click') ||
        $body.hasClass('device-md') ||
        $body.hasClass('device-sm') ||
        $body.hasClass('device-xs')
      ) {
        $('.top-links-item:has(.top-links-sub-menu,.top-links-section) > a').on(
          'click',
          function (e) {
            $(this)
              .parents('li')
              .siblings()
              .find('.top-links-sub-menu,.top-links-section')
              .removeClass('d-block');
            $(this)
              .parent('li')
              .children('.top-links-sub-menu,.top-links-section')
              .toggleClass('d-block');
            e.preventDefault();
          },
        );
      }

      SEMICOLON.header.menuInvert($('.top-links-section'));

      $('#primary-menu-trigger')
        .off('click')
        .on('click', function () {
          if (
            $body.hasClass('device-md') ||
            $body.hasClass('device-sm') ||
            $body.hasClass('device-xs')
          ) {
            if (primaryMenu.find('.mobile-primary-menu').length > 0) {
              $(
                '.primary-menu:not(.mobile-menu-off-canvas) .mobile-primary-menu',
              )
                .stop(true, true)
                .slideToggle(menuSpeed);
              $(
                '.primary-menu.mobile-menu-off-canvas .mobile-primary-menu',
              ).toggleClass('d-block');
            } else {
              $('.primary-menu:not(.mobile-menu-off-canvas) .menu-container')
                .stop(true, true)
                .slideToggle(menuSpeed);
              $(
                '.primary-menu.mobile-menu-off-canvas .menu-container',
              ).toggleClass('d-block');
            }
          }
          $body.toggleClass('primary-menu-open');
          return false;
        });

      $('.menu-container:not(.mobile-primary-menu)').css({ display: '' });
      if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
        primaryMenu.find('.mobile-primary-menu').removeClass('d-block');
      }
    },

    fullWidthMenu() {
      if (
        $body.hasClass('device-md') ||
        $body.hasClass('device-sm') ||
        $body.hasClass('device-xs')
      ) {
        $('.mega-menu-content, .top-search-form').css({ width: '' });
        return true;
      }

      const headerWidth = $(
        '.mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content',
      )
        .parents('.header-row')
        .width();

      if ($header.find('.container-fullwidth').length > 0) {
        $(
          '.mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content',
        ).css({ width: headerWidth });
      }

      if ($body.hasClass('stretched')) {
        if ($header.hasClass('floating-header')) {
          $(
            '.mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content, .top-search-form',
          ).css({ width: headerWidth + 80 });
        } else {
          $(
            '.mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content, .top-search-form',
          ).css({ width: headerWidth });
        }
      } else if ($header.hasClass('full-header')) {
        $(
          '.mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content',
        ).css({ width: headerWidth - 80 });
      }

      if ($header.find('.header-row').length > 1) {
        const megaMenuContent = $(
          '.menu-container > .mega-menu:not(.mega-menu-small) .mega-menu-content',
        ).eq(0);
        const offset =
          $headerWrap.outerHeight() -
          megaMenuContent.parents('.header-row').outerHeight();
        const css = `.menu-container > .mega-menu:not(.mega-menu-small) .mega-menu-content { top: calc( 100% - ${offset}px ); }`;
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
      }
    },

    stickyMenu(headerOffset) {
      windowScrT = $window.scrollTop();

      if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
        if (windowScrT > headerOffset) {
          if (!$body.hasClass('side-header')) {
            $header.filter(':not(.no-sticky)').addClass('sticky-header');
            // if( !$headerWrap.hasClass('force-not-dark') ) { $headerWrap.removeClass('not-dark'); }
            SEMICOLON.header.stickyMenuClass();

            if (stickyShrink == 'true' && !$header.hasClass('no-sticky')) {
              if (windowScrT - headerOffset > Number(stickyShrinkOffset)) {
                $header.addClass('sticky-header-shrink');
                if (headerSizeCustom) {
                  logo.find('img').css({ height: Number(stickyLogoH) });
                  SEMICOLON.header.menuItemsSpacing(stickyMenuP);
                }
              } else {
                $header.removeClass('sticky-header-shrink');
                if (headerSizeCustom) {
                  logo.find('img').css({ height: Number(defLogoH) });
                  SEMICOLON.header.menuItemsSpacing(defMenuP);
                }
              }
            }
          }
        } else {
          SEMICOLON.header.removeStickyness();
          if (headerSizeCustom) {
            logo.find('img').css({ height: Number(defLogoH) });
            SEMICOLON.header.menuItemsSpacing(defMenuP);
          }
        }
      }

      if (
        $body.hasClass('device-xs') ||
        $body.hasClass('device-sm') ||
        $body.hasClass('device-md')
      ) {
        if (mobileSticky == 'true') {
          if (windowScrT > headerOffset) {
            $header.filter(':not(.no-sticky)').addClass('sticky-header');
            SEMICOLON.header.stickyMenuClass();
          } else {
            SEMICOLON.header.removeStickyness();
            SEMICOLON.header.responsiveMenuClass();
          }
        } else {
          SEMICOLON.header.removeStickyness();
        }
        if (headerSizeCustom) {
          logo.find('img').css({ height: Number(mobileLogoH) });
          SEMICOLON.header.menuItemsSpacing('');
        }
      }
    },

    menuItemsSpacing(spacing) {
      const item = primaryMenuMainItems;

      if (!$body.hasClass('side-header') && !$body.hasClass('overlay-menu')) {
        if (primaryMenu.hasClass('menu-spacing-margin')) {
          if (spacing == '') {
            item.css({ 'margin-top': '', 'margin-bottom': '' });
          } else {
            item.css({
              'margin-top': Number(spacing),
              'margin-bottom': Number(spacing),
            });
          }
        } else if (spacing == '') {
          item.css({ 'padding-top': '', 'padding-bottom': '' });
        } else {
          item.css({
            'padding-top': Number(spacing),
            'padding-bottom': Number(spacing),
          });
        }
      }
    },

    stickyPageMenu(pageMenuOffset) {
      if ($window.scrollTop() > pageMenuOffset) {
        if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
          $pagemenu
            .filter(':not(.dots-menu,.no-sticky)')
            .addClass('sticky-page-menu');
          const headerHeight = $headerWrap.outerHeight();
          if ($header.length > 0 && !$header.hasClass('no-sticky')) {
            $pagemenu
              .filter('.sticky-page-menu:not(.dots-menu,.no-sticky)')
              .find($pageMenuWrap)
              .css({ top: `${headerHeight}px` });
          }
        } else if (
          $body.hasClass('device-sm') ||
          $body.hasClass('device-xs') ||
          $body.hasClass('device-md')
        ) {
          if ($pagemenu.attr('data-mobile-sticky') == 'true') {
            $pagemenu
              .filter(':not(.dots-menu,.no-sticky)')
              .addClass('sticky-page-menu');
          }
        }
      } else {
        $pagemenu.removeClass('sticky-page-menu');
        $pagemenu.find($pageMenuWrap).css({ top: '' });
      }
    },

    removeStickyness() {
      if ($header.hasClass('sticky-header')) {
        $header.removeClass('sticky-header');
        $header.removeClass().addClass(oldHeaderClasses);
        $headerWrap.removeClass().addClass(oldHeaderWrapClasses);
        if (!$headerWrap.hasClass('force-not-dark')) {
          $headerWrap.removeClass('not-dark');
        }
        SEMICOLON.slider.swiperSliderMenu();
        SEMICOLON.slider.revolutionSliderMenu();
        if (
          $headerWrapClone.length > 0 &&
          $headerWrap.outerHeight() > $headerWrapClone.outerHeight()
        ) {
          $headerWrapClone.css({ height: $headerWrap.outerHeight() });
        }
      }
      if (
        ($body.hasClass('device-sm') ||
          $body.hasClass('device-xs') ||
          $body.hasClass('device-md')) &&
        typeof responsiveMenuClasses === 'undefined'
      ) {
        $header.removeClass().addClass(oldHeaderClasses);
        $headerWrap.removeClass().addClass(oldHeaderWrapClasses);
        if (!$headerWrap.hasClass('force-not-dark')) {
          $headerWrap.removeClass('not-dark');
        }
      }
    },

    sideHeader() {
      $('#header-trigger')
        .off('click')
        .on('click', function () {
          $('body.open-header').toggleClass('side-header-open');
          return false;
        });
    },

    sidePanel() {
      $('.side-panel-trigger')
        .off('click')
        .on('click', function () {
          $body.toggleClass('side-panel-open');
          if (
            $body.hasClass('device-touch') &&
            $body.hasClass('side-push-panel')
          ) {
            $body.toggleClass('ohidden');
          }
          return false;
        });
    },

    onePageScroll(element) {
      const settings = {
        element,
        default: '.one-page-menu',
        file: 'plugins.onepage.js',
        error: 'plugins.onepage.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_onePageModule',
        pluginfn: 'typeof scwOnePageModulePlugin !== "undefined"',
        trigger: 'pluginOnePageModuleReady',
        class: 'has-plugin-onepagemodule',
      };

      SEMICOLON.initialize.functions(settings);
    },

    logo() {
      const sLogo = defaultLogo.find('img');
      const rLogo = retinaLogo.find('img');
      if (
        ($header.hasClass('dark') || $body.hasClass('dark')) &&
        !$headerWrap.hasClass('not-dark')
      ) {
        if (defaultDarkLogo && sLogo.attr('src') != defaultDarkLogo) {
          sLogo.attr('src', defaultDarkLogo);
        }

        if (retinaDarkLogo && rLogo.attr('src') != retinaDarkLogo) {
          rLogo.attr('src', retinaDarkLogo);
        }
      } else {
        if (defaultLogoImg && sLogo.attr('src') != defaultLogoImg) {
          sLogo.attr('src', defaultLogoImg);
        }

        if (retinaLogoImg && rLogo.attr('src') != retinaLogoImg) {
          rLogo.attr('src', retinaLogoImg);
        }
      }

      if ($header.hasClass('sticky-header')) {
        if (defaultStickyLogo && sLogo.attr('src') != defaultStickyLogo) {
          sLogo.attr('src', defaultStickyLogo);
        }

        if (retinaStickyLogo && rLogo.attr('src') != retinaStickyLogo) {
          rLogo.attr('src', retinaStickyLogo);
        }
      }

      if (
        $body.hasClass('device-md') ||
        $body.hasClass('device-sm') ||
        $body.hasClass('device-xs')
      ) {
        if (defaultMobileLogo && sLogo.attr('src') != defaultMobileLogo) {
          sLogo.attr('src', defaultMobileLogo);
        }

        if (retinaMobileLogo && rLogo.attr('src') != retinaMobileLogo) {
          rLogo.attr('src', retinaMobileLogo);
        }
      }
    },

    stickyMenuClass() {
      let newClassesArray = '';

      if (stickyMenuClasses) {
        newClassesArray = stickyMenuClasses.split(/ +/);
      }

      const noOfNewClasses = newClassesArray.length;

      if (noOfNewClasses > 0) {
        let i = 0;
        for (i = 0; i < noOfNewClasses; i++) {
          if (newClassesArray[i] == 'not-dark') {
            $header.removeClass('dark');
            $headerWrap.filter(':not(.not-dark)').addClass('not-dark');
          } else if (newClassesArray[i] == 'dark') {
            $headerWrap.removeClass('not-dark force-not-dark');
            if (!$header.hasClass(newClassesArray[i])) {
              $header.addClass(newClassesArray[i]);
            }
          } else if (!$header.hasClass(newClassesArray[i])) {
            $header.addClass(newClassesArray[i]);
          }
        }
      }
    },

    responsiveMenuClass() {
      if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
        return true;
      }

      let newClassesArray = '';

      if (responsiveMenuClasses) {
        newClassesArray = responsiveMenuClasses.split(/ +/);
      }

      const noOfNewClasses = newClassesArray.length;

      if (noOfNewClasses > 0) {
        let i = 0;
        for (i = 0; i < noOfNewClasses; i++) {
          if (newClassesArray[i] == 'not-dark') {
            $header.removeClass('dark');
            $headerWrap.addClass('not-dark');
          } else if (newClassesArray[i] == 'dark') {
            $headerWrap.removeClass('not-dark force-not-dark');
            if (!$header.hasClass(newClassesArray[i])) {
              $header.addClass(newClassesArray[i]);
            }
          } else if (!$header.hasClass(newClassesArray[i])) {
            $header.addClass(newClassesArray[i]);
          }
        }
      }

      SEMICOLON.header.logo();
    },

    topsearch() {
      $topSearch.parents('.header-row').addClass('top-search-parent');
      const topSearchParent = $header.find('.top-search-parent');

      $('#top-search-trigger')
        .off('click')
        .on('click', function (e) {
          clearTimeout(topSearchTimeOut);
          $body.toggleClass('top-search-open');
          $topCart.toggleClass('top-cart-open', false);
          if (
            $body.hasClass('device-md') ||
            $body.hasClass('device-sm') ||
            $body.hasClass('device-xs')
          ) {
            primaryMenu
              .filter(':not(.mobile-menu-off-canvas)')
              .find('.menu-container')
              .slideUp(200);
            primaryMenu
              .filter('.mobile-menu-off-canvas')
              .find('.menu-container')
              .toggleClass('d-block', false);
          }
          if ($body.hasClass('top-search-open')) {
            topSearchParent.toggleClass('position-relative', true);
          } else {
            topSearchTimeOut = setTimeout(function () {
              topSearchParent.toggleClass('position-relative', false);
            }, 750);
          }
          $body.toggleClass('primary-menu-open', false);
          $pagemenu.toggleClass('page-menu-open', false);
          if ($body.hasClass('top-search-open')) {
            $topSearch.find('input').focus();
          }
          e.stopPropagation();
          e.preventDefault();
        });
    },

    topcart() {
      if ($topCart.length < 1) {
        return true;
      }

      $('#top-cart-trigger')
        .off('click')
        .on('click', function (e) {
          $pagemenu.toggleClass('page-menu-open', false);
          $topCart.toggleClass('top-cart-open');
          e.stopPropagation();
          e.preventDefault();
        });
    },

    miscFunctions() {
      const topSearchParent = $header.find('.top-search-parent');
      $(document).on('click', function (event) {
        if (!$(event.target).closest('.top-search-form').length) {
          $body.toggleClass('top-search-open', false);
          topSearchTimeOut = setTimeout(function () {
            topSearchParent.toggleClass('position-relative', false);
          }, 750);
        }
        if (!$(event.target).closest('#top-cart').length) {
          $topCart.toggleClass('top-cart-open', false);
        }
        if (!$(event.target).closest('#page-menu').length) {
          $pagemenu.toggleClass('page-menu-open', false);
        }
        if (!$(event.target).closest('#side-panel').length) {
          $body.toggleClass('side-panel-open', false);
        }
        if (!$(event.target).closest('.primary-menu.on-click').length) {
          primaryMenu
            .filter('.on-click')
            .find('.menu-container')
            .find('.d-block')
            .removeClass('d-block');
        }
        if (primaryMenu.hasClass('mobile-menu-off-canvas')) {
          if (
            !$(event.target).closest(
              '.primary-menu.mobile-menu-off-canvas .menu-container',
            ).length
          ) {
            primaryMenu
              .filter('.mobile-menu-off-canvas')
              .find('.menu-container')
              .toggleClass('d-block', false);
            $body.toggleClass('primary-menu-open', false);
          }
        }
        if (!$(event.target).closest('.top-links.on-click').length) {
          $('.top-links.on-click')
            .find('.top-links-sub-menu,.top-links-section')
            .removeClass('d-block');
        }
      });
    },
  };

  SEMICOLON.slider = {
    init() {
      SEMICOLON.slider.sliderDimensions();
      SEMICOLON.slider.sliderRun();
      SEMICOLON.slider.sliderParallax();
      SEMICOLON.slider.sliderElementsFade();
    },

    sliderDimensions() {
      let parallaxElHeight = $sliderParallaxEl.outerHeight();
      let parallaxElWidth = $sliderParallaxEl.outerWidth();
      const slInner = $sliderParallaxEl.find('.slider-inner');
      const slSwiperW = $slider.find('.swiper-wrapper');
      const slSwiperS = $slider.find('.swiper-slide').first();
      const slFlexHeight =
        $slider.hasClass('h-auto') || $slider.hasClass('min-vh-0');

      if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
        setTimeout(function () {
          slInner.height(parallaxElHeight);
          if (slFlexHeight) {
            parallaxElHeight = $sliderParallaxEl
              .find('.slider-inner')
              .children()
              .first()
              .outerHeight();
            $sliderParallaxEl.height(parallaxElHeight);
            slInner.height(parallaxElHeight);
          }
        }, 500);

        if (slFlexHeight) {
          let slSwiperFC = slSwiperS.children().first();
          if (
            slSwiperFC.hasClass('container') ||
            slSwiperFC.hasClass('container-fluid')
          ) {
            slSwiperFC = slSwiperFC.children().first();
          }
          if (slSwiperFC.outerHeight() > slSwiperW.outerHeight()) {
            slSwiperW.css({ height: 'auto' });
          }
        }

        if ($body.hasClass('side-header')) {
          slInner.width(parallaxElWidth);
        }

        if (!$body.hasClass('stretched')) {
          parallaxElWidth = $wrapper.outerWidth();
          slInner.width(parallaxElWidth);
        }
      } else {
        slSwiperW.css({ height: '' });
        $sliderParallaxEl.css({ height: '' });
        slInner.css({ width: '', height: '' });
      }
    },

    sliderRun(element) {
      const settings = {
        element,
        default: '.swiper_wrapper',
        file: 'plugins.swiper.js',
        error: 'plugins.swiper.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_swiperInit',
        pluginfn: 'typeof Swiper !== "undefined"',
        trigger: 'pluginSwiperReady',
        class: 'has-plugin-swiper',
      };

      SEMICOLON.initialize.functions(settings);
    },

    sliderParallaxOffset() {
      let sliderParallaxOffsetTop = 0;
      let headerHeight = $header.outerHeight();
      if (
        $body.hasClass('side-header') ||
        $header.next('.include-header').length > 0
      ) {
        headerHeight = 0;
      }
      if ($pageTitle.length > 0) {
        sliderParallaxOffsetTop = $pageTitle.outerHeight() + headerHeight;
      } else {
        sliderParallaxOffsetTop = headerHeight;
      }

      if ($slider.next('#header').length > 0) {
        sliderParallaxOffsetTop = 0;
      }

      return sliderParallaxOffsetTop;
    },

    sliderParallaxSet(xPos, yPos, el) {
      if (el) {
        el.style.transform = `translate3d(${xPos}, ${yPos}px, 0)`;
      }
    },

    sliderParallax() {
      if ($sliderParallaxEl.length < 1) {
        return true;
      }

      const parallaxOffsetTop = SEMICOLON.slider.sliderParallaxOffset();
      const parallaxElHeight = $sliderParallaxEl.outerHeight();
      let transform;
      let transform2;

      xScrollPosition = window.pageXOffset;
      yScrollPosition = window.pageYOffset;

      if (
        ($body.hasClass('device-xl') || $body.hasClass('device-lg')) &&
        !SEMICOLON.isMobile.any()
      ) {
        if (parallaxElHeight + parallaxOffsetTop + 50 > yScrollPosition) {
          $sliderParallaxEl
            .addClass('slider-parallax-visible')
            .removeClass('slider-parallax-invisible');
          if (yScrollPosition > parallaxOffsetTop) {
            if ($sliderParallaxEl.find('.slider-inner').length > 0) {
              transform = (yScrollPosition - parallaxOffsetTop) * -0.4;
              transform2 = (yScrollPosition - parallaxOffsetTop) * -0.15;

              SEMICOLON.slider.sliderParallaxSet(
                0,
                transform,
                sliderParallaxElInner,
              );
              SEMICOLON.slider.sliderParallaxSet(
                0,
                transform2,
                sliderParallaxElCaption,
              );
            } else {
              transform = (yScrollPosition - parallaxOffsetTop) / 1.5;
              transform2 = (yScrollPosition - parallaxOffsetTop) / 7;

              SEMICOLON.slider.sliderParallaxSet(
                0,
                transform,
                sliderParallaxEl,
              );
              SEMICOLON.slider.sliderParallaxSet(
                0,
                transform2,
                sliderParallaxElCaption,
              );
            }
          } else if ($sliderParallaxEl.find('.slider-inner').length > 0) {
            SEMICOLON.slider.sliderParallaxSet(0, 0, sliderParallaxElInner);
            SEMICOLON.slider.sliderParallaxSet(0, 0, sliderParallaxElCaption);
          } else {
            SEMICOLON.slider.sliderParallaxSet(0, 0, sliderParallaxEl);
            SEMICOLON.slider.sliderParallaxSet(0, 0, sliderParallaxElCaption);
          }
        } else {
          $sliderParallaxEl
            .addClass('slider-parallax-invisible')
            .removeClass('slider-parallax-visible');
        }

        requestAnimationFrame(function () {
          SEMICOLON.slider.sliderParallax();
          SEMICOLON.slider.sliderElementsFade();
        });
      } else {
        if ($sliderParallaxEl.find('.slider-inner').length > 0) {
          SEMICOLON.slider.sliderParallaxSet(0, 0, sliderParallaxElInner);
          SEMICOLON.slider.sliderParallaxSet(0, 0, sliderParallaxElCaption);
        } else {
          SEMICOLON.slider.sliderParallaxSet(0, 0, sliderParallaxEl);
          SEMICOLON.slider.sliderParallaxSet(0, 0, sliderParallaxElCaption);
        }
        $sliderParallaxEl
          .addClass('slider-parallax-visible')
          .removeClass('slider-parallax-invisible');
      }
    },

    sliderElementsFade() {
      if ($sliderParallaxEl.length < 1) {
        return true;
      }

      if (
        ($body.hasClass('device-xl') || $body.hasClass('device-lg')) &&
        !SEMICOLON.isMobile.any()
      ) {
        const parallaxOffsetTop = SEMICOLON.slider.sliderParallaxOffset();
        const parallaxElHeight = $sliderParallaxEl.outerHeight();
        let tHeaderOffset;

        if (
          $header.hasClass('transparent-header') ||
          $body.hasClass('side-header')
        ) {
          tHeaderOffset = 100;
        } else {
          tHeaderOffset = 0;
        }
        $sliderParallaxEl
          .filter('.slider-parallax-visible')
          .find(
            '.slider-arrow-left,.slider-arrow-right,.slider-caption,.slider-element-fade',
          )
          .css({
            opacity:
              1 - ((yScrollPosition - tHeaderOffset) * 1.85) / parallaxElHeight,
          });
      } else {
        $sliderParallaxEl
          .find(
            '.slider-arrow-left,.slider-arrow-right,.slider-caption,.slider-element-fade',
          )
          .css({ opacity: 1 });
      }
    },

    swiperSliderMenu(onWinLoad) {
      onWinLoad = typeof onWinLoad !== 'undefined' ? onWinLoad : false;
      if (
        $body.hasClass('device-xl') ||
        $body.hasClass('device-lg') ||
        ($header.hasClass('transparent-header-responsive') &&
          !$body.hasClass('primary-menu-open'))
      ) {
        const activeSlide = $slider.find('.swiper-slide.swiper-slide-active');
        SEMICOLON.slider.headerSchemeChanger(activeSlide, onWinLoad);
      }
    },

    revolutionSliderMenu(onWinLoad) {
      onWinLoad = typeof onWinLoad !== 'undefined' ? onWinLoad : false;
      if (
        $body.hasClass('device-xl') ||
        $body.hasClass('device-lg') ||
        ($header.hasClass('transparent-header-responsive') &&
          !$body.hasClass('primary-menu-open'))
      ) {
        const activeSlide = $slider.find('.active-revslide');
        SEMICOLON.slider.headerSchemeChanger(activeSlide, onWinLoad);
      }
    },

    headerSchemeChanger(activeSlide, onWinLoad) {
      if (activeSlide.length > 0) {
        let darkExists = false;
        let oldClassesArray;
        let noOfOldClasses;
        if (activeSlide.hasClass('dark')) {
          if (oldHeaderClasses) {
            oldClassesArray = oldHeaderClasses.split(/ +/);
          } else {
            oldClassesArray = '';
          }

          noOfOldClasses = oldClassesArray.length;

          if (noOfOldClasses > 0) {
            let i = 0;
            for (i = 0; i < noOfOldClasses; i++) {
              if (oldClassesArray[i] == 'dark' && onWinLoad == true) {
                darkExists = true;
                break;
              }
            }
          }
          $(
            '#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)',
          ).addClass('dark');
          if (!darkExists) {
            $(
              '#header.transparent-header.sticky-header,#header.transparent-header.semi-transparent.sticky-header,#header.transparent-header.floating-header.sticky-header',
            ).removeClass('dark');
          }
          $headerWrap.removeClass('not-dark');
        } else if ($body.hasClass('dark')) {
          activeSlide.addClass('not-dark');
          $(
            '#header.transparent-header:not(.semi-transparent,.floating-header)',
          ).removeClass('dark');
          $(
            '#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)',
          )
            .find('#header-wrap')
            .addClass('not-dark');
        } else {
          $(
            '#header.transparent-header:not(.semi-transparent,.floating-header)',
          ).removeClass('dark');
          $headerWrap.removeClass('not-dark');
        }
        if ($header.hasClass('sticky-header')) {
          SEMICOLON.header.stickyMenuClass();
        }
        SEMICOLON.header.logo();
      }
    },
  };

  SEMICOLON.portfolio = {
    init() {
      SEMICOLON.portfolio.revealDesc();
      SEMICOLON.portfolio.ajaxload();
    },

    revealDesc() {
      const $portfolioReveal = $('.portfolio-reveal');

      if ($portfolioReveal < 1) {
        return true;
      }

      $portfolioReveal.each(function () {
        const element = $(this);
        const elementItems = element.find('.portfolio-item');
        elementItems.each(function () {
          const element = $(this).find('.portfolio-desc');
          const elementHeight = element.outerHeight();
          element.css({ 'margin-top': `-${elementHeight}px` });
        });
      });
    },

    ajaxload() {
      const settings = {
        default: '.portfolio-ajax',
        file: 'plugins.ajaxportfolio.js',
        error: 'plugins.ajaxportfolio.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_portfolioAjaxloadInit',
        pluginfn: 'typeof scwAjaxPortfolioPlugin !== "undefined"',
        trigger: 'pluginAjaxPortfolioReady',
        class: 'has-plugin-ajaxportfolio',
      };

      SEMICOLON.initialize.functions(settings);
    },
  };

  SEMICOLON.widget = {
    init() {
      SEMICOLON.widget.animations();
      SEMICOLON.widget.hoverAnimation();
      SEMICOLON.widget.youtubeBgVideo();
      SEMICOLON.widget.tabs();
      SEMICOLON.widget.toggles();
      SEMICOLON.widget.accordions();
      SEMICOLON.widget.counter();
      SEMICOLON.widget.countdown();
      SEMICOLON.widget.gmap();
      SEMICOLON.widget.roundedSkill();
      SEMICOLON.widget.progress();
      SEMICOLON.widget.twitterFeed();
      SEMICOLON.widget.flickrFeed();
      SEMICOLON.widget.instagramPhotos();
      SEMICOLON.widget.dribbbleShots();
      SEMICOLON.widget.navTree();
      SEMICOLON.widget.textRotator();
      SEMICOLON.widget.carousel();
      SEMICOLON.widget.linkScroll();
      SEMICOLON.widget.ajaxForm();
      SEMICOLON.widget.subscription();
      SEMICOLON.widget.shapeDivider();
      SEMICOLON.widget.stickySidebar();
      SEMICOLON.widget.cookieNotify();
      SEMICOLON.widget.cartQuantity();
      SEMICOLON.widget.readmore();
      SEMICOLON.widget.pricingSwitcher();
      SEMICOLON.widget.extras();
    },

    parallax(element) {
      const settings = {
        element,
        default:
          '.parallax,.page-title-parallax,.portfolio-parallax .portfolio-image',
        file: 'plugins.parallax.js',
        error: 'plugins.parallax.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_parallaxInit',
        pluginfn: 'typeof skrollr !== "undefined"',
        trigger: 'pluginParallaxReady',
        class: 'has-plugin-parallax',
      };

      SEMICOLON.initialize.functions(settings);
    },

    animations(element) {
      const settings = {
        element,
        default: '[data-animate]',
        file: 'plugins.animations.js',
        error: 'plugins.animations.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_animationsInit',
        pluginfn: 'typeof scwAnimationsPlugin !== "undefined"',
        trigger: 'pluginAnimationsReady',
        class: 'has-plugin-animations',
      };

      SEMICOLON.initialize.functions(settings);
    },

    hoverAnimation(element) {
      const settings = {
        element,
        default: '[data-hover-animate]',
        file: 'plugins.hoveranimation.js',
        error: 'plugins.hoveranimation.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_hoverAnimationInit',
        pluginfn: 'typeof scwHoverAnimationPlugin !== "undefined"',
        trigger: 'pluginHoverAnimationReady',
        class: 'has-plugin-hoveranimation',
      };

      SEMICOLON.initialize.functions(settings);
    },

    gridInit(element) {
      const settings = {
        element,
        default: '.grid-container',
        file: 'plugins.isotope.js',
        error: 'plugins.isotope.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_gridContainerInit',
        pluginfn: '$().isotope',
        trigger: 'pluginIsotopeReady',
        class: 'has-plugin-isotope',
      };

      SEMICOLON.initialize.functions(settings);
    },

    filterInit(element) {
      const settings = {
        element,
        default: '.grid-filter,.custom-filter',
        file: 'plugins.gridfilter.js',
        error: 'plugins.gridfilter.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_gridFilterInit',
        pluginfn: '$().isotope && typeof scwGridFilterPlugin !== "undefined"',
        trigger: 'pluginGridFilterReady',
        class: 'has-plugin-isotope-filter',
      };

      SEMICOLON.initialize.functions(settings);
    },

    loadFlexSlider(element) {
      const settings = {
        element,
        default: '.fslider',
        file: 'plugins.flexslider.js',
        error: 'plugins.flexslider.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_flexSliderInit',
        pluginfn: '$().flexslider',
        trigger: 'pluginFlexSliderReady',
        class: 'has-plugin-flexslider',
      };

      SEMICOLON.initialize.functions(settings);
    },

    html5Video(element) {
      const settings = {
        element,
        default: '.video-wrap:has(video)',
        file: 'plugins.html5video.js',
        error: 'plugins.html5video.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_html5VideoInit',
        pluginfn: 'typeof scwHtml5VideoPlugin !== "undefined"',
        trigger: 'pluginHtml5VideoReady',
        class: 'has-plugin-html5video',
      };

      SEMICOLON.initialize.functions(settings);
    },

    youtubeBgVideo(element) {
      const settings = {
        element,
        default: '.yt-bg-player',
        file: 'plugins.youtube.js',
        error: 'plugins.youtube.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_youtubeBgVideoInit',
        pluginfn: '$().YTPlayer',
        trigger: 'pluginYoutubeBgVideoReady',
        class: 'has-plugin-youtubebg',
      };

      SEMICOLON.initialize.functions(settings);
    },

    tabs(element) {
      const settings = {
        element,
        default: '.tabs,[data-plugin="tabs"]',
        file: 'plugins.tabs.js',
        error: 'plugins.tabs.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_tabsInit',
        pluginfn: '$().tabs',
        trigger: 'pluginTabsReady',
        class: 'has-plugin-tabs',
      };

      SEMICOLON.initialize.functions(settings);
    },

    toggles(element) {
      const settings = {
        element,
        default: '.toggle',
        file: 'plugins.toggles.js',
        error: 'plugins.toggles.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_togglesInit',
        pluginfn: 'typeof scwTogglesPlugin !== "undefined"',
        trigger: 'pluginTogglesReady',
        class: 'has-plugin-toggles',
      };

      SEMICOLON.initialize.functions(settings);
    },

    accordions(element) {
      const settings = {
        element,
        default: '.accordion',
        file: 'plugins.accordions.js',
        error: 'plugins.accordions.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_accordionsInit',
        pluginfn: 'typeof scwAccordionsPlugin !== "undefined"',
        trigger: 'pluginAccordionsReady',
        class: 'has-plugin-accordions',
      };

      SEMICOLON.initialize.functions(settings);
    },

    counter(element) {
      const settings = {
        element,
        default: '.counter',
        file: 'plugins.counter.js',
        error: 'plugins.counter.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_counterInit',
        pluginfn: '$().countTo',
        trigger: 'pluginCounterReady',
        class: 'has-plugin-counter',
      };

      SEMICOLON.initialize.functions(settings);
    },

    countdown(element) {
      const momentSettings = {
        element,
        default: '.countdown',
        file: 'components/moment.js',
        error: 'components/moment.js: Plugin could not be loaded',
        execfn: false,
        pluginfn: 'typeof moment !== "undefined"',
        trigger: 'pluginMomentReady',
        class: 'has-plugin-moment',
      };

      const settings = {
        element,
        default: '.countdown',
        file: 'plugins.countdown.js',
        error: 'plugins.countdown.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_countdownInit',
        pluginfn: '$().countdown',
        trigger: 'pluginCountdownReady',
        class: 'has-plugin-countdown',
      };

      SEMICOLON.initialize.functions(momentSettings);
      SEMICOLON.initialize.functions(settings);
    },

    gmap(element) {
      const googleSettings = {
        element,
        default: '.gmap',
        file: `https://maps.google.com/maps/api/js?key=${googleMapsAPI}`,
        error: 'Google Maps API could not be loaded',
        execfn: false,
        pluginfn: 'typeof google !== "undefined"',
        hiddendisable: true,
        class: 'has-plugin-gmapapi',
      };

      const settings = {
        element,
        default: '.gmap',
        file: 'plugins.gmap.js',
        error: 'plugins.gmap.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_gmapInit',
        pluginfn: 'typeof google !== "undefined" && $().gMap',
        hiddendisable: true,
        trigger: 'pluginGmapReady',
        class: 'has-plugin-gmap',
      };

      SEMICOLON.initialize.functions(googleSettings);
      SEMICOLON.initialize.functions(settings);
    },

    roundedSkill(element) {
      const settings = {
        element,
        default: '.rounded-skill',
        file: 'plugins.piechart.js',
        error: 'plugins.piechart.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_roundedSkillInit',
        pluginfn: '$().easyPieChart',
        trigger: 'pluginRoundedSkillReady',
        class: 'has-plugin-piechart',
      };

      SEMICOLON.initialize.functions(settings);
    },

    progress(element) {
      const settings = {
        element,
        default: '.progress',
        file: 'plugins.progress.js',
        error: 'plugins.progress.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_progressInit',
        pluginfn: 'typeof scwProgressPlugin !== "undefined"',
        trigger: 'pluginProgressReady',
        class: 'has-plugin-progress',
      };

      SEMICOLON.initialize.functions(settings);
    },

    twitterFeed(element) {
      const settings = {
        element,
        default: '.twitter-feed',
        file: 'plugins.twitter.js',
        error: 'plugins.twitter.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_twitterFeedInit',
        pluginfn:
          'typeof sm_format_twitter !== "undefined" && typeof sm_format_twitter3 !== "undefined"',
        trigger: 'pluginTwitterFeedReady',
        class: 'has-plugin-twitter',
      };

      SEMICOLON.initialize.functions(settings);
    },

    flickrFeed(element) {
      const settings = {
        element,
        default: '.flickr-feed',
        file: 'plugins.flickrfeed.js',
        error: 'plugins.flickrfeed.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_flickrFeedInit',
        pluginfn: '$().jflickrfeed',
        trigger: 'pluginFlickrFeedReady',
        class: 'has-plugin-flickr',
      };

      SEMICOLON.initialize.functions(settings);
    },

    instagramPhotos(element) {
      const settings = {
        element,
        default: '.instagram-photos',
        file: 'plugins.instagram.js',
        error: 'plugins.instagram.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_instagramPhotosInit',
        pluginfn: 'typeof scwInstagramPlugin !== "undefined"',
        trigger: 'pluginInstagramReady',
        class: 'has-plugin-instagram',
      };

      SEMICOLON.initialize.functions(settings);
    },

    dribbbleShots(element) {
      const settings = {
        element,
        default: '.dribbble-shots',
        file: 'plugins.dribbble.js',
        error: 'plugins.dribbble.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_dribbbleShotsInit',
        pluginfn: '$.jribbble',
        trigger: 'pluginDribbbleReady',
        class: 'has-plugin-dribbble',
      };

      const imagesLoadedSettings = {
        element,
        default: '.dribbble-shots',
        file: 'plugins.imagesloaded.js',
        error: 'plugins.imagesloaded.js: Plugin could not be loaded',
        pluginfn: '$().imagesLoaded',
        trigger: 'pluginImagesLoadedReady',
        class: 'has-plugin-imagesloaded',
      };

      SEMICOLON.initialize.functions(settings);
      SEMICOLON.initialize.functions(imagesLoadedSettings);
    },

    navTree(element) {
      const settings = {
        element,
        default: '.nav-tree',
        file: 'plugins.navtree.js',
        error: 'plugins.navtree.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_navtreeInit',
        pluginfn: 'typeof scwNavTreePlugin !== "undefined"',
        trigger: 'pluginNavTreeReady',
        class: 'has-plugin-navtree',
      };

      SEMICOLON.initialize.functions(settings);
    },

    carousel(element) {
      const settings = {
        element,
        default: '.carousel-widget',
        file: 'plugins.carousel.js',
        error: 'plugins.carousel.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_carouselInit',
        pluginfn: '$().owlCarousel',
        trigger: 'pluginCarouselReady',
        class: 'has-plugin-carousel',
      };

      SEMICOLON.initialize.functions(settings);
    },

    masonryThumbs(element) {
      const settings = {
        element,
        default: '.masonry-thumbs',
        file: 'plugins.masonrythumbs.js',
        error: 'plugins.masonrythumbs.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_masonryThumbsInit',
        pluginfn:
          '$().isotope && typeof scwMasonryThumbsPlugin !== "undefined"',
        trigger: 'pluginMasonryThumbsReady',
        class: 'has-plugin-masonrythumbs',
      };

      SEMICOLON.initialize.functions(settings);
    },

    notifications(element) {
      const settings = {
        element,
        default: false,
        file: 'plugins.notify.js',
        error: 'plugins.notify.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_notificationInit',
        pluginfn: 'typeof toastr !== "undefined"',
        trigger: 'pluginNotifyReady',
        class: 'has-plugin-toastr',
      };

      SEMICOLON.initialize.functions(settings);
    },

    textRotator(element) {
      const settings = {
        element,
        default: '.text-rotater',
        file: 'plugins.textrotator.js',
        error: 'plugins.textrotator.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_textRotatorInit',
        pluginfn: '$().Morphext',
        trigger: 'pluginTextRotatorReady',
        class: 'has-plugin-textrotator',
      };

      SEMICOLON.initialize.functions(settings);
    },

    linkScroll(element) {
      const settings = {
        element,
        default: 'a[data-scrollto]',
        file: 'plugins.linkscroll.js',
        error: 'plugins.linkscroll.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_linkScrollInit',
        pluginfn: 'typeof scwLinkScrollPlugin !== "undefined"',
        trigger: 'pluginLinkScrollReady',
        class: 'has-plugin-linkscroll',
      };

      SEMICOLON.initialize.functions(settings);
    },

    ajaxForm(element) {
      const formSettings = {
        element,
        default: '.form-widget',
        file: 'plugins.form.js',
        error: 'plugins.form.js: Plugin could not be loaded',
        execfn: false,
        pluginfn: '$().validate && $().ajaxSubmit',
        class: 'has-plugin-form',
      };

      const settings = {
        element,
        default: '.form-widget',
        file: 'plugins.ajaxform.js',
        error: 'plugins.ajaxform.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_ajaxFormInit',
        pluginfn: 'typeof scwAjaxFormPlugin !== "undefined"',
        trigger: 'pluginAjaxFormReady',
        class: 'has-plugin-ajaxform',
      };

      SEMICOLON.initialize.functions(formSettings);
      SEMICOLON.initialize.functions(settings);
    },

    subscription(element) {
      const formSettings = {
        element,
        default: '.subscribe-widget',
        file: 'plugins.form.js',
        error: 'plugins.form.js: Plugin could not be loaded',
        execfn: false,
        pluginfn: '$().validate && $().ajaxSubmit',
        class: 'has-plugin-form',
      };

      const settings = {
        element,
        default: '.subscribe-widget',
        file: 'plugins.subscribe.js',
        error: 'plugins.subscribe.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_subscribeFormInit',
        pluginfn: 'typeof scwSubscribeFormPlugin !== "undefined"',
        trigger: 'pluginSubscribeFormReady',
        class: 'has-plugin-subscribeform',
      };

      SEMICOLON.initialize.functions(formSettings);
      SEMICOLON.initialize.functions(settings);
    },

    shapeDivider(element) {
      const settings = {
        element,
        default: '.shape-divider',
        file: 'plugins.shapedivider.js',
        error: 'plugins.shapedivider.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_shapeDividerInit',
        pluginfn: 'typeof scwShapeDividerPlugin !== "undefined"',
        trigger: 'pluginShapeDividerReady',
        class: 'has-plugin-shapedivider',
      };

      SEMICOLON.initialize.functions(settings);
    },

    ticker(element) {
      const settings = {
        element,
        default: '.scw-ticker',
        file: 'plugins.ticker.js',
        error: 'plugins.ticker.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_tickerInit',
        pluginfn: 'typeof scwTickerPlugin !== "undefined"',
        trigger: 'pluginTickerReady',
        class: 'has-plugin-ticker',
      };

      SEMICOLON.initialize.functions(settings);
    },

    stickySidebar(element) {
      const settings = {
        element,
        default: '.sticky-sidebar-wrap',
        file: 'plugins.stickysidebar.js',
        error: 'plugins.stickysidebar.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_stickySidebarInit',
        pluginfn: '$().scwStickySidebar',
        trigger: 'pluginStickySidebarReady',
        class: 'has-plugin-stickysidebar',
      };

      SEMICOLON.initialize.functions(settings);
    },

    cookieNotify(element) {
      const settings = {
        element,
        default: '.gdpr-settings,[data-cookies]',
        file: 'plugins.cookie.js',
        error: 'plugins.cookie.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_cookieInit',
        pluginfn: 'typeof Cookies !== "undefined"',
        trigger: 'pluginCookieReady',
        class: 'has-plugin-cookie',
      };

      SEMICOLON.initialize.functions(settings);
    },

    cartQuantity() {
      const settings = {
        default: '.qty',
        file: 'plugins.quantity.js',
        error: 'plugins.quantity.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_quantityInit',
        pluginfn: 'typeof scwQuantityPlugin !== "undefined"',
        trigger: 'pluginQuantityReady',
        class: 'has-plugin-quantity',
      };

      SEMICOLON.initialize.functions(settings);
    },

    readmore() {
      const settings = {
        default: '[data-readmore]',
        file: 'plugins.readmore.js',
        error: 'plugins.readmore.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_readmoreInit',
        pluginfn: 'typeof scwReadMorePlugin !== "undefined"',
        trigger: 'pluginReadMoreReady',
        class: 'has-plugin-readmore',
      };

      SEMICOLON.initialize.functions(settings);
    },

    pricingSwitcher() {
      const settings = {
        default: '.pts-switcher',
        file: 'plugins.pricingswitcher.js',
        error: 'plugins.pricingswitcher.js: Plugin could not be loaded',
        execfn: 'SEMICOLON_pricingSwitcherInit',
        pluginfn: 'typeof scwPricingSwitcherPlugin !== "undefined"',
        trigger: 'pluginPricingSwitcherReady',
        class: 'has-plugin-pricing-switcher',
      };

      SEMICOLON.initialize.functions(settings);
    },

    extras() {
      $(window).on('pluginBootstrapReady', function () {
        if ($().tooltip) {
          $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
        } else {
          console.log('extras: Bootstrap Tooltip not defined.');
        }

        if ($().popover) {
          $('[data-toggle=popover]').popover();
        } else {
          console.log('extras: Bootstrap Popover not defined.');
        }
      });

      $('.style-msg').on('click', '.close', function (e) {
        $(this).parents('.style-msg').slideUp();
        e.preventDefault();
      });

      $('#page-menu-trigger')
        .off('click')
        .on('click', function () {
          $body.toggleClass('top-search-open', false);
          $pagemenu.toggleClass('page-menu-open');
          return false;
        });

      $pagemenu
        .find('nav')
        .off('click')
        .on('click', function (e) {
          $body.toggleClass('top-search-open', false);
          $topCart.toggleClass('top-cart-open', false);
        });

      if (SEMICOLON.isMobile.any()) {
        $body.addClass('device-touch');
      }
    },
  };

  SEMICOLON.isMobile = {
    Android() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any() {
      return (
        SEMICOLON.isMobile.Android() ||
        SEMICOLON.isMobile.BlackBerry() ||
        SEMICOLON.isMobile.iOS() ||
        SEMICOLON.isMobile.Opera() ||
        SEMICOLON.isMobile.Windows()
      );
    },
  };

  // Add your Custom JS Codes here
  SEMICOLON.customization = {
    onReady() {
      // Add JS Codes here to Run on Document Ready
    },

    onLoad() {
      // Add JS Codes here to Run on Window Load
    },

    onResize() {
      // Add JS Codes here to Run on Window Resize
    },
  };

  SEMICOLON.documentOnResize = {
    init() {
      SEMICOLON.header.menufunctions();
      SEMICOLON.header.fullWidthMenu();
      SEMICOLON.header.stickyMenu();
      SEMICOLON.initialize.dataResponsiveHeights();
      SEMICOLON.initialize.stickFooterOnSmall();
      SEMICOLON.slider.sliderDimensions();
      SEMICOLON.slider.sliderParallax();
      SEMICOLON.widget.html5Video();
      SEMICOLON.widget.masonryThumbs();
      SEMICOLON.initialize.dataResponsiveClasses();
      SEMICOLON.customization.onResize();

      windowWidth = $window.width();

      $(window).trigger('scwWindowResize');
    },
  };

  SEMICOLON.documentOnReady = {
    init() {
      SEMICOLON.initialize.init();
      SEMICOLON.header.init();
      if ($slider.length > 0 || $sliderElement.length > 0) {
        SEMICOLON.slider.init();
      }
      if ($portfolio.length > 0) {
        SEMICOLON.portfolio.init();
      }
      SEMICOLON.widget.init();
      SEMICOLON.documentOnReady.windowscroll();
      SEMICOLON.customization.onReady();

      if ($body.hasClass('adaptive-color-scheme')) {
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          $body.toggleClass('dark', true);
        }

        if (window.matchMedia) {
          window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', function (e) {
              e.matches
                ? $body.toggleClass('dark', true)
                : $body.toggleClass('dark', false);
            });
        }
      }

      $body.off('click').on('click', 'a[href*="#"]', function () {
        $window.on('beforeunload', function () {
          $window.scrollTop(0);
        });
      });

      const linkElement = location.hash;
      if (
        $(linkElement).length > 0 &&
        $('.one-page-menu').find(`[data-href="${linkElement}"]`).length > 0
      ) {
        $window.scrollTop(0);
      }
    },

    windowscroll() {
      if ($header.length > 0) {
        headerOffset = $header.offset().top;
        $headerWrap.addClass('position-absolute');
        headerWrapOffset = $headerWrap.offset().top;
        $headerWrap.removeClass('position-absolute');
      }

      const headerDefinedOffset = $header.attr('data-sticky-offset');
      if (typeof headerDefinedOffset !== 'undefined') {
        if (headerDefinedOffset == 'full') {
          headerWrapOffset = $window.height();
          const headerOffsetNegative = $header.attr(
            'data-sticky-offset-negative',
          );
          if (typeof headerOffsetNegative !== 'undefined') {
            headerWrapOffset = headerWrapOffset - headerOffsetNegative - 1;
          }
        } else {
          headerWrapOffset = Number(headerDefinedOffset);
        }
      } else if (headerWrapOffset === 'undefined') {
        headerWrapOffset = headerOffset;
      }

      const pageMenuWrap = $pagemenu.find('#page-menu-wrap');
      const offset = $headerWrap.outerHeight();
      const head = document.head || document.getElementsByTagName('head')[0];
      const style = document.createElement('style');
      let css;

      if ($pagemenu.length > 0) {
        $pageMenuClone.css({
          height: $pagemenu.find('#page-menu-wrap').outerHeight(),
        });
        setTimeout(function () {
          if ($header.length > 0 && !$header.hasClass('no-sticky')) {
            if (
              $body.hasClass('device-xl') ||
              $body.hasClass('device-lg') ||
              mobileSticky == 'true'
            ) {
              pageMenuOffset =
                $pagemenu.offset().top - $headerWrap.outerHeight();
              head.appendChild(style);
              css = `#page-menu.sticky-page-menu:not(.dots-menu) #page-menu-wrap { top: ${offset}px; }`;

              style.type = 'text/css';
              style.appendChild(document.createTextNode(css));
            } else {
              pageMenuOffset = $pagemenu.offset().top;
            }
          } else {
            pageMenuOffset = $pagemenu.offset().top;
          }
        }, 1000);
      }

      SEMICOLON.header.stickyMenu(headerWrapOffset);
      SEMICOLON.header.stickyPageMenu(pageMenuOffset);

      window.addEventListener('scroll', function () {
        SEMICOLON.initialize.goToTopScroll();
        $('body.open-header.close-header-on-scroll').removeClass(
          'side-header-open',
        );
        SEMICOLON.header.stickyMenu(headerWrapOffset);
        SEMICOLON.header.stickyPageMenu(pageMenuOffset);
        SEMICOLON.header.logo();
      });

      window.addEventListener(
        'DOMContentLoaded',
        onScrollSliderParallax,
        false,
      );

      $window.scrollEnd(function () {
        const headerHeight = $headerWrap.outerHeight();
        if (
          $headerWrapClone.length > 0 &&
          headerHeight > $headerWrapClone.outerHeight()
        ) {
          $headerWrapClone.css({ height: headerHeight });
          if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
            SEMICOLON.header.includeOffset();
          }
        }
        if (
          $pagemenu.length > 0 &&
          $header.length > 0 &&
          !$header.hasClass('no-sticky')
        ) {
          if ($body.hasClass('device-xl') || $body.hasClass('device-lg')) {
            $pagemenu
              .filter('.sticky-page-menu:not(.dots-menu,.no-sticky)')
              .find($pageMenuWrap)
              .css({ top: `${headerHeight}px` });
          }
        }
      }, 500);

      window.onfocus = function () {
        const headerHeight = $headerWrap.outerHeight();
        if (
          $headerWrapClone.length > 0 &&
          headerHeight > $headerWrapClone.outerHeight()
        ) {
          $headerWrapClone.css({ height: headerHeight });
        }
      };
    },
  };

  SEMICOLON.documentOnLoad = {
    init() {
      SEMICOLON.slider.swiperSliderMenu(true);
      SEMICOLON.slider.revolutionSliderMenu(true);
      SEMICOLON.initialize.stickFooterOnSmall();
      SEMICOLON.widget.gridInit();
      $window.on('pluginIsotopeReady', function () {
        SEMICOLON.widget.filterInit();
        SEMICOLON.widget.masonryThumbs();
      });
      SEMICOLON.widget.parallax();
      SEMICOLON.widget.loadFlexSlider();
      SEMICOLON.widget.html5Video();
      SEMICOLON.widget.ticker();
      SEMICOLON.header.responsiveMenuClass();
      SEMICOLON.initialize.modal();
      SEMICOLON.customization.onLoad();
    },
  };

  let $window = $(window);
  let windowScrT;
  let $body = $('body');
  let $wrapper = $('#wrapper');
  let $header = $('#header');
  let $headerWrap = $('#header-wrap');
  let $headerInc = $('.include-header');
  let defLogoH = $header.attr('data-logo-height') || 100;
  let stickyLogoH = $header.attr('data-sticky-logo-height') || 60;
  let mobileSticky = $header.attr('data-mobile-sticky') || 'false';
  let mobileLogoH = $header.attr('data-mobile-logo-height') || Number(defLogoH);
  const mobileStickyLogoH =
    $header.attr('data-mobile-sticky-logo-height') || Number(stickyLogoH);
  let defMenuP = $header.attr('data-menu-padding') || 39;
  let stickyMenuP = $header.attr('data-sticky-menu-padding') || 19;
  let headerSizeCustom =
    !$header.hasClass('header-size-lg') &&
    !$header.hasClass('header-size-md') &&
    !$header.hasClass('header-size-sm') &&
    !$header.hasClass('header-size-custom');
  let stickyShrink = $header.attr('data-sticky-shrink') || 'true';
  let stickyShrinkOffset = $header.attr('data-sticky-shrink-offset') || 300;
  let primaryMenu = $('.primary-menu');
  let primaryMenuMainItems = primaryMenu
    .find('.menu-container:not(mobile-primary-menu):not(.custom-spacing)')
    .children('.menu-item')
    .children('.menu-link');
  let $headerWrapClone = '';
  const initialHeaderWrapHeight = $headerWrap.outerHeight();
  const $headerRow = $headerWrap.find('.header-row:eq(0)');
  const $content = $('#content');
  let $footer = $('#footer');
  let windowWidth = $window.width();
  let oldHeaderClasses = $header.attr('class');
  let oldHeaderWrapClasses = $headerWrap.attr('class');
  let stickyMenuClasses = $header.attr('data-sticky-class');
  let responsiveMenuClasses = $header.attr('data-responsive-class');
  let logo = $('#logo');
  let defaultLogo = logo.find('.standard-logo');
  const defaultLogoWidth = defaultLogo.find('img').outerWidth();
  let retinaLogo = logo.find('.retina-logo');
  let defaultLogoImg = defaultLogo.find('img').attr('src');
  let retinaLogoImg = retinaLogo.find('img').attr('src');
  let defaultDarkLogo = defaultLogo.attr('data-dark-logo');
  let retinaDarkLogo = retinaLogo.attr('data-dark-logo');
  let defaultStickyLogo = defaultLogo.attr('data-sticky-logo');
  let retinaStickyLogo = retinaLogo.attr('data-sticky-logo');
  let defaultMobileLogo = defaultLogo.attr('data-mobile-logo');
  let retinaMobileLogo = retinaLogo.attr('data-mobile-logo');
  let topSearchTimeOut;
  let $pagemenu = $('#page-menu');
  let $pageMenuClone = '';
  let $pageMenuWrap = $pagemenu.find('#page-menu-wrap');
  const $onePageMenuEl = $('.one-page-menu');
  let $portfolio = $('.portfolio');
  const $shop = $('.shop');
  let $slider = $('#slider');
  let $sliderParallaxEl = $('.slider-parallax');
  let $sliderElement = $('.slider-element');
  const swiperSlider = '';
  let $pageTitle = $('#page-title');
  let $topSearch = $('.top-search-form');
  let $topCart = $('#top-cart');
  const $topSocialEl = $('#top-social').find('li');
  let $goToTopEl = $('#gotoTop');
  let googleMapsAPI = 'YOUR-API-KEY';
  let xScrollPosition;
  let yScrollPosition;
  let sliderParallaxEl = document.querySelector('.slider-parallax');
  let sliderParallaxElCaption = document.querySelector(
    '.slider-parallax .slider-caption',
  );
  let sliderParallaxElInner = document.querySelector('.slider-inner');
  let headerOffset = 0;
  let headerWrapOffset = 0;
  let pageMenuOffset = 0;
  let resizeTimer;

  $(document).ready(SEMICOLON.documentOnReady.init);

  $window.on('load', SEMICOLON.documentOnLoad.init);

  $window.on('resize', function () {
    const thisWindow = $(this);
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (thisWindow.width() !== windowWidth) {
        SEMICOLON.documentOnResize.init();
      }
    }, 250);
  });
})(jQuery);
