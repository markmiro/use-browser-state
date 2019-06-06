# use-browser-state
React hook for keeping state in local storage

Uses:

1. Alternative to React's `useState` when you're developing and want to maintain state between refreshes. Hot reloading is great, and this gives you some of those benefits when you're not actually hot reloading.
2. Keep user state between page refreshes. Use this for data you don't mind getting cleared unepectedly.

The API is simple. For basic usage, pretend you're using React's `useState`.

*WARNING: Simple usage is dangerous for data integrity*
Adding and removing `useBrowserState` in your project can cause local, fixable data corruption.
You can clean it up by clearing local storage.

`useBrowserState` generates a unique `localStorage` key for each use based on a simple counter, and the initial value you provide (by running it through `JSON.stringify`). This means that you can get data corruption if the counter is off (due to adding or removing a `useBroserState` somewhere) and there's a collision (value is the same, but in a different component or something).

I really like the benefits this module provides for my own projects. I miss it when I don't have it.

Some possible solutions to the data corruption issue:

- Use an editor extention to generate a [`short-id`](https://www.npmjs.com/package/short-id) for each use of this hook and just have random ids in source code. It will work, but it won't be pretty.
- Generate ids at build time so you don't have to see them in your source code
- Leverage GIT to figure out if hooks have been added / removed
