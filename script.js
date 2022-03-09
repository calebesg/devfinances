const Modal = {
  classList: document.querySelector('.modal-overlay').classList,

  open() {
    this.classList.add('active');
  },

  close() {
    this.classList.remove('active');
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
  expenses() {
    // calcular todas as despesas
  },

  incomes() {
    // calcular todas as entradas
  },

  get total() {
    // subtrair as despesas das entradas
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  
  addTransaction(transaction, index) {
    const tr = document.createElement('tr');

    tr.innerHTML = this.innerHTMLTransaction(transaction);
    tr.setAttribute('id', index);

    this.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

    const amount = Util.formatCurrency(transaction.amount);

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

const Util = {
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

transactions.forEach((transaction, index) => {
  DOM.addTransaction(transaction, index);
});
