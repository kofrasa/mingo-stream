
UGLIFY = node_modules/.bin/uglifyjs

all: clean test build

test:
	@tape test/*.js

clean:
	@rm -fr dist/*

build:
	@mkdir -p dist/
	@cp index.js dist/mingo-stream.js
	@${UGLIFY} index.js -c -m -o dist/mingo-stream.min.js --source-map dist/mingo-stream.min.map
	@echo "\033[0;32mBUILD SUCCEEDED"

.PHONY: clean test build
