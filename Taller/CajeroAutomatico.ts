import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

type Transaccion = {
  id: number;
  tipo: string;
  monto: number;
  fecha: Date;
  saldo: number;
};

type Cuenta = {
  titular: string;
  saldo: number;
  historial: Transaccion[];
};

// DATOS
let cuenta: Cuenta = {
  titular: "Vanessa",
  saldo: 10000,
  historial: []
};

let contadorId: number = 1;


function registrarTransaccion(tipo: string, monto: number): void {
  cuenta.historial.push({
    id: contadorId++,
    tipo,
    monto,
    fecha: new Date(),
    saldo: cuenta.saldo
  });
}

function totalDepositado(): number {
  return cuenta.historial
    .filter(t => t.tipo === "deposito")
    .reduce((acc, t) => acc + t.monto, 0);
}

function totalRetirado(): number {
  return cuenta.historial
    .filter(t => t.tipo === "retiro")
    .reduce((acc, t) => acc + t.monto, 0);
}

function menu(): void {

  console.log("\n--- CAJERO AUTOMÁTICO ---");
  console.log("1. Consultar saldo");
  console.log("2. Depositar dinero");
  console.log("3. Retirar dinero");
  console.log("4. Estado de cuenta");
  console.log("5. Salir");

  rl.question("Seleccione: ", (op: string): void => {

    switch(op){

      case "1":
        console.log("Saldo actual:", cuenta.saldo);
        menu();
        break;

      case "2":
        rl.question("Cantidad a depositar: ", (c: string): void => {

          const monto = Number(c);

          if(monto <= 0 || isNaN(monto)){
            console.log("Monto inválido");
            return menu();
          }

          cuenta.saldo += monto;
          registrarTransaccion("deposito", monto);

          console.log("Depósito realizado");
          menu();
        });
        break;

      case "3":
        rl.question("Cantidad a retirar: ", (c: string): void => {

          const monto = Number(c);

          if(monto <= 0 || isNaN(monto)){
            console.log("Monto inválido");
            return menu();
          }

          if(monto > cuenta.saldo){
            console.log("Fondos insuficientes");
            return menu();
          }

          cuenta.saldo -= monto;
          registrarTransaccion("retiro", monto);
          console.log("Retiro exitoso");
          menu();
        });
        break;

      case "4":
        console.log("\nESTADO DE CUENTA");

        const resumen = cuenta.historial.map(t => {
          return `ID: ${t.id} | ${t.tipo} | $${t.monto} | ${t.fecha.toLocaleString()} | Saldo: $${t.saldo}`;
        });

        resumen.forEach(r => console.log(r));

        console.log("\nTotales:");
        console.log("Total depositado:", totalDepositado());
        console.log("Total retirado:", totalRetirado());

        menu();
        break;

      case "5":
        console.log("Gracias por usar el cajero automático. ¡Hasta luego!");
        rl.close();
        break;

      default:
        console.log("Opción inválida");
        menu();
        break;
    }

  });
}

menu();