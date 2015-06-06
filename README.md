# Mosaic

## Links
- [Trello](https://trello.com/b/p5x3xBDE/new-tab-extension)
- [GitFlow rules](http://nvie.com/posts/a-successful-git-branching-model/)

## Conventions

### Versions
We follow [SemVer](http://semver.org).

### Commit Messages
Format your commit messages like so: `category: message`

For example: `sidebar: added minification to scripts and styles`

If you need to explain more in-depth, you can use the commit description.

### GitFlow
> Simplified from [here](http://nvie.com/posts/a-successful-git-branching-model/)

#### Main branches

##### `master` branch
- This is where all the production-ready code goes.

##### `develop` branch
- This is where all the latest development code comes together. 
- When the code in this branch is stable, the code is then merged into the next `release` branch.

#### Supporting branches

##### `feature` branch
May branch from: `develop`

Must merge back into: `develop`

Branch naming convention: anything except `master`, `develop`, `release-*`, `hotfix-*`.

- Any feature that is made is in this branch. 
- Only merge FINISHED features back into the `develop` branch. 
	- This means any unfinished features are not to be merged back into the `develop` branch. 

###### Creating a `feature` branch *(via Sourcetree)*
1. Switch to `develop` branch.
2. Click "GitFlow" button.
3. Create a new feature.
4. Name it. 
5. Done. 

###### Finishing a `feature` branch *(via Sourcetree)*
1. Switch to `develop` branch.
2. Press the "Merge" button.
3. *[WIP]*

##### `release` branch
May branch from: `develop`

Must merge back into: `develop` and `master`

Branch naming convention: `release-*`

- `release` branches are used for preparation for the next release, big OR small.

###### Creating a `release` branch *(via Sourcetree)*
1. 

###### Finishing a `release` branch *(via Sourcetree)*
1. 

##### `hotfix` branch
May branch from: `master`

Must merge back into: `develop` and `master`

Branch naming convention: `hotfix-*`

- `hotfix` branches are used for acting on bugs found in the previous version.
- These are priority and merge back into `master` and `develop` branches. 
- However, when a `release` branch already exists, **the `hotfix` needs to be merged into the `release` branch**. Back-merging the bugfix into the `release` branch will eventually result in the bugfix being merged into `develop` too, when the `release` branch is finished.

###### Creating a `hotfix` branch *(via Sourcetree)*
1. 

###### Finishing a `hotfix` branch *(via Sourcetree)*
1. 

