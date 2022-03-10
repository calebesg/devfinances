const Modal = {
  classList: document.querySelector('.modal-overlay').classList,

  open() {
    Modal.classList.add('active');
  },

  close() {
    Modal.classList.remove('active');
  }
}

const transactions = [
  {
    id: 1,
    description: 'Luz',
    amount: -50000,
    date: '12/02/2022'
  },
  {
    id: 2,
    description: 'Website',
    amount: 500000,
    date: '12/02/2022'
  },
  {
    id: 3,
    description: 'Internet',
    amount: -10000,
    date: '12/02/2022'
  },
];

const Transaction = {
  all: transactions,

  add(transaction) {
    Transaction.all.push(transaction);
    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);
    App.reload();
  },

  get expenses() {
    let expenses = 0;

    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expenses += transaction.amount;
      }
    });

    return expenses;
  },

  get incomes() {
    let incomes = 0;

    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0) {
        incomes += transaction.amount;
      }
    });

    return incomes;
  },

  get total() {
    return Transaction.incomes + Transaction.expenses;
  }
}

const DOM = {
  _transactionsContainer: document.querySelector('#data-table tbody'),
  
  addTransaction(transaction, index) {
    const tr = document.createElement('tr');

    tr.innerHTML = this._innerHTMLTransaction(transaction);
    tr.setAttribute('id', index);

    this._transactionsContainer.appendChild(tr);
  },

  updateBalance() {
    document
      .getElementById('expenseDisplay')
      .textContent = Utils.formatCurrency(Transaction.expenses);

    document
      .getElementById('incomeDisplay')
      .textContent = Utils.formatCurrency(Transaction.incomes);
      
    document
      .getElementById('totalDisplay')
      .textContent = Utils.formatCurrency(Transaction.total);
  },

  clearTransactions() {
    this._transactionsContainer.innerHTML = '';
  },

  _innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="data">${transaction.date}</td>
      <td>
        <img src="./assets/minus.svg" alt="Remover Transação">
      </td>
    `;

    return html;
  }
}

const Utils = {
  formatAmount(value) {
    value = Number(value) * 100;

    return value;
  },

  formatDate(date) {
    date = date.split('-').reverse().join('/');

    return date;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : '';

    value = String(value).replace(/\D/g, '');

    value = Number(value) / 100;

    value = value.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL'
    });

    return signal + value;
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),
  
  formatData() {
    let { description, amount, date } = Form.dataForm;

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  validateFields() {
    const { description, amount, date } = Form.dataForm;

    if (description === "" || amount === "" || date === "") {
      throw new Error("Preencha todos os campos!");
    }
  },

  clearFields() {
    Form.description.value = '';
    Form.amount.value = '';
    Form.date.value = '';
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields();

      const transaction = Form.formatData();
      Transaction.add(transaction);

      Form.clearFields();
      Modal.close();

    } catch(error) {
      
      alert(error.message);
    }
  },

  get dataForm() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  }
}

const App = {
  init() {
    transactions.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });
    
    DOM.updateBalance();
  },

  reload() {
    DOM.clearTransactions();
    App.init();
  }
}

App.init();
