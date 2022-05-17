import * as L from "leaflet";
import screenfull from "screenfull";

/**
 * Checks if the browser supports the Fullscreen API.
 *
 * This will most notably return `false` on iPhones as they do not
 * support the Fullscreen API.
 *
 * If `false`, you will have to use the psuedo fullscreen option.
 */
export function isFullscreenSupported(): boolean {
  return screenfull.isEnabled;
}

// ----------------------------------------------------------------------------

function initLeafletFullscreen() {
  // Handle server-side generation/rendering
  if (!L || typeof window === "undefined") return;

  L.Control.FullScreen = L.Control.extend<Partial<L.Control.FullScreen>>({
    options: {
      position: "topleft",
      title: "Enter fullscreen mode",
      titleCancel: "Exit fullscreen mode",
      content: null,
      forceSeparateButton: false,
      forcePseudoFullscreen: false,
      fullscreenElement: false,
    },

    willUseFullscreen(this: L.Control.FullScreen): boolean {
      return isFullscreenSupported() && !this.options.forcePseudoFullscreen;
    },

    onAdd(this: L.Control.FullScreen, map: L.Map): HTMLElement {
      let className = "leaflet-control-zoom-fullscreen",
        container: HTMLElement,
        content = "";

      if (map.zoomControl && !this.options.forceSeparateButton) {
        container = map.zoomControl.getContainer();
      } else {
        container = L.DomUtil.create("div", "leaflet-bar");
      }

      if (this.options.content) {
        content = this.options.content;
      } else {
        className += " fullscreen-icon";
      }

      this._createButton(
        this.options.title,
        className,
        content,
        container,
        this.toggleFullScreen,
        this
      );
      this._map.fullscreenControl = this;

      this._map.on("enterFullscreen exitFullscreen", this._toggleState, this);

      return container;
    },

    onRemove(this: L.Control.FullScreen) {
      L.DomEvent.off(this._link, "click", L.DomEvent.stop).off(
        this._link,
        "click",
        this.toggleFullScreen,
        this
      );

      if (this.willUseFullscreen()) {
        L.DomEvent.off(
          this._container,
          screenfull.raw.fullscreenchange,
          L.DomEvent.stop
        ).off(
          this._container,
          screenfull.raw.fullscreenchange,
          this._handleFullscreenChange,
          this
        );

        L.DomEvent.off(
          document as any,
          screenfull.raw.fullscreenchange,
          L.DomEvent.stop
        ).off(
          document as any,
          screenfull.raw.fullscreenchange,
          this._handleFullscreenChange,
          this
        );
      }
    },

    _createButton(
      this: L.Control.FullScreen,
      title,
      className,
      content,
      container,
      onClick,
      context
    ) {
      this._link = L.DomUtil.create("a", className, container);
      this._link.href = "#";
      this._link.title = title;
      this._link.innerHTML = content;

      this._link.setAttribute("role", "button");
      this._link.setAttribute("aria-label", title);

      L.DomEvent.disableClickPropagation(container);

      L.DomEvent.on(this._link, "click", L.DomEvent.stop).on(
        this._link,
        "click",
        onClick,
        context
      );

      if (this.willUseFullscreen()) {
        L.DomEvent.on(
          container,
          screenfull.raw.fullscreenchange,
          L.DomEvent.stop
        ).on(
          container,
          screenfull.raw.fullscreenchange,
          this._handleFullscreenChange,
          context
        );

        L.DomEvent.on(
          document as any,
          screenfull.raw.fullscreenchange,
          L.DomEvent.stop
        ).on(
          document as any,
          screenfull.raw.fullscreenchange,
          this._handleFullscreenChange,
          context
        );
      }

      return this._link!;
    },

    toggleFullScreen(this: L.Control.FullScreen) {
      let map = this._map;
      map._exitFired = false;

      if (map._isFullscreen) {
        if (this.willUseFullscreen()) {
          screenfull.exit();
        } else {
          L.DomUtil.removeClass(
            this.options.fullscreenElement
              ? this.options.fullscreenElement
              : map.getContainer(),
            "leaflet-pseudo-fullscreen"
          );
          map.invalidateSize();
        }

        map.fire("exitFullscreen");
        map._exitFired = true;
        map._isFullscreen = false;
      } else {
        if (screenfull.isEnabled && !this.options.forcePseudoFullscreen) {
          screenfull.request(
            this.options.fullscreenElement
              ? this.options.fullscreenElement
              : map.getContainer()
          );
        } else {
          L.DomUtil.addClass(
            this.options.fullscreenElement
              ? this.options.fullscreenElement
              : map.getContainer(),
            "leaflet-pseudo-fullscreen"
          );
          map.invalidateSize();
        }
        map.fire("enterFullscreen");
        map._isFullscreen = true;
      }
    },

    _toggleState(this: L.Control.FullScreen) {
      this._link.title = this._map._isFullscreen
        ? this.options.title
        : this.options.titleCancel;

      this._map._isFullscreen
        ? L.DomUtil.removeClass(this._link, "leaflet-fullscreen-on")
        : L.DomUtil.addClass(this._link, "leaflet-fullscreen-on");
    },

    _handleFullscreenChange(this: L.Control.FullScreen) {
      let map = this._map;
      map.invalidateSize();

      if (!screenfull.isFullscreen && !map._exitFired) {
        map.fire("exitFullscreen");
        map._exitFired = true;
        map._isFullscreen = false;
      }
    },
  }) as typeof L.Control.FullScreen;

  L.Map.include({
    toggleFullscreen(this: L.Map) {
      this.fullscreenControl?.toggleFullScreen();
    },
  });

  L.Map.addInitHook(function (this: L.Map) {
    if (this.options.fullscreenControl) {
      this.addControl(L.fullScreen(this.options.fullscreenControlOptions));
    }
  });

  // @ts-expect-error Cannot assign to `L.fullScreen` due to typings
  L.fullScreen = function (this: L, options?: IFullScreenOptions) {
    return new L.Control.FullScreen(options);
  };
}

initLeafletFullscreen();
