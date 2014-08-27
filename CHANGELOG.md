
# Changelog

## v0.2.4
* Added explicit `Content-Type: application/json` header.

## v0.2.2
* Switched HTTP library to [superagent](https://github.com/visionmedia/superagent)

## v0.2.1
* Removed unnecessary MP-Public-Key header.

## v0.2.0
* Updated to use [promises](https://github.com/petkaantonov/bluebird).
* Removed invoice initialization via `init`. Invoices are now initalized directly on instantiation.