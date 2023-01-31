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
