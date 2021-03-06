/*
  This is a patched version of the uglify-js@1.2.6 module.
  Added a fix for the potential Regular Expression Denial of Service
  security vulnerability: https://nodesecurity.io/advisories/48.
  The fix was copied from the commit in the UglifyJS2 repository:
  https://github.com/mishoo/UglifyJS2/commit/63d35f8f6db6d90d6142132d2d5f0bd5d3d698aa
  (see details in the issue: https://github.com/DevExpress/testcafe-legacy-api/issues/26).

  The Incorrect Handling of Non-Boolean Comparisons During Minification security
  vulnerability (https://nodesecurity.io/advisories/39) is not actual for 1.x.x versions.
 */

//convienence function(src, [options]);
function uglify(orig_code, options){
  options || (options = {});
  var jsp = uglify.parser;
  var pro = uglify.uglify;

  var ast = jsp.parse(orig_code, options.strict_semicolons); // parse code and get the initial AST
  ast = pro.ast_mangle(ast, options.mangle_options); // get a new AST with mangled names
  ast = pro.ast_squeeze(ast, options.squeeze_options); // get an AST with compression optimizations
  var final_code = pro.gen_code(ast, options.gen_options); // compressed code here
  return final_code;
};

uglify.parser = require("./lib/parse-js");
uglify.uglify = require("./lib/process");
uglify.consolidator = require("./lib/consolidator");

module.exports = uglify
