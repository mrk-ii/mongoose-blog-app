'use strict';

// const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost/blog-app';

exports.DATABASE_URL = process.env.DATABASE_URL ||
                        global.DATABASE_URL ||
                        'mongodb://localhost/mongoose-blog-app';


exports.PORT = process.env.PORT || 8080; 