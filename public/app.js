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
  categories: [],      // Categorías de menú
  selectedTips: [],    // Propinas seleccionadas en la calculadora
  settings: {
    taxRate: 0.16,
    serviceRate: 0.15,
    masterPin: "19042609"
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
            state.categories = payload.categories || [];
            state.tables = payload.tables;
            state.settings.taxRate = payload.settings.taxRate;
            state.settings.serviceRate = payload.settings.serviceRate;
            state.settings.defaultInitialCash = payload.settings.defaultInitialCash || 1000;
            state.activeShift = payload.activeShift;
            state.expenses = payload.expenses || [];
            state.closedShifts = payload.closedShifts || [];
            
            // Rellenar inputs de ajustes
            const inputDefaultInitialCash = document.getElementById('setting-default-initial-cash');
            if (inputDefaultInitialCash) {
              inputDefaultInitialCash.value = state.settings.defaultInitialCash;
            }
            const inputNextInitialCash = document.getElementById('next-initial-cash');
            if (inputNextInitialCash) {
              inputNextInitialCash.value = state.settings.defaultInitialCash;
            }

            updateDashboardStats(payload.salesCount, payload.salesToday);
            renderTables();
            renderCategoryTabs();
            populateCategoryDropdowns();
            renderCategoryEditor();
            renderMenu();
            renderMenuEditor();
            renderLiveTablesStatus();
            renderExpenses();
            renderShiftBalance();
            renderFinancialReports();
            
            if (state.activeTableId) {
              updateOrderPanel();
            }
            break;

          case 'SETTINGS_UPDATE':
            if (payload.settings) {
              state.settings = { ...state.settings, ...payload.settings };
            }
            if (payload.activeShift) {
              state.activeShift = payload.activeShift;
            }
            const settingInput = document.getElementById('setting-default-initial-cash');
            if (settingInput) {
              settingInput.value = state.settings.defaultInitialCash;
            }
            const nextInput = document.getElementById('next-initial-cash');
            if (nextInput) {
              nextInput.value = state.settings.defaultInitialCash;
            }
            renderShiftBalance();
            alert('Ajustes guardados y sincronizados con éxito.');
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

          case 'CATEGORIES_UPDATE':
            state.categories = payload;
            renderCategoryTabs();
            populateCategoryDropdowns();
            renderCategoryEditor();
            renderMenuEditor();
            break;

          case 'SALES_UPDATE':
            updateDashboardStats(payload.salesCount, payload.salesToday);
            break;

          case 'SALES_REPORT':
            state.salesHistory = payload.sales || [];
            state.expenses = payload.expenses || [];
            state.closedShifts = payload.closedShifts || [];
            renderSalesHistory();
            renderShiftBalance();
            renderFinancialReports();
            if (document.getElementById('maestro-tab-replenishment') && document.getElementById('maestro-tab-replenishment').classList.contains('active')) {
              renderReplenishmentReport();
            }
            break;

          case 'EXPENSES_UPDATE':
            state.expenses = payload;
            renderExpenses();
            renderShiftBalance();
            renderFinancialReports();
            break;

          case 'SHIFT_STATE_UPDATE':
            state.activeShift = payload.activeShift;
            state.expenses = payload.expenses || [];
            state.closedShifts = payload.closedShifts || [];
            state.salesHistory = payload.sales || [];
            
            renderExpenses();
            renderShiftBalance();
            renderFinancialReports();
            renderSalesHistory();
            
            // Update shift labels in UI
            document.getElementById('caja-shift-name').textContent = state.activeShift.name;
            document.getElementById('caja-shift-start').textContent = new Date(state.activeShift.startedAt).toLocaleTimeString();
            document.getElementById('caja-shift-initial').textContent = `$${state.activeShift.initialCash.toFixed(2)}`;
            break;

          case 'SALES_LIST_UPDATE':
            state.salesHistory = payload;
            renderSalesHistory();
            renderShiftBalance();
            renderFinancialReports();
            if (document.getElementById('maestro-tab-replenishment') && document.getElementById('maestro-tab-replenishment').classList.contains('active')) {
              renderReplenishmentReport();
            }
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
  const localCategories = storage.getItem('local_categories');
  const localTables = storage.getItem('local_tables');
  const localSales = storage.getItem('local_sales');
  const localSettings = storage.getItem('local_settings');
  const localExpenses = storage.getItem('local_expenses');
  const localClosedShifts = storage.getItem('local_closedShifts');

  state.menu = localMenu ? JSON.parse(localMenu) : [...DEFAULT_MENU];
  state.categories = localCategories ? JSON.parse(localCategories) : [
    { id: "banhmi", name: "Bánh Mì" },
    { id: "pho", name: "Phở" },
    { id: "entradas", name: "Khai Vị (Entradas)" },
    { id: "bebidas", name: "Bebidas" }
  ];
  state.tables = localTables ? JSON.parse(localTables) : [...DEFAULT_TABLES];
  state.salesHistory = localSales ? JSON.parse(localSales) : [];
  state.expenses = localExpenses ? JSON.parse(localExpenses) : [];
  state.closedShifts = localClosedShifts ? JSON.parse(localClosedShifts) : [];
  
  if (localSettings) {
    state.settings = JSON.parse(localSettings);
  } else {
    state.settings.masterPin = "19042609";
    state.settings.taxRate = 0.16;
    state.settings.serviceRate = 0.15;
  }

  // Guardar para inicializar si estaba vacío
  saveLocalState();

  // Calcular estadísticas locales
  const salesToday = calculateSalesTodayLocal();
  updateDashboardStats(state.salesHistory.length, salesToday);

  // Renderizar
  renderTables();
  renderCategoryTabs();
  populateCategoryDropdowns();
  renderCategoryEditor();
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
  storage.setItem('local_categories', JSON.stringify(state.categories));
  storage.setItem('local_tables', JSON.stringify(state.tables));
  storage.setItem('local_sales', JSON.stringify(state.salesHistory));
  storage.setItem('local_settings', JSON.stringify(state.settings));
  storage.setItem('local_expenses', JSON.stringify(state.expenses || []));
  storage.setItem('local_closedShifts', JSON.stringify(state.closedShifts || []));
}

function calculateSalesTodayLocal() {
  const today = new Date().toISOString().split('T')[0];
  return state.salesHistory
    .filter(sale => sale.date && sale.date.startsWith(today))
    .reduce((sum, sale) => sum + sale.total, 0);
}

