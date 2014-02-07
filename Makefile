
test-cov:
	@NODE_ENV=test node --harmony ./node_modules/istanbul/lib/cli.js \
		cover ./node_modules/mocha/bin/_mocha -- -d --recursive -R spec
		node --harmony ./node_modules/istanbul/lib/cli.js check-coverage --statements 100 --functions 100 --branches 100 --lines 100

test-cov-html:
	./node_modules/istanbul/lib/cli.js report html
	@NODE_ENV=test node --harmony ./node_modules/istanbul/lib/cli.js \
		cover ./node_modules/mocha/bin/_mocha -- --recursive -u exports -R spec
		python -m SimpleHTTPServer 3000

test:
	@NODE_ENV=test node --harmony ./node_modules/mocha/bin/_mocha --recursive

.PHONY: test test-cov
