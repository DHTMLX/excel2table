Excel2table library
-----------------------

Excel2table is a library that will help you to render an Excel file as an HTML table. It uses https://github.com/dhtmlx/excel2json for Excel parsing.

### How to use

- import the library

```js
import "excel2table";
```

- call the `render` function:

```js
excel2table.render(html_container, data, config);
```
The parameters of the function are the following:

- **html_container** - a CSS locator or an HTML element
- **data** - a file object or a data blob
- **config** - optional, a configuration object { worker, scales }, where
	- *worker*: string - an URL for a web worker; CDN is used by default
	- *scales*: boolean - defines whether Excel scale is shown


### License

MIT
