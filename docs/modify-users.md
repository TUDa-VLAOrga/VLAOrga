Prerequisite: The application has to be running and booted completely.

All following commands are executed from the root folder of this VLAOrga repo.

# Adding User accounts

If you do not want to specify an email address:

```bash
./scripts/addUserWithPassword.sh username password
```

* First parameter: Unique username
* Second parameter: Password in clear text (you can prefix the command with a space to the password from the .bash_history)

If you want to specify an email address for the user:

```bash
./scripts/addUserWithPasswordAndMail.sh username password "email@example.com"
```

* First parameter: Unique username
* Second parameter: Password in clear text (you can prefix the command with a space to hide the password from the .bash_history)
* Third parameter: Valid mail of the user

The passwords will then be securely stored in the internal database.

# Changing users in the database

```bash
./scripts/changeUserPassword.sh username password
```

* First parameter: Existing username
* Second parameter: Password in clear text (you can prefix the command with a space to hide the password from the .bash_history)

The passwords will then be securely stored in the internal database.

