# Environment variables

To make the managment of environment variables easiser and more scalable,
you should only introduce new environment variables in the top-level .env.

.env.template should always container the docker configuration
.env has to be modified!
Do not forget e.g. to change the host from db to localhost!


The variable of the top-level should be delegated in the following Dockerfiles.

## Inteliji integration

If you want to run e.g. the backend locally (for caching purposes) when
e.g. executing test, you should register the environment variables there.

Download the plugin EnvFile
- Hamburger menu in top left
- Settings
- Plugins
- Search for EnvFile and install it
- Restart your IDE

Apply the EnvFile to the Backend Application
- Hamburger menu in top left
- Run tab in the toolbar
- Edit Configuration
- Select VlaBackendApplication
- Press Enable EnvFile
- Enable Substitute Environment Variables
- Press the + and add the .env file
- Hit ok

Now you should also be able to execute the backend locally.

If something fails you probably have not started the required services (see VLA-Backend/Dockerfile)
You can then start a service we depend on like the db (docker compose up --build db)
You can add more services if there are any requirements.

## Pitfalls
Be aware that changing a docker container name might influence the
correctness of an environment variable!

Some environment variables depend on each other, check which other
environment variables depend on the one you are modifying.

Always keep an eye on which .env file you are editing
Changes in .env.template won't help you if you registered .env in inteliji!