# venomgram-server
REST API built with Node/Express/MongoDB. Archived. Outdated patterns used for MongoDB.

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
