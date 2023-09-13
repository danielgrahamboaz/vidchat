#!/bin/sh

# Set the name of the branch to push
BRANCH_NAME="master"

# Set the names of the two remote repositories
REMOTE_1="origin"
REMOTE_2="trail"

# Push the branch to the first remote repository
git push $REMOTE_1 $BRANCH_NAME

# Push the branch to the second remote repository
git push $REMOTE_2 $BRANCH_NAME
