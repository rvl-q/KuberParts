FROM alpine/curl:3.14

WORKDIR /jobs

COPY todo-job.sh .

# ENV SERVER_URL http://localhost:8081/todos
# ENV SERVER_URL http://proj01-svc.project:2345/todos
ENV SERVER_URL http://proj01-svc:2345/todos

CMD [ "./todo-job.sh" ]