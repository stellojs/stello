# stello

> Like map (and reduce) for [Trello](https://trello.com/) cards.


## Installation

Install from npm:

```
npm install -g stello
```


## Usage (cli)

Kick everything off:

`stello init`

You now have a stellorc config file in your working directory as well as some
source templates and template helpers.

We're using [Handlebars][hbs] as our templating engine. Since Trello uses
markdown for many things stello pre-registers a `markdown` helper for you which
will convert markdown to html.

After running `stello init` you will notice a number of `*.hbs` files in the
new `src` folder. These are you template files which Trello cards, lists, and
boards get mapped through. The generated files will be given a name that includes
the item's position and sluggified name. By default we generate `html` files but
if a different extension is preffered, e.g. `.md`, just include that extension in
the template file name. For example: `index.md.hbs`; Stello strips away the 
`.hbs` then assumes whatever extension remains.

`stello build`

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
