import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

type Cliente = {
    turno: number;
    estado: string;
    llegada: number;
    inicioAtencion?: number;
    finAtencion?: number;
};

let fila: Cliente[] = [];
let historial: Cliente[] = [];
let contadorTurno = 1;

function menu(): void {

    console.log("\n--- FILA DE BANCO ---");
    console.log("1. Llegar");
    console.log("2. Ver en espera");
    console.log("3. Atender");
    console.log("4. Estadísticas");
    console.log("5. Salir");

    rl.question("Seleccione: ", (op) => {

        switch(op){

            case "1":
                const cliente: Cliente = {
                    turno: contadorTurno++,
                    estado: "esperando",
                    llegada: Date.now()
                };

                fila.push(cliente);
                console.log("Turno asignado:", cliente.turno);
                menu();
                break;

            case "2":
                const esperando = fila.filter(c => c.estado === "esperando");

                const lista = esperando.map(c => `Turno ${c.turno}`);
                console.log("En espera:", lista);

                menu();
                break;

            case "3":
                const siguiente = fila.shift();

                if (!siguiente) {
                    console.log("No hay clientes");
                    return menu();
                }

                siguiente.inicioAtencion = Date.now();

                // Simular tiempo de atención (1 segundo)
                setTimeout(() => {

                    siguiente.finAtencion = Date.now();
                    siguiente.estado = "atendido";

                    historial.push(siguiente);

                    console.log("Turno atendido:", siguiente.turno);
                    menu();

                }, 1000);

                break;

            case "4":

                const atendidos = historial.filter(c => c.estado === "atendido");

                const promedioEspera = atendidos.length === 0 ? 0 :
                    atendidos.reduce((acc, c) => {
                        return acc + (c.inicioAtencion! - c.llegada);
                    }, 0) / atendidos.length;

                const promedioAtencion = atendidos.length === 0 ? 0 :
                    atendidos.reduce((acc, c) => {
                        return acc + (c.finAtencion! - c.inicioAtencion!);
                    }, 0) / atendidos.length;

                console.log("\n--- ESTADÍSTICAS ---");
                console.log("En espera:", fila.length);
                console.log("Atendidos:", atendidos.length);
                console.log("Promedio espera:", promedioEspera.toFixed(2), "ms");
                console.log("Promedio atención:", promedioAtencion.toFixed(2), "ms");

                // Mostrar detalle (map)
                const detalle = atendidos.map(c => {
                    const espera = c.inicioAtencion! - c.llegada;
                    const atencion = c.finAtencion! - c.inicioAtencion!;
                    return `Turno ${c.turno} | Espera: ${espera} ms | Atención: ${atencion} ms`;
                });

                detalle.forEach(d => console.log(d));

                menu();
                break;

            case "5":
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