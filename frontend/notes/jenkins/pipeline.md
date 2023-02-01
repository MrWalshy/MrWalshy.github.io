# Pipeline projects

A pipeline project in Jenkins allows us to specify *stages* to our build process, this allows us to execute specific commands in a specific 
order, such as running unit tests before then packaging the application to a file.

## Creating a Pipeline project

When creating a new project, select the **Pipeline** option:

![image](https://user-images.githubusercontent.com/29315632/216035689-df67e533-6019-43a4-b47b-0320f38049b6.png)

Once you have created the project, under **Configure**, set the **Definition** to *Pipeline script from SCM*. This will allow you to 
configure a SCM repository to pull the project from, it is expected that a `Jenkinsfile` exists in the root of the repository.

### Jenkinsfile

