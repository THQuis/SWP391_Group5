# Assignment PRJ301-Group 2

## Members:
1. Trương Hoàng Quí  
2. Lâm Thị Ngọc Hân  
3. Lê Thị Trà Mi

## Topic: Online Fashion Shop - Unistyle Shop

### 1. Requirements:

#### Name of your system:
Unistyle Shop (An online store selling UNISEX clothing designed to fit both men and women.)

#### What is the purpose of the system?:
The purpose of the system is to provide an online platform that allows customers to browse, shop, and manage T-shirt(UNISEXUNISEX) inventory conveniently. The system aims to simplify the shopping experience by offering a user-friendly interface, search features, payment, and security. It helps administrators manage product information, track orders, and maintain inventory.

#### Who use the system?:
- **Customers**: Individuals looking to purchase T-shirts online. Users who want to browse collections, view product details, and place orders.
- **Administrators**: Staff managing the store, responsible for adding, updating, and managing product information and order data.

### List all features your system can do, arrange the features in a specific classification.:
## USER AND CUSTOMERS
1. **Home Page:**  
   - Displays a list of  products.  
   - Provides basic information about the store (e.g., "Affordable, high-quality fashion shop").  
   - Navigation buttons to pages such as: product categories, cart, and login.

2. **Product Listing Page:**  
   - Displays products by category (Men's T-shirts/Women's T-shirts).  
   - Basic information for each product: name, price, and image.

3. **Product Detail Page:**  
   - Displays a larger image of the product, description (size, color, material), price, and a "Add to Cart" button.

4. **Cart Page:**  
   - Displays a list of selected products, including: name, quantity, price, and total amount.  
   - Basic functions: remove products .

5. **Simple Checkout Page:**  
   - Customers enter shipping information ( address, phone number).  
   - Displays product list and total amount, along with a "Confirm Order" button.

6. **Login and Registration (Basic Authentication):**  
   - **Registration:** Enter email, password, name, and store information in the database.  

7. **Contact Page:**  
   - Displays contact information (phone number, email, address).  
   - Simple form for customers to submit questions/feedback (save to the database or send email).

## ADMIN
### Product Management:
- **Add new product**: Enter product information such as name, price, description, image, size, and color.
- **Update product**: Edit existing product information.
- **Delete product**: Remove product from the system.

### Order Management:
- **View order list**: Display all placed orders.
- **Update order status**: Change order status (processing, shipped, canceled, ...).
- **View order details**: Display detailed information of each order, including products, quantity, price, and customer information.

### Customer Management:
- **View customer list**: Display information of all registered customers.
- **Update customer information**: Edit personal information of customers.

### 2. Wireframe or screenshots of the system
- **Draw a site map which describe how your UIs link together**


![Image](https://github.com/user-attachments/assets/69ff893b-139b-49de-946f-4c3983995ab7)

- **Draw a wireframe of your expected UIs or screenshots of GUIs**
   + Home:
  ![Image](https://github.com/user-attachments/assets/e0eb276b-ed33-4450-ba2d-dceaae939c95)
    
   + About:
![Image](https://github.com/user-attachments/assets/ad897ce8-8f74-468d-9252-fe3901243e01)

   + Login
![Image](https://github.com/user-attachments/assets/386bff00-680a-466d-bb30-b8b33961c531)

   + My Account
![Image](https://github.com/user-attachments/assets/ea591650-4934-409d-bd51-1e66a2a9611f)

   + Order
![Image](https://github.com/user-attachments/assets/c585176d-7c8e-4473-ad2c-17977defa305)



   + Product
![Image](https://github.com/user-attachments/assets/726c107f-f04e-40ef-b1c8-c135420a3f2c)

   + Product detail
![image](https://github.com/user-attachments/assets/e2c0695f-2ff6-4c15-9fbc-a8ab11a80266)



   + Cart
![image](https://github.com/user-attachments/assets/1b5c0e34-2bef-44f7-98b2-e63a5717934d)


   + Simple Checkout
![image](https://github.com/user-attachments/assets/967cbbb4-08f7-4e29-824f-4463a1173ffc)


   + Contact
![image](https://github.com/user-attachments/assets/a1e9136f-9f88-4ca4-a8d2-6890d109947d)


   
   ## Admin
  + Order Manger
![image](https://github.com/user-attachments/assets/0741bb62-7bf3-425a-a8f9-726f2e6b3301)


   + User Manager
![image](https://github.com/user-attachments/assets/70733352-053a-44ef-b6d4-607e1637f80d)



   + Product Manager
![image](https://github.com/user-attachments/assets/9fae5288-5e9d-425d-beea-6627db8e2fa4)
![image](https://github.com/user-attachments/assets/5d85d842-99f8-4ec9-9727-68624c28aec0)



### 3.Database design
![Image](https://github.com/user-attachments/assets/178d1568-1486-415c-a2b9-421295e7b85f)


### 4. Flowchart and configuration program:

![Image](https://github.com/user-attachments/assets/6914aa58-3583-489d-b59e-26299d430204)
![Image](https://github.com/user-attachments/assets/8bfcb212-78bb-4f46-b1c5-23d9f1b09835)
![Image](https://github.com/user-attachments/assets/49582b64-57b9-4838-aac2-dea4bba62c77)


### 5. Conclusion and discussion:
After completing the project, the team realized that designing a website is not as simple as conceptualizing ideas, drawing site maps, or sketching layouts. It is a long process that begins with building the database, designing the interface, and programming backend functionalities. Although many important parts were completed, there were still several shortcomings during the presentation, especially in the product details section, product search, anonymous browsing, and inventory management. These functionalities need to be improved to display information more effectively, search more accurately, and allow users to access and view products without requiring a mandatory login.

A standout feature of the website is the flexible redirect functionality designed to optimize the experience for each type of user. Specifically, when a user logs into the system, if the account belongs to the Admin role, they will be redirected to the admin Dashboard page, where they can manage products, customers, orders, and also view the site as a regular user. The cart and checkout features are also designed to be simple, enabling users to easily add products to the cart and make payments quickly. The website interface is built with a simple, user-friendly style that focuses on the user experience and aligns with the customer's objectives.

From this project, the team learned that planning and dividing tasks effectively are crucial in teamwork. Additionally, it's important to focus on areas where the team feels most confident to contribute effectively to the project. More importantly, understanding the code is essential for troubleshooting when issues arise. The bug-fixing process, despite its challenges, helped the team learn and significantly improve their programming skills.




