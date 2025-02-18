# Node.js Project

The aim of this project is to create a Node.js application that acts as a REST API for a note-taking application.

Think of it like this, an ideal note taking application would allow you to take notes from any medium - a web application, and OS-specific application, maybe from a terminal even.
Regardless, the point of this project is not to create the application for different platforms, but to build an API that can potentially be used by such applications.

## Operations of the API

The focus is to have the most fundamental operations of an API for a note-taking app.

- Creating notes
- Editing notes
- Removing notes
- Viewing notes

For the sake of simplicity, let's not worry about users and access control.

## Some notes and expectations

- Try to think about **the importance of decoupling the application's core logic from the technology that is needed to make the operations work.** For example, the core application should not care about whether the notes are going to be stored in a SQL database, in a Git repository, or in a filesystem (e.g. S3 Bucket, local file directory, etc.).
- For now, the expected traffic is not high at all for this API. But what if we wanted to serve 100s of users? Will the API be able to handle this increased level of traffic? **Try to use this point as a way of modelling your application's architecture.**
- If you decide to use a database (SQL or NoSQL), **use raw SQL queries instead of ORMs** like Prisma, Sequelize or Drizzle. Most databases have npm packages for writing queries, so use them instead (e.g. `pg` for Postgres, `mongoose` for MongoDB, etc).
- We did not get a chance to discuss this, but think of request and response validation. What this means is, if a request is sent to an endpoint the application should be able to quickly make a decision and respond - does the request match the schema of what is expected? if it does, all good. but if it doesn't, immediately respond back with an error. **Even if you are not able to implement this (due to less time or something), try to think about how you would do this.**


### Starter:

## 1- As a starter of the idea, the most careed targets being starting from
    ## a. Develop a CRUD operation
    ## b. Develop your system dynamic as being used for 3 items:
        # I. CLI Application.
        # II. Web Application.
        # III. OS application.

look at the [design](https://excalidraw.com/#json=ljE00DxM6ovPV1YJp-fG0,DbR4-IlGgShgGuzoDDqt-g) below for V:1.0.0, as initial idea.
![image](https://github.com/user-attachments/assets/bee812aa-3d64-4f5d-b1b2-a8c2be80aa14)
