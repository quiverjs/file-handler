"use strict";
Object.defineProperties(exports, {
  listDirPathHandler: {get: function() {
      return listDirPathHandler;
    }},
  makeListDirPathHandler: {get: function() {
      return makeListDirPathHandler;
    }},
  __esModule: {value: true}
});
var $__quiver_45_core_47_component__,
    $__quiver_45_core_47_promise__,
    $__quiver_45_core_47_component__,
    $__fs__,
    $__file_45_stats__,
    $__file_45_watch__;
var simpleHandler = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}).simpleHandler;
var $__1 = ($__quiver_45_core_47_promise__ = require("quiver-core/promise"), $__quiver_45_core_47_promise__ && $__quiver_45_core_47_promise__.__esModule && $__quiver_45_core_47_promise__ || {default: $__quiver_45_core_47_promise__}),
    reject = $__1.reject,
    promisify = $__1.promisify;
var $__2 = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}),
    simpleHandlerBuilder = $__2.simpleHandlerBuilder,
    inputHandlerMiddleware = $__2.inputHandlerMiddleware,
    loadStreamHandler = $__2.loadStreamHandler;
var fs = ($__fs__ = require("fs"), $__fs__ && $__fs__.__esModule && $__fs__ || {default: $__fs__}).default;
var readdir = fs.readdir;
var fileStatsFilter = ($__file_45_stats__ = require("./file-stats"), $__file_45_stats__ && $__file_45_stats__.__esModule && $__file_45_stats__ || {default: $__file_45_stats__}).fileStatsFilter;
var watchFileMiddleware = ($__file_45_watch__ = require("./file-watch"), $__file_45_watch__ && $__file_45_watch__.__esModule && $__file_45_watch__ || {default: $__file_45_watch__}).watchFileMiddleware;
var readDirectory = promisify(readdir);
var listDirPathHandler = simpleHandlerBuilder((function(config) {
  var $__8;
  var $__7 = config,
      fileEvents = $__7.fileEvents,
      cacheInterval = ($__8 = $__7.cacheInterval) === void 0 ? 300 * 1000 : $__8;
  var dirCache = {};
  setInterval((function() {
    dirCache = {};
  }), cacheInterval);
  var removeCache = (function(filePath, fileStats) {
    if (fileStats.isDirectory())
      dirCache[filePath] = null;
  });
  fileEvents.on('change', removeCache);
  fileEvents.on('addDir', removeCache);
  fileEvents.on('unlinkDir', removeCache);
  return (function(args) {
    var $__9 = args,
        filePath = $__9.filePath,
        fileStats = $__9.fileStats;
    if (!fileStats.isDirectory)
      return reject(error(404, 'path is not a directory'));
    var subpaths = dirCache[filePath];
    if (subpaths)
      return resolve({subpaths: subpaths});
    return readDirectory(filePath).then((function(subpaths) {
      dirCache[filePath] = subpaths;
      return {subpaths: subpaths};
    }));
  });
}), 'void', 'json', {name: 'Quiver List Directory Path Handler'}).middleware(watchFileMiddleware).middleware(fileStatsFilter);
var makeListDirPathHandler = listDirPathHandler.factory();
