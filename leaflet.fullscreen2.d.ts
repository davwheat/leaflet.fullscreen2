import * as L from "leaflet";

export interface IFullScreenOptions {
  position: L.ControlPosition;
  title: string;
  titleCancel: string;
  content: null | string;
  forceSeparateButton: boolean;
  forcePseudoFullscreen: boolean;
  fullscreenElement: HTMLElement | false;
}

declare module "leaflet" {
  function fullScreen(
    options?: Partial<IFullScreenOptions>
  ): L.Control.FullScreen;

  interface MapOptions {
    /**
     * Adds a fullscreen control to the map at instantiation.
     */
    fullscreenControl?: boolean;
    /**
     * Options for the fullscreen control added to the map at instantiation
     * if `fullscreenControl` is `true`.
     */
    fullscreenControlOptions?: IFullScreenOptions;
  }

  namespace Control {
    class FullScreen extends L.Control {
      /**
       * Instantiate a new instance of the FullScreen control.
       */
      constructor(options?: Partial<IFullScreenOptions>);

      /**
       * Options set for this FullScreen control.
       */
      options: IFullScreenOptions;

      /**
       * @private
       */
      _container?: HTMLElement;
      /**
       * @private
       */
      _map?: L.Map;

      /**
       * @private
       */
      _link?: HTMLAnchorElement;

      /**
       * Whether the FullScreen control will use the proper FullScreen API.
       *
       * This is affected by the {@link IFullScreenOptions.forcePseudoFullscreen} option.
       */
      willUseFullscreen(): boolean;

      toggleFullScreen(): void;

      /**
       * @private
       */
      _createButton(
        title: string,
        className: string,
        content: string | null,
        container: HTMLElement,
        onClick: L.DomEvent.EventHandlerFn,
        context: L.Control.FullScreen
      ): HTMLAnchorElement;
      /**
       * @private
       */
      _handleFullscreenChange(): void;
      /**
       * @private
       */
      _toggleState(): void;
    }
  }

  namespace Map {
    /**
     * If the FullScreen control is present on the map, toggle the map's
     * fullscreen state.
     */
    function toggleFullscreen(): void;
  }

  interface Map {
    /**
     * @private
     */
    _exitFired: boolean;
    /**
     * @private
     */
    _isFullscreen: boolean;

    fullscreenControl?: L.Control.FullScreen;
  }
}

export function isFullscreenSupported(): boolean;

export {};
