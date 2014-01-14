# stello (WIP)

> Generator for blogs and static sites using [Trello](https://trello.com/) as a
> backend.


## Installation

Install from npm:

```
npm install -g stello
```


## Usage (cli)

`stello init`

`stello fetch`

`stello build`

`stello server`


## Usage (api)

Just require `'stello'` and do your thing.

```javascript
var stello = require('stello').Stello;

stello.init({
  // Defaults to '.'
  cwd: 'some/path',
  
  // Will check .stellorc in cwd and process.env.TRELLO_API_KEY
  trelloApiKey: 'my-key',
  
  // Will check .stellorc in cwd
  trelloBoard: 'https://trello.com/b/asdf',
  
  // Where cached strello tmp stuff is kept
  // Defaults to '.stello-tmp'
  // Will check .stellorc in cwd
  tmpDir: '.my-stello-stuff',
  
  // Where built files are placed
  // Defaults to 'dist'
  dest: 'www',
  
  // Continue if cwd is non-empty?
  force: true
}, function(err){/* check for err */});

// Once init has been called (and the `.stellorc` file created) you can leave
// off any parameters to the functions below that were captured by init.

stello.fetch({
  cwd: 'some/path',
  trelloApiKey: 'my-key',
  trelloBoard: 'https://trello.com/b/asdf',
  tmpDir: '.my-trello-stuff', 
}, function(err){/* check for err */});

stello.build({
  cwd: 'some/path',
  dest: 'www'
}, function(err){/* check for err */});

stello.server({
  cwd: 'some/path'
});
```


## Release history

*(nothing yet)*


## Contributing

Please do! All I ask is that you create an issue before working on working on
unsolicited new features.


## License

[MIT](https://raw.github.com/jtrussell/stello/master/LICENSE-MIT)
