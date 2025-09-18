## Todo:
1. - [x]  Create Auth Context and in that store user details in localStorage and only fetch user data when ever the username changes this will resolve the issue of data retention in dashboard page.

> PS: the first step has been done know based on the data received make sure that the data on the dashboard is saved on changes.
> Also remove the redux store for sharing between dashboard components as they are used inside the form so the form has already access to the data they provide redux store will only add complexity.
> There were flags set to let the server know that some data on the client side has been deleted to reflect those changes in the database as well. so remove them and make sure that even without them this process still happens fine

2.  Also after the user is changing the profile and navigates to another page midway then just rest the changes or make sure to display a dialogue box and inform the user and ask for confirmation.

3.  After this check ways to improve navigation speed.

4.  Create a Web Socket connection with the users and the creators so that the payments donated are shared in real time!

5.  Deploy it on Vercel and make sure to use vercel queues in case the database operations are intense and due to cold start the server starts very slowly.

6.  Create a feature in which the creators can see all the analytics relevant to them.
