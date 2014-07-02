# grunt-svg-combine

> Combine multiple svg files in one single file.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-svg-combine --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-svg-combine');
```

## Description
Combine multiple svg files in one single file. Each svg is minfied with [SVGO](https://github.com/svg/svgo/) before stored. 

## The "svgcombine" task

### Overview
In your project's Gruntfile, add a section named `svgcombine` to the data object passed into `grunt.initConfig()`.

### Options

#### options.prefix
Type: `String`
Default value: `''`

A string value that is used to prefix the svg id.

#### options.minify
Type: `Boolean`
Default value: `true`

Sends each SVG through [SVGO](https://github.com/svg/svgo/) before storing them. For a more customizable SVGO solution, consider creating a separat grunt task with [grunt-svgmin](https://github.com/sindresorhus/grunt-svgmin).

#### options.filter
Type: `function`
Params: `[object cheerio]: the svg`, `string: file name`, `string: file path`

Filter through each svg, before it gets stored.

### options.svgo
Type: `object`

Options to pass along to the svgo-instance. Most likely plugin-options.

#### options.append
Type: `append`
Default value: `true`

If there are multiple tasks with the same destination, svg's are by default appended to the destination, instead of overwriting

### Usage Examples

#### Default Options
In this example we are creating a single html file that contains all svg's. Each svg will get an `id` eaqual to it's filename

```js
grunt.initConfig({
  svgcombine: {
    files: {
      'svg-cache.html': ['svg/*.svg'],
    },
  },
});
```

#### Filter, svgo and append
In this example we are creating a single html file that contains all svg's. Each svg will get an `id` eaqual to it's filename

```js
grunt.initConfig({
  svgcombine: {
    options: {
      filter: function(svg,fileName,filePath){ // global filter
        if(fileName === 'icon')
          svg.attr('class', 'icon');
      },
      svgo: {
        'plugins':[
          {'cleanupIDs':false}
        ]
      },
      append: true
    },
    all: {
      files: {
        'svg-cache.html': ['svg/*.svg'],
      }
    },
    illustrations: {
      files: {
        'svg-cache.html': ['illustrations/*.svg'],
      },
      options: {
        filter: function(svg, fileName, filePath){ // local filter overrides global
          svg.attr('class', 'illustration');
        }
      }
    }
  },
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

