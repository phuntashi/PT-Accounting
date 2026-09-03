/* =========================================================
   PHUNTSHOK'S ACCOUNTING SYSTEM
   COMPLETE app.js
   ========================================================= */

/* =========================================================
   PT ACCOUNTING SYSTEM
   USER MANAGEMENT & PERMISSION SYSTEM
   ========================================================= */


/* =========================================================
   CURRENT USER
   ========================================================= */

let currentUser = null;


/* =========================================================
   ROLE PERMISSIONS
   ========================================================= */

const rolePermissions = {

    Administrator: [
        "*"
    ],

    Accountant: [
        "dashboard",
        "accounts",
        "customers",
        "suppliers",
        "products",
        "sales",
        "purchases",
        "receipts",
        "payments",
        "journal",
        "ledger",
        "trial",
        "profit-loss",
        "balance-sheet",
        "settings"
    ],

    "Sales User": [
        "dashboard",
        "customers",
        "products",
        "sales",
        "receipts"
    ],

    "Purchase User": [
        "dashboard",
        "suppliers",
        "products",
        "purchases",
        "payments"
    ],

    Viewer: [
        "dashboard",
        "ledger",
        "trial",
        "profit-loss",
        "balance-sheet"
    ]

};


/* =========================================================
   INITIALIZE USERS
   ========================================================= */

function initializeUsers() {

    /*
     * Make sure users array exists
     */

    if (!Array.isArray(appData.users)) {

        appData.users = [];

    }


    /*
     * Find Administrator account
     */

    let adminUser =
        appData.users.find(
            user =>
                user &&
                user.username &&
                user.username.toLowerCase() ===
                "admin"
        );


    /*
     * Create Administrator
     * only if missing
     */

    if (!adminUser) {

        adminUser = {

            id:
                "USR-ADMIN",

            username:
                "admin",

            password:
                "admin123",

            fullName:
                "System Administrator",

            role:
                "Administrator",

            active:
                true

        };


        appData.users.push(
            adminUser
        );

    }


    /*
     * Repair only missing/invalid
     * Administrator information.
     *
     * DO NOT reset the password.
     */

    adminUser.id =
        adminUser.id ||
        "USR-ADMIN";

    adminUser.username =
        "admin";

    adminUser.password =
        adminUser.password ||
        "admin123";

    adminUser.fullName =
        adminUser.fullName ||
        "System Administrator";

    adminUser.role =
        "Administrator";

    adminUser.active =
        true;


    /*
     * Save user data
     */

    saveData();

}
/* =========================================================
   CHECK PAGE PERMISSION
   ========================================================= */

function hasPermission(page) {

    if (!currentUser) {

        return false;

    }


    const permissions =
        rolePermissions[currentUser.role] || [];


    /*
     * Administrator has access to everything.
     */

    if (permissions.includes("*")) {

        return true;

    }


    return permissions.includes(page);

}


/* =========================================================
   APPLY PERMISSIONS TO NAVIGATION
   ========================================================= */

function applyPermissions() {

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            const page =
                button.dataset.page;


            if (hasPermission(page)) {

                button.style.display = "";

            } else {

                button.style.display = "none";

            }

        });


    /*
     * Show current user information
     * if a user display area exists.
     */

    const userDisplay =
        document.getElementById(
            "currentUserDisplay"
        );


    if (userDisplay && currentUser) {

        userDisplay.innerHTML = `

            <strong>
                ${escapeHTML(currentUser.fullName)}
            </strong>

            <small>
                ${escapeHTML(currentUser.role)}
            </small>

        `;

    }

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   LOGIN
   ========================================================= */

function login(username, password) {

    const user =
        appData.users.find(

            user =>

                user.username.toLowerCase() ===
                username.toLowerCase() &&

                user.password ===
                password &&

                user.active === true

        );


    if (!user) {

        alert(
            "Invalid username or password."
        );

        return false;

    }


    currentUser = user;


    localStorage.setItem(

        "ptAccountingCurrentUser",

        JSON.stringify({

            id:
                user.id,

            username:
                user.username

        })

    );


    return true;

}


/* =========================================================
   LOAD CURRENT USER
   ========================================================= */

function loadCurrentUser() {

    const savedUser =
        localStorage.getItem(
            "ptAccountingCurrentUser"
        );


    if (!savedUser) {

        return;

    }


    try {

        const saved =
            JSON.parse(savedUser);


        const user =
            appData.users.find(

                u =>
                    u.id ===
                    saved.id &&

                    u.username ===
                    saved.username &&

                    u.active === true

            );


        if (user) {

            currentUser = user;

        } else {

            localStorage.removeItem(
                "ptAccountingCurrentUser"
            );

        }

    }

    catch (error) {

        console.error(
            "Unable to restore logged-in user.",
            error
        );

        localStorage.removeItem(
            "ptAccountingCurrentUser"
        );

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    currentUser = null;


    localStorage.removeItem(
        "ptAccountingCurrentUser"
    );


    location.reload();

}


/* =========================================================
   LOGIN SCREEN
   ========================================================= */

function showLoginScreen() {

    document.body.innerHTML = `

        <div
            style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:20px;
                background:#f4f6f8;
            "
        >

            <div
                class="panel"
                style="
                    width:100%;
                    max-width:420px;
                    box-sizing:border-box;
                "
            >

                <div
                    style="
                        text-align:center;
                        margin-bottom:25px;
                    "
                >

                    <h1>
                        PT Accounting System
                    </h1>

                    <p>
                        Please sign in to continue.
                    </p>

                </div>


                <div class="form-group">

                    <label>
                        Username
                    </label>

                    <input
                        type="text"
                        id="loginUsername"
                        placeholder="Enter username"
                        autocomplete="username"
                    >

                </div>


                <br>


                <div class="form-group">

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        id="loginPassword"
                        placeholder="Enter password"
                        autocomplete="current-password"
                    >

                </div>


                <br>


                <button
                    class="btn btn-primary"
                    style="width:100%;"
                    onclick="performLogin()"
                >

                    Login

                </button>


                <div
                    style="
                        margin-top:20px;
                        padding:12px;
                        background:#f8f8f8;
                        border-radius:6px;
                        text-align:center;
                        font-size:13px;
                    "
                >

                    <strong>
                        First Login
                    </strong>

                    <br><br>

                    Username:
                    <strong>admin</strong>

                    <br>

                    Password:
                    <strong>admin123</strong>

                </div>

            </div>

        </div>

    `;


    /*
     * Allow ENTER key to login.
     */

    const passwordInput =
        document.getElementById(
            "loginPassword"
        );


    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Enter") {

                    performLogin();

                }

            }
        );

    }

}


/* =========================================================
   USER SESSION BAR + LOGOUT
   ========================================================= */

