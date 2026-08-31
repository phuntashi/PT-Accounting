/* =========================================================
   PT ACCOUNTING SYSTEM
   COMPLETE app.js
   ========================================================= */


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

    journalEntries: [
        {
            date: "2026-08-31",
            reference: "TEST-001",
            description: "Journal Test Entry",
            debit: 1000,
            credit: 1000
        }
    ]

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

    setupNavigation();

    setupMobileMenu();

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

    if (!pages[page]) {

        console.error(
            "PT Accounting: Page does not exist:",
            page
        );

        return;
    }


    const title =
        document.getElementById("pageTitle");

    const subtitle =
        document.getElementById("pageSubtitle");

    const content =
        document.getElementById("content");


    if (title) {

        title.textContent =
            pages[page].title;

    }


    if (subtitle) {

        subtitle.textContent =
            pages[page].subtitle;

    }


    /*
       Update active navigation button.
    */

    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.remove("active");

            if (
                button.getAttribute("data-page") === page
            ) {

                button.classList.add("active");

            }

        });


    /*
       Render selected page.
    */

    if (content) {

        content.innerHTML =
            renderPage(page);

    }


    /*
       Close mobile sidebar.
    */

    if (window.innerWidth <= 700) {

        const sidebar =
            document.getElementById("sidebar");

        if (sidebar) {

            sidebar.classList.remove("open");

        }

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


    return `

        <div class="welcome">

            <h2>
                Welcome to PT Accounting
            </h2>

            <p>
                Your standalone accounting system is ready.
                Manage accounts, customers, suppliers,
                products, sales, purchases and reports.
            </p>

        </div>


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

        </div>


        <div class="panel">

            <h3>
                Accounting System Status
            </h3>

            <p>
                PT Accounting is running successfully.
                Data is stored locally in your browser.
            </p>

        </div>

    `;

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


        <div class="panel">

            <button
                type="button"
                class="btn btn-primary"
                onclick="addCustomer()">

                + Add Customer

            </button>

        </div>


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


        <div class="panel">

            <button
                type="button"
                class="btn btn-primary"
                onclick="addSupplier()">

                + Add Supplier

            </button>

        </div>


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


        <div class="panel">

            <button
                type="button"
                class="btn btn-primary"
                onclick="addProduct()">

                + Add Product

            </button>

        </div>


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


        <div class="panel">

            <button
                type="button"
                class="btn btn-primary"
                onclick="addSale()">

                + New Sales Invoice

            </button>

        </div>


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
   GENERAL LEDGER
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

let rows = "";

/*
 * Build ledger account-by-account
 */
Object.keys(grouped)
    .sort()
    .forEach(account => {

        let balance = 0;

        rows += `

            <tr class="ledger-account-header">

                <td colspan="7">

                    <strong>
                        ${escapeHTML(account)}
                    </strong>

                </td>

            </tr>

        `;

        grouped[account].forEach(entry => {

            const debit =
                Number(entry.debit || 0);

            const credit =
                Number(entry.credit || 0);

            balance += debit - credit;

            rows += `

                <tr>

                    <td>
                        ${escapeHTML(
                            entry.date || ""
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            account
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
                        ${formatMoney(debit)}
                    </td>

                    <td>
                        Nu.
                        ${formatMoney(credit)}
                    </td>

                    <td>
                        Nu.
                        ${formatMoney(balance)}
                    </td>

                </tr>

            `;

        });

        rows += `

            <tr class="ledger-total">

                <td colspan="6">

                    <strong>
                        Closing Balance
                    </strong>

                </td>

                <td>

                    <strong>
                        Nu.
                        ${formatMoney(balance)}
                    </strong>

                </td>

            </tr>

        `;

    });


return `

    <div class="page-header">

        <h2>
            General Ledger
        </h2>

        <p>
            Account-by-account transaction history
            with running balances.
        </p>

    </div>


    <div class="panel">

        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>Date</th>
                        <th>Account</th>
                        <th>Reference</th>
                        <th>Description</th>
                        <th>Debit</th>
                        <th>Credit</th>
                        <th>Balance</th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        entries.length === 0

                        ?

                        `
                        <tr>

                            <td
                                colspan="7"
                                class="empty">

                                No ledger transactions yet.

                            </td>

                        </tr>
                        `

                        :

                        rows
                    }

                </tbody>

            </table>

        </div>

    </div>

`;

}

/* =========================================================
   TRIAL BALANCE
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

                            <th>Account</th>
                            <th>Debit</th>
                            <th>Credit</th>

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

                </table>

            </div>

        </div>

    `;

}


/* =========================================================
   PROFIT & LOSS
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

        </div>

    `;

}


/* =========================================================
   BALANCE SHEET
   ========================================================= */

