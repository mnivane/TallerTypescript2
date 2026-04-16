import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// CONSTANTE DE CAPACIDAD
const CAPACIDAD_SALA = 100;

// TIPOS
type Pelicula = {
    id: number;
    titulo: string;
    genero: string;
    duracion: number;
    horarios: string[];
};

type Venta = {
    peliculaId: number;
    horario: string;
    tipo: string;
    cantidad: number;
    total: number;
};

// PELÍCULAS
let peliculas: Pelicula[] = [
    { id: 1, titulo: "Avengers", genero: "Acción", duracion: 120, horarios: ["3pm", "6pm"] },
    { id: 2, titulo: "Barbie", genero: "Comedia", duracion: 100, horarios: ["4pm", "8pm"] },
    { id: 3, titulo: "Mario", genero: "Animación", duracion: 90, horarios: ["2pm", "5pm"] }
];

// PRECIOS
const precios: Record<string, number> = {
    adulto: 10,
    estudiante: 7,
    nino: 5
};

// VENTAS
let ventas: Venta[] = [];

function buscarPelicula(id: number): Pelicula | undefined {
    return peliculas.find(p => p.id === id);
}

function asientosVendidos(peliculaId: number, horario: string): number {
    return ventas
        .filter(v => v.peliculaId === peliculaId && v.horario === horario)
        .reduce((acc, v) => acc + v.cantidad, 0);
}

function totalIngresos(): number {
    return ventas.reduce((acc, v) => acc + v.total, 0);
}

function peliculasPopulares(): Pelicula[] {
    return peliculas.filter(p => {
        const vendidos = ventas
            .filter(v => v.peliculaId === p.id)
            .reduce((acc, v) => acc + v.cantidad, 0);

        return vendidos >= CAPACIDAD_SALA * 0.7;
    });
}

// OCUPACIÓN
function ocupacionPorPelicula() {
    return peliculas.map(p => {
        const vendidos = ventas
            .filter(v => v.peliculaId === p.id)
            .reduce((acc, v) => acc + v.cantidad, 0);

        return {
            pelicula: p.titulo,
            ocupacion: ((vendidos / CAPACIDAD_SALA) * 100).toFixed(2) + "%"
        };
    });
}

// MENÚ
function mostrarMenu(): void {
    console.log('\n --- CINE ---');
    console.log("1. Comprar boleta");
    console.log("2. Ver ventas");
    console.log("3. Total ingresos");
    console.log("4. Películas populares (>70%)");
    console.log("5. Ver ocupación");
    console.log("6. Salir");

    rl.question('Seleccione una opción: ', (opcion: string) => {

        switch (opcion) {

            case '1':
                console.log("\nPelículas disponibles:");
                peliculas.forEach(p => {
                    console.log(`ID: ${p.id} - ${p.titulo}`);
                    console.log(`   Género: ${p.genero}`);
                    console.log(`   Duración: ${p.duracion} min`);
                    console.log(`   Horarios: ${p.horarios.join(", ")}`);
                });

                rl.question("ID de la película: ", (idStr) => {
                    const pelicula = buscarPelicula(Number(idStr));

                    if (!pelicula) {
                        console.log("Película no existe");
                        return mostrarMenu();
                    }

                    rl.question("Horario: ", (horario) => {

                        if (!pelicula.horarios.includes(horario)) {
                            console.log("Horario no disponible");
                            return mostrarMenu();
                        }

                        rl.question("Tipo (adulto/estudiante/nino): ", (tipo) => {

                            if (!precios[tipo]) {
                                console.log("Tipo inválido");
                                return mostrarMenu();
                            }

                            rl.question("Cantidad: ", (cantStr) => {

                                const cantidad = Number(cantStr);

                                if (isNaN(cantidad) || cantidad <= 0) {
                                    console.log("Cantidad inválida");
                                    return mostrarMenu();
                                }

                                const vendidos = asientosVendidos(pelicula.id, horario);

                                if (vendidos + cantidad > CAPACIDAD_SALA) {
                                    console.log("No hay suficientes asientos");
                                    return mostrarMenu();
                                }

                                const total = precios[tipo]! * cantidad;

                                ventas.push({
                                    peliculaId: pelicula.id,
                                    horario,
                                    tipo,
                                    cantidad,
                                    total
                                });

                                console.log(`Compra exitosa. Total: $${total}`);
                                mostrarMenu();
                            });
                        });
                    });
                });
                break;

            case '2':
                console.log("\nVentas:");
                ventas.forEach(v => {
                    const peli = buscarPelicula(v.peliculaId);
                    console.log(`${peli?.titulo} | ${v.horario} | ${v.tipo} | Cant: ${v.cantidad} | $${v.total}`);
                });
                mostrarMenu();
                break;

            case '3':
                console.log("\nTotal ingresos:", totalIngresos());
                mostrarMenu();
                break;

            case '4':
                console.log("\nPelículas populares:");
                console.log(peliculasPopulares().map(p => p.titulo));
                mostrarMenu();
                break;

            case '5':
                console.log("\nOcupación:");
                console.log(ocupacionPorPelicula());
                mostrarMenu();
                break;

            case '6':
                console.log("Gracias por usar el sistema");
                rl.close();
                break;

            default:
                console.log("Opción inválida");
                mostrarMenu();
                break;
        }
    });
}

mostrarMenu();