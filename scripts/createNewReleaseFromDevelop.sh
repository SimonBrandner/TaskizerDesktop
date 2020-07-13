#!/bin/bash
version=$1

git checkout -b $version 
git merge develop
git push --set-upstream origin $version

git checkout stable 
git merge $version
git push

git checkout develop
