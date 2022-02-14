var gulp = require("gulp");
var exec = require("gulp-exec");
var sass = require("gulp-sass");
var clean = require("gulp-clean");
var concat = require("gulp-concat");
var sourcemaps = require("gulp-sourcemaps");
var webserver = require("gulp-webserver");
var plumber = require("gulp-plumber");
var babel = require("gulp-babel");
var path = require("path");
var xlsx = require("xlsx");
var fs = require("fs");


var paths = {
	out: "www",
	sass: {
		src: [
			"node_modules/bootstrap/scss/bootstrap-grid.scss",
			"src/**/*.scss"
		],
		dest: "www"
	},
	js: {
		src: "src/**/*.js",
		dest: "www"
	},
	lib: {
		js: {
			src: [
				"node_modules/jquery/dist/jquery.min.js",
				"node_modules/angular/angular.min.js",
				"node_modules/angular-aria/angular-aria.min.js",
				"node_modules/angular-animate/angular-animate.min.js",
				"node_modules/angular-material/angular-material.min.js",
				"node_modules/fuse.js/src/fuse.min.js",
			],
			dest: "www"
		},
		css: {
			src: [
				"node_modules/angular-material/angular-material.min.css"
			],
			dest: "www"
		}
	},
	assets: {
		src: "src/assets/**/*",
		dest: "www/assets"
	},
	components: {
		src: "src/components/**/*.html",
		dest: "www/components"
	},
	html: {
		src: "src/**/*.html",
		dest: "www"
	},
	rootfiles: {
		src: [
			"src/humans.txt",
			"src/favicon.ico"
		],
		dest: "www"
	},
	mobile: {
		src: "www/**/*",
		dest: "../mobile/www"
	},
	data: {
		src: "src/data/translations.xlsx",
		dest: "www/data/translations.json"
	},
	alternative: {
		src: "www/**",
		dest: "www-alt"
	}
};




gulp.task("clean", function (cb) {
	gulp
		.src(paths.out, {
			read: false
		})
		.pipe(clean());
});

gulp.task("js", function () {
	gulp
		.src(paths.js.src)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ["es2015", "stage-0"]
		}))
		.pipe(concat("app.bundle.js"))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(paths.js.dest));
});

gulp.task("sass", function () {
	gulp
		.src(paths.sass.src)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(concat("app.bundle.css"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.sass.dest));
});

gulp.task("lib-js", function () {
	gulp
		.src(paths.lib.js.src)
		.pipe(concat("lib.bundle.js"))
		.pipe(gulp.dest(paths.lib.js.dest));
});

gulp.task("lib-css", function () {
	gulp
		.src(paths.lib.css.src)
		.pipe(sourcemaps.init())
		.pipe(concat("lib.bundle.css"))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.lib.css.dest));
})

gulp.task("assets", function () {
	gulp
		.src(paths.assets.src)
		.pipe(gulp.dest(paths.assets.dest));
});

gulp.task("components", function () {
	gulp
		.src(paths.components.src)
		.pipe(gulp.dest(paths.components.dest));
});

gulp.task("data", function () {
	var workbook = xlsx.readFile(paths.data.src);
	var data = {};

	for (var i = 0; i < workbook.SheetNames.length; i++) {
		var name = workbook.SheetNames[i];
		var sheet = workbook.Sheets[name];
		var json = xlsx.utils.sheet_to_json(sheet);
		data[name] = json;
	}

	var dir = path.resolve(paths.data.dest, "../..");
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	dir = path.resolve(paths.data.dest, "..");
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	fs.writeFile(paths.data.dest, JSON.stringify(data), function (err) {
		if (err)
			console.log(err);
	});
});

gulp.task("html", function () {
	gulp
		.src(paths.html.src)
		.pipe(gulp.dest(paths.html.dest));
});

gulp.task("rootfiles", function () {
	gulp
		.src(paths.rootfiles.src)
		.pipe(gulp.dest(paths.rootfiles.dest));
})

gulp.task("watch", function () {
	gulp.watch(paths.js.src, ["js"]);
	gulp.watch(paths.sass.src, ["sass"]);
	gulp.watch(paths.lib.js.src, ["lib-js"]);
	gulp.watch(paths.lib.css.src, ["lib-css"]);
	gulp.watch(paths.assets.src, ["assets"]);
	gulp.watch(paths.components.src, ["components"]);
	gulp.watch(paths.data.src, ["data"]);
	gulp.watch(paths.html.src, ["html"]);
	gulp.watch(paths.rootfiles.src, ["rootfiles"]);
});

gulp.task("webserver", function () {
	gulp
		.src(paths.out)
		.pipe(webserver({
			livereload: true,
			open: true
		}));
})

gulp.task("mobile-clean", function () {
	gulp
		.src(paths.mobile.dest, {
			read: false
		})
		.pipe(clean({
			force: true
		}));
});

gulp.task("mobile-copy", function () {
	gulp
		.src(paths.mobile.src)
		.pipe(gulp.dest(paths.mobile.dest));
});

gulp.task("alternative-clean", function () {
	gulp
		.src(paths.alternative.dest, {
			read: false
		})
		.pipe(clean());
})

gulp.task("alternative-copy", function () {
	gulp
		.src(paths.alternative.src)
		.pipe(gulp.dest(paths.alternative.dest));
})

gulp.task("build", ["js", "sass", "lib-js", "lib-css", "assets", "components", "data", "html", "rootfiles"]);

gulp.task("default", ["build", "watch", "webserver"]);

gulp.task("cordova", ["build", "mobile-clean", "mobile-copy"]);

gulp.task("alternative", ["build", "alternative-clean", "alternative-copy"]);

gulp.task("cleanall", ["clean", "mobile-clean", "alternative-clean"]);