function showUserSessionBar() {

    /*
     * Do not create duplicate session bars
     */
    if (document.getElementById("userSessionBar")) {
        return;
    }

    if (!currentUser) {
        return;
    }


    /*
     * Create session bar
     */
    const bar =
        document.createElement("div");

    bar.id =
        "userSessionBar";

    bar.style.cssText = `
        display:flex;
        align-items:center;
        justify-content:flex-end;
        gap:12px;
        padding:10px 20px;
        background:#ffffff;
        border-bottom:1px solid #ddd;
        font-size:14px;
    `;


    bar.innerHTML = `

        <span>
            Logged in as:
            <strong>
                ${escapeHTML(currentUser.fullName)}
            </strong>

            <span style="margin-left:6px;">
                (${escapeHTML(currentUser.role)})
            </span>
        </span>


        <button
            class="btn"
            type="button"
            onclick="logout()"
            style="
                padding:6px 14px;
                cursor:pointer;
            "
        >
            Logout
        </button>

    `;


    /*
     * Insert at the top of the application
     */
    const app =
        document.querySelector(".app");

    if (app) {

        app.insertBefore(
            bar,
            app.firstChild
        );

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    /*
     * Clear current user
     */
    currentUser = null;


    /*
     * Remove saved login session
     */
    localStorage.removeItem(
        "ptAccountingCurrentUser"
    );


    /*
     * Show login screen
     */
    showLoginScreen();

}

/* =========================================================
   START USER SESSION BAR
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (currentUser) {

            showUserSessionBar();

        }

    }
);


/* =========================================================
   PERFORM LOGIN
   ========================================================= */

function performLogin() {

    const username =
        document
            .getElementById("loginUsername")
            .value
            .trim();

    const password =
        document
            .getElementById("loginPassword")
            .value;


    if (!username) {

        alert(
            "Please enter username."
        );

        return;

    }


    if (!password) {

        alert(
            "Please enter password."
        );

        return;

    }


    /*
     * Make sure Administrator exists
     */
    initializeUsers();


    /*
     * Try login
     */
    const success =
        login(
            username,
            password
        );


    if (success) {

        location.reload();

    }

}


/* =========================================================
   USERS PAGE
   ========================================================= */

function usersPage() {

    /*
     * Only Administrator can manage users.
     */

    if (
        !currentUser ||
        currentUser.role !==
        "Administrator"
    ) {

        return `

            <div class="panel">

                <h3>
                    Access Denied
                </h3>

                <p>
                    Only the Administrator
                    can manage users.
                </p>

            </div>

        `;

    }


    return `

        <div class="page-header">

            <h2>
                User Management
            </h2>

            <p>
                Create users and control
                their system permissions.
            </p>

        </div>


        <div class="panel">

            <h3>
                Add New User
            </h3>


            <div class="form-grid">


                <div class="form-group">

                    <label>
                        Full Name
                    </label>

                    <input
                        type="text"
                        id="newUserFullName"
                        placeholder="Enter full name"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Username
                    </label>

                    <input
                        type="text"
                        id="newUsername"
                        placeholder="Enter username"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        id="newUserPassword"
                        placeholder="Enter password"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Role
                    </label>

                    <select id="newUserRole">

                        <option value="Accountant">
                            Accountant
                        </option>

                        <option value="Sales User">
                            Sales User
                        </option>

                        <option value="Purchase User">
                            Purchase User
                        </option>

                        <option value="Viewer">
                            Viewer
                        </option>

                        <option value="Administrator">
                            Administrator
                        </option>

                    </select>

                </div>


            </div>


            <br>


            <button
                class="btn btn-primary"
                onclick="addUser()"
            >

                + Create User

            </button>

        </div>


        <div class="panel">

            <h3>
                Users
            </h3>


            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>
                                User ID
                            </th>

                            <th>
                                Username
                            </th>

                            <th>
                                Full Name
                            </th>

                            <th>
                                Role
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            appData.users.length === 0

                            ?

                            `

                            <tr>

                                <td
                                    colspan="6"
                                    class="empty"
                                >

                                    No users found.

                                </td>

                            </tr>

                            `

                            :

                            appData.users.map(
                                user => `

                                <tr>

                                    <td>
                                        ${escapeHTML(user.id)}
                                    </td>

                                    <td>
                                        ${escapeHTML(user.username)}
                                    </td>

                                    <td>
                                        ${escapeHTML(user.fullName)}
                                    </td>

                                    <td>
                                        ${escapeHTML(user.role)}
                                    </td>

                                    <td>

                                        ${
                                            user.active

                                            ?

                                            `<span class="status status-paid">
                                                Active
                                            </span>`

                                            :

                                            `<span class="status">
                                                Inactive
                                            </span>`
                                        }

                                    </td>

                                    <td>

                                        ${
                                            user.id ===
                                            currentUser.id

                                            ?

                                            `<strong>
                                                Current User
                                            </strong>`

                                            :

                                            `

                                            <button
                                                class="btn btn-secondary"
                                                onclick="toggleUser('${user.id}')"
                                            >

                                                ${
                                                    user.active
                                                    ?
                                                    "Deactivate"
                                                    :
                                                    "Activate"
                                                }

                                            </button>


                                            <button
                                                class="btn btn-danger"
                                                onclick="deleteUser('${user.id}')"
                                            >

                                                Delete

                                            </button>

                                            `

                                        }

                                    </td>

                                </tr>

                            `
                            ).join("")

                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


/* =========================================================
   ADD USER
   ========================================================= */

function addUser() {

    if (
        !currentUser ||
        currentUser.role !==
        "Administrator"
    ) {

        alert(
            "Only the Administrator can create users."
        );

        return;

    }


    const fullName =
        document
            .getElementById(
                "newUserFullName"
            )
            .value
            .trim();


    const username =
        document
            .getElementById(
                "newUsername"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "newUserPassword"
            )
            .value;


    const role =
        document
            .getElementById(
                "newUserRole"
            )
            .value;


    if (!fullName) {

        alert(
            "Please enter the full name."
        );

        return;

    }


    if (!username) {

        alert(
            "Please enter a username."
        );

        return;

    }


    if (!password) {

        alert(
            "Please enter a password."
        );

        return;

    }


    if (password.length < 4) {

        alert(
            "Password must contain at least 4 characters."
        );

        return;

    }


    const usernameExists =
        appData.users.some(

            user =>
                user.username.toLowerCase() ===
                username.toLowerCase()

        );


    if (usernameExists) {

        alert(
            "Username already exists."
        );

        return;

    }


    appData.users.push({

        id:
            "USR-" +
            Date.now(),

        username:
            username,

        password:
            password,

        fullName:
            fullName,

        role:
            role,

        active:
            true

    });


    saveData();


    alert(
        "User created successfully."
    );


    showPage("users");

}


/* =========================================================
   TOGGLE USER
   ========================================================= */

function toggleUser(id) {

    if (
        !currentUser ||
        currentUser.role !==
        "Administrator"
    ) {

        alert(
            "Only the Administrator can change user status."
        );

        return;

    }


    const user =
        appData.users.find(
            u => u.id === id
        );


    if (!user) {

        return;

    }


    /*
     * Prevent Administrator from
     * deactivating their own account.
     */

    if (
        user.id ===
        currentUser.id
    ) {

        alert(
            "You cannot deactivate your own account."
        );

        return;

    }


    user.active =
        !user.active;


    saveData();


    showPage("users");

}


/* =========================================================
   DELETE USER
   ========================================================= */

function deleteUser(id) {

    if (
        !currentUser ||
        currentUser.role !==
        "Administrator"
    ) {

        alert(
            "Only the Administrator can delete users."
        );

        return;

    }


    const user =
        appData.users.find(
            u => u.id === id
        );


    if (!user) {

        return;

    }


    if (
        user.id ===
        currentUser.id
    ) {

        alert(
            "You cannot delete the currently logged-in user."
        );

        return;

    }


    const confirmed =
        confirm(
            "Delete user " +
            user.username +
            "?"
        );


    if (!confirmed) {

        return;

    }


    appData.users =
        appData.users.filter(
            u => u.id !== id
        );


    saveData();


    showPage("users");

}


/* =========================================================
   APPLICATION DATA
   ========================================================= */
const appData = {
    accounts: [],
    customers: [],
    suppliers: [],
    products: [],
    sales: [],
    purchases: [],
    receipts: [],
    payments: [],
    journalEntries: [],
    users: []
};

/* =========================================================
   PAGE INFORMATION
   ========================================================= */

const pages = {

    dashboard: {
        title: "Dashboard",
        subtitle: "Overview of your accounting system"
    },

    accounts: {
        title: "Chart of Accounts",
        subtitle: "Manage your accounting accounts"
    },

    customers: {
        title: "Customers",
        subtitle: "Manage customers and receivables"
    },

    suppliers: {
        title: "Suppliers",
        subtitle: "Manage suppliers and payables"
    },

    products: {
        title: "Products & Inventory",
        subtitle: "Manage products and stock"
    },

    sales: {
        title: "Sales Invoices",
        subtitle: "Manage sales and customer invoices"
    },

    purchases: {
        title: "Purchase Invoices",
        subtitle: "Manage purchases and supplier invoices"
    },

    receipts: {
        title: "Receipts",
        subtitle: "Record money received"
    },

    payments: {
        title: "Payments",
        subtitle: "Record money paid"
    },

    journal: {
        title: "Journal Entries",
        subtitle: "Double-entry accounting journal"
    },

    ledger: {
        title: "General Ledger",
        subtitle: "View account transactions"
    },

    trial: {
        title: "Trial Balance",
        subtitle: "Check debit and credit balances"
    },

    "profit-loss": {
        title: "Profit & Loss",
        subtitle: "View revenue, expenses and profit"
    },

    "balance-sheet": {
        title: "Balance Sheet",
        subtitle: "View assets, liabilities and equity"
    },

    users: {
       title: "User Management",
       subtitle: "Manage users and system permissions"
    },

    settings: {
        title: "Settings",
        subtitle: "System configuration"
    }

};


/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadData();

    initializeUsers();

    loadCurrentUser();

    setupNavigation();

    setupMobileMenu();


    if (!currentUser) {

        showLoginScreen();

        return;

    }


    applyPermissions();

    showPage("dashboard");

});


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    const navigation =
        document.getElementById("mainNavigation");

    if (!navigation) {

        console.error(
            "PT Accounting: Navigation element not found."
        );

        return;
    }


    /*
       EVENT DELEGATION

       This listens to the navigation itself.
       Therefore clicks on the icon or text inside
       a navigation button are also handled correctly.
    */

    navigation.addEventListener("click", function (event) {

        const button =
            event.target.closest(".nav-item");


        if (!button) {
            return;
        }


        const page =
            button.getAttribute("data-page");


        if (!page) {

            console.error(
                "PT Accounting: Navigation button has no data-page."
            );

            return;
        }


        console.log(
            "PT Accounting navigation:",
            page
        );


        showPage(page);

    });

}


/* =========================================================
   SHOW PAGE
   ========================================================= */

function showPage(page) {

    const title =
        document.getElementById("pageTitle");

    const subtitle =
        document.getElementById("pageSubtitle");

    const content =
        document.getElementById("content");


    if (!pages[page]) {

        return;

    }


    /*
     * Permission check
     */

    if (!hasPermission(page)) {

        alert(
            "Access denied. Your user role does not have permission to open this page."
        );

        return;

    }


    title.textContent =
        pages[page].title;


    subtitle.textContent =
        pages[page].subtitle;


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.page ===
                page
            ) {

                button.classList.add(
                    "active"
                );

            }

        });


    content.innerHTML =
        renderPage(page);


    /*
     * Re-apply permissions
     */

    applyPermissions();


    if (window.innerWidth <= 700) {

        document
            .getElementById("sidebar")
            .classList
            .remove("open");

    }

}


/* =========================================================
   PAGE RENDERER
   ========================================================= */

function renderPage(page) {

    switch (page) {

        case "dashboard":
            return dashboardPage();

        case "accounts":
            return accountsPage();

        case "customers":
            return customersPage();

        case "suppliers":
            return suppliersPage();

        case "products":
            return productsPage();

        case "sales":
            return salesPage();

        case "purchases":
            return purchasesPage();

        case "receipts":
            return receiptsPage();

        case "payments":
            return paymentsPage();

        case "journal":
            return journalPage();

        case "ledger":
            return ledgerPage();

        case "trial":
            return trialBalancePage();

        case "profit-loss":
            return profitLossPage();

        case "balance-sheet":
            return balanceSheetPage();

        case "users":
            return usersPage();

      case "settings":
            return settingsPage();
            
       default:

            return `
                <div class="panel">
                    <h3>Page not found</h3>
                    <p>
                        The requested page does not exist.
                    </p>
                </div>
            `;

    }

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    const button =
        document.getElementById("menuButton");


    if (!button) {
        return;
    }


    button.addEventListener("click", function () {

        const sidebar =
            document.getElementById("sidebar");


        if (sidebar) {

            sidebar.classList.toggle("open");

        }

    });

}


/* =========================================================
   DASHBOARD
   ========================================================= */

/* =========================================================
   DASHBOARD PAGE
   ========================================================= */

function dashboardPage() {

    const sales =
        calculateSales();

    const purchases =
        calculatePurchases();

    const inventory =
        calculateInventory();

    const profit =
        calculateProfit();

    const receivables =
        calculateReceivables();

    const payables =
        calculatePayables();

   const cashBank =
    appData.journalEntries.reduce(
        (sum, entry) => {

            if (
                entry.account === "Cash/Bank"
            ) {
                return sum +
                    Number(entry.debit || 0) -
                    Number(entry.credit || 0);
            }

            return sum;

        },
        0
    );

    /*
     * Gross Profit
     */

    const cogs =
        calculateCOGS();

    const grossProfit =
        sales - cogs;


    /*
     * Financial Position
     */

   const totalAssets =
    cashBank +
    inventory +
    receivables;

    const totalLiabilities =
        payables;


    const totalEquity =
        totalAssets -
        totalLiabilities;


    return `

        <div class="welcome">

            <h2>
                Welcome to Phuntshok's Accounting
            </h2>

            <p>
                Your retail accounting system is ready.
                Manage accounts, customers, suppliers,
                products, sales, purchases and reports.
            </p>

        </div>


        <!-- =================================================
             MAIN SUMMARY
             ================================================= -->

        <div class="cards">


            <div class="card">

                <div class="card-icon">
                    💰
                </div>

                <small>
                    Total Sales
                </small>

                <strong>
                    Nu. ${formatMoney(sales)}
                </strong>

            </div>


            <div class="card">

                <div class="card-icon">
                    🛒
                </div>

                <small>
                    Total Purchases
                </small>

                <strong>
                    Nu. ${formatMoney(purchases)}
                </strong>

            </div>


            <div class="card">

                <div class="card-icon">
                    📦
                </div>

                <small>
                    Inventory Value
                </small>

                <strong>
                    Nu. ${formatMoney(inventory)}
                </strong>

            </div>


            <div class="card">

                <div class="card-icon">
                    📈
                </div>

                <small>
                    Net Profit
                </small>

                <strong>
                    Nu. ${formatMoney(profit)}
                </strong>

            </div>


        </div>


        <!-- =================================================
             RECEIVABLES / PAYABLES / GROSS PROFIT
             ================================================= -->

        <div class="cards">


            <div class="card">

                <div class="card-icon">
                    👥
                </div>

                <small>
                    Receivables
                </small>

                <strong>
                    Nu. ${formatMoney(receivables)}
                </strong>

            </div>


            <div class="card">

                <div class="card-icon">
                    🏢
                </div>

                <small>
                    Payables
                </small>

                <strong>
                    Nu. ${formatMoney(payables)}
                </strong>

            </div>


            <div class="card">

                <div class="card-icon">
                    📊
                </div>

                <small>
                    Gross Profit
                </small>

                <strong>
                    Nu. ${formatMoney(grossProfit)}
                </strong>

            </div>


        </div>


        <!-- =================================================
             FINANCIAL POSITION
             ================================================= -->

        <div class="panel">

            <h3>
                Financial Position
            </h3>


            <div class="cards">


                <div class="card">

                    <div class="card-icon">
                        🏦
                    </div>

                    <small>
                        Total Assets
                    </small>

                    <strong>
                        Nu. ${formatMoney(totalAssets)}
                    </strong>

                </div>


                <div class="card">

                    <div class="card-icon">
                        📋
                    </div>

                    <small>
                        Total Liabilities
                    </small>

                    <strong>
                        Nu. ${formatMoney(totalLiabilities)}
                    </strong>

                </div>


                <div class="card">

                    <div class="card-icon">
                        💼
                    </div>

                    <small>
                        Total Equity
                    </small>

                    <strong>
                        Nu. ${formatMoney(totalEquity)}
                    </strong>

                </div>


            </div>

        </div>


        <!-- =================================================
             SYSTEM STATUS
             ================================================= -->

        <div class="panel">

            <h3>
                Accounting System Status
            </h3>

            <p>
                Phuntshok's Accounting is running successfully.
                Data is stored locally in your browser.
            </p>

            <p>
                All major accounting modules and financial
                reports are available.
            </p>

        </div>


        <!-- =================================================
             DASHBOARD REPORTS
             ================================================= -->

        <div class="panel">

            <h3>
                Dashboard Reports
            </h3>


            <div class="report-actions">


                <button
                    onclick="exportDashboardCSV()">

                    📄 Export CSV

                </button>


                <button
                    onclick="printDashboard()">

                    🖨️ Print / Save PDF

                </button>


            </div>

        </div>

    `;

}


/* =========================================================
   DASHBOARD CSV EXPORT
   ========================================================= */

function exportDashboardCSV() {

    const sales =
        calculateSales();

    const purchases =
        calculatePurchases();

    const inventory =
        calculateInventory();

    const profit =
        calculateProfit();

    const receivables =
        calculateReceivables();

    const payables =
        calculatePayables();

   const cashBank =
    appData.journalEntries.reduce(
        (sum, entry) => {

            if (
                entry.account === "Cash/Bank"
            ) {
                return sum +
                    Number(entry.debit || 0) -
                    Number(entry.credit || 0);
            }

            return sum;

        },
        0
    );

    const cogs =
        calculateCOGS();

    const grossProfit =
        sales - cogs;

    const totalAssets =
    cashBank +
    inventory +
    receivables;

    const totalLiabilities =
        payables;

    const totalEquity =
        totalAssets -
        totalLiabilities;


    let csv =
        "PT Accounting System\n";

    csv +=
        "Dashboard Financial Summary\n\n";


    csv +=
        "Particular,Amount\n";


    csv +=
        `Total Sales,${sales.toFixed(2)}\n`;

    csv +=
        `Total Purchases,${purchases.toFixed(2)}\n`;

    csv +=
        `Inventory Value,${inventory.toFixed(2)}\n`;

    csv +=
        `Receivables,${receivables.toFixed(2)}\n`;

    csv +=
        `Payables,${payables.toFixed(2)}\n`;

    csv +=
        `Cost of Goods Sold,${cogs.toFixed(2)}\n`;

    csv +=
        `Gross Profit,${grossProfit.toFixed(2)}\n`;

    csv +=
        `Net Profit,${profit.toFixed(2)}\n`;

    csv +=
        `Total Assets,${totalAssets.toFixed(2)}\n`;

    csv +=
        `Total Liabilities,${totalLiabilities.toFixed(2)}\n`;

    csv +=
        `Total Equity,${totalEquity.toFixed(2)}\n`;


    /*
     * Create CSV file
     */

    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        "PT-Accounting-Dashboard.csv";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


/* =========================================================
   DASHBOARD PRINT / SAVE PDF
   ========================================================= */

function printDashboard() {

    const sales =
        calculateSales();

    const purchases =
        calculatePurchases();

    const inventory =
        calculateInventory();

    const profit =
        calculateProfit();

    const receivables =
        calculateReceivables();

    const payables =
        calculatePayables();

   const cashBank =
    appData.journalEntries.reduce(
        (sum, entry) => {

            if (
                entry.account === "Cash/Bank"
            ) {
                return sum +
                    Number(entry.debit || 0) -
                    Number(entry.credit || 0);
            }

            return sum;

        },
        0
    );

    const cogs =
        calculateCOGS();

    const grossProfit =
        sales - cogs;

    const totalAssets =
    cashBank +
    inventory +
    receivables;

    const totalLiabilities =
        payables;

    const totalEquity =
        totalAssets -
        totalLiabilities;


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print the report."
        );

        return;

    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                PT Accounting Dashboard
            </title>


            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    padding:
                        30px;

                }


                h1 {

                    text-align:
                        center;

                    margin-bottom:
                        5px;

                }


                h2 {

                    text-align:
                        center;

                    margin-top:
                        5px;

                }


                .date {

                    text-align:
                        center;

                    color:
                        #555;

                    margin-bottom:
                        30px;

                }


                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                    margin-top:
                        20px;

                }


                th,
                td {

                    border:
                        1px solid #000;

                    padding:
                        10px;

                }


                th {

                    text-align:
                        left;

                    background:
                        #eeeeee;

                }


                td:last-child {

                    text-align:
                        right;

                }


                .section {

                    margin-top:
                        30px;

                }


                .profit {

                    font-weight:
                        bold;

                }


                @media print {

                    body {

                        padding:
                            15px;

                    }

                }

            </style>

        </head>


        <body>


            <h1>
                PT Accounting System
            </h1>


            <h2>
                Dashboard Financial Summary
            </h2>


            <div class="date">

                Generated on:
                ${new Date().toLocaleString()}

            </div>


            <!-- PROFIT & LOSS -->

            <div class="section">

                <h3>
                    Profit & Loss Summary
                </h3>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Particular
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr>

                            <td>
                                Total Sales
                            </td>

                            <td>
                                Nu. ${formatMoney(sales)}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Cost of Goods Sold
                            </td>

                            <td>
                                Nu. ${formatMoney(cogs)}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Gross Profit
                            </td>

                            <td class="profit">
                                Nu. ${formatMoney(grossProfit)}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Net Profit
                            </td>

                            <td class="profit">
                                Nu. ${formatMoney(profit)}
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>


            <!-- WORKING CAPITAL -->

            <div class="section">

                <h3>
                    Working Capital
                </h3>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Particular
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr>

                            <td>
                                Inventory Value
                            </td>

                            <td>
                                Nu. ${formatMoney(inventory)}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Receivables
                            </td>

                            <td>
                                Nu. ${formatMoney(receivables)}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Payables
                            </td>

                            <td>
                                Nu. ${formatMoney(payables)}
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>


            <!-- FINANCIAL POSITION -->

            <div class="section">

                <h3>
                    Financial Position
                </h3>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Particular
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr>

                            <td>
                                Total Assets
                            </td>

                            <td>
                                Nu. ${formatMoney(totalAssets)}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Total Liabilities
                            </td>

                            <td>
                                Nu. ${formatMoney(totalLiabilities)}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Total Equity
                            </td>

                            <td>
                                Nu. ${formatMoney(totalEquity)}
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>


        </body>

        </html>

    `);


    printWindow.document.close();


    printWindow.focus();


    setTimeout(
        () => {

            printWindow.print();

        },
        250
    );

}
/* =========================================================
   CHART OF ACCOUNTS
   ========================================================= */

