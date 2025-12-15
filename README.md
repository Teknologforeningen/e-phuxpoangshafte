# E-Phuxpoängshäfte

## How to use this?

This app is conainerized using docker.  Make sure you have docker installed on your computer, and run:

```
docker-compose up --build
```

This will then run the db and backend in docker, and serve both the backend and frontend on port 8000.

Alternatively, to run the frontend locally for easier development without needing to re-build the docker container every time, just do:
```
cd frontend/
npm install
npm start
```
This will expose the frontend on port 3000.


There is also a makefile if you want to run backend and frontend locally (needs a local db setup)
```
make install
make run
```

Looking for the phux_year variable?? It is set in github secrets, see the ci file! ;)

## Manual testing

### REST files & Seeding data
To manually create test data you can use the existing .rest files. For convenience, you can use an extension like REST extension in vscode to run them in the UI. Note that some of the endpoint require autentication / admin privilage -> in this case, first create an admin user, then call the /login endpoint like login.rest and switch out the token!


## TODOs
* Possibly: separate frontend and backend services in docker