# venomgram-server
REST API built with Node/Express/MongoDB. Serves as the back-end for [Venomgram](https://venomgram.netlify.com/#/), an Instagram clone built with full-stack JavaScript. The UI was built with Vue, check that out [here.](https://github.com/ibrahimpg/venomgram-ui)

## Instructions

It's actually very easy to get your own copy of venomgram-server running using Heroku.

1. Fork this repository and create a Node.js Heroku dyno that is deployed via your new venomgram-server repository.

2. Install the Cloudinary and mLab add-ons to your Heroku dyno. This automatically creates two of the environmental variables you need.

3. Head to the settings for your dyno and configure the remaining environmental variables you need: JWT_KEY (the secret key your app will use to sign JSON web tokens) and UI_URL (enabling CORS for the domain you will use [for your UI](https://github.com/ibrahimpg/venomgram-ui)).

And voila! You have your own copy of venomgram-server running, complete with persistent data storage and a remote MongoDB database.

## API

|Endpoint|JWT|Variables|
|-|:-:|:-:|
| /post/feed/:username/:from/:to|X|None [1]|
| /post/explore/:username/:from/:to|X|None [1]|
| /post/profile/:username/:from/:to|X|None [1]|
| /post/upload|✓|file|
| /post/delete|✓|id|
| /post/like|✓|id|
| /post/unlike|✓|id|
| /post/report|✓|id|
| /user/self|✓|None [2]|
| /user/register|X|username, password|
| /user/login|X|username, password|
| /user/update|✓|file [3], bio|
| /user/delete|✓|None [2]|
| /user/follow|✓|username|
| /user/unfollow|✓|username|
| /user/block|✓|username|
| /user/unblock|✓|username|

1. Operate entirely on endpoint params.
2. Operate entirely on JSON web token.
3. Optional. Will only update bio if not sent.

# To-do

* Log catch errors.

* Implement email confirmation upon registration.