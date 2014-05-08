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
	path = require('path'); // Gets file name from path

module.exports = function(grunt) {

	var writtenFiles = {};

	// Add task
	grunt.registerMultiTask('svgcombine', 'Combine multiple svg files in one single file.', function() {
		

		// Default options
		var options = this.options({
			prefix: '', // Prefix the stored svg id
			minify: true, // Throw svg through SVGO
			filter: null, // a function called right before storing svg
			append: true, // append or overwrite file
		});

		// Used to minify
		var svgo = new SVGO();

		// Determin filter
		var filter = options.filter;

		// Each destination
		this.files.forEach(function(f) {
			var destinationContent = ''; // Contains svg's
		
			// Check path
			f.src.filter(function(filePath){

				// Check if files exist
				if (!grunt.file.exists(filePath)) {
					grunt.log.warn('Dooh! "' + filePath + '" ain\'t there!.');
					return false;
				} else {
					return true;
				}
				
			})
			// Loop through src files
			.map(function(filePath){
				var svgContent; // svg content

				// get content
				if(options.minify){
					svgo.optimize(grunt.file.read(filePath), function(result) {
						// Error
						if (result.error){ return grunt.warn('Error parsing SVG: (' + filePath + ') ' + result.error);}
						
						svgContent = result.data;
					});
				}else{
					svgContent = grunt.file.read(filePath);
				}

				var	svg = cheerio.load(svgContent, {ignoreWhitespace: true, xmlMode: true})('svg'), // stored as cheerio obj
					fileName = path.basename(filePath, '.svg'); // u should be able to figure this one out

				// Sets id
				svg.attr('id', options.prefix + fileName);

				if(typeof filter === "function"){
					filter(svg, fileName, filePath);
				}

				// Stores svg with linebreak
				destinationContent += svg + '\n';

			});

			// Save
			if(options.append && writtenFiles[f.dest]){
				var temp = grunt.file.read(f.dest);
				grunt.file.write(f.dest, temp + destinationContent);
			}else{
				grunt.file.write(f.dest, destinationContent);
				writtenFiles[f.dest] = true;
			}
			// Finally done!
			grunt.log.writeln('There you go my friend "' + f.dest + '" was created with specially for you ♥');
		});
	});
};