// Enviar comandos al servidor
function sendWSMessage(type, payload = {}, overridePin = null) {
  if (state.isOfflineMode) {
    handleLocalAction(type, payload);
    return;
  }

  if (state.ws && state.ws.readyState === WebSocket.OPEN) {
    const pin = overridePin || storage.sessionGet('pos_pin');
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
    case 'UPDATE_HISTORICAL_DATA': {
      const { target, id, updatedRecord } = payload;
      if (target === 'sales') {
        const idx = state.salesHistory.findIndex(s => s.id === id);
        if (idx !== -1) {
          state.salesHistory[idx] = { ...state.salesHistory[idx], ...updatedRecord };
        }
      } else if (target === 'expenses') {
        const idx = state.expenses.findIndex(e => e.id === id);
        if (idx !== -1) {
          state.expenses[idx] = { ...state.expenses[idx], ...updatedRecord };
        }
      } else if (target === 'closedShifts') {
        const idx = state.closedShifts.findIndex(c => c.id === id);
        if (idx !== -1) {
          state.closedShifts[idx] = { ...state.closedShifts[idx], ...updatedRecord };
        }
      }
      saveLocalState();
      renderExpenses();
      renderShiftBalance();
      renderFinancialReports();
      break;
    }
    case 'DELETE_HISTORICAL_DATA': {
      const { target, id } = payload;
      if (target === 'sales') {
        state.salesHistory = state.salesHistory.filter(s => s.id !== id);
      } else if (target === 'expenses') {
        state.expenses = state.expenses.filter(e => e.id !== id);
      } else if (target === 'closedShifts') {
        state.closedShifts = state.closedShifts.filter(c => c.id !== id);
      }
      saveLocalState();
      renderExpenses();
      renderShiftBalance();
      renderFinancialReports();
      break;
    }
    case 'ADD_HISTORICAL_RECORD': {
      const { target, record } = payload;
      if (target === 'closedShifts') {
        state.closedShifts.push(record);
      }
      saveLocalState();
      renderFinancialReports();
      break;
    }
    case 'DELETE_EXPENSE': {
      state.expenses = state.expenses.filter(e => e.id !== payload.id);
      saveLocalState();
      renderExpenses();
      renderShiftBalance();
      renderFinancialReports();
      break;
    }
    case 'ORDER_UPDATE': {
      const idx = state.tables.findIndex(t => t.id === payload.tableId);
      if (idx !== -1) {
        const oldOrder = state.tables[idx].currentOrder;
        if (payload.currentOrder && (!oldOrder || !oldOrder.items || oldOrder.items.length === 0)) {
          payload.currentOrder.shiftOpened = state.activeShift ? state.activeShift.name : 'Matutino';
        } else if (payload.currentOrder) {
          payload.currentOrder.shiftOpened = (oldOrder && oldOrder.shiftOpened) || (state.activeShift ? state.activeShift.name : 'Matutino');
        }
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
          tip: Number(payload.tip || 0),
          tipPaymentMethod: payload.tipPaymentMethod || 'cash',
          shift: state.activeShift ? state.activeShift.name : 'Matutino',
          shiftStartedAt: state.activeShift ? state.activeShift.startedAt : new Date().toISOString(),
          openedInShift: table.currentOrder.shiftOpened || (state.activeShift ? state.activeShift.name : 'Matutino'),
          closed: false,
          date: new Date().toISOString()
        };

        state.salesHistory.push(newSale);
        
        table.currentOrder = null;
        table.status = 'free';
        
        saveLocalState();

        renderTables();
        renderLiveTablesStatus();
        renderSalesHistory();
        renderShiftBalance();
        renderFinancialReports();
        
        const salesToday = calculateSalesTodayLocal();
        updateDashboardStats(state.salesHistory.length, salesToday);

        alert(`Cobro Local Registrado. Generando ticket...`);
        prepareAndPrintTicket(newSale);
        
        state.activeTableId = null;
        updateOrderPanel();
      }
      break;
    }
    case 'ADD_EXPENSE': {
      const newExpense = {
        id: 'expense-loc-' + Date.now(),
        description: payload.description,
        amount: Number(payload.amount),
        shift: state.activeShift.name,
        shiftStartedAt: state.activeShift.startedAt,
        closed: false,
        date: new Date().toISOString()
      };
      if (!state.expenses) state.expenses = [];
      state.expenses.push(newExpense);
      saveLocalState();
      renderExpenses();
      renderShiftBalance();
      renderFinancialReports();
      break;
    }
    case 'CLOSE_SHIFT': {
      if (!state.expenses) state.expenses = [];
      if (!state.closedShifts) state.closedShifts = [];
      
      const currentSales = state.salesHistory.filter(s => !s.closed && s.shift === state.activeShift.name);
      const currentExpenses = state.expenses.filter(e => !e.closed && e.shift === state.activeShift.name);

      const cashSales = currentSales.filter(s => s.paymentMethod === 'cash').reduce((sum, s) => sum + s.total, 0);
      const cardSales = currentSales.filter(s => s.paymentMethod === 'card').reduce((sum, s) => sum + s.total, 0);
      const qrSales = currentSales.filter(s => s.paymentMethod === 'qr').reduce((sum, s) => sum + s.total, 0);
      
      const cashTips = currentSales.filter(s => s.tipPaymentMethod === 'cash').reduce((sum, s) => sum + s.tip, 0);
      const cardTips = currentSales.filter(s => s.tipPaymentMethod === 'card').reduce((sum, s) => sum + s.tip, 0);
      
      const totalExpenses = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
      const totalSales = cashSales + cardSales + qrSales;
      const totalTips = cashTips + cardTips;
      
      const crossShiftTipsOut = currentSales.filter(s => s.openedInShift && s.openedInShift !== state.activeShift.name).reduce((sum, s) => sum + s.tip * 0.5, 0);
      const activeShiftTips = Math.max(0, totalTips - crossShiftTipsOut);

      const expectedCash = state.activeShift.initialCash + cashSales + cashTips - totalExpenses;

      const shiftReport = {
        id: 'shift-loc-' + Date.now(),
        name: state.activeShift.name,
        startedAt: state.activeShift.startedAt,
        closedAt: new Date().toISOString(),
        initialCash: state.activeShift.initialCash,
        cashSales,
        cardSales,
        qrSales,
        totalSales,
        cashTips,
        cardTips,
        totalTips,
        crossShiftTipsOut,
        tipCocina: activeShiftTips * 0.5,
        tipMeseros: activeShiftTips * 0.5,
        totalExpenses,
        expectedCash,
        salesCount: currentSales.length,
        expenses: currentExpenses,
        sales: currentSales
      };

      state.closedShifts.push(shiftReport);

      state.salesHistory.forEach(s => {
        if (!s.closed && s.shift === state.activeShift.name) s.closed = true;
      });
      state.expenses.forEach(e => {
        if (!e.closed && e.shift === state.activeShift.name) e.closed = true;
      });

      // Nuevo turno automático
      const nextShiftName = (new Date().getHours() >= 16 && new Date().getHours() < 22) ? "Vespertino" : "Matutino";
      state.activeShift = {
        name: nextShiftName,
        startedAt: new Date().toISOString(),
        initialCash: expectedCash // Rollover automático del efectivo final esperado
      };

      saveLocalState();
      
      renderExpenses();
      renderShiftBalance();
      renderFinancialReports();
      renderSalesHistory();
      
      // Actualizar UI del turno
      document.getElementById('caja-shift-name').textContent = state.activeShift.name;
      document.getElementById('caja-shift-start').textContent = new Date(state.activeShift.startedAt).toLocaleTimeString();
      document.getElementById('caja-shift-initial').textContent = `$${state.activeShift.initialCash.toFixed(2)}`;
      
      alert("Turno cerrado localmente con éxito.");
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
    case 'UPDATE_SETTINGS': {
      state.settings.defaultInitialCash = Number(payload.defaultInitialCash || 1000);
      // Siempre actualizar la caja inicial del turno activo actual para reflejar el cambio de inmediato
      if (state.activeShift) {
        state.activeShift.initialCash = state.settings.defaultInitialCash;
      }
      saveLocalState();

      const inputDefault = document.getElementById('setting-default-initial-cash');
      if (inputDefault) inputDefault.value = state.settings.defaultInitialCash;
      const inputNext = document.getElementById('next-initial-cash');
      if (inputNext) inputNext.value = state.settings.defaultInitialCash;

      renderShiftBalance();
      alert('Ajustes guardados localmente.');
      break;
    }
    case 'CATEGORIES_UPDATE': {
      state.categories = payload;
      saveLocalState();
      renderCategoryTabs();
      populateCategoryDropdowns();
      renderCategoryEditor();
      renderMenuEditor();
      alert('Categorías actualizadas localmente.');
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

        if (targetTab === 'history' || targetTab === 'financial-reports' || targetTab === 'replenishment') {
          requestSalesReport();
          if (targetTab === 'replenishment') {
            setTimeout(renderReplenishmentReport, 100);
          }
        }
      }
    });
  }

  const refreshHistory = document.getElementById('btn-refresh-history');
  if (refreshHistory) {
    refreshHistory.addEventListener('click', requestSalesReport);
  }

  const btnAddManualShift = document.getElementById('btn-add-manual-shift');
  if (btnAddManualShift) {
    btnAddManualShift.addEventListener('click', () => {
      const dateVal = document.getElementById('manual-shift-date').value;
      if (!dateVal) {
        alert('Por favor selecciona una fecha.');
        return;
      }

      const name = document.getElementById('manual-shift-name').value;
      const initialCash = parseFloat(document.getElementById('manual-shift-initial').value || '0');
      const cashSales = parseFloat(document.getElementById('manual-shift-cashsales').value || '0');
      const cardSales = parseFloat(document.getElementById('manual-shift-cardsales').value || '0');
      const totalTips = parseFloat(document.getElementById('manual-shift-totaltips').value || '0');
      const totalExpenses = parseFloat(document.getElementById('manual-shift-expenses').value || '0');

      // Create closedAt timestamp (set to 18:00 of selected date)
      const parts = dateVal.split('-');
      const closedAtDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 18, 0, 0);
      const closedAt = closedAtDate.toISOString();
      const startedAt = new Date(closedAtDate.getTime() - 4 * 60 * 60 * 1000).toISOString();

      const totalSales = cashSales + cardSales;
      const cashTips = totalTips * 0.4;
      const cardTips = totalTips * 0.6;
      const expectedCash = initialCash + cashSales + cashTips - totalExpenses;
      const tipCocina = totalTips * 0.5;
      const tipMeseros = totalTips * 0.5;

      const record = {
        id: 'manual-added-' + dateVal + '-' + Date.now(),
        name,
        startedAt,
        closedAt,
        initialCash,
        cashSales,
        cardSales,
        qrSales: 0,
        totalSales,
        cashTips,
        cardTips,
        totalTips,
        crossShiftTipsOut: 0,
        tipCocina,
        tipMeseros,
        totalExpenses,
        expectedCash,
        closed: true,
        imported: true
      };

      if (state.isOfflineMode) {
        handleLocalAction('ADD_HISTORICAL_RECORD', { target: 'closedShifts', record });
      } else {
        sendWSMessage('ADD_HISTORICAL_RECORD', { target: 'closedShifts', record });
      }

      alert('Corte de caja agregado exitosamente.');
      
      // Clear inputs
      document.getElementById('manual-shift-date').value = '';
      document.getElementById('manual-shift-initial').value = '';
      document.getElementById('manual-shift-cashsales').value = '';
      document.getElementById('manual-shift-cardsales').value = '';
      document.getElementById('manual-shift-totaltips').value = '';
      document.getElementById('manual-shift-expenses').value = '';
    });
  }

  const btnAddExpense = document.getElementById('btn-add-expense');
  if (btnAddExpense) {
    btnAddExpense.addEventListener('click', () => {
      const descInput = document.getElementById('expense-desc');
      const amountInput = document.getElementById('expense-amount');
      const description = descInput.value.trim();
      const amount = parseFloat(amountInput.value);

      if (!description || isNaN(amount) || amount <= 0) {
        alert('Por favor introduce un concepto y un monto válido para el gasto.');
        return;
      }

      sendWSMessage('ADD_EXPENSE', { description, amount });
      descInput.value = '';
      amountInput.value = '';
    });
  }

  const btnCloseShift = document.getElementById('btn-close-shift');
  if (btnCloseShift) {
    btnCloseShift.addEventListener('click', () => {
      const nextInitialCashInput = document.getElementById('next-initial-cash');
      const nextInitialCash = parseFloat(nextInitialCashInput.value || 1000);

      const pin = prompt('Ingresa el PIN Maestro para autorizar el Cierre de Turno:');
      if (!pin) return;

      if (pin !== state.settings.masterPin) {
        alert('PIN Maestro incorrecto. Cierre de turno cancelado.');
        return;
      }

      sendWSMessage('CLOSE_SHIFT', { nextInitialCash }, pin);
    });
  }

  const btnSaveSettings = document.getElementById('btn-save-settings');
  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      const defaultInitialCashInput = document.getElementById('setting-default-initial-cash');
      const defaultInitialCash = parseFloat(defaultInitialCashInput.value || 1000);

      if (isNaN(defaultInitialCash) || defaultInitialCash < 0) {
        alert('Por favor introduce un monto de fondo inicial válido.');
        return;
      }

      sendWSMessage('UPDATE_SETTINGS', { defaultInitialCash });
      alert('Guardando ajustes...');
    });
  }

  const btnAddMenuItem = document.getElementById('btn-add-menu-item');
  if (btnAddMenuItem) {
    btnAddMenuItem.addEventListener('click', () => {
      const nameInput = document.getElementById('new-item-name');
      const vietNameInput = document.getElementById('new-item-vietname');
      const priceInput = document.getElementById('new-item-price');
      const categoryInput = document.getElementById('new-item-category');
      const descInput = document.getElementById('new-item-desc');

      const name = nameInput.value.trim();
      const vietName = vietNameInput.value.trim();
      const price = parseFloat(priceInput.value);
      const category = categoryInput.value;
      const description = descInput.value.trim();

      if (!name || isNaN(price) || price < 0) {
        alert('Por favor completa los campos del platillo correctamente. Nombre y Precio son requeridos.');
        return;
      }

      const id = 'item-' + Date.now();
      const newItem = {
        id,
        name,
        vietName: vietName || name,
        price,
        category,
        description,
        options: [],
        available: true
      };

      state.menu.push(newItem);
      sendWSMessage('MENU_UPDATE', state.menu);

      nameInput.value = '';
      vietNameInput.value = '';
      priceInput.value = '';
      descInput.value = '';

      alert(`Platillo "${name}" agregado con éxito.`);
    });
  }

  const btnAddCategory = document.getElementById('btn-add-category');
  if (btnAddCategory) {
    btnAddCategory.addEventListener('click', () => {
      const nameInput = document.getElementById('new-category-name');
      const name = nameInput.value.trim();

      if (!name) {
        alert('Por favor introduce un nombre para la nueva categoría.');
        return;
      }

      const id = name.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      if (state.categories.some(c => c.id === id)) {
        alert('Ya existe una categoría con el mismo nombre.');
        return;
      }

      state.categories.push({ id, name });
      sendWSMessage('CATEGORIES_UPDATE', state.categories);
      nameInput.value = '';
      alert(`Categoría "${name}" agregada con éxito.`);
    });
  }

  const btnClearTipCalc = document.getElementById('btn-clear-tip-calculator');
  if (btnClearTipCalc) {
    btnClearTipCalc.addEventListener('click', () => {
      state.selectedTips = [];
      renderWeeklyTipsTable();
      renderTipCalculator();
    });
  }

  const btnRefreshRep = document.getElementById('btn-refresh-rep');
  if (btnRefreshRep) {
    btnRefreshRep.addEventListener('click', renderReplenishmentReport);
  }

  const btnSaveRepConfigs = document.getElementById('btn-save-rep-configs');
  if (btnSaveRepConfigs) {
    btnSaveRepConfigs.addEventListener('click', () => {
      renderReplenishmentReport();
      alert('Proyecciones recalculadas con los nuevos parámetros.');
    });
  }

  const btnCopyRepWhatsapp = document.getElementById('btn-copy-rep-whatsapp');
  if (btnCopyRepWhatsapp) {
    btnCopyRepWhatsapp.addEventListener('click', copyShoppingListToClipboard);
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
      alert('Por favor ingresa tu PIN Maestro.');
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
// FUNCIONES DE GESTIÓN DE CATEGORÍAS EN VIVO
// ==========================================
function renderCategoryTabs() {
  const container = document.getElementById('menu-categories-list');
  if (!container) return;
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = `menu-cat-btn ${state.activeCategory === 'all' ? 'active' : ''}`;
  allBtn.dataset.category = 'all';
  allBtn.textContent = 'Todos';
  container.appendChild(allBtn);

  state.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `menu-cat-btn ${state.activeCategory === cat.id ? 'active' : ''}`;
    btn.dataset.category = cat.id;
    btn.textContent = cat.name;
    container.appendChild(btn);
  });
}

