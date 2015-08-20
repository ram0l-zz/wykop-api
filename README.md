# Wykop API Node.js SDK

`In development`

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
http://www.wykop.pl/dla-programistow/dokumentacja/

### Comments

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Add | addComment | id linku | *id kom. nadrz. | body | *embed |  |
| Plus | plusComment | id linku | id koment. |  |  |
| Minus | minusComment | id linku | id koment. |  |  |
| Edit | editComment | id koment. | body  |  |  |
| Delete | deleteComment | id koment. |  |  |  |


### Link

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Index | getLink | id linku      |           |            |          |                |
| Dig | digLink | id linku |  |  |  |
| Cancel | cancelLink | id linku |  |  |  |
| Bury | buryLink | id linku | id powodu  |  |  |
| Comments | getLinkComments | id linku |  |  |  |
| Reports | getLinkReports | id linku |  |  |  |
| Digs | getLinkDigs | id linku |  |  |  |
| Related | getLinkRelated | id linku |  |  |  |
| Buryreasons | getLinkBuryreasons |  |  |  |  |
| Observe | observeLink | id linku |  |  |  |
| Favorite | favoriteLink | id linku |  |  |  |


### Links

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Promoted | getLinksPromoted | *page | *sort |  |  |
| Upcoming | getLinksUpcoming | *page | *sort |  |  |


in progress
