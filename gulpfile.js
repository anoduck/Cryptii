
// require gulp plugins
var gulp = require('gulp'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css');

var http = require('http'),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	del = require('del');

// build path or folder
var buildPath = 'build';

// external file urls and paths
var externalFiles = [
	{
		url: 'http://code.jquery.com/jquery-2.1.1.min.js',
		path: buildPath + '/js',
		filename: 'jquery.min.js'
	}, {
		url: 'http://code.jquery.com/ui/1.11.2/jquery-ui.min.js',
		path: buildPath + '/js',
		filename: 'jquery-ui.min.js'
	}
];

// paths to source files
var source = {
	js: [
		'js/Adam.js',
		'js/*.js',
		'js/Format/Text.js',
		'js/Format/Decimal.js',
		'js/*/*.js',
		'js/*/*/*.js',
		'js/*/*/*/*.js',
	],
	sass: [
		'sass/base.scss'
	],
	images: [
		'images/*'
	],
	html: [
		'index.html'
	]
};

function downloadExternalFile(url, path, filename, callback) {
	// check if external file has already been downloaded
	fs.exists(path + '/' + filename, function(exists) {
		if (!exists) {
			// create folder structure if it does not exist
			mkdirp(path, function(err) {
				// download file
				var file = fs.createWriteStream(path + '/' + filename);
				var request = http.get(url, function(response) {
					response.pipe(file);
					file.on('finish', function() {
						file.close(callback);
					});
				});
			});
		} else {
			callback();
		}
	});
};

gulp.task('clean', function(callback) {
	// remove the build folder
	del([buildPath], callback);
});

gulp.task('external', function(callback) {
	// download external files
	var downloadedFiles = 0;
	for (var i = 0; i < externalFiles.length; i ++) {
		var url = externalFiles[i].url;
		var path = externalFiles[i].path;
		var filename = externalFiles[i].filename;
		downloadExternalFile(url, path, filename, function() {
			if (++ downloadedFiles == externalFiles.length) {
				callback();
			}
		});
	}
});

gulp.task('js', function() {
	// concat and minify
	return gulp.src(source.js)
		.pipe(sourcemaps.init())
			.pipe(concat('cryptii.js'))
			.pipe(gulp.dest(buildPath + '/js'))
			.pipe(uglify())
			.pipe(rename('cryptii.min.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(buildPath + '/js'));
});

gulp.task('sass', function() {
	// compile sass, autoprefix and minify it
	return gulp.src(source.sass)
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 2 versions']
		}))
		.pipe(rename('cryptii.css'))
		.pipe(gulp.dest(buildPath + '/css'))
		.pipe(minifyCSS())
		.pipe(rename('cryptii.min.css'))
		.pipe(gulp.dest(buildPath + '/css'));
});

gulp.task('html', function() {
	// copy html files to the build folder
	return gulp.src(source.html)
		.pipe(gulp.dest(buildPath));
});

gulp.task('images', function() {
	// copy images to build folder
	return gulp.src(source.images)
		.pipe(gulp.dest(buildPath + '/images'));
});

gulp.task('watch', function() {
	gulp.watch(source.js, ['js']);
	gulp.watch(source.sass, ['sass']);
	gulp.watch(source.html, ['html']);
	gulp.watch(source.images, ['images']);
});

gulp.task('default', ['watch', 'js', 'sass', 'html', 'images', 'external']);
