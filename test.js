'use strict';

const lambda = require('./index');
let event = { 'alias':'debug' };
let context = null
let callback = (err) => {
  console.log(err)
}

lambda.handler(event, context, callback);