# E-Phuxpoängshäfte

## How to use this?

First, make sure that you have docker and mongodb installed on your computer. Then you can run the following to set up the local environment:

```
docker compose up --build
```

The backend runs on port 8000 and the frontend on 3000

However, if you want to run the front & backend separately, you can do it by running the makefile:

```
make install
make run
```

### Alternative way using VS code dev containers
You can also dev and run this using [VS code Dev containers](https://code.visualstudio.com/docs/devcontainers/containers). You do this by installing the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension as well as having Docker on your computer (in case you are still running Win10 this might not work). After that you can open the repo in a container using "Dev Containers: Clone a repository in Container Volume..." command from the VS code command palette. Note: No need to clone the repo before that to your computer. This should give you a working development environment. After this you can simply run the same commands above to start the service.