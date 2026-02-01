FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw mvnw
COPY pom.xml pom.xml
COPY src/ src/

RUN chmod +x mvnw && ./mvnw -DskipTests package

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar /app/app.jar

EXPOSE 8080
ENV PORT=8080

CMD ["sh", "-c", "java -jar /app/app.jar"]
