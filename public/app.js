// ==========================================
// CONTROLADOR DE ALMACENAMIENTO SEGURO
// ==========================================
const storage = {
  memory: {},
  sessionMemory: {},
  
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`localStorage bloqueado. Leyendo '${key}' desde memoria temporal.`);
      return this.memory[key] || null;
    }
  },
  
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`localStorage bloqueado. Guardando '${key}' en memoria temporal.`);
      this.memory[key] = value;
    }
  },
  
  sessionGet(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.warn(`sessionStorage bloqueado. Leyendo '${key}' desde memoria temporal.`);
      return this.sessionMemory[key] || null;
    }
  },
  
  sessionSet(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.warn(`sessionStorage bloqueado. Guardando '${key}' en memoria temporal.`);
      this.sessionMemory[key] = value;
    }
  },
  
  sessionClear() {
    try {
      sessionStorage.clear();
    } catch (e) {
      this.sessionMemory = {};
    }
  }
};

// ==========================================
// MENÚ POR DEFECTO PARA MODO OFFLINE/LOCAL
// ==========================================
const DEFAULT_MENU = [
  {
    "id": "ent-miso",
    "name": "Sopa Miso Clásica",
    "vietName": "Miso Soup",
    "price": 95,
    "category": "entradas",
    "description": "Con tofu, wakame y hojuelas de pescado.",
    "options": [],
    "available": true
  },
  {
    "id": "ent-rollos-frios",
    "name": "Rollos Vietnamitas Fríos (Veg/Tofu)",
    "vietName": "Fresh Spring Rolls",
    "price": 97,
    "category": "entradas",
    "description": "Hoja de arroz, fideos de soya, lechuga, zanahoria, hierbas de olor y salsa de cacahuate.",
    "options": [],
    "available": true
  },
  {
    "id": "ent-rollos-camaron",
    "name": "Rollos Vietnamitas Fríos con Camarón",
    "vietName": "Fresh Spring Rolls w/ Shrimp",
    "price": 100,
    "category": "entradas",
    "description": "Hoja de arroz, fideos de soya, lechuga, zanahoria, hierbas de olor, salsa de cacahuate y camarón.",
    "options": [],
    "available": true
  },
  {
    "id": "ent-satay",
    "name": "Pollo Satay al Té de Limón",
    "vietName": "Thai Satay Chicken",
    "price": 120,
    "category": "entradas",
    "description": "4 Brochetas chicas con salsa de cacahuate thai, hierbas de olor y ensalada de col morada.",
    "options": [],
    "available": true
  },
  {
    "id": "ent-stickers",
    "name": "Pot Stickers (Cerdo)",
    "vietName": "Pot Stickers",
    "price": 116,
    "category": "entradas",
    "description": "Rellenos de carne molida de cerdo con ajo, jengibre y hierbas de olor, salsa de anguila y ponzu.",
    "options": [],
    "available": true
  },
  {
    "id": "pf-pad-pollo",
    "name": "Pad Thai Pollo",
    "vietName": "Pad Thai Chicken",
    "price": 170,
    "category": "pho",
    "description": "Fideos de arroz con salsa thai agridulce, pollo, huevo, zanahoria, germen de soya, rábano, hierbas de olor, cilantro, col morada, ajo, jengibre y cacahuates.",
    "options": ["Sin cacahuate", "Sin cilantro", "Extra Pollo (+$60)"],
    "available": true
  },
  {
    "id": "pf-pad-tofu",
    "name": "Pad Thai Tofu",
    "vietName": "Pad Thai Tofu",
    "price": 175,
    "category": "pho",
    "description": "Fideos de arroz con salsa thai agridulce, tofu, huevo, zanahoria, germen de soya, rábano, hierbas de olor, cilantro, col morada, ajo, jengibre y cacahuates.",
    "options": ["Sin cacahuate", "Sin huevo"],
    "available": true
  },
  {
    "id": "pf-pad-camaron",
    "name": "Pad Thai Camarón",
    "vietName": "Pad Thai Shrimp",
    "price": 208,
    "category": "pho",
    "description": "Fideos de arroz con salsa thai agridulce, camarón, huevo, zanahoria, germen de soya, rábano, hierbas de olor, cilantro, col morada, ajo, jengibre y cacahuates.",
    "options": ["Sin cacahuate", "Extra Camarón (+$70)"],
    "available": true
  },
  {
    "id": "pf-pad-arrachera",
    "name": "Pad Thai Arrachera",
    "vietName": "Pad Thai Beef",
    "price": 198,
    "category": "pho",
    "description": "Fideos de arroz con salsa thai agridulce, arrachera, huevo, zanahoria, germen de soya, rábano, hierbas de olor, cilantro, col morada, ajo, jengibre y cacahuates.",
    "options": ["Sin cacahuate", "Extra Arrachera (+$70)"],
    "available": true
  },
  {
    "id": "pf-curry-pollo",
    "name": "Curry de Coco Pollo",
    "vietName": "Coconut Curry Chicken",
    "price": 170,
    "category": "pho",
    "description": "Curry tailandés con pollo, brócoli, zanahoria y camotes, servido con arroz jazmín. Picante. 🌶️",
    "options": ["Poco picante", "Muy picante"],
    "available": true
  },
  {
    "id": "pf-curry-tofu",
    "name": "Curry de Coco Tofu",
    "vietName": "Coconut Curry Tofu",
    "price": 175,
    "category": "pho",
    "description": "Curry tailandés con tofu, brócoli, zanahoria y camotes, servido con arroz jazmín. Picante. 🌶️",
    "options": ["Poco picante", "Muy picante"],
    "available": true
  },
  {
    "id": "pf-curry-camaron",
    "name": "Curry de Coco Camarón",
    "vietName": "Coconut Curry Shrimp",
    "price": 208,
    "category": "pho",
    "description": "Curry tailandés con camarón, brócoli, zanahoria y camotes, servido con arroz jazmín. Picante. 🌶️",
    "options": ["Poco picante", "Muy picante"],
    "available": true
  },
  {
    "id": "pf-curry-arrachera",
    "name": "Curry de Coco Arrachera",
    "vietName": "Coconut Curry Beef",
    "price": 198,
    "category": "pho",
    "description": "Curry tailandés con arrachera, brócoli, zanahoria y camotes, servido con arroz jazmín. Picante. 🌶️",
    "options": ["Poco picante", "Muy picante"],
    "available": true
  },
  {
    "id": "pf-stir-pollo",
    "name": "Stir Fry Pollo",
    "vietName": "Stir Fry Chicken",
    "price": 170,
    "category": "pho",
    "description": "Salteado de pollo, morrones, brócoli, zanahoria, rábano, germen de soya, hierbas de olor, ajo, jengibre y cacahuates. Servido con arroz jazmín.",
    "options": ["Sin cacahuate"],
    "available": true
  },
  {
    "id": "pf-stir-tofu",
    "name": "Stir Fry Tofu",
    "vietName": "Stir Fry Tofu",
    "price": 175,
    "category": "pho",
    "description": "Salteado de tofu, morrones, brócoli, zanahoria, rábano, germen de soya, hierbas de olor, ajo, jengibre y cacahuates. Servido con arroz jazmín.",
    "options": ["Sin cacahuate"],
    "available": true
  },
  {
    "id": "pf-stir-camaron",
    "name": "Stir Fry Camarón",
    "vietName": "Stir Fry Shrimp",
    "price": 208,
    "category": "pho",
    "description": "Salteado de camarones, morrones, brócoli, zanahoria, rábano, germen de soya, hierbas de olor, ajo, jengibre y cacahuates. Servido con arroz jazmín.",
    "options": ["Sin cacahuate"],
    "available": true
  },
  {
    "id": "pf-stir-arrachera",
    "name": "Stir Fry Arrachera",
    "vietName": "Stir Fry Beef",
    "price": 198,
    "category": "pho",
    "description": "Salteado de arrachera, morrones, brócoli, zanahoria, rábano, germen de soya, hierbas de olor, ajo, jengibre y cacahuates. Servido con arroz jazmín.",
    "options": ["Sin cacahuate"],
    "available": true
  },
  {
    "id": "pf-drunken-pollo",
    "name": "Drunken Noodles Pollo",
    "vietName": "Drunken Noodles Chicken",
    "price": 170,
    "category": "pho",
    "description": "Fideos de arroz con salsa agridulce picante, pollo, 2 huevos, chile serrano, cebolla blanca, hierbas de olor, col morada, ajo, jengibre y jitomate cherry. Picante. 🌶️",
    "options": ["Poco picante", "Muy picante"],
    "available": true
  },
  {
    "id": "pf-drunken-tofu",
    "name": "Drunken Noodles Tofu",
    "vietName": "Drunken Noodles Tofu",
    "price": 175,
    "category": "pho",
    "description": "Fideos de arroz con salsa agridulce picante, tofu, 2 huevos, chile serrano, cebolla blanca, hierbas de olor, col morada, ajo, jengibre y jitomate cherry. Picante. 🌶️",
    "options": ["Poco picante", "Muy picante"],
    "available": true
  },
  {
    "id": "pf-drunken-camaron",
    "name": "Drunken Noodles Camarón",
    "vietName": "Drunken Noodles Shrimp",
    "price": 208,
    "category": "pho",
    "description": "Fideos de arroz con salsa agridulce picante, camarón, 2 huevos, chile serrano, cebolla blanca, hierbas de olor, col morada, ajo, jengibre y jitomate cherry. Picante. 🌶️",
    "options": ["Poco picante", "Muy picante"],
    "available": true
  },
  {
    "id": "pf-drunken-arrachera",
    "name": "Drunken Noodles Arrachera",
    "vietName": "Drunken Noodles Beef",
    "price": 198,
    "category": "pho",
    "description": "Fideos de arroz con salsa agridulce picante, arrachera, 2 huevos, chile serrano, cebolla blanca, hierbas de olor, col morada, ajo, jengibre y jitomate cherry. Picante. 🌶️",
    "options": ["Poco picante", "Muy picante"],
    "available": true
  },
  {
    "id": "ens-mango",
    "name": "Ensalada Pollo con Mango",
    "vietName": "Chicken Mango Salad",
    "price": 165,
    "category": "entradas",
    "description": "Lechuga mixta, mango, zanahoria, pepino, hierbas de olor y col morada con aderezo y semillas de ajonjolí.",
    "options": [],
    "available": true
  },
  {
    "id": "ens-coco",
    "name": "Camarones al Coco con Aderezo de Cacahuate",
    "vietName": "Coconut Shrimp w/ Peanut Dressing",
    "price": 173,
    "category": "entradas",
    "description": "Lechuga mixta, mango, zanahoria, pepino, hierbas de olor, camarones empanizados y aderezo de cacahuate.",
    "options": [],
    "available": true
  },
  {
    "id": "ens-thai-arrachera",
    "name": "Thai Picante con Arrachera",
    "vietName": "Spicy Thai Beef Salad",
    "price": 195,
    "category": "entradas",
    "description": "Mezcla de lechugas, pepino, jitomate, cebolla morada con aderezo thai picante.",
    "options": [],
    "available": true
  },
  {
    "id": "sop-tomkha",
    "name": "Sopa Tom Kha Gai (Completa)",
    "vietName": "Tom Kha Gai (Full)",
    "price": 178,
    "category": "entradas",
    "description": "Sopa Thai de coco con pollo, brócoli, zanahoria, limón, fideos de soya, germen y col morada.",
    "options": [],
    "available": true
  },
  {
    "id": "sop-tomkha-media",
    "name": "Sopa Tom Kha Gai (Media Orden)",
    "vietName": "Tom Kha Gai (Half)",
    "price": 108,
    "category": "entradas",
    "description": "Media orden de sopa Thai de coco con pollo.",
    "options": [],
    "available": true
  },
  {
    "id": "sop-phobo",
    "name": "Pho Bo de Res (Completa)",
    "vietName": "Pho Bo (Full)",
    "price": 175,
    "category": "entradas",
    "description": "Sopa vietnamita de res con fideos de arroz, germen de soya, hierbas de olor, cebolla morada, ajo y jengibre.",
    "options": ["Extra Fideos (+$20)"],
    "available": true
  },
  {
    "id": "sop-phobo-media",
    "name": "Pho Bo de Res (Media Orden)",
    "vietName": "Pho Bo (Half)",
    "price": 108,
    "category": "entradas",
    "description": "Media orden de sopa vietnamita de res con fideos.",
    "options": [],
    "available": true
  },
  {
    "id": "sop-phogha",
    "name": "Pho Gha de Pollo (Completa)",
    "vietName": "Pho Gha (Full)",
    "price": 155,
    "category": "entradas",
    "description": "Sopa vietnamita de pollo con fideos de arroz, zanahoria, brócoli, germen de soya, ajo y jengibre.",
    "options": ["Extra Fideos (+$20)"],
    "available": true
  },
  {
    "id": "sop-phogha-media",
    "name": "Pho Gha de Pollo (Media Orden)",
    "vietName": "Pho Gha (Half)",
    "price": 98,
    "category": "entradas",
    "description": "Media orden de sopa vietnamita de pollo.",
    "options": [],
    "available": true
  },
  {
    "id": "sop-ramen",
    "name": "Miso Ramen (Completa)",
    "vietName": "Miso Ramen (Full)",
    "price": 165,
    "category": "entradas",
    "description": "Sopa de miso con fideos de huevo, carne de cerdo, wakame, do chua y dashi.",
    "options": [],
    "available": true
  },
  {
    "id": "sop-ramen-media",
    "name": "Miso Ramen (Media Orden)",
    "vietName": "Miso Ramen (Half)",
    "price": 104,
    "category": "entradas",
    "description": "Media orden de ramen con sopa de miso y fideos de huevo.",
    "options": [],
    "available": true
  },
  {
    "id": "fid-pollo-ajonjo",
    "name": "Tazón Fideos Fríos Pollo Ajonjolí",
    "vietName": "Chicken Cold Noodles w/ Sesame",
    "price": 153,
    "category": "pho",
    "description": "Fideos de soya con aderezo de ajonjolí, pollo, brócoli, camotes fritos, pepinos frescos, hierbas de olor y col morada.",
    "options": [],
    "available": true
  },
  {
    "id": "fid-bunthit",
    "name": "Tazón Fideos Fríos Bun Thit Nuong",
    "vietName": "Bun Thit Nuong",
    "price": 158,
    "category": "pho",
    "description": "Fideos de soya con cerdo BBQ, aderezo bun, germen de soya, verduras en escabeche, col morada, cacahuates y un rollito crujiente de cerdo.",
    "options": [],
    "available": true
  },
  {
    "id": "fid-tofu-coco",
    "name": "Tazón Fideos Fríos Tofu Coco",
    "vietName": "Coconut Tofu Cold Noodles",
    "price": 163,
    "category": "pho",
    "description": "Fideos de soya con aderezo de ajonjolí, tofu crujiente de coco, brócoli, camotes fritos, pepinos frescos, hierbas de olor y verduras en escabeche.",
    "options": [],
    "available": true
  },
  {
    "id": "tac-camaron",
    "name": "Tacos de Camarón (2 pzas)",
    "vietName": "Shrimp Tacos",
    "price": 135,
    "category": "entradas",
    "description": "2 Tacos en tortilla de harina con camarones empanizados al coco, sambal alioli, zanahoria, col morada, cilantro y ensalada de col al lado.",
    "options": [],
    "available": true
  },
  {
    "id": "bur-pollo-tofu",
    "name": "Burrito de Pollo o Tofu",
    "vietName": "Chicken or Tofu Burrito",
    "price": 127,
    "category": "entradas",
    "description": "Con salsa de cacahuate, en tortilla de harina, lechuga, pepino, germen de soya, zanahoria, hierbas de olor y cacahuates, acompañado de camotes fritos.",
    "options": ["Elegir Pollo", "Elegir Tofu"],
    "available": true
  },
  {
    "id": "bm-cerdo",
    "name": "Bánh Mì Cerdo",
    "vietName": "Bánh Mì Pork",
    "price": 142,
    "category": "banhmi",
    "description": "Baguette con cerdo, sambal alioli, verduras en escabeche, pepinos frescos, cilantro y guarnición de camotes fritos.",
    "options": ["Sin cilantro", "Sin jalapeño"],
    "available": true
  },
  {
    "id": "bm-tofu",
    "name": "Bánh Mì Tofu Crujiente",
    "vietName": "Bánh Mì Crispy Tofu",
    "price": 137,
    "category": "banhmi",
    "description": "Baguette con tofu crujiente, sambal alioli, verduras en escabeche, pepinos frescos, cilantro y guarnición de camotes fritos.",
    "options": ["Sin cilantro", "Sin jalapeño"],
    "available": true
  },
  {
    "id": "bm-pollo",
    "name": "Bánh Mì Pollo",
    "vietName": "Bánh Mì Chicken",
    "price": 137,
    "category": "banhmi",
    "description": "Baguette con pollo, sambal alioli, verduras en escabeche, pepinos frescos, cilantro y guarnición de camotes fritos.",
    "options": ["Sin cilantro", "Sin jalapeño"],
    "available": true
  },
  {
    "id": "bm-camaron",
    "name": "Bánh Mì Camarón",
    "vietName": "Bánh Mì Shrimp",
    "price": 157,
    "category": "banhmi",
    "description": "Baguette con camarón, sambal alioli, verduras en escabeche, pepinos frescos, cilantro y guarnición de camotes fritos.",
    "options": ["Sin cilantro", "Sin jalapeño"],
    "available": true
  },
  {
    "id": "bm-arrachera",
    "name": "Bánh Mì Arrachera",
    "vietName": "Bánh Mì Beef",
    "price": 152,
    "category": "banhmi",
    "description": "Baguette con arrachera, sambal alioli, verduras en escabeche, pepinos frescos, cilantro y guarnición de camotes fritos.",
    "options": ["Sin cilantro", "Sin jalapeño"],
    "available": true
  },
  {
    "id": "ext-pollo-tofu",
    "name": "Extra Pollo o Tofu",
    "vietName": "Extra Chicken/Tofu",
    "price": 60,
    "category": "entradas",
    "description": "Orden extra de proteína.",
    "options": [],
    "available": true
  },
  {
    "id": "ext-arrachera-camaron",
    "name": "Extra Arrachera o Camarón",
    "vietName": "Extra Beef/Shrimp",
    "price": 70,
    "category": "entradas",
    "description": "Orden extra de proteína premium.",
    "options": [],
    "available": true
  },
  {
    "id": "ext-arroz",
    "name": "Extra Arroz",
    "vietName": "Extra Rice",
    "price": 65,
    "category": "entradas",
    "description": "Orden extra de arroz.",
    "options": [],
    "available": true
  },
  {
    "id": "ext-camote",
    "name": "Extra Camote",
    "vietName": "Extra Sweet Potato",
    "price": 65,
    "category": "entradas",
    "description": "Orden extra de camotes fritos.",
    "options": [],
    "available": true
  },
  {
    "id": "ext-llevar",
    "name": "Contenedor para llevar",
    "vietName": "Takeaway container",
    "price": 6,
    "category": "entradas",
    "description": "Contenedor adicional para empaque.",
    "options": [],
    "available": true
  },
  {
    "id": "beb-limonada",
    "name": "Limonada",
    "vietName": "Lemonade",
    "price": 50,
    "category": "bebidas",
    "description": "Limonada fresca natural.",
    "options": [],
    "available": true
  },
  {
    "id": "beb-naranjada",
    "name": "Naranjada",
    "vietName": "Orangeade",
    "price": 50,
    "category": "bebidas",
    "description": "Naranjada fresca natural.",
    "options": [],
    "available": true
  },
  {
    "id": "beb-coca",
    "name": "Coca Cola",
    "vietName": "Coca Cola",
    "price": 50,
    "category": "bebidas",
    "description": "Refresco tradicional.",
    "options": [],
    "available": true
  },
  {
    "id": "beb-ginger",
    "name": "Ginger Ale",
    "vietName": "Ginger Ale",
    "price": 50,
    "category": "bebidas",
    "description": "Refresco de jengibre.",
    "options": [],
    "available": true
  },
  {
    "id": "beb-agua-min",
    "name": "Agua Mineral",
    "vietName": "Sparkling water",
    "price": 50,
    "category": "bebidas",
    "description": "Agua mineral con gas.",
    "options": [],
    "available": true
  },
  {
    "id": "beb-te-helado",
    "name": "Te Helado",
    "vietName": "Iced tea",
    "price": 60,
    "category": "bebidas",
    "description": "Té helado clásico.",
    "options": [],
    "available": true
  },
  {
    "id": "beb-limonada-jen",
    "name": "Limonada de Jengibre",
    "vietName": "Ginger lemonade",
    "price": 60,
    "category": "bebidas",
    "description": "Limonada fresca con toque de jengibre.",
    "options": [],
    "available": true
  },
  {
    "id": "beb-limonada-fresa",
    "name": "Limonada de Fresa Albahaca",
    "vietName": "Strawberry and basil lemonade",
    "price": 60,
    "category": "bebidas",
    "description": "Limonada combinada con fresa y albahaca fresca.",
    "options": [],
    "available": true
  },
  {
    "id": "beb-limonada-pep",
    "name": "Limonada de Pepino Menta",
    "vietName": "Cucumber and mint lemonade",
    "price": 60,
    "category": "bebidas",
    "description": "Limonada combinada con pepino y menta fresca.",
    "options": [],
    "available": true
  },
  {
    "id": "beb-kombucha",
    "name": "Kombucha",
    "vietName": "Kombucha",
    "price": 65,
    "category": "bebidas",
    "description": "Bebida fermentada saludable.",
    "options": [],
    "available": true
  },
  {
    "id": "beb-agua",
    "name": "Botella de agua",
    "vietName": "Bottled water",
    "price": 25,
    "category": "bebidas",
    "description": "Agua embotellada purificada.",
    "options": [],
    "available": true
  }
];

