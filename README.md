# Wykop API Node.js SDK

Przykładowe użycie:
```javascript
var WykopAPI = require('./wykop-api.js');


var api = new WykopAPI(appkey, secretkey);

api.authenticate(accountkey, function(error,response,body) {
	if (!error && response.statusCode === 200 && !body.error) {
    	api.addEntry(body, embed, function(error, response, body) {
    		// 
    	});
  	};
});
```
z Promises
```javascript
var WykopAPI = require('./wykop-api.js');


var api = new WykopAPI(appkey, secretkey);

api.authenticate(accountkey).then(function(res1) {
        console.log(res1);
        return api.addEntry(body, embed);
    })
    .then(function(res2) {
        console.log(res2);
    })
    .catch(function(err) {
        console.error(err);
    });
```


    


## Metody

### Comments

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Add | addComment | id linka | *id kom. nadrz. | body | *embed |  |
| Plus | plusComment | id linka | id koment. |  |  |
| Minus | minusComment | id linka | id koment. |  |  |
| Edit | editComment | id koment. | body  |  |  |
| Delete | deleteComment | id koment. |  |  |  |

in progress
