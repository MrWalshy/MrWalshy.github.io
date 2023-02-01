# Pipeline projects

A pipeline project in Jenkins allows us to specify *stages* to our build process, this allows us to execute specific commands in a specific 
order, such as running unit tests before then packaging the application to a file.

## Creating a Pipeline project

When creating a new project, select the **Pipeline** option:

![image](https://user-images.githubusercontent.com/29315632/216035689-df67e533-6019-43a4-b47b-0320f38049b6.png)

Once you have created the project, under **Configure**, set the **Definition** to *Pipeline script from SCM*. This will allow you to configure a SCM repository to pull the project from, it is expected that a `Jenkinsfile` exists in the root of the repository.

![image](https://user-images.githubusercontent.com/29315632/216044390-d35313c1-23e4-4816-8216-9cf1f24ffde0.png)

At the bottom of the **Pipeline** section, deselect **Lightweight checkout** if you are using web hooks in your project. This option may interfere with the hook when an event is received on the `host/github-webhook/` endpoint:

![image](https://user-images.githubusercontent.com/29315632/216044903-229c1230-033b-48eb-83ab-a9c883cd6236.png)

### Jenkinsfile

The `Jenkinsfile` is a special file that a pipeline Jenkins project will automatically look for in your repository, it contains a Groovy script instructing Jenkins what stages exist in the pipeline, and the steps to carry out in those stages.

> There are two possible syntaxes to use, declarative and script. We are using the declarative approach here.

First, we create the `pipeline` block:

```groovy
pipeline{

}
```

This defines a pipeline to be executed by Jenkins, a mandatory `agent` must be specified:

```groovy
pipeline{
  agent any
}
```

This `agent` will set up the executor for the pipeline and clone down the registered SCM repository. Each pipeline then has some `stages`:

```groovy
pipeline{
  agent any
  stages{
    stage("Build"){
    
    }
    stage("Deploy"){
    
    }
  }
}
```

A `stage` represents a sequence of commands to execute, we can pass shell commands to the `sh` command:

```groovy
pipeline{
  agent any
  stages{
    stage("Build"){
      steps{
        sh "echo Building"
      }
    }
    stage("Deploy"){
      steps{
        sh "echo Deploying"
      }
    }
  }
}
```
