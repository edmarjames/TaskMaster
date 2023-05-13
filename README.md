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

1. **Login** - for the login page, I use Primereact's formik form with built in input validations and password peek. For the backend validations it determines if the username/email or password is incorrect then it will show you an error message.

2. **Sign up** - for the sign up page, I also use Primereact's formik form with built in input validation for email, password peek and password suggestion. For the backend validation it will show an error message if you try to sign up using an email that is already taken or already existing in the database.

3. **Featured products** - on the landing page, there is a featured products section. Non-authenticated users can view the details of the product, but they need to login to perform operations such as add to cart or buy now.

4. **Exclusive product** - just beneath the featured products there is an exclusive product section where it only shows one product. Non-authenticated users can view the details of the product, but they need to login to perform operations such as add to cart or buy now.

5. **View profile** - authenticated user's can view their basic details such as fullname, email and mobile number.

    + **Change password** - inside the view profile page, authenticated user's have the ability to update their password. They just need to enter their old password and their new password. However, the old password must be correct to complete the operation. Otherwise it will show an error message saying that the old password did not match.

6. **Products catalog** - non-authenticated and authenticated users can view the active products catalog and see the details of a certain product that they want. For non-authenticated users they must login first to perform operations such as add to cart and checkout.

    + **Single product view** - upon entering the products catalog page, non-authenticated and authenticated users can view more details of a certain product by clicking the learn more button at the bottom of the product card.

7. **Add to cart** - authenticated users have the ability to add a single or multiple products to their cart and they can modify the quantity of a specific product, remove it from the cart or checkout the product.

    + **Update product quantity** - authenticated users have the ability to update the quantity of a certain product upon adding it to cart.

    + **Remove single product** - authenticated users have the choice to remove a single product from the cart.

    + **Remove group of products** - if the user add multiple products to the cart at the same time, it will be considered a group of products, hence it can also be removed by group.

    + **Checkout** - authenticated users have the choice to checkout a single or multiple products from their cart.

8. **Buy now** - authenticated users can buy a single or multiple product. Upon successfull checkout the order will appear on the order history.

9. **Item Queue** - if a user is adding multiple products to the cart. He/she will have the ability to check the item queue which contains the previous products selected. As of now it can only show the last item added on queue, however there is a helper badge showing how many items are in the queue. From there the user can directly add the products to his/her cart. The same logic applies when creating multiple orders at the same time.

10. **Order history** - authenticated users can view their order history which contains their orders from direct checkout, ***Buy now*** or checkout from cart.

11. **Admin dashboard** - besides from the normal user, an admin can login to the app and manage products, users and view all orders.

    1. **View all products** - admin can view all products either it is an archived or active product.

        + **Add new product** - admin can add a new product to the database. For the backend validation, the operation will fail if the admin input a product name that already exists on the database. To avoid duplicate products and the product name will also serve as a unique identifier.

        + **Edit product details** - admin can edit the details of a certain product, there is also a live preview of the product image upon updating the image source text field.

        + **Archive product** - admin have the ability to archive a product if it is out of stock or for phase out.

        + **Activate product** - admin also have the ability to activate a product from being archived. Upon activating it, normal users will see it automatically on the products catalog page.

    2. **View all users** - admin can view all normal users who are currently registered on the app.

        + **Set as admin** - admin has the choice to pick a normal user and provide admin privilages to it.

        + **Set as normal user** - admin can also revoke admin privilages and revert a user back to a normal user.

    3. **View all user's order** - admin can also view all orders created by all users.

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
