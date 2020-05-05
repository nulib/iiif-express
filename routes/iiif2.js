const AWS     = require('aws-sdk');
const IIIF    = require('iiif-processor');
const express = require('express');
const router  = express.Router();
const url     = require('url');

const s3Endpoint = process.env.S3_ENDPOINT;
const tiffBucket = process.env.TIFF_BUCKET;

function s3Object(id) {
  let s3 = new AWS.S3({ endpoint: s3Endpoint, s3ForcePathStyle: true });
  let path = id.match(/.{1,2}/g).join('/');
  return s3.getObject({ 
    Bucket: tiffBucket, 
    Key: `${path}-pyramid.tif`
  }).createReadStream();
}

const dimensions = async (id) => {
  let s3 = new AWS.S3({ endpoint: s3Endpoint, s3ForcePathStyle: true });
  let path = id.match(/.{1,2}/g).join('/');
  const obj = await s3.headObject({
    Bucket: tiffBucket,
    Key: `${path}-pyramid.tif`
  }).promise()
  if (obj.Metadata.width && obj.Metadata.height) {
    return {
      width: parseInt(obj.Metadata.width, 10),
      height: parseInt(obj.Metadata.height, 10)
    }
  }
  return null;
}

function makeResource(req, res) {
  req.params.id = req.params.id.replace(/(?:\/|%2F)/gi, '');
  let baseUrl = url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.baseUrl
  });
  [req.params.quality, req.params.format] = /^(.+)\.(.+)$/.exec(req.params.filename).slice(1,3);
  let params = { ...req.params, baseUrl }
  let s3Handler = id => {
    return s3Object(id).on('error', (err, _resp) => { 
      console.log('SWALLOWING UNCATCHABLE S3 ERROR', `${err.statusCode} / ${err.code} / ${err.message}`);
    });
  };
  return new IIIF.Processor(params, s3Handler, dimensions);
}

router.use((req, res, next) => {
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Cookie, Authorization, X-API-Token, X-OpenAM-SSO-Token');
  res.set('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Origin', req.get('Origin'));
  next();
});

router.options(/^.*$/, function(req, res, _next) {
  res.status(204).send('')
});

router.get('/', function(_req, res, _next) {
  res.status(200).send('OK');
});

router.get('/:id/:region?/:size?/:rotation?/:filename?', function(req, res, _next) {
  let errorHandler = (err) => {
    let statusCode = err.statusCode || 502;
    res.status(statusCode).send(err.message);
  }

  if (req.params.filename == null) {
    req.params.filename = 'info.json';
  }
  try {
    makeResource(req, res).execute()
    .then((result) => {
      res.set('Content-Type', result.contentType);
      res.status(200).send(result.body)
    })
    .catch(errorHandler)
  } catch(err) {
    errorHandler(err);
  }
})

module.exports = router;
