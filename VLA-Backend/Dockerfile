# Adjust the CI java version of the overarching project if you change the image
FROM gradle:8-jdk21 AS build
WORKDIR /workspace

# Download all dependencies needed for the entire build process once
COPY --chown=gradle:gradle gradle gradlew build.gradle settings.gradle ./
RUN gradle --no-daemon dependencies

# Copy only the minimum to container
COPY --chown=gradle:gradle src src
RUN gradle --no-daemon bootJar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/build/libs/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
