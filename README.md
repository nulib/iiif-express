# iiif-express

A Node Express wrapper for [`node-iiif`](https://github.com/samvera-labs/node-iiif)

## Description

This is a simple Node Express application that provides an IIIF Image API v2.1 interface to the `node-iiif` module. It is purely an image server; it does not provide any authentication or authorization functions.

## Running Locally/Development

### Install dependencies

```bash
npm install
```

### Configuration

There are several environment variables that affect how the server runs:

* `TIFF_BUCKET` – The TIFF bucket where the pyramid TIFFs are stored (required)
* `S3_ENDPOINT` – The base URL of the S3 server where the pyramid TIFFs are stored (default: The regular AWS S3 endpoint for the configured region)
* `AWS_*` – Profile, key, secret, and region information for accessing the S3 bucket. (See [AWS SDK environment variables](https://docs.aws.amazon.com/sdkref/latest/guide/environment-variables.html) for details.)
* `SSL_CERT` and `SSL_KEY` – SSL cert/key files to use for running over `https`.

### Starting the Server

```bash
npm run-script start
```
