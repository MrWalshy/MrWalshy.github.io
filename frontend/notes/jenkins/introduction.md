# What is Jenkins?

Jenkins is a build server, a piece of software used in continuous integration and deployment.

## Creating a freestyle project

From the dashboard, add a new project. Set the item name and then the project type to **Freestyle project**.

![image](https://user-images.githubusercontent.com/29315632/215785477-3177e572-6f6e-4ca8-b42f-528b781c736d.png)

On the configuration page, if using Git, set **Source Code Management** to **Git**:

![image](https://user-images.githubusercontent.com/29315632/215785964-d56d4afd-00d3-473b-9b28-7725ec8026ff.png)

Enter a Git repository URL in the **Repository URL**. Set the branch to build your project from under **Branches to build**.

If you save the project, and then press **Build Now**, it will trigger a build of the project cloning from the specified repository and branch:

![image](https://user-images.githubusercontent.com/29315632/215789030-24e42ae2-4cdd-442f-a51e-3031ff125fc0.png)
 
 The builds show under the sidemenu on the project desktop. A green tick indicates the build was successful, a red cross indicates a failure.

### Dependencies

If your freestyle project requires dependencies, you should install these either on the build servers host or using a plugin in Jenkins.

## Adding build steps

A build step is some set of commands to execute when a build is triggered:

![image](https://user-images.githubusercontent.com/29315632/216031105-38782b02-a04b-49ea-9d90-c4f1e624da2f.png)

If we select **Execute shell**, this will execute a Linux shell command on the host system. For example, this can be used to access global installations of Maven for Java projects:

![image](https://user-images.githubusercontent.com/29315632/216031542-7ea714f9-0577-4406-9fa5-507ed9d8e361.png)

In my example, I have set the shebang to use `bash` and added the `mvn clean package` command to package a Java application which has been cloned from GitHub during the build process.
