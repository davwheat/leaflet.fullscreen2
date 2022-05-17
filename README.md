# Leaflet.FullScreen2

A super-simple Leaflet plugin to add fullscreen buttons to your maps, designed for Javascript bundlers, filled to the brim with Typescript typings to aid your development experience.

## Introduction

This plugin uses the native Fullscreen API with the lovely help of [`screenfull`](https://github.com/sindresorhus/screenfull.js).

### Important considerations

Please note that iPhones do **not** support this API. This plugin will automatically fall back to using a pseudo-fullscreen system instead for iOS devices.

Also note that if you want to use the plugin on a map which embedded in an iframe, you **must** set the `allowfullscreen` attribute on your iframe.

## Options

All options are explained in detail within the Typescript typings bundled with this package. Descriptions and further info can be found within your IDE if it supports Typescript and TSDoc.

| Option                  | Default              | Description                                                                                                                      |
| ----------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `position`              | `'topleft'`          | Where to render the control on the leaflet map.                                                                                  |
| `title`                 | `'Enter fullscreen'` | The `title` attribute for the fullscreen button when not in fullscreen mode.                                                     |
| `titleCancel`           | `'Exit fullscreen'`  | The `title` attribute for the fullscreen button when in fullscreen mode.                                                         |
| `content`               | `null`               | Override the content of the fullscreen button. Must be `null` (use an icon) or an HTML string.                                   |
| `forceSeparateButton`   | `false`              | Force the fullscreen button to be rendered outside of the `ZoomControls` control.                                                |
| `forcePseudoFullscreen` | `false`              | Use pseudo-fullscreen even if the browser supports the Fullscreen API.                                                           |
| `fullscreenElement`     | `false`              | The element to make fullscreen when fullscreen is toggled. This is normally the map's container. (`false` automatically detects) |

## Usage

### Adding at map creation

```js
import "leaflet.fullscreen2";
import "leaflet.fullscreen2/leaflet.fullscreen2.css";

// ...

const map = L.map({
  fullScreenControl: true,
  fullScreenControlOptions: {
    position: "topleft",
    forceSeparateButton: true,
  },
});
```

### Adding to an existing map

```js
import "leaflet.fullscreen2";
import "leaflet.fullscreen2/leaflet.fullscreen2.css";

const map = L.map();

// ...

L.fullScreen({
  position: "topleft",
  forceSeparateButton: true,
}).addTo(map);
```

### Map events & methods

```js
// Create a map with a fullscreen button
const map = L.map({
  fullScreenControl: true,
});

// Events are fired when entering or exiting fullscreen
map.on("enterFullscreen", function () {
  console.log("entered fullscreen");
});

map.on("exitFullscreen", function () {
  console.log("exited fullscreen");
});

// You can also toggle fullscreen via a method on the map object
map.toggleFullScreen();
```

### Usage with `react-leaflet`

I created this library mainly for use in my React website, alongside `react-leaflet`. A simple code snippet example can be seen below for how this can be integrated with `react-leaflet`.

```jsx
import React, { useEffect } from "react";

import { MapContainer, useMap, useMapEvent } from "react-leaflet";

export function MyLeafletMap() {
  <MapContainer
    style={{
      height: "60vh",
    }}
    center={[51.505, -0.09]}
    zoom={13}
    attributionControl={false}
  >
    <FullscreenButton />
  </MapContainer>;
}

function FullscreenButton() {
  const map = useMap();

  useEffect(() => {
    // Only add the control if the map doesn't already have it
    //
    // This prevents issues where re-renders would cause duplication
    // of the fullscreen button.
    if (!map.fullScreenControl) {
      L.fullScreen({
        position: "topleft",
        title: "Enter fullscreen mode",
        titleCancel: "Exit fullscreen mode",
        forceSeparateButton: true,
      }).addTo(map);
    }
  });

  useMapEvent("enterFullscreen", () => {
    // You can also listen for the enter/exit fullscreen events
  });

  return null;
}
```