const DEFAULT_TABLES = [
  {"id": 1, "name": "Mesa 1", "status": "free", "currentOrder": null},
  {"id": 2, "name": "Mesa 2", "status": "free", "currentOrder": null},
  {"id": 3, "name": "Mesa 3", "status": "free", "currentOrder": null},
  {"id": 4, "name": "Mesa 4", "status": "free", "currentOrder": null},
  {"id": 5, "name": "Mesa 5", "status": "free", "currentOrder": null},
  {"id": 6, "name": "Mesa 6", "status": "free", "currentOrder": null},
  {"id": 7, "name": "Mesa 7", "status": "free", "currentOrder": null},
  {"id": 8, "name": "Mesa 8", "status": "free", "currentOrder": null}
];

// ==========================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================
const state = {
  role: null,          // 'cajero' | 'maestro'
  token: null,         // Token del Maestro
  menu: [],            // Catálogo de productos
  tables: [],          // Mapa de mesas
  activeTableId: null, // ID de la mesa seleccionada actualmente
  activeCategory: 'all', // Filtro de categoría de comida
  ws: null,            // Objeto WebSocket
  selectedItemToAdd: null, // Platillo seleccionado para personalizar
  salesHistory: [],    // Historial de ventas
  isOfflineMode: false, // Flag de modo offline/local
  settings: {
    taxRate: 0.16,
    serviceRate: 0.10,
    masterPin: "1234"
  }
};

// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
function initializeApp() {
  try {
    setupEventListeners();
    checkSession();
    connectWebSocket();
  } catch (err) {
    alert("Error durante la inicialización: " + err.message);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}


// Comprobar si ya hay una sesión activa en el navegador
function checkSession() {
  const savedRole = storage.sessionGet('pos_role');
  const savedToken = storage.sessionGet('pos_token');

  if (savedRole) {
    state.role = savedRole;
    state.token = savedToken;
    
    // Cambiar de pantalla
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('app-screen').classList.add('active');
    
    // Configurar interfaz según rol
    updateUIForRole();
  }
}

// ==========================================
// CONEXIÓN WEBSOCKET Y FALLBACK OFFLINE
// ==========================================
function connectWebSocket() {
  const statusBadge = document.getElementById('connection-status');
  
  // Si abrimos el archivo directamente (protocolo file://) entrar en modo local directamente
  if (window.location.protocol === 'file:') {
    enableOfflineMode('Modo Local (Archivo)');
    return;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  const wsUrl = `${protocol}//${host}`;

  console.log(`Conectando a WebSocket en: ${wsUrl}`);
  
  // Temporizador para activar modo offline si el servidor no responde rápido
  const connTimeout = setTimeout(() => {
    if (!state.ws || state.ws.readyState !== WebSocket.OPEN) {
      console.warn('El servidor no responde. Iniciando modo offline...');
      enableOfflineMode('Modo Local (Sin Servidor)');
    }
  }, 2000);

  try {
    state.ws = new WebSocket(wsUrl);

    state.ws.onopen = () => {
      clearTimeout(connTimeout);
      state.isOfflineMode = false;
      console.log('Conectado al servidor de sincronización.');
      statusBadge.innerHTML = '<span class="status-dot green"></span> En Línea';
      statusBadge.className = 'connection-badge';
      
      if (state.role === 'maestro') {
        requestSalesReport();
      }
    };

    state.ws.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data);
        console.log(`Mensaje recibido: ${type}`);

        switch (type) {
          case 'INITIAL_STATE':
            state.menu = payload.menu;
            state.tables = payload.tables;
            state.settings.taxRate = payload.settings.taxRate;
            state.settings.serviceRate = payload.settings.serviceRate;
            
            updateDashboardStats(payload.salesCount, payload.salesToday);
            renderTables();
            renderMenu();
            renderMenuEditor();
            renderLiveTablesStatus();
            
            if (state.activeTableId) {
              updateOrderPanel();
            }
            break;

          case 'TABLE_STATUS_UPDATE':
            state.tables = payload;
            renderTables();
            renderLiveTablesStatus();
            if (state.activeTableId) {
              updateOrderPanel();
            }
            break;

          case 'MENU_UPDATE':
            state.menu = payload;
            renderMenu();
            renderMenuEditor();
            break;

          case 'SALES_UPDATE':
            updateDashboardStats(payload.salesCount, payload.salesToday);
            break;

          case 'SALES_REPORT':
            state.salesHistory = payload;
            renderSalesHistory();
            break;

          case 'PAY_SUCCESS':
            alert(`Pago registrado con éxito. Ticket #${payload.id}`);
            prepareAndPrintTicket(payload);
            break;

          case 'ERROR':
            alert(`Error del Servidor: ${payload}`);
            break;
        }
      } catch (err) {
        console.error('Error al procesar mensaje de red:', err);
      }
    };

    state.ws.onclose = () => {
      clearTimeout(connTimeout);
      if (!state.isOfflineMode) {
        console.warn('Conexión cerrada. Intentando reconectar en 4 segundos...');
        statusBadge.innerHTML = '<span class="status-dot red"></span> Desconectado';
        setTimeout(connectWebSocket, 4000);
      }
    };

    state.ws.onerror = () => {
      // Si hay error de conexión, se gatillará el timeout para activar modo offline
    };

  } catch (e) {
    console.error('Error inicializando WebSocket:', e);
    enableOfflineMode('Modo Local (Error)');
  }
}

