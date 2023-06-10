
const client = contentful.createClient({
    // This is the space ID.A space is like a project folder in Contentful terms
    space: "hxzkgznahgg6",
    //This is the access token for this space.Normally you get both ID and the token in the Contentful web app
    accessToken: "WtD2WniPahd6Zg61hCIxLbuptwZWXeRscVcM9klfHeY"
});
// console.log(client)

// variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// Cart
let cart = [];
// Initialize an empty array called cart to store cart items.

// buttons
let buttonsDOM = [];
// Initialize an empty array called buttonsDOM to store button elements.

// getting the products
// Define the Products class to handle fetching products from "products.json".

class Products {
    async getProducts() {
        try {

            let contentful = await client.getEntries({
                content_type: "cosyHouse"
            })
            console.log(contentful)


            let result = await fetch("products.json");
            // Fetch the product data from the "products.json" file and store the response in the result variable.

            let data = await result.json();
            // Parse the JSON data from the result variable and store it in the data variable.

            let products = contentful.items;
            // Extract the products array from the data variable and store it in the products variable.

            products = products.map(item => {
                // Map over each item in the products array and transform it.
                
                const { title, price } = item.fields;
                // Destructure the title and price properties from the item.fields object.
                
                const { id } = item.sys;
                // Destructure the id property from the item.sys object.
                
                const image = item.fields.image.fields.file.url;
                // Extract the URL of the image file from the item.fields.image.fields.file.url property.
                
                return { title, price, id, image };
                // Return an object with the extracted properties (title, price, id, and image).
            });

            return products;
            // Return the transformed products array.
        } catch (error) {
            console.log(error);
            // If an error occurs during the fetching or parsing of data, log the error to the console.
        }
    }
}

// display products
// Define the UI class to handle displaying products and interacting with the UI.

class UI {
    displayProducts(products) {
        // console.log(products);
        // Log the products array to the console.

        let result = '';
        // Declare an empty string variable called result to store the HTML markup for the products.

        products.forEach(product => {
            // Loop over each product in the products array.
            
            result += `
             <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img src=${product.image}
                     alt="product"
                     class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to cart
                    </button>
                </div>
                <h3> ${product.title}</h3>
                <h4>£${product.price}</h4>
            </article>
            <!-- end of single product -->`;
            // Append the HTML markup for each product to the result string.
        });

        productsDOM.innerHTML = result;
        // Set the innerHTML of the productsDOM element to the result string, effectively rendering the products on the page.
    }
    
    // getBagButtons
    // Define the getBagButtons method in the UI class to handle the functionality of the "add to cart" buttons.

    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        // Select all elements with the class "bag-btn" from the DOM and convert the NodeList to an array using the spread operator.

        buttonsDOM = buttons;
        // Assign the buttons array to the buttonsDOM variable.

