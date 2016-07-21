const environment = {
  development: {
    isProduction: false,
  },
  production: {
    isProduction: true,
  },
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.CONTENT_FRONTEND_HOST || 'localhost',
  port: process.env.CONTENT_FRONTEND_PORT || '3000',
  ndlaContentApiUrl: process.env.NDLA_CONTENT_API_URL || 'http://api.test.ndla.no/content/',

  app: {
    title: 'NDLA Læringsstier',
    head: {
      meta: [
        { name: 'description', content: 'NDLA Læringsstier meta description' },
        { property: 'og:site_name', content: 'NDLA Læringsstier' },
      ],
    },
  },

}, environment);
