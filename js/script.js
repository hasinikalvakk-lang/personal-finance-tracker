const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const type = document.getElementById("type");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const transactionList = document.getElementById("transaction-list");

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

let chart;

function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function updateUI() {

    transactionList.innerHTML = "";

    let income = 0;
    let expense = 0;

    transactions.forEach((transaction,index)=>{

        const li = document.createElement("li");

        li.innerHTML = `
            ${transaction.description}
            ₹${transaction.amount}

            <button
                class="delete-btn"
                onclick="deleteTransaction(${index})"
            >
                Delete
            </button>
        `;

        transactionList.appendChild(li);

        if(transaction.type==="income"){
            income += transaction.amount;
        }else{
            expense += transaction.amount;
        }
    });

    balanceEl.textContent =
        `₹${income-expense}`;

    incomeEl.textContent =
        `₹${income}`;

    expenseEl.textContent =
        `₹${expense}`;

    updateChart(income,expense);

    saveTransactions();
}

function deleteTransaction(index){
    transactions.splice(index,1);
    updateUI();
}

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const transaction = {
        description: description.value,
        amount: Number(amount.value),
        type: type.value
    };

    transactions.push(transaction);

    description.value = "";
    amount.value = "";

    updateUI();
});

function updateChart(income,expense){

    const ctx =
    document.getElementById("expenseChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{
        type:"pie",
        data:{
            labels:["Income","Expense"],
            datasets:[{
                data:[income,expense]
            }]
        }
    });
}

updateUI();