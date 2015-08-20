# Wykop API Node.js SDK

Przykładowe użycie:
```javascript
var WykopAPI = require('./wykop-api.js');


var api1 = new WykopAPI(appkey, secretkey); // opcjonalnie (appkey, secretkey, oputput, format)

api1.authenticate(accountkey, function(error, body) {
	if (!error) {
    	api1.addEntry(body, embed, function(error, body) {
    		// 
    	});
  	};
});
```
z Promises
```javascript
var WykopAPI = require('./wykop-api.js');


var api2 = new WykopAPI(appkey, secretkey); // opcjonalnie (appkey, secretkey, oputput, format)

api2.authenticate(accountkey).then(function(res1) {
        console.log(res1);
        return api2.addEntry(body, embed);
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
