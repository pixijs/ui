# How to contribute

It is essential to the development of PixiUI that the community is empowered
to make changes and get them into the library. Here are some guidelines to make
that process silky smooth for all involved.

## Reporting issues

To report a bug, request a feature, or even ask a question, make use of the GitHub Issues
section for [PixiUI][issues]. When submitting an issue please take the following steps:

1. **Search for existing issues.** Your question or bug may have already been answered or fixed,
   be sure to search the issues first before putting in a duplicate issue.

2. **Create an isolated and reproducible test case.** If you are reporting a bug, make sure you
   also have a minimal, runnable, code example that reproduces the problem you have.

3. **Include a live example.** After narrowing your code down to only the problem areas, make use
   of [jsFiddle][fiddle], [jsBin][jsbin], or a link to your live site so that we can view a live example of the problem.

4. **Share as much information as possible.** Include browser version affected, your OS, version of
   the library, steps to reproduce, etc. "X isn't working!!!1!" will probably just be closed.

> NOTE: if you are looking for support, please visit the [FAQ][faq], [forums][forums], [wiki][wiki]
> or go through the [tutorials][tutorials].

## Contributing Changes

### Setting Up

To setup for making changes you will need to take a few steps, we've outlined them below:

1. Ensure you have node.js installed. You can download node.js from [nodejs.org][node]. Because
   PixiUI uses modern JS features, you will need a modern version of node. v4+ is recommended.

2. Fork the **[ui][ui]** repository, if you are unsure how to do this GitHub has a guides
   for the [command line][fork-cli] and for the [GitHub Client][fork-gui].

3. Next, run `npm install` from within your clone of your fork. That will install dependencies
   necessary to build PixiUI.

### Making a Change

Once you have node.js, the repository, and have installed dependencies are you almost ready to make your
change. The only other thing before you start is to checkout the correct branch. Which branch you should
make your change to (and send a PR to) depends on the type of change you are making.

Here is our branch breakdown:

-   `main` - Make your change to the `main` branch if it is an _urgent_ hotfix.
-   `dev` - Make your change to `dev` if it is a _non-urgent_ bugfix or a backwards-compatible feature.
-   `v4.x`, `v5.3.x`, `v5.2.x`, etc - Make your change to legacy branches to patch old releases if your fix _only_ applies to older versions.

Your change should be made directly to the branch in your fork, or to a branch in your fork made off of
one of the above branches.

### Submitting Your Change

After you have made and tested your change, commit and push it to your fork. Then, open a Pull Request
from your fork to the main **ui** repository on the branch you used in the `Making a Change` section of this document.

## Quickie Code Style Guide

-   Use 4 spaces for tabs, never tab characters.
-   No trailing whitespace, blank lines should have no whitespace.
-   Always favor strict equals `===` unless you _need_ to use type coercion.
-   Follow conventions already in the code, and listen to eslint.
-   **Ensure changes are eslint validated.** After making a change be sure to run the build process
    to ensure that you didn't break anything. You can do this with `npm test` which will run
    eslint, rebuild, then run the test suite.

## Contributor Code of Conduct

[Code of Conduct](CODE_OF_CONDUCT.md) is adapted from [Contributor Covenant, version 1.4](http://contributor-covenant.org/version/1/4)
