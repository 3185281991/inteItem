const { defineConfig } = require("@vue/cli-service");
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    devServer: {
      open: true,
      host: "localhost",
      port: 86,
      proxy: {
        "/apix": {
          target: "http://localhost:9999", //请求对象
          ws: true, //代理websocked
          changeOrigin: true,
          secure: false, //target是否为https接口
          pathRewrite: {
            "^/apix": "", //更改请求URL
          },
        },
        "/hxh": {
          target: "https://api.vvhan.com/api", //请求对象
          ws: true, //代理websocked
          changeOrigin: true,
          secure: true, //target是否为https接口
          pathRewrite: {
            "^/hxh": "", //更改请求URL
          },
        },
        "/freex": {
          target: "https://v.api.aa1.cn/api", //请求对象
          ws: true, //代理websocked
          changeOrigin: true,
          secure: true,
          pathRewrite: {
            "^/freex": "", //更改请求URL
          },
        },
      },
    },
    plugins: [
      new CompressionPlugin({
        algorithm: "gzip", // 使用gzip压缩
        test: /\.js$|\.html$|\.css$/, // 匹配文件名
        minRatio: 0.8, // 压缩率小于1才会压缩
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false, // 是否删除未压缩的源文件，谨慎设置，如果希望提供非gzip的资源，可不设置或者设置为false（比如删除打包后的gz后还可以加载到原始资源文件）
      }),
      new BundleAnalyzerPlugin(),
    ],
  },
});
