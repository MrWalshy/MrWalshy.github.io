#!/bin/sh
node ./frontend/tool/blogger.js  ./frontend/blog/config.json
cd frontend && npm run build && cd ..