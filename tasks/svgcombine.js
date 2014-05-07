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

	// Add task
	grunt.registerMultiTask('svgcombine', 'Combine multiple svg files in one single file.', function() {
		
		// Default options
		var options = this.options({
			prefix: '', // Prefix the stored svg id
			minify: true // Throw svg through SVGO
		});

		// Used to minify
		var svgo = new SVGO();

		// Each destination
		this.files.forEach(function(f) {
			var destinationContent = ''; // Contains svg's
		
			// Check path
			f.src.filter(function(filepath){

				// Check if files exist
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Dooh! "' + filepath + '" ain\'t there!.');
					return false;
				} else {
					return true;
				}
				
			})
			// Loop through src files
			.map(function(filepath){
				var svgContent; // svg content

				// get content
				if(options.minify){
					svgo.optimize(grunt.file.read(filepath), function(result) {
						// Error
						if (result.error){ return grunt.warn('Error parsing SVG: (' + filepath + ') ' + result.error);}
						
						svgContent = result.data;
					});
				}else{
					svgContent = grunt.file.read(filepath);
				}

				var	svg = cheerio.load(svgContent, {ignoreWhitespace: true, xmlMode: true})('svg'), // stored as cheerio obj
					fileName = path.basename(filepath, '.svg'); // u should be able to figure this one out

				// Sets id
				svg.attr('id', options.prefix + fileName);

				// Stores svg with linebreak
				destinationContent += svg + '\n';

			});

			// Save
			grunt.file.write(f.dest, destinationContent);

			// Finally done!
			grunt.log.writeln('There you go my friend "' + f.dest + '" was created specially for you ♥');
		});
	});
};
