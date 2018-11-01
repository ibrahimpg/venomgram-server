# venomgram-server
REST API built with Node/Express/MongoDB. Serves as the back-end for [Venomgram](https://venomgram.netlify.com/#/), an Instagram clone built with full-stack JavaScript. The UI was built with Vue, check that out [here.](https://github.com/ibrahimpg/venomgram-ui)

## Instructions

It's actually very easy to get your own copy of venomgram-server running using Heroku.

1. Fork this repository and create a Node.js Heroku dyno that is deployed via your new venomgram-server repository.

2. Install the Cloudinary and mLab add-ons to your Heroku dyno. This automatically creates two of the environmental variables you need.

3. Head to the settings for your dyno and configure the remaining environmental variables you need: JWT_KEY (the secret key your app will use to sign JSON web tokens) and UI_URL (enabling CORS for the domain you will use [for your UI](https://github.com/ibrahimpg/venomgram-ui)).

And voila! You have your own copy of venomgram-server running, complete with persistent data storage and a remote MongoDB database.

## API

Coming soon.

# To-do

* Add ability to view other's profiles

* Return HTTP status codes with responses. [Good resource.](https://restfulapi.net/http-status-codes/)

* Add controllers folder to handle route logic

* Promise chaining is a little sloppy. Some promises create new promises without returning the new promise (i.e. Chaining them). If an inner promise fails and that promise isn't returned, the error will not bubble up to the catch statement, there will be an unexpected promise rejection warning, and the request will hang and eventually timeout.

* Don't use Mongoose default connection but create one explicitly. This comes in handy when writing tests, and for mocking etc.

* Allow for updating profile with an empty bio.

* Implement logging.

* Implement email confirmation upon registration.

* index.js should be high level set-up with no detail. Whole file should be the level of detail in lines 23-24. 
That is, things like lines 26-35 are in a totally different level of detail. Something like...

```
const ErrorHander = require('./blablabla...');
// ...
app.use(ErrorHandler);
```

The same applies to lines 9-17. Maybe have that stuff in the middleware folder.

* Think of handling things using only internal ID's. This makes it easier to allow people to change their username in the future.