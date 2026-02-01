FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw mvnw
COPY pom.xml pom.xml
COPY src/ src/

RUN ./mvnw -DskipTests package

EXPOSE 8080
ENV PORT=8080

CMD ["sh", "-c", "java -jar target/*.jar"]
