SimStan
=======

![Screenshot of SimStan](simstan_screenshot_1.png "Screenshot")

A project by Stan James.

MySQL database is in file simstan.sql

Directory 'html' contains all files that should be put on your webserver. It is a basic Drupal 6 installation with several custom modules.

Search all files for the following values, which you need to replace with your own:

- SIMSTAN_DB_USERNAME 
- SIMSTAN_DB_PASSWORD
- SIMSTAN_DB_NAME
- YOUR_KEY_HERE
- your@email.address.com

You will need to reset the password of user 1 (admin).

This is a quick-n-dirty release. Any questions, contact me at stan@wanderingstan.com

For all it’s faults, Drupal is still a fast way to prototype. SimStan is based on a standard Drupal 6 installation. The wonderful FBconnect module gave me an instant and easy connection to Facebook. The Event Module added basic date information to nodes, and iCal export that I could load in my iPod touch. However, it’s interface is awful. The fantastic JQuery Week Calendar by Rob Monie has the look-n-feel of Google Calendar. Most of my work was modifying his code into a custom Drupal module which would modify Event nodes, while displaying things like Facebook avatars. Of course lots of theme integration to give everything the same style, and little things like Cron jobs to email me my schedule each day and make backups of the database.

