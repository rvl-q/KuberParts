# FROM python:3.10-alpine
FROM alpine:3.16

# EXPOSE 80

RUN apk add --update coreutils && rm -rf /var/cache/apk/*

# RUN pip install fastapi

# RUN pip install uvicorn

# 
WORKDIR /code

# 
COPY . /code

# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
CMD [ "sh", "start.sh"]
# CMD [ "ls", "-al"]
# EXPOSE 80
# CMD ["uvicorn", "app.main:app", "--port", "80"]
