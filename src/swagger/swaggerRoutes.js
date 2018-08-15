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
