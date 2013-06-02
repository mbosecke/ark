Ark
===

Ark is a modular javascript framework.


Building Ark
----------------------------

First, clone a copy of the main ark git repo by running:

```bash
git clone git://github.com/mbosecke/ark.git
```

Install git and Node.js (instructions vary depending on OS).

Install the grunt-cli package so that you will have the correct version of grunt available from any project that needs it. This should be done as a global install:

```bash
npm install -g grunt-cli
```

Enter the ark directory and install the Node dependencies, this time *without* specifying a global install:

```bash
cd ark && npm install
```

Make sure you have `grunt` installed by testing:

```bash
grunt -version
```

Then, to get a complete, minified (w/ Uglify.js), linted (w/ JSHint) version of Ark, type the following:

```bash
grunt
```

The built version of Ark will be put in the `build/` subdirectory, along with the minified copy.
