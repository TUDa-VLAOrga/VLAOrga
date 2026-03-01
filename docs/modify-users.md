# Adding User accounts

Prerequisite: The application has to be running and booted completely

If you do not want to specify a mail

Use `../scripts/addUserWithPassword.sh`

First parameter: Unique username
Second parameter: Password in clear text

If you want to specify a mail

Use `../scripts/addUserWithPasswordAndMail.sh`

First parameter: Unique username
Second parameter: Password in clear text
Third parameter: Valid mail of the user

The passwords will then be securely stored in the internal database

# Changing users in the database
Prerequisite: The application has to be running and booted completely

Use `../scripts/changeUserPassword.sh`

First parameter: Existing username
Second parameter: Password in clear text

The passwords will then be securely stored in the internal database

