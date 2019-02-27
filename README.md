# excel2table

Renders excel file as HTML table

### How to use

```js
import "excel2table";

excel2table.render(html_container, data, config);

/*
	html_container - css locator or HTML element
	data - file object or data blob
	config - optional, { worker, scales } 
		- worker: string - url for web worker, cdn used by default
		- scales: boolean - show or not excel scales
*/
```

Lib uses https://github.com/dhtmlx/excel2json for excel parsing


### License

MIT