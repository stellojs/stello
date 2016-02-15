# stello

> Like map (and reduce) for [Trello](https://trello.com/) cards.


## Installation

Install from npm:

```
npm install -g stello
```


## Usage (cli)

Kick everything off:

```shell
stello init
```

You now have a stellorc config file in your working directory as well as some
source templates and template helpers.

We're using [Handlebars][hbs] as our templating engine. Since Trello uses
markdown for many things stello pre-registers a `markdown` helper for you which
will convert markdown to html.

After running `stello init` you will notice a number of `index-*.hbs` files in
the new `./src` folder. These are your template files which Trello cards, lists,
and boards get mapped through. The generated files will be given a name that
includes the item's position and sluggified name. By default we generate `html`
files but if a different extension is preffered, e.g. `.md`, just include that
extension in the template file name. For example: `index-card.md.hbs`; Stello strips
away the `.hbs` then assumes whatever extension remains.

In `./src/helpers` you will find a number of `.js` files which define the
handlebars helpers available to you at runtime. Each file should export a function
with returns a valid helper. The function will be passed references to arrays
containing all board cards and all board lists, useful for working in a context
other than the top level.

**Warning**: The `init` sub command creates a config file in your working
directory: `./.stellorc`. This file stores your responses to the different
prompts from `init`. If you want to add this file to version control **be sure
not to include your actual application token**. Instead, leave this field blank
and rely on process variables to supply this value when building.

**Warning**: At present the `init` sub command completely replaces anything in
`./src` with a fresh set of source files as specified by the template you are
using. That is, we do not attempt to save or merge any existing content in
`./src` if there is any. If you need to run `stello init` and have things in
`./src` you want to save be sure to do so before running the command.

```shell
stello build
```

Each card from your trello board gets mapped through the index template and
written to a `dist` directory.


## Usage (api)

Require `'stello'` and do your thing.

```javascript
var stello = require('stello');

stello.init({
  trelloApiKey: '36b098cd2f27e59119805f49468cbe60',
  trelloBoardUrl: 'https://trello.com/b/u4YdciVy/stello-boilerplate',
  trelloToken: '06e598e6521e837bb3c9b7db6a6519dc48348b9ef97f8b186929c239f2d531fe',
}, function(err){/* check for err */});

// `init` saves configs in `.stellorc` file

stello.build({
  // ... Optional, pass configs or use .stellorc file
}, function(err){/* check for err */});
```


## Release history

*(nothing yet)*


## License

[MIT](https://raw.github.com/jtrussell/stello/master/LICENSE-MIT)

[hbs]: http://handlebarsjs.com/
