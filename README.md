# E-Phuxpoängshäfte

## How to use this?

First, make sure that you have docker and mongodb installed on your computer. Then you can run the following to set up the local environment:

```
docker-compose up --build
```

The backend runs on port 8000 and the frontend on 3000

However, if you want to run the front & backend separately, you can do it by running the makefile:

```
make install
make run
```