// Activar modo sin servidor persistiendo en localStorage localmente
function enableOfflineMode(reasonText) {
  state.isOfflineMode = true;
  const statusBadge = document.getElementById('connection-status');
  if (statusBadge) {
    statusBadge.innerHTML = `<span class="status-dot orange" style="background-color:#d87a24; box-shadow:0 0 6px #d87a24;"></span> ${reasonText}`;
  }
  
  console.log('--- MODO LOCAL ACTIVADO ---');
  
  // Cargar datos locales desde localStorage seguro o usar valores por defecto
  const localMenu = storage.getItem('local_menu');
  const localTables = storage.getItem('local_tables');
  const localSales = storage.getItem('local_sales');
  const localSettings = storage.getItem('local_settings');

  state.menu = localMenu ? JSON.parse(localMenu) : [...DEFAULT_MENU];
  state.tables = localTables ? JSON.parse(localTables) : [...DEFAULT_TABLES];
  state.salesHistory = localSales ? JSON.parse(localSales) : [];
  
  if (localSettings) {
    state.settings = JSON.parse(localSettings);
  } else {
    state.settings.masterPin = "1234";
    state.settings.taxRate = 0.16;
    state.settings.serviceRate = 0.10;
  }

  // Guardar para inicializar si estaba vacío
  saveLocalState();

  // Calcular estadísticas locales
  const salesToday = calculateSalesTodayLocal();
  updateDashboardStats(state.salesHistory.length, salesToday);

  // Renderizar
  renderTables();
  renderMenu();
  renderMenuEditor();
  renderLiveTablesStatus();
  renderSalesHistory();

  if (state.activeTableId) {
    updateOrderPanel();
  }
}

// Guardar estado en localStorage (Modo Offline)
function saveLocalState() {
  storage.setItem('local_menu', JSON.stringify(state.menu));
  storage.setItem('local_tables', JSON.stringify(state.tables));
  storage.setItem('local_sales', JSON.stringify(state.salesHistory));
  storage.setItem('local_settings', JSON.stringify(state.settings));
}

function calculateSalesTodayLocal() {
  const today = new Date().toISOString().split('T')[0];
  return state.salesHistory
    .filter(sale => sale.date && sale.date.startsWith(today))
    .reduce((sum, sale) => sum + sale.total, 0);
}

