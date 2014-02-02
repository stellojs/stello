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
var stello = require('stello');

stello.init({
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

// `init` saves configs in `.stellorc` file

stello.fetch({
  trelloApiKey: 'my-key',
  trelloBoard: 'https://trello.com/b/asdf',
  tmpDir: '.my-trello-stuff', 
}, function(err){/* check for err */});

stello.build({
  dest: 'www'
}, function(err){/* check for err */});

stello.server();
```


## Release history

*(nothing yet)*


## Contributing

Please do! All I ask is that you create an issue before working on unsolicited
new features.


## License

[MIT](https://raw.github.com/jtrussell/stello/master/LICENSE-MIT)
