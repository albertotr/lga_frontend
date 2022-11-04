// ggrsul.com.br
module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === "production" ? "/lga" : "/",
};

// lga.atr.dev.br
// module.exports = {
//   runtimeCompiler: true,
//   productionSourceMap: false,
//   publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
// };
