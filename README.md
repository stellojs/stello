# Stello

> A static content generator using [Trello](https://trello.com/) as a backend.


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

You should now have a `./.stellorc` config file in your working directory as
well as a `./src` folder containing templates and helper files. Stello uses
[Handlebars][hbs] as its templating engine. Looking in `./src` you should find
some subset of:

- `helpers/` a folder containing handlebars helpers. When you build with Stello
  each `*.js` file in this directory will be converted into a helper with the
  same name. Each file should export a function which returns a valid handlebars
  helper. The exported function will be passed references to arrays containing
  all board cards and all board lists, useful for working in a context other
  than the top level.
- `partials/` similar to the helpers folder, each `*.hbs` file in this folder
  will be converted into a handlebars partial registered under the same name.
- `index-board.*.hbs`- A board template file. Stello will create a new file in
  `./dist` using this template, applying your entire board's data to it.
- `index-card.*.hbs` - A list template file. Stello will create a new file in
  `./dist` using this template for each list on your board.
- `index-list.*.hbs` - A card template file. Stello will create a new file in
  `./dist` using this template for each card on your board.

Trello cards, lists, and boards get mapped through the template files listed
above. The generated files in `./dist` will be given a name that includes the
item's position in Trello land and its sluggified name. By default we generate
`html` files but if a different extension is preffered, e.g. `.md`, just include
that extension in the template file name. For example, the template
`./src/index-card.md.hbs` will result in `./dist/index-card.md`; Stello strips
away the `.hbs` then assumes whatever extension remains.

Since Trello uses markdown for many things Stello pre-registers a `markdown`
helper which will convert markdown to html. E.g.: `{{markdown card.desc}}`.

**Warning**: The `init` sub command creates a config file in your working
directory: `./.stellorc`. This file stores your responses to the different
prompts from `init`. If you want to add this file to version control **be sure
not to include your actual application token**. Instead, leave this field blank
and rely on process variables to supply this value when building.

**Warning**: At present the `init` sub command completely replaces anything in
`./src` with a fresh set of source files as specified by the template you are
using. That is, we do not attempt to save or merge any existing content in
`./src`. If you need to run `stello init` and have things in `./src` you want to
save be sure to do so before running the command.

```shell
stello build
```

Stello looks in `./src` for `index-[card|list|board].*.hbs` templates, maps
card/list/board data through them as appropriate and stores the resulting file
in `./dist`.


### Working With Templates

#### Card Templates

> `src/index-card.*.hbs`

This template will have the following variables available to it:

- `allCards`: An array of card objects (see below)
- `allLists`: An array of list objects (see the section on list templates)
- `card`: A single card's data, we provide an example below from the Trello api docs.

```javascript
{
  "id": "52ee644502ff20e0433f2f4b",
  "checkItemStates": [],
  "closed": false,
  "dateLastActivity": "2014-02-02T15:36:00.959Z",
  "desc": "Hello there! Here's a markdown description.",
  "descData": {
    "emoji": {}
  },
  "idBoard": "52ee64073f38ee10617ecc09",
  "idList": "52ee64073f38ee10617ecc0a",
  "idMembersVoted": [],
  "idShort": 1,
  "idAttachmentCover": null,
  "manualCoverAttachment": false,
  "idLabels": [],
  "name": "Hello World",
  "pos": 65535,
  "shortLink": "2yB1hjW7",
  "badges": {
    "votes": 0,
    "viewingMemberVoted": false,
    "subscribed": false,
    "fogbugz": "",
    "checkItems": 0,
    "checkItemsChecked": 0,
    "comments": 0,
    "attachments": 0,
    "description": true,
    "due": null
  },
  "due": null,
  "email": "fake@email.com",
  "idChecklists": [],
  "idMembers": [],
  "labels": [],
  "shortUrl": "https://trello.com/c/2yB1hjW7",
  "subscribed": false,
  "url": "https://trello.com/c/2yB1hjW7/1-hello-world"
}
```

#### List Templates

> `src/index-list.*.hbs`

This template will have the following variables available to it:

- `allCards`: An array of card objects (see the section on card templates)
- `allLists`: An array of list objects (see below)
- `list`: A single lists' data, we provide an example below from the Trello api docs.
- `listCards`: An arry of card objects in this list

```javascript
{
  "id": "52ee64073f38ee10617ecc0a",
  "name": "Pages",
  "closed": false,
  "idBoard": "52ee64073f38ee10617ecc09",
  "pos": 16384,
  "subscribed": false
}
```

#### Board Templates

> `src/index-board.*.hbs`

This template will have the following variables available to it:

- `allCards`: An array of card objects (see the section on card templates)
- `allLists`: An array of list objects (see the section on list templates)
- `board`: A single board's data, we provide an example below from the Trello api docs.

```javascript
{
  "id": "52ee64073f38ee10617ecc09",
  "name": "Stello Boilerplate",
  "desc": "",
  "descData": null,
  "closed": false,
  "idOrganization": null,
  "pinned": false,
  "url": "https://trello.com/b/u4YdciVy/stello-boilerplate",
  "shortUrl": "https://trello.com/b/u4YdciVy",
  "prefs": {
    "permissionLevel": "public",
    "voting": "disabled",
    "comments": "members",
    "invitations": "members",
    "selfJoin": false,
    "cardCovers": true,
    "cardAging": "regular",
    "calendarFeedEnabled": false,
    "background": "blue",
    "backgroundImage": null,
    "backgroundImageScaled": null,
    "backgroundTile": false,
    "backgroundBrightness": "dark",
    "backgroundColor": "#0079BF",
    "canBePublic": true,
    "canBeOrg": true,
    "canBePrivate": true,
    "canInvite": true
  },
  "labelNames": {
    "green": "",
    "yellow": "",
    "orange": "",
    "red": "",
    "purple": "",
    "blue": "",
    "sky": "",
    "lime": "",
    "pink": "",
    "black": ""
  }
}
```

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