        buttons.forEach(button => {
            let id = button.dataset.id;
            // Retrieve the data-id attribute value from each button element and store it in the id variable.

            let inCart = cart.find(item => item.id === id);
            // Check if the current product is already in the cart based on its id.

            if (inCart) {
                button.innerHTML = "In Cart";
                button.disable = true;
                // If the product is in the cart, update the button text to "In Cart" and disable the button.
            } else {
                button.addEventListener("click", (event) => {
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;
                    // If the product is not in the cart, add a click event listener to the button that triggers the following actions:

                    let cartItem = { ...Storage.getProduct(id), amount: 1 };
                    // Create a new cart item object by merging the product data retrieved from local storage with an amount property set to 1.

                    cart = [...cart, cartItem];
                    // Add the new cart item to the cart array.

                    Storage.saveCart(cart);
                    // Save the updated cart array in local storage.

                    this.setCartValues(cart);
                    // Update the cart values displayed on the UI.

                    this.addCartItem(cartItem);
                    // Add the new cart item to the cart content on the UI.

                    this.showCart(cartItem);
                    // Show the cart overlay and cart display.
                });
            }
        });
    }
    // setCartValues
    // Define the setCartValues method in the UI class to update the cart total and item count displayed on the UI.

    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        // Declare variables to store the temporary total and item count.

        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
            // Loop over each item in the cart and calculate the temporary total and item count based on the price and amount of each item.
        });

        cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2));
        cartItems.innerHTML = itemsTotal;
        // Update the cart total and item count displayed on the UI.
    }

    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        // Create a new <div> element with the class "cart-item".

        div.innerHTML =
            ` <img src=${item.image} alt="product">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>£${item.price}</h5>
                        <span class=" remove-item" data-id=${item.id}>remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up"data-id=${item.id}></i>
                        <p class="item-amount">${item.amount}</p>
                        <i class="fas fa-chevron-down"data-id=${item.id}></i>
                    </div>`
        // Set the innerHTML of the created <div> element to display the cart item's image, title, price, and the increase/decrease quantity buttons.

        cartContent.appendChild(div);
        // console.log(cartContent);
        // Append the created <div> element to the cartContent element on the UI.

    }
    // showCart
    // Define the showCart method in the UI class to show the cart overlay and cart display.
    showCart() {
        cartOverlay.classList.add('seeThroughBackground');
        cartDOM.classList.add('showCart');
        // Add the "seeThroughBackground" class to the cartOverlay element and the "showCart" class to the cartDOM element to display the cart overlay and cart display.

    }
    // setupAPP
    // Define the setupAPP method in the UI class to set up the initial state of the UI when the page loads.
    setupAPP() {
        cart = Storage.getCart();
        // Retrieve the cart data from local storage and assign it to the cart variable.

        this.setCartValues(cart);
        // Update the cart values displayed on the UI.

        this.populateCart(cart)
        // Populate the cart content on the UI with the items from the cart.

        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
        // Add click event listeners to the cartBtn and closeCartBtn elements to show/hide the cart overlay and cart display.
    }

    // populateCart
    // Define the populateCart method in the UI class to populate the cart content on the UI with the items from the cart.
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
        // Loop over each item in the cart and add it to the cart content on the UI.

    }

    // hideCart
    // Define the hideCart method in the UI class to hide the cart overlay and cart display.
    hideCart() {
        cartOverlay.classList.remove('seeThroughBackground');
        cartDOM.classList.remove('showCart');
        // Remove the "seeThroughBackground" class from the cartOverlay element and the "showCart" class from the cartDOM element to hide the cart overlay and cart display.

    }

    // cartLogic
    // Define the cartLogic method in the UI class to handle the cart functionality.
    cartLogic() {
        //clear cart button
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });
        
        // Add a click event listener to the clearCartBtn element to clear the cart when clicked.

        // cart functionality
        cartContent.addEventListener('click', event => {
            // Listen for a click event on the cartContent element.

            // console.log(event.target);
            if (event.target.classList.contains('remove-item'))
                // Check if the clicked element has the 'remove-item' class.

            {
                let removeItem = event.target;
                // Store the clicked element (the remove button) in the removeItem variable.

                let id = removeItem.dataset.id;
                // Get the 'data-id' attribute value of the remove button, which corresponds to the ID of the cart item to be removed.

                cartContent.removeChild(removeItem.parentElement.parentElement);
                // Remove the entire cart item's DOM element from the cartContent.

                this.removeItem(id);
                // Call the removeItem method of the UI instance to remove the item from the cart.

            } else if (event.target.classList.contains("fa-chevron-up")) {
                // Check if the clicked element has the 'fa-chevron-up' class.

                let addAmount = event.target;
                // Store the clicked element (the increase quantity chevron) in the addAmount variable.

                let id = addAmount.dataset.id;
                // Get the 'data-id' attribute value of the increase quantity chevron, which corresponds to the ID of the cart item.

                let tempItem = cart.find(item => item.id === id);
                // Find the cart item with the matching ID and store it in the tempItem variable.

                tempItem.amount = tempItem.amount + 1;
                // Increase the amount/quantity of the cart item by 1.

                Storage.saveCart(cart);
                // Save the updated cart in the local storage.

                this.setCartValues(cart);
                // Update the cart values displayed on the UI.

                addAmount.nextElementSibling.innerHTML = tempItem.amount
                // Update the displayed quantity of the cart item in the UI.

            } else if (event.target.classList.contains("fa-chevron-down")) {
                // Check if the clicked element has the 'fa-chevron-down' class.

                let lowerAmount = event.target;
                // Store the clicked element (the decrease quantity chevron) in the lowerAmount variable.

                let id = lowerAmount.dataset.id;
                // Get the 'data-id' attribute value of the decrease quantity chevron, which corresponds to the ID of the cart item.

                let tempItem = cart.find(item => item.id === id);
                // Find the cart item with the matching ID and store it in the tempItem variable.

                tempItem.amount = tempItem.amount - 1;
                // Decrease the amount/quantity of the cart item by 1.

                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    // If the updated quantity is still greater than 0, save the updated cart in the local storage.

                    this.setCartValues(cart);
                    // Update the cart values displayed on the UI.

                    lowerAmount.previousElementSibling.innerHTML = tempItem.amount
                    // Update the displayed quantity of the cart item in the UI.


                } else {
                    cartContents.removeChild(lowerAmount.parentElement.parentElement)
                    // If the updated quantity becomes 0 or less, remove the corresponding cart item's DOM element from the cartContent.

                    this.removeItem(id)
                    // Call the removeItem method of the UI instance to remove the item from the cart.

                }

            }


        });
    }
   
    // clearCart
    // Define the clearCart method in the UI class to clear the cart.
     clearCart() {
         let cartItems = cart.map(item => item.id);
         // Create an array of cart item ids.

        // console.log(cartItems);
         cartItems.forEach(id => this.removeItem(id));
         // Loop over each cart item id and remove it from the cart.

        console.log(cartContent.children)

        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
         // Remove all child elements from the cartContent element on the UI.

         this.hideCart();
         // Hide the cart overlay and cart display.

     }
    // removeItem
    // Define the removeItem method in the UI class to remove a specific item from the cart.

    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        // Filter the cart array to exclude the item with the specified id.

        this.setCartValues(cart);
        // Update the cart values displayed on the UI.

        Storage.saveCart(cart);
        // Save the updated cart array in local storage.

        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fa fa-shopping-cart"></i> add to cart`
        // Retrieve the button element associated with the removed item and re-enable it with the original "add to cart" text.

    }

    // getSingleButton
    // Define the getSingleButton method in the UI class to retrieve the button element associated with a specific item id.
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
        // Find the button element in the buttonsDOM array that matches the specified item id and return it.

    }
}

