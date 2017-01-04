/*
 * grunt-svg-combine
 * https://github.com/gruntjs/grunt-init-gruntplugin
 *
 * Copyright (c) 2014 Stefan Schonert
 * Licensed under the MIT license.
 */

'use strict';

var cheerio = require('cheerio'), // Serverside jQery - used to change id
	SVGO = require('svgo'), // Minify svg
	path = require('path'), // Gets file name from path
	prettyBytes = require('pretty-bytes');

module.exports = function(grunt) {

	var writtenFiles = [];

	// Add task
	grunt.registerMultiTask('svgcombine', 'Combine multiple svg files in one single file.', function() {

		// Default options
		var defaults = this.options({
			prefix: '', // Prefix the stored svg id
			minify: true, // Throw svg through SVGO
			filter: null, // a function called right before storing svg
			append: true, // append or overwrite file
		});

		// Used to minify
		var svgo = new SVGO(defaults.svgo);

		// Determin filter
		var filter = defaults.filter;

		// Total amount of files
		var totalFiles = 0;

		// bytes saved
		var bytesSaved = 0;

		grunt.log.writeln();
		grunt.log.subhead('Running ' + this.target);

		// Each destination
		this.files.forEach(function(f) {
			var options = {};
			var destinationContent = ''; // Contains svg's

			Object.keys(defaults).forEach(function(key) {
				options[key] = f.options && f.options[key] ? f.options[key] : defaults[key];
			});

			totalFiles += f.src.length;

			// Check path
			f.src.filter(function(filePath){
				// Check if files exist
				if (!grunt.file.exists(filePath)) {
					grunt.log.warn('Dooh! "' + filePath + '" ain\'t there!.');
					totalFiles--;
					return false;
				} else {
					return true;
				}
			})
			// Loop through src files
			.map(function(filePath){
				// Cheerio element
				var svg;

				// raw svg
				var svgRaw;

				// Filtered raw svg
				var filteredSvg;

				// get content
				if(options.minify){
					svgo.optimize(grunt.file.read(filePath), function(result) {

						// Error
						if (result.error){ return grunt.warn('Error parsing SVG: (' + filePath + ') ' + result.error);}

						svgRaw = result.data;
					});
				}else{
					svgRaw = grunt.file.read(filePath);
				}

				var	svg = cheerio.load(svgRaw, {ignoreWhitespace: true, xmlMode: true})('svg'), // stored as cheerio obj
					fileName = path.basename(filePath, '.svg'); // u should be able to figure this one out

				if(typeof filter === "function"){
					filteredSvg = filter(svg, fileName, filePath, svgRaw);
					svg = filteredSvg ? cheerio.load(filteredSvg, {ignoreWhitespace: true, xmlMode: true})('svg') : svg;
				}

				grunt.log.writeln(filePath + ' (' + prettyBytes(svgRaw.length) + ')');

				// Stores svg with linebreak
				destinationContent += svg + '\n';

				bytesSaved += svgRaw.length - svg.html().length;
			});

			// Save
			if(options.append && writtenFiles.indexOf(f.dest) !== -1){
				var temp = grunt.file.read(f.dest);
				grunt.file.write(f.dest, temp + destinationContent);
			}else{
				grunt.file.write(f.dest, destinationContent);
				writtenFiles.push(f.dest);
			}

			// Finally done!
			grunt.log.writeln('\nThere you go my friend "' + f.dest + '" was created specially for you ♥');



		});
			grunt.log.subhead('A total of ' + prettyBytes(bytesSaved) + ' and ' + (totalFiles-writtenFiles.length)+ ' requests where saved' );

	});
};
