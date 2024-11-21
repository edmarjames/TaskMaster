# Table of contents
+ [Introduction](#TaskMaster)
+ [Features](#features)
+ [Upcoming new features](#upcoming-new-features)
+ [Mobile responsiveness](#mobile-responsiveness)
+ [Installation](#installation)
+ [Project status](#project-status)
+ [Languages and tools](#language-and-tools)

# TaskMaster

TaskMaster is a simple to-do-list and notes taking app. I initially created this project to apply what I learned on AngularJS for creating Single Page Applications. I has simple functionalities such as creating a task with a deadline, taking notes and you can customize it's card appearance by changing it's color. It also has an admin dashboard for admin user to user management and visibility to all tasks and notes.

Now, let's get an quick run through on it's built. 

+ For the Frontend, I used AngularJS because I wanted to explore other JavaScript frameworks. As you may notice, the color scheme of the user interface is not what we commonly see on web applications. The reason is that I attempted to implement the new design trend which is Neobrutalism or Neu brutalism, which is currently being adopted by popular sites such as Figma, Gumroad and NFT websites.
This project is somewhat experimental for me, which is why I decided to incorporate it into my web application as well.

+ For the backend, I built a REST API using Django Rest Framework to facilitate data transfer between the backend and frontend.

## Features

1. **Login** - for the login page, I use bootstrap components. For the backend validations it determines if the username or password is incorrect then it will show an error message.

2. **Register** - for the sign up page, I also use bootstrap components. The following are the backend validations, checks if the username is already taken or already existing in the database, checks if the email provided is valid, validates if the password and confirm password match and all fields are required.

3. **View all task** - The authenticated user can view all his/her created task and can modify them using the action buttons on the bottom, the user will also be notified of the overdue task since an overdue badge should appear on the top right corner of the task card.

4. **View specific task** - The authenticated user can view all the details of a single task by click the **more details** button of the action buttons.

5. **Create task** - Creating a task only requires a title, description, color and a deadline. The following are the validations, checks if the title is already taken or already existing in the database, checks if the deadline provided is in the past.

6. **Update task** - For updating a task, an authenticated user can edit any fields that he/she wants to modify, however before doing so the edit button should be click first so that the fields and save button will be enabled. The following are the validations, checks if the taskId is existing and if the updated title is the same with other existing tasks.

7. **Delete task** - Deleting a task is just easy, the authenticated user just need to click the delete button of the task to be deleted then a confirmation modal will appear before proceeding on deletion.

8. **Archive task** - The authenticated user can also archive a task by simply clicking the archive button of the task to be archived then a confirmation modal will appear before proceeding on archiving, once done the archive button will be replaced with activate button.

9. **Activate task** - The authenticated user can also activate a task by simply clicking the activate button of the task to be activated then a confirmation modal will appear before proceeding on activating, once done the activate button will be replaced with archive button.

10. **View all note** - The authenticated user can view all his/her created notes and can modify them using the action buttons on the bottom.

11. **View specific note** - The authenticated user can view all the details of a single note by click the **more details** button of the action buttons.

10. **Create a note** - Creating a note only requires a title, content and color. For the validation it checks if the title is already taken or already existing in the database.

11. **Update note** - For updating a note, an authenticated user can edit any fields that he/she wants to modify, however before doing so the edit button should be click first so that the fields and save button will be enabled. The following are the validations, checks if the noteId is existing and if the updated title is the same with other existing note.

12. **Delete note** - Deleting a note is just easy, the authenticated user just need to click the delete button of the note to be deleted then a confirmation modal will appear before proceeding on deletion.

13. **Admin dashboard** - besides from the normal user, an admin can login to the app and manage users and view all tasks and notes.

    1. **View all users** - admin can view all users registered to the application.

        + **Set user as admin** - admin has the choice to pick a normal user and provide admin privileges to it.

        + **Set as normal user** - admin can also revoke admin privileges and revert a user back to a normal user.

    2. **View all tasks** - admin has a read only access to all created tasks of all users.

    3. **View all notes** - admin has a read only access to all created notes of all users. 

## <a name="#upcoming-new-features"></a>Upcoming New Features

I am planning to make the Task and Note card to be in a drag and drop behavior so that arranging and sorting will be easy. Also, deleting a task/note will be easy when dragging it to a trash bin.

## <a name="#mobile-responsiveness"><a/>Mobile responsiveness

TaskMaster is also responsive on various screen sizes such as mobile, tablets, laptops and desktop screens.
I followed the bootstrap breakpoints to make the frontend responsive on the said screen sizes. 

Here are some snapshots.

+ **Mobile** Screen size (576px)

<details><summary>Click to expand</summary>
<p align="center" style="display: flex; justify-content: space-around;">
    <img src="https://github.com/edmarjames/TaskMaster/assets/112933982/48c5acb5-b36d-488e-be73-7d6994acdbe5" width="575" height="896"/>
</p>
<p align="center" style="display: flex; justify-content: space-around;">
    <img src="https://github.com/edmarjames/TaskMaster/assets/112933982/06532fdf-0188-4858-9bf1-e223dfeda930" width="579" height="896"/>
</p>
</details>

+ **Medium** Screen size (768px)

<details><summary>Click to expand</summary>
<p align="center" style="display: flex; justify-content: space-around;">
    <img src="https://github.com/edmarjames/TaskMaster/assets/112933982/94befe79-1e32-4555-a42d-90f9487c82a8" width="770" height="892"/>
</p>
<p align="center" style="display: flex; justify-content: space-around;">
    <img src="https://github.com/edmarjames/TaskMaster/assets/112933982/145d56c0-d1ac-46d0-aed8-fcc479c54919" width="767" height="890"/>
</p>
</details>

+ **Large** Screen size (992px)

<details><summary>Click to expand</summary>
<p align="center" style="display: flex; justify-content: space-around;">
    <img src="https://github.com/edmarjames/TaskMaster/assets/112933982/52f6fbd1-97b9-4d41-b900-673cc922e68f" width="991" height="892"/>
</p>
<p align="center" style="display: flex; justify-content: space-around;">
    <img src="https://github.com/edmarjames/TaskMaster/assets/112933982/08fd52ac-cd8d-4f82-acde-a81c5779aa7d" width="990" height="891"/>
</p>
<p align="center" style="display: flex; justify-content: space-around;">
    <img src="https://github.com/edmarjames/TaskMaster/assets/112933982/70500166-5246-4915-bab2-28715ba99ff9" width="990" height="892"/>
</p>
</details>

## Installation

If you want to checkout the code and install it on your local machine you may clone my repo by simply running this command.

### `git clone https://github.com/edmarjames/TaskMaster.git`

Then you may use the LiveServer VS code extension to run the index.html to your local server

The page will reload when you make changes.\
You may also see any lint errors in the console.

## <a name="#project-status"></a>Project Status

As of now, I'm taking a break on development since I am also going to be busy on my day job. But please feel free to check the code and let me know if you find any bugs or potential new features.

## <a name="#language-and-tools"></a>Languages and tools used
<p align="center" style="display: flex; justify-content: space-around;"> 
    <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a> 
    <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a> 
    <a href="https://getbootstrap.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-plain-wordmark.svg" alt="bootstrap" width="40" height="40"/> </a> 
    <a href="https://angular.io" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/angularjs/angularjs-original-wordmark.svg" alt="angularjs" width="40" height="40"/> </a>     
    <a href="https://www.python.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" alt="python" width="40" height="40"/> </a> 
    <a href="https://www.djangoproject.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.worldvectorlogo.com/logos/django.svg" alt="django" width="40" height="40"/> </a>             
    <a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> </a> 
</p>
