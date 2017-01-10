#!/bin/bash

# config
BRANCH=$(git rev-parse --abbrev-ref HEAD)
VERSION=$(node --eval "console.log(require('./package.json').version);")
NAME=$(node --eval "console.log(require('./package.json').name);")

# build and test
npm run test || exit 1

# checkout temp branch for release
git checkout -b gh-release

# run build
# guessing this was only to copy chart JSON to dist,
# which is now taken care of by npm run build,
# and not to copy them site/build/js/charts (which it also did)
# grunt publish

# force add files
git add dist -f

# commit changes with a versioned commit message
git commit -m "build $VERSION"

# push commit so it exists on GitHub when we run gh-release
git push origin gh-release

# create a ZIP archive of the dist files
zip -r $NAME-v$VERSION.zip dist

# run gh-release to create the tag and push release to github
gh-release --assets $NAME-v$VERSION.zip

# checkout prev branch and delete release branch locally and on GitHub
git checkout $BRANCH
git branch -D gh-release
git push origin :gh-release

# re-run build in prevgit  branch before publishing
# again, this should not be needed b/c handled by npm run build
# grunt publish

# publish release on NPM
# TODO: only publish if gh-release was successful, currently
# this fails often enough that we should do this manually
# npm publish
