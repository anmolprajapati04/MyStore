# Build stage
FROM maven:3.8.5-openjdk-17-slim AS build
ARG SERVICE_NAME
WORKDIR /app

# Copy the pom.xml of the specific service
COPY ${SERVICE_NAME}/pom.xml .
RUN mvn dependency:go-offline

# Copy the source of the specific service
COPY ${SERVICE_NAME}/src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-Xmx384m", "-Xms256m", "-Dserver.port=${PORT}", "-jar", "app.jar"]