function accountsPage() {

    return `

        <div class="page-header">

            <h2>
                Chart of Accounts
            </h2>

            <p>
                Your accounting account master.
            </p>

        </div>


        <div class="panel">

            <h3>
                Add New Account
            </h3>


            <div class="form-grid">

                <div class="form-group">

                    <label>
                        Code
                    </label>

                    <input
                        type="text"
                        id="accountCode"
                        placeholder="e.g. 1000"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Account Name
                    </label>

                    <input
                        type="text"
                        id="accountName"
                        placeholder="e.g. Cash"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Account Type
                    </label>

                    <select id="accountType">

                        <option value="Asset">
                            Asset
                        </option>

                        <option value="Liability">
                            Liability
                        </option>

                        <option value="Equity">
                            Equity
                        </option>

                        <option value="Revenue">
                            Revenue
                        </option>

                        <option value="Expense">
                            Expense
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label>
                        Opening Balance
                    </label>

                    <input
                        type="number"
                        id="accountBalance"
                        value="0"
                        step="0.01"
                    >

                </div>

            </div>


            <br>


            <button
                type="button"
                class="btn btn-primary"
                onclick="saveAccount()">

                Save Account

            </button>

        </div>


        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Code</th>
                            <th>Account Name</th>
                            <th>Account Type</th>
                            <th>Balance</th>
                            <th>Action</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            appData.accounts.length === 0

                            ?

                            `
                            <tr>

                                <td
                                    colspan="5"
                                    class="empty">

                                    No accounts yet.

                                </td>

                            </tr>
                            `

                            :

                            appData.accounts
                                .map((account, index) => `

                                <tr>

                                    <td>
                                        ${escapeHTML(account.code)}
                                    </td>

                                    <td>
                                        ${escapeHTML(account.name)}
                                    </td>

                                    <td>
                                        ${escapeHTML(account.type)}
                                    </td>

                                    <td>
                                        Nu.
                                        ${formatMoney(
                                            account.balance || 0
                                        )}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            class="btn btn-danger"
                                            onclick="deleteAccount(${index})">

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            `)
                            .join("")

                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


/* =========================================================
   CUSTOMERS
   ========================================================= */

function customersPage() {

    return `

        <div class="page-header">

            <h2>
                Customers
            </h2>

            <p>
                Customer master and accounts receivable.
            </p>

        </div>


        <!-- CUSTOMER ENTRY SHEET -->

        <div class="panel">

            <h3>
                Add New Customer
            </h3>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit, minmax(200px, 1fr));
                    gap:15px;
                "
            >

                <div>

                    <label>
                        Customer Name
                    </label>

                    <input
                        type="text"
                        id="customerName"
                        placeholder="Enter customer name"
                    >

                </div>


                <div>

                    <label>
                        Phone
                    </label>

                    <input
                        type="text"
                        id="customerPhone"
                        placeholder="Enter phone number"
                    >

                </div>


                <div>

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        id="customerEmail"
                        placeholder="Enter email address"
                    >

                </div>

            </div>


            <div
                style="
                    margin-top:20px;
                    display:flex;
                    gap:10px;
                "
            >

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="saveCustomer()">

                    💾 Save Customer

                </button>


                <button
                    type="button"
                    class="btn"
                    onclick="clearCustomerForm()">

                    Clear

                </button>

            </div>

        </div>


        <!-- CUSTOMER LIST -->

        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Customer</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Balance</th>
                            <th>Action</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            appData.customers.length === 0

                            ?

                            `
                            <tr>

                                <td
                                    colspan="5"
                                    class="empty">

                                    No customers yet.

                                </td>

                            </tr>
                            `

                            :

                            appData.customers
                                .map((customer, index) => `

                                <tr>

                                    <td>
                                        ${escapeHTML(customer.name)}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            customer.phone || ""
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            customer.email || ""
                                        )}
                                    </td>

                                    <td>

                                        Nu.
                                        ${formatMoney(
                                            customer.balance || 0
                                        )}

                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            class="btn btn-danger"
                                            onclick="deleteCustomer(${index})">

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            `)
                            .join("")

                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;

}
/* =========================================================
   SUPPLIERS
   ========================================================= */

function suppliersPage() {

    return `

        <div class="page-header">

            <h2>
                Suppliers
            </h2>

            <p>
                Supplier master and accounts payable.
            </p>

        </div>


        <!-- SUPPLIER ENTRY SHEET -->

        <div class="panel">

            <h3>
                Add New Supplier
            </h3>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit, minmax(200px, 1fr));
                    gap:15px;
                "
            >

                <div>

                    <label>
                        Supplier Name
                    </label>

                    <input
                        type="text"
                        id="supplierName"
                        placeholder="Enter supplier name"
                    >

                </div>


                <div>

                    <label>
                        Phone
                    </label>

                    <input
                        type="text"
                        id="supplierPhone"
                        placeholder="Enter phone number"
                    >

                </div>


                <div>

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        id="supplierEmail"
                        placeholder="Enter email address"
                    >

                </div>

            </div>


            <div
                style="
                    margin-top:20px;
                    display:flex;
                    gap:10px;
                "
            >

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="saveSupplier()">

                    💾 Save Supplier

                </button>


                <button
                    type="button"
                    class="btn"
                    onclick="clearSupplierForm()">

                    Clear

                </button>

            </div>

        </div>


        <!-- SUPPLIER LIST -->

        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Supplier</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Balance</th>
                            <th>Action</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            appData.suppliers.length === 0

                            ?

                            `
                            <tr>

                                <td
                                    colspan="5"
                                    class="empty">

                                    No suppliers yet.

                                </td>

                            </tr>
                            `

                            :

                            appData.suppliers
                                .map((supplier, index) => `

                                <tr>

                                    <td>
                                        ${escapeHTML(supplier.name)}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            supplier.phone || ""
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            supplier.email || ""
                                        )}
                                    </td>

                                    <td>

                                        Nu.
                                        ${formatMoney(
                                            supplier.balance || 0
                                        )}

                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            class="btn btn-danger"
                                            onclick="deleteSupplier(${index})">

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            `)
                            .join("")

                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;

}

/* =========================================================
   PRODUCTS
   ========================================================= */

function productsPage() {

    return `

        <div class="page-header">

            <h2>
                Products & Inventory
            </h2>

            <p>
                Products, stock quantities and inventory value.
            </p>

        </div>


        <!-- PRODUCT ENTRY SHEET -->

        <div class="panel">

            <h3>
                Add New Product
            </h3>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit, minmax(200px, 1fr));
                    gap:15px;
                "
            >

                <div>

                    <label>
                        Product Name
                    </label>

                    <input
                        type="text"
                        id="productName"
                        placeholder="Enter product name"
                    >

                </div>


                <div>

                    <label>
                        Purchase Price
                    </label>

                    <input
                        type="number"
                        id="productCost"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                    >

                </div>


                <div>

                    <label>
                        Selling Price
                    </label>

                    <input
                        type="number"
                        id="productPrice"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                    >

                </div>


                <div>

                    <label>
                        Opening Stock
                    </label>

                    <input
                        type="number"
                        id="productOpeningStock"
                        min="0"
                        step="1"
                        placeholder="0"
                    >

                </div>

            </div>


            <div
                style="
                    margin-top:20px;
                    display:flex;
                    gap:10px;
                "
            >

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="saveProduct()">

                    💾 Save Product

                </button>


                <button
                    type="button"
                    class="btn"
                    onclick="clearProductForm()">

                    Clear

                </button>

            </div>

        </div>


        <!-- PRODUCT LIST -->

        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Product</th>
                            <th>Purchase Price</th>
                            <th>Selling Price</th>
                            <th>Opening Stock</th>
                            <th>Stock</th>
                            <th>Stock Value</th>
                            <th>Action</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            appData.products.length === 0

                            ?

                            `
                            <tr>

                                <td
                                    colspan="7"
                                    class="empty">

                                    No products yet.

                                </td>

                            </tr>
                            `

                            :

                            appData.products
                                .map((product, index) => `

                                <tr>

                                    <td>
                                        ${escapeHTML(product.name)}
                                    </td>

                                    <td>
                                        Nu.
                                        ${formatMoney(product.cost)}
                                    </td>

                                    <td>
                                        Nu.
                                        ${formatMoney(product.price)}
                                    </td>

                                    <td>
                                        ${Number(
                                            product.openingStock || 0
                                        )}
                                    </td>

                                    <td>
                                        ${Number(
                                            product.stock || 0
                                        )}
                                    </td>

                                    <td>
                                        Nu.
                                        ${formatMoney(
                                            Number(product.stock || 0) *
                                            Number(product.cost || 0)
                                        )}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            class="btn btn-danger"
                                            onclick="deleteProduct(${index})">

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            `)
                            .join("")

                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;

}

/* =========================================================
   SALES
   ========================================================= */

function salesPage() {

    return `

        <div class="page-header">

            <h2>
                Sales Invoices
            </h2>

            <p>
                Sales invoices and accounts receivable.
            </p>

        </div>


        <!-- SALES INVOICE ENTRY SHEET -->

        <div class="panel">

            <h3>
                New Sales Invoice
            </h3>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit, minmax(200px, 1fr));
                    gap:15px;
                "
            >

                <!-- CUSTOMER -->

                <div>

                    <label>
                        Customer
                    </label>

                    <select id="saleCustomer">

                        <option value="">
                            Select Customer
                        </option>

                        ${
                            appData.customers
                                .map(customer => `

                                    <option
                                        value="${escapeHTML(customer.name)}">

                                        ${escapeHTML(customer.name)}

                                    </option>

                                `)
                                .join("")
                        }

                    </select>

                </div>


                <!-- PRODUCT -->

                <div>

                    <label>
                        Product
                    </label>

                    <select
                        id="saleProduct"
                        onchange="updateSalePrice()">

                        <option value="">
                            Select Product
                        </option>

                        ${
                            appData.products
                                .map(product => `

                                    <option
                                        value="${escapeHTML(product.name)}">

                                        ${escapeHTML(product.name)}

                                    </option>

                                `)
                                .join("")
                        }

                    </select>

                </div>


                <!-- QUANTITY -->

                <div>

                    <label>
                        Quantity
                    </label>

                    <input
                        type="number"
                        id="saleQuantity"
                        min="1"
                        step="1"
                        value="1"
                        oninput="updateSaleTotal()"
                    >

                </div>


                <!-- UNIT PRICE -->

                <div>

                    <label>
                        Unit Price
                    </label>

                    <input
                        type="number"
                        id="saleUnitPrice"
                        min="0"
                        step="0.01"
                        readonly
                    >

                </div>


                <!-- TOTAL -->

                <div>

                    <label>
                        Total
                    </label>

                    <input
                        type="number"
                        id="saleTotal"
                        readonly
                    >

                </div>


                <!-- STATUS -->

                <div>

                    <label>
                        Payment Status
                    </label>

                    <select id="saleStatus">

                        <option value="Unpaid">
                            Unpaid
                        </option>

                        <option value="Partially Paid">
                            Partially Paid
                        </option>

                        <option value="Paid">
                            Paid
                        </option>

                    </select>

                </div>

            </div>


            <!-- BUTTONS -->

            <div
                style="
                    margin-top:20px;
                    display:flex;
                    gap:10px;
                "
            >

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="saveSale()">

                    💾 Save Sales Invoice

                </button>


                <button
                    type="button"
                    class="btn"
                    onclick="clearSaleForm()">

                    Clear

                </button>

            </div>

        </div>


        <!-- SALES LIST -->

        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Invoice</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            appData.sales.length === 0

                            ?

                            `
                            <tr>

                                <td
                                    colspan="6"
                                    class="empty">

                                    No sales invoices yet.

                                </td>

                            </tr>
                            `

                            :

                            appData.sales
                                .map((sale, index) => `

                                <tr>

                                    <td>
                                        ${escapeHTML(sale.invoice)}
                                    </td>

                                    <td>
                                        ${escapeHTML(sale.date)}
                                    </td>

                                    <td>
                                        ${escapeHTML(sale.customer)}
                                    </td>

                                    <td>
                                        Nu.
                                        ${formatMoney(sale.total)}
                                    </td>

                                    <td>
                                        ${escapeHTML(sale.status)}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            class="btn btn-danger"
                                            onclick="deleteSale(${index})">

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            `)
                            .join("")

                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


/* =========================================================
   PURCHASES
   ========================================================= */

function purchasesPage() {

    return `

        <div class="page-header">

            <h2>
                Purchase Invoices
            </h2>

            <p>
                Purchases and accounts payable.
            </p>

        </div>


        <div class="panel">

            <button
                type="button"
                class="btn btn-primary"
                onclick="addPurchase()">

                + New Purchase Invoice

            </button>

        </div>


        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Invoice</th>
                            <th>Date</th>
                            <th>Supplier</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            appData.purchases.length === 0

                            ?

                            `
                            <tr>

                                <td
                                    colspan="6"
                                    class="empty">

                                    No purchase invoices yet.

                                </td>

                            </tr>
                            `

                            :

                            appData.purchases
                                .map((purchase, index) => `

                                <tr>

                                    <td>
                                        ${escapeHTML(
                                            purchase.invoice
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            purchase.date
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            purchase.supplier
                                        )}
                                    </td>

                                    <td>
                                        Nu.
                                        ${formatMoney(
                                            purchase.total
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            purchase.status
                                        )}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            class="btn btn-danger"
                                            onclick="deletePurchase(${index})">

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            `)
                            .join("")

                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


/* =========================================================
   RECEIPTS
   ========================================================= */

function receiptsPage() {

    return `

        <div class="page-header">

            <h2>
                Receipts
            </h2>

            <p>
                Money received from customers and other sources.
            </p>

        </div>


        <div class="panel">

            <button
                type="button"
                class="btn btn-primary"
                onclick="addReceipt()">

                + New Receipt

            </button>

        </div>


        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Date</th>
                            <th>Reference</th>
                            <th>From</th>
                            <th>Account</th>
                            <th>Amount</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            appData.receipts.length === 0

                            ?

                            `
                            <tr>

                                <td
                                    colspan="5"
                                    class="empty">

                                    No receipts yet.

                                </td>

                            </tr>
                            `

                            :

                            appData.receipts
                                .map(receipt => `

                                <tr>

                                    <td>
                                        ${escapeHTML(receipt.date)}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            receipt.reference
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(receipt.from)}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            receipt.account
                                        )}
                                    </td>

                                    <td>
                                        Nu.
                                        ${formatMoney(
                                            receipt.amount
                                        )}
                                    </td>

                                </tr>

                            `)
                            .join("")

                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


/* =========================================================
   PAYMENTS
   ========================================================= */

function paymentsPage() {

    return `

        <div class="page-header">

            <h2>
                Payments
            </h2>

            <p>
                Money paid to suppliers and for expenses.
            </p>

        </div>


        <div class="panel">

            <button
                type="button"
                class="btn btn-primary"
                onclick="addPayment()">

                + New Payment

            </button>

        </div>


        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Date</th>
                            <th>Reference</th>
                            <th>Paid To</th>
                            <th>Account</th>
                            <th>Amount</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            appData.payments.length === 0

                            ?

                            `
                            <tr>

                                <td
                                    colspan="5"
                                    class="empty">

                                    No payments yet.

                                </td>

                            </tr>
                            `

                            :

                            appData.payments
                                .map(payment => `

                                <tr>

                                    <td>
                                        ${escapeHTML(payment.date)}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            payment.reference
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(payment.to)}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            payment.account
                                        )}
                                    </td>

                                    <td>
                                        Nu.
                                        ${formatMoney(
                                            payment.amount
                                        )}
                                    </td>

                                </tr>

                            `)
                            .join("")

                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