function populateCategoryDropdowns() {
  const selectNewItem = document.getElementById('new-item-category');
  if (selectNewItem) {
    selectNewItem.innerHTML = '';
    state.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      selectNewItem.appendChild(opt);
    });
  }
}

function renderCategoryEditor() {
  const container = document.getElementById('category-manager-container');
  if (!container) return;
  container.innerHTML = '';

  if (state.categories.length === 0) {
    container.innerHTML = '<p class="text-muted" style="font-size:12px; font-style:italic; color: rgba(255,255,255,0.4);">No hay categorías registradas.</p>';
    return;
  }

  state.categories.forEach(cat => {
    const div = document.createElement('div');
    div.style = 'display: flex; gap: 10px; align-items: center;';
    div.innerHTML = `
      <span style="font-size: 0.85rem; color: rgba(255,255,255,0.4); width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace;">[${cat.id}]</span>
      <input type="text" id="cat-name-input-${cat.id}" value="${cat.name}" style="flex: 1; padding: 6px 10px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 4px; font-size: 0.9rem;">
      <button onclick="saveCategoryName('${cat.id}')" class="btn btn-primary" style="padding: 6px 12px; font-size: 11px; display: flex; align-items: center; gap: 4px;">
        <i class="fa-solid fa-save"></i> Renombrar
      </button>
      <button onclick="deleteCategory('${cat.id}')" class="btn btn-danger" style="padding: 6px 12px; font-size: 11px; background: #ea4335; border: none; display: flex; align-items: center; gap: 4px; color: white;">
        <i class="fa-solid fa-trash"></i> Eliminar
      </button>
    `;
    container.appendChild(div);
  });
}

window.saveCategoryName = function(catId) {
  const input = document.getElementById(`cat-name-input-${catId}`);
  if (!input) return;
  const newName = input.value.trim();

  if (!newName) {
    alert('El nombre de la categoría no puede estar vacío.');
    return;
  }

  const cat = state.categories.find(c => c.id === catId);
  if (cat) {
    cat.name = newName;
    sendWSMessage('CATEGORIES_UPDATE', state.categories);
  }
};

