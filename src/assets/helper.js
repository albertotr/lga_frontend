export default class helper {
  static getMachineCost(machine) {
    let lastTransactionItems = machine.last_transaction
      ? JSON.parse(machine.last_transaction.inventory)
      : null;
    let total = [];

    /**
     * calcular o custo de cada item do inventário da maquina
     * onde precisa passar por todos os itens
     * calcular a quantidade de itens inseridos ou subtraidos depois da ultima transação
     * e calcular o valor
     */    
    machine.inventory.items.map((item) => {
      if (lastTransactionItems) {
        lastTransactionItems.map((transItem, idx) => {
          if (transItem.id == item.id) {
            let totalItem = transItem.pivot.quantity - item.pivot.quantity;
            if (machine.last_transaction.exchanges) {
              totalItem = machine.last_transaction.exchanges.reduce(
                (partial, exchange) => {
                  if (exchange.item_id == item.id) {
                    return partial + exchange.quantity;
                  } else return partial;
                },
                totalItem
              );
            }
            let totalValue = totalItem * item.pivot.price;
            total[idx] = totalValue;
          }
        });
      } else {
        let totalValue =
          (item.pivot.base_quantity - item.pivot.quantity) * item.pivot.price;
        total[total.length] = totalValue;
      }
    });

    return total.reduce((partial_sum, value) => partial_sum + value, 0);
  }
}
