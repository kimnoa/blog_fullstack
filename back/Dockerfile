FROM gradle:8-jdk17 AS builder

WORKDIR /app

COPY . .

RUN gradle build -x test


FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar myblog.jar


EXPOSE 8080

CMD ["java", "-jar", "myblog.jar"]