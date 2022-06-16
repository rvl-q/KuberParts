FROM denoland/deno:alpine-1.17.2

# ENV PORT=${PORT}

ENV PORT=9999

EXPOSE ${PORT}

WORKDIR /app

RUN chown deno .
USER deno
RUN touch foo.bar
COPY app.js /app
#ADD /app-cache /app-cache
RUN deno cache app.js

#https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e102/project/app.js
#CMD [ "run", "--unstable", "--watch", "--allow-net", "--allow-read", "--allow-env", "--no-check", "app.js" ]
CMD [ "run", "--unstable", "--allow-net", "--allow-read", "--allow-env", "--no-check", "app.js" ]
#CMD [ "run", "--unstable", "--allow-net", "--allow-read", "--allow-env", "--no-check", "https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e102/project/app.js" ]
#CMD [ "echo", "fwckyou"]
#CMD [ "echo", "`env`"]
# deno run --unstable --watch --allow-net --allow-read --allow-env --no-check app.js