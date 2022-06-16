FROM denoland/deno:alpine-1.17.2

# ENV PORT=${PORT}
ENV PORT=9999

EXPOSE ${PORT}

WORKDIR /app

USER deno

COPY app.js /app

# Update the cache while we still have internet
RUN deno cache app.js

#https://raw.githubusercontent.com/rvl-q/KuberParts/main/part1/e102/project/app.js
#CMD [ "run", "--unstable", "--watch", "--allow-net", "--allow-read", "--allow-env", "--no-check", "app.js" ]
CMD [ "run", "--unstable", "--allow-net", "--allow-read", "--allow-env", "--no-check", "app.js" ]

# Debug stuff
# CMD [ "env" ]
# deno run --unstable --watch --allow-net --allow-read --allow-env --no-check app.js