/* ============================================
   PT ACCOUNTING SYSTEM
   Standalone Web Application
   ============================================ */


/* --------------------------------------------
   APPLICATION DATA
   -------------------------------------------- */

const appData = {

    accounts: [],
    customers: [],
    suppliers: [],
    products: [],
    sales: [],
    purchases: [],
    receipts: [],
    payments: [],
    journalEntries: []

};


/* --------------------------------------------
   PAGE INFORMATION
   -------------------------------------------- */

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

    settings: {
        title: "Settings",
        subtitle: "System configuration"
    }

};


/* --------------------------------------------
   INITIALIZATION
   -------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {

    loadData();

    setupNavigation();

    setupMobileMenu();

    showPage("dashboard");

});


/* --------------------------------------------
   NAVIGATION
   -------------------------------------------- */

function setupNavigation() {

    const buttons = document.querySelectorAll(".nav-item");

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            const page = this.dataset.page;

            showPage(page);

        });

    });

}


function showPage(page) {

    const title = document.getElementById("pageTitle");
    const subtitle = document.getElementById("pageSubtitle");
    const content = document.getElementById("content");

    if (!pages[page]) {
        return;
    }

    title.textContent = pages[page].title;

    subtitle.textContent = pages[page].subtitle;

    document.querySelectorAll(".nav-item").forEach(button => {

        button.classList.remove("active");

        if (button.dataset.page === page) {
            button.classList.add("active");
        }

    });

    content.innerHTML = renderPage(page);

    if (window.innerWidth <= 700) {
        document.getElementById("sidebar").classList.remove("open");
    }

}


/* --------------------------------------------
   MOBILE MENU
   -------------------------------------------- */

function setupMobileMenu() {

    const button = document.getElementById("menuButton");

    button.addEventListener("click", function () {

        document.getElementById("sidebar")
            .classList.toggle("open");

    });

}


/* --------------------------------------------
   PAGE RENDERING
   -------------------------------------------- */

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

        case "settings":
            return settingsPage();

        default:
            return "<div class='panel'>Page not found.</div>";

    }

}


/* --------------------------------------------
   DASHBOARD
   -------------------------------------------- */

function dashboardPage() {

    const salesTotal = calculateSales();

    const purchaseTotal = calculatePurchases();

    const inventoryValue = calculateInventory();

    const profit = calculateProfit();


    return `

        <div class="welcome">

            <h2>Welcome to PT Accounting</h2>

            <p>
                Your standalone accounting system is ready.
                We will build each accounting module step-by-step.
            </p>

        </div>


        <div class="cards">

            <div class="card">

                <div class="card-icon">💰</div>

                <small>Total Sales</small>

                <strong>
                    Nu. ${formatMoney(salesTotal)}
                </strong>

            </div>


            <div class="card">

                <div class="card-icon">🛒</div>

                <small>Total Purchases</small>

                <strong>
                    Nu. ${formatMoney(purchaseTotal)}
                </strong>

            </div>


            <div class="card">

                <div class="card-icon">📦</div>

                <small>Inventory Value</small>

                <strong>
                    Nu. ${formatMoney(inventoryValue)}
                </strong>

            </div>


            <div class="card">

                <div class="card-icon">📈</div>

                <small>Net Profit</small>

                <strong>
                    Nu. ${formatMoney(profit)}
                </strong>

            </div>

        </div>


        <div class="panel">

            <h3>Accounting System Status</h3>

            <p>
                Foundation installed successfully.
                The next stages will add real accounting transactions,
                double-entry bookkeeping, inventory calculations,
                receivables, payables and financial reports.
            </p>

        </div>

    `;

}


/* --------------------------------------------
   CHART OF ACCOUNTS
   -------------------------------------------- */

