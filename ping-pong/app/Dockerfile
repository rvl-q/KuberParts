FROM denoland/deno:alpine-1.17.2

# ENV PORT=${PORT}
ENV PORT=8888

EXPOSE ${PORT}

WORKDIR /app

USER deno

COPY . /app

# Update the cache while we still have internet
RUN deno cache app.js

CMD [ "run", "--unstable", "--allow-net", "--allow-read", "--allow-env", "--no-check", "app.js" ]