// local storage 
class Storage {
    static saveProduct(products) {
        localStorage.setItem("products", JSON.stringify(products)
        );
        // Save the products array to local storage as a JSON string.

    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        // Retrieve the products array from local storage and parse it back into a JavaScript object.

        return products.find(product => product.id === id);
        // Find and return the product with the matching id from the products array.


    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
        // Save the cart array to local storage as a JSON string.

    }
    static getCart() {
        return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    }
    // Retrieve the cart array from local storage, parse it back into a JavaScript object, and return it.
    // If the cart array doesn't exist in local storage, return an empty array.

}

//Event Listener

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    // Create instances of the UI and Products classes.

    //setup app
    ui.setupAPP();
    // Call the `setupAPP` method of the UI instance, which initializes the app's cart, sets cart values, and attaches event listeners.


    // get all products
    // products.getProducts().then(products => console.log(products));
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProduct(products);
    }).then(() => { 
        ui.getBagButtons();
        ui.cartLogic()
    });
    // Retrieve the products using the `getProducts` method of the Products instance.
    // Once the products are retrieved, call the `displayProducts` method of the UI instance to render them on the page.
    // Save the products in local storage using the `saveProduct` method of the Storage class.
    // After that, call the `getBagButtons` and `cartLogic` methods of the UI instance to set up the cart functionality.
});