# Full-Stack-Engineer-Challenge
It is a nodejs based basic backend application to demonstrate login, showing list of users and current loggedin user data. Also main important part is that it is in typescript and after login every api call is tokenized.

There are 3 api's :-
1) 'login' : payload should be username and password
2) 'users' : In headers valid token is required to get users list
3) 'settings' : In headers valid token is required to get current logged In user details

Middleware : There is one middle to validate the request to validate the token in request header .

'users.json' File : It is json file to manage users details and inititally pasted all users data from https://challenge.sunvoy.com  .

refreshUsersJsonFile function : It is for refeshing data like authenticated and token value whenever server restart.


To run application need to start the server : npm run start


Full-Stack-Engineer-Challenge Explanation recording link of loom : https://www.loom.com/share/fa179eeb6e714255abe748a5e2480ee5?sid=287ac857-e1a1-41f0-9ad7-9541f7dab5e7