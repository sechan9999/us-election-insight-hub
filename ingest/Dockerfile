# Results ingest job (Cloud Run Job). Only the ingest sources and the two shared lib files are copied.
FROM node:22-slim
WORKDIR /app
RUN npm install -g tsx@4.21.0 && npm cache clean --force
COPY ingest/results ./ingest/results
COPY app/us/lib/live.ts app/us/lib/schedule.ts ./app/us/lib/
USER node
CMD ["tsx", "ingest/results/job.ts"]