/* =========================================================
   JOURNAL
   ========================================================= */

function journalPage() {

    const totalDebit =
        appData.journalEntries.reduce(
            (sum, entry) =>
                sum + Number(entry.debit || 0),
            0
        );


    const totalCredit =
        appData.journalEntries.reduce(
            (sum, entry) =>
                sum + Number(entry.credit || 0),
            0
        );


    return `

        <div class="page-header">

            <h2>
                Journal Entries
            </h2>

            <p>
                All accounting transactions flow through
                the double-entry journal.
            </p>

        </div>


        <div class="panel">

            <button
                type="button"
                class="btn btn-primary"
                onclick="addJournalEntry()">

                + New Journal Entry

            </button>

        </div>


        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Date</th>
                            <th>Reference</th>
                            <th>Description</th>
                            <th>Debit</th>
                            <th>Credit</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            appData.journalEntries.length === 0

                            ?

                            `
                            <tr>

                                <td
                                    colspan="5"
                                    class="empty">

                                    No journal entries yet.

                                </td>

                            </tr>
                            `

                            :

                            appData.journalEntries
                                .map(entry => `

                                <tr>

                                    <td>
                                        ${escapeHTML(entry.date)}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            entry.reference
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            entry.description
                                        )}
                                    </td>

                                    <td>
                                        Nu.
                                        ${formatMoney(entry.debit)}
                                    </td>

                                    <td>
                                        Nu.
                                        ${formatMoney(entry.credit)}
                                    </td>

                                </tr>

                            `)
                            .join("")

                        }

                    </tbody>


                    <tfoot>

                        <tr>

                            <th colspan="3">
                                Total
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(totalDebit)}
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(totalCredit)}
                            </th>

                        </tr>

                    </tfoot>

                </table>

            </div>

        </div>

    `;

}


/* =========================================================
   GENERAL LEDGER PAGE
   ========================================================= */

function ledgerPage() {

    const entries =
        appData.journalEntries;


    /*
     * Group journal entries by account
     */

    const grouped = {};


    entries.forEach(entry => {

        const account =
            entry.account || "Unknown";


        if (!grouped[account]) {

            grouped[account] = [];

        }


        grouped[account].push(entry);

    });


    const accounts =
        Object.keys(grouped);


    /*
     * Create ledger rows
     */

    const rows =
        accounts.map(account => {

            return grouped[account]
                .map(entry => `

                    <tr>

                        <td>
                            ${escapeHTML(
                                entry.date || ""
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                entry.reference || ""
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                entry.description || ""
                            )}
                        </td>

                        <td>
                            Nu.
                            ${formatMoney(
                                Number(
                                    entry.debit || 0
                                )
                            )}
                        </td>

                        <td>
                            Nu.
                            ${formatMoney(
                                Number(
                                    entry.credit || 0
                                )
                            )}
                        </td>

                    </tr>

                `)
                .join("");

        })
        .join("");


    return `

        <div class="page-header">

            <h2>
                General Ledger
            </h2>

            <p>
                Account-by-account transaction history.
            </p>

        </div>


        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Date
                            </th>

                            <th>
                                Reference
                            </th>

                            <th>
                                Description
                            </th>

                            <th>
                                Debit
                            </th>

                            <th>
                                Credit
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            rows ||

                            `
                            <tr>

                                <td
                                    colspan="5"
                                    class="empty">

                                    No journal entries yet.

                                </td>

                            </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>


            <!-- REPORT ACTIONS -->

            <div class="report-actions">

                <button
                    onclick="exportLedgerCSV()">

                    📄 Export CSV

                </button>


                <button
                    onclick="printLedger()">

                    🖨️ Print / Save PDF

                </button>

            </div>


        </div>

    `;

}


/* =========================================================
   GENERAL LEDGER CSV EXPORT
   ========================================================= */

function exportLedgerCSV() {

    const entries =
        appData.journalEntries;


    let csv =
        "PT Accounting System\n";

    csv +=
        "General Ledger Report\n\n";


    csv +=
        "Account,Date,Reference,Description,Debit,Credit\n";


    entries.forEach(entry => {

        const account =
            entry.account || "Unknown";


        const date =
            entry.date || "";


        const reference =
            entry.reference || "";


        const description =
            entry.description || "";


        const debit =
            Number(entry.debit || 0);


        const credit =
            Number(entry.credit || 0);


        const safeAccount =
            account.replace(
                /"/g,
                '""'
            );


        const safeDate =
            date.replace(
                /"/g,
                '""'
            );


        const safeReference =
            reference.replace(
                /"/g,
                '""'
            );


        const safeDescription =
            description.replace(
                /"/g,
                '""'
            );


        csv +=
            `"${safeAccount}",` +
            `"${safeDate}",` +
            `"${safeReference}",` +
            `"${safeDescription}",` +
            `${debit.toFixed(2)},` +
            `${credit.toFixed(2)}\n`;

    });


    /*
     * Totals
     */

    const totalDebit =
        entries.reduce(
            (sum, entry) =>
                sum +
                Number(
                    entry.debit || 0
                ),
            0
        );


    const totalCredit =
        entries.reduce(
            (sum, entry) =>
                sum +
                Number(
                    entry.credit || 0
                ),
            0
        );


    csv +=
        `\n"TOTAL","","","","` +
        `${totalDebit.toFixed(2)},` +
        `${totalCredit.toFixed(2)}"\n`;


    /*
     * Download CSV
     */

    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        "PT-Accounting-General-Ledger.csv";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


/* =========================================================
   GENERAL LEDGER PRINT / SAVE PDF
   ========================================================= */

function printLedger() {

    const entries =
        appData.journalEntries;


    const totalDebit =
        entries.reduce(
            (sum, entry) =>
                sum +
                Number(
                    entry.debit || 0
                ),
            0
        );


    const totalCredit =
        entries.reduce(
            (sum, entry) =>
                sum +
                Number(
                    entry.credit || 0
                ),
            0
        );


    const rows =
        entries.map(entry => `

            <tr>

                <td>
                    ${escapeHTML(
                        entry.account || "Unknown"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        entry.date || ""
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        entry.reference || ""
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        entry.description || ""
                    )}
                </td>

                <td class="number">
                    Nu.
                    ${formatMoney(
                        Number(
                            entry.debit || 0
                        )
                    )}
                </td>

                <td class="number">
                    Nu.
                    ${formatMoney(
                        Number(
                            entry.credit || 0
                        )
                    )}
                </td>

            </tr>

        `)
        .join("");


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print the report."
        );

        return;

    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                General Ledger Report
            </title>


            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    padding:
                        30px;

                }


                h1 {

                    text-align:
                        center;

                    margin-bottom:
                        5px;

                }


                h2 {

                    text-align:
                        center;

                    margin-top:
                        5px;

                }


                .date {

                    text-align:
                        center;

                    margin-bottom:
                        30px;

                    color:
                        #555;

                }


                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                }


                th,
                td {

                    border:
                        1px solid #000;

                    padding:
                        8px;

                }


                th {

                    background:
                        #eeeeee;

                }


                .number {

                    text-align:
                        right;

                }


                tfoot {

                    font-weight:
                        bold;

                }


                @media print {

                    body {

                        padding:
                            15px;

                    }

                }

            </style>

        </head>


        <body>


            <h1>
                PT Accounting System
            </h1>


            <h2>
                General Ledger
            </h2>


            <div class="date">

                Generated on:
                ${new Date().toLocaleString()}

            </div>


            <table>

                <thead>

                    <tr>

                        <th>
                            Account
                        </th>

                        <th>
                            Date
                        </th>

                        <th>
                            Reference
                        </th>

                        <th>
                            Description
                        </th>

                        <th>
                            Debit
                        </th>

                        <th>
                            Credit
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        rows ||

                        `
                        <tr>

                            <td colspan="6">

                                No journal entries yet.

                            </td>

                        </tr>
                        `
                    }

                </tbody>


                <tfoot>

                    <tr>

                        <th colspan="4">
                            TOTAL
                        </th>

                        <th class="number">

                            Nu.
                            ${formatMoney(
                                totalDebit
                            )}

                        </th>

                        <th class="number">

                            Nu.
                            ${formatMoney(
                                totalCredit
                            )}

                        </th>

                    </tr>

                </tfoot>

            </table>


        </body>

        </html>

    `);


    printWindow.document.close();


    printWindow.focus();


    setTimeout(
        () => {

            printWindow.print();

        },
        250
    );

}

/* =========================================================
   TRIAL BALANCE
   ========================================================= */
/* =========================================================
   TRIAL BALANCE PAGE
   ========================================================= */

function trialBalancePage() {

    const balances = {};


    appData.journalEntries.forEach(entry => {

        const account =
            entry.account || "Unassigned";


        if (!balances[account]) {

            balances[account] = {
                debit: 0,
                credit: 0
            };

        }


        balances[account].debit +=
            Number(entry.debit || 0);


        balances[account].credit +=
            Number(entry.credit || 0);

    });


    const accounts =
        Object.keys(balances);


    const rows =
        accounts.map(account => `

            <tr>

                <td>
                    ${escapeHTML(account)}
                </td>

                <td>
                    Nu.
                    ${formatMoney(
                        balances[account].debit
                    )}
                </td>

                <td>
                    Nu.
                    ${formatMoney(
                        balances[account].credit
                    )}
                </td>

            </tr>

        `)
        .join("");


    const totalDebit =
        Object.values(balances).reduce(
            (sum, balance) =>
                sum + balance.debit,
            0
        );


    const totalCredit =
        Object.values(balances).reduce(
            (sum, balance) =>
                sum + balance.credit,
            0
        );


    return `

        <div class="page-header">

            <h2>
                Trial Balance
            </h2>

            <p>
                Debit and credit balances of all accounts.
            </p>

        </div>


        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Account
                            </th>

                            <th>
                                Debit
                            </th>

                            <th>
                                Credit
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            rows ||

                            `
                            <tr>

                                <td
                                    colspan="3"
                                    class="empty">

                                    No journal entries yet.

                                </td>

                            </tr>
                            `
                        }

                    </tbody>


                    <tfoot>

                        <tr>

                            <th>
                                TOTAL
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(totalDebit)}
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(totalCredit)}
                            </th>

                        </tr>

                    </tfoot>

                </table>

            </div>


            <!-- REPORT ACTIONS -->

            <div class="report-actions">

                <button
                    onclick="exportTrialBalanceCSV()">

                    📄 Export CSV

                </button>


                <button
                    onclick="printTrialBalance()">

                    🖨️ Print / Save PDF

                </button>

            </div>


        </div>

    `;

}


/* =========================================================
   TRIAL BALANCE CSV EXPORT
   ========================================================= */

function exportTrialBalanceCSV() {

    const balances = {};


    appData.journalEntries.forEach(entry => {

        const account =
            entry.account || "Unassigned";


        if (!balances[account]) {

            balances[account] = {
                debit: 0,
                credit: 0
            };

        }


        balances[account].debit +=
            Number(entry.debit || 0);


        balances[account].credit +=
            Number(entry.credit || 0);

    });


    const accounts =
        Object.keys(balances);


    let csv =
        "PT Accounting System\n";

    csv +=
        "Trial Balance Report\n\n";

    csv +=
        "Account,Debit,Credit\n";


    accounts.forEach(account => {

        const balance =
            balances[account];


        const safeAccount =
            account.replace(/"/g, '""');


        csv +=
            `"${safeAccount}",` +
            `${balance.debit.toFixed(2)},` +
            `${balance.credit.toFixed(2)}\n`;

    });


    const totalDebit =
        Object.values(balances).reduce(
            (sum, balance) =>
                sum + balance.debit,
            0
        );


    const totalCredit =
        Object.values(balances).reduce(
            (sum, balance) =>
                sum + balance.credit,
            0
        );


    csv +=
        `"TOTAL",` +
        `${totalDebit.toFixed(2)},` +
        `${totalCredit.toFixed(2)}\n`;


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        "PT-Accounting-Trial-Balance.csv";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


/* =========================================================
   TRIAL BALANCE PRINT / SAVE PDF
   ========================================================= */

function printTrialBalance() {

    const balances = {};


    appData.journalEntries.forEach(entry => {

        const account =
            entry.account || "Unassigned";


        if (!balances[account]) {

            balances[account] = {
                debit: 0,
                credit: 0
            };

        }


        balances[account].debit +=
            Number(entry.debit || 0);


        balances[account].credit +=
            Number(entry.credit || 0);

    });


    const accounts =
        Object.keys(balances);


    const totalDebit =
        Object.values(balances).reduce(
            (sum, balance) =>
                sum + balance.debit,
            0
        );


    const totalCredit =
        Object.values(balances).reduce(
            (sum, balance) =>
                sum + balance.credit,
            0
        );


    const rows =
        accounts.map(account => {

            const balance =
                balances[account];


            return `

                <tr>

                    <td>
                        ${escapeHTML(account)}
                    </td>

                    <td class="number">
                        Nu.
                        ${formatMoney(
                            balance.debit
                        )}
                    </td>

                    <td class="number">
                        Nu.
                        ${formatMoney(
                            balance.credit
                        )}
                    </td>

                </tr>

            `;

        })
        .join("");


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print the report."
        );

        return;

    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Trial Balance Report
            </title>


            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    padding:
                        40px;

                }


                h1 {

                    text-align:
                        center;

                    margin-bottom:
                        5px;

                }


                h2 {

                    text-align:
                        center;

                    margin-top:
                        5px;

                }


                .date {

                    text-align:
                        center;

                    margin-bottom:
                        30px;

                }


                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                }


                th,
                td {

                    border:
                        1px solid #000;

                    padding:
                        10px;

                }


                th {

                    background:
                        #eeeeee;

                }


                .number {

                    text-align:
                        right;

                }


                tfoot {

                    font-weight:
                        bold;

                }


                @media print {

                    body {

                        padding:
                            20px;

                    }

                }

            </style>

        </head>


        <body>


            <h1>
                PT Accounting System
            </h1>


            <h2>
                Trial Balance
            </h2>


            <div class="date">

                Generated on:
                ${new Date().toLocaleString()}

            </div>


            <table>

                <thead>

                    <tr>

                        <th>
                            Account
                        </th>

                        <th>
                            Debit
                        </th>

                        <th>
                            Credit
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        rows ||

                        `
                        <tr>

                            <td colspan="3">

                                No journal entries yet.

                            </td>

                        </tr>
                        `
                    }

                </tbody>


                <tfoot>

                    <tr>

                        <th>
                            TOTAL
                        </th>

                        <th class="number">

                            Nu.
                            ${formatMoney(totalDebit)}

                        </th>

                        <th class="number">

                            Nu.
                            ${formatMoney(totalCredit)}

                        </th>

                    </tr>

                </tfoot>

            </table>


        </body>

        </html>

    `);


    printWindow.document.close();


    printWindow.focus();


    setTimeout(
        () => {

            printWindow.print();

        },
        250
    );

}


