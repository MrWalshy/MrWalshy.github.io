@docArgs()
```
"title": "Sharing Docker Images | morganwalsh.dev", 
"links": ["/style.css"],
"scripts": ["/scripts/common.js"],
"date": "02/02/2023"
```

<div class="p-16 w-80 w-md-100 ml-auto mr-auto">

# Sharing Docker images

When we run the `docker pull` command, it first looks locally for the image; if it doesn't find the image, it searches 
the registry assigned to Docker. By default, this registry is [Docker Hub](https://hub.docker.com/).

> If you don't have an account, register one for free!

Once you have registered an account, in your local machines console type:
  
```sh
docker login
```

Enter your username and password when prompted, also be sure to type your username in all lowercase even if you signed up 
with username that has a mix of upper- and lower-case letters. So I would type `dingodoobie` instead of `dingoDoobie`.

## Pushing an image to Docker Hub

If you don't have an image to push, build the image from [Dockerfiles](/notes/docker/dockerfiles.html) and then resume these 
instructions. 
  
If you run `docker images`, your output will contain any images stored locally:

```sh
REPOSITORY                 TAG       IMAGE ID       CREATED         SIZE
selenium_test_site         latest    025b45f1c225   5 seconds ago   490MB
openjdk                    17        5e28ba2b4cdb   9 months ago    471MB
```
  
As we want to upload the `selenium_test_site` image to Docker Hub, we will need to retag it to follow a specific format:
  
```sh
docker tag <IMAGE> <USERNAME>/<REPOSITORY>:<SEMVER_VERSION>
```

We specify the `<USERNAME>` of our account so the image can be located on Dockerhub, the `<REPOSITORY>` is the unique 
name given for the project/image and the version is its version. I'll tag my image to use my username, `dingodoobie` and a 
version of `1.0.0`:

```sh
docker tag selenium_test_site dingodoobie/selenium_test_site:1.0.0
```

Running `docker images` will show our new image:
  
```sh
REPOSITORY                       TAG       IMAGE ID       CREATED         SIZE
dingodoobie/selenium_test_site   1.0.0     025b45f1c225   5 minutes ago   490MB
selenium_test_site               latest    025b45f1c225   5 minutes ago   490MB
openjdk                          17        5e28ba2b4cdb   9 months ago    471MB
```

We can then use the `docker push` command to push the image up to Docker Hub:
  
```sh
docker push dingodoobie/selenium_test_site:1.0.0
```
  
If everything went ok, we will see the image available on Docker Hub:
  
![image](https://user-images.githubusercontent.com/29315632/216311448-f71b0521-6bd5-4f32-8481-f5641757d22e.png)

We can then easily pull the image with `docker pull dingodoobie/selenium_test_site`.
  
</div>