function accountsPage() {

    return `

        <div class="page-header">

            <h2>Chart of Accounts</h2>

            <p>
                Your accounting account master.
            </p>

        </div>

        <div class="panel">

            <h3>Add New Account</h3>

            <div class="form-grid">

                <div class="form-group">

                    <label>Code</label>

                    <input
                        type="text"
                        id="accountCode"
                        placeholder="e.g. 1000"
                    >

                </div>

                <div class="form-group">

                    <label>Account Name</label>

                    <input
                        type="text"
                        id="accountName"
                        placeholder="e.g. Cash"
                    >

                </div>

                <div class="form-group">

                    <label>Account Type</label>

                    <select id="accountType">

                        <option value="Asset">Asset</option>
                        <option value="Liability">Liability</option>
                        <option value="Equity">Equity</option>
                        <option value="Revenue">Revenue</option>
                        <option value="Expense">Expense</option>

                    </select>

                </div>

                <div class="form-group">

                    <label>Balance</label>

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

                        </tr>

                    </thead>

                    <tbody>

                        ${
                            appData.accounts.length === 0

                            ?

                            `<tr>
                                <td colspan="4" class="empty">
                                    No accounts yet.
                                </td>
                            </tr>`

                            :

                            appData.accounts.map(account => `

                                <tr>

                                    <td>${account.code}</td>

                                    <td>${account.name}</td>

                                    <td>${account.type}</td>

                                    <td>
                                        Nu. ${formatMoney(account.balance || 0)}
                                    </td>

                                </tr>

                            `).join("")

                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


/* --------------------------------------------
   CUSTOMERS
   -------------------------------------------- */

function customersPage() {

    return `

        <div class="page-header">

            <h2>Customers</h2>

            <p>
                Customer master and accounts receivable.
            </p>

        </div>


        <div class="panel">

            <button class="btn btn-primary"
                onclick="addCustomer()">

                + Add Customer

            </button>

        </div>


        <div class="panel">

            <table>

                <thead>

                    <tr>

                        <th>Customer</th>

                        <th>Phone</th>

                        <th>Email</th>

                        <th>Balance</th>

                    </tr>

                </thead>

                <tbody>

                    ${
                        appData.customers.length === 0

                        ?

                        `<tr>
                            <td colspan="4" class="empty">
                                No customers yet.
                            </td>
                        </tr>`

                        :

                        appData.customers.map(customer => `

                            <tr>

                                <td>${customer.name}</td>

                                <td>${customer.phone || ""}</td>

                                <td>${customer.email || ""}</td>

                                <td>
                                    Nu. ${formatMoney(customer.balance || 0)}
                                </td>

                            </tr>

                        `).join("")

                    }

                </tbody>

            </table>

        </div>

    `;

}


/* --------------------------------------------
   SUPPLIERS
   -------------------------------------------- */

function suppliersPage() {

    return `

        <div class="page-header">

            <h2>Suppliers</h2>

            <p>
                Supplier master and accounts payable.
            </p>

        </div>


        <div class="panel">

            <button class="btn btn-primary"
                onclick="addSupplier()">

                + Add Supplier

            </button>

        </div>


        <div class="panel">

            <table>

                <thead>

                    <tr>

                        <th>Supplier</th>

                        <th>Phone</th>

                        <th>Email</th>

                        <th>Balance</th>

                    </tr>

                </thead>

                <tbody>

                    ${
                        appData.suppliers.length === 0

                        ?

                        `<tr>
                            <td colspan="4" class="empty">
                                No suppliers yet.
                            </td>
                        </tr>`

                        :

                        appData.suppliers.map(supplier => `

                            <tr>

                                <td>${supplier.name}</td>

                                <td>${supplier.phone || ""}</td>

                                <td>${supplier.email || ""}</td>

                                <td>
                                    Nu. ${formatMoney(supplier.balance || 0)}
                                </td>

                            </tr>

                        `).join("")

                    }

                </tbody>

            </table>

        </div>

    `;

}


/* --------------------------------------------
   PRODUCTS
   -------------------------------------------- */

function productsPage() {

    return `

        <div class="page-header">

            <h2>Products & Inventory</h2>

            <p>
                Products, stock quantities and inventory value.
            </p>

        </div>


        <div class="panel">

            <button class="btn btn-primary"
                onclick="addProduct()">

                + Add Product

            </button>

        </div>


        <div class="panel">

            <table>

                <thead>

                    <tr>

                        <th>Product</th>

                        <th>Purchase Price</th>

                        <th>Selling Price</th>

                        <th>Stock</th>

                        <th>Stock Value</th>

                    </tr>

                </thead>

                <tbody>

                    ${
                        appData.products.length === 0

                        ?

                        `<tr>
                            <td colspan="5" class="empty">
                                No products yet.
                            </td>
                        </tr>`

                        :

                        appData.products.map(product => `

                            <tr>

                                <td>${product.name}</td>

                                <td>
                                    Nu. ${formatMoney(product.cost)}
                                </td>

                                <td>
                                    Nu. ${formatMoney(product.price)}
                                </td>

                                <td>${product.stock || 0}</td>

                                <td>
                                    Nu. ${formatMoney(
                                        (product.stock || 0) *
                                        (product.cost || 0)
                                    )}
                                </td>

                            </tr>

                        `).join("")

                    }

                </tbody>

            </table>

        </div>

    `;

}


/* --------------------------------------------
   SALES
   -------------------------------------------- */

function salesPage() {

    return `

        <div class="page-header">

            <h2>Sales Invoices</h2>

            <p>
                Sales invoices and accounts receivable.
            </p>

        </div>


        <div class="panel">

            <button class="btn btn-primary"
                onclick="addSale()">

                + New Sales Invoice

            </button>

        </div>


        <div class="panel">

            <table>

                <thead>

                    <tr>

                        <th>Invoice</th>

                        <th>Date</th>

                        <th>Customer</th>

                        <th>Total</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    ${
                        appData.sales.length === 0

                        ?

                        `<tr>
                            <td colspan="5" class="empty">
                                No sales invoices yet.
                            </td>
                        </tr>`

                        :

                        appData.sales.map(sale => `

                            <tr>

                                <td>${sale.invoice}</td>

                                <td>${sale.date}</td>

                                <td>${sale.customer}</td>

                                <td>
                                    Nu. ${formatMoney(sale.total)}
                                </td>

                                <td>

                                    <span class="status status-${sale.status}">
                                        ${sale.status}
                                    </span>

                                </td>

                            </tr>

                        `).join("")

                    }

                </tbody>

            </table>

        </div>

    `;

}


/* --------------------------------------------
   PURCHASES
   -------------------------------------------- */

function purchasesPage() {

    return `

        <div class="page-header">

            <h2>Purchase Invoices</h2>

            <p>
                Purchases and accounts payable.
            </p>

        </div>


        <div class="panel">

            <button class="btn btn-primary"
                onclick="addPurchase()">

                + New Purchase Invoice

            </button>

        </div>


        <div class="panel">

            <table>

                <thead>

                    <tr>

                        <th>Invoice</th>

                        <th>Date</th>

                        <th>Supplier</th>

                        <th>Total</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    ${
                        appData.purchases.length === 0

                        ?

                        `<tr>
                            <td colspan="5" class="empty">
                                No purchase invoices yet.
                            </td>
                        </tr>`

                        :

                        appData.purchases.map(purchase => `

                            <tr>

                                <td>${purchase.invoice}</td>

                                <td>${purchase.date}</td>

                                <td>${purchase.supplier}</td>

                                <td>
                                    Nu. ${formatMoney(purchase.total)}
                                </td>

                                <td>${purchase.status}</td>

                            </tr>

                        `).join("")

                    }

                </tbody>

            </table>

        </div>

    `;

}


/* --------------------------------------------
   RECEIPTS
   -------------------------------------------- */

function receiptsPage() {

    return `

        <div class="page-header">

            <h2>Receipts</h2>

            <p>
                Money received from customers and other sources.
            </p>

        </div>


        <div class="panel">

            <button class="btn btn-primary"
                onclick="addReceipt()">

                + New Receipt

            </button>

        </div>

    `;

}


/* --------------------------------------------
   PAYMENTS
   -------------------------------------------- */

function paymentsPage() {

    return `

        <div class="page-header">

            <h2>Payments</h2>

            <p>
                Money paid to suppliers and for expenses.
            </p>

        </div>


        <div class="panel">

            <button class="btn btn-primary"
                onclick="addPayment()">

                + New Payment

            </button>

        </div>

    `;

}


/* --------------------------------------------
   JOURNAL
   -------------------------------------------- */

function journalPage() {

    return `

        <div class="page-header">

            <h2>Journal Entries</h2>

            <p>
                All accounting transactions will flow through
                the double-entry journal.
            </p>

        </div>


        <div class="panel">

            <button class="btn btn-primary"
                onclick="addJournalEntry()">

                + New Journal Entry

            </button>

        </div>


        <div class="panel">

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

                        `<tr>
                            <td colspan="5" class="empty">
                                No journal entries yet.
                            </td>
                        </tr>`

                        :

                        appData.journalEntries.map(entry => `

                            <tr>

                                <td>${entry.date}</td>

                                <td>${entry.reference}</td>

                                <td>${entry.description}</td>

                                <td>
                                    Nu. ${formatMoney(entry.debit)}
                                </td>

                                <td>
                                    Nu. ${formatMoney(entry.credit)}
                                </td>

                            </tr>

                        `).join("")

                    }

                </tbody>

            </table>

        </div>

    `;

}


/* --------------------------------------------
   GENERAL LEDGER
   -------------------------------------------- */

function ledgerPage() {

    return `

        <div class="page-header">

            <h2>General Ledger</h2>

            <p>
                Account-by-account transaction history.
            </p>

        </div>


        <div class="panel">

            <p>
                The General Ledger will automatically be generated
                from the Journal Entries.
            </p>

        </div>

    `;

}


/* --------------------------------------------
   TRIAL BALANCE
   -------------------------------------------- */

function trialBalancePage() {

    return `

        <div class="page-header">

            <h2>Trial Balance</h2>

            <p>
                Debit and credit balances of all accounts.
            </p>

        </div>


        <div class="panel">

            <table>

                <thead>

                    <tr>

                        <th>Account</th>

                        <th>Debit</th>

                        <th>Credit</th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td colspan="3" class="empty">

                            Trial Balance will be generated
                            automatically from journal entries.

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    `;

}


/* --------------------------------------------
   PROFIT & LOSS
   -------------------------------------------- */

function profitLossPage() {

    const sales = calculateSales();

    const purchases = calculatePurchases();

    const profit = calculateProfit();


    return `

        <div class="page-header">

            <h2>Profit & Loss</h2>

            <p>
                Financial performance of the business.
            </p>

        </div>


        <div class="panel">

            <table>

                <tbody>

                    <tr>

                        <td>Sales Revenue</td>

                        <td>
                            Nu. ${formatMoney(sales)}
                        </td>

                    </tr>


                    <tr>

                        <td>Cost of Goods Sold</td>

                        <td>
                            Nu. ${formatMoney(purchases)}
                        </td>

                    </tr>


                    <tr>

                        <th>Net Profit</th>

                        <th>
                            Nu. ${formatMoney(profit)}
                        </th>

                    </tr>

                </tbody>

            </table>

        </div>

    `;

}


/* --------------------------------------------
   BALANCE SHEET
   -------------------------------------------- */

function balanceSheetPage() {

    const inventory = calculateInventory();


    return `

        <div class="page-header">

            <h2>Balance Sheet</h2>

            <p>
                Assets, liabilities and equity.
            </p>

        </div>


        <div class="panel">

            <h3>Assets</h3>

            <table>

                <tr>

                    <td>Inventory</td>

                    <td>
                        Nu. ${formatMoney(inventory)}
                    </td>

                </tr>

                <tr>

                    <th>Total Assets</th>

                    <th>
                        Nu. ${formatMoney(inventory)}
                    </th>

                </tr>

            </table>

        </div>


        <div class="panel">

            <h3>Liabilities & Equity</h3>

            <p>
                These balances will be automatically calculated
                from the accounting journal.
            </p>

        </div>

    `;

}


/* --------------------------------------------
   SETTINGS
   -------------------------------------------- */

function settingsPage() {

    return `

        <div class="page-header">

            <h2>Settings</h2>

            <p>
                Configure your accounting system.
            </p>

        </div>


        <div class="panel">

            <h3>Business Information</h3>

            <div class="form-grid">

                <div class="form-group">

                    <label>Business Name</label>

                    <input
                        type="text"
                        id="businessName"
                        placeholder="Enter business name"
                    >

                </div>


                <div class="form-group">

                    <label>Currency</label>

                    <input
                        type="text"
                        value="BTN / Nu."
                        disabled
                    >

                </div>

            </div>

            <br>

            <button
                class="btn btn-primary"
                onclick="saveSettings()">

                Save Settings

            </button>

        </div>

    `;

}


/* --------------------------------------------
   DEMO / DATA FUNCTIONS
   -------------------------------------------- */

function addDemoAccount() {

    const name = prompt("Account name:");

    if (!name) return;

    const code = prompt("Account code:");

    if (!code) return;

    appData.accounts.push({

        code: code,

        name: name,

        type: "Asset",

        balance: 0

    });

    saveData();

    showPage("accounts");

}


function addCustomer() {

    const name = prompt("Customer name:");

    if (!name) return;

    appData.customers.push({

        name: name,

        phone: "",

        email: "",

        balance: 0

    });

    saveData();

    showPage("customers");

}


function addSupplier() {

    const name = prompt("Supplier name:");

    if (!name) return;

    appData.suppliers.push({

        name: name,

        phone: "",

        email: "",

        balance: 0

    });

    saveData();

    showPage("suppliers");

}


function addProduct() {

    const name = prompt("Product name:");

    if (!name) return;

    const cost = Number(
        prompt("Purchase price:", "0")
    );

    const price = Number(
        prompt("Selling price:", "0")
    );

    appData.products.push({

        name: name,

        cost: cost,

        price: price,

        stock: 0

    });

    saveData();

    showPage("products");

}


function addSale() {

    const customer = prompt("Customer name:");

    if (!customer) return;

    const total = Number(
        prompt("Invoice total:", "0")
    );

    appData.sales.push({

        invoice: generateNumber("SI"),

        date: today(),

        customer: customer,

        total: total,

        status: "unpaid"

    });

    saveData();

    showPage("sales");

}


function addPurchase() {

    const supplier = prompt("Supplier name:");

    if (!supplier) return;

    const total = Number(
        prompt("Purchase total:", "0")
    );

    appData.purchases.push({

        invoice: generateNumber("PI"),

        date: today(),

        supplier: supplier,

        total: total,

        status: "unpaid"

    });

    saveData();

    showPage("purchases");

}


function addReceipt() {

    const amount = Number(
        prompt("Receipt amount:", "0")
    );

    if (!amount) return;

    appData.receipts.push({

        date: today(),

        amount: amount

    });

    saveData();

    alert("Receipt saved.");

}


function addPayment() {

    const amount = Number(
        prompt("Payment amount:", "0")
    );

    if (!amount) return;

    appData.payments.push({

        date: today(),

        amount: amount

    });

    saveData();

    alert("Payment saved.");

}


function addJournalEntry() {

    const description = prompt(
        "Journal description:"
    );

    if (!description) return;

    const debit = Number(
        prompt("Debit amount:", "0")
    );

    const credit = Number(
        prompt("Credit amount:", "0")
    );

    appData.journalEntries.push({

        date: today(),

        reference: generateNumber("JE"),

        description: description,

        debit: debit,

        credit: credit

    });

    saveData();

    showPage("journal");

}


/* --------------------------------------------
   CALCULATIONS
   -------------------------------------------- */

function calculateSales() {

    return appData.sales.reduce(

        (total, sale) =>
            total + Number(sale.total || 0),

        0

    );

}


function calculatePurchases() {

    return appData.purchases.reduce(

        (total, purchase) =>
            total + Number(purchase.total || 0),

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


function calculateProfit() {

    return calculateSales() -
           calculatePurchases();

}


/* --------------------------------------------
   STORAGE
   -------------------------------------------- */

function saveData() {

    localStorage.setItem(

        "ptAccountingData",

        JSON.stringify(appData)

    );

}


function loadData() {

    const saved = localStorage.getItem(
        "ptAccountingData"
    );

    if (!saved) {
        return;
    }

    try {

        const data = JSON.parse(saved);

        Object.assign(
            appData,
            data
        );

    } catch (error) {

        console.error(
            "Unable to load saved data.",
            error
        );

    }

}


/* --------------------------------------------
   SETTINGS
   -------------------------------------------- */

function saveSettings() {

    const name =
        document.getElementById(
            "businessName"
        ).value;

    localStorage.setItem(
        "businessName",
        name
    );

    alert("Settings saved.");

}


/* --------------------------------------------
   HELPERS
   -------------------------------------------- */

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

    return prefix +
        "-" +
        Date.now();

}
