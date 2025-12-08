# Code Style

We ensure a good code style using linters, which are also executed by our CI.

## Backend

We use [Checkstyle](https://checkstyle.org/), with the default google style 
(made slight adjustments to use 4 spaces for tab).
Run the linter as a Gradle job:

    ./gradlew checkstyleMain  # lints application source code
    ./gradlew checkstyleTest  # lints tests source code

How to activate this style in IntelliJ for autoformatting is described here:
<https://stackoverflow.com/a/35273850>, choose the file `config/checkstyle/checkstyle.xml`
(this symlinks to the correct style file and is used also by Gradle)


## Frontend

We use [ESLint](https://eslint.org/), which can be run locally via npm:

    npm run lint

You can build the application at the same time using the following command.
This possibly reveals some errors our linter does not recognize.

    npm run lint-and-build

Autoformatting and linting formatting is a future ToDo (ESLint has capabilities but not activated by default, have not looked into that yet).

