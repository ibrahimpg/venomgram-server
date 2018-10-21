# venomgram-server
REST API built with Node/Express/Mongoose

# Roadmap
*Restrict CORS to UI URL
*Send X number of posts at a time instead of sending them all to the UI on fetch
*Ability to view other's profiles
*Return HTTP status codes with responses
*Add controllers folder to handle route logic
*Promise chaining is a little sloppy. Some promises create new promises without returning the new promise (i.e. Chaining them). If an inner promise fails and that promise isn't returned, the error will not bubble up to your catch statement, there will be an unexpected promise rejection warning, and the request will hang and eventually timeout.
*Don't use Mongoose default connection but create one explicitly. This comes in handy when writing tests, and for mocking etc.
