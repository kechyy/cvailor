FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy public only if it exists
RUN mkdir -p ./public
COPY --from=builder /app/public* ./public/

RUN addgroup --system app && \
    adduser --system --group app && \
    chown -R app:app /app

USER app
EXPOSE 3000
CMD ["npm", "start"]