/* =========================================================
   PROFIT & LOSS
   ========================================================= */

/* =========================================================
   PROFIT & LOSS PAGE
   ========================================================= */

function profitLossPage() {

    const sales =
        calculateSales();

    const cogs =
        calculateCOGS();

    const expenses =
        calculateExpenses();


    const actualCOGS =
        cogs > 0
            ? cogs
            : calculatePurchases();


    const grossProfit =
        sales - actualCOGS;


    const netProfit =
        grossProfit - expenses;


    return `

        <div class="page-header">

            <h2>
                Profit & Loss
            </h2>

            <p>
                Financial performance of the business.
            </p>

        </div>


        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Particulars
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        <tr>

                            <td>
                                Sales Revenue
                            </td>

                            <td>
                                Nu.
                                ${formatMoney(sales)}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Cost of Goods Sold
                            </td>

                            <td>
                                Nu.
                                ${formatMoney(actualCOGS)}
                            </td>

                        </tr>


                        <tr>

                            <th>
                                Gross Profit
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(grossProfit)}
                            </th>

                        </tr>


                        <tr>

                            <td>
                                Expenses
                            </td>

                            <td>
                                Nu.
                                ${formatMoney(expenses)}
                            </td>

                        </tr>


                        <tr>

                            <th>
                                Net Profit
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(netProfit)}
                            </th>

                        </tr>

                    </tbody>

                </table>

            </div>


            <!-- REPORT ACTIONS -->

            <div class="report-actions">

                <button
                    onclick="exportProfitLossCSV()">

                    📄 Export CSV

                </button>


                <button
                    onclick="printProfitLoss()">

                    🖨️ Print / Save PDF

                </button>

            </div>


        </div>

    `;

}


/* =========================================================
   PROFIT & LOSS CSV EXPORT
   ========================================================= */

function exportProfitLossCSV() {

    const sales =
        calculateSales();

    const cogs =
        calculateCOGS();

    const expenses =
        calculateExpenses();


    const actualCOGS =
        cogs > 0
            ? cogs
            : calculatePurchases();


    const grossProfit =
        sales - actualCOGS;


    const netProfit =
        grossProfit - expenses;


    let csv =
        "PT Accounting System\n";

    csv +=
        "Profit & Loss Report\n\n";

    csv +=
        "Particulars,Amount\n";


    csv +=
        `"Sales Revenue",${sales.toFixed(2)}\n`;

    csv +=
        `"Cost of Goods Sold",${actualCOGS.toFixed(2)}\n`;

    csv +=
        `"Gross Profit",${grossProfit.toFixed(2)}\n`;

    csv +=
        `"Expenses",${expenses.toFixed(2)}\n`;

    csv +=
        `"Net Profit",${netProfit.toFixed(2)}\n`;


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        "PT-Accounting-Profit-Loss.csv";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


/* =========================================================
   PROFIT & LOSS PRINT / SAVE PDF
   ========================================================= */

function printProfitLoss() {

    const sales =
        calculateSales();

    const cogs =
        calculateCOGS();

    const expenses =
        calculateExpenses();


    const actualCOGS =
        cogs > 0
            ? cogs
            : calculatePurchases();


    const grossProfit =
        sales - actualCOGS;


    const netProfit =
        grossProfit - expenses;


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print the report."
        );

        return;

    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Profit & Loss Report
            </title>


            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    padding:
                        40px;

                }


                h1 {

                    text-align:
                        center;

                    margin-bottom:
                        5px;

                }


                h2 {

                    text-align:
                        center;

                    margin-top:
                        5px;

                }


                .date {

                    text-align:
                        center;

                    margin-bottom:
                        30px;

                    color:
                        #555;

                }


                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                }


                th,
                td {

                    border:
                        1px solid #000;

                    padding:
                        12px;

                }


                th {

                    background:
                        #eeeeee;

                }


                td:last-child,
                th:last-child {

                    text-align:
                        right;

                }


                .total {

                    font-weight:
                        bold;

                }


                .profit {

                    font-weight:
                        bold;

                }


                @media print {

                    body {

                        padding:
                            20px;

                    }

                }

            </style>

        </head>


        <body>


            <h1>
                PT Accounting System
            </h1>


            <h2>
                Profit & Loss Statement
            </h2>


            <div class="date">

                Generated on:
                ${new Date().toLocaleString()}

            </div>


            <table>

                <thead>

                    <tr>

                        <th>
                            Particulars
                        </th>

                        <th>
                            Amount
                        </th>

                    </tr>

                </thead>


                <tbody>

                    <tr>

                        <td>
                            Sales Revenue
                        </td>

                        <td>
                            Nu. ${formatMoney(sales)}
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Cost of Goods Sold
                        </td>

                        <td>
                            Nu. ${formatMoney(actualCOGS)}
                        </td>

                    </tr>


                    <tr class="total">

                        <td>
                            Gross Profit
                        </td>

                        <td>
                            Nu. ${formatMoney(grossProfit)}
                        </td>

                    </tr>


                    <tr>

                        <td>
                            Expenses
                        </td>

                        <td>
                            Nu. ${formatMoney(expenses)}
                        </td>

                    </tr>


                    <tr class="profit">

                        <td>
                            Net Profit
                        </td>

                        <td>
                            Nu. ${formatMoney(netProfit)}
                        </td>

                    </tr>

                </tbody>

            </table>


        </body>

        </html>

    `);


    printWindow.document.close();


    printWindow.focus();


    setTimeout(
        () => {

            printWindow.print();

        },
        250
    );

}
/* =========================================================
   BALANCE SHEET
   ========================================================= */

/* =========================================================
   BALANCE SHEET PAGE
   ========================================================= */

function balanceSheetPage() {

    const balances = {};


    appData.journalEntries.forEach(entry => {

        const account =
            entry.account || "Unassigned";


        if (!balances[account]) {

            balances[account] = {
                debit: 0,
                credit: 0
            };

        }


        balances[account].debit +=
            Number(entry.debit || 0);


        balances[account].credit +=
            Number(entry.credit || 0);

    });


    /*
     * Calculate account balances
     */

    const accountBalances = {};


    Object.keys(balances).forEach(account => {

        accountBalances[account] =
            balances[account].debit -
            balances[account].credit;

    });


    /*
     * Classify accounts
     *
     * This uses account names so it works
     * with the current journal-entry structure.
     */

    const assets = {};
    const liabilities = {};
    const equity = {};


    Object.keys(accountBalances).forEach(account => {

        const name =
            account.toLowerCase();

        const balance =
            accountBalances[account];


        if (
            name.includes("cash") ||
            name.includes("bank") ||
            name.includes("receivable") ||
            name.includes("inventory") ||
            name.includes("asset") ||
            name.includes("equipment") ||
            name.includes("property") ||
            name.includes("vehicle")
        ) {

            assets[account] =
                balance;

        }


        else if (
            name.includes("payable") ||
            name.includes("loan") ||
            name.includes("liability") ||
            name.includes("tax payable")
        ) {

            liabilities[account] =
                -balance;

        }


        else if (
            name.includes("capital") ||
            name.includes("equity") ||
            name.includes("owner")
        ) {

            equity[account] =
                -balance;

        }

    });


/*
 * Calculate Inventory Asset Value
 *
 * Inventory value is based on:
 * Current Stock × Purchase Price
 */

const inventoryValue =
    appData.products.reduce(
        (sum, product) => {

            const stock =
                Number(
                    product.stock || 0
                );

            const cost =
                Number(
                    product.cost || 0
                );

            return sum +
                (stock * cost);

        },
        0
    );


/*
 * Replace journal-based Inventory
 * with actual inventory value
 */

if (
    appData.products.length > 0
) {

    assets["Inventory"] =
        inventoryValue;

}


/*
 * Calculate totals
 */

const totalAssets =
    Object.values(assets).reduce(
        (sum, value) =>
            sum + value,
        0
    );


    const totalLiabilities =
        Object.values(liabilities).reduce(
            (sum, value) =>
                sum + value,
            0
        );


    const totalEquity =
        Object.values(equity).reduce(
            (sum, value) =>
                sum + value,
            0
        );


    /*
     * Get current net profit
     */

    const sales =
        calculateSales();


    const cogs =
        calculateCOGS();


    const expenses =
        calculateExpenses();


    const actualCOGS =
        cogs > 0
            ? cogs
            : calculatePurchases();


    const grossProfit =
        sales - actualCOGS;


    const netProfit =
        grossProfit - expenses;


    /*
     * Add current profit to equity
     */

    const totalEquityWithProfit =
        totalEquity + netProfit;


    const totalLiabilitiesEquity =
        totalLiabilities +
        totalEquityWithProfit;


    const balanceCheck =
        totalAssets -
        totalLiabilitiesEquity;


    /*
     * Asset rows
     */

    const assetRows =
        Object.keys(assets)
            .map(account => `

                <tr>

                    <td>
                        ${escapeHTML(account)}
                    </td>

                    <td>
                        Nu.
                        ${formatMoney(
                            assets[account]
                        )}
                    </td>

                </tr>

            `)
            .join("");


    /*
     * Liability rows
     */

    const liabilityRows =
        Object.keys(liabilities)
            .map(account => `

                <tr>

                    <td>
                        ${escapeHTML(account)}
                    </td>

                    <td>
                        Nu.
                        ${formatMoney(
                            liabilities[account]
                        )}
                    </td>

                </tr>

            `)
            .join("");


    /*
     * Equity rows
     */

    const equityRows =
        Object.keys(equity)
            .map(account => `

                <tr>

                    <td>
                        ${escapeHTML(account)}
                    </td>

                    <td>
                        Nu.
                        ${formatMoney(
                            equity[account]
                        )}
                    </td>

                </tr>

            `)
            .join("");


    return `

        <div class="page-header">

            <h2>
                Balance Sheet
            </h2>

            <p>
                Financial position of the business.
            </p>

        </div>


        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Assets
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            assetRows ||

                            `
                            <tr>

                                <td>
                                    No assets.
                                </td>

                                <td>
                                    Nu. 0.00
                                </td>

                            </tr>
                            `
                        }


                        <tr>

                            <th>
                                Total Assets
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(
                                    totalAssets
                                )}
                            </th>

                        </tr>

                    </tbody>

                </table>

            </div>


            <br>


            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Liabilities
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            liabilityRows ||

                            `
                            <tr>

                                <td>
                                    No liabilities.
                                </td>

                                <td>
                                    Nu. 0.00
                                </td>

                            </tr>
                            `
                        }


                        <tr>

                            <th>
                                Total Liabilities
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(
                                    totalLiabilities
                                )}
                            </th>

                        </tr>

                    </tbody>

                </table>

            </div>


            <br>


            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Equity
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            equityRows ||

                            `
                            <tr>

                                <td>
                                    No equity accounts.
                                </td>

                                <td>
                                    Nu. 0.00
                                </td>

                            </tr>
                            `
                        }


                        <tr>

                            <td>
                                Current Net Profit
                            </td>

                            <td>
                                Nu.
                                ${formatMoney(
                                    netProfit
                                )}
                            </td>

                        </tr>


                        <tr>

                            <th>
                                Total Equity
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(
                                    totalEquityWithProfit
                                )}
                            </th>

                        </tr>


                        <tr>

                            <th>
                                Total Liabilities
                                + Equity
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(
                                    totalLiabilitiesEquity
                                )}
                            </th>

                        </tr>


                        <tr>

                            <th>
                                Balance Sheet Check
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(
                                    balanceCheck
                                )}
                            </th>

                        </tr>

                    </tbody>

                </table>

            </div>


            <!-- REPORT ACTIONS -->

            <div class="report-actions">

                <button
                    onclick="exportBalanceSheetCSV()">

                    📄 Export CSV

                </button>


                <button
                    onclick="printBalanceSheet()">

                    🖨️ Print / Save PDF

                </button>

            </div>


        </div>

    `;

}


/* =========================================================
   BALANCE SHEET CSV EXPORT
   ========================================================= */

function exportBalanceSheetCSV() {

    const balances = {};


    appData.journalEntries.forEach(entry => {

        const account =
            entry.account || "Unassigned";


        if (!balances[account]) {

            balances[account] = {
                debit: 0,
                credit: 0
            };

        }


        balances[account].debit +=
            Number(entry.debit || 0);


        balances[account].credit +=
            Number(entry.credit || 0);

    });


    const accountBalances = {};


    Object.keys(balances).forEach(account => {

        accountBalances[account] =
            balances[account].debit -
            balances[account].credit;

    });


    const assets = {};
    const liabilities = {};
    const equity = {};


    Object.keys(accountBalances).forEach(account => {

        const name =
            account.toLowerCase();


        const balance =
            accountBalances[account];


        if (
            name.includes("cash") ||
            name.includes("bank") ||
            name.includes("receivable") ||
            name.includes("inventory") ||
            name.includes("asset") ||
            name.includes("equipment") ||
            name.includes("property") ||
            name.includes("vehicle")
        ) {

            assets[account] =
                balance;

        }


        else if (
            name.includes("payable") ||
            name.includes("loan") ||
            name.includes("liability") ||
            name.includes("tax payable")
        ) {

            liabilities[account] =
                -balance;

        }


        else if (
            name.includes("capital") ||
            name.includes("equity") ||
            name.includes("owner")
        ) {

            equity[account] =
                -balance;

        }

    });


    const totalAssets =
        Object.values(assets).reduce(
            (sum, value) =>
                sum + value,
            0
        );


    const totalLiabilities =
        Object.values(liabilities).reduce(
            (sum, value) =>
                sum + value,
            0
        );


    const totalEquity =
        Object.values(equity).reduce(
            (sum, value) =>
                sum + value,
            0
        );


    const sales =
        calculateSales();


    const cogs =
        calculateCOGS();


    const expenses =
        calculateExpenses();


    const actualCOGS =
        cogs > 0
            ? cogs
            : calculatePurchases();


    const grossProfit =
        sales - actualCOGS;


    const netProfit =
        grossProfit - expenses;


    const totalEquityWithProfit =
        totalEquity + netProfit;


    const totalLiabilitiesEquity =
        totalLiabilities +
        totalEquityWithProfit;


    const balanceCheck =
        totalAssets -
        totalLiabilitiesEquity;


    let csv =
        "PT Accounting System\n";

    csv +=
        "Balance Sheet Report\n\n";


    csv +=
        "ASSETS\n";

    csv +=
        "Account,Amount\n";


    Object.keys(assets).forEach(account => {

        csv +=
            `"${account.replace(/"/g, '""')}",` +
            `${assets[account].toFixed(2)}\n`;

    });


    csv +=
        `"Total Assets",${totalAssets.toFixed(2)}\n\n`;


    csv +=
        "LIABILITIES\n";

    csv +=
        "Account,Amount\n";


    Object.keys(liabilities).forEach(account => {

        csv +=
            `"${account.replace(/"/g, '""')}",` +
            `${liabilities[account].toFixed(2)}\n`;

    });


    csv +=
        `"Total Liabilities",${totalLiabilities.toFixed(2)}\n\n`;


    csv +=
        "EQUITY\n";

    csv +=
        "Account,Amount\n";


    Object.keys(equity).forEach(account => {

        csv +=
            `"${account.replace(/"/g, '""')}",` +
            `${equity[account].toFixed(2)}\n`;

    });


    csv +=
        `"Current Net Profit",${netProfit.toFixed(2)}\n`;


    csv +=
        `"Total Equity",${totalEquityWithProfit.toFixed(2)}\n`;


    csv +=
        `"Total Liabilities + Equity",` +
        `${totalLiabilitiesEquity.toFixed(2)}\n`;


    csv +=
        `"Balance Sheet Check",` +
        `${balanceCheck.toFixed(2)}\n`;


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        "PT-Accounting-Balance-Sheet.csv";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