// Enviar comandos al servidor
function sendWSMessage(type, payload = {}) {
  if (state.isOfflineMode) {
    handleLocalAction(type, payload);
    return;
  }

  if (state.ws && state.ws.readyState === WebSocket.OPEN) {
    const pin = storage.sessionGet('pos_pin');
    state.ws.send(JSON.stringify({ type, payload, pin }));
  } else {
    console.warn('WebSocket desconectado. Acción redirigida a base local temporal.');
    handleLocalAction(type, payload);
  }
}

// Simular el backend localmente en el navegador
function handleLocalAction(type, payload) {
  console.log(`Acción Local Procesada: ${type}`);
  
  switch (type) {
    case 'ORDER_UPDATE': {
      const idx = state.tables.findIndex(t => t.id === payload.tableId);
      if (idx !== -1) {
        state.tables[idx].currentOrder = payload.currentOrder;
        state.tables[idx].status = payload.status;
        saveLocalState();
        renderTables();
        renderLiveTablesStatus();
        if (state.activeTableId === payload.tableId) {
          updateOrderPanel();
        }
      }
      break;
    }
    case 'PAY_ORDER': {
      const table = state.tables.find(t => t.id === payload.tableId);
      if (table && table.currentOrder) {
        const subtotal = table.currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal - (subtotal / (1 + state.settings.taxRate)); // IVA ya incluido
        const service = subtotal * state.settings.serviceRate; // Servicio sugerido
        const total = Math.max(0, subtotal - payload.discount); // No se suma el servicio por ser sugerido

        const newSale = {
          id: 'sale-loc-' + Date.now(),
          tableId: table.id,
          tableName: table.name,
          items: table.currentOrder.items,
          subtotal: subtotal,
          tax: tax,
          service: service,
          discount: payload.discount,
          total: total,
          paymentMethod: payload.paymentMethod,
          date: new Date().toISOString()
        };

        state.salesHistory.push(newSale);
        
        table.currentOrder = null;
        table.status = 'free';
        
        saveLocalState();

        renderTables();
        renderLiveTablesStatus();
        renderSalesHistory();
        
        const salesToday = calculateSalesTodayLocal();
        updateDashboardStats(state.salesHistory.length, salesToday);

        alert(`Cobro Local Registrado. Generando ticket...`);
        prepareAndPrintTicket(newSale);
        
        state.activeTableId = null;
        updateOrderPanel();
      }
      break;
    }
    case 'MENU_UPDATE': {
      state.menu = payload;
      saveLocalState();
      renderMenu();
      renderMenuEditor();
      break;
    }
    case 'GET_SALES_REPORT': {
      renderSalesHistory();
      break;
    }
  }
}

// ==========================================
// REGISTRO DE EVENTOS (LISTENERS)
// ==========================================
function setupEventListeners() {
  const roleCajero = document.getElementById('role-cajero-btn');
  const roleMaestro = document.getElementById('role-maestro-btn');
  const pinSection = document.getElementById('pin-section');
  const pinInput = document.getElementById('pin-input');
  
  if (roleCajero) {
    roleCajero.addEventListener('click', () => {
      roleCajero.classList.add('active');
      if (roleMaestro) roleMaestro.classList.remove('active');
      if (pinSection) pinSection.style.display = 'none';
      if (pinInput) pinInput.value = '';
    });
  }

  if (roleMaestro) {
    roleMaestro.addEventListener('click', () => {
      roleMaestro.classList.add('active');
      if (roleCajero) roleCajero.classList.remove('active');
      if (pinSection) pinSection.style.display = 'block';
      if (pinInput) pinInput.focus();
    });
  }

  const loginSubmit = document.getElementById('login-submit');
  if (loginSubmit) {
    console.log("Listener de login-submit adjuntado");
    loginSubmit.addEventListener('click', executeLogin);
  } else {
    console.warn("Elemento login-submit no encontrado en DOM");
  }
  
  if (pinInput) {
    pinInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') executeLogin();
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      storage.sessionClear();
      location.reload();
    });
  }

  const tabCart = document.getElementById('tab-cart');
  const tabMenu = document.getElementById('tab-menu');
  const tabContentCart = document.getElementById('tab-content-cart');
  const tabContentMenu = document.getElementById('tab-content-menu');

  if (tabCart) {
    tabCart.addEventListener('click', () => {
      tabCart.classList.add('active');
      if (tabMenu) tabMenu.classList.remove('active');
      if (tabContentCart) tabContentCart.classList.add('active');
      if (tabContentMenu) tabContentMenu.classList.remove('active');
    });
  }

  if (tabMenu) {
    tabMenu.addEventListener('click', () => {
      tabMenu.classList.add('active');
      if (tabCart) tabCart.classList.remove('active');
      if (tabContentMenu) tabContentMenu.classList.add('active');
      if (tabContentCart) tabContentCart.classList.remove('active');
    });
  }

  const menuCats = document.getElementById('menu-categories-list');
  if (menuCats) {
    menuCats.addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-cat-btn')) {
        document.querySelectorAll('.menu-cat-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        state.activeCategory = e.target.dataset.category;
        renderMenu();
      }
    });
  }

  const closeCustom = document.getElementById('btn-close-custom');
  if (closeCustom) {
    closeCustom.addEventListener('click', () => {
      document.getElementById('custom-modal').classList.remove('active');
    });
  }

  const qtyMinus = document.getElementById('btn-qty-minus');
  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      const input = document.getElementById('input-qty');
      let val = parseInt(input.value);
      if (val > 1) input.value = val - 1;
    });
  }

  const qtyPlus = document.getElementById('btn-qty-plus');
  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      const input = document.getElementById('input-qty');
      input.value = parseInt(input.value) + 1;
    });
  }

  const addToCartConfirm = document.getElementById('btn-add-to-cart-confirm');
  if (addToCartConfirm) {
    addToCartConfirm.addEventListener('click', confirmAddItemToOrder);
  }

  const printBill = document.getElementById('btn-print-bill');
  if (printBill) {
    printBill.addEventListener('click', () => {
      const activeTable = state.tables.find(t => t.id === state.activeTableId);
      if (activeTable && activeTable.currentOrder) {
        const subtotal = activeTable.currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal - (subtotal / (1 + state.settings.taxRate)); // IVA ya incluido
        const service = subtotal * state.settings.serviceRate; // Servicio sugerido
        const fakeSale = {
          id: 'PRE-CUENTA',
          tableName: activeTable.name,
          items: activeTable.currentOrder.items,
          subtotal: subtotal,
          tax: tax,
          service: service,
          discount: 0,
          total: subtotal, // El servicio no se suma al total por ser sugerido
          paymentMethod: 'Pre-Cuenta',
          date: new Date().toISOString()
        };
        prepareAndPrintTicket(fakeSale);
      }
    });
  }

  const checkoutBtn = document.getElementById('btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', openCheckoutModal);
  }

  const closeCheckout = document.getElementById('btn-close-checkout');
  if (closeCheckout) {
    closeCheckout.addEventListener('click', () => {
      document.getElementById('checkout-modal').classList.remove('active');
    });
  }

  const paymentMethods = document.querySelector('.payment-methods-grid');
  if (paymentMethods) {
    paymentMethods.addEventListener('click', (e) => {
      const card = e.target.closest('.pay-method-card');
      if (card) {
        document.querySelectorAll('.pay-method-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      }
    });
  }

  const chkDiscount = document.getElementById('chk-discount');
  if (chkDiscount) {
    chkDiscount.addEventListener('input', updateCheckoutModalTotals);
  }

  const confirmPayment = document.getElementById('btn-confirm-payment');
  if (confirmPayment) {
    confirmPayment.addEventListener('click', executePayment);
  }

  const maestroNav = document.querySelector('.maestro-navigation');
  if (maestroNav) {
    maestroNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.maestro-nav-btn');
      if (btn) {
        document.querySelectorAll('.maestro-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetTab = btn.dataset.tab;
        document.querySelectorAll('.maestro-tab-content').forEach(tab => tab.classList.remove('active'));
        const tabEl = document.getElementById(`maestro-tab-${targetTab}`);
        if (tabEl) tabEl.classList.add('active');

        if (targetTab === 'history') {
          requestSalesReport();
        }
      }
    });
  }

  const refreshHistory = document.getElementById('btn-refresh-history');
  if (refreshHistory) {
    refreshHistory.addEventListener('click', requestSalesReport);
  }
}

