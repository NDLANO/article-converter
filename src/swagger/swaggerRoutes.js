module.exports = {
  getRawArticle: {
    get: {
      summary: 'Raw endpoint that redirects to the JSON endpoint',
      parameters: [
        {
          in: 'path',
          name: 'language',
          description: 'The ISO 639-1 language code describing language.',
          required: true,
          type: 'string',
        },
        {
          in: 'path',
          name: 'article_id',
          description: 'Id of the article that is to be fecthed.',
          required: true,
          minimum: 1,
          type: 'integer',
          format: 'int64',
        },
      ],
      responses: {
        '302': {
          description:
            '302 Found. Redirecting to /article-converter/json/{language}/{article_id}',
        },
      },
    },
  },
  getJsonArticle: {
    get: {
      summary:
        'Returns an extended and transformed json structure based on the one provided by article-api',
      produces: ['application/json'],
      parameters: [
        {
          in: 'path',
          name: 'language',
          description: 'The ISO 639-1 language code describing language.',
          required: true,
          type: 'string',
        },
        {
          in: 'path',
          name: 'article_id',
          description: 'Id of the article that is to be fecthed.',
          required: true,
          minimum: 1,
          type: 'integer',
          format: 'int64',
        },
        {
          $ref: '#/parameters/authorizationHeader',
        },
      ],
      security: [
        {
          oauth2: [],
        },
      ],
      responses: {
        '200': {
          description: 'OK',
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: 'The article ID.',
                example: 1,
              },
              oldNdlaUrl: {
                type: 'string',
                description: 'The URL to the node from the old application.',
                example: '//red.ndla.no/node/179373',
              },
              revision: {
                type: 'integer',
                description: 'The article version number.',
                example: 5,
              },
              title: {
                type: 'string',
                description: 'The article title.',
                example: 'Foo article',
              },
              content: {
                type: 'string',
                description: 'The article HTML extended content.',
                example: '<section>Article HTML content</section>',
              },
              copyright: {
                $ref: '#/definitions/copyright',
              },
              tags: {
                type: 'array',
                description: 'Article tags.',
                items: {
                  type: 'string',
                  example: ['Foo', 'Bar'],
                },
              },
              requiredLibraries: {
                type: 'array',
                description: 'Required libraries.',
                items: {
                  type: 'string',
                  example: ['Foo', 'Bar'],
                },
              },
              metaImage: {
                type: 'object',
                description: 'Meta image attributes.',
                properties: {
                  url: {
                    type: 'string',
                    description: 'Meta image URL.',
                  },
                  language: {
                    type: 'string',
                    description: 'Meta image language.',
                    example: 'en',
                  },
                },
              },
              introduction: {
                type: 'string',
                description: 'Article introduction.',
                example: 'Introduction to FooBar',
              },
              metaDescription: {
                type: 'string',
                description: 'Meta description.',
                example: 'Meta FooBar',
              },
              created: {
                type: 'string',
                description: 'Created date.',
                example: '2018-01-19 11:52:38 UTC',
              },
              updated: {
                type: 'string',
                description: 'Updated date.',
                example: '2018-01-24 14:18:56 UTC',
              },
              updatedBy: {
                type: 'string',
                description: 'Updated by.',
                example: 'NDLA User',
              },
              articleType: {
                type: 'string',
                description: 'The Article type.',
                example: 'standard',
              },
              supportedLanguages: {
                type: 'array',
                description: 'Supported Article languages.',
                items: {
                  type: 'string',
                  example: ['nb', 'nb', 'en'],
                },
              },
              metaData: {
                type: 'object',
                description: 'Meta data attributes.',
                properties: {
                  images: {
                    type: 'array',
                    description: 'Array of meta data images.',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          description: 'Meta image title',
                          example: 'Foo',
                        },
                        altText: {
                          type: 'string',
                          description: 'Meta image alt text',
                          example: 'Bar',
                        },
                        copyright: {
                          $ref: '#/definitions/copyright',
                        },
                        src: {
                          type: 'string',
                          description: 'Meta image src',
                          example:
                            'https://test.api.ndla.no/image-api/raw/tacf8f02.jpg',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
        },
        '404': {
          description: 'Not found',
        },
      },
    },
  },
  getHtmlArticle: {
    get: {
      summary:
        'Returns the content attribute from article-api transformed to plain html and wrapped in a HTML document (useful for testing)',
      produces: ['text/html'],
      parameters: [
        {
          in: 'path',
          name: 'language',
          description: 'The ISO 639-1 language code describing language.',
          required: true,
          type: 'string',
        },
        {
          in: 'path',
          name: 'article_id',
          description: 'Id of the article that is to be fecthed.',
          required: true,
          minimum: 1,
          type: 'integer',
          format: 'int64',
        },
        {
          $ref: '#/parameters/authorizationHeader',
        },
      ],
      security: [
        {
          oauth2: [],
        },
      ],
      responses: {
        '200': {
          description: 'OK',
        },
        '401': {
          description: 'Unauthorized',
        },
        '404': {
          description: 'Not found',
        },
      },
    },
  },
  getMetaData: {
    get: {
      summary: 'Returns meta data of embeds',
      produces: ['application/json'],
      parameters: [
        {
          in: 'path',
          name: 'language',
          description: 'The ISO 639-1 language code describing language.',
          required: true,
          type: 'string',
        },
        {
          $ref: '#/parameters/authorizationHeader',
        },
        {
          in: 'query',
          name: 'embed',
          description: 'Embed tags to fetch meta data for',
          required: true,
          type: 'string',
        },
      ],
      security: [
        {
          oauth2: [],
        },
      ],
      responses: {
        '200': {
          description: 'OK',
          schema: {
            type: 'object',
            properties: {
              images: {
                type: 'array',
                description: 'Array of meta data images.',
                items: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                      description: 'Meta image title',
                      example: 'Foo',
                    },
                    altText: {
                      type: 'string',
                      description: 'Meta image alt text',
                      example: 'Bar',
                    },
                    copyright: {
                      $ref: '#/definitions/copyright',
                    },
                    src: {
                      type: 'string',
                      description: 'Meta image src',
                      example:
                        'https://test.api.ndla.no/image-api/raw/tacf8f02.jpg',
                    },
                  },
                },
              },
              h5ps: {
                type: 'array',
                description: 'Array of meta data h5ps',
                items: {
                  type: 'object',
                  description: 'H5P object',
                  properties: {
                    h5p: {
                      $ref: '#/definitions/h5p',
                    },
                    assets: {
                      type: 'array',
                      description: 'Array of assets used in the h5p',
                      items: {
                        $ref: '#/definitions/h5p',
                      },
                    },
                    h5pLibrary: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          description: 'H5P library name',
                          example: 'Foo',
                        },
                        majorVersion: {
                          type: 'integer',
                          description: 'Major version',
                          example: 1,
                        },
                        mainorVersion: {
                          type: 'integer',
                          description: 'Minor version',
                          example: 7,
                        },
                      },
                    },
                  },
                },
              },
              brightcoves: {
                type: 'array',
                description: 'Array of meta data brightcove videos',
                items: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                      description: 'Video title',
                      example: 'Foo',
                    },
                    description: {
                      type: 'string',
                      description: 'Video description',
                      example: 'Foo',
                    },
                    copyright: {
                      $ref: '#/definitions/copyright',
                    },
                    cover: {
                      type: 'string',
                      description: 'Cover image url',
                      example:
                        'https://test.api.ndla.no/image-api/raw/tacf8f02.jpg',
                    },
                    src: {
                      type: 'string',
                      description: 'Video source url',
                      example:
                        'https://players.brightcove.net/4806596774001/BkLm8fT_default/index.html?videoId=6206610074001',
                    },
                    iframe: {
                      type: 'object',
                      properties: {
                        src: {
                          type: 'string',
                          description: 'Iframe source url',
                          example:
                            'https://players.brightcove.net/4806596774001/BkLm8fT_default/index.html?videoId=6206610074001',
                        },
                        height: {
                          type: 'integer',
                          description: 'Iframe height',
                          example: 720,
                        },
                        width: {
                          type: 'integer',
                          description: 'Iframe width',
                          example: 1280,
                        },
                      },
                    },
                    uploadDate: {
                      type: 'string',
                      description: 'Upload date',
                      example: '2020-11-03T07:49:16.299Z',
                    },
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
        },
        '404': {
          description: 'Not found',
        },
      },
    },
  },
  postJsonTransformArticle: {
    post: {
      summary:
        'Returns an extended and transformed json structure based on the one provided by article-api',
      produces: ['application/json'],
      parameters: [
        {
          in: 'path',
          name: 'language',
          description: 'The ISO 639-1 language code describing language.',
          required: true,
          type: 'string',
        },
        {
          in: 'body',
          name: 'article',
          description: 'the article to transform',
          schema: {
            $ref: '#/definitions/bodyArticle',
          },
        },
        {
          $ref: '#/parameters/authorizationHeader',
        },
      ],
      consumes: ['application/json'],
      security: [
        {
          oauth2: [],
        },
      ],
      responses: {
        '200': {
          description: 'OK',
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                description: 'The article ID.',
                example: 1,
              },
              oldNdlaUrl: {
                type: 'string',
                description: 'The URL to the node from the old application.',
                example: '//red.ndla.no/node/179373',
              },
              revision: {
                type: 'integer',
                description: 'The article version number.',
                example: 5,
              },
              title: {
                type: 'string',
                description: 'The article title.',
                example: 'Foo article',
              },
              content: {
                type: 'string',
                description: 'The article HTML extended content.',
                example: '<section>Article HTML content</section>',
              },
              copyright: {
                $ref: '#/definitions/copyright',
              },
              tags: {
                type: 'array',
                description: 'Article tags.',
                items: {
                  type: 'string',
                  example: ['Foo', 'Bar'],
                },
              },
              requiredLibraries: {
                type: 'array',
                description: 'Required libraries.',
                items: {
                  type: 'string',
                  example: ['Foo', 'Bar'],
                },
              },
              metaImage: {
                type: 'object',
                description: 'Meta image attributes.',
                properties: {
                  url: {
                    type: 'string',
                    description: 'Meta image URL.',
                  },
                  alt: {
                    type: 'string',
                    description: 'Meta image URL.',
                  },
                  language: {
                    type: 'string',
                    description: 'Meta image language.',
                    example: 'en',
                  },
                },
              },
              introduction: {
                type: 'string',
                description: 'Article introduction.',
                example: 'Introduction to FooBar',
              },
              metaDescription: {
                type: 'string',
                description: 'Meta description.',
                example: 'Meta FooBar',
              },
              created: {
                type: 'string',
                description: 'Created date.',
                example: '2018-01-19 11:52:38 UTC',
              },
              updated: {
                type: 'string',
                description: 'Updated date.',
                example: '2018-01-24 14:18:56 UTC',
              },
              updatedBy: {
                type: 'string',
                description: 'Updated by.',
                example: 'NDLA User',
              },
              articleType: {
                type: 'string',
                description: 'The Article type.',
                example: 'standard',
              },
              supportedLanguages: {
                type: 'array',
                description: 'Supported Article languages.',
                items: {
                  type: 'string',
                  example: ['nb', 'nb', 'en'],
                },
              },
              metaData: {
                type: 'object',
                description: 'Meta data attributes.',
                properties: {
                  images: {
                    type: 'array',
                    description: 'Array of meta data images.',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          description: 'Meta image title',
                          example: 'Foo',
                        },
                        altText: {
                          type: 'string',
                          description: 'Meta image alt text',
                          example: 'Bar',
                        },
                        copyright: {
                          $ref: '#/definitions/copyright',
                        },
                        src: {
                          type: 'string',
                          description: 'Meta image src',
                          example:
                            'https://test.api.ndla.no/image-api/raw/tacf8f02.jpg',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
        },
      },
    },
  },
};
