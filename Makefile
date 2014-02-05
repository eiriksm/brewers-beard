
test-cov:
	@NODE_ENV=test node --harmony ./node_modules/istanbul/lib/cli.js \
		cover ./node_modules/mocha/bin/_mocha -- -u exports -R spec

test:
	@NODE_ENV=test node --harmony ./node_modules/mocha/bin/_mocha

.PHONY: test test-cov
