// Script para crear categorías de prueba
// Ejecutar con: node create-categories.js

const API_BASE_URL = 'http://localhost:3000';

const categories = [
  'Personal',
  'Urgente', 
  'Ideas',
  'Recordatorios',
  'Proyectos',
  'Estudio',
  'Finanzas',
  'Salud'
];

async function createCategory(name) {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    
    if (response.ok) {
      const category = await response.json();
      console.log(`✅ Categoría creada: ${category.name} (ID: ${category.id})`);
      return category;
    } else {
      console.log(`❌ Error al crear categoría "${name}": ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error de red al crear categoría "${name}":`, error.message);
  }
}

async function createAllCategories() {
  console.log('🚀 Creando categorías de prueba...\n');
  
  for (const categoryName of categories) {
    await createCategory(categoryName);
    // Pequeña pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n✨ Proceso completado!');
}

// Ejecutar si el backend está corriendo
createAllCategories().catch(console.error); 