// ==========================================
// CONTROL DE ACCESO (LOGIN)
// ==========================================
function executeLogin() {
  console.log("ejecutando executeLogin...");
  const isMaestro = document.getElementById('role-maestro-btn').classList.contains('active');
  const errorMsg = document.getElementById('pin-error');
  if (errorMsg) errorMsg.style.display = 'none';

  if (!isMaestro) {
    console.log("Acceso como Cajero seleccionado");
    storage.sessionSet('pos_role', 'cajero');
    state.role = 'cajero';
    
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('app-screen').classList.add('active');
    updateUIForRole();
  } else {
    const pin = document.getElementById('pin-input').value;
    if (!pin) {
      alert('Por favor ingresa tu PIN de 4 dígitos.');
      return;
    }

    if (state.isOfflineMode) {
      if (pin === state.settings.masterPin) {
        storage.sessionSet('pos_role', 'maestro');
        storage.sessionSet('pos_token', 'local-token-offline');
        storage.sessionSet('pos_pin', pin);
        state.role = 'maestro';
        state.token = 'local-token-offline';
        
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('app-screen').classList.add('active');
        updateUIForRole();
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
        document.getElementById('pin-input').value = '';
        document.getElementById('pin-input').focus();
      }
    } else {
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      })
      .then(res => {
        if (!res.ok) throw new Error('PIN incorrecto');
        return res.json();
      })
      .then(data => {
        storage.sessionSet('pos_role', 'maestro');
        storage.sessionSet('pos_token', data.token);
        storage.sessionSet('pos_pin', pin);
        state.role = 'maestro';
        state.token = data.token;
        
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('app-screen').classList.add('active');
        updateUIForRole();
        requestSalesReport();
      })
      .catch(err => {
        if (errorMsg) errorMsg.style.display = 'block';
        document.getElementById('pin-input').value = '';
        document.getElementById('pin-input').focus();
      });
    }
  }
}

// Adaptar la interfaz visual dependiendo del rol activo
function updateUIForRole() {
  const cajeroView = document.getElementById('cajero-view');
  const maestroView = document.getElementById('maestro-view');
  const roleLabel = document.getElementById('user-role-label');
  const viewTitle = document.getElementById('view-title');

  if (state.role === 'maestro') {
    if (cajeroView) cajeroView.classList.remove('active');
    if (maestroView) maestroView.classList.add('active');
    if (roleLabel) roleLabel.textContent = 'Maestro';
    if (viewTitle) viewTitle.textContent = 'Panel de Administración (Casa)';
    
    if (state.isOfflineMode) {
      renderSalesHistory();
    } else {
      requestSalesReport();
    }
  } else {
    if (maestroView) maestroView.classList.remove('active');
    if (cajeroView) cajeroView.classList.add('active');
    if (roleLabel) roleLabel.textContent = 'Cajero';
    if (viewTitle) viewTitle.textContent = 'Punto de Venta (Local)';
  }
}

// Solicitar reporte de ventas (Maestro)
function requestSalesReport() {
  sendWSMessage('GET_SALES_REPORT');
}

// ==========================================
// RENDERIZADO: MAPA DE MESAS (CAJERO)
// ==========================================
function renderTables() {
  const container = document.getElementById('tables-container');
  if (!container) return;
  container.innerHTML = '';

  state.tables.forEach(table => {
    const card = document.createElement('div');
    card.className = `table-card ${table.status}`;
    if (state.activeTableId === table.id) {
      card.classList.add('active-selection');
    }
    
    let amount = '$0.00';
    if (table.currentOrder && table.currentOrder.items.length > 0) {
      const sub = table.currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      amount = formatCurrency(sub);
    }

    const statusText = table.status === 'free' ? 'Libre' : table.status === 'occupied' ? 'Ocupada' : 'Por Cobrar';

    card.innerHTML = `
      <div class="table-number">${table.name}</div>
      <div class="table-status-label">${statusText}</div>
      <div class="table-amount">${amount}</div>
    `;

    card.addEventListener('click', () => selectTable(table.id));
    container.appendChild(card);
  });
}

// Seleccionar una mesa
function selectTable(tableId) {
  state.activeTableId = tableId;
  
  document.querySelectorAll('.table-card').forEach((card, index) => {
    if (state.tables[index].id === tableId) {
      card.classList.add('active-selection');
    } else {
      card.classList.remove('active-selection');
    }
  });

  const orderBody = document.getElementById('order-body-container');
  if (orderBody) orderBody.classList.remove('disabled');
  
  const tabCart = document.getElementById('tab-cart');
  if (tabCart) tabCart.click();

  updateOrderPanel();
}

