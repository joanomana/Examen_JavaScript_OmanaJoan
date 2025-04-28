'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Receta() {
    const [items, setItems] = useState([]);
    const [nombre, setNombre] = useState('');
    const [ingredientes, setIngredientes] = useState('');
    const [instrucciones, setInstrucciones] = useState('');
    const [tiempo, setTiempo] = useState('');
    const [porciones, setPorciones] = useState('');
    const [categoria, setCategoria] = useState('');
    const [nivel, setNivel] = useState('');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem('items')) || [];
        setItems(storedItems);
    }, []);

    const saveToLocalStorage = (data) => {
        localStorage.setItem('items', JSON.stringify(data));
    };

    const handleAdd = () => {
        if (!nombre  || !ingredientes || !instrucciones || !tiempo || !porciones 
            || !categoria || !nivel
        ) {
        Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
        return;
        }

        if (tiempo <=0 || porciones<=0 ){
            Swal.fire('Error','No puedes ingresar valores negativos o iguales a 0','error')
            return;
        }

        const newItem = {
        id: Date.now(), 
        date: new Date().toISOString(), 
        nombre,
        ingredientes,
        instrucciones,
        tiempo,
        porciones,
        categoria,
        nivel
        };

        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        saveToLocalStorage(updatedItems);

        setNombre('');
        setIngredientes('');
        setInstrucciones('');
        setTiempo('');
        setPorciones('');
        setCategoria('');
        setNivel('');

        Swal.fire('Éxito', '¡Item agregado!', 'success');
    };

    const handleDelete = (id) => {
        Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esta acción.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        }).then((result) => {
        if (result.isConfirmed) {
            const updatedItems = items.filter(item => item.id !== id);
            setItems(updatedItems);
            saveToLocalStorage(updatedItems);
            Swal.fire('Eliminado', 'El item ha sido eliminado.', 'success');
        }
        });
    };

    const handleEdit = (item) => {
        Swal.fire({
        title: 'Editar receta',
        html: `
            
            <input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${item.nombre}">
            <input id="swal-input2" class="swal2-input" placeholder="Descripción" value="${item.ingredientes}">
            <input id="swal-input3" class="swal2-input" placeholder="Descripción" value="${item.instrucciones}">
            <input id="swal-input4" class="swal2-input" placeholder="Descripción" value="${item.tiempo}">
            <input id="swal-input5" class="swal2-input" placeholder="Descripción" value="${item.porciones}">
            <div class="flex justify-center items-center">
                <div class="grid grid-cols-2 items-center justify-center gap-4 max-w-2/3">
                    <select id="swal-input6" class="p-2 border-2 border-gray-400 mt-2 " placeholder="Descripción" value="${item.categoria}">
                        <option>${item.categoria}</option>
                        <option>Desayuno</option>
                        <option>Almuerzo</option>
                        <option>Cena</option>
                        <option>Postre</option>
                    </select>
                    <select id="swal-input7" class="p-2 border-2 border-gray-400 mt-2 " placeholder="Descripción" value="${item.categoria}">
                        <option>${item.nivel}</option>
                        <option>Facil</option>
                        <option>Medio</option>
                        <option>Dificil</option>
                    </select>
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            const newName = document.getElementById('swal-input1').value;
            const newIngrediente = document.getElementById('swal-input2').value;
            const newInstruccion = document.getElementById('swal-input3').value;
            const newTiempo = document.getElementById('swal-input4').value;
            const newPorciones = document.getElementById('swal-input5').value;
            const newCategoria = document.getElementById('swal-input6').value;
            const newNivel = document.getElementById('swal-input7').value;
            if (!newName || !newIngrediente || !newInstruccion || !newTiempo || !newPorciones || !newCategoria || !newNivel) {
            Swal.showValidationMessage('Todos los campos son requeridos');
            return;
            }
            return { nombre: newName, ingredientes: newIngrediente, instrucciones: newInstruccion,
                tiempo: newTiempo, porciones: newPorciones, categoria: newCategoria, nivel: newNivel
                };
        }
        }).then((result) => {
        if (result.isConfirmed) {
            const updatedItems = items.map(it =>
            it.id === item.id ? { ...it, ...result.value } : it
            );
            setItems(updatedItems);
            saveToLocalStorage(updatedItems);
            Swal.fire('Actualizado', 'El item ha sido editado.', 'success');
        }
        });
    };

    const handleView = (item) => {
        Swal.fire({
        title: `${item.nombre}`,
        html: `
            <div>
            <h1> <strong>Ingredientes:</strong> ${item.ingredientes}</h1>
            <p> <strong>Instrucciones:</strong> ${item.instrucciones}</p>
            <p> <strong>Tiempo de preparacion:</strong> ${item.tiempo} minutos</p>
            <p> <strong>Porciones:</strong> ${item.porciones}</p>
            <p> <strong>Categoria:</strong> ${item.categoria}</p>
            <p> <strong>Dificultad:</strong> ${item.nivel}</p>
            <p><strong>Fecha de creación:</strong> ${new Date(item.date).toLocaleDateString()}</p>
            <p><strong>La hora de creación es:</strong> ${new Date(item.date).toLocaleTimeString()}</p>
            </div>`,
        icon: 'info',
        });
    };

    const filteredItems = items.filter((item) => {
        if (!filterDate) return true;
        const itemDate = new Date(item.date).toISOString().split('T')[0]; 
        return itemDate === filterDate;
    });

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Crea tu receta</h1>

            <div className="mb-4 flex flex-col gap-2">
                <h1>Ingresa el nombre de tu receta</h1>
                <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border p-2 rounded"
                />
                <h1>Ingresa los ingredientes</h1>
                <input
                type="text"
                placeholder="Ingredientes"
                value={ingredientes}
                onChange={(e) => setIngredientes(e.target.value)}
                className="border p-2 rounded"
                />
                <h1>Ingresa las instrucciones</h1>
                <input
                type="text"
                placeholder="Instrucciones de preparacion"
                value={instrucciones}
                onChange={(e) => setInstrucciones(e.target.value)}
                className="border p-2 rounded"
                />
                <h1>Ingresa el tiempo de preparacion en minutos</h1>
                <input
                type="number"
                placeholder="Tiempo de preparacion"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
                className="border p-2 rounded"
                />
                <h1>Ingresa el numero de porciones</h1>
                <input
                type="number"
                placeholder="Numero de porciones"
                value={porciones}
                onChange={(e) => setPorciones(e.target.value)}
                className="border p-2 rounded"
                />
                <h1>Selecciona una categoria</h1>
                <select
                type="select"
                placeholder="Categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="border p-2 rounded"
                >
                    <option>Escoge una opcion</option>
                    <option>Desayuno</option>
                    <option>Almuerzo</option>
                    <option>Cena</option>
                    <option>Postre</option>
                </select>
                <h1>Ingresa el nivel de dificultad</h1>
                <select
                type="select"
                placeholder="Dificultad"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="border p-2 rounded"
                >
                    <option>Escoge una opcion</option>
                    <option>Facil</option>
                    <option>Medio</option>
                    <option>Dificil</option>
                </select>

                <button
                onClick={handleAdd}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                Agregar
                </button>

                {/* Filtro por fecha */}
                <div className="flex flex-col md:flex-row md:items-center md:gap-2 mt-4">
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="border p-2 rounded"
                />
                <button
                    onClick={() => setFilterDate('')}
                    className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 mt-2 md:mt-0"
                >
                    Limpiar Filtro
                </button>
                </div>

                {/* Contador de resultados */}
                <p className="text-gray-600 mt-2">
                Mostrando {filteredItems.length} {filteredItems.length === 1 ? 'resultado' : 'resultados'}
                </p>
            </div>

            {/* Listado de items */}
            <div className="space-y-4">
                {filteredItems.length === 0 ? (
                <p className="text-gray-500">No hay items guardados.</p>
                ) : (
                filteredItems.map((item) => (
                    <div key={item.id} className="border p-4 rounded shadow flex flex-col md:flex-row md:justify-between md:items-center">
                        <div>
                            <h2 className="text-xl font-semibold">{item.nombre}</h2>
                            <p className="text-gray-600">{item.descripcion}</p>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0">
                            <button
                            onClick={() => handleView(item)}
                            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                            >
                            Ver Más
                            </button>
                            <button
                            onClick={() => handleEdit(item)}
                            className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                            >
                            Editar
                            </button>
                            <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                            >
                            Eliminar
                            </button>
                        </div>
                    </div>
                ))
                )}
            </div>
        </div>
    );
}