function balanceSheetPage() {

    const inventory =
        calculateInventory();

    const receivables =
        calculateReceivables();

    const cash =
        calculateCash();


    const assets =
        inventory +
        receivables +
        cash;


    const payables =
        calculatePayables();


    const profit =
        calculateProfit();


    const equity =
        calculateEquity() +
        profit;


    const liabilitiesEquity =
        payables +
        equity;


    return `

        <div class="page-header">

            <h2>
                Balance Sheet
            </h2>

            <p>
                Assets, liabilities and equity.
            </p>

        </div>


        <div class="panel">

            <h3>
                Assets
            </h3>


            <div class="table-container">

                <table>

                    <tbody>

                        <tr>

                            <td>
                                Cash / Bank
                            </td>

                            <td>
                                Nu.
                                ${formatMoney(cash)}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Accounts Receivable
                            </td>

                            <td>
                                Nu.
                                ${formatMoney(receivables)}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Inventory
                            </td>

                            <td>
                                Nu.
                                ${formatMoney(inventory)}
                            </td>

                        </tr>


                        <tr>

                            <th>
                                Total Assets
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(assets)}
                            </th>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>


        <div class="panel">

            <h3>
                Liabilities & Equity
            </h3>


            <div class="table-container">

                <table>

                    <tbody>

                        <tr>

                            <td>
                                Accounts Payable
                            </td>

                            <td>
                                Nu.
                                ${formatMoney(payables)}
                            </td>

                        </tr>


                        <tr>

                            <td>
                                Owner's Equity
                            </td>

                            <td>
                                Nu.
                                ${formatMoney(equity)}
                            </td>

                        </tr>


                        <tr>

                            <th>
                                Total Liabilities & Equity
                            </th>

                            <th>
                                Nu.
                                ${formatMoney(liabilitiesEquity)}
                            </th>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    `;

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

function addCustomer() {

    const name =
        prompt("Customer name:");


    if (!name || !name.trim()) {
        return;
    }


    const phone =
        prompt("Phone number:") || "";


    const email =
        prompt("Email address:") || "";


    appData.customers.push({

        id: generateNumber("CUS"),

        name: name.trim(),

        phone: phone.trim(),

        email: email.trim(),

        balance: 0

    });


    saveData();


    alert(
        "Customer added successfully."
    );


    showPage("customers");

}


/* =========================================================
   ADD SUPPLIER
   ========================================================= */

function addSupplier() {

    const name =
        prompt("Supplier name:");


    if (!name || !name.trim()) {
        return;
    }


    const phone =
        prompt("Phone number:") || "";


    const email =
        prompt("Email address:") || "";


    appData.suppliers.push({

        id: generateNumber("SUP"),

        name: name.trim(),

        phone: phone.trim(),

        email: email.trim(),

        balance: 0

    });


    saveData();


    alert(
        "Supplier added successfully."
    );


    showPage("suppliers");

}


/* =========================================================
   ADD PRODUCT
   ========================================================= */

function addProduct() {

    const name =
        prompt("Product name:");


    if (!name || !name.trim()) {
        return;
    }


    const cost =
        Number(
            prompt("Purchase price:") || 0
        );


    const price =
        Number(
            prompt("Selling price:") || 0
        );


    const openingStock =
        Number(
            prompt("Opening stock:") || 0
        );


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


    appData.products.push({

        id: generateNumber("PROD"),

        name: name.trim(),

        cost: cost,

        price: price,

        openingStock: openingStock,

        stock: openingStock

    });


    saveData();


    alert(
        "Product added successfully."
    );


    showPage("products");

}


/* =========================================================
   ADD SALE
   ========================================================= */

function addSale() {

    const invoice =
        generateNumber("SI");


    const customer =
        prompt("Customer name:");


    if (
        !customer ||
        !customer.trim()
    ) {

        return;

    }


    const total =
        Number(
            prompt("Invoice total:") || 0
        );


    if (total <= 0) {

        alert(
            "Invoice total must be greater than zero."
        );

        return;

    }


    const status =
        prompt(
            "Status (Unpaid / Partially Paid / Paid):",
            "Unpaid"
        ) || "Unpaid";


    appData.sales.push({

        id: generateNumber("SALE"),

        invoice: invoice,

        date: today(),

        customer: customer.trim(),

        total: total,

        status: status.trim(),

        cogs: 0

    });


    saveData();


    alert(
        "Sales invoice " +
        invoice +
        " created successfully."
    );


    showPage("sales");

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

const account =
    prompt(
        "Receipt account:",
        "Cash"
    ) || "Cash";

const amount =
    Number(
        prompt("Amount received:") || 0
    );

if (amount <= 0) {

    alert(
        "Amount must be greater than zero."
    );

    return;
}

const reference =
    generateNumber("REC");

appData.receipts.push({

    id: generateNumber("RECEIPT"),

    date: today(),

    reference: reference,

    from: from.trim(),

    account: account.trim(),

    amount: amount

});

/*
 * DOUBLE-ENTRY ACCOUNTING
 *
 * Debit  = Cash / Bank
 * Credit = Accounts Receivable
 */

createJournalEntry({

    date: today(),

    reference: reference,

    description:
        "Receipt from " +
        from.trim(),

    account: account.trim(),

    debit: amount,

    credit: 0

});

createJournalEntry({

    date: today(),

    reference: reference,

    description:
        "Receipt from " +
        from.trim(),

    account: "Accounts Receivable",

    debit: 0,

    credit: amount

});

saveData();

alert(
    "Receipt " +
    reference +
    " recorded successfully."
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