window.deleteCategory = function(catId) {
  const count = state.menu.filter(item => item.category === catId).length;
  if (count > 0) {
    alert(`No se puede eliminar la categoría porque hay ${count} platillo(s) asignados a ella. Reasigna los platillos a otra categoría primero.`);
    return;
  }

  if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
    state.categories = state.categories.filter(c => c.id !== catId);
    sendWSMessage('CATEGORIES_UPDATE', state.categories);
  }
};

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
  document.getElementById('chk-tip').value = '';
  const defaultTipMethod = document.querySelector('input[name="chk-tip-method"][value="cash"]');
  if (defaultTipMethod) defaultTipMethod.checked = true;
  
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
  const tip = parseFloat(document.getElementById('chk-tip').value) || 0;
  const tipPaymentMethod = document.querySelector('input[name="chk-tip-method"]:checked').value;

  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');

  sendWSMessage('PAY_ORDER', {
    tableId: table.id,
    paymentMethod: paymentMethod,
    discount: discount,
    tip: tip,
    tipPaymentMethod: tipPaymentMethod
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

    const optionsHtml = state.categories.map(cat => 
      `<option value="${cat.id}" ${item.category === cat.id ? 'selected' : ''}>${cat.name}</option>`
    ).join('');

    row.innerHTML = `
      <div class="platillo-detail">
        <span class="p-name">${item.name}</span>
        <span class="p-viet">${item.vietName}</span>
      </div>
      <div>
        <select id="cat-select-${index}" style="padding: 4px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 4px;">
          ${optionsHtml}
        </select>
      </div>
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
  const catVal = document.getElementById(`cat-select-${index}`).value;

  if (isNaN(priceVal) || priceVal < 0) {
    alert('Precio inválido.');
    return;
  }

  state.menu[index].price = priceVal;
  state.menu[index].available = availVal;
  state.menu[index].category = catVal;

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
    row.style.gridTemplateColumns = '1fr 1.5fr 1fr 1fr 1fr 1fr 1fr 0.8fr';
    row.style.alignItems = 'center';
    
    const idToPrint = sale.id.startsWith('sale-') ? sale.id.substring(5, 13).toUpperCase() : sale.id;
    const dateFormatted = new Date(sale.date).toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const discText = sale.discount > 0 ? `-${formatCurrency(sale.discount)}` : '$0.00';

    row.innerHTML = `
      <strong>#${idToPrint}</strong>
      <span style="font-size: 0.8rem;">${dateFormatted}</span>
      <span>Mesa ${sale.tableId}</span>
      <div><span class="method-badge ${sale.paymentMethod}">${sale.paymentMethod}</span></div>
      <span style="color:#e74c3c;">${discText}</span>
      <input type="number" step="0.01" class="edit-sale-total" value="${sale.total}" style="width:70px; padding:4px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); color:white; border-radius:4px; text-align:right;">
      <input type="number" step="0.01" class="edit-sale-tip" value="${sale.tip || 0}" style="width:65px; padding:4px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); color:white; border-radius:4px; text-align:right;">
      <div style="display: flex; gap: 4px; justify-content: center;">
        <button class="btn btn-primary btn-save-sale-edit" style="padding:4px 8px; font-size:0.75rem;"><i class="fa-solid fa-save"></i></button>
        <button class="btn btn-danger btn-delete-sale" style="padding:4px 8px; font-size:0.75rem; background:#ea4335; border-color:#ea4335;"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    row.querySelector('.btn-save-sale-edit').addEventListener('click', () => {
      const total = parseFloat(row.querySelector('.edit-sale-total').value || '0');
      const tip = parseFloat(row.querySelector('.edit-sale-tip').value || '0');
      updateHistoricalRecord('sales', sale.id, { total, tip });
    });

    row.querySelector('.btn-delete-sale').addEventListener('click', () => {
      deleteHistoricalRecord('sales', sale.id);
    });

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

// ==========================================
// NUEVAS FUNCIONES DE CONTROL DE CAJA Y FINANZAS
// ==========================================
window.switchCajeroTab = function(tabName) {
  const btnSales = document.getElementById('cajero-tab-sales');
  const btnCaja = document.getElementById('cajero-tab-caja');
  const contentSales = document.getElementById('cajero-content-sales');
  const contentCaja = document.getElementById('cajero-content-caja');
  
  if (!btnSales || !btnCaja || !contentSales || !contentCaja) return;

  if (tabName === 'sales') {
    btnSales.className = 'cajero-tab-btn active';
    btnSales.style.background = 'var(--primary)';
    btnSales.style.color = 'white';
    btnCaja.className = 'cajero-tab-btn';
    btnCaja.style.background = 'transparent';
    btnCaja.style.color = 'rgba(255,255,255,0.7)';
    contentSales.style.display = 'block';
    contentCaja.style.display = 'none';
  } else {
    btnCaja.className = 'cajero-tab-btn active';
    btnCaja.style.background = 'var(--primary)';
    btnCaja.style.color = 'white';
    btnSales.className = 'cajero-tab-btn';
    btnSales.style.background = 'transparent';
    btnSales.style.color = 'rgba(255,255,255,0.7)';
    contentSales.style.display = 'none';
    contentCaja.style.display = 'block';
    
    renderExpenses();
    renderShiftBalance();
  }
};

function renderExpenses() {
  const tbody = document.getElementById('caja-expenses-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!state.expenses || state.expenses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="padding: 10px; text-align: center; color: rgba(255,255,255,0.4);">No hay gastos en este turno.</td></tr>';
    return;
  }

  // Filtrar gastos del turno activo actual que no estén cerrados
  const currentExpenses = state.expenses.filter(e => !e.closed && e.shift === state.activeShift.name);
  if (currentExpenses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="padding: 10px; text-align: center; color: rgba(255,255,255,0.4);">No hay gastos en este turno.</td></tr>';
    return;
  }

  currentExpenses.forEach(e => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    tr.innerHTML = `
      <td style="padding: 8px 10px;">${e.description}</td>
      <td style="padding: 8px 10px; text-align: right; color: #ea4335;">${formatCurrency(e.amount)}</td>
      <td style="padding: 8px 10px; text-align: center;">
        <button class="btn-delete-active-expense" style="background: none; border: none; color: #ea4335; cursor: pointer; padding: 4px 8px;"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tr.querySelector('.btn-delete-active-expense').addEventListener('click', () => {
      if (confirm(`¿Estás seguro de eliminar el gasto "${e.description}"?`)) {
        if (state.isOfflineMode) {
          handleLocalAction('DELETE_EXPENSE', { id: e.id });
        } else {
          sendWSMessage('DELETE_EXPENSE', { id: e.id });
        }
      }
    });
    tbody.appendChild(tr);
  });
}

function renderShiftBalance() {
  if (!state.activeShift) return;

  const currentSales = state.salesHistory.filter(s => !s.closed && s.shift === state.activeShift.name);
  const currentExpenses = (state.expenses || []).filter(e => !e.closed && e.shift === state.activeShift.name);

  const cashSales = currentSales.filter(s => s.paymentMethod === 'cash').reduce((sum, s) => sum + s.total, 0);
  const cardSalesOnly = currentSales.filter(s => s.paymentMethod === 'card').reduce((sum, s) => sum + s.total, 0);
  const qrSalesOnly = currentSales.filter(s => s.paymentMethod === 'qr').reduce((sum, s) => sum + s.total, 0);
  const cardSales = cardSalesOnly + qrSalesOnly;
  
  const cashTips = currentSales.filter(s => s.tipPaymentMethod === 'cash').reduce((sum, s) => sum + s.tip, 0);
  const cardTips = currentSales.filter(s => s.tipPaymentMethod === 'card').reduce((sum, s) => sum + s.tip, 0);
  const totalTips = cashTips + cardTips;

  const totalExpenses = currentExpenses.reduce((sum, e) => sum + e.amount, 0);

  // FÓRMULA DEL EXCEL: Caja Inicial + Efectivo Ventas + Efectivo Propinas - Gastos
  const expectedCash = state.activeShift.initialCash + cashSales + cashTips - totalExpenses;

  // Actualizar labels en UI
  const shiftNameEl = document.getElementById('caja-shift-name');
  const shiftStartEl = document.getElementById('caja-shift-start');
  const shiftInitialEl = document.getElementById('caja-shift-initial');

  if (shiftNameEl) shiftNameEl.textContent = state.activeShift.name;
  if (shiftStartEl) shiftStartEl.textContent = state.activeShift.startedAt ? new Date(state.activeShift.startedAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '--:--';
  if (shiftInitialEl) shiftInitialEl.textContent = formatCurrency(state.activeShift.initialCash);

  const balInitialEl = document.getElementById('bal-initial');
  const balCashSalesEl = document.getElementById('bal-cash-sales');
  const balCashTipsEl = document.getElementById('bal-cash-tips');
  const balExpensesEl = document.getElementById('bal-expenses');
  const balExpectedCashEl = document.getElementById('bal-expected-cash');

  if (balInitialEl) balInitialEl.textContent = formatCurrency(state.activeShift.initialCash);
  if (balCashSalesEl) balCashSalesEl.textContent = formatCurrency(cashSales);
  if (balCashTipsEl) balCashTipsEl.textContent = formatCurrency(cashTips);
  if (balExpensesEl) balExpensesEl.textContent = `-${formatCurrency(totalExpenses)}`;
  if (balExpectedCashEl) balExpectedCashEl.textContent = formatCurrency(expectedCash);

  const balCardSalesEl = document.getElementById('bal-card-sales');
  const balCardTipsEl = document.getElementById('bal-card-tips');

  if (balCardSalesEl) balCardSalesEl.textContent = `${formatCurrency(cardSales)} (Tarjeta: ${formatCurrency(cardSalesOnly)} / QR: ${formatCurrency(qrSalesOnly)})`;
  if (balCardTipsEl) balCardTipsEl.textContent = formatCurrency(cardTips);

  const crossShiftTipsOut = currentSales.filter(s => s.openedInShift && s.openedInShift !== state.activeShift.name).reduce((sum, s) => sum + s.tip * 0.5, 0);
  const activeShiftTips = Math.max(0, totalTips - crossShiftTipsOut);

  const balTotalTipsEl = document.getElementById('bal-total-tips');
  const balTipKitchenEl = document.getElementById('bal-tip-kitchen');
  const balTipWaitersEl = document.getElementById('bal-tip-waiters');

  if (balTotalTipsEl) {
    if (crossShiftTipsOut > 0) {
      balTotalTipsEl.innerHTML = `${formatCurrency(totalTips)} <span style="font-size:0.7rem; font-weight:normal; color:#ea4335; display:block; text-align:right;">(-${formatCurrency(crossShiftTipsOut)} del turno ant.)</span>`;
    } else {
      balTotalTipsEl.textContent = formatCurrency(totalTips);
    }
  }
  if (balTipKitchenEl) balTipKitchenEl.textContent = formatCurrency(activeShiftTips * 0.5);
  if (balTipWaitersEl) balTipWaitersEl.textContent = formatCurrency(activeShiftTips * 0.5);

  const nextInitialCashInput = document.getElementById('next-initial-cash');
  if (nextInitialCashInput) {
    nextInitialCashInput.value = expectedCash.toFixed(2);
    nextInitialCashInput.disabled = true;
    nextInitialCashInput.style.opacity = '0.7';
    nextInitialCashInput.style.cursor = 'not-allowed';
  }
}

function renderFinancialReports() {
  const dailyTbody = document.getElementById('financial-daily-tbody');
  const monthlyTbody = document.getElementById('financial-monthly-tbody');
  const shiftsTbody = document.getElementById('financial-shifts-tbody');
  
  if (!dailyTbody || !monthlyTbody || !shiftsTbody) return;

  dailyTbody.innerHTML = '';
  monthlyTbody.innerHTML = '';
  shiftsTbody.innerHTML = '';

  // 1. Ingresos Diarios
  const dailyData = {};
  
  // Agregar ventas actuales
  state.salesHistory.forEach(s => {
    if (s.closed) return; // Omitir ventas cerradas para evitar doble conteo
    const dateKey = new Date(s.date).toISOString().split('T')[0];
    if (!dailyData[dateKey]) dailyData[dateKey] = { sales: 0, expenses: 0, salesCount: 0 };
    dailyData[dateKey].sales += s.total;
    dailyData[dateKey].salesCount++;
  });

  // Agregar gastos actuales
  (state.expenses || []).forEach(e => {
    if (e.closed) return; // Omitir gastos cerrados
    const dateKey = new Date(e.date).toISOString().split('T')[0];
    if (!dailyData[dateKey]) dailyData[dateKey] = { sales: 0, expenses: 0, salesCount: 0 };
    dailyData[dateKey].expenses += e.amount;
  });

  // Agregar datos de turnos cerrados
  (state.closedShifts || []).forEach(cs => {
    const dateKey = new Date(cs.closedAt).toISOString().split('T')[0];
    if (!dailyData[dateKey]) dailyData[dateKey] = { sales: 0, expenses: 0, salesCount: 0 };
    dailyData[dateKey].sales += cs.totalSales || 0;
    dailyData[dateKey].expenses += cs.totalExpenses || 0;
  });

  const sortedDays = Object.keys(dailyData).sort((a, b) => new Date(b) - new Date(a));
  if (sortedDays.length === 0) {
    dailyTbody.innerHTML = '<tr><td colspan="5" style="padding:10px; text-align:center; color:rgba(255,255,255,0.4);">No hay datos de ventas registrados.</td></tr>';
  } else {
    sortedDays.forEach(day => {
      const d = dailyData[day];
      const net = d.sales - d.expenses;
      const avg = d.salesCount > 0 ? (d.sales / d.salesCount) : 0;
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      tr.innerHTML = `
        <td style="padding: 10px;">${day}</td>
        <td style="padding: 10px; text-align: right; color: #2ecc71;">${formatCurrency(d.sales)}</td>
        <td style="padding: 10px; text-align: right; color: #e74c3c;">${formatCurrency(d.expenses)}</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; color: ${net >= 0 ? '#2ecc71' : '#e74c3c'}">${formatCurrency(net)}</td>
        <td style="padding: 10px; text-align: right; color: var(--accent);">${formatCurrency(avg)}</td>
      `;
      dailyTbody.appendChild(tr);
    });
  }

  // 2. Ingresos Mensuales
  const monthlyData = {};
  
  // Agregar ventas actuales
  state.salesHistory.forEach(s => {
    if (s.closed) return; // Omitir ventas cerradas
    const d = new Date(s.date);
    const monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    if (!monthlyData[monthKey]) monthlyData[monthKey] = { sales: 0, expenses: 0, daysSet: new Set() };
    monthlyData[monthKey].sales += s.total;
    monthlyData[monthKey].daysSet.add(d.toISOString().split('T')[0]);
  });

  // Agregar gastos actuales
  (state.expenses || []).forEach(e => {
    if (e.closed) return; // Omitir gastos cerrados
    const d = new Date(e.date);
    const monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    if (!monthlyData[monthKey]) monthlyData[monthKey] = { sales: 0, expenses: 0, daysSet: new Set() };
    monthlyData[monthKey].expenses += e.amount;
    monthlyData[monthKey].daysSet.add(d.toISOString().split('T')[0]);
  });

  // Agregar turnos cerrados
  (state.closedShifts || []).forEach(cs => {
    const d = new Date(cs.closedAt);
    const monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    if (!monthlyData[monthKey]) monthlyData[monthKey] = { sales: 0, expenses: 0, daysSet: new Set() };
    monthlyData[monthKey].sales += cs.totalSales || 0;
    monthlyData[monthKey].expenses += cs.totalExpenses || 0;
    monthlyData[monthKey].daysSet.add(d.toISOString().split('T')[0]);
  });

  const sortedMonths = Object.keys(monthlyData).sort((a, b) => b.localeCompare(a));
  if (sortedMonths.length === 0) {
    monthlyTbody.innerHTML = '<tr><td colspan="4" style="padding:10px; text-align:center; color:rgba(255,255,255,0.4);">No hay datos mensuales.</td></tr>';
  } else {
    sortedMonths.forEach(m => {
      const d = monthlyData[m];
      const net = d.sales - d.expenses;
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      tr.innerHTML = `
        <td style="padding: 10px;">${m}</td>
        <td style="padding: 10px; text-align: right; color: #2ecc71;">${formatCurrency(d.sales)}</td>
        <td style="padding: 10px; text-align: right; color: #e74c3c;">${formatCurrency(d.expenses)}</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; color: ${net >= 0 ? '#2ecc71' : '#e74c3c'}">${formatCurrency(net)}</td>
      `;
      monthlyTbody.appendChild(tr);
    });
  }

  // Dibujar Gráfica
  renderMonthlySalesChart(monthlyData);

  // 3. Historial de Cortes
  if (!state.closedShifts || state.closedShifts.length === 0) {
    shiftsTbody.innerHTML = '<tr><td colspan="10" style="padding:10px; text-align:center; color:rgba(255,255,255,0.4);">No hay turnos cerrados registrados.</td></tr>';
  } else {
    const sortedShifts = [...state.closedShifts].sort((a, b) => new Date(b.closedAt) - new Date(a.closedAt));
    sortedShifts.forEach(shift => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      tr.innerHTML = `
        <td style="padding: 8px;">${new Date(shift.closedAt).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</td>
        <td style="padding: 8px; font-weight: bold; color:var(--accent);">${shift.name}</td>
        <td style="padding: 8px; text-align: right;">
          <input type="number" step="0.01" class="edit-shift-initial" value="${shift.initialCash}" style="width:60px; padding:4px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); color:white; border-radius:4px; text-align:right;">
        </td>
        <td style="padding: 8px; text-align: right;">
          <input type="number" step="0.01" class="edit-shift-cashsales" value="${shift.cashSales}" style="width:60px; padding:4px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); color:white; border-radius:4px; text-align:right;">
        </td>
        <td style="padding: 8px; text-align: right;">
          <input type="number" step="0.01" class="edit-shift-cardsales" value="${shift.cardSales || 0}" style="width:60px; padding:4px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); color:white; border-radius:4px; text-align:right;">
        </td>
        <td style="padding: 8px; text-align: right;">
          <input type="number" step="0.01" class="edit-shift-totaltips" value="${shift.totalTips}" style="width:60px; padding:4px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); color:white; border-radius:4px; text-align:right;">
        </td>
        <td style="padding: 8px; text-align: right;">
          <input type="number" step="0.01" class="edit-shift-expenses" value="${shift.totalExpenses}" style="width:60px; padding:4px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); color:white; border-radius:4px; text-align:right;">
        </td>
        <td style="padding: 8px; text-align: right; font-weight: bold;">${formatCurrency(shift.expectedCash)}</td>
        <td style="padding: 8px; text-align: right;">${formatCurrency(shift.tipCocina)}</td>
        <td style="padding: 8px; text-align: right;">${formatCurrency(shift.tipMeseros)}</td>
        <td style="padding: 8px; text-align: center;">
          <div style="display: flex; gap: 4px; justify-content: center;">
            <button class="btn btn-primary btn-save-shift-edit" style="padding:4px 8px; font-size:0.75rem;"><i class="fa-solid fa-save"></i></button>
            <button class="btn btn-danger btn-delete-shift" style="padding:4px 8px; font-size:0.75rem; background:#ea4335; border-color:#ea4335;"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      `;

      tr.querySelector('.btn-save-shift-edit').addEventListener('click', () => {
        const initialCash = parseFloat(tr.querySelector('.edit-shift-initial').value || '0');
        const cashSales = parseFloat(tr.querySelector('.edit-shift-cashsales').value || '0');
        const cardSales = parseFloat(tr.querySelector('.edit-shift-cardsales').value || '0');
        const totalTips = parseFloat(tr.querySelector('.edit-shift-totaltips').value || '0');
        const totalExpenses = parseFloat(tr.querySelector('.edit-shift-expenses').value || '0');

        const totalSales = cashSales + cardSales;
        const cashTips = totalTips * 0.4;
        const cardTips = totalTips * 0.6;
        const expectedCash = initialCash + cashSales + cashTips - totalExpenses;
        const tipCocina = totalTips * 0.5;
        const tipMeseros = totalTips * 0.5;

        updateHistoricalRecord('closedShifts', shift.id, { 
          initialCash, 
          cashSales, 
          cardSales,
          totalSales,
          cashTips,
          cardTips,
          totalTips,
          totalExpenses,
          expectedCash,
          tipCocina,
          tipMeseros
        });
      });

      tr.querySelector('.btn-delete-shift').addEventListener('click', () => {
        deleteHistoricalRecord('closedShifts', shift.id);
      });

      shiftsTbody.appendChild(tr);
    });
  }

  // 4. Tabulador Semanal de Propinas y Calculadora
  renderWeeklyTipsTable();
  renderTipCalculator();
}

function renderMonthlySalesChart(monthlyData) {
  const canvas = document.getElementById('monthly-sales-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear and resize canvas for HDPI
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 600;
  const height = rect.height || 300;
  
  // Set scale factor for Retina Displays
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, width, height);

  // Aggregate and sort data chronologically
  const chronologicalMonths = Object.keys(monthlyData).sort();
  if (chronologicalMonths.length === 0) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '14px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sin datos de ventas para mostrar la gráfica.', width / 2, height / 2);
    return;
  }

  const monthsMap = {
    '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr', '05': 'May', '06': 'Jun',
    '07': 'Jul', '08': 'Ago', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic'
  };

  const chartData = chronologicalMonths.map(mKey => {
    const parts = mKey.split('-');
    const label = monthsMap[parts[1]] || parts[1];
    const m = monthlyData[mKey];
    const daysCount = m.daysSet ? m.daysSet.size : 1;
    const avg = m.sales / (daysCount || 1);
    return {
      label: label + ' ' + parts[0],
      sales: m.sales,
      avg: avg
    };
  });

  const maxSales = Math.max(...chartData.map(d => d.sales)) * 1.15 || 1000;

  // Chart Layout
  const paddingLeft = 70;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 50;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Draw Grid Lines & Y Axis Labels
  const gridLines = 4;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#a0a0a0';
  ctx.font = '10px Outfit, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  for (let i = 0; i <= gridLines; i++) {
    const val = (maxSales / gridLines) * i;
    const y = paddingTop + chartHeight - (chartHeight / gridLines) * i;
    
    // Grid line
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();

    // Label
    ctx.fillText('$' + Math.round(val).toLocaleString('es-MX'), paddingLeft - 8, y);
  }

  // Draw Bars and Labels
  const barCount = chartData.length;
  const spacing = 30;
  const totalSpacing = spacing * (barCount - 1);
  const barWidth = Math.max(25, (chartWidth - totalSpacing) / barCount);
  
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  chartData.forEach((d, idx) => {
    const x = paddingLeft + idx * (barWidth + spacing) + (chartWidth - (barWidth * barCount + spacing * (barCount - 1))) / 2;
    const barHeight = (d.sales / maxSales) * chartHeight;
    const y = paddingTop + chartHeight - barHeight;

    // Create gradient
    const gradient = ctx.createLinearGradient(x, y, x, paddingTop + chartHeight);
    gradient.addColorStop(0, '#f4c430'); // Gold
    gradient.addColorStop(1, '#ef933c'); // Amber

    // Draw Bar
    ctx.fillStyle = gradient;
    ctx.beginPath();
    const radius = Math.min(6, barHeight);
    if (ctx.roundRect) {
      ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
    } else {
      ctx.rect(x, y, barWidth, barHeight);
    }
    ctx.fill();

    // Value text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText('$' + Math.round(d.sales).toLocaleString('es-MX'), x + barWidth / 2, y - 15);

    // Label
    ctx.fillStyle = '#a0a0a0';
    ctx.font = '11px Outfit, sans-serif';
    ctx.fillText(d.label, x + barWidth / 2, paddingTop + chartHeight + 8);

    // Average sales text below
    ctx.fillStyle = '#168e5a'; // Jade light color for emphasis
    ctx.font = 'bold 9px Outfit, sans-serif';
    ctx.fillText('Prom: $' + Math.round(d.avg).toLocaleString('es-MX') + '/d', x + barWidth / 2, paddingTop + chartHeight + 22);
  });
}

function getWeeklyTipsData() {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday...
  const distance = (currentDay === 0 ? -6 : 1) - currentDay; // distance to Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() + distance);
  monday.setHours(0, 0, 0, 0);

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const weeklyData = [];

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(monday);
    targetDate.setDate(monday.getDate() + i);
    const dateStr = targetDate.toISOString().split('T')[0];

    let matutino = 0;
    let vespertino = 0;

    // 1. Filtrar cortes de caja (turnos cerrados) en esta fecha
    const shiftsOnDate = (state.closedShifts || []).filter(cs => {
      const shiftDateStr = new Date(cs.closedAt).toISOString().split('T')[0];
      return shiftDateStr === dateStr;
    });

    let closedMatutino = false;
    let closedVespertino = false;

    shiftsOnDate.forEach(cs => {
      if (cs.name === 'Matutino') {
        matutino += (cs.tipCocina || 0) + (cs.tipMeseros || 0);
        closedMatutino = true;
      } else if (cs.name === 'Vespertino') {
        vespertino += (cs.tipCocina || 0) + (cs.tipMeseros || 0);
        closedVespertino = true;
      }
    });

    // 2. Si el turno activo está en esta fecha y aún no está cerrado, calcular en tiempo real de salesHistory
    if (state.activeShift) {
      const activeShiftDateStr = new Date(state.activeShift.startedAt || today).toISOString().split('T')[0];
      if (activeShiftDateStr === dateStr) {
        if (state.activeShift.name === 'Matutino' && !closedMatutino) {
          const currentSales = state.salesHistory.filter(s => !s.closed && s.shift === 'Matutino');
          const totalTips = currentSales.reduce((sum, s) => sum + (s.tip || 0), 0);
          matutino += totalTips;
        }
        if (state.activeShift.name === 'Vespertino' && !closedVespertino) {
          const currentSales = state.salesHistory.filter(s => !s.closed && s.shift === 'Vespertino');
          const totalTips = currentSales.reduce((sum, s) => sum + (s.tip || 0), 0);
          const crossShiftTipsOut = currentSales.filter(s => s.openedInShift && s.openedInShift === 'Matutino').reduce((sum, s) => sum + s.tip * 0.5, 0);
          const activeShiftTips = Math.max(0, totalTips - crossShiftTipsOut);
          vespertino += activeShiftTips;
          matutino += crossShiftTipsOut; // 50% de mesas matutinas cobradas en la tarde van a la mañana
        }
      }
    }

    weeklyData.push({
      dayName: daysOfWeek[i],
      dateStr: dateStr,
      matutino: matutino,
      vespertino: vespertino,
      total: matutino + vespertino
    });
  }

  return weeklyData;
}

function renderWeeklyTipsTable() {
  const tbody = document.getElementById('weekly-tips-tbody');
  if (!tbody) return;

  const weeklyData = getWeeklyTipsData();
  tbody.innerHTML = '';

  weeklyData.forEach(day => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';

    // Cocina Matutino
    const isMatutinoCocinaSelected = state.selectedTips.some(t => t.dateStr === day.dateStr && t.shift === 'Matutino' && t.type === 'Cocina');
    // Meseros Matutino
    const isMatutinoMeserosSelected = state.selectedTips.some(t => t.dateStr === day.dateStr && t.shift === 'Matutino' && t.type === 'Meseros');
    // Cocina Vespertino
    const isVespertinoCocinaSelected = state.selectedTips.some(t => t.dateStr === day.dateStr && t.shift === 'Vespertino' && t.type === 'Cocina');
    // Meseros Vespertino
    const isVespertinoMeserosSelected = state.selectedTips.some(t => t.dateStr === day.dateStr && t.shift === 'Vespertino' && t.type === 'Meseros');

    const matutinoCocinaVal = day.matutino * 0.5;
    const matutinoMeserosVal = day.matutino * 0.5;
    const vespertinoCocinaVal = day.vespertino * 0.5;
    const vespertinoMeserosVal = day.vespertino * 0.5;

    tr.innerHTML = `
      <td style="padding: 10px; font-weight: 500;">
        ${day.dayName} 
        <span style="font-size: 0.75rem; color: rgba(255,255,255,0.4); display: block;">${day.dateStr}</span>
      </td>
      <td class="clickable-tip-cell ${isMatutinoCocinaSelected ? 'selected-tip' : ''}" 
          style="padding: 10px; text-align: right;" 
          data-date="${day.dateStr}" 
          data-shift="Matutino" 
          data-type="Cocina"
          data-amount="${matutinoCocinaVal}">
        ${formatCurrency(matutinoCocinaVal)}
      </td>
      <td class="clickable-tip-cell ${isMatutinoMeserosSelected ? 'selected-tip' : ''}" 
          style="padding: 10px; text-align: right;" 
          data-date="${day.dateStr}" 
          data-shift="Matutino" 
          data-type="Meseros"
          data-amount="${matutinoMeserosVal}">
        ${formatCurrency(matutinoMeserosVal)}
      </td>
      <td class="clickable-tip-cell ${isVespertinoCocinaSelected ? 'selected-tip' : ''}" 
          style="padding: 10px; text-align: right;" 
          data-date="${day.dateStr}" 
          data-shift="Vespertino" 
          data-type="Cocina"
          data-amount="${vespertinoCocinaVal}">
        ${formatCurrency(vespertinoCocinaVal)}
      </td>
      <td class="clickable-tip-cell ${isVespertinoMeserosSelected ? 'selected-tip' : ''}" 
          style="padding: 10px; text-align: right;" 
          data-date="${day.dateStr}" 
          data-shift="Vespertino" 
          data-type="Meseros"
          data-amount="${vespertinoMeserosVal}">
        ${formatCurrency(vespertinoMeserosVal)}
      </td>
      <td style="padding: 10px; text-align: right; font-weight: bold; color: var(--color-gold);">
        ${formatCurrency(day.total)}
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Attach event listeners to the new cells
  tbody.querySelectorAll('.clickable-tip-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const dateStr = cell.getAttribute('data-date');
      const shift = cell.getAttribute('data-shift');
      const type = cell.getAttribute('data-type');
      const amount = parseFloat(cell.getAttribute('data-amount') || '0');

      toggleTipSelection(dateStr, shift, type, amount);
    });
  });
}

function toggleTipSelection(dateStr, shift, type, amount) {
  if (!state.selectedTips) state.selectedTips = [];

  const index = state.selectedTips.findIndex(t => t.dateStr === dateStr && t.shift === shift && t.type === type);
  if (index > -1) {
    state.selectedTips.splice(index, 1);
  } else {
    state.selectedTips.push({ dateStr, shift, type, amount });
  }

  // Rerender table and calculator
  renderWeeklyTipsTable();
  renderTipCalculator();
}

function renderTipCalculator() {
  const selectionsEl = document.getElementById('tip-calculator-selections');
  const totalEl = document.getElementById('tip-calculator-total');
  if (!selectionsEl || !totalEl) return;

  if (!state.selectedTips) state.selectedTips = [];

  selectionsEl.innerHTML = '';
  
  if (state.selectedTips.length === 0) {
    selectionsEl.innerHTML = '<span style="color: rgba(255,255,255,0.3); font-style: italic;">Sin turnos seleccionados...</span>';
    totalEl.textContent = '$0.00';
    return;
  }

  let totalSum = 0;
  // Sort selections by date/shift/type
  const sorted = [...state.selectedTips].sort((a, b) => {
    if (a.dateStr !== b.dateStr) return a.dateStr.localeCompare(b.dateStr);
    if (a.shift !== b.shift) return a.shift.localeCompare(b.shift);
    return a.type.localeCompare(b.type);
  });

  sorted.forEach(item => {
    totalSum += item.amount;
    
    // Get short day name
    const dateObj = new Date(item.dateStr + 'T00:00:00');
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dayLabel = days[dateObj.getDay()];

    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justify = 'space-between';
    div.style.alignItems = 'center';
    div.style.padding = '4px 8px';
    div.style.background = 'rgba(255,255,255,0.05)';
    div.style.borderRadius = '4px';
    div.innerHTML = `
      <span>${dayLabel} - ${item.shift} (${item.type})</span>
      <strong style="color: var(--color-gold);">${formatCurrency(item.amount)}</strong>
    `;
    selectionsEl.appendChild(div);
  });

  totalEl.textContent = formatCurrency(totalSum);
}

function updateHistoricalRecord(target, id, updatedRecord) {
  // Aplicar cambios en memoria de inmediato para feedback visual instantáneo
  if (target === 'sales') {
    const idx = state.salesHistory.findIndex(s => s.id === id);
    if (idx !== -1) {
      state.salesHistory[idx] = { ...state.salesHistory[idx], ...updatedRecord };
      renderSalesHistory();
      renderShiftBalance();
      renderFinancialReports();
    }
  } else if (target === 'closedShifts') {
    const idx = state.closedShifts.findIndex(c => c.id === id);
    if (idx !== -1) {
      state.closedShifts[idx] = { ...state.closedShifts[idx], ...updatedRecord };
      renderFinancialReports();
    }
  }

  sendWSMessage('UPDATE_HISTORICAL_DATA', { target, id, updatedRecord });
  alert('Datos históricos actualizados con éxito.');
}

function deleteHistoricalRecord(target, id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este registro del historial? Esta acción es irreversible.')) return;

  if (target === 'sales') {
    state.salesHistory = state.salesHistory.filter(s => s.id !== id);
    renderSalesHistory();
    renderShiftBalance();
    renderFinancialReports();
  } else if (target === 'closedShifts') {
    state.closedShifts = state.closedShifts.filter(c => c.id !== id);
    renderFinancialReports();
  }

  sendWSMessage('DELETE_HISTORICAL_DATA', { target, id });
  alert('Registro eliminado con éxito.');
}

// ==========================================
// PESTAÑA DE INSUMOS Y FALTANTES (MAESTRO)
// ==========================================
function classifyItemProtein(item) {
  const name = (item.name || '').toLowerCase();
  const id = (item.id || '').toLowerCase();
  
  if (name.includes('pollo') || id.includes('-pollo') || name.includes('satay')) {
    return 'pollo';
  }
  if (name.includes('arrachera') || name.includes('res') || name.includes('carne') || id.includes('-arrachera')) {
    return 'arrachera';
  }
  if (name.includes('tofu') || id.includes('-tofu')) {
    return 'tofu';
  }
  if (name.includes('camarón') || name.includes('camaron') || id.includes('-camaron') || id.includes('-shrimp') || name.includes('shrimp')) {
    return 'camaron';
  }
  return null;
}

function getRecipeConfigs() {
  return {
    mainProtein: parseFloat(document.getElementById('cfg-main-protein')?.value || '150'),
    mainTofu: parseFloat(document.getElementById('cfg-main-tofu')?.value || '120'),
    mainShrimp: parseFloat(document.getElementById('cfg-main-shrimp')?.value || '100'),
    mainVeg: parseFloat(document.getElementById('cfg-main-veg')?.value || '80'),
    entProtein: parseFloat(document.getElementById('cfg-ent-protein')?.value || '80'),
    entVeg: parseFloat(document.getElementById('cfg-ent-veg')?.value || '40'),
    oilFry: parseFloat(document.getElementById('cfg-oil-fry')?.value || '15'),
    oilOther: parseFloat(document.getElementById('cfg-oil-other')?.value || '5')
  };
}

function renderReplenishmentReport() {
  const container = document.getElementById('replenishment-tbody');
  if (!container) return;

  // Inicializar fecha de hoy si está vacío
  const dateInput = document.getElementById('rep-date-filter');
  if (dateInput && !dateInput.value) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
  }

  const selectedDate = dateInput ? dateInput.value : '';
  const selectedShift = document.getElementById('rep-shift-filter')?.value || 'all';

  // Filtrar ventas
  const filteredSales = state.salesHistory.filter(sale => {
    const saleDateStr = sale.date.split('T')[0];
    const matchDate = !selectedDate || (saleDateStr === selectedDate);
    const matchShift = selectedShift === 'all' || (sale.shift === selectedShift);
    return matchDate && matchShift;
  });

  // Contadores
  const counts = {
    pollo: 0,
    arrachera: 0,
    tofu: 0,
    camaron: 0
  };

  let polloWeightG = 0;
  let arracheraWeightG = 0;
  let tofuWeightG = 0;
  let camaronWeightG = 0;
  let vegWeightG = 0;
  let oilMl = 0;

  const cfg = getRecipeConfigs();

  filteredSales.forEach(sale => {
    if (!sale.items) return;
    sale.items.forEach(item => {
      const qty = item.quantity || 1;
      const protein = classifyItemProtein(item);
      if (protein && counts[protein] !== undefined) {
        counts[protein] += qty;
      }

      const itemId = (item.id || '').toLowerCase();
      const itemCat = (item.category || '').toLowerCase();
      const itemName = (item.name || '').toLowerCase();

      const isEntrada = itemId.startsWith('ent-') || itemCat === 'entradas' || itemCat === 'khai vị (entradas)';
      const isDrink = itemCat === 'bebidas' || itemId.startsWith('beb-') || itemCat.includes('bebida');

      if (!isDrink) {
        // Peso de proteínas
        if (protein === 'pollo') {
          polloWeightG += qty * (isEntrada ? cfg.entProtein : cfg.mainProtein);
        } else if (protein === 'arrachera') {
          arracheraWeightG += qty * (isEntrada ? cfg.entProtein : cfg.mainProtein);
        } else if (protein === 'tofu') {
          tofuWeightG += qty * (isEntrada ? cfg.entProtein : cfg.mainTofu);
        } else if (protein === 'camaron') {
          camaronWeightG += qty * (isEntrada ? cfg.entProtein : cfg.mainShrimp);
        }

        // Peso de vegetales
        vegWeightG += qty * (isEntrada ? cfg.entVeg : cfg.mainVeg);

        // Volumen de aceite
        const isFry = itemName.includes('stir') || itemName.includes('pad') || itemName.includes('curry') || itemName.includes('stickers') || itemName.includes('satay');
        oilMl += qty * (isFry ? cfg.oilFry : cfg.oilOther);
      }
    });
  });

  const polloKg = polloWeightG / 1000;
  const arracheraKg = arracheraWeightG / 1000;
  const tofuKg = tofuWeightG / 1000;
  const camaronKg = camaronWeightG / 1000;
  const vegKg = vegWeightG / 1000;
  const oilLiters = oilMl / 1000;

  // Actualizar métricas UI
  document.getElementById('rep-total-pollo').textContent = `${counts.pollo} ord / ${polloKg.toFixed(2)} kg`;
  document.getElementById('rep-total-arrachera').textContent = `${counts.arrachera} ord / ${arracheraKg.toFixed(2)} kg`;
  document.getElementById('rep-total-tofu').textContent = `${counts.tofu} ord / ${tofuKg.toFixed(2)} kg`;
  document.getElementById('rep-total-camaron').textContent = `${counts.camaron} ord / ${camaronKg.toFixed(2)} kg`;

  // Stock Objetivo sugerido (Par levels)
  const defaultTargets = {
    pollo: Math.max(5, Math.ceil(polloKg * 1.5)),
    arrachera: Math.max(5, Math.ceil(arracheraKg * 1.5)),
    tofu: Math.max(3, Math.ceil(tofuKg * 1.5)),
    camaron: Math.max(4, Math.ceil(camaronKg * 1.5)),
    verdura: Math.max(10, Math.ceil(vegKg * 1.5)),
    aceite: Math.max(5, Math.ceil(oilLiters * 1.5))
  };

  if (!state.replenishmentStock) {
    state.replenishmentStock = {
      pollo: '',
      arrachera: '',
      tofu: '',
      camaron: '',
      verdura: '',
      aceite: ''
    };
  }

  const itemsList = [
    { id: 'pollo', name: 'Pollo Pechuga / Filete', consumed: polloKg, unit: 'kg', defaultTarget: defaultTargets.pollo },
    { id: 'arrachera', name: 'Arrachera de Res', consumed: arracheraKg, unit: 'kg', defaultTarget: defaultTargets.arrachera },
    { id: 'tofu', name: 'Tofu Fresco', consumed: tofuKg, unit: 'kg', defaultTarget: defaultTargets.tofu },
    { id: 'camaron', name: 'Camarón Limpio', consumed: camaronKg, unit: 'kg', defaultTarget: defaultTargets.camaron },
    { id: 'verdura', name: 'Verduras Mezcla (Zanahoria, Col, Germen, etc.)', consumed: vegKg, unit: 'kg', defaultTarget: defaultTargets.verdura },
    { id: 'aceite', name: 'Aceite de Cocina', consumed: oilLiters, unit: 'L', defaultTarget: defaultTargets.aceite }
  ];

  container.innerHTML = '';
  itemsList.forEach(item => {
    const stockFisico = state.replenishmentStock[item.id] !== undefined ? state.replenishmentStock[item.id] : '';
    const targetStock = item.defaultTarget;
    
    let suggested = 0;
    if (stockFisico === '') {
      suggested = targetStock;
    } else {
      suggested = Math.max(0, targetStock - parseFloat(stockFisico || '0'));
    }

    const row = document.createElement('tr');
    row.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    row.innerHTML = `
      <td style="padding: 12px; font-weight: 500; color: #fff;">${item.name}</td>
      <td style="padding: 12px; text-align: right; color: rgba(255,255,255,0.7);">${item.consumed.toFixed(2)} ${item.unit}</td>
      <td style="padding: 12px; text-align: right; color: #fff; font-weight: 600;">${targetStock} ${item.unit}</td>
      <td style="padding: 12px; text-align: right;">
        <input type="number" step="0.1" min="0" class="rep-stock-input" data-id="${item.id}" value="${stockFisico}" placeholder="0.0" style="width: 80px; padding: 4px 8px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); color: white; border-radius: 4px; text-align: right; font-size: 0.85rem;">
      </td>
      <td style="padding: 12px; text-align: right; color: var(--accent); font-weight: bold; font-size: 1.05rem;">
        <span id="suggested-${item.id}">${suggested.toFixed(2)}</span> ${item.unit}
      </td>
    `;
    
    row.querySelector('.rep-stock-input').addEventListener('input', (e) => {
      const val = e.target.value;
      state.replenishmentStock[item.id] = val === '' ? '' : parseFloat(val);
      
      const span = document.getElementById(`suggested-${item.id}`);
      if (span) {
        let liveSuggested = 0;
        if (val === '') {
          liveSuggested = targetStock;
        } else {
          liveSuggested = Math.max(0, targetStock - parseFloat(val || '0'));
        }
        span.textContent = liveSuggested.toFixed(2);
      }
    });

    container.appendChild(row);
  });
}

