# Build configuration
# -------------------

APP_NAME = `node -p "require('./package.json').name"`
GIT_BRANCH =`git rev-parse --abbrev-ref HEAD`
GIT_REVISION = `git rev-parse HEAD`

# Introspection targets
# ---------------------

.PHONY: help
help: header targets

.PHONY: header
header:
	@printf "\n\033[34mEnvironment\033[0m\n"
	@printf "\033[34m---------------------------------------------------------------\033[0m\n"
	@printf "\033[33m%-23s\033[0m" "APP_NAME"
	@printf "\033[35m%s\033[0m" $(APP_NAME)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "GIT_BRANCH"
	@printf "\033[35m%s\033[0m" $(GIT_BRANCH)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "GIT_REVISION"
	@printf "\033[35m%s\033[0m" $(GIT_REVISION)
	@echo ""

.PHONY: targets
targets:
	@printf "\n\033[34mTargets\033[0m\n"
	@printf "\033[34m---------------------------------------------------------------\033[0m\n"
	@perl -nle'print $& if m{^[a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

# Development targets
# -------------------

.PHONY: compile
compile: ## Run TypeScript compiler
	pnpm tsc

.PHONY: deps
deps: ## Install all dependencies
	pnpm install

.PHONY: format
format: ## Format typescript files
	pnpm prettier --write '{src,test}/**/*.{js,mjs,mts,ts}'

.PHONY: lint
lint: ## Lint code
	pnpm eslint '{src,test}/**/*.{js,mjs,mts,ts}'

.PHONY: lint-fix
lint-fix: ## Lint code w/ fixes
	pnpm eslint --fix '{src,test}/**/*.{js,mjs,mts,ts}'

.PHONY: test
test: ## Test code
	pnpm vitest --dir test --run

.PHONY: test-watch
test-watch: ## Test code with watch
	pnpm vitest --dir test
