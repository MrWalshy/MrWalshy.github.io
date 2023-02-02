@docArgs()
```
"title": "Dockerfiles | morganwalsh.dev", 
"links": ["/style.css"],
"scripts": ["/scripts/common.js"],
"date": "02/02/2023"
```

<div class="p-16 w-80 w-md-100 ml-auto mr-auto">

# Dockerfiles
  
As discussed in [Docker images](/notes/docker/docker_images.html), an image can be created from a Dockerfile. This allows images to have layers built upon them, each layer being some command in the `Dockerfile`.

## Dockerising a JAR file

In this example, we will dockerise a Spring Boot web server which serves a static website. Let's first create a directory 
for the project and download the JAR file:

```sh
mkdir dockerised_jar
cd dockerised_jar/
wget https://github.com/MrWalshyType2/SeleniumShoppingTestSite/releases/download/v1.0.0/test_shopping_site.jar
touch Dockerfile
```

Open the `Dockerfile` and enter the following:

```
# Base image of Java version 17
FROM openjdk:17
# Expose port app is served on in the container
EXPOSE 8080
# Copy JAR into container (COPY HOST_PATH CONTAINER_PATH)
COPY . /usr/src/app
# Set the working directory in the container
WORKDIR /usr/src/app
# Run the JAR file
CMD ["java", "-jar", "test_shopping_site.jar"]
```
  
</div>
