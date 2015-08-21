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

*param - nieobowiązkowe

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


### Popular

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Promoted | getPopularPromoted |  |  |  |  |
| Upcoming | getPopularUpcoming |  |  |  |  |


### Profile

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |
| ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** |
| Index | getProfile | nazw. użytk. | *page |  |  
| Added | getProfileLinks | nazw. użytk. | *page |  |  
| Published | getProfilePublished | nazw. użytk. | *page |  |  
| Commented | getProfileCommented | nazw. użytk. | *page |  |  
| Digged | getProfileDigged | nazw. użytk. | *page |  |  
| Buried | getProfileBuried | nazw. użytk. | *page |  |  
| Observe | observeProfile | nazw. użytk. |  |  |  
| Unobserve | unobserveProfile | nazw. użytk. |  |  |  
| Block | blockProfile | nazw. użytk. |  |  |  
| Unblock | unblockProfile | nazw. użytk. |  |  |  
| Followers | getProfileFollowers | nazw. użytk. | *page |  |  
| Followed | getProfileFollowed | nazw. użytk. | *page |  |  
| Favorites | getProfileFavorites | nazw. użytk. | *page |  |  
| Entries | getProfileEntries | nazw. użytk. | *page |  |  
| EntriesComments | getProfileEntriesComments | nazw. użytk. | *page |  |  
| Related | getProfileRelatedLinks | nazw. użytk. | *page |  |  


### Search

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Index | search | question |  |  |  |
| Links | searchLinks | {} | *page |  |  |
| Entries | searchEntries | {} | *page |  |  |
| Profiles | searchProfiles | {} | *page |  |  |


### User

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Login | login | *accountkey |  |  |  |
| Favorites | userFavorites |  |  |  |  |
| Observed | userObserved |  |  |  |  |
| Tags | userObservedTags |  |  |  |  |
| Connect | getConnectUrl | url |  |  |  |
|  | getConnectData | ?? |  |  |  |


### Top

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Index | getTop | YYYY |  |  |  |
| Date | getTopMonth | YYYY | month(1-12) | *page |  |
| Hits | getTopHits |  |  |  |  |


### Add

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Index | addLink | grupa | {} |  |  |

### Related

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Plus | plusRelated | id linku | id powiąz. |  |  |
| Minus | minusRelated | id linku | id powiąz. |  |  |
| Add | addRelated | id linku | {} |  |  |


### Mywykop

| Metoda API    | Metoda SDK     | Parametry SDK |   |  
| ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | 
| Index | getMywykop | *page |  |  
| Tags | getMywykopTags | *page |  |  
| Users | getMywykopUsers | *page |  |  
| Observing | getMywykopObserving | *page |  |  
| Mine | getMywykopMine | *page |  |  
| Received | getMywykopReceived | *page |  |  
| Notifications | getNotifications | *page |  |  
| NotificationsCount | getNotificationsCount |  |  |  
| HashTagsNotifications | getHashtagsNotifications | *page |  |  
| HashTagsNotificationsCount | getHashtagsNotificationsCount |  |  |  
| ReadHashTagsNotifications | readHashtagsNotifications |  |  |  
| MarkAsReadNotification | markAsReadNotification | id powiadom. |  |  


### Entries

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Index | getEntry | id wpisu |  |  |  |
| Add | addEntry | body | *embed(url/file) |  |  |
| Edit | editEntry | body| *embed(url/file) |  |  |
| Delete | deleteEntry | id wpisu |  |  |  |
| AddComment | addEntryComment | id wpisu | body | *embed(url/file) |  |
| EditComment | editEntryComment | id wpisu | id koment. | body | *embed(url/file) |
| DeleteComment | deleteEntryComment | id wpisu | id koment. |  |  |
| Vote | voteEntry | id wpisu |  |  |  |
|  | voteEntryComment | id wpisu | id koment. |  |  |
| Unvote | unvoteEntry | id wpisu |  |  |  |
|  | unvoteEntryComment | id wpisu | id koment. |  |  |
| Favorite | favoriteEntry | id wpisu |  |  |  |


### Rank

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Index | getRank | *order |  |  |  |


### Observatory

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  
| ------------- | ------------- | ------------- | ------------- | ------------- | 
|               |                |  **param1**       |  **param2** | **paramN** |
| Votes | getObservatoryVotes |  |  |  |  
| Comments | getObservatoryComments |  |  |  |  
| Entries | getObservatoryEntries |  |  |  |  
| EntriesComments | getObservatoryEntresComments |  |  |  |  


### Favorites

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Index | getFavorites | id listy |  |  |  |
| Comments | getFavoritesComments |  |  |  |  |
| Entries | getFavoritesEntries |  |  |  |  |
| Lists | getFavoritesLists |  |  |  |  |


### Stream

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Index | getStream | *page |  |  |  |
| Hot | getStreamHot | *page |  |  |  |


### Tag

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Index | getTagIndex | nazw. tagu | *page |  |  |
| Links | getTagLinks | nazw. tagu | *page |  |  |
| Entries | getTagEntries | nazw. tagu | *page |  |  |
| Observe | observeTag | nazw. tagu |  |  |  |
| Unobserve | unobserveTag | nazw. tagu |  |  |  |
| Block | blockTag | nazw. tagu |  |  |  |
| Unblock | unblockTag | nazw. tagu |  |  |  |


### PM

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  
| ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** |
| ConversationsList | getConversationsList |  |  |  |  
| Conversation | getConversation | nazwa użytk. |  |  |  
| SendMessage | sendMessage | nazwa użytk. | body | *embed(url/file) |  
| DeleteConversation | deleteConversation | nazwa użytk. |  |  |  


### Tags

| Metoda API    | Metoda SDK     | Parametry SDK |   |  |  |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|               |                |  **param1**       |  **param2** | **paramN** | **paramN**  |
| Index | getTagsList |  |  |  |  |

