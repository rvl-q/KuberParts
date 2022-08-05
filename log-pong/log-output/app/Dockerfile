# 
FROM python:3.9

# 
WORKDIR /code

# 
COPY requirements.txt /code/requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 
COPY . /code/app

# 
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7777"]
# CMD [ "sh", "start.sh"]
# CMD [ "ls", "-al"]
# EXPOSE 80
# CMD ["uvicorn", "app.main:app", "--port", "80"]

# FROM python:3.7

# RUN pip install fastapi uvicorn spacy

# # COPY ./api /api/api
# COPY . /api/app

# ENV PYTHONPATH=/api
# WORKDIR /api

# # EXPOSE 7777

# ENTRYPOINT ["uvicorn"]
# # CMD ["api.main:app", "--host", "0.0.0.0"]
# CMD ["api.main:app", "--host", "0.0.0.0", "--port", "7777"]
