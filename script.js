const Modal = {
  classList: document.querySelector('.modal-overlay').classList,

  open() {
    Modal.classList.add('active');
  },

  close() {
    Modal.classList.remove('active');
  }
}

const Storage = {
  storageKey: 'dev.finanses:transaction',

  get() {
    return JSON.parse(localStorage.getItem(Storage.storageKey)) || [];
  },

  set(transactions) {
    localStorage.setItem(Storage.storageKey, JSON.stringify(transactions));
  },
}

const Transaction = {
  all: Storage.get(),

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
  tableTransactions: document.querySelector('#data-table tbody'),
  
  addTransaction(transaction, index) {
    const tr = document.createElement('tr');

    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.tableTransactions.appendChild(tr);
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
    DOM.tableTransactions.innerHTML = '';
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="data">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
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
    Transaction.all.forEach( DOM.addTransaction );
    DOM.updateBalance();
    Storage.set(Transaction.all);
  },

  reload() {
    DOM.clearTransactions();
    App.init();
  }
}

App.init();
