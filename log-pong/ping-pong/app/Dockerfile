FROM denoland/deno:alpine-1.17.2

# ENV PORT=${PORT}
ENV PORT=8080

EXPOSE ${PORT}

WORKDIR /app

# test before persistent claim
# RUN mkdir shared && chown deno shared

# NOT allowed to write in the persistent volume
# USER deno

COPY . /app

# Update the cache while we still have internet
RUN deno cache app.js

CMD [ "run", "--unstable", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--no-check", "app.js" ]
