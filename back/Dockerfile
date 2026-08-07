#build
FROM gradle:8-jdk21 AS builder

WORKDIR /app

COPY build.gradle settings.gradle ./
COPY gradle gradle
RUN gradle dependencies --no-daemon || true

COPY . .
RUN gradle clean bootJar --no-daemon

#run
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar myblog.jar

EXPOSE 8080

CMD ["java", "-jar", "myblog.jar"]