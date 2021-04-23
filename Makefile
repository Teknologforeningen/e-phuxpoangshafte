install:
	(cd back && yarn) && (cd front && yarn)

run:
	(cd back && yarn run dev &) && (cd front && yarn start)