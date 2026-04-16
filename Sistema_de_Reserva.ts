import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// TIPOS
type TipoHabitacion = "economica" | "estandar" | "suite";

type Reserva = {
  nombre: string;
  tipo: TipoHabitacion;
  noches: number;
  precioBase: number;
  descuento: number;
  total: number;
};

// PRECIOS POR TIPO
const precios: Record<TipoHabitacion, number> = {
  economica: 80,
  estandar: 150,
  suite: 300
};

let reservas: Reserva[] = [];


function calcularDescuento(noches: number): number {
  if (noches >= 11) return 0.15;
  if (noches >= 6) return 0.10;
  if (noches >= 3) return 0.05;
  return 0;
}

function totalIngresos(): number {
  return reservas.reduce((acc, r) => acc + r.total, 0);
}

function ingresosPorTipo() {
  return Object.keys(precios).map(tipo => {
    const total = reservas
      .filter(r => r.tipo === tipo)
      .reduce((acc, r) => acc + r.total, 0);

    return { tipo, total };
  });
}

function menu(): void {

  console.log("\n--- HOTEL ---");
  console.log("1. Crear reserva");
  console.log("2. Ver reservas");
  console.log("3. Ingresos totales");
  console.log("4. Ingresos por tipo");
  console.log("5. Salir");

  rl.question("Seleccione: ", (op: string) => {

    switch(op){

      case "1":
        rl.question("Nombre del cliente: ", (nombre: string) => {

          rl.question("Tipo (economica/estandar/suite): ", (tipo: string) => {

            if (tipo !== "economica" && tipo !== "estandar" && tipo !== "suite") {
              console.log("Tipo inválido");
              return menu();
            }

            const tipoHabitacion = tipo as TipoHabitacion;

            rl.question("Número de noches: ", (nStr: string) => {

              const noches = Number(nStr);

              if (isNaN(noches) || noches <= 0) {
                console.log("Noches inválidas");
                return menu();
              }

              const precioBase = precios[tipoHabitacion];
              const descuento = calcularDescuento(noches);

              const total = (precioBase * noches) * (1 - descuento);

              reservas.push({
                nombre,
                tipo: tipoHabitacion,
                noches,
                precioBase,
                descuento,
                total
              });

              console.log(`Reserva creada. Total: $${total}`);
              menu();
            });
          });
        });
        break;

      case "2":
        console.log("\nReservas:");

        const lista = reservas.map(r => {
          return `${r.nombre} | ${r.tipo} | ${r.noches} noches | Descuento: ${r.descuento * 100}% | Total: $${r.total}`;
        });

        lista.forEach(r => console.log(r));
        menu();
        break;

      case "3":
        console.log("\nIngresos totales:", totalIngresos());
        menu();
        break;

      case "4":
        console.log("\nIngresos por tipo:");
        console.log(ingresosPorTipo());
        menu();
        break;

      case "5":
        console.log("Gracias por usar el sistema de reservas.");
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