/* =========================================================
   BALANCE SHEET PRINT / SAVE PDF
   ========================================================= */

function printBalanceSheet() {

    const balances = {};


    appData.journalEntries.forEach(entry => {

        const account =
            entry.account || "Unassigned";


        if (!balances[account]) {

            balances[account] = {
                debit: 0,
                credit: 0
            };

        }


        balances[account].debit +=
            Number(entry.debit || 0);


        balances[account].credit +=
            Number(entry.credit || 0);

    });


    const accountBalances = {};


    Object.keys(balances).forEach(account => {

        accountBalances[account] =
            balances[account].debit -
            balances[account].credit;

    });


    const assets = {};
    const liabilities = {};
    const equity = {};


    Object.keys(accountBalances).forEach(account => {

        const name =
            account.toLowerCase();


        const balance =
            accountBalances[account];


        if (
            name.includes("cash") ||
            name.includes("bank") ||
            name.includes("receivable") ||
            name.includes("inventory") ||
            name.includes("asset") ||
            name.includes("equipment") ||
            name.includes("property") ||
            name.includes("vehicle")
        ) {

            assets[account] =
                balance;

        }


        else if (
            name.includes("payable") ||
            name.includes("loan") ||
            name.includes("liability") ||
            name.includes("tax payable")
        ) {

            liabilities[account] =
                -balance;

        }


        else if (
            name.includes("capital") ||
            name.includes("equity") ||
            name.includes("owner")
        ) {

            equity[account] =
                -balance;

        }

    });


    const totalAssets =
        Object.values(assets).reduce(
            (sum, value) =>
                sum + value,
            0
        );


    const totalLiabilities =
        Object.values(liabilities).reduce(
            (sum, value) =>
                sum + value,
            0
        );


    const totalEquity =
        Object.values(equity).reduce(
            (sum, value) =>
                sum + value,
            0
        );


    const sales =
        calculateSales();


    const cogs =
        calculateCOGS();


    const expenses =
        calculateExpenses();


    const actualCOGS =
        cogs > 0
            ? cogs
            : calculatePurchases();


    const grossProfit =
        sales - actualCOGS;


    const netProfit =
        grossProfit - expenses;


    const totalEquityWithProfit =
        totalEquity + netProfit;


    const totalLiabilitiesEquity =
        totalLiabilities +
        totalEquityWithProfit;


    const balanceCheck =
        totalAssets -
        totalLiabilitiesEquity;


    const assetRows =
        Object.keys(assets)
            .map(account => `

                <tr>

                    <td>
                        ${escapeHTML(account)}
                    </td>

                    <td>
                        Nu.
                        ${formatMoney(
                            assets[account]
                        )}
                    </td>

                </tr>

            `)
            .join("");


    const liabilityRows =
        Object.keys(liabilities)
            .map(account => `

                <tr>

                    <td>
                        ${escapeHTML(account)}
                    </td>

                    <td>
                        Nu.
                        ${formatMoney(
                            liabilities[account]
                        )}
                    </td>

                </tr>

            `)
            .join("");


    const equityRows =
        Object.keys(equity)
            .map(account => `

                <tr>

                    <td>
                        ${escapeHTML(account)}
                    </td>

                    <td>
                        Nu.
                        ${formatMoney(
                            equity[account]
                        )}
                    </td>

                </tr>

            `)
            .join("");


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups to print the report."
        );

        return;

    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Balance Sheet Report
            </title>


            <style>

                body {

                    font-family:
                        Arial,
                        sans-serif;

                    padding:
                        40px;

                }


                h1,
                h2 {

                    text-align:
                        center;

                }


                .date {

                    text-align:
                        center;

                    margin-bottom:
                        30px;

                    color:
                        #555;

                }


                h3 {

                    margin-top:
                        25px;

                }


                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                    margin-bottom:
                        20px;

                }


                th,
                td {

                    border:
                        1px solid #000;

                    padding:
                        10px;

                }


                th {

                    background:
                        #eeeeee;

                }


                td:last-child,
                th:last-child {

                    text-align:
                        right;

                }


                .total {

                    font-weight:
                        bold;

                }


                .check {

                    font-weight:
                        bold;

                }


                @media print {

                    body {

                        padding:
                            20px;

                    }

                }

            </style>

        </head>


        <body>


            <h1>
                PT Accounting System
            </h1>


            <h2>
                Balance Sheet
            </h2>


            <div class="date">

                Generated on:
                ${new Date().toLocaleString()}

            </div>


            <h3>
                Assets
            </h3>


            <table>

                <thead>

                    <tr>

                        <th>
                            Account
                        </th>

                        <th>
                            Amount
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${assetRows}


                    <tr class="total">

                        <th>
                            Total Assets
                        </th>

                        <th>
                            Nu.
                            ${formatMoney(
                                totalAssets
                            )}
                        </th>

                    </tr>

                </tbody>

            </table>


            <h3>
                Liabilities
            </h3>


            <table>

                <thead>

                    <tr>

                        <th>
                            Account
                        </th>

                        <th>
                            Amount
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${liabilityRows}


                    <tr class="total">

                        <th>
                            Total Liabilities
                        </th>

                        <th>
                            Nu.
                            ${formatMoney(
                                totalLiabilities
                            )}
                        </th>

                    </tr>

                </tbody>

            </table>


            <h3>
                Equity
            </h3>


            <table>

                <thead>

                    <tr>

                        <th>
                            Account
                        </th>

                        <th>
                            Amount
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${equityRows}


                    <tr>

                        <td>
                            Current Net Profit
                        </td>

                        <td>
                            Nu.
                            ${formatMoney(
                                netProfit
                            )}
                        </td>

                    </tr>


                    <tr class="total">

                        <th>
                            Total Equity
                        </th>

                        <th>
                            Nu.
                            ${formatMoney(
                                totalEquityWithProfit
                            )}
                        </th>

                    </tr>


                    <tr class="total">

                        <th>
                            Total Liabilities + Equity
                        </th>

                        <th>
                            Nu.
                            ${formatMoney(
                                totalLiabilitiesEquity
                            )}
                        </th>

                    </tr>


                    <tr class="check">

                        <th>
                            Balance Sheet Check
                        </th>

                        <th>
                            Nu.
                            ${formatMoney(
                                balanceCheck
                            )}
                        </th>

                    </tr>

                </tbody>

            </table>


        </body>

        </html>

    `);


    printWindow.document.close();


    printWindow.focus();


    setTimeout(
        () => {

            printWindow.print();

        },
        250
    );

}
/* =========================================================
   SETTINGS
   ========================================================= */

function settingsPage() {

    const businessName =
        localStorage.getItem("businessName") || "";


    return `

        <div class="page-header">

            <h2>
                Settings
            </h2>

            <p>
                Configure your accounting system.
            </p>

        </div>


        <div class="panel">

            <h3>
                Business Information
            </h3>


            <div class="form-grid">

                <div class="form-group">

                    <label>
                        Business Name
                    </label>

                    <input
                        type="text"
                        id="businessName"
                        value="${escapeAttribute(
                            businessName
                        )}"
                        placeholder="Enter business name"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Currency
                    </label>

                    <input
                        type="text"
                        value="BTN / Nu."
                        disabled
                    >

                </div>

            </div>


            <br>


            <button
                type="button"
                class="btn btn-primary"
                onclick="saveSettings()">

                Save Settings

            </button>

        </div>


        <div class="panel">

            <h3>
                Data Management
            </h3>

            <p>
                Your accounting data is stored locally
                in your browser.
            </p>


            <button
                type="button"
                class="btn btn-danger"
                onclick="clearAllData()">

                Clear All Data

            </button>

        </div>

    `;

}


/* =========================================================
   SAVE ACCOUNT
   ========================================================= */

function saveAccount() {

    const codeElement =
        document.getElementById("accountCode");

    const nameElement =
        document.getElementById("accountName");

    const typeElement =
        document.getElementById("accountType");

    const balanceElement =
        document.getElementById("accountBalance");


    if (
        !codeElement ||
        !nameElement ||
        !typeElement
    ) {

        return;

    }


    const code =
        codeElement.value.trim();

    const name =
        nameElement.value.trim();

    const type =
        typeElement.value;

    const balance =
        Number(
            balanceElement
                ? balanceElement.value || 0
                : 0
        );


    if (!code) {

        alert(
            "Please enter an account code."
        );

        return;

    }


    if (!name) {

        alert(
            "Please enter an account name."
        );

        return;

    }


    const duplicate =
        appData.accounts.some(
            account =>
                account.code === code
        );


    if (duplicate) {

        alert(
            "This account code already exists."
        );

        return;

    }


    appData.accounts.push({

        id: generateNumber("ACC"),

        code: code,

        name: name,

        type: type,

        balance: balance

    });


    saveData();

    alert(
        "Account saved successfully."
    );


    showPage("accounts");

}


/* =========================================================
   ADD CUSTOMER
   ========================================================= */

function saveCustomer() {

    const name =
        document
            .getElementById("customerName")
            .value
            .trim();


    const phone =
        document
            .getElementById("customerPhone")
            .value
            .trim();


    const email =
        document
            .getElementById("customerEmail")
            .value
            .trim();


    /*
     * Validate customer name
     */

    if (!name) {

        alert(
            "Please enter the customer name."
        );

        return;

    }


    /*
     * Save customer
     */

    appData.customers.push({

        id: generateNumber("CUS"),

        name: name,

        phone: phone,

        email: email,

        balance: 0

    });


    saveData();


    alert(
        "Customer added successfully."
    );


    /*
     * Refresh Customers page
     * The entry sheet will appear ready
     * for the next customer.
     */

    showPage("customers");

}


/* =========================================================
   CLEAR CUSTOMER FORM
   ========================================================= */

function clearCustomerForm() {

    document
        .getElementById("customerName")
        .value = "";


    document
        .getElementById("customerPhone")
        .value = "";


    document
        .getElementById("customerEmail")
        .value = "";


    document
        .getElementById("customerName")
        .focus();

}
/* =========================================================
   ADD SUPPLIER
   ========================================================= */

function saveSupplier() {

    const name =
        document
            .getElementById("supplierName")
            .value
            .trim();


    const phone =
        document
            .getElementById("supplierPhone")
            .value
            .trim();


    const email =
        document
            .getElementById("supplierEmail")
            .value
            .trim();


    /*
     * Validate supplier name
     */

    if (!name) {

        alert(
            "Please enter the supplier name."
        );

        return;

    }


    /*
     * Save supplier
     */

    appData.suppliers.push({

        id: generateNumber("SUP"),

        name: name,

        phone: phone,

        email: email,

        balance: 0

    });


    saveData();


    alert(
        "Supplier added successfully."
    );


    /*
     * Refresh Suppliers page
     * The entry sheet remains ready
     * for the next supplier.
     */

    showPage("suppliers");

}



/* =========================================================
   CLEAR SUPPLIER FORM
   ========================================================= */

function clearSupplierForm() {

    document
        .getElementById("supplierName")
        .value = "";


    document
        .getElementById("supplierPhone")
        .value = "";


    document
        .getElementById("supplierEmail")
        .value = "";


    document
        .getElementById("supplierName")
        .focus();

}

/* =========================================================
   CLEAR SUPPLIER FORM
   ========================================================= */

function clearSupplierForm() {

    document
        .getElementById("supplierName")
        .value = "";


    document
        .getElementById("supplierPhone")
        .value = "";


    document
        .getElementById("supplierEmail")
        .value = "";


    document
        .getElementById("supplierName")
        .focus();

}
/* =========================================================
   ADD PRODUCT
   ========================================================= */

function saveProduct() {

    const name =
        document
            .getElementById("productName")
            .value
            .trim();


    const cost =
        Number(
            document
                .getElementById("productCost")
                .value || 0
        );


    const price =
        Number(
            document
                .getElementById("productPrice")
                .value || 0
        );


    const openingStock =
        Number(
            document
                .getElementById("productOpeningStock")
                .value || 0
        );


    /*
     * Validate product name
     */

    if (!name) {

        alert(
            "Please enter the product name."
        );

        return;

    }


    /*
     * Validate numbers
     */

    if (
        cost < 0 ||
        price < 0 ||
        openingStock < 0
    ) {

        alert(
            "Values cannot be negative."
        );

        return;

    }


    /*
     * Save product
     */

    appData.products.push({

        id: generateNumber("PROD"),

        name: name,

        cost: cost,

        price: price,

        openingStock: openingStock,

        stock: openingStock

    });


    saveData();


    alert(
        "Product added successfully."
    );


    /*
     * Refresh Products page.
     * The entry sheet will be ready
     * for the next product.
     */

    showPage("products");

}

/* =========================================================
   CLEAR PRODUCT FORM
   ========================================================= */

function clearProductForm() {

    document
        .getElementById("productName")
        .value = "";


    document
        .getElementById("productCost")
        .value = "";


    document
        .getElementById("productPrice")
        .value = "";


    document
        .getElementById("productOpeningStock")
        .value = "";


    document
        .getElementById("productName")
        .focus();

}

/* =========================================================
   ADD SALE
   ========================================================= */

function updateSalePrice() {

    const productName =
        document
            .getElementById("saleProduct")
            .value;


    const selectedProduct =
        appData.products.find(
            product =>
                product.name === productName
        );


    const price =
        selectedProduct
            ? Number(selectedProduct.price || 0)
            : 0;


    document
        .getElementById("saleUnitPrice")
        .value = price;


    updateSaleTotal();

}



/* =========================================================
   UPDATE SALES TOTAL
   ========================================================= */

function updateSaleTotal() {

    const quantity =
        Number(
            document
                .getElementById("saleQuantity")
                .value || 0
        );


    const unitPrice =
        Number(
            document
                .getElementById("saleUnitPrice")
                .value || 0
        );


    const total =
        quantity * unitPrice;


    document
        .getElementById("saleTotal")
        .value = total.toFixed(2);

}



/* =========================================================
   SAVE SALES INVOICE
   ========================================================= */

function saveSale() {

    const invoice =
        generateNumber("SI");


    const customerName =
        document
            .getElementById("saleCustomer")
            .value;


    const productName =
        document
            .getElementById("saleProduct")
            .value;


    const quantity =
        Number(
            document
                .getElementById("saleQuantity")
                .value || 0
        );


    const selectedProduct =
        appData.products.find(
            product =>
                product.name === productName
        );


    /* =====================================================
       VALIDATION
       ===================================================== */

    if (!customerName) {

        alert(
            "Please select a customer."
        );

        return;

    }


    if (!productName || !selectedProduct) {

        alert(
            "Please select a product."
        );

        return;

    }


    if (
        quantity <= 0 ||
        !Number.isFinite(quantity)
    ) {

        alert(
            "Quantity must be greater than zero."
        );

        return;

    }


    const availableStock =
        Number(
            selectedProduct.stock || 0
        );


    if (quantity > availableStock) {

        alert(
            "Insufficient stock.\n\n" +
            "Available stock: " +
            availableStock
        );

        return;

    }


    /* =====================================================
       PRICE
       ===================================================== */

    const unitPrice =
        Number(
            selectedProduct.price || 0
        );


    if (unitPrice <= 0) {

        alert(
            "Product selling price must be greater than zero."
        );

        return;

    }


    /* =====================================================
       CALCULATE SALE
       ===================================================== */

    const total =
        quantity *
        unitPrice;


    const unitCost =
        Number(
            selectedProduct.cost || 0
        );


    const cogs =
        quantity *
        unitCost;


    const grossProfit =
        total -
        cogs;


    /* =====================================================
       STATUS
       ===================================================== */

    const status =
        document
            .getElementById("saleStatus")
            .value;


    /* =====================================================
       CREATE SALES RECORD
       ===================================================== */

    appData.sales.push({

        id:
            generateNumber("SALE"),

        invoice:
            invoice,

        date:
            today(),

        customer:
            customerName,

        product:
            selectedProduct.name,

        quantity:
            quantity,

        unitPrice:
            unitPrice,

        total:
            total,

        status:
            status,

        cogs:
            cogs,

        grossProfit:
            grossProfit

    });


    /* =====================================================
       UPDATE INVENTORY
       ===================================================== */

    selectedProduct.stock =
        Number(selectedProduct.stock || 0) -
        quantity;


    /* =====================================================
       UPDATE CUSTOMER RECEIVABLE
       ===================================================== */

    const selectedCustomer =
        appData.customers.find(
            customer =>
                customer.name ===
                customerName
        );


    if (selectedCustomer) {

        selectedCustomer.balance =
            Number(
                selectedCustomer.balance || 0
            ) +
            total;

    }


    /* =====================================================
       DOUBLE-ENTRY JOURNAL
       ===================================================== */

    // Accounts Receivable — Debit

    createJournalEntry({

        date:
            today(),

        reference:
            invoice,

        description:
            "Sales invoice " +
            invoice,

        account:
            "Accounts Receivable",

        debit:
            total,

        credit:
            0

    });


    // Sales Revenue — Credit

    createJournalEntry({

        date:
            today(),

        reference:
            invoice,

        description:
            "Sales invoice " +
            invoice,

        account:
            "Sales Revenue",

        debit:
            0,

        credit:
            total

    });


    // Cost of Goods Sold — Debit

    createJournalEntry({

        date:
            today(),

        reference:
            invoice,

        description:
            "COGS for " +
            invoice,

        account:
            "Cost of Goods Sold",

        debit:
            cogs,

        credit:
            0

    });


    // Inventory — Credit

    createJournalEntry({

        date:
            today(),

        reference:
            invoice,

        description:
            "Inventory reduction for " +
            invoice,

        account:
            "Inventory",

        debit:
            0,

        credit:
            cogs

    });


    /* =====================================================
       SAVE
       ===================================================== */

    saveData();


    alert(
        "Sales invoice " +
        invoice +
        " created successfully.\n\n" +

        "Total: Nu. " +
        formatMoney(total) +

        "\nCOGS: Nu. " +
        formatMoney(cogs) +

        "\nGross Profit: Nu. " +
        formatMoney(grossProfit)
    );


    showPage("sales");

}


/* =========================================================
   CLEAR SALES FORM
   ========================================================= */

function clearSaleForm() {

    document
        .getElementById("saleCustomer")
        .value = "";


    document
        .getElementById("saleProduct")
        .value = "";


    document
        .getElementById("saleQuantity")
        .value = "1";


    document
        .getElementById("saleUnitPrice")
        .value = "";


    document
        .getElementById("saleTotal")
        .value = "";


    document
        .getElementById("saleStatus")
        .value = "Unpaid";

}

   
/* =========================================================
   ADD PURCHASE
   ========================================================= */

function addPurchase() {

    const invoice =
        generateNumber("PI");


    const supplier =
        prompt("Supplier name:");


    if (
        !supplier ||
        !supplier.trim()
    ) {

        return;

    }


    const total =
        Number(
            prompt("Purchase total:") || 0
        );


    if (total <= 0) {

        alert(
            "Purchase total must be greater than zero."
        );

        return;

    }


    const status =
        prompt(
            "Status (Unpaid / Partially Paid / Paid):",
            "Unpaid"
        ) || "Unpaid";


    appData.purchases.push({

        id: generateNumber("PUR"),

        invoice: invoice,

        date: today(),

        supplier: supplier.trim(),

        total: total,

        status: status.trim()

    });


    saveData();


    alert(
        "Purchase invoice " +
        invoice +
        " created successfully."
    );


    showPage("purchases");

}

function createJournalEntry(entry) {

    appData.journalEntries.push({

        id: generateNumber("JOURNAL"),

        date: entry.date || today(),

        reference: entry.reference || generateNumber("JE"),

        description: entry.description || "",

        account: entry.account || "",

        debit: Number(entry.debit || 0),

        credit: Number(entry.credit || 0)

    });

}
/* =========================================================
   ADD RECEIPT
   ========================================================= */

function addReceipt() {

    const from =
        prompt("Received from:");

    if (
        !from ||
        !from.trim()
    ) {
        return;
    }


    /* =====================================================
       CHECK CUSTOMER
       ===================================================== */

    const customer =
        appData.customers.find(
            customer =>
                customer.name.toLowerCase() ===
                from.trim().toLowerCase()
        );


    if (!customer) {

        alert(
            "Customer not found."
        );

        return;

    }


    /* =====================================================
       RECEIPT ACCOUNT
       ===================================================== */

    const account =
        prompt(
            "Receipt account:",
            "Cash/Bank"
        ) || "Cash/Bank";


    /* =====================================================
       AMOUNT
       ===================================================== */

    const amount =
        Number(
            prompt(
                "Amount received:",
                "0"
            ) || 0
        );


    if (
        amount <= 0 ||
        !Number.isFinite(amount)
    ) {

        alert(
            "Amount must be greater than zero."
        );

        return;

    }


    /* =====================================================
       CHECK RECEIVABLE BALANCE
       ===================================================== */

    const customerBalance =
        Number(
            customer.balance || 0
        );


    if (amount > customerBalance) {

        alert(
            "Receipt cannot be greater than " +
            "the customer's outstanding balance.\n\n" +

            "Outstanding balance: Nu. " +
            formatMoney(customerBalance)
        );

        return;

    }


    /* =====================================================
       REFERENCE
       ===================================================== */

    const reference =
        generateNumber("REC");


    /* =====================================================
       CREATE RECEIPT RECORD
       ===================================================== */

    appData.receipts.push({

        id:
            generateNumber("RECEIPT"),

        date:
            today(),

        reference:
            reference,

        from:
            from.trim(),

        account:
            account.trim(),

        amount:
            amount

    });


    /* =====================================================
       UPDATE CUSTOMER RECEIVABLE
       ===================================================== */

    customer.balance =
        customerBalance -
        amount;


    /* =====================================================
       DOUBLE-ENTRY ACCOUNTING
       ===================================================== */

    // Debit Cash / Bank
    createJournalEntry({

        date:
            today(),

        reference:
            reference,

        description:
            "Receipt from " +
            from.trim(),

        account:
            account.trim(),

        debit:
            amount,

        credit:
            0

    });


    // Credit Accounts Receivable
    createJournalEntry({

        date:
            today(),

        reference:
            reference,

        description:
            "Receipt from " +
            from.trim(),

        account:
            "Accounts Receivable",

        debit:
            0,

        credit:
            amount

    });


    /* =====================================================
       SAVE
       ===================================================== */

    saveData();


    alert(
        "Receipt " +
        reference +
        " recorded successfully.\n\n" +

        "Amount: Nu. " +
        formatMoney(amount) +

        "\nRemaining balance: Nu. " +
        formatMoney(
            customer.balance
        )
    );


    showPage("receipts");

}

/* =========================================================
   ADD PAYMENT
   ========================================================= */

function addPayment() {

const to =
    prompt("Paid to:");

if (
    !to ||
    !to.trim()
) {
    return;
}

const account =
    prompt(
        "Payment account:",
        "Cash"
    ) || "Cash";

const amount =
    Number(
        prompt("Amount paid:") || 0
    );

if (amount <= 0) {

    alert(
        "Amount must be greater than zero."
    );

    return;
}

const reference =
    generateNumber("PAY");

appData.payments.push({

    id: generateNumber("PAYMENT"),

    date: today(),

    reference: reference,

    to: to.trim(),

    account: account.trim(),

    amount: amount

});

/*
 * DOUBLE-ENTRY ACCOUNTING
 *
 * Debit  = Accounts Payable
 * Credit = Cash / Bank
 */

createJournalEntry({

    date: today(),

    reference: reference,

    description:
        "Payment to " +
        to.trim(),

    account: "Accounts Payable",

    debit: amount,

    credit: 0

});

createJournalEntry({

    date: today(),

    reference: reference,

    description:
        "Payment to " +
        to.trim(),

    account: account.trim(),

    debit: 0,

    credit: amount

});

saveData();

alert(
    "Payment " +
    reference +
    " recorded successfully."
);

showPage("payments");
}


/* =========================================================
   ADD JOURNAL ENTRY
   ========================================================= */

function addJournalEntry() {

    const account =
        prompt("Account name:");


    if (
        !account ||
        !account.trim()
    ) {

        return;

    }


    const description =
        prompt("Description:") || "";


    const debit =
        Number(
            prompt(
                "Debit amount:",
                "0"
            ) || 0
        );


    const credit =
        Number(
            prompt(
                "Credit amount:",
                "0"
            ) || 0
        );


    if (
        debit < 0 ||
        credit < 0
    ) {

        alert(
            "Debit and credit cannot be negative."
        );

        return;

    }


    if (
        debit === 0 &&
        credit === 0
    ) {

        alert(
            "Please enter a debit or credit amount."
        );

        return;

    }


    if (
        debit > 0 &&
        credit > 0
    ) {

        alert(
            "For a single journal line, enter either debit or credit."
        );

        return;

    }


    createJournalEntry({

        date: today(),

        reference:
            generateNumber("JE"),

        description:
            description.trim(),

        account:
            account.trim(),

        debit: debit,

        credit: credit

    });


    saveData();


    alert(
        "Journal entry added successfully."
    );


    showPage("journal");

}


/* =========================================================
   CREATE JOURNAL ENTRY
   ========================================================= */

function createJournalEntry(entry) {

    appData.journalEntries.push({

        id:
            generateNumber("JEL"),

        date:
            entry.date || today(),

        reference:
            entry.reference ||
            generateNumber("JE"),

        description:
            entry.description || "",

        account:
            entry.account || "",

        debit:
            Number(entry.debit || 0),

        credit:
            Number(entry.credit || 0)

    });

}


/* =========================================================
   DELETE FUNCTIONS
   ========================================================= */

function deleteAccount(index) {

    if (
        !confirm("Delete this account?")
    ) {

        return;

    }


    appData.accounts.splice(index, 1);

    saveData();

    showPage("accounts");

}


function deleteCustomer(index) {

    if (
        !confirm("Delete this customer?")
    ) {

        return;

    }


    appData.customers.splice(index, 1);

    saveData();

    showPage("customers");

}


function deleteSupplier(index) {

    if (
        !confirm("Delete this supplier?")
    ) {

        return;

    }


    appData.suppliers.splice(index, 1);

    saveData();

    showPage("suppliers");

}


function deleteProduct(index) {

    if (
        !confirm("Delete this product?")
    ) {

        return;

    }


    appData.products.splice(index, 1);

    saveData();

    showPage("products");

}


function deleteSale(index) {

    if (
        !confirm("Delete this sales invoice?")
    ) {

        return;

    }


    appData.sales.splice(index, 1);

    saveData();

    showPage("sales");

}


function deletePurchase(index) {

    if (
        !confirm("Delete this purchase invoice?")
    ) {

        return;

    }


    appData.purchases.splice(index, 1);

    saveData();

    showPage("purchases");

}


/* =========================================================
   CALCULATIONS
   ========================================================= */

function calculateSales() {

    return appData.sales.reduce(
        (total, sale) =>
            total +
            Number(sale.total || 0),
        0
    );

}


function calculatePurchases() {

    return appData.purchases.reduce(
        (total, purchase) =>
            total +
            Number(purchase.total || 0),
        0
    );

}


function calculateCOGS() {

    return appData.sales.reduce(
        (total, sale) =>
            total +
            Number(sale.cogs || 0),
        0
    );

}


function calculateExpenses() {

    return appData.journalEntries.reduce(
        (total, entry) => {

            const account =
                String(
                    entry.account || ""
                ).toLowerCase();


            if (
                account.includes("expense")
            ) {

                return total +
                    Number(entry.debit || 0);

            }


            return total;

        },
        0
    );

}


function calculateInventory() {

    return appData.products.reduce(
        (total, product) =>

            total +
            (
                Number(product.stock || 0) *
                Number(product.cost || 0)
            ),

        0
    );

}


function calculateReceivables() {

    let total = 0;


    appData.sales.forEach(sale => {

        const status =
            String(
                sale.status || ""
            ).toLowerCase();


        if (
            status !== "paid"
        ) {

            total +=
                Number(
                    sale.total || 0
                );

        }

    });


    appData.receipts.forEach(receipt => {

        total -=
            Number(
                receipt.amount || 0
            );

    });


    return Math.max(total, 0);

}


function calculatePayables() {

    let total = 0;


    appData.purchases.forEach(purchase => {

        const status =
            String(
                purchase.status || ""
            ).toLowerCase();


        if (
            status !== "paid"
        ) {

            total +=
                Number(
                    purchase.total || 0
                );

        }

    });


    appData.payments.forEach(payment => {

        total -=
            Number(
                payment.amount || 0
            );

    });


    return Math.max(total, 0);

}


function calculateCash() {

    const receipts =
        appData.receipts.reduce(
            (total, receipt) =>
                total +
                Number(
                    receipt.amount || 0
                ),
            0
        );


    const payments =
        appData.payments.reduce(
            (total, payment) =>
                total +
                Number(
                    payment.amount || 0
                ),
            0
        );


    return receipts - payments;

}


function calculateEquity() {

    return appData.accounts.reduce(
        (total, account) => {

            if (
                String(
                    account.type || ""
                ).toLowerCase() === "equity"
            ) {

                return total +
                    Number(
                        account.balance || 0
                    );

            }


            return total;

        },
        0
    );

}


function calculateProfit() {

    const sales =
        calculateSales();


    const cogs =
        calculateCOGS();


    const expenses =
        calculateExpenses();


    const actualCOGS =
        cogs > 0
            ? cogs
            : calculatePurchases();


    return (
        sales -
        actualCOGS -
        expenses
    );

}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveData() {

    localStorage.setItem(
        "ptAccountingData",
        JSON.stringify(appData)
    );

}


function loadData() {

    const saved =
        localStorage.getItem(
            "ptAccountingData"
        );


    if (!saved) {
        return;
    }


    try {

        const data =
            JSON.parse(saved);


        if (
            Array.isArray(data.accounts)
        ) {

            appData.accounts =
                data.accounts;

        }


        if (
            Array.isArray(data.customers)
        ) {

            appData.customers =
                data.customers;

        }


        if (
            Array.isArray(data.suppliers)
        ) {

            appData.suppliers =
                data.suppliers;

        }


        if (
            Array.isArray(data.products)
        ) {

            appData.products =
                data.products;

        }


        if (
            Array.isArray(data.sales)
        ) {

            appData.sales =
                data.sales;

        }


        if (
            Array.isArray(data.purchases)
        ) {

            appData.purchases =
                data.purchases;

        }


        if (
            Array.isArray(data.receipts)
        ) {

            appData.receipts =
                data.receipts;

        }


        if (
            Array.isArray(data.payments)
        ) {

            appData.payments =
                data.payments;

        }

       if (
    Array.isArray(data.users)
) {

    appData.users =
        data.users;

}

        if (
            Array.isArray(data.journalEntries)
        ) {

            appData.journalEntries =
                data.journalEntries;

        }

    } catch (error) {

        console.error(
            "Unable to load saved PT Accounting data.",
            error
        );

    }

}


/* =========================================================
   SETTINGS
   ========================================================= */

/* =========================================================
   SETTINGS PAGE
   ========================================================= */

function settingsPage() {

    const businessName =
        localStorage.getItem("businessName") || "";


    /*
     * Count records
     */

    const accountsCount =
        appData.accounts.length;

    const customersCount =
        appData.customers.length;

    const suppliersCount =
        appData.suppliers.length;

    const productsCount =
        appData.products.length;

    const salesCount =
        appData.sales.length;

    const purchasesCount =
        appData.purchases.length;

    const receiptsCount =
        appData.receipts.length;

    const paymentsCount =
        appData.payments.length;

    const journalCount =
        appData.journalEntries.length;


    return `

        <div class="page-header">

            <h2>
                Settings
            </h2>

            <p>
                Manage your business settings,
                accounting data and backups.
            </p>

        </div>


        <!-- =================================================
             BUSINESS SETTINGS
             ================================================= -->

        <div class="panel">

            <h3>
                Business Information
            </h3>


            <div class="form-group">

                <label>
                    Business Name
                </label>


                <input
                    type="text"
                    id="businessName"
                    value="${escapeHTML(businessName)}"
                    placeholder="Enter business name"
                >

            </div>


            <div class="report-actions">

                <button
                    onclick="saveSettings()">

                    💾 Save Settings

                </button>

            </div>

        </div>

                <div class="panel">

            <h3>
                Change Password
            </h3>

            <p>
                Change your own login password.
            </p>

            <div class="form-grid">

                <div class="form-group">

                    <label>
                        Current Password
                    </label>

                    <input
                        type="password"
                        id="currentPassword"
                        placeholder="Enter current password"
                    >

                </div>


                <div class="form-group">

                    <label>
                        New Password
                    </label>

                    <input
                        type="password"
                        id="newPassword"
                        placeholder="Minimum 8 characters"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Confirm New Password
                    </label>

                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm new password"
                    >

                </div>

            </div>


            <br>


            <button
                type="button"
                class="btn btn-primary"
                onclick="changeOwnPassword()">

                🔐 Change Password

            </button>

        </div>

        <!-- =================================================
             DATA SUMMARY
             ================================================= -->

        <div class="panel">

            <h3>
                Data Summary
            </h3>


            <div class="cards">


                <div class="card">

                    <small>
                        Accounts
                    </small>

                    <strong>
                        ${accountsCount}
                    </strong>

                </div>


                <div class="card">

                    <small>
                        Customers
                    </small>

                    <strong>
                        ${customersCount}
                    </strong>

                </div>


                <div class="card">

                    <small>
                        Suppliers
                    </small>

                    <strong>
                        ${suppliersCount}
                    </strong>

                </div>


                <div class="card">

                    <small>
                        Products
                    </small>

                    <strong>
                        ${productsCount}
                    </strong>

                </div>


                <div class="card">

                    <small>
                        Sales
                    </small>

                    <strong>
                        ${salesCount}
                    </strong>

                </div>


                <div class="card">

                    <small>
                        Purchases
                    </small>

                    <strong>
                        ${purchasesCount}
                    </strong>

                </div>


                <div class="card">

                    <small>
                        Receipts
                    </small>

                    <strong>
                        ${receiptsCount}
                    </strong>

                </div>


                <div class="card">

                    <small>
                        Payments
                    </small>

                    <strong>
                        ${paymentsCount}
                    </strong>

                </div>


                <div class="card">

                    <small>
                        Journal Entries
                    </small>

                    <strong>
                        ${journalCount}
                    </strong>

                </div>


            </div>

        </div>


        <!-- =================================================
             BACKUP
             ================================================= -->

        <div class="panel">

            <h3>
                Backup & Restore
            </h3>


            <p>
                Create a backup of all accounting data
                and restore it whenever required.
            </p>


            <div class="report-actions">


                <button
                    onclick="backupData()">

                    💾 Backup Data

                </button>


                <button
                    onclick="document.getElementById('restoreFile').click()">

                    📥 Restore Data

                </button>


                <input
                    type="file"
                    id="restoreFile"
                    accept=".json"
                    style="display:none"
                    onchange="restoreData(event)"
                >


            </div>

        </div>


        <!-- =================================================
             CLEAR DATA
             ================================================= -->

        <div class="panel">

            <h3>
                Danger Zone
            </h3>


            <p>
                Clearing data will permanently remove
                all accounting records from this browser.
            </p>


            <div class="report-actions">


                <button
                    onclick="clearAllData()">

                    🗑️ Clear All Data

                </button>


            </div>

        </div>


        <!-- =================================================
             SYSTEM INFORMATION
             ================================================= -->

        <div class="panel">

            <h3>
                System Information
            </h3>


            <p>
                <strong>
                    Application:
                </strong>

                PT Accounting System
            </p>


            <p>
                <strong>
                    Storage:
                </strong>

                Local Browser Storage
            </p>


            <p>
                <strong>
                    Accounting:
                </strong>

                Double-entry accounting
            </p>


            <p>
                <strong>
                    Reports:
                </strong>

                General Ledger, Trial Balance,
                Profit & Loss, Balance Sheet
            </p>

        </div>

    `;

}

/* =========================================================
   CHANGE OWN PASSWORD
   ========================================================= */

function changeOwnPassword() {

    if (!currentUser) {

        alert(
            "You must be logged in to change your password."
        );

        return;

    }


    const currentPasswordElement =
        document.getElementById(
            "currentPassword"
        );

    const newPasswordElement =
        document.getElementById(
            "newPassword"
        );

    const confirmPasswordElement =
        document.getElementById(
            "confirmPassword"
        );


    if (
        !currentPasswordElement ||
        !newPasswordElement ||
        !confirmPasswordElement
    ) {

        return;

    }


    const currentPassword =
        currentPasswordElement.value;

    const newPassword =
        newPasswordElement.value;

    const confirmPassword =
        confirmPasswordElement.value;


    /*
     * Check current password
     */

    if (
        currentPassword !==
        currentUser.password
    ) {

        alert(
            "Current password is incorrect."
        );

        return;

    }


    /*
     * Check new password length
     */

    if (
        newPassword.length < 8
    ) {

        alert(
            "New password must be at least 8 characters long."
        );

        return;

    }


    /*
     * Confirm new password
     */

    if (
        newPassword !==
        confirmPassword
    ) {

        alert(
            "New passwords do not match."
        );

        return;

    }


    /*
     * Prevent using the same password
     */

    if (
        newPassword ===
        currentPassword
    ) {

        alert(
            "New password must be different from the current password."
        );

        return;

    }


    /*
     * Update password
     */

    currentUser.password =
        newPassword;


    /*
     * Update the matching user
     * inside appData.users
     */

    const user =
        appData.users.find(
            user =>
                user.id ===
                currentUser.id
        );


    if (user) {

        user.password =
            newPassword;

    }


    /*
     * Save permanently
     */

    saveData();


    /*
     * Clear password fields
     */

    currentPasswordElement.value =
        "";

    newPasswordElement.value =
        "";

    confirmPasswordElement.value =
        "";


    alert(
        "Password changed successfully."
    );

}

/* =========================================================
   SAVE SETTINGS
   ========================================================= */

function saveSettings() {

    const element =
        document.getElementById(
            "businessName"
        );


    if (!element) {
        return;
    }


    const name =
        element.value.trim();


    localStorage.setItem(
        "businessName",
        name
    );


    alert(
        "Settings saved successfully."
    );

}


/* =========================================================
   BACKUP DATA
   ========================================================= */

function backupData() {

    const backup = {

        application:
            "PT Accounting System",

        version:
            "1.0",

        backupDate:
            new Date().toISOString(),

        businessName:
            localStorage.getItem(
                "businessName"
            ) || "",

        appData:
            appData

    };


    const json =
        JSON.stringify(
            backup,
            null,
            4
        );


    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        "PT-Accounting-Backup-" +
        new Date()
            .toISOString()
            .slice(0, 10) +
        ".json";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);


    alert(
        "Backup created successfully."
    );

}


/* =========================================================
   RESTORE DATA
   ========================================================= */

function restoreData(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function(e) {

            try {

                const backup =
                    JSON.parse(
                        e.target.result
                    );


                if (
                    !backup.appData
                ) {

                    alert(
                        "Invalid backup file."
                    );

                    return;

                }


                const confirmed =
                    confirm(
                        "Restoring this backup will replace the current data. Continue?"
                    );


                if (!confirmed) {
                    return;
                }


                /*
                 * Restore application data
                 */

                appData.accounts =
                    backup.appData.accounts || [];

                appData.customers =
                    backup.appData.customers || [];

                appData.suppliers =
                    backup.appData.suppliers || [];

                appData.products =
                    backup.appData.products || [];

                appData.sales =
                    backup.appData.sales || [];

                appData.purchases =
                    backup.appData.purchases || [];

                appData.receipts =
                    backup.appData.receipts || [];

                appData.payments =
                    backup.appData.payments || [];

                appData.journalEntries =
                    backup.appData.journalEntries || [];


                /*
                 * Restore business name
                 */

                if (
                    backup.businessName !== undefined
                ) {

                    localStorage.setItem(
                        "businessName",
                        backup.businessName
                    );

                }


                /*
                 * Save restored data
                 */

                saveData();


                alert(
                    "Data restored successfully."
                );


                /*
                 * Refresh application
                 */

                location.reload();

            }

            catch(error) {

                console.error(
                    error
                );


                alert(
                    "Unable to restore the backup file."
                );

            }

        };


    reader.readAsText(file);


    /*
     * Reset file input
     */

    event.target.value = "";

}


/* =========================================================
   CLEAR ALL DATA
   ========================================================= */

function clearAllData() {

    const firstConfirm =
        confirm(
            "WARNING: This will permanently delete all accounting data. Continue?"
        );


    if (!firstConfirm) {
        return;
    }


    const secondConfirm =
        confirm(
            "Are you absolutely sure? Please make sure you have a backup first."
        );


    if (!secondConfirm) {
        return;
    }


    /*
     * Clear application arrays
     */

    appData.accounts = [];

    appData.customers = [];

    appData.suppliers = [];

    appData.products = [];

    appData.sales = [];

    appData.purchases = [];

    appData.receipts = [];

    appData.payments = [];

    appData.journalEntries = [];


    /*
     * Save empty data
     */

    saveData();


    alert(
        "All accounting data has been cleared."
    );


    location.reload();

}


/* =========================================================
   CLEAR DATA
   ========================================================= */

function clearAllData() {

    const confirmed =
        confirm(
            "WARNING: This will delete ALL accounting data. Continue?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "ptAccountingData"
    );


    appData.accounts = [];

    appData.customers = [];

    appData.suppliers = [];

    appData.products = [];

    appData.sales = [];

    appData.purchases = [];

    appData.receipts = [];

    appData.payments = [];

    appData.journalEntries = [];


    alert(
        "All accounting data has been cleared."
    );


    showPage("dashboard");

}


/* =========================================================
   HELPERS
   ========================================================= */

function formatMoney(number) {

    return Number(number || 0)
        .toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


function today() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


function generateNumber(prefix) {

    return (
        prefix +
        "-" +
        Date.now() +
        "-" +
        Math.floor(
            Math.random() * 1000
        )
    );

}


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =========================================================
   DEBUG MESSAGE
   ========================================================= */

console.log(
    "PT Accounting System loaded successfully."
);

/* =========================================================
   PT ACCOUNTING SYSTEM
   LOGOUT BUTTON
   ========================================================= */

function addLogoutButton() {

    if (!currentUser) {
        return;
    }

    /* Remove an old button if one exists */
    const oldButton =
        document.getElementById("ptLogoutButton");

    if (oldButton) {
        oldButton.remove();
    }

    /* Find the page header */
    const header =
        document.querySelector(".page-header");

    if (!header) {
        return;
    }

    /* Create Logout button */
    const button =
        document.createElement("button");

    button.id =
        "ptLogoutButton";

    button.type =
        "button";

    button.textContent =
        "Logout";

    button.style.cssText = `
        float:right;
        margin-top:-45px;
        padding:8px 18px;
        border:1px solid #ccc;
        border-radius:6px;
        background:#ffffff;
        cursor:pointer;
        font-size:14px;
    `;

    button.onclick = function () {

        logout();

    };

    header.appendChild(button);
}


/* =========================================================
   ADD LOGOUT AFTER EVERY PAGE CHANGE
   ========================================================= */

const ptOriginalShowPage =
    showPage;

showPage = function(page) {

    ptOriginalShowPage(page);

    addLogoutButton();

};


/* =========================================================
   INITIAL LOGOUT BUTTON
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setTimeout(
            function() {

                addLogoutButton();

            },
            100
        );

    }
);


