[Plotter-Shell-Model](https://github.com/datumgeek/plotter-shell-model/)
====================

[![Join the chat at https://gitter.im/misc-tech/a2dyn](https://badges.gitter.im/misc-tech/Lobby.svg)](https://gitter.im/misc-tech/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[This projects supports UMD (Universal Module Definition)](https://github.com/umdjs/umd)

![plotter-shell-model downloads](https://nodei.co/npm-dl/plotter-shell-model.png)

Included data structures
---------------------

- Xxx

Usage
--------------------

`npm install plotter-shell-model --save`

ES6 `import ... from`

```typescript
import * as PlotterShellModel from 'plotter-shell-model';
```

or TypeScript `import ... require`

```typescript
import PlotterShellModel = require('plotter-shell-model');
```

or JavaScript `var ... require`

```js
var PlotterShellModel = require('plotter-shell-model');
```

Typings resolution
-------------------

Remember to set `"moduleResolution": "node"`, so TypeScript compiler can resolve typings in the `node_modules/plotter-shell-model` directory.

![image](https://cloud.githubusercontent.com/assets/22680176/19417119/5e750f86-9361-11e6-9738-fdafdaf43e7e.png)

In browser usage
-------------------

You should include `umd.js` or `umd.min.js` from `dist/lib/` directory.

```html
<script src="[server public path]/plotter-shell-model/dist/lib/umd.min.js"></script>
```

Contact
--------------------

@datumgeek - at the following gitter channel

[![Join the chat at https://gitter.im/misc-tech/a2dyn](https://badges.gitter.im/misc-tech/Lobby.svg)](https://gitter.im/misc-tech/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Project structure is based on the excellent [typescript-collections](https://github.com/basarat/typescript-collections)
