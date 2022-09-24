FROM denoland/deno:1.23.4 as main

WORKDIR /app

COPY . .

RUN deno cache server.ts

CMD ["run", "--allow-net", "--allow-read", "--allow-env", "--watch", "--unsafely-ignore-certificate-errors", "server.ts"]


FROM denoland/deno:1.23.4 as release

COPY . .

RUN deno cache nessie.config.ts

CMD deno run -A --unstable --unsafely-ignore-certificate-errors https://deno.land/x/nessie/cli.ts migrate
