---
layout: layouts/post.njk
title: What is Jenkins?
thumbnail: /assets/images/devops/jenkins-butler.png
description: This post briefly discusses adding a web hook to a Jenkins project
date: 2023-02-01
author: Morgan Walsh
tags:
  - Jenkins
  - DevOps
---

# Jenkins and WebHooks

WebHooks are used to send information across a network when some event happens. A common case is code was pushed to a certain branch
on GitHub, which triggers a request to a build server. The build server acknowledges this request and acts accordingly, usually 
triggering the build process.

## Adding a hook to a project

In a Jenkins project, select **Configure**:

![image](https://user-images.githubusercontent.com/29315632/216030245-f9bf3b64-5a1f-42a9-9afb-b2637134db7d.png)

Select the **GitHub hook trigger for GITScm polling** option:

![image](https://user-images.githubusercontent.com/29315632/216030412-b4522a2f-1959-4711-a422-17b99bd2b240.png)

Then select the **Save** button, this sets the Jenkins instance to listen on `hostname:port/github-webhook/`. Once Jenkins has been 
setup to listen for GitHub hooks, a webhook will need to be created in the GitHub repository which points to the Jenkins instance.
