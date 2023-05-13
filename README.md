# Table of contents
+ [Introduction](#TaskMaster)
+ [Features](#features)
+ [Upcoming new features](#upcoming-new-features)
+ [Mobile responsiveness](#mobile-responsiveness)
+ [Installation](#installation)
+ [Roadmap](#roadmap)
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

Since my project does not have features yet that are present on popular E-commerce sites nowadays. I am continously developing new features that will transform my app into a real and publishable one.

Here is an overview of the upcoming features

+ Add shipping address on checkout
+ Payment options
+ Order status
+ Order tracking
+ Order cancellation
+ Product review

## <a name="#mobile-responsiveness"><a/>Mobile responsiveness

BikeMeds is also responsive on various screen sizes such as mobile, tablets, laptops and desktop screens.
I followed the bootstrap breakpoints to make the frontend responsive on the said screen sizes. 

Here are some snapshots.

+ **Mobile** Screen size (576px)

<details><summary>Click to expand</summary>
![mobile-landing-page-2](/uploads/cbb6d25a135e81a37a4323898506c81f/mobile-landing-page-2.png)
![featured-products](/uploads/7a3ebd7448a1d38dbc7879d841274a74/featured-products.png)
![exclusive-product](/uploads/ce7d4a49a6051324c35e8233708529cc/exclusive-product.png)
![featured-brands](/uploads/06c05d9da67e0c096bd9850378b24268/featured-brands.png)
![footer-new](/uploads/084e80a0d9282a544df5179b74cd49a2/footer-new.png)
</details>

+ **Medium** Screen size (768px)

<details><summary>Click to expand</summary>
![products-medium](/uploads/76f408f15b8ff59ab5f6d7f530063d9c/products-medium.png)
![product-view-medium](/uploads/b1912c4a8f40ca714c8015ff7fedb3e2/product-view-medium.png)
![add-to-cart-medium](/uploads/64fe66305bd29a000a1eb13b0e2222ae/add-to-cart-medium.png)
</details>

+ **Large** Screen size (992px)

<details><summary>Click to expand</summary>
![register-large](/uploads/1417e02af45319c471a4c36dbb9df6f4/register-large.png)
![login-large](/uploads/cd8ec68d52f13b1c7f08b27fc813e311/login-large.png)
![products-catalog-large](/uploads/af3f756dbcc8943d483df0876e879199/products-catalog-large.png)
![order-history-large](/uploads/011787a99fb3f8df3465631257477550/order-history-large.png)
</details>

## Installation

If you want to checkout the code and install it on your local machine you may clone my repo by simply running this command.

### `git clone git@gitlab.com:batch-211-bautista/capstone-3-bautista.git`

Then install the packages by simply running.

### `npm install`

Then simply run this command to start it on your localhost.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Roadmap

For the future releases, I'm planning to follow the list of my upcoming new features listed above and I will also update this README file once I got new ideas along the way.

## <a name="#project-status"></a>Project Status

As of now, I'm taking a break on development since I am also going to be busy on Job hunting. But please feel free to check the code and let me know if you find any bugs or potential new features.

## <a name="#language-and-tools"></a>Languages and tools used
<p align="center">
    ![logo-mongodb-with-name](/uploads/473d6de9b4ddb41f2672e5c38c2626f1/logo-mongodb-with-name.png)
    ![logo-expressjs-with-name](/uploads/dfcf1922987758c737a560a5f6f3bad8/logo-expressjs-with-name.png)
    ![logo-react-with-name](/uploads/36557797de06919dd74e5ff42aceb7b3/logo-react-with-name.png)
    ![logo-nodejs-with-name](/uploads/14da34fb3cbab4055370f5f99db60ab2/logo-nodejs-with-name.png)
    ![logo-html5-with-name](/uploads/79f97d2ded15627023401e1165e7cf9f/logo-html5-with-name.png)
    ![logo-css3-with-name](/uploads/0de4e39e6f099a5721e7699c6c86a14e/logo-css3-with-name.png)
    ![logo-bootstrap-with-name](/uploads/bcb7ba7ea33a2b54d47fc7535813f2fa/logo-bootstrap-with-name.png)
    ![logo-javascript-with-name](/uploads/6d149caa9030fd32ef7a20c7724a0dd3/logo-javascript-with-name.png)
    ![logo-rest-with-name](/uploads/ed7d297e6498556aa8c658c060f1264b/logo-rest-with-name.png)
    ![logo-git-with-name](/uploads/7b9d20b158bbcb8ee9eeb85351f96a3d/logo-git-with-name.png)
    ![logo-postman-with-name](/uploads/3594a6094f0747b7c9d26b03627ecf42/logo-postman-with-name.png)
    ![logo-sublime-text-3-with-name](/uploads/de00ce74622a8826b978d075eb513dcf/logo-sublime-text-3-with-name.png)
    ![vercel](/uploads/afc6db5ff11c4b1c6dd89032ddf9b8ae/vercel.png)
</p>

## Other useful tools used

+ [Image cloud repository](https://imgbb.com/)
+ [Image background remover](https://www.remove.bg/upload)
+ [Da vinci resolve 18](https://www.blackmagicdesign.com/products/davinciresolve/whatsnew)
+ [Adobe illustrator](https://www.adobe.com/ph_en/products/illustrator/free-trial-download.html)
+ [Royalty free images](https://unsplash.com/)
+ [Gif and illustration creator](https://storyset.com/)
+ [Google fonts](https://fonts.google.com/specimen/Poppins?query=poppins)
+ [Boxicons](https://boxicons.com/)
+ [Box shadow creator](https://shadows.brumm.af/)
+ [Box shadow creator](https://neumorphism.io/#e2eee8)
