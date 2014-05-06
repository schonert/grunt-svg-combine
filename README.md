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

```js
grunt.initConfig({
  svgcombine: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.prefix
Type: `String`
Default value: `''`

A string value that is used to prefix the svg id.

#### options.prefix
Type: `Boolean`
Default value: `true`

Sends each SVG through [SVGO](https://github.com/svg/svgo/) before storing them. For a more customizable SVGO solution, consider creating a separat grunt task with [grunt-svgmin](https://github.com/sindresorhus/grunt-svgmin).

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


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
