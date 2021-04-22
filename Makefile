install:
	(cd back && yarn) && (cd front && yarn)

run:
	(cd back && yarn start &) && (cd front && yarn start)