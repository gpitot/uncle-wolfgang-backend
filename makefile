TASK_RUNNER = ./node_modules/.bin/gulp
OUT_DIR = temp
BUILD_DIR = build
KEY_DIR = keys
NODE_VERSION= 8.11.1
REGISTRY = docker-registry.mi9cdn.com:5000
APP_IMAGE = $(REGISTRY)/$(PROJECT)/$(PROJECT):$(VERSION)
BUILD_IMAGE = $(REGISTRY)/nec-network/network-ci:$(NODE_VERSION)
DEPLOY_IMAGE = docker-registry.mi9cdn.com:5000/mi9-docker-deploy:latest
DEPLOY_STRAT = deploy
AMI_STACK = 64bit Amazon Linux 2018.03 v4.8.1 running Node.js
WHERE = test


deploy: deploy-new
.PHONY: deploy

deploy-new:
	mkdir -p $(PWD)/$(OUT_DIR)/beanstalk
	mkdir -p $(PWD)/$(OUT_DIR)/$(KEY_DIR)
	cp $(PWD)/$(KEY_DIR)/$(AWS_KEYS) $(PWD)/$(OUT_DIR)/$(KEY_DIR)/$(AWS_KEYS)
	cp $(PWD)/beanstalk/* $(PWD)/$(OUT_DIR)/beanstalk
	docker run -t -v $(PWD)/$(OUT_DIR):/app/artifacts -w /app $(DEPLOY_IMAGE) \
		sh -c "make deploy \
			DEPLOY_STRAT=$(DEPLOY_STRAT) \
			PROJECT=$(PROJECT) \
			AMI_STACK=\"$(AMI_STACK)\" \
			AWS_KEY_FILE=artifacts/$(KEY_DIR)/$(AWS_KEYS) \
			ENVIRONMENT=$(WHERE) \
			BEANSTALK_CONFIG_FILE=artifacts/beanstalk/$(WHERE).json \
			ARTIFACT=artifacts/$(PROJECT)-$(VERSION).zip"
.PHONY: deploy-new


# Remove all build artifacts.
#]
# Example:
#   make clean
clean:
	sudo rm -rf $(OUT_DIR)
	sudo rm -rf $(KEY_DIR)
	sudo rm -rf $(BUILD_DIR)
	sudo rm -rf tmp
.PHONY: clean

deps:
	docker run \
	  --rm -t \
	  -v $(PWD):/opt/app \
	  -w /opt/app \
	  node:$(NODE_VERSION) \
	  sh -c "git config --global url.'https://'.insteadOf git:// && rm -rf node_modules && npm --no-color --quiet --production i && ls node_modules -1 > produles.txt && npm --no-color --quiet i"
    sudo chown -R $(shell whoami):$(shell whoami) node_modules
.PHONY: deps

# Build package.
#
# Args:
#   VERSION: defines the application version label for elasticbeanstalk
#   PROJECT: loads different website configs for mi9 network sites
#
# Example:
#   make package PROJECT=nl-beauty VERSION=githash
package: clean deps
	docker run -t \
      -e APP_ENV=prod \
      -e NODE_ENV=production \
      -v $(PWD):/opt/app \
      -w /opt/app \
      node:$(NODE_VERSION) \
      sh -c "PATH=$$PATH:/opt/app/node_modules/.bin babel ./src --out-dir $(BUILD_DIR)/src && PATH=$$PATH:/opt/app/node_modules/.bin gulp --no-color --app_version=$(VERSION) --site=$(PROJECT)" 
	sudo chown -R $(shell whoami) $(OUT_DIR)
	sudo chown -R $(shell whoami) $(BUILD_DIR)
	chmod -R 755 $(OUT_DIR)/*.zip
.PHONY: package