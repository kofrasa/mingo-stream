
all: clean test build

test:
	@tape test/*.js

clean:
	@rm -fr dist/*

build:
	@mkdir -p dist/
	@uglifyjs mingo-stream.js -c -m -o dist/mingo-stream.min.js --source-map dist/mingo-stream.min.map
	@gzip -kf dist/mingo-stream.min.js
	@echo "\033[0;32mBUILD SUCCEEDED"

.PHONY: clean test build