function copyShoppingListToClipboard() {
  const dateVal = document.getElementById('rep-date-filter')?.value || new Date().toISOString().split('T')[0];
  const shiftVal = document.getElementById('rep-shift-filter')?.value || 'all';
  const shiftText = shiftVal === 'all' ? 'Día Completo' : shiftVal;

  let text = `*LISTA DE COMPRAS - BÁNH MÌ POS*\n`;
  text += `📅 *Fecha:* ${dateVal}\n`;
  text += `⏱️ *Turno:* ${shiftText}\n`;
  text += `=========================\n\n`;

  const rows = document.querySelectorAll('#replenishment-tbody tr');
  let hasItems = false;

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 5) {
      const name = cells[0].textContent.trim();
      const suggestedText = cells[4].textContent.trim();
      const valueStr = suggestedText.split(' ')[0];
      const unit = suggestedText.split(' ')[1] || '';
      const value = parseFloat(valueStr || '0');

      if (value > 0) {
        text += `• *${name}:* ${value.toFixed(2)} ${unit}\n`;
        hasItems = true;
      }
    }
  });

  if (!hasItems) {
    text += `_No se sugieren compras. ¡Inventario suficiente!_\n`;
  }

  text += `\n=========================\n`;
  text += `_Generado automáticamente desde Bánh Mì POS_`;

  navigator.clipboard.writeText(text).then(() => {
    alert('¡Lista de compras copiada al portapapeles en formato WhatsApp!');
  }).catch(err => {
    console.error('Error al copiar al portapapeles:', err);
    alert('No se pudo copiar. Inténtalo de nuevo.');
  });
}

