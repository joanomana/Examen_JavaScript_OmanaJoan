'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Receta() {
    const [items, setItems] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [ingredientes, setIngredientes] = useState('');
    const [instrucciones, setInstrucciones] = useState('');
    const [tiempo, setTiempo] = useState('');
    const [porciones, setPorciones] = useState('');
    const [categoria, setCategoria] = useState('');
    const [nivel, setNivel] = useState('');
    const [filterDate, setFilterDate] = useState('');

    // Cargar los datos del localStorage al montar el componente
    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem('items')) || [];
        setItems(storedItems);
    }, []);

    // Guardar los datos en localStorage
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

        const newItem = {
        id: Date.now(), // Genera un ID único
        date: new Date().toISOString(), // Usamos ISO para manejar bien fechas
        nombre,
        descripcion,
        };

        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        saveToLocalStorage(updatedItems);

        setNombre('');
        setDescripcion('');

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
        title: 'Editar item',
        html: `
            <input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${item.nombre}">
            <input id="swal-input2" class="swal2-input" placeholder="Descripción" value="${item.descripcion}">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const newName = document.getElementById('swal-input1').value;
            const newDescription = document.getElementById('swal-input2').value;
            if (!newName || !newDescription) {
            Swal.showValidationMessage('Todos los campos son requeridos');
            return;
            }
            return { nombre: newName, descripcion: newDescription };
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
        title: `Detalles de ${item.nombre}`,
        html: `
            <div>
            <h1>${item.nombre}</h1>
            <p>${item.descripcion}</p>
            <p><strong>Fecha de creación:</strong> ${new Date(item.date).toLocaleDateString()}</p>
            <p>La hora de creación es: ${new Date(item.date).toLocaleTimeString()}</p>
            </div>`,
        icon: 'info',
        });
    };

    // Aplicamos filtro por fecha
    const filteredItems = items.filter((item) => {
        if (!filterDate) return true;
        const itemDate = new Date(item.date).toISOString().split('T')[0]; // yyyy-mm-dd
        return itemDate === filterDate;
    });

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Crea tu receta</h1>

            <div className="mb-4 flex flex-col gap-2">
                <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border p-2 rounded"
                />
                <input
                type="text"
                placeholder="Ingredientes"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="border p-2 rounded"
                />
                <input
                type="text"
                placeholder="Instrucciones de preparacion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="border p-2 rounded"
                />
                <input
                type="text"
                placeholder="Tiempo de preparacion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="border p-2 rounded"
                />
                <input
                type="number"
                placeholder="Numero de porciones"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="border p-2 rounded"
                />
                <select
                type="select"
                placeholder="Categoria"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="border p-2 rounded"
                > 
                    <option>Desayuno</option>
                    <option>Almuerzo</option>
                    <option>Cena</option>
                    <option>Postre</option>
                </select>
                <select
                type="select"
                placeholder="Dificultad"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="border p-2 rounded"
                >
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