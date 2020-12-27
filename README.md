# venomgram-server
REST API built with Node/Express/MongoDB. Serves as the back-end for [Venomgram](https://venomgram.com/#/), an Instagram clone built with full-stack JavaScript. The UI was built with Vue, check that out [here.](https://github.com/ibrahimpg/venomgram-ui)

## Instructions

It's actually very easy to get your own copy of venomgram-server running using Heroku and MongoDB Atlas.

1. Fork this repository and create a Node.js Heroku dyno that is deployed via your new venomgram-server repository.

2. Install the Cloudinary add-on to your Heroku dyno. Head to the MongoDB Atlas website and create a MongoDB cluster/database. Add the connection string provided by Atlas to your Heroku environmental variables under MONGODB_URI.

3. Configure the remaining environmental variables you need: JWT_KEY (the secret key your app will use to sign JSON web tokens) and UI_URL (enabling CORS for the domain you will use [for your UI](https://github.com/ibrahimpg/venomgram-ui)).

And voila! You have your own copy of venomgram-server running, complete with persistent data storage and a remote MongoDB database.

## API

|Endpoint|JWT|Variables|Method|
|-|:-:|:-:|:-:|
| /post/feed/:username/:from/:to|X|None [1]|GET
| /post/explore/:username/:from/:to|X|None [1]|GET
| /post/profile/:username/:from/:to|X|None [1]|GET
| /post/upload|✓|file|POST
| /post/delete|✓|id|DELETE
| /post/like|✓|id|PATCH
| /post/unlike|✓|id|PATCH
| /post/report|✓|id|PATCH
| /user/user|X|None [1]|GET
| /user/self|✓|None [2]|GET
| /user/register|X|username, password|POST
| /user/login|X|username, password|POST
| /user/update|✓|file [3], bio|PATCH
| /user/delete|✓|None [2]|DELETE
| /user/follow|✓|username|PATCH
| /user/unfollow|✓|username|PATCH
| /user/block|✓|username|PATCH
| /user/unblock|✓|username|PATCH

1. Operate entirely on endpoint params.
2. Operate entirely on JSON web token.
3. Optional. Will only update bio if not sent.