// Actualizar panel lateral de la orden de la mesa seleccionada
function updateOrderPanel() {
  const table = state.tables.find(t => t.id === state.activeTableId);
  const headerInfo = document.getElementById('order-header-info');
  
  if (!table) {
    if (headerInfo) headerInfo.innerHTML = `<h3>Selecciona una mesa para iniciar</h3>`;
    const orderBody = document.getElementById('order-body-container');
    if (orderBody) orderBody.classList.add('disabled');
    return;
  }

  const statusStr = table.status === 'free' ? 'Nueva Cuenta' : table.status === 'occupied' ? 'Consumo Activo' : 'Pidiendo Ticket';
  if (headerInfo) {
    headerInfo.innerHTML = `
      <h3>${table.name}</h3>
      <div class="order-meta">Estado: <strong>${statusStr}</strong></div>
    `;
  }

  const cartList = document.getElementById('cart-items-list');
  if (!cartList) return;
  cartList.innerHTML = '';

  const printBill = document.getElementById('btn-print-bill');
  const checkoutBtn = document.getElementById('btn-checkout');

  if (!table.currentOrder || table.currentOrder.items.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart-message">
        <i class="fa-solid fa-utensils"></i>
        <p>El pedido está vacío.<br>Agrega platillos del menú en la pestaña de arriba.</p>
      </div>
    `;
    
    if (printBill) printBill.disabled = true;
    if (checkoutBtn) checkoutBtn.disabled = true;

    document.getElementById('cart-subtotal').textContent = '$0.00';
    document.getElementById('cart-tax').textContent = '$0.00';
    document.getElementById('cart-service').textContent = '$0.00';
    document.getElementById('cart-total').textContent = '$0.00';
  } else {
    if (printBill) printBill.disabled = false;
    if (checkoutBtn) checkoutBtn.disabled = false;

    table.currentOrder.items.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      
      const optionsHtml = item.options && item.options.length > 0
        ? `<div class="cart-item-options">+ ${item.options.join(', ')}</div>`
        : '';
        
      const notesHtml = item.notes
        ? `<div class="cart-item-notes"><i class="fa-solid fa-comment-dots"></i> ${item.notes}</div>`
        : '';

      itemEl.innerHTML = `
        <div class="cart-item-header">
          <span class="cart-item-title">${item.name}</span>
          <span class="cart-item-price">${formatCurrency(item.price * item.quantity)}</span>
        </div>
        ${optionsHtml}
        ${notesHtml}
        <div class="cart-item-footer">
          <span class="cart-item-qty">Cant: <strong>${item.quantity}</strong> (c/u ${formatCurrency(item.price)})</span>
          <div class="cart-item-actions">
            <button onclick="adjustItemQuantity(${index}, 1)"><i class="fa-solid fa-plus-circle"></i></button>
            <button onclick="adjustItemQuantity(${index}, -1)"><i class="fa-solid fa-minus-circle"></i></button>
            <button onclick="removeItemFromOrder(${index})"><i class="fa-solid fa-trash-can"></i> Quitar</button>
          </div>
        </div>
      `;
      cartList.appendChild(itemEl);
    });

    const subtotal = table.currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal - (subtotal / (1 + state.settings.taxRate)); // IVA ya incluido
    const service = subtotal * state.settings.serviceRate; // Servicio del 10% sugerido
    const total = subtotal; // No sumamos el servicio al total por ser sugerido

    document.getElementById('cart-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('cart-tax').textContent = formatCurrency(tax);
    document.getElementById('cart-service').textContent = formatCurrency(service);
    document.getElementById('cart-total').textContent = formatCurrency(total);
  }
}

// ==========================================
// CONTROL DE ÓRDENES Y CATALOGO
// ==========================================
function renderMenu() {
  const container = document.getElementById('menu-items-container');
  if (!container) return;
  container.innerHTML = '';

  const filteredMenu = state.activeCategory === 'all'
    ? state.menu
    : state.menu.filter(item => item.category === state.activeCategory);

  filteredMenu.forEach(item => {
    if (!item.available) return;

    const card = document.createElement('div');
    card.className = 'menu-item-card';
    card.innerHTML = `
      <div class="menu-item-info">
        <div class="menu-item-name">${item.name}</div>
        <div class="menu-item-vietname">${item.vietName}</div>
        <div class="menu-item-desc">${item.description}</div>
      </div>
      <div class="menu-item-price-tag">${formatCurrency(item.price)}</div>
    `;

    card.addEventListener('click', () => openCustomModal(item));
    container.appendChild(card);
  });
}

function openCustomModal(item) {
  state.selectedItemToAdd = item;
  
  document.getElementById('modal-item-name').innerHTML = `${item.name} <span class="viet-tag">${item.vietName}</span>`;
  document.getElementById('modal-item-desc').textContent = item.description;
  document.getElementById('modal-item-price').textContent = formatCurrency(item.price);
  
  document.getElementById('input-qty').value = 1;
  document.getElementById('input-item-notes').value = '';
  
  const optionsContainer = document.getElementById('modal-item-options');
  if (!optionsContainer) return;
  optionsContainer.innerHTML = '';
  
  if (item.options && item.options.length > 0) {
    item.options.forEach((opt, idx) => {
      const label = document.createElement('label');
      label.className = 'option-checkbox-wrapper';
      label.innerHTML = `
        <input type="checkbox" value="${opt}" id="opt-${idx}">
        <span>${opt}</span>
      `;
      optionsContainer.appendChild(label);
    });
  } else {
    optionsContainer.innerHTML = '<p class="text-muted" style="font-size:12px; font-style:italic;">No requiere opciones adicionales.</p>';
  }

  const modal = document.getElementById('custom-modal');
  if (modal) modal.classList.add('active');
}

function confirmAddItemToOrder() {
  const item = state.selectedItemToAdd;
  if (!item) return;

  const quantity = parseInt(document.getElementById('input-qty').value);
  const notes = document.getElementById('input-item-notes').value.trim();
  
  const selectedOptions = [];
  let priceAdjust = 0;
  
  if (item.options && item.options.length > 0) {
    item.options.forEach((opt, idx) => {
      const chk = document.getElementById(`opt-${idx}`);
      if (chk && chk.checked) {
        selectedOptions.push(opt);
        
        const extraMatch = opt.match(/\(+\$([0-9]+)\)/);
        if (extraMatch && extraMatch[1]) {
          priceAdjust += parseFloat(extraMatch[1]);
        }
      }
    });
  }

  const finalItemPrice = item.price + priceAdjust;
  const table = state.tables.find(t => t.id === state.activeTableId);
  if (!table) return;

  if (!table.currentOrder) {
    table.currentOrder = { items: [] };
  }

  table.currentOrder.items.push({
    productId: item.id,
    name: item.name,
    price: finalItemPrice,
    quantity: quantity,
    options: selectedOptions,
    notes: notes
  });

  const newStatus = table.status === 'free' ? 'occupied' : table.status;

  sendWSMessage('ORDER_UPDATE', {
    tableId: table.id,
    currentOrder: table.currentOrder,
    status: newStatus
  });

  const modal = document.getElementById('custom-modal');
  if (modal) modal.classList.remove('active');
  const tabCart = document.getElementById('tab-cart');
  if (tabCart) tabCart.click();
}

function adjustItemQuantity(index, amount) {
  const table = state.tables.find(t => t.id === state.activeTableId);
  if (!table || !table.currentOrder) return;

  const item = table.currentOrder.items[index];
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    table.currentOrder.items.splice(index, 1);
  }
  
  sendWSMessage('ORDER_UPDATE', {
    tableId: table.id,
    currentOrder: table.currentOrder,
    status: table.currentOrder.items.length === 0 ? 'free' : table.status
  });
}

function removeItemFromOrder(index) {
  adjustItemQuantity(index, -99999);
}

// ==========================================
// REGISTRO DE PAGOS / COBROS (CHECKOUT)
// ==========================================
function openCheckoutModal() {
  const table = state.tables.find(t => t.id === state.activeTableId);
  if (!table || !table.currentOrder) return;

  document.getElementById('chk-table-name').textContent = table.name;
  
  const subtotal = table.currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal - (subtotal / (1 + state.settings.taxRate)); // IVA ya incluido
  const service = subtotal * state.settings.serviceRate; // Servicio del 10% sugerido

  document.getElementById('chk-subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('chk-tax').textContent = formatCurrency(tax);
  document.getElementById('chk-service').textContent = formatCurrency(service);
  document.getElementById('chk-discount').value = 0;
  document.getElementById('chk-total').textContent = formatCurrency(subtotal); // No sumamos el servicio por ser sugerido

  document.querySelectorAll('.pay-method-card').forEach(c => c.classList.remove('active'));
  const defaultPay = document.querySelector('.pay-method-card[data-method="cash"]');
  if (defaultPay) defaultPay.classList.add('active');

  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('active');
}

function updateCheckoutModalTotals() {
  const table = state.tables.find(t => t.id === state.activeTableId);
  if (!table || !table.currentOrder) return;

  const subtotal = table.currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discount = parseFloat(document.getElementById('chk-discount').value) || 0;
  if (discount < 0) discount = 0;

  const total = Math.max(0, subtotal - discount); // El servicio no se suma por ser sugerido
  document.getElementById('chk-total').textContent = formatCurrency(total);
}

function executePayment() {
  const table = state.tables.find(t => t.id === state.activeTableId);
  if (!table || !table.currentOrder) return;

  const activePayMethodCard = document.querySelector('.pay-method-card.active');
  const paymentMethod = activePayMethodCard ? activePayMethodCard.dataset.method : 'cash';
  const discount = parseFloat(document.getElementById('chk-discount').value) || 0;

  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');

  sendWSMessage('PAY_ORDER', {
    tableId: table.id,
    paymentMethod: paymentMethod,
    discount: discount
  });
}

// ==========================================
// PREPARACIÓN E IMPRESIÓN DEL TICKET (80mm)
// ==========================================
function prepareAndPrintTicket(sale) {
  const idToPrint = sale.id.startsWith('sale-') ? sale.id.substring(5, 13).toUpperCase() : sale.id;
  document.getElementById('print-ticket-id').textContent = idToPrint;
  document.getElementById('print-ticket-date').textContent = new Date(sale.date).toLocaleString('es-MX');
  document.getElementById('print-ticket-table').textContent = sale.tableName || `Mesa ${sale.tableId}`;
  
  const paymentText = sale.paymentMethod === 'cash' ? 'Efectivo'
                      : sale.paymentMethod === 'card' ? 'Tarjeta Bancaria'
                      : sale.paymentMethod === 'qr' ? 'QR Móvil / SPEI'
                      : sale.paymentMethod;
  document.getElementById('print-pay-method').textContent = paymentText;

  const itemsContainer = document.getElementById('print-ticket-items');
  if (!itemsContainer) return;
  itemsContainer.innerHTML = '';

  sale.items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'print-item-row';
    
    const mods = item.options && item.options.length > 0 ? ` (+${item.options.join(', ')})` : '';
    const noteStr = item.notes ? ` [Nota: ${item.notes}]` : '';

    row.innerHTML = `
      <span class="print-qty">${item.quantity}x</span>
      <div class="print-item-details">
        <span class="print-item-name">${item.name}</span>
        <span class="print-item-mods">${mods}${noteStr}</span>
      </div>
      <span class="print-price">${formatCurrency(item.price * item.quantity)}</span>
    `;
    itemsContainer.appendChild(row);
  });

  document.getElementById('print-subtotal').textContent = formatCurrency(sale.subtotal);
  document.getElementById('print-tax').textContent = formatCurrency(sale.tax);
  document.getElementById('print-service').textContent = formatCurrency(sale.service);
  
  const discRow = document.getElementById('print-discount-row');
  if (sale.discount > 0) {
    if (discRow) discRow.style.display = 'flex';
    document.getElementById('print-discount').textContent = `-${formatCurrency(sale.discount)}`;
  } else {
    if (discRow) discRow.style.display = 'none';
  }
  
  document.getElementById('print-total').textContent = formatCurrency(sale.total);

  setTimeout(() => {
    window.print();
  }, 350);
}

// ==========================================
// VISTA MAESTRO: PANEL DE CONTROL EN CASA
// ==========================================
function updateDashboardStats(count, salesToday) {
  const countEl = document.getElementById('dashboard-sales-count');
  const salesEl = document.getElementById('dashboard-sales-today');
  const avgEl = document.getElementById('dashboard-avg-ticket');
  
  if (countEl) countEl.textContent = count;
  if (salesEl) salesEl.textContent = formatCurrency(salesToday);
  
  if (avgEl) {
    const avg = count > 0 ? salesToday / count : 0;
    avgEl.textContent = formatCurrency(avg);
  }
}

function renderLiveTablesStatus() {
  const container = document.getElementById('live-tables-status-list');
  if (!container) return;
  container.innerHTML = '';

  state.tables.forEach(table => {
    const row = document.createElement('div');
    row.className = 'live-table-row';
    
    let totalText = '$0.00';
    if (table.currentOrder && table.currentOrder.items.length > 0) {
      const sub = table.currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = sub * state.settings.taxRate;
      const serv = sub * state.settings.serviceRate;
      totalText = formatCurrency(sub + tax + serv);
    }

    const statusClass = table.status;
    const statusText = table.status === 'free' ? 'Libre' : table.status === 'occupied' ? 'Ocupada' : 'Pidiendo Cuenta';

    row.innerHTML = `
      <div class="live-table-info">
        <h4>${table.name}</h4>
        <span class="${statusClass}">${statusText}</span>
      </div>
      <div class="live-table-total">${totalText}</div>
    `;
    container.appendChild(row);
  });
}

function renderMenuEditor() {
  const container = document.getElementById('menu-editor-rows');
  if (!container) return;
  container.innerHTML = '';

  state.menu.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'menu-editor-row';
    
    const catLabels = {
      banhmi: 'Bánh Mì',
      pho: 'Phở',
      entradas: 'Khai Vị (Entradas)',
      bebidas: 'Bebidas'
    };
    const catText = catLabels[item.category] || item.category;

    row.innerHTML = `
      <div class="platillo-detail">
        <span class="p-name">${item.name}</span>
        <span class="p-viet">${item.vietName}</span>
      </div>
      <span>${catText}</span>
      <div>
        <input type="number" value="${item.price}" min="0" step="1" id="price-input-${index}">
      </div>
      <div>
        <label class="switch">
          <input type="checkbox" ${item.available ? 'checked' : ''} id="avail-check-${index}">
          <span class="slider"></span>
        </label>
      </div>
      <div>
        <button class="btn btn-primary" onclick="saveMenuItemChanges(${index})" style="padding: 6px 12px; font-size:11px;">
          <i class="fa-solid fa-save"></i> Guardar
        </button>
      </div>
    `;
    container.appendChild(row);
  });
}

window.saveMenuItemChanges = function(index) {
  const priceVal = parseFloat(document.getElementById(`price-input-${index}`).value);
  const availVal = document.getElementById(`avail-check-${index}`).checked;

  if (isNaN(priceVal) || priceVal < 0) {
    alert('Precio inválido.');
    return;
  }

  state.menu[index].price = priceVal;
  state.menu[index].available = availVal;

  sendWSMessage('MENU_UPDATE', state.menu);
  alert('Menú guardado y sincronizado.');
};

function renderSalesHistory() {
  const container = document.getElementById('history-rows');
  if (!container) return;
  container.innerHTML = '';

  if (state.salesHistory.length === 0) {
    container.innerHTML = `<div class="empty-history">No se han registrado ventas el día de hoy.</div>`;
    return;
  }

  const sortedSales = [...state.salesHistory].sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedSales.forEach(sale => {
    const row = document.createElement('div');
    row.className = 'history-row';
    
    const idToPrint = sale.id.startsWith('sale-') ? sale.id.substring(5, 13).toUpperCase() : sale.id;
    const dateFormatted = new Date(sale.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const discText = sale.discount > 0 ? `-${formatCurrency(sale.discount)}` : '$0.00';

    row.innerHTML = `
      <strong>#${idToPrint}</strong>
      <span>${dateFormatted}</span>
      <span>Mesa ${sale.tableId}</span>
      <div><span class="method-badge ${sale.paymentMethod}">${sale.paymentMethod}</span></div>
      <span style="color:#e74c3c;">${discText}</span>
      <strong style="color:#2ecc71;">${formatCurrency(sale.total)}</strong>
    `;
    container.appendChild(row);
  });
}

// ==========================================
// UTILERÍAS / HELPERS
// ==========================================
function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value);
}
