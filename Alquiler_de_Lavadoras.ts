import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

type Lavadora = {
    id: number;
    disponible: boolean;
};

type Alquiler = {
    id: number;
    lavadoraId: number;
    horas: number;
    precio: number;
    descuento: number;
    total: number;
};

// DATOS
let lavadoras: Lavadora[] = [
    { id: 1, disponible: true },
    { id: 2, disponible: true },
    { id: 3, disponible: true },
    { id: 4, disponible: true },
    { id: 5, disponible: true }
];

let alquileres: Alquiler[] = [];

let contadorAlquiler: number = 1;

const PRECIO_HORA = 2;

// FUNCIONES
function calcularDescuento(horas: number): number {
    if (horas >= 9) return 0.30;
    if (horas >= 5) return 0.20;
    if (horas >= 3) return 0.10;
    return 0;
}

function obtenerLavadoraDisponible(): Lavadora | undefined {
    return lavadoras.find(l => l.disponible);
}

function totalRecaudado(): number {
    return alquileres.reduce((acc, a) => acc + a.total, 0);
}

// MENU
function menu(): void {

    console.log("\n--- SISTEMA DE LAVADORAS ---");
    console.log("1. Alquilar lavadora");
    console.log("2. Devolver lavadora");
    console.log("3. Ver alquileres");
    console.log("4. Total recaudado");
    console.log("5. Ver lavadoras disponibles");
    console.log("6. Salir");

    rl.question("Seleccione: ", (op: string) => {

        switch(op){

            case "1":
                const lavadora = obtenerLavadoraDisponible();

                if (!lavadora) {
                    console.log("No hay lavadoras disponibles");
                    return menu();
                }

                rl.question("Horas de uso: ", (hStr) => {

                    const horas = Number(hStr);

                    if (isNaN(horas) || horas <= 0) {
                        console.log("Horas inválidas");
                        return menu();
                    }

                    const descuento = calcularDescuento(horas);
                    const precio = PRECIO_HORA * horas;
                    const total = precio * (1 - descuento);

                    lavadora.disponible = false;

                    alquileres.push({
                        id: contadorAlquiler++,
                        lavadoraId: lavadora.id,
                        horas,
                        precio,
                        descuento,
                        total
                    });

                    console.log(`Lavadora ${lavadora.id} alquilada. Total: $${total}`);
                    menu();
                });
                break;

            case "2":
                rl.question("ID de la lavadora a devolver: ", (idStr) => {

                    const id = Number(idStr);
                    const lavadora = lavadoras.find(l => l.id === id);

                    if (!lavadora) {
                        console.log("Lavadora no existe");
                        return menu();
                    }

                    if (lavadora.disponible) {
                        console.log("La lavadora ya está disponible");
                        return menu();
                    }

                    lavadora.disponible = true;
                    console.log("Lavadora devuelta correctamente");
                    menu();
                });
                break;

            case "3":
                console.log("\nAlquileres:");

                const lista = alquileres.map(a => {
                    return `Alquiler #${a.id} | Lavadora ${a.lavadoraId} | ${a.horas} horas | Descuento: ${a.descuento * 100}% | Total: $${a.total}`;
                });

                lista.forEach(a => console.log(a));
                menu();
                break;

            case "4":
                console.log("\nTotal recaudado:", totalRecaudado());
                menu();
                break;

            case "5":
                const disponibles = lavadoras.filter(l => l.disponible);
                console.log("\nLavadoras disponibles:", disponibles.map(l => l.id));
                menu();
                break;

            case "6":
                console.log("Hasta luego");
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