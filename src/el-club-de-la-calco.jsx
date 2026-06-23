
import { useState, useMemo, useRef, useEffect } from "react";

// ── SUPABASE ──
const SB_URL = "https://mschxtksjpcjdztpafrz.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zY2h4dGtzanBjamR6dHBhZnJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDIzNDAsImV4cCI6MjA5NzAxODM0MH0.0ZtWhXNm8vSp1A0SHreRMMINeEdyAWq_g8_nWz-a5C4";

async function sbFetch(path, opts = {}) {
  const res = await fetch(SB_URL + "/rest/v1/" + path, {
    headers: {
      "apikey": SB_KEY,
      "Authorization": "Bearer " + SB_KEY,
      "Content-Type": "application/json",
      "Prefer": opts.prefer || "return=representation",
      ...opts.headers
    },
    ...opts
  });
  if (!res.ok) { const e = await res.text(); throw new Error(e); }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Read all rows from a table
function sbGet(table, params = "") {
  return sbFetch(table + "?order=id" + (params ? "&" + params : ""));
}

// Insert a row
function sbInsert(table, row) {
  return sbFetch(table, { method: "POST", body: JSON.stringify(row), prefer: "return=minimal" });
}

// Update rows matching filter
function sbUpdate(table, filter, data) {
  return sbFetch(table + "?" + filter, { method: "PATCH", body: JSON.stringify(data), prefer: "return=minimal" });
}

// Delete a row by filter
function sbDelete(table, filter) {
  return sbFetch(table + "?" + filter, { method: "DELETE", prefer: "return=minimal" });
}

// Upsert (insert or update by pk)
function sbUpsert(table, rows) {
  return sbFetch(table, { method: "POST", body: JSON.stringify(rows), prefer: "resolution=merge-duplicates,return=minimal" });
}

// ── CATALOG DATA ──
const STICKERS_RAW = [{"id": 1, "name": "Gato yin yang", "cat": "Vida Salvaje"}, {"id": 2, "name": "Gato obsceno", "cat": "Vida Salvaje"}, {"id": 3, "name": "Gato skater", "cat": "Vida Salvaje"}, {"id": 4, "name": "Gato negro", "cat": "Vida Salvaje"}, {"id": 5, "name": "Gato tiburon", "cat": "Vida Salvaje"}, {"id": 6, "name": "Oso durmiendo", "cat": "Vida Salvaje"}, {"id": 7, "name": "Oso rugiendo", "cat": "Vida Salvaje"}, {"id": 8, "name": "Perro skater", "cat": "Vida Salvaje"}, {"id": 9, "name": "Dachshund skater", "cat": "Vida Salvaje"}, {"id": 10, "name": "Mono DJ", "cat": "Vida Salvaje"}, {"id": 11, "name": "Mono retro", "cat": "Vida Salvaje"}, {"id": 12, "name": "Mono con gorra", "cat": "Vida Salvaje"}, {"id": 13, "name": "Capibara", "cat": "Vida Salvaje"}, {"id": 14, "name": "Oso polar", "cat": "Vida Salvaje"}, {"id": 15, "name": "Cangrejo cervecero", "cat": "Vida Salvaje"}, {"id": 16, "name": "Panda skater", "cat": "Vida Salvaje"}, {"id": 17, "name": "Jirafa cool", "cat": "Vida Salvaje"}, {"id": 18, "name": "Ganso skater", "cat": "Vida Salvaje"}, {"id": 19, "name": "Llama yoga", "cat": "Vida Salvaje"}, {"id": 20, "name": "Llama pastel", "cat": "Vida Salvaje"}, {"id": 21, "name": "Zorro cafe", "cat": "Vida Salvaje"}, {"id": 22, "name": "Rayo", "cat": "Vida Salvaje"}, {"id": 23, "name": "Dino pixel", "cat": "Vida Salvaje"}, {"id": 24, "name": "Dino pirata", "cat": "Vida Salvaje"}, {"id": 25, "name": "Tea-Rex", "cat": "Vida Salvaje"}, {"id": 26, "name": "Ola surf", "cat": "Vida Salvaje"}, {"id": 27, "name": "Ola corazon", "cat": "Vida Salvaje"}, {"id": 28, "name": "Triangulo ola", "cat": "Vida Salvaje"}, {"id": 29, "name": "Montana retro", "cat": "Vida Salvaje"}, {"id": 30, "name": "Keep it simple", "cat": "Vida Salvaje"}, {"id": 31, "name": "Montanas negras", "cat": "Vida Salvaje"}, {"id": 32, "name": "Mariposa rosa", "cat": "Vida Salvaje"}, {"id": 33, "name": "Mariposa flores", "cat": "Vida Salvaje"}, {"id": 34, "name": "Good Vibes letras", "cat": "Vida Salvaje"}, {"id": 35, "name": "Flor naranja", "cat": "Vida Salvaje"}, {"id": 36, "name": "Corazon girasol", "cat": "Vida Salvaje"}, {"id": 37, "name": "Zapatilla floral", "cat": "Vida Salvaje"}, {"id": 38, "name": "Paisaje vertical", "cat": "Vida Salvaje"}, {"id": 39, "name": "Van vintage", "cat": "Vida Salvaje"}, {"id": 40, "name": "Van retro", "cat": "Vida Salvaje"}, {"id": 41, "name": "Cuando Stereo", "cat": "Festival Sticky"}, {"id": 42, "name": "Charly Garcia", "cat": "Festival Sticky"}, {"id": 43, "name": "Flea RHCP", "cat": "Festival Sticky"}, {"id": 44, "name": "Triangulo", "cat": "Festival Sticky"}, {"id": 45, "name": "PM logo", "cat": "Festival Sticky"}, {"id": 46, "name": "Pennywise", "cat": "Festival Sticky"}, {"id": 47, "name": "Palmeras reggae", "cat": "Festival Sticky"}, {"id": 48, "name": "No te vagas tar", "cat": "Festival Sticky"}, {"id": 49, "name": "No te vagas tar rojo", "cat": "Festival Sticky"}, {"id": 50, "name": "Calavera", "cat": "Festival Sticky"}, {"id": 51, "name": "Bad Bunny corazon", "cat": "Festival Sticky"}, {"id": 52, "name": "Bad Bunny", "cat": "Festival Sticky"}, {"id": 53, "name": "Bucket hat", "cat": "Festival Sticky"}, {"id": 54, "name": "De bi tirar mas fotos", "cat": "Festival Sticky"}, {"id": 55, "name": "Kanye", "cat": "Festival Sticky"}, {"id": 56, "name": "Lengua Stones negro", "cat": "Festival Sticky"}, {"id": 57, "name": "Lengua Stones rojo", "cat": "Festival Sticky"}, {"id": 58, "name": "Lengua Stones rosa", "cat": "Festival Sticky"}, {"id": 59, "name": "RHCP estrella", "cat": "Festival Sticky"}, {"id": 60, "name": "RHCP letras", "cat": "Festival Sticky"}, {"id": 61, "name": "Metallica", "cat": "Festival Sticky"}, {"id": 62, "name": "Nirvana smiley", "cat": "Festival Sticky"}, {"id": 63, "name": "Beatles", "cat": "Festival Sticky"}, {"id": 64, "name": "Sex Pistols", "cat": "Festival Sticky"}, {"id": 65, "name": "Oasis", "cat": "Festival Sticky"}, {"id": 66, "name": "Guns N Roses", "cat": "Festival Sticky"}, {"id": 67, "name": "AC/DC", "cat": "Festival Sticky"}, {"id": 68, "name": "Johnny Ramone", "cat": "Festival Sticky"}, {"id": 69, "name": "Arctic Monkeys", "cat": "Festival Sticky"}, {"id": 70, "name": "Freddie Mercury", "cat": "Festival Sticky"}, {"id": 71, "name": "Pink Floyd circulo", "cat": "Festival Sticky"}, {"id": 72, "name": "Pink Floyd fucsia", "cat": "Festival Sticky"}, {"id": 73, "name": "Pink Floyd holo", "cat": "Festival Sticky"}, {"id": 74, "name": "Dark Side prisma", "cat": "Festival Sticky"}, {"id": 75, "name": "Pink Floyd firma", "cat": "Festival Sticky"}, {"id": 76, "name": "Vans LA negro", "cat": "Marcas"}, {"id": 77, "name": "Vans original", "cat": "Marcas"}, {"id": 78, "name": "Vans tablero", "cat": "Marcas"}, {"id": 79, "name": "Vans rosa", "cat": "Marcas"}, {"id": 80, "name": "Vans celeste", "cat": "Marcas"}, {"id": 81, "name": "Vans tablero negro", "cat": "Marcas"}, {"id": 82, "name": "Vans palma", "cat": "Marcas"}, {"id": 83, "name": "Vans 1966", "cat": "Marcas"}, {"id": 84, "name": "Vans letras negro", "cat": "Marcas"}, {"id": 85, "name": "Vans letras rojo", "cat": "Marcas"}, {"id": 86, "name": "Vans Simpsons", "cat": "Marcas"}, {"id": 87, "name": "Vans chica skate", "cat": "Marcas"}, {"id": 88, "name": "Vans surf", "cat": "Marcas"}, {"id": 89, "name": "Vans off the wall", "cat": "Marcas"}, {"id": 90, "name": "Vans retro", "cat": "Marcas"}, {"id": 91, "name": "Vans global", "cat": "Marcas"}, {"id": 92, "name": "Vans rojo", "cat": "Marcas"}, {"id": 93, "name": "Vans colorido", "cat": "Marcas"}, {"id": 94, "name": "Vans zapatilla grunge", "cat": "Marcas"}, {"id": 95, "name": "Vans zapatilla negra", "cat": "Marcas"}, {"id": 96, "name": "Vans Old Skool", "cat": "Marcas"}, {"id": 97, "name": "Vans tablero blanco", "cat": "Marcas"}, {"id": 98, "name": "Jordan Chicago", "cat": "Marcas"}, {"id": 99, "name": "Jordan 1 blanco", "cat": "Marcas"}, {"id": 100, "name": "Jordan 1 rosa", "cat": "Marcas"}, {"id": 101, "name": "Jordan duo", "cat": "Marcas"}, {"id": 102, "name": "Bulls zapato", "cat": "Marcas"}, {"id": 103, "name": "Nike logo", "cat": "Marcas"}, {"id": 104, "name": "Nike Homero", "cat": "Marcas"}, {"id": 105, "name": "Nike Bart", "cat": "Marcas"}, {"id": 106, "name": "Nike alien", "cat": "Marcas"}, {"id": 107, "name": "Rick Nike", "cat": "Marcas"}, {"id": 108, "name": "Nike pelota", "cat": "Marcas"}, {"id": 109, "name": "Nike retro", "cat": "Marcas"}, {"id": 110, "name": "Nike naranja", "cat": "Marcas"}, {"id": 111, "name": "Nike cafe", "cat": "Marcas"}, {"id": 112, "name": "NIKE cuadrado", "cat": "Marcas"}, {"id": 113, "name": "Volcom negro", "cat": "Marcas"}, {"id": 114, "name": "Volcom colorido", "cat": "Marcas"}, {"id": 115, "name": "Volcom gris", "cat": "Marcas"}, {"id": 116, "name": "Adidas circulo", "cat": "Marcas"}, {"id": 117, "name": "Adidas pizza", "cat": "Marcas"}, {"id": 118, "name": "Adidas trebol", "cat": "Marcas"}, {"id": 119, "name": "Adidas Marge", "cat": "Marcas"}, {"id": 120, "name": "Adidas letras", "cat": "Marcas"}, {"id": 121, "name": "Santa Cruz retro", "cat": "Marcas"}, {"id": 122, "name": "Santa Cruz rosa", "cat": "Marcas"}, {"id": 123, "name": "Santa Cruz rojo", "cat": "Marcas"}, {"id": 124, "name": "Santa Cruz verde", "cat": "Marcas"}, {"id": 125, "name": "Coca-Cola", "cat": "Marcas"}, {"id": 126, "name": "Jeep montana", "cat": "Marcas"}, {"id": 127, "name": "Jeep letras", "cat": "Marcas"}, {"id": 128, "name": "Drew House", "cat": "Marcas"}, {"id": 129, "name": "MTV grunge", "cat": "Marcas"}, {"id": 130, "name": "Ferrari", "cat": "Marcas"}, {"id": 131, "name": "McLaren", "cat": "Marcas"}, {"id": 132, "name": "Toyota Tacoma", "cat": "Marcas"}, {"id": 133, "name": "Yota Life", "cat": "Marcas"}, {"id": 134, "name": "Macaron", "cat": "Random"}, {"id": 135, "name": "Popcorn", "cat": "Random"}, {"id": 136, "name": "Pizza", "cat": "Random"}, {"id": 137, "name": "Papas fritas", "cat": "Random"}, {"id": 138, "name": "Palta retro", "cat": "Random"}, {"id": 139, "name": "Palta dab", "cat": "Random"}, {"id": 140, "name": "Palta cara", "cat": "Random"}, {"id": 141, "name": "Pina lentes", "cat": "Random"}, {"id": 142, "name": "Papas calavera", "cat": "Random"}, {"id": 143, "name": "Dolar vacaciones", "cat": "Random"}, {"id": 144, "name": "Granada cerebro", "cat": "Random"}, {"id": 145, "name": "Cactus", "cat": "Random"}, {"id": 146, "name": "Chill Pill", "cat": "Random"}, {"id": 147, "name": "Mano santa cruz", "cat": "Random"}, {"id": 148, "name": "Whisky bottle", "cat": "Random"}, {"id": 149, "name": "Wasted", "cat": "Random"}, {"id": 150, "name": "104% Tired", "cat": "Random"}, {"id": 151, "name": "Personaje amarillo", "cat": "Random"}, {"id": 152, "name": "Astronauta", "cat": "Random"}, {"id": 153, "name": "Monstruo cafe", "cat": "Random"}, {"id": 154, "name": "Muerte skater", "cat": "Random"}, {"id": 155, "name": "Chica surf", "cat": "Random"}, {"id": 156, "name": "Van hippie", "cat": "Random"}, {"id": 157, "name": "Vespa", "cat": "Random"}, {"id": 158, "name": "Van turquesa", "cat": "Random"}, {"id": 159, "name": "Bicicleta ojo", "cat": "Random"}, {"id": 160, "name": "Mona Lisa DJ", "cat": "Random"}, {"id": 161, "name": "Tocadiscos", "cat": "Random"}, {"id": 162, "name": "Tocadiscos rojo", "cat": "Random"}, {"id": 163, "name": "Fantasma cerveza", "cat": "Random"}, {"id": 164, "name": "Shaka", "cat": "Random"}, {"id": 165, "name": "Senal peligro", "cat": "Random"}, {"id": 166, "name": "Good Vibes Only", "cat": "Random"}, {"id": 167, "name": "Here Comes the Sun", "cat": "Random"}, {"id": 168, "name": "Here Comes the Sun 2", "cat": "Random"}, {"id": 169, "name": "Angel barroco", "cat": "Random"}, {"id": 170, "name": "Smiley rosa", "cat": "Random"}, {"id": 171, "name": "Smiley morado", "cat": "Random"}, {"id": 172, "name": "Smiley amarillo", "cat": "Random"}, {"id": 173, "name": "Smiley drip", "cat": "Random"}, {"id": 174, "name": "David bubblegum", "cat": "Random"}, {"id": 175, "name": "David vendado", "cat": "Random"}, {"id": 176, "name": "Busto VR", "cat": "Random"}, {"id": 177, "name": "Einstein gorra", "cat": "Random"}, {"id": 178, "name": "Calavera chill", "cat": "Random"}, {"id": 179, "name": "No Bad Vibes", "cat": "Random"}, {"id": 180, "name": "Good Vibes 2", "cat": "Random"}, {"id": 181, "name": "Good Vibes rosa", "cat": "Random"}, {"id": 182, "name": "Good Vibes verde", "cat": "Random"}, {"id": 183, "name": "Sticker 183", "cat": "Random"}, {"id": 184, "name": "Good Vibes circulo", "cat": "Random"}, {"id": 185, "name": "Good Vibes flores", "cat": "Random"}, {"id": 186, "name": "Love Love", "cat": "Random"}, {"id": 187, "name": "Don't let them", "cat": "Random"}, {"id": 188, "name": "All You Need is Love", "cat": "Random"}, {"id": 189, "name": "No me jodas", "cat": "Random"}, {"id": 190, "name": "Give me space", "cat": "Random"}, {"id": 191, "name": "Astronauta pulgar", "cat": "Random"}, {"id": 192, "name": "Astronauta arcoiris", "cat": "Random"}, {"id": 193, "name": "Astronauta casco", "cat": "Random"}, {"id": 194, "name": "Astronauta alien", "cat": "Random"}, {"id": 195, "name": "Astronauta neon", "cat": "Random"}, {"id": 196, "name": "Pizza espacial", "cat": "Random"}, {"id": 197, "name": "Bitch", "cat": "Random"}, {"id": 198, "name": "Girl PWR", "cat": "Random"}, {"id": 199, "name": "Girl Power", "cat": "Random"}, {"id": 200, "name": "No f* with my energy", "cat": "Random"}, {"id": 201, "name": "Pistola rosa", "cat": "Random"}, {"id": 202, "name": "Boss Bitch", "cat": "Random"}, {"id": 203, "name": "Bee Happy", "cat": "Random"}, {"id": 204, "name": "Bad Bitch Club", "cat": "Random"}, {"id": 205, "name": "Chica pistola", "cat": "Random"}, {"id": 206, "name": "Labios bala", "cat": "Random"}, {"id": 207, "name": "Labios billete", "cat": "Random"}, {"id": 208, "name": "Labios negro", "cat": "Random"}, {"id": 209, "name": "Labios mordida", "cat": "Random"}, {"id": 210, "name": "Get It Girl", "cat": "Random"}, {"id": 211, "name": "You Flower You Feast", "cat": "Random"}, {"id": 212, "name": "Aries gato", "cat": "Random"}, {"id": 213, "name": "Tauro gato", "cat": "Random"}, {"id": 214, "name": "Geminis gatos", "cat": "Random"}, {"id": 215, "name": "Cancer gato", "cat": "Random"}, {"id": 216, "name": "Leo gato", "cat": "Random"}, {"id": 217, "name": "Virgo gato", "cat": "Random"}, {"id": 218, "name": "Libra gato", "cat": "Random"}, {"id": 219, "name": "Escorpio gato", "cat": "Random"}, {"id": 220, "name": "Sagitario gato", "cat": "Random"}, {"id": 221, "name": "Capricornio gato", "cat": "Random"}, {"id": 222, "name": "Acuario gato", "cat": "Random"}, {"id": 223, "name": "Piscis gato", "cat": "Random"}, {"id": 224, "name": "Aries tarot", "cat": "Random"}, {"id": 225, "name": "Tauro tarot", "cat": "Random"}, {"id": 226, "name": "Geminis tarot", "cat": "Random"}, {"id": 227, "name": "Cancer tarot", "cat": "Random"}, {"id": 228, "name": "Leo tarot", "cat": "Random"}, {"id": 229, "name": "Virgo tarot", "cat": "Random"}, {"id": 230, "name": "Libra tarot", "cat": "Random"}, {"id": 231, "name": "Escorpio tarot", "cat": "Random"}, {"id": 232, "name": "Sagitario tarot", "cat": "Random"}, {"id": 233, "name": "Capricornio tarot", "cat": "Random"}, {"id": 234, "name": "Acuario tarot", "cat": "Random"}, {"id": 235, "name": "Piscis tarot", "cat": "Random"}, {"id": 236, "name": "Aries circulo", "cat": "Random"}, {"id": 237, "name": "Tauro circulo", "cat": "Random"}, {"id": 238, "name": "Geminis circulo", "cat": "Random"}, {"id": 239, "name": "Cancer circulo", "cat": "Random"}, {"id": 240, "name": "Leo circulo", "cat": "Random"}, {"id": 241, "name": "Virgo circulo", "cat": "Random"}, {"id": 242, "name": "Libra circulo", "cat": "Random"}, {"id": 243, "name": "Escorpio circulo", "cat": "Random"}, {"id": 244, "name": "Sagitario circulo", "cat": "Random"}, {"id": 245, "name": "Capricornio circulo", "cat": "Random"}, {"id": 246, "name": "Acuario circulo", "cat": "Random"}, {"id": 247, "name": "Piscis circulo", "cat": "Random"}, {"id": 248, "name": "Rugrats bebe", "cat": "TV/Series"}, {"id": 249, "name": "Rugrats Angelica", "cat": "TV/Series"}, {"id": 250, "name": "ET", "cat": "TV/Series"}, {"id": 251, "name": "Wall-E", "cat": "TV/Series"}, {"id": 252, "name": "Rad", "cat": "TV/Series"}, {"id": 253, "name": "Johnny Bravo", "cat": "TV/Series"}, {"id": 254, "name": "Corazon", "cat": "TV/Series"}, {"id": 255, "name": "Peppa Pig", "cat": "TV/Series"}, {"id": 256, "name": "Mushu", "cat": "TV/Series"}, {"id": 257, "name": "Pantera Rosa", "cat": "TV/Series"}, {"id": 258, "name": "Taz", "cat": "TV/Series"}, {"id": 259, "name": "Dexter", "cat": "TV/Series"}, {"id": 260, "name": "Johnny Bravo 2", "cat": "TV/Series"}, {"id": 261, "name": "Perro loco", "cat": "TV/Series"}, {"id": 262, "name": "Valiente perro", "cat": "TV/Series"}, {"id": 263, "name": "Peaky Blinders grupo", "cat": "TV/Series"}, {"id": 264, "name": "Tommy Shelby", "cat": "TV/Series"}, {"id": 265, "name": "Tommy gorra", "cat": "TV/Series"}, {"id": 266, "name": "Scooby-Doo van", "cat": "TV/Series"}, {"id": 267, "name": "Scooby-Doo equipo", "cat": "TV/Series"}, {"id": 268, "name": "Scooby-Doo 3", "cat": "TV/Series"}, {"id": 269, "name": "Nemo padre", "cat": "TV/Series"}, {"id": 270, "name": "Nemo", "cat": "TV/Series"}, {"id": 271, "name": "Dory", "cat": "TV/Series"}, {"id": 272, "name": "Tortuga", "cat": "TV/Series"}, {"id": 273, "name": "Gill", "cat": "TV/Series"}, {"id": 274, "name": "Chum", "cat": "TV/Series"}, {"id": 275, "name": "Bloat", "cat": "TV/Series"}, {"id": 276, "name": "Lilo", "cat": "TV/Series"}, {"id": 277, "name": "Stitch 1", "cat": "TV/Series"}, {"id": 278, "name": "Phineas y Ferb 1", "cat": "TV/Series"}, {"id": 279, "name": "Phineas y Ferb 2", "cat": "TV/Series"}, {"id": 280, "name": "Phineas y Ferb 3", "cat": "TV/Series"}, {"id": 281, "name": "Ferb", "cat": "TV/Series"}, {"id": 282, "name": "Perry ornitorrinco", "cat": "TV/Series"}, {"id": 283, "name": "Perry sombrero", "cat": "TV/Series"}, {"id": 284, "name": "Perry agente", "cat": "TV/Series"}, {"id": 285, "name": "Chicas Superpoderosas", "cat": "TV/Series"}, {"id": 286, "name": "Blossom", "cat": "TV/Series"}, {"id": 287, "name": "Bellota", "cat": "TV/Series"}, {"id": 288, "name": "Superpoderosas 2", "cat": "TV/Series"}, {"id": 289, "name": "Superpoderosas 3", "cat": "TV/Series"}, {"id": 290, "name": "Superpoderosas 4", "cat": "TV/Series"}, {"id": 291, "name": "Buttercup", "cat": "TV/Series"}, {"id": 292, "name": "Mike Wazowski", "cat": "TV/Series"}, {"id": 293, "name": "Sully", "cat": "TV/Series"}, {"id": 294, "name": "Monsters University", "cat": "TV/Series"}, {"id": 295, "name": "Fantasmas juguetes", "cat": "TV/Series"}, {"id": 296, "name": "Alien Toy Story", "cat": "TV/Series"}, {"id": 297, "name": "Mr. Potato", "cat": "TV/Series"}, {"id": 298, "name": "Buzz y Woody", "cat": "TV/Series"}, {"id": 299, "name": "Woody", "cat": "TV/Series"}, {"id": 300, "name": "Breaking Bad logo", "cat": "TV/Series"}, {"id": 301, "name": "Heisenberg", "cat": "TV/Series"}, {"id": 302, "name": "Walter White cara", "cat": "TV/Series"}, {"id": 303, "name": "Walter White color", "cat": "TV/Series"}, {"id": 304, "name": "Walter y Jesse", "cat": "TV/Series"}, {"id": 305, "name": "Los Pollos Hermanos", "cat": "TV/Series"}, {"id": 306, "name": "Batman", "cat": "TV/Series"}, {"id": 307, "name": "Superman", "cat": "TV/Series"}, {"id": 308, "name": "Marvel", "cat": "TV/Series"}, {"id": 309, "name": "Capitan America", "cat": "TV/Series"}, {"id": 310, "name": "Hulk puno", "cat": "TV/Series"}, {"id": 311, "name": "Guante Infinito", "cat": "TV/Series"}, {"id": 312, "name": "Groot", "cat": "TV/Series"}, {"id": 313, "name": "Flash", "cat": "TV/Series"}, {"id": 314, "name": "Spiderman", "cat": "TV/Series"}, {"id": 315, "name": "Spiderman 2", "cat": "TV/Series"}, {"id": 316, "name": "Friends marco", "cat": "TV/Series"}, {"id": 317, "name": "Friends puerta", "cat": "TV/Series"}, {"id": 318, "name": "Friends puerta 2", "cat": "TV/Series"}, {"id": 319, "name": "Central Perk", "cat": "TV/Series"}, {"id": 320, "name": "Ross bailando", "cat": "TV/Series"}, {"id": 321, "name": "Ross I'm fine", "cat": "TV/Series"}, {"id": 322, "name": "Chandler pavo", "cat": "TV/Series"}, {"id": 323, "name": "Joey lentes", "cat": "TV/Series"}, {"id": 324, "name": "Lilo 2", "cat": "TV/Series"}, {"id": 325, "name": "Stitch 2", "cat": "TV/Series"}, {"id": 326, "name": "Stitch 3", "cat": "TV/Series"}, {"id": 327, "name": "Stitch 4", "cat": "TV/Series"}, {"id": 328, "name": "Stitch 5", "cat": "TV/Series"}, {"id": 329, "name": "Stitch donuts", "cat": "TV/Series"}, {"id": 330, "name": "Stitch rosa", "cat": "TV/Series"}, {"id": 331, "name": "Stitch guitarra", "cat": "TV/Series"}, {"id": 332, "name": "Stitch Elvis", "cat": "TV/Series"}, {"id": 333, "name": "Stitch rojo", "cat": "TV/Series"}, {"id": 334, "name": "Stitch pirata", "cat": "TV/Series"}, {"id": 335, "name": "Star Wars logo", "cat": "TV/Series"}, {"id": 336, "name": "Stormtrooper cara", "cat": "TV/Series"}, {"id": 337, "name": "Stormtrooper", "cat": "TV/Series"}, {"id": 338, "name": "Darth Vader cuerpo", "cat": "TV/Series"}, {"id": 339, "name": "Darth Vader cara", "cat": "TV/Series"}, {"id": 340, "name": "R2-D2", "cat": "TV/Series"}, {"id": 341, "name": "Halcon Milenario", "cat": "TV/Series"}, {"id": 342, "name": "Mickey stormtrooper", "cat": "TV/Series"}, {"id": 343, "name": "Baby Yoda", "cat": "TV/Series"}, {"id": 344, "name": "Baby Yoda 2", "cat": "TV/Series"}, {"id": 345, "name": "Star Wars letras", "cat": "TV/Series"}, {"id": 346, "name": "Jake el perro", "cat": "TV/Series"}, {"id": 347, "name": "Finn y Jake", "cat": "TV/Series"}, {"id": 348, "name": "Pepino Rick", "cat": "TV/Series"}, {"id": 349, "name": "Pepino roto", "cat": "TV/Series"}, {"id": 350, "name": "Rick frasco", "cat": "TV/Series"}, {"id": 351, "name": "Portal Rick", "cat": "TV/Series"}, {"id": 352, "name": "Rick lentes", "cat": "TV/Series"}, {"id": 353, "name": "Rick Vader", "cat": "TV/Series"}, {"id": 354, "name": "Rick Morty lentes", "cat": "TV/Series"}, {"id": 355, "name": "Rick robot", "cat": "TV/Series"}, {"id": 356, "name": "Rick grita", "cat": "TV/Series"}, {"id": 357, "name": "Rick y Morty", "cat": "TV/Series"}, {"id": 358, "name": "Rick cara", "cat": "TV/Series"}, {"id": 359, "name": "Rick pizza", "cat": "TV/Series"}, {"id": 360, "name": "Dragon Ball Z", "cat": "TV/Series"}, {"id": 361, "name": "Majin Boo blanco", "cat": "TV/Series"}, {"id": 362, "name": "Peleas DBZ", "cat": "TV/Series"}, {"id": 363, "name": "Goku cara", "cat": "TV/Series"}, {"id": 364, "name": "Goku cuerpo", "cat": "TV/Series"}, {"id": 365, "name": "Goku nino", "cat": "TV/Series"}, {"id": 366, "name": "Vegeta", "cat": "TV/Series"}, {"id": 367, "name": "Piccolo", "cat": "TV/Series"}, {"id": 368, "name": "Freezer", "cat": "TV/Series"}, {"id": 369, "name": "Majin Boo rosa", "cat": "TV/Series"}, {"id": 370, "name": "Boo musculoso", "cat": "TV/Series"}, {"id": 371, "name": "Cocodrilo", "cat": "TV/Series"}, {"id": 372, "name": "Mortal Kombat", "cat": "TV/Series"}, {"id": 373, "name": "Kamesennin", "cat": "TV/Series"}, {"id": 374, "name": "Goku kanji", "cat": "TV/Series"}, {"id": 375, "name": "Chicas 1", "cat": "TV/Series"}, {"id": 376, "name": "Chica 2", "cat": "TV/Series"}, {"id": 377, "name": "Chica 3", "cat": "TV/Series"}, {"id": 378, "name": "Chica 4", "cat": "TV/Series"}, {"id": 379, "name": "Chico lentes", "cat": "TV/Series"}, {"id": 380, "name": "Patinaje 1", "cat": "TV/Series"}, {"id": 381, "name": "Patinaje 2", "cat": "TV/Series"}, {"id": 382, "name": "Bob Esponja risa", "cat": "TV/Series"}, {"id": 383, "name": "Chicos patinaje", "cat": "TV/Series"}, {"id": 384, "name": "Bob Esponja", "cat": "TV/Series"}, {"id": 385, "name": "Bob Esponja bolsa", "cat": "TV/Series"}, {"id": 386, "name": "Bob Esponja arcoiris", "cat": "TV/Series"}, {"id": 387, "name": "Bob Esponja 3", "cat": "TV/Series"}, {"id": 388, "name": "Medusa", "cat": "TV/Series"}, {"id": 389, "name": "Mr. Krabs", "cat": "TV/Series"}, {"id": 390, "name": "Bob Esponja 4", "cat": "TV/Series"}, {"id": 391, "name": "Patrick", "cat": "TV/Series"}, {"id": 392, "name": "Patrick 2", "cat": "TV/Series"}, {"id": 393, "name": "Patrick 3", "cat": "TV/Series"}, {"id": 394, "name": "Patrick 4", "cat": "TV/Series"}, {"id": 395, "name": "Caracol Gary", "cat": "TV/Series"}, {"id": 396, "name": "Plankton", "cat": "TV/Series"}, {"id": 397, "name": "Calamar", "cat": "TV/Series"}, {"id": 398, "name": "Calamar 2", "cat": "TV/Series"}, {"id": 399, "name": "Calamar 3", "cat": "TV/Series"}, {"id": 400, "name": "Harry Potter trio", "cat": "TV/Series"}, {"id": 401, "name": "Corbatas HP", "cat": "TV/Series"}, {"id": 402, "name": "Anden 9 3/4", "cat": "TV/Series"}, {"id": 403, "name": "Carta HP", "cat": "TV/Series"}, {"id": 404, "name": "Hedwig", "cat": "TV/Series"}, {"id": 405, "name": "Sombrero seleccionador", "cat": "TV/Series"}, {"id": 406, "name": "Feliz cumple Harry", "cat": "TV/Series"}, {"id": 407, "name": "Snitch dorada", "cat": "TV/Series"}, {"id": 408, "name": "Gryffindor", "cat": "TV/Series"}, {"id": 409, "name": "Ravenclaw", "cat": "TV/Series"}, {"id": 410, "name": "Hufflepuff", "cat": "TV/Series"}, {"id": 411, "name": "Slytherin", "cat": "TV/Series"}, {"id": 412, "name": "Cerdo HP", "cat": "TV/Series"}, {"id": 413, "name": "HP arcoiris", "cat": "TV/Series"}, {"id": 414, "name": "Homero", "cat": "TV/Series"}, {"id": 415, "name": "Homero rock", "cat": "TV/Series"}, {"id": 416, "name": "Bart", "cat": "TV/Series"}, {"id": 417, "name": "Bart skater", "cat": "TV/Series"}, {"id": 418, "name": "Lisa 1", "cat": "TV/Series"}, {"id": 419, "name": "Lisa 2", "cat": "TV/Series"}, {"id": 420, "name": "Lisa 3", "cat": "TV/Series"}, {"id": 421, "name": "Lisa 4", "cat": "TV/Series"}, {"id": 422, "name": "Maggie", "cat": "TV/Series"}, {"id": 423, "name": "Ralph", "cat": "TV/Series"}, {"id": 424, "name": "Bart grunge", "cat": "TV/Series"}, {"id": 425, "name": "Barney", "cat": "TV/Series"}, {"id": 426, "name": "Duff", "cat": "TV/Series"}, {"id": 427, "name": "Dona", "cat": "TV/Series"}, {"id": 428, "name": "Mono fumando", "cat": "TV/Series"}, {"id": 429, "name": "Numero 10", "cat": "Deportes"}, {"id": 430, "name": "Maradona retrato", "cat": "Deportes"}, {"id": 431, "name": "Maradona poster", "cat": "Deportes"}, {"id": 432, "name": "Maradona futbol", "cat": "Deportes"}, {"id": 433, "name": "10 azul", "cat": "Deportes"}, {"id": 434, "name": "Maradona gol", "cat": "Deportes"}, {"id": 435, "name": "Santo Maradona", "cat": "Deportes"}, {"id": 436, "name": "GOAT", "cat": "Deportes"}, {"id": 437, "name": "Messi 10", "cat": "Deportes"}, {"id": 438, "name": "Messi copa", "cat": "Deportes"}, {"id": 439, "name": "Messi espalda", "cat": "Deportes"}, {"id": 440, "name": "Messi lentes", "cat": "Deportes"}, {"id": 441, "name": "AFA 11", "cat": "Deportes"}, {"id": 442, "name": "Messi AFA", "cat": "Deportes"}, {"id": 443, "name": "Di Maria", "cat": "Deportes"}, {"id": 444, "name": "Dibu Martinez", "cat": "Deportes"}, {"id": 445, "name": "Dibu salto", "cat": "Deportes"}, {"id": 446, "name": "San Dibu", "cat": "Deportes"}, {"id": 447, "name": "Messi cartas", "cat": "Deportes"}, {"id": 448, "name": "Messi tarjeta", "cat": "Deportes"}, {"id": 449, "name": "Copa del Mundo", "cat": "Deportes"}, {"id": 450, "name": "AFA escudo", "cat": "Deportes"}, {"id": 451, "name": "Argentina Campeon", "cat": "Deportes"}, {"id": 452, "name": "Piloto F1 casco", "cat": "Deportes"}, {"id": 453, "name": "Franco Colapinto", "cat": "Deportes"}, {"id": 454, "name": "Casco F1", "cat": "Deportes"}, {"id": 455, "name": "Piloto retrato", "cat": "Deportes"}, {"id": 456, "name": "NOB Newells", "cat": "Deportes"}, {"id": 457, "name": "NOB estrella", "cat": "Deportes"}, {"id": 458, "name": "No al VAR", "cat": "Deportes"}, {"id": 459, "name": "Newells cuervo", "cat": "Deportes"}, {"id": 460, "name": "Newells letras", "cat": "Deportes"}, {"id": 461, "name": "Newells jugador", "cat": "Deportes"}, {"id": 462, "name": "Newells 2", "cat": "Deportes"}, {"id": 463, "name": "Newells 3", "cat": "Deportes"}, {"id": 464, "name": "Newells 4", "cat": "Deportes"}, {"id": 465, "name": "Rosario Central", "cat": "Deportes"}, {"id": 466, "name": "Central escudo", "cat": "Deportes"}, {"id": 467, "name": "Central letras", "cat": "Deportes"}, {"id": 468, "name": "Gitano Central", "cat": "Deportes"}, {"id": 469, "name": "Central 2", "cat": "Deportes"}, {"id": 470, "name": "Central copa", "cat": "Deportes"}, {"id": 471, "name": "Central jugador", "cat": "Deportes"}, {"id": 472, "name": "Boca escudo", "cat": "Deportes"}, {"id": 473, "name": "CABJ logo", "cat": "Deportes"}, {"id": 474, "name": "CABJ letras", "cat": "Deportes"}, {"id": 475, "name": "Boca botella", "cat": "Deportes"}, {"id": 476, "name": "Maradona Boca", "cat": "Deportes"}, {"id": 477, "name": "La Bombonera", "cat": "Deportes"}, {"id": 478, "name": "Bilardo", "cat": "Deportes"}, {"id": 479, "name": "Boca jugador", "cat": "Deportes"}, {"id": 480, "name": "Boca 2", "cat": "Deportes"}, {"id": 481, "name": "Camiseta Roman", "cat": "Deportes"}, {"id": 482, "name": "Boca mono", "cat": "Deportes"}, {"id": 483, "name": "River escudo", "cat": "Deportes"}, {"id": 484, "name": "River logo rojo", "cat": "Deportes"}, {"id": 485, "name": "River Plate", "cat": "Deportes"}, {"id": 486, "name": "River jugador", "cat": "Deportes"}, {"id": 487, "name": "River 2", "cat": "Deportes"}, {"id": 488, "name": "River mapa", "cat": "Deportes"}, {"id": 489, "name": "Estadio River", "cat": "Deportes"}, {"id": 490, "name": "Independiente", "cat": "Deportes"}, {"id": 491, "name": "Club Atletico", "cat": "Deportes"}, {"id": 492, "name": "Atletico rojo", "cat": "Deportes"}, {"id": 493, "name": "Numero 7", "cat": "Deportes"}, {"id": 494, "name": "Racing", "cat": "Deportes"}, {"id": 495, "name": "Racing R", "cat": "Deportes"}, {"id": 496, "name": "Racing azul", "cat": "Deportes"}, {"id": 497, "name": "San Lorenzo", "cat": "Deportes"}, {"id": 498, "name": "San Lorenzo 2", "cat": "Deportes"}, {"id": 499, "name": "F1 naranja", "cat": "Deportes"}, {"id": 500, "name": "F1 McLaren", "cat": "Deportes"}, {"id": 501, "name": "VER Verstappen", "cat": "Deportes"}, {"id": 502, "name": "COL Piastri", "cat": "Deportes"}, {"id": 503, "name": "LEC Leclerc", "cat": "Deportes"}, {"id": 504, "name": "HAM Hamilton", "cat": "Deportes"}, {"id": 505, "name": "NOR Norris", "cat": "Deportes"}, {"id": 506, "name": "PIA Piastri", "cat": "Deportes"}, {"id": 507, "name": "RUS Russell", "cat": "Deportes"}, {"id": 508, "name": "ALO Alonso", "cat": "Deportes"}, {"id": 509, "name": "Schumacher", "cat": "Deportes"}, {"id": 510, "name": "Senna Ferrari", "cat": "Deportes"}, {"id": 511, "name": "Senna Honda", "cat": "Deportes"}, {"id": 512, "name": "Piloto Red Bull", "cat": "Deportes"}, {"id": 513, "name": "Jordan 23", "cat": "Deportes"}, {"id": 514, "name": "Curry 30", "cat": "Deportes"}, {"id": 515, "name": "Jordan vuelo", "cat": "Deportes"}, {"id": 516, "name": "Jordan canasta", "cat": "Deportes"}, {"id": 517, "name": "Kobe Bryant", "cat": "Deportes"}, {"id": 518, "name": "Kobe 24", "cat": "Deportes"}, {"id": 519, "name": "Kobe espalda", "cat": "Deportes"}, {"id": 520, "name": "Curry 2", "cat": "Deportes"}, {"id": 521, "name": "Tatum", "cat": "Deportes"}, {"id": 522, "name": "Khabib", "cat": "Deportes"}, {"id": 523, "name": "Pelea UFC", "cat": "Deportes"}, {"id": 525, "name": "Tyson", "cat": "Deportes"}, {"id": 526, "name": "Pelea box", "cat": "Deportes"}, {"id": 527, "name": "Ronaldo", "cat": "Deportes"}, {"id": 528, "name": "Sol de Mayo", "cat": "Patria y Mas"}, {"id": 529, "name": "Made in Argentina", "cat": "Patria y Mas"}, {"id": 530, "name": "Mapa Argentina", "cat": "Patria y Mas"}, {"id": 531, "name": "Mapa Islas", "cat": "Patria y Mas"}, {"id": 532, "name": "Argentina sol", "cat": "Patria y Mas"}, {"id": 533, "name": "Argentina letras", "cat": "Patria y Mas"}, {"id": 534, "name": "Cal-mate to-mate", "cat": "Patria y Mas"}, {"id": 535, "name": "Exceso de mate", "cat": "Patria y Mas"}, {"id": 536, "name": "Termo", "cat": "Patria y Mas"}, {"id": 537, "name": "Mate", "cat": "Patria y Mas"}, {"id": 538, "name": "Jesus mate", "cat": "Patria y Mas"}, {"id": 539, "name": "Fernet", "cat": "Patria y Mas"}, {"id": 540, "name": "Quilombo", "cat": "Patria y Mas"}, {"id": 541, "name": "Tranqui", "cat": "Patria y Mas"}, {"id": 542, "name": "Churros", "cat": "Patria y Mas"}, {"id": 543, "name": "Ruta 40", "cat": "Patria y Mas"}, {"id": 544, "name": "California", "cat": "Patria y Mas"}, {"id": 545, "name": "Las Vegas", "cat": "Patria y Mas"}, {"id": 546, "name": "Estatua Libertad", "cat": "Patria y Mas"}, {"id": 547, "name": "Nueva York", "cat": "Patria y Mas"}, {"id": 548, "name": "Londres", "cat": "Patria y Mas"}, {"id": 549, "name": "Underground", "cat": "Patria y Mas"}, {"id": 550, "name": "Paris", "cat": "Patria y Mas"}, {"id": 551, "name": "Opera Sydney", "cat": "Patria y Mas"}, {"id": 552, "name": "Logo Nico Sticky", "cat": "Capsula Nico Sticky"}, {"id": 553, "name": "Nico cafe", "cat": "Capsula Nico Sticky"}, {"id": 554, "name": "Nico busto", "cat": "Capsula Nico Sticky"}, {"id": 555, "name": "Nico en moto", "cat": "Capsula Nico Sticky"}, {"id": 556, "name": "Nico saludando", "cat": "Capsula Nico Sticky"}, {"id": 557, "name": "El Club de la Calco", "cat": "Capsula Nico Sticky"}, {"id": 558, "name": "Nico fantasma", "cat": "Capsula Nico Sticky"}, {"id": 559, "name": "Nico Messi", "cat": "Capsula Nico Sticky"}, {"id": 560, "name": "Nico abrazo", "cat": "Capsula Nico Sticky"}, {"id": 561, "name": "Nico panda", "cat": "Capsula Nico Sticky"}, {"id": 562, "name": "Nico Mike y Sully", "cat": "Capsula Nico Sticky"}, {"id": 563, "name": "Nico guitarrista", "cat": "Capsula Nico Sticky"}];

const STOCK_DEFAULT = {"1":3,"2":3,"3":2,"4":3,"5":1,"6":3,"7":2,"8":2,"9":2,"10":5,"11":3,"12":3,"13":2,"14":1,"15":1,"16":4,"17":1,"18":2,"19":2,"20":3,"21":3,"22":4,"23":1,"24":1,"25":0,"26":3,"27":1,"28":1,"29":2,"30":1,"31":5,"32":2,"33":0,"34":3,"35":2,"36":1,"37":1,"38":1,"39":1,"40":0,"41":3,"42":2,"43":3,"44":3,"45":1,"46":2,"47":2,"48":3,"49":3,"50":3,"51":2,"52":1,"53":2,"54":3,"55":3,"56":3,"57":4,"58":3,"59":2,"60":1,"61":2,"62":3,"63":2,"64":1,"65":3,"66":3,"67":2,"68":2,"69":2,"70":1,"71":2,"72":1,"73":2,"74":2,"75":2,"76":2,"77":1,"78":2,"79":1,"80":1,"81":2,"82":3,"83":2,"84":2,"85":2,"86":1,"87":0,"88":2,"89":1,"90":1,"91":2,"92":2,"93":2,"94":2,"95":2,"96":3,"97":3,"98":2,"99":3,"100":3,"101":2,"102":2,"103":2,"104":1,"105":0,"106":1,"107":1,"108":2,"109":1,"110":1,"111":2,"112":1,"113":2,"114":2,"115":1,"116":1,"117":2,"118":2,"119":1,"120":1,"121":1,"122":2,"123":2,"124":2,"125":2,"126":2,"127":1,"128":2,"129":1,"130":2,"131":2,"132":2,"133":2,"134":3,"135":2,"136":2,"137":2,"138":3,"139":3,"140":2,"141":2,"142":2,"143":2,"144":3,"145":2,"146":2,"147":2,"148":2,"149":2,"150":2,"151":2,"152":1,"153":1,"154":1,"155":2,"156":1,"157":1,"158":1,"159":1,"160":1,"161":1,"162":1,"163":1,"164":2,"165":2,"166":2,"167":1,"168":2,"169":1,"170":1,"171":2,"172":2,"173":3,"174":2,"175":2,"176":1,"177":2,"178":3,"179":1,"180":1,"181":1,"182":3,"183":1,"184":2,"185":2,"186":1,"187":1,"188":2,"189":1,"190":2,"191":1,"192":2,"193":2,"194":1,"195":1,"196":1,"197":5,"198":2,"199":1,"200":2,"201":1,"202":1,"203":1,"204":2,"205":3,"206":2,"207":2,"208":2,"209":1,"210":2,"211":2,"212":1,"213":2,"214":2,"215":2,"216":2,"217":2,"218":2,"219":2,"220":1,"221":2,"222":4,"223":2,"224":1,"225":2,"226":1,"227":2,"228":2,"229":2,"230":1,"231":2,"232":3,"233":1,"234":2,"235":2,"236":1,"237":2,"238":2,"239":2,"240":1,"241":2,"242":1,"243":2,"244":2,"245":2,"246":3,"247":2,"248":1,"249":2,"250":1,"251":1,"252":2,"253":2,"254":1,"255":2,"256":2,"257":1,"258":1,"259":1,"260":1,"261":2,"262":1,"263":2,"264":1,"265":2,"266":2,"267":1,"268":2,"269":2,"270":1,"271":1,"272":0,"273":2,"274":1,"275":2,"276":2,"277":2,"278":1,"279":2,"280":2,"281":2,"282":1,"283":2,"284":1,"285":1,"286":1,"287":1,"288":2,"289":1,"290":1,"291":1,"292":2,"293":2,"294":2,"295":2,"296":0,"297":2,"298":1,"299":1,"300":2,"301":2,"302":2,"303":1,"304":1,"305":1,"306":1,"307":1,"308":1,"309":1,"310":2,"311":2,"312":1,"313":1,"314":1,"315":2,"316":4,"317":2,"318":1,"319":1,"320":1,"321":1,"322":1,"323":1,"324":1,"325":1,"326":1,"327":0,"328":2,"329":1,"330":3,"331":0,"332":1,"333":2,"334":2,"335":2,"336":1,"337":2,"338":2,"339":2,"340":2,"341":2,"342":1,"343":1,"344":1,"345":1,"346":2,"347":2,"348":2,"349":2,"350":2,"351":2,"352":2,"353":1,"354":2,"355":1,"356":2,"357":2,"358":2,"359":2,"360":2,"361":2,"362":1,"363":2,"364":1,"365":2,"366":1,"367":2,"368":1,"369":2,"370":1,"371":2,"372":2,"373":2,"374":2,"375":4,"376":2,"377":2,"378":2,"379":2,"380":2,"381":2,"382":2,"383":2,"384":2,"385":2,"386":1,"387":1,"388":2,"389":2,"390":2,"391":2,"392":2,"393":2,"394":2,"395":2,"396":2,"397":2,"398":2,"399":2,"400":2,"401":2,"402":1,"403":2,"404":2,"405":2,"406":2,"407":1,"408":2,"409":2,"410":2,"411":2,"412":2,"413":2,"414":2,"415":2,"416":1,"417":2,"418":2,"419":4,"420":1,"421":2,"422":2,"423":2,"424":2,"425":2,"426":2,"427":2,"428":2,"429":2,"430":2,"431":2,"432":2,"433":3,"434":0,"435":2,"436":1,"437":3,"438":1,"439":2,"440":2,"441":2,"442":2,"443":1,"444":2,"445":2,"446":2,"447":2,"448":2,"449":2,"450":2,"451":2,"452":2,"453":1,"454":4,"455":2,"456":3,"457":2,"458":1,"459":1,"460":2,"461":1,"462":1,"463":1,"464":2,"465":2,"466":2,"467":2,"468":2,"469":2,"470":2,"471":2,"472":2,"473":2,"474":1,"475":2,"476":2,"477":2,"478":3,"479":2,"480":2,"481":2,"482":1,"483":1,"484":2,"485":2,"486":2,"487":2,"488":2,"489":2,"490":2,"491":2,"492":2,"493":2,"494":2,"495":2,"496":2,"497":2,"498":1,"499":2,"500":2,"501":2,"502":2,"503":2,"504":2,"505":2,"506":2,"507":2,"508":2,"509":2,"510":2,"511":2,"512":2,"513":2,"514":0,"515":2,"516":1,"517":2,"518":2,"519":2,"520":2,"521":2,"522":2,"523":2,"525":2,"526":0,"527":2,"528":2,"529":2,"530":2,"531":1,"532":2,"533":1,"534":0,"535":0,"536":1,"537":1,"538":3,"539":1,"540":3,"541":2,"542":2,"543":3,"544":2,"545":2,"546":2,"547":2,"548":1,"549":2,"550":1,"551":1,"552":6,"553":3,"554":2,"555":2,"556":3,"557":1,"558":0,"559":1,"560":1,"561":2,"562":1,"563":3};

const CAT_COLORS = {
  "Vida Salvaje": "#e8445a",
  "Festival Sticky": "#2db855",
  "Marcas": "#f59e0b",
  "Random": "#8b5cf6",
  "TV/Series": "#3b82f6",
  "Deportes": "#10b981",
  "Patria y Mas": "#f97316",
  "Capsula Nico Sticky": "#ec4899",
};

const CAT_EMOJIS = {
  "Vida Salvaje": "🐾", "Festival Sticky": "🎵", "Marcas": "👟",
  "Random": "✨", "TV/Series": "📺", "Deportes": "⚽",
  "Patria y Mas": "🇦🇷", "Capsula Nico Sticky": "👽",
};

const ADMIN_PASS = "ecdlc2025";
const WA_NUMBER = "5491100000000"; // ⚠️ Cambiá por tu número

// ── THEME TOKENS (light + dark) ──
const THEMES = {
  dark: {
    bg: "#15302a", bgAlt: "#1a3a31", surface: "rgba(255,255,255,.05)", surfaceHover: "rgba(255,255,255,.09)",
    text: "#f5f0e3", textSoft: "rgba(245,240,227,.62)", textFaint: "rgba(245,240,227,.38)",
    sage: "#5cb88a", coral: "#f0707f", gold: "#e0b94e", border: "rgba(255,255,255,.1)",
    navBg: "rgba(21,48,42,.92)", heroGrad: "linear-gradient(180deg,#15302a 0%,#102420 100%)",
    cardBg: "rgba(255,255,255,.04)",
  },
  light: {
    bg: "#faf7ef", bgAlt: "#f2ede0", surface: "rgba(31,68,56,.05)", surfaceHover: "rgba(31,68,56,.1)",
    text: "#1f4438", textSoft: "rgba(31,68,56,.7)", textFaint: "rgba(31,68,56,.45)",
    sage: "#3ea872", coral: "#e8556b", gold: "#c79a2e", border: "rgba(31,68,56,.14)",
    navBg: "rgba(250,247,239,.92)", heroGrad: "linear-gradient(180deg,#faf7ef 0%,#f0ebdc 100%)",
    cardBg: "rgba(31,68,56,.04)",
  },
};

// ── TOAST CONTEXT (lightweight) ──
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = (msg, kind = "info") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  };
  return { toasts, push };
}

function ToastStack({ toasts, T }) {
  return (
    <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 500, display: "flex", flexDirection: "column", gap: 8, alignItems: "center", pointerEvents: "none", width: "max-content", maxWidth: "90vw" }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.kind === "success" ? T.sage : t.kind === "error" ? T.coral : T.bgAlt,
          color: t.kind === "info" ? T.text : "#fff",
          padding: "10px 18px", borderRadius: 50, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: ".82rem",
          boxShadow: "0 6px 24px rgba(0,0,0,.25)", animation: "toastIn .3s ease", border: t.kind === "info" ? `1px solid ${T.border}` : "none",
        }}>{t.msg}</div>
      ))}
    </div>
  );
}

// ── MAIN APP ──
export default function App() {
  const [theme, setTheme] = useState("dark");
  const T = THEMES[theme];
  const [page, setPage] = useState("home");
  const [cat, setCat] = useState("Todos");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});
  const [favs, setFavs] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminLogged, setAdminLogged] = useState(false);
  const [adminTab, setAdminTab] = useState("metrics");
  const [orders, setOrders] = useState([]);
  const [stock, setStock] = useState({ ...STOCK_DEFAULT });
  const [stockSearch, setStockSearch] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);
  const [savedErr, setSavedErr] = useState("");
  const [formData, setFormData] = useState({ nombre: "", contacto: "", size: "", customSize: "", qty: "", mat: "v", nota: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [dbLoading, setDbLoading] = useState(true);
  const [zoomSticker, setZoomSticker] = useState(null);
  const { toasts, push } = useToasts();

  // Load stock from Supabase on mount
  useEffect(() => {
    sbGet("stickers", "select=id,stock")
      .then(rows => {
        if (rows && rows.length > 0) {
          const s = {};
          rows.forEach(r => { s[String(r.id)] = r.stock; });
          setStock(s);
        }
        setDbLoading(false);
      })
      .catch(() => setDbLoading(false));
  }, []);

  function loadOrders() {
    sbGet("orders", "select=*&order=created_at.desc")
      .then(rows => { if (rows) setOrders(rows); })
      .catch(err => console.warn("Orders load error:", err.message));
  }

  const ALL_CATS = useMemo(() => ["Todos", ...Object.keys(CAT_COLORS)], []);

  const filtered = useMemo(() => {
    let list = cat === "Todos" ? STICKERS_RAW : STICKERS_RAW.filter(s => s.cat === cat);
    if (search) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || String(s.id).includes(search));
    return list;
  }, [cat, search]);

  const cartTotal = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartItems = Object.keys(cart).map(id => ({ ...STICKERS_RAW.find(s => s.id === Number(id)), qty: cart[id] })).filter(Boolean);

  function toggleCart(id) {
    const q = stock[String(id)] ?? 1;
    if (q === 0) { push("Sin stock disponible", "error"); return; }
    setCart(prev => {
      if (prev[id]) { const n = { ...prev }; delete n[id]; push("Quitado del pedido", "info"); return n; }
      push("¡Agregado al pedido!", "success");
      return { ...prev, [id]: 1 };
    });
  }

  function changeQty(id, d) {
    const max = stock[String(id)] ?? 1;
    setCart(prev => {
      const next = Math.max(1, Math.min(max, (prev[id] || 1) + d));
      if (d > 0 && (prev[id] || 1) >= max) push("Llegaste al máximo en stock", "info");
      return { ...prev, [id]: next };
    });
  }

  function toggleFav(id) {
    setFavs(prev => {
      if (prev[id]) { const n = { ...prev }; delete n[id]; return n; }
      return { ...prev, [id]: true };
    });
  }

  function buildWAMsg() {
    const lines = cartItems.map(i => "• #" + i.id + " - " + i.name + " (x" + i.qty + ")").join("\n");
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent("¡Hola! Quiero pedir estas calcos:\n" + lines + "\n\nTotal: " + cartTotal + " calcos\n¿Me pasás info?");
  }

  function saveCartOrder() {
    if (cartItems.length === 0) return;
    const o = {
      id: "C" + Date.now(), nombre: "Pedido catálogo", contacto: "",
      detalle: cartItems.map(i => "#" + i.id + " " + i.name + " x" + i.qty).join(", "),
      items_json: JSON.stringify(cartItems.map(i => ({ id: i.id, name: i.name, cat: i.cat, qty: i.qty }))),
      tipo: "catalogo", estado: "recibido", fecha: new Date().toLocaleDateString("es-AR"),
    };
    sbInsert("orders", o).catch(err => console.warn("Cart order save:", err.message));
  }

  function submitOrder() {
    const sizes = ["5×5 cm", "7×7 cm", "10×10 cm"];
    const o = {
      id: "P" + Date.now(), nombre: formData.nombre, contacto: formData.contacto,
      detalle: (formData.size === "c" ? formData.customSize : sizes[Number(formData.size)]) + " · " + formData.qty + " u · " + (formData.mat === "h" ? "Holográfico" : formData.mat === "t" ? "Transparente" : "Vinilo") + (formData.nota ? " · " + formData.nota : ""),
      tipo: "personalizado", estado: "recibido", fecha: new Date().toLocaleDateString("es-AR"),
    };
    setOrders(prev => [o, ...prev]);
    setFormSubmitted(true);
    sbInsert("orders", o).catch(err => console.warn("Order save error:", err.message));
  }

  function updateOrderStatus(id, estado) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, estado } : o));
    sbUpdate("orders", "id=eq." + id, { estado }).catch(err => console.warn("Status update:", err.message));
  }

  function deleteOrder(id) {
    setOrders(prev => prev.filter(o => o.id !== id));
    sbDelete("orders", "id=eq." + id).catch(err => console.warn("Delete order:", err.message));
  }

  function adjStock(id, d) {
    setStock(prev => ({ ...prev, [String(id)]: Math.max(0, (prev[String(id)] || 0) + d) }));
  }

  function saveStock() {
    setSavedMsg(false); setSavedErr("");
    const rows = STICKERS_RAW.map(s => ({ id: s.id, name: s.name, cat: s.cat, stock: stock[String(s.id)] !== undefined ? stock[String(s.id)] : (STOCK_DEFAULT[String(s.id)] || 0) }));
    sbUpsert("stickers", rows)
      .then(() => { setSavedMsg(true); push("Stock guardado en Supabase", "success"); setTimeout(() => setSavedMsg(false), 2500); })
      .catch(err => { setSavedErr("Error: " + err.message); push("Error al guardar stock", "error"); setTimeout(() => setSavedErr(""), 4000); });
  }

  const favList = Object.keys(favs).map(id => STICKERS_RAW.find(s => s.id === Number(id))).filter(Boolean);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: T.bg, color: T.text, minHeight: "100vh", overflowX: "clip", transition: "background .4s, color .4s" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes floaty{0%,100%{transform:translateY(0) rotate(var(--r))}50%{transform:translateY(-14px) rotate(var(--r))}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}*{-webkit-tap-highlight-color:transparent}"}</style>

      <Nav T={T} page={page} setPage={setPage} cartCount={cartTotal} onCart={() => setCartOpen(true)} onAdmin={() => setAdminOpen(true)} theme={theme} setTheme={setTheme} favCount={favList.length} />

      {page === "home" && <Home T={T} onCatalog={() => setPage("catalog")} onCustom={() => setPage("custom")} onCatSelect={c => { setCat(c); setPage("catalog"); }} stock={stock} />}
      {page === "catalog" && <CatalogPage T={T} allCats={ALL_CATS} activeCat={cat} onCat={setCat} search={search} onSearch={setSearch} filtered={filtered} cart={cart} stock={stock} favs={favs} onToggle={toggleCart} onQty={changeQty} onFav={toggleFav} onZoom={setZoomSticker} favList={favList} />}
      {page === "custom" && <CustomPage T={T} formData={formData} onForm={setFormData} formSubmitted={formSubmitted} onSubmit={submitOrder} onReset={() => { setFormSubmitted(false); setFormData({ nombre: "", contacto: "", size: "", customSize: "", qty: "", mat: "v", nota: "" }); }} push={push} />}

      <CartDrawer T={T} open={cartOpen} onClose={() => setCartOpen(false)} cartItems={cartItems} cartTotal={cartTotal} onQty={changeQty} onRemove={toggleCart} waMsg={buildWAMsg()} onClear={() => setCart({})} onSaveOrder={saveCartOrder} stock={stock} />

      {zoomSticker && <ZoomModal T={T} s={zoomSticker} stock={stock} inCart={!!cart[zoomSticker.id]} isFav={!!favs[zoomSticker.id]} onClose={() => setZoomSticker(null)} onToggle={toggleCart} onFav={toggleFav} />}

      <AdminModal T={T} open={adminOpen} onClose={() => setAdminOpen(false)} logged={adminLogged}
        onLogin={pass => { if (pass === ADMIN_PASS) { setAdminLogged(true); loadOrders(); } else push("Contraseña incorrecta", "error"); }}
        tab={adminTab} onTab={t => { setAdminTab(t); if (t === "orders") loadOrders(); }}
        orders={orders} onOrderStatus={updateOrderStatus} onDeleteOrder={deleteOrder}
        stock={stock} onAdjStock={adjStock} onSaveStock={saveStock} savedMsg={savedMsg} savedErr={savedErr}
        stockSearch={stockSearch} onStockSearch={setStockSearch} dbLoading={dbLoading} />

      <ToastStack toasts={toasts} T={T} />
    </div>
  );
}

// ── NAV ──
function Nav({ T, page, setPage, cartCount, onCart, onAdmin, theme, setTheme, favCount }) {
  const pages = [["home", "Inicio"], ["catalog", "Catálogo"], ["custom", "Personalizadas"]];
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onResize = () => { const m = window.innerWidth < 640; setIsMobile(m); if (!m) setMenuOpen(false); };
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);
  const goTo = p => { setPage(p); setMenuOpen(false); };
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: T.navBg, backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem", height: 58, boxShadow: scrolled ? "0 4px 18px rgba(0,0,0,.12)" : "none", transition: "box-shadow .3s" }}>
      <div onClick={() => goTo("home")} style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(1.15rem,4vw,1.35rem)", letterSpacing: 1.5, cursor: "pointer", color: T.text, display: "flex", alignItems: "center", gap: 2, whiteSpace: "nowrap", overflow: "hidden", flexShrink: 0 }}>
        EL CLUB<span style={{ display: "inline-block", maxWidth: scrolled ? 220 : 0, overflow: "hidden", transition: "max-width .4s ease", verticalAlign: "bottom" }}>&nbsp;DE LA CALCO</span><span style={{ color: T.coral }}>.</span>
      </div>

      {/* Desktop links */}
      {!isMobile && (
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          {pages.map(([p, label]) => (
            <button key={p} onClick={() => goTo(p)} style={{ background: page === p ? T.sage : "transparent", color: page === p ? "#fff" : T.textSoft, border: "none", borderRadius: 50, padding: "6px 12px", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: ".74rem", cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>{label}</button>
          ))}
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Cambiar tema" style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: ".9rem", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 2 }}>{theme === "dark" ? "☀️" : "🌙"}</button>
          <button onClick={onCart} style={{ position: "relative", background: T.sage, color: "#fff", border: "none", borderRadius: 50, padding: "6px 12px", fontWeight: 900, fontSize: ".8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            🛒{cartCount > 0 && <span style={{ background: T.coral, color: "#fff", borderRadius: "50%", minWidth: 17, height: 17, fontSize: ".6rem", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", fontWeight: 900 }}>{cartCount}</span>}
          </button>
          <button onClick={onAdmin} title="Panel admin" style={{ background: "transparent", border: "none", color: T.textFaint, fontSize: "1rem", cursor: "pointer", padding: "4px" }}>⚙️</button>
        </div>
      )}

      {/* Mobile: cart + hamburger */}
      {isMobile && (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={onCart} style={{ position: "relative", background: T.sage, color: "#fff", border: "none", borderRadius: 50, padding: "7px 13px", fontWeight: 900, fontSize: ".85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            🛒{cartCount > 0 && <span style={{ background: T.coral, color: "#fff", borderRadius: "50%", minWidth: 17, height: 17, fontSize: ".6rem", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", fontWeight: 900 }}>{cartCount}</span>}
          </button>
          <button onClick={() => setMenuOpen(v => !v)} title="Menú" style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 9, width: 36, height: 36, cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", color: T.text }}>{menuOpen ? "✕" : "☰"}</button>
        </div>
      )}

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{ position: "absolute", top: 58, left: 0, right: 0, background: T.navBg, backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.border}`, boxShadow: "0 8px 24px rgba(0,0,0,.18)", padding: "0.6rem", display: "flex", flexDirection: "column", gap: 4 }}>
          {pages.map(([p, label]) => (
            <button key={p} onClick={() => goTo(p)} style={{ background: page === p ? T.sage : "transparent", color: page === p ? "#fff" : T.text, border: "none", borderRadius: 10, padding: "12px 16px", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: ".95rem", cursor: "pointer", textAlign: "left" }}>{label}</button>
          ))}
          <div style={{ display: "flex", gap: 8, padding: "4px 4px 2px" }}>
            <button onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); }} style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "11px", cursor: "pointer", fontSize: ".88rem", fontWeight: 800, color: T.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>{theme === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro"}</button>
            <button onClick={() => { onAdmin(); setMenuOpen(false); }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "11px 16px", cursor: "pointer", fontSize: ".88rem", fontWeight: 800, color: T.textSoft }}>⚙️</button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── HOME ──
function Home({ T, onCatalog, onCustom, onCatSelect, stock }) {
  const floatStickers = [
    { e: "👽", r: "-12deg", l: "8%", d: "0s", s: "2.6rem" },
    { e: "⚽", r: "10deg", l: "82%", d: ".6s", s: "2.2rem" },
    { e: "🎸", r: "-6deg", l: "70%", d: "1.1s", s: "2rem" },
    { e: "🐾", r: "14deg", l: "20%", d: "1.5s", s: "1.9rem" },
    { e: "🏎️", r: "-16deg", l: "90%", d: ".3s", s: "1.8rem" },
    { e: "🇦🇷", r: "8deg", l: "4%", d: "1.9s", s: "1.7rem" },
  ];
  const promos = [
    { icon: "🔥", title: "3x2 en todo el catálogo", desc: "Llevá 3 calcos y pagá 2. Se aplica automáticamente al pedir.", tag: "PROMO ESTRELLA", color: T.coral },
    { icon: "📦", title: "Pack x10 a $1.200 c/u", desc: "Armá tu combo de 10 stickers y bajá el precio por unidad.", tag: "COMBO", color: T.sage },
    { icon: "🚚", title: "Envío gratis +$15.000", desc: "Superá los $15.000 en tu compra y el envío corre por nuestra cuenta.", tag: "ENVÍO", color: T.gold },
  ];
  const why = [
    { icon: "💪", t: "Resistentes de verdad", d: "No se despegan fácil y mantienen los colores vivos con el tiempo." },
    { icon: "✨", t: "Diseños únicos", d: "Más de 560 modelos que no vas a encontrar en ningún otro lado." },
    { icon: "🎨", t: "100% personalizable", d: "Pedinos algo hecho a tu medida, solo para vos." },
    { icon: "💚", t: "Atención con onda", d: "Nos encanta que cada cliente se sienta parte del club." },
  ];
  return (
    <div>
      {/* HERO */}
      <div style={{ position: "relative", textAlign: "center", padding: "3.2rem 1.5rem 3.6rem", background: T.heroGrad, overflow: "hidden" }}>
        {floatStickers.map((f, i) => (
          <div key={i} style={{ position: "absolute", left: f.l, top: (15 + (i % 3) * 26) + "%", fontSize: f.s, opacity: .5, "--r": f.r, animation: `floaty ${3 + i * .4}s ease-in-out ${f.d} infinite`, pointerEvents: "none" }}>{f.e}</div>
        ))}
        <div style={{ fontSize: ".72rem", fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", color: T.coral, position: "relative" }}>✦ Bienvenidos al club ✦</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(2.8rem,11vw,5.5rem)", lineHeight: .9, letterSpacing: 2, margin: "10px 0", position: "relative" }}>
          El Club de<br /><span style={{ color: T.sage }}>la Calco</span>
        </div>
        <div style={{ fontSize: ".95rem", fontWeight: 700, color: T.textSoft, maxWidth: 440, margin: "0 auto", position: "relative" }}>Stickers que transforman lo común en único. Pegá tu estilo donde quieras. 🌎</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 22, position: "relative" }}>
          <button onClick={onCatalog} style={{ background: T.sage, color: "#fff", border: "none", borderRadius: 50, padding: "13px 30px", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1rem", cursor: "pointer", boxShadow: `0 6px 20px ${T.sage}55` }}>Ver Catálogo 👽</button>
          <button onClick={onCustom} style={{ background: "transparent", color: T.text, border: `2px solid ${T.text}`, borderRadius: 50, padding: "13px 30px", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1rem", cursor: "pointer" }}>Pedí el tuyo</button>
        </div>
      </div>

      {/* TRUST STRIP — infinite carousel */}
      <div style={{ overflow: "hidden", background: T.bgAlt, borderBottom: `1px solid ${T.border}`, padding: "1.4rem 0", position: "relative", maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)" }}>
        <div style={{ display: "flex", width: "max-content", animation: "marquee 22s linear infinite" }}>
          {[0, 1].map(rep => (
            <div key={rep} style={{ display: "flex", flexShrink: 0 }} aria-hidden={rep === 1}>
              {[["562", "diseños únicos"], ["+5000", "calcos pegadas"], ["24h", "respuesta"], ["★ 4.9", "valoración"]].map(([n, l]) => (
                <div key={l} style={{ textAlign: "center", padding: "0 clamp(1.5rem,5vw,3rem)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: `1px solid ${T.border}` }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.8rem", color: T.sage, lineHeight: 1, whiteSpace: "nowrap" }}>{n}</div>
                  <div style={{ fontSize: ".68rem", fontWeight: 700, color: T.textFaint, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>{l}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PROMOS */}
      <div style={{ padding: "2.5rem 1rem 1rem", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "1.4rem" }}>
          <div style={{ fontSize: ".66rem", fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", color: T.coral }}>✦ Aprovechá ahora ✦</div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(1.8rem,5vw,2.6rem)", letterSpacing: 2 }}>Promociones <span style={{ color: T.sage }}>vigentes</span></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 14 }}>
          {promos.map((p, i) => (
            <div key={i} onClick={onCatalog} style={{ position: "relative", background: `${p.color}12`, border: `1.5px solid ${p.color}45`, borderRadius: 16, padding: "1.4rem 1.2rem", cursor: "pointer", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 12, right: 12, background: p.color, color: "#fff", fontSize: ".54rem", fontWeight: 900, padding: "3px 9px", borderRadius: 20, letterSpacing: 1 }}>{p.tag}</div>
              <div style={{ fontSize: "2.2rem", marginBottom: 8 }}>{p.icon}</div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.35rem", letterSpacing: 1, color: p.color, lineHeight: 1.1 }}>{p.title}</div>
              <div style={{ fontSize: ".82rem", fontWeight: 700, color: T.textSoft, marginTop: 5, lineHeight: 1.45 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", fontSize: ".7rem", color: T.textFaint, fontWeight: 700, marginTop: 12 }}>* Promociones por tiempo limitado. Consultanos por WhatsApp para más info.</div>
      </div>

      {/* ABOUT — 3 KEY POINTS */}
      <div style={{ padding: "2.5rem 1rem", maxWidth: 920, margin: "0 auto" }}>
        {/* Quiénes somos */}
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", marginBottom: "1.8rem" }}>
          <div style={{ fontSize: "3rem", flexShrink: 0 }}>🙌</div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.7rem", letterSpacing: 1.5, color: T.sage }}>Quiénes somos</div>
            <div style={{ fontSize: ".92rem", fontWeight: 700, color: T.textSoft, lineHeight: 1.6, marginTop: 4 }}>Somos un equipo que ama crear y ponerle onda a todo lo que nos rodea. Creemos que un sticker puede transformar algo común en algo único. Por eso nació este proyecto: para que cada uno pueda mostrar su estilo en los detalles.</div>
          </div>
        </div>
        {/* Qué hacemos */}
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", marginBottom: "1.8rem", flexDirection: "row-reverse" }}>
          <div style={{ fontSize: "3rem", flexShrink: 0 }}>🎨</div>
          <div style={{ flex: 1, minWidth: 220, textAlign: "right" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.7rem", letterSpacing: 1.5, color: T.coral }}>Qué hacemos</div>
            <div style={{ fontSize: ".92rem", fontWeight: 700, color: T.textSoft, lineHeight: 1.6, marginTop: 4 }}>Diseñamos y fabricamos stickers originales, divertidos y de calidad. Desde packs temáticos hasta diseños 100% personalizados, para que lleves tu esencia donde quieras: tu celu, la compu, una botella, el cuaderno… o donde se te ocurra.</div>
          </div>
        </div>
        {/* Por qué elegirnos */}
        <div style={{ background: `${T.sage}0e`, border: `1px solid ${T.sage}30`, borderRadius: 18, padding: "1.6rem 1.4rem" }}>
          <div style={{ textAlign: "center", fontFamily: "'Bebas Neue', cursive", fontSize: "1.7rem", letterSpacing: 1.5, color: T.gold, marginBottom: "1.2rem" }}>¿Por qué elegirnos?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 14 }}>
            {why.map((w, i) => (
              <div key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                <div style={{ fontSize: "1.5rem", flexShrink: 0 }}>{w.icon}</div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: ".9rem", color: T.text }}>{w.t}</div>
                  <div style={{ fontSize: ".8rem", fontWeight: 700, color: T.textSoft, lineHeight: 1.45, marginTop: 2 }}>{w.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ padding: "1.5rem 1rem 3rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.9rem", letterSpacing: 2 }}>Explorá por categoría</div>
          <div style={{ fontSize: ".82rem", color: T.textFaint, fontWeight: 700 }}>Tocá una categoría para empezar a armar tu pedido</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,150px),1fr))", gap: 12 }}>
          {Object.entries(CAT_COLORS).map(([c, color]) => (
            <div key={c} onClick={() => onCatSelect(c)} style={{ background: `${color}14`, border: `1.5px solid ${color}40`, borderRadius: 16, padding: "1.1rem", cursor: "pointer", transition: "transform .15s", textAlign: "left" }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(.97)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{CAT_EMOJIS[c]}</div>
              <div style={{ fontWeight: 900, fontSize: ".9rem" }}>{c}</div>
              <div style={{ fontSize: ".72rem", color, fontWeight: 800, marginTop: 2 }}>{STICKERS_RAW.filter(s => s.cat === c).length} diseños</div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ background: T.heroGrad, padding: "2.6rem 1.5rem", textAlign: "center", borderTop: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(1.8rem,5vw,2.6rem)", letterSpacing: 1.5 }}>¿Listo para <span style={{ color: T.sage }}>pegar tu mundo?</span></div>
        <div style={{ fontSize: ".88rem", fontWeight: 700, color: T.textSoft, marginTop: 6, marginBottom: 18 }}>Sumate al club y dale onda a todo lo que te rodea.</div>
        <button onClick={onCatalog} style={{ background: T.coral, color: "#fff", border: "none", borderRadius: 50, padding: "13px 34px", fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "1rem", cursor: "pointer", boxShadow: `0 6px 20px ${T.coral}55` }}>Empezar a comprar →</button>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "2rem 1rem", borderTop: `1px solid ${T.border}`, color: T.textFaint }}>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.3rem", letterSpacing: 2, color: T.text }}>EL CLUB DE LA CALCO</div>
        <div style={{ fontSize: ".8rem", fontWeight: 700, marginTop: 4 }}>📷 @ElClubdelaCalco</div>
      </div>
    </div>
  );
}

// ── STICKER CARD ──
function StickerCard({ T, s, selected, qty, cartQty, isFav, onToggle, onQty, onFav, onZoom }) {
  const color = CAT_COLORS[s.cat] || T.sage;
  const atMax = cartQty >= qty;
  return (
    <div style={{ background: selected ? `${color}1e` : T.cardBg, border: `2px solid ${selected ? color : "transparent"}`, borderRadius: 14, padding: "10px 8px", textAlign: "center", transition: "all .18s", opacity: qty === 0 ? .45 : 1, position: "relative", boxShadow: selected ? `0 0 0 3px ${color}33` : "none" }}>
      <button onClick={() => onFav(s.id)} title="Favorito" style={{ position: "absolute", top: 5, right: 5, background: "transparent", border: "none", cursor: "pointer", fontSize: ".95rem", zIndex: 2, lineHeight: 1, filter: isFav ? "none" : "grayscale(1)", opacity: isFav ? 1 : .5 }}>{isFav ? "❤️" : "🤍"}</button>
      <div style={{ position: "absolute", top: 7, left: 7, fontSize: ".55rem", fontWeight: 900, color: T.coral }}>#{s.id}</div>
      <div onClick={() => onZoom(s)} style={{ cursor: "zoom-in", width: 62, height: 62, margin: "2px auto 6px", background: `${color}1c`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", border: `1px solid ${color}33` }}>{CAT_EMOJIS[s.cat] || "🎨"}</div>
      <div style={{ fontSize: ".66rem", fontWeight: 700, lineHeight: 1.25, minHeight: "2.2em", color: T.text }}>{s.name}</div>
      <div style={{ display: "inline-block", marginTop: 3, padding: "1px 7px", borderRadius: 20, fontSize: ".54rem", fontWeight: 900, background: qty === 0 ? `${T.coral}22` : qty === 1 ? "rgba(224,185,78,.22)" : `${T.sage}22`, color: qty === 0 ? T.coral : qty === 1 ? T.gold : T.sage }}>{qty === 0 ? "Sin stock" : qty === 1 ? "⚡ Último" : "✓ Stock"}</div>
      {qty > 0 && !selected && (
        <button onClick={() => onToggle(s.id)} style={{ display: "block", width: "100%", marginTop: 6, background: color, color: "#fff", border: "none", borderRadius: 8, padding: "5px", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: ".68rem", cursor: "pointer" }}>Agregar +</button>
      )}
      {selected && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6 }}>
          <button onClick={() => onQty(s.id, -1)} style={{ background: T.surfaceHover, border: `1px solid ${color}55`, color: T.text, borderRadius: 6, width: 22, height: 22, cursor: "pointer", fontWeight: 900, fontSize: ".8rem", padding: 0 }}>−</button>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1rem", minWidth: 16 }}>{cartQty}</span>
          <button onClick={() => !atMax && onQty(s.id, 1)} disabled={atMax} style={{ background: atMax ? T.surface : T.surfaceHover, border: `1px solid ${atMax ? T.border : color + "55"}`, color: atMax ? T.textFaint : T.text, borderRadius: 6, width: 22, height: 22, cursor: atMax ? "not-allowed" : "pointer", fontWeight: 900, fontSize: ".8rem", padding: 0 }}>+</button>
          <button onClick={() => onToggle(s.id)} title="Quitar" style={{ background: "transparent", border: "none", color: T.textFaint, cursor: "pointer", fontSize: ".85rem", marginLeft: 2 }}>✕</button>
        </div>
      )}
    </div>
  );
}

// ── ZOOM MODAL ──
function ZoomModal({ T, s, stock, inCart, isFav, onClose, onToggle, onFav }) {
  const color = CAT_COLORS[s.cat] || T.sage;
  const q = stock[String(s.id)] ?? 1;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgAlt, borderRadius: 20, padding: "1.8rem", maxWidth: 320, width: "100%", textAlign: "center", border: `2px solid ${color}` }}>
        <div style={{ width: 140, height: 140, margin: "0 auto 1rem", background: `${color}1c`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4.5rem", border: `1px solid ${color}44` }}>{CAT_EMOJIS[s.cat] || "🎨"}</div>
        <div style={{ fontSize: ".62rem", fontWeight: 900, color: T.coral }}>#{s.id} · {s.cat}</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.6rem", letterSpacing: 1, margin: "4px 0 2px", color: T.text }}>{s.name}</div>
        <div style={{ fontSize: ".8rem", fontWeight: 800, color: q === 0 ? T.coral : T.sage, marginBottom: 14 }}>{q === 0 ? "Sin stock" : q === 1 ? "⚡ Último disponible" : "✓ " + q + " en stock"}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { onToggle(s.id); onClose(); }} disabled={q === 0} style={{ flex: 1, background: inCart ? T.coral : color, color: "#fff", border: "none", borderRadius: 50, padding: "11px", fontFamily: "'Bebas Neue', cursive", fontSize: "1rem", letterSpacing: 1, cursor: q === 0 ? "not-allowed" : "pointer", opacity: q === 0 ? .5 : 1 }}>{inCart ? "Quitar del pedido" : "Agregar al pedido"}</button>
          <button onClick={() => onFav(s.id)} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 50, padding: "0 14px", cursor: "pointer", fontSize: "1.1rem" }}>{isFav ? "❤️" : "🤍"}</button>
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: T.textFaint, fontWeight: 700, fontSize: ".78rem", cursor: "pointer", marginTop: 12 }}>Cerrar</button>
      </div>
    </div>
  );
}

// ── CATALOG PAGE ──
function CatalogPage({ T, allCats, activeCat, onCat, search, onSearch, filtered, cart, stock, favs, onToggle, onQty, onFav, onZoom, favList }) {
  const [showFavs, setShowFavs] = useState(false);
  const shown = showFavs ? filtered.filter(s => favs[s.id]) : filtered;
  return (
    <div style={{ background: T.bg, minHeight: "calc(100vh - 58px)", paddingBottom: "3rem" }}>
      <div style={{ textAlign: "center", padding: "2.2rem 1rem 1.2rem" }}>
        <div style={{ fontSize: ".66rem", fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", color: T.coral }}>✦ + de 560 diseños ✦</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(1.9rem,6vw,3.2rem)", letterSpacing: 2 }}>Catálogo <span style={{ color: T.sage }}>2025</span></div>
        <div style={{ fontSize: ".8rem", color: T.textFaint, fontWeight: 700 }}>Tocá la imagen para ampliar · ❤️ para guardar</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "0 1rem .8rem" }}>
        <input value={search} onChange={e => onSearch(e.target.value)} placeholder="🔍 Buscar por nombre o número..." style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 50, padding: "9px 18px", color: T.text, fontFamily: "'Nunito', sans-serif", fontSize: ".88rem", fontWeight: 700, width: "min(400px,100%)", outline: "none" }} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", padding: "0 1rem 1rem" }}>
        {allCats.map(c => (
          <button key={c} onClick={() => { onCat(c); setShowFavs(false); }} style={{ background: activeCat === c && !showFavs ? T.sage : "transparent", border: `1.5px solid ${activeCat === c && !showFavs ? T.sage : T.border}`, color: activeCat === c && !showFavs ? "#fff" : T.textSoft, borderRadius: 50, padding: "5px 12px", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: ".72rem", cursor: "pointer" }}>{c}</button>
        ))}
        <button onClick={() => setShowFavs(v => !v)} style={{ background: showFavs ? T.coral : "transparent", border: `1.5px solid ${showFavs ? T.coral : T.border}`, color: showFavs ? "#fff" : T.textSoft, borderRadius: 50, padding: "5px 12px", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: ".72rem", cursor: "pointer" }}>❤️ Favoritos {favList.length > 0 && "(" + favList.length + ")"}</button>
      </div>

      <div style={{ textAlign: "center", fontSize: ".72rem", color: T.textFaint, fontWeight: 700, marginBottom: 10 }}>{shown.length} {shown.length === 1 ? "diseño" : "diseños"}</div>

      {shown.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: T.textFaint }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{showFavs ? "🤍" : "🔍"}</div>
          <div style={{ fontWeight: 800 }}>{showFavs ? "Todavía no guardaste favoritos" : "No encontramos esa calco"}</div>
          <div style={{ fontSize: ".82rem", marginTop: 4 }}>{showFavs ? "Tocá el corazón en cualquier diseño para guardarlo acá." : "Probá con otro nombre o número."}</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(118px,1fr))", gap: 7, padding: "0 .8rem", maxWidth: 1280, margin: "0 auto" }}>
          {shown.map(s => <StickerCard key={s.id} T={T} s={s} selected={!!cart[s.id]} qty={stock[String(s.id)] ?? 1} cartQty={cart[s.id] || 1} isFav={!!favs[s.id]} onToggle={onToggle} onQty={onQty} onFav={onFav} onZoom={onZoom} />)}
        </div>
      )}

      {/* PRICE LIST */}
      <div style={{ maxWidth: 600, margin: "2.5rem auto 0", padding: "0 1rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.8rem", letterSpacing: 2, color: T.gold }}>Lista de Precios</div>
          <div style={{ fontSize: ".7rem", fontWeight: 700, color: T.textFaint, textTransform: "uppercase", letterSpacing: 1 }}>Vinilo · Laqueado · Troquelado · 7cm</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[["1", "unidad", "1.500"], ["5", "unidades", "1.400"], ["10", "unidades", "1.200"], ["25", "unidades", "1.000"], ["50", "unidades", "900", true]].map(([q, l, p, best]) => (
            <div key={q} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: best ? `${T.gold}1c` : T.cardBg, border: `1.5px solid ${best ? T.gold : T.border}`, borderRadius: 12, padding: "11px 16px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.5rem", color: T.gold }}>{q}</span>
                <span style={{ fontSize: ".75rem", color: T.textSoft, fontWeight: 700 }}>{l}</span>
                {best && <span style={{ background: T.gold, color: "#1f2a1f", fontSize: ".56rem", fontWeight: 900, padding: "2px 8px", borderRadius: 20, letterSpacing: 1 }}>MEJOR PRECIO</span>}
              </div>
              <div><span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.4rem" }}>${p}</span><span style={{ fontSize: ".65rem", color: T.textFaint, marginLeft: 3, fontWeight: 700 }}>c/u</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── CART DRAWER ──
function CartDrawer({ T, open, onClose, cartItems, cartTotal, onQty, onRemove, waMsg, onClear, onSaveOrder, stock }) {
  // progress toward best price (50u = best)
  const tiers = [1, 5, 10, 25, 50];
  const nextTier = tiers.find(t => t > cartTotal) || 50;
  const pct = Math.min(100, Math.round((cartTotal / 50) * 100));
  const priceFor = n => n >= 50 ? 900 : n >= 25 ? 1000 : n >= 10 ? 1200 : n >= 5 ? 1400 : 1500;
  const currentPrice = priceFor(cartTotal);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 200, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .3s" }} />
      <div onClick={e => e.stopPropagation()} style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(390px,100vw)", background: T.bgAlt, borderLeft: `2px solid ${T.sage}`, zIndex: 201, transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .3s", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.2rem", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.4rem", letterSpacing: 2, color: T.text }}>🛒 Tu Pedido</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.text, fontSize: "1.3rem", cursor: "pointer", opacity: .6 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0.8rem 1.2rem" }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: T.textFaint }}>
              <div style={{ fontSize: "2.6rem", marginBottom: 8 }}>👽</div>
              <div style={{ fontWeight: 800, color: T.textSoft }}>Tu carrito está vacío</div>
              <div style={{ fontSize: ".82rem", marginTop: 4 }}>Elegí calcos del catálogo y aparecen acá.</div>
            </div>
          ) : cartItems.map(item => {
            const maxQty = stock[String(item.id)] ?? 1;
            const atMax = item.qty >= maxQty;
            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ width: 44, height: 44, background: `${CAT_COLORS[item.cat] || T.sage}22`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{CAT_EMOJIS[item.cat] || "🎨"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: ".82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: T.text }}>{item.name}</div>
                  <div style={{ fontSize: ".6rem", color: T.coral, fontWeight: 900 }}>#{item.id}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                    <button onClick={() => onQty(item.id, -1)} style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.text, borderRadius: 5, width: 22, height: 22, cursor: "pointer", fontWeight: 900 }}>−</button>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1rem", minWidth: 20, textAlign: "center", color: T.text }}>{item.qty}</span>
                    <button onClick={() => !atMax && onQty(item.id, 1)} disabled={atMax} style={{ background: T.surface, border: `1px solid ${T.border}`, color: atMax ? T.textFaint : T.text, borderRadius: 5, width: 22, height: 22, cursor: atMax ? "not-allowed" : "pointer", fontWeight: 900 }}>+</button>
                    {atMax && <span style={{ fontSize: ".6rem", color: T.gold, fontWeight: 700 }}>máx</span>}
                  </div>
                </div>
                <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: T.textFaint, cursor: "pointer", fontSize: "1rem" }}>✕</button>
              </div>
            );
          })}
        </div>

        {cartItems.length > 0 && (
          <div style={{ padding: "1rem 1.2rem", borderTop: `1px solid ${T.border}` }}>
            {/* progress to best price */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".7rem", fontWeight: 800, marginBottom: 4 }}>
                <span style={{ color: T.textSoft }}>Precio actual: <span style={{ color: T.gold }}>${currentPrice} c/u</span></span>
                {cartTotal < 50 && <span style={{ color: T.sage }}>Faltan {nextTier - cartTotal} p/ ${priceFor(nextTier)}</span>}
              </div>
              <div style={{ height: 7, background: T.surface, borderRadius: 6, overflow: "hidden" }}>
                <div style={{ width: pct + "%", height: "100%", background: `linear-gradient(90deg,${T.sage},${T.gold})`, borderRadius: 6, transition: "width .3s" }} />
              </div>
              {cartTotal >= 50 && <div style={{ fontSize: ".68rem", color: T.gold, fontWeight: 900, marginTop: 4, textAlign: "center" }}>🎉 ¡Llegaste al mejor precio!</div>}
            </div>
            <div style={{ fontSize: ".8rem", color: T.textSoft, fontWeight: 700, marginBottom: 10 }}>
              <strong style={{ color: T.sage }}>{cartItems.length} {cartItems.length === 1 ? "diseño" : "diseños"}</strong> · {cartTotal} calcos en total
            </div>
            <a href={waMsg} target="_blank" rel="noopener noreferrer" onClick={onSaveOrder} style={{ display: "block", width: "100%", background: "#25d366", color: "#fff", borderRadius: 50, padding: "12px", fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem", letterSpacing: 2, textAlign: "center", textDecoration: "none", cursor: "pointer" }}>💬 PEDIR POR WHATSAPP</a>
            <button onClick={onClear} style={{ display: "block", width: "100%", background: "none", border: "none", color: T.textFaint, fontWeight: 700, fontSize: ".72rem", cursor: "pointer", marginTop: 8 }}>Vaciar carrito</button>
          </div>
        )}
      </div>
    </>
  );
}

// ── CUSTOM PAGE ──
function CustomPage({ T, formData, onForm, formSubmitted, onSubmit, onReset, push }) {
  const [imgPreview, setImgPreview] = useState(null);
  const [imgName, setImgName] = useState("");
  const SIZES = ["5×5 cm", "7×7 cm", "10×10 cm"];
  const fieldStyle = { width: "100%", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", color: T.text, fontFamily: "'Nunito', sans-serif", fontSize: ".88rem", fontWeight: 700, outline: "none" };
  const labelStyle = { fontSize: ".64rem", fontWeight: 900, letterSpacing: 1.5, textTransform: "uppercase", color: T.sage, marginBottom: 4 };

  return (
    <div style={{ background: T.bg, minHeight: "calc(100vh - 58px)", paddingBottom: "3rem" }}>
      <div style={{ textAlign: "center", padding: "2.2rem 1rem 1.4rem" }}>
        <div style={{ fontSize: ".66rem", fontWeight: 900, letterSpacing: 4, textTransform: "uppercase", color: T.coral }}>✦ Tu diseño ✦</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(1.9rem,6vw,3.2rem)", letterSpacing: 2 }}>Stickers <span style={{ color: T.sage }}>Personalizados</span></div>
        <div style={{ fontSize: ".82rem", color: T.textFaint, fontWeight: 700, maxWidth: 420, margin: "6px auto 0" }}>Mandanos tu idea o imagen y la convertimos en calco. Mínimo 150 unidades.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "1.5rem", maxWidth: 1000, margin: "0 auto", padding: "0 1rem" }}>
        {/* INFO + PRICES */}
        <div>
          {[["📋 ¿Cómo funciona?", ["1. Completá el formulario y subí tu imagen", "2. Elegí tamaño y cantidad (mín. 150)", "3. Recibís presupuesto al instante", "4. Confirmamos y coordinamos entrega"]],
            ["📐 Tamaños", ["5×5 cm · 7×7 cm · 10×10 cm", "Otro tamaño a pedido"]],
            ["🎨 Materiales", ["Vinilo · Holográfico (+30%) · Transparente (+10%)", "Resolución ideal: 300 DPI"]]].map(([title, lines]) => (
            <div key={title} style={{ background: `${T.sage}10`, border: `1px solid ${T.sage}30`, borderRadius: 14, padding: "1.1rem 1.3rem", marginBottom: "1rem" }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.2rem", letterSpacing: 1, color: T.sage, marginBottom: 6 }}>{title}</div>
              {lines.map((l, i) => <div key={i} style={{ fontSize: ".82rem", lineHeight: 1.7, color: T.textSoft }}>{l}</div>)}
            </div>
          ))}

          {/* WHOLESALE PRICES */}
          <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 14, padding: "1.1rem 1.3rem" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.2rem", letterSpacing: 1, color: T.gold, marginBottom: 10 }}>💰 Precios por mayor</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
              {[["150–300", "600"], ["300–500", "500"], ["500–1000", "450"], ["1000–2000", "400"]].map(([r, p]) => (
                <div key={r} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 9, padding: "9px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: ".6rem", color: T.textFaint, fontWeight: 700 }}>{r} u</div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.4rem", color: T.gold, lineHeight: 1 }}>${p}</div>
                </div>
              ))}
            </div>
            <div style={{ background: `${T.gold}1a`, border: `1.5px solid ${T.gold}`, borderRadius: 9, padding: "9px", textAlign: "center", marginBottom: 8 }}>
              <div style={{ fontSize: ".6rem", color: T.textSoft, fontWeight: 700 }}>+2000 u · MEJOR PRECIO</div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.7rem", color: T.gold, lineHeight: 1 }}>$300</div>
            </div>
            {["Tamaño mayor a 8cm: +$100 c/u", "Menos de 150 u: +$200 c/u", "Otro material: a cotizar"].map((n, i) => (
              <div key={i} style={{ fontSize: ".7rem", color: T.textFaint, fontWeight: 700, lineHeight: 1.6 }}>✦ {n}</div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 16, padding: "1.5rem", height: "fit-content" }}>
          {formSubmitted ? (
            <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
              <div style={{ fontSize: "2.8rem" }}>🛸</div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.7rem", letterSpacing: 2, color: T.sage, margin: "8px 0" }}>¡Pedido recibido!</div>
              <div style={{ fontSize: ".88rem", color: T.textSoft }}>Ya tenemos tu solicitud. Te escribimos pronto por WhatsApp.</div>
              <button onClick={onReset} style={{ marginTop: "1.2rem", background: T.sage, color: "#fff", border: "none", borderRadius: 50, padding: "10px 24px", fontWeight: 900, fontSize: ".9rem", cursor: "pointer" }}>Hacer otro pedido</button>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.6rem", letterSpacing: 2, marginBottom: "1.2rem", color: T.text }}>Cotizá tu pedido</div>

              <div style={{ marginBottom: 11 }}><div style={labelStyle}>Tu nombre</div><input type="text" value={formData.nombre} onChange={e => onForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Valentina García" style={fieldStyle} /></div>
              <div style={{ marginBottom: 11 }}><div style={labelStyle}>WhatsApp / Email</div><input type="text" value={formData.contacto} onChange={e => onForm(p => ({ ...p, contacto: e.target.value }))} placeholder="11 1234-5678" style={fieldStyle} /></div>

              <div style={{ marginBottom: 11 }}><div style={labelStyle}>Tamaño</div>
                <select value={formData.size} onChange={e => onForm(p => ({ ...p, size: e.target.value }))} style={fieldStyle}>
                  <option value="">Elegí un tamaño</option>
                  {SIZES.map((s, i) => <option key={i} value={String(i)}>{s}</option>)}
                  <option value="c">Otro tamaño...</option>
                </select>
              </div>
              {formData.size === "c" && <div style={{ marginBottom: 11 }}><div style={labelStyle}>Medidas</div><input type="text" value={formData.customSize} onChange={e => onForm(p => ({ ...p, customSize: e.target.value }))} placeholder="Ej: 8×12 cm" style={fieldStyle} /></div>}

              <div style={{ marginBottom: 11 }}><div style={labelStyle}>Cantidad</div><input type="number" min="150" step="50" value={formData.qty} onChange={e => onForm(p => ({ ...p, qty: e.target.value }))} placeholder="Mínimo 150" style={fieldStyle} /></div>

              <div style={{ marginBottom: 11 }}><div style={labelStyle}>Material</div>
                <select value={formData.mat} onChange={e => onForm(p => ({ ...p, mat: e.target.value }))} style={fieldStyle}>
                  <option value="v">Vinilo estándar</option><option value="h">Holográfico (+30%)</option><option value="t">Transparente (+10%)</option>
                </select>
              </div>

              <div style={{ marginBottom: 11 }}><div style={labelStyle}>Imagen de referencia</div>
                <label style={{ display: "block", border: `1.5px dashed ${T.border}`, borderRadius: 10, padding: imgPreview ? 8 : "16px 12px", textAlign: "center", cursor: "pointer", background: T.surface }}>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files && e.target.files[0]; if (!f) return; setImgName(f.name); const r = new FileReader(); r.onload = ev => setImgPreview(ev.target.result); r.readAsDataURL(f); push("Imagen cargada ✓", "success"); }} />
                  {imgPreview ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src={imgPreview} alt="ref" style={{ width: 54, height: 54, objectFit: "cover", borderRadius: 8 }} />
                      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}><div style={{ fontSize: ".76rem", fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{imgName}</div><div style={{ fontSize: ".66rem", color: T.sage, fontWeight: 700 }}>✓ Cargada · tocá para cambiar</div></div>
                    </div>
                  ) : <div><div style={{ fontSize: "1.4rem" }}>📎</div><div style={{ fontSize: ".78rem", color: T.textFaint, fontWeight: 700, marginTop: 4 }}>Tocá para subir tu imagen</div></div>}
                </label>
              </div>

              <div style={{ marginBottom: 11 }}><div style={labelStyle}>Aclaraciones (opcional)</div><textarea value={formData.nota} onChange={e => onForm(p => ({ ...p, nota: e.target.value }))} placeholder="Fondo transparente, corte troquelado..." style={{ ...fieldStyle, resize: "vertical", minHeight: 70 }} /></div>

              <button onClick={() => {
                if (!formData.nombre || !formData.contacto || !formData.size || !formData.qty || Number(formData.qty) < 150) { push("Completá los campos obligatorios (mín. 150 u)", "error"); return; }
                const sizeName = formData.size === "c" ? (formData.customSize || "Personalizado") : (SIZES[Number(formData.size)] || "");
                const matName = formData.mat === "h" ? "Holográfico" : formData.mat === "t" ? "Transparente" : "Vinilo estándar";
                const text = "¡Hola! Quiero un pedido personalizado:%0A👤 " + encodeURIComponent(formData.nombre) + "%0A📐 " + encodeURIComponent(sizeName) + "%0A🔢 " + encodeURIComponent(formData.qty) + " unidades%0A🎨 " + encodeURIComponent(matName) + (formData.nota ? "%0A📝 " + encodeURIComponent(formData.nota) : "") + (imgName ? "%0A🖼️ Imagen: " + encodeURIComponent(imgName) + " (la adjunto)" : "") + "%0A%0A¿Me confirmás el presupuesto?";
                onSubmit();
                window.open("https://wa.me/" + WA_NUMBER + "?text=" + text, "_blank");
              }} style={{ width: "100%", background: "#25d366", color: "#fff", border: "none", borderRadius: 50, padding: "13px", fontFamily: "'Bebas Neue', cursive", fontSize: "1.15rem", letterSpacing: 2, cursor: "pointer" }}>💬 QUIERO ESTE PEDIDO</button>
              {imgName && <div style={{ fontSize: ".7rem", color: T.gold, fontWeight: 700, marginTop: 8, textAlign: "center" }}>⚠️ No olvides adjuntar la imagen en WhatsApp</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ADMIN MODAL ──
function AdminModal({ T, open, onClose, logged, onLogin, tab, onTab, orders, onOrderStatus, onDeleteOrder, stock, onAdjStock, onSaveStock, savedMsg, savedErr, stockSearch, onStockSearch, dbLoading }) {
  const passRef = useRef("");
  const STATUS_LABELS = { recibido: "📥 Recibido", confirmado: "✅ Confirmado", preparado: "📦 Preparado", entregado: "🚀 Entregado", cancelado: "✕ Cancelado" };
  const STATUS_COLORS = { recibido: "#94a3b8", confirmado: T.gold, preparado: "#60a5fa", entregado: T.sage, cancelado: T.coral };
  const stockFiltered = STICKERS_RAW.filter(s => !stockSearch || s.name.toLowerCase().includes(stockSearch.toLowerCase()) || String(s.id).includes(stockSearch));

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 300, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .3s" }} />
      <div onClick={e => e.stopPropagation()} style={{ position: "fixed", top: "50%", left: "50%", transform: `translate(-50%,-50%) scale(${open ? 1 : .96})`, zIndex: 301, background: T.bgAlt, border: `2px solid ${T.sage}`, borderRadius: 18, width: "min(880px,calc(100vw - 24px))", maxHeight: "90vh", display: "flex", flexDirection: "column", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "all .25s" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.4rem", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.5rem", letterSpacing: 2, color: T.text }}>Panel <span style={{ color: T.sage }}>Admin</span></div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.text, fontSize: "1.3rem", cursor: "pointer", opacity: .6 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "1.2rem 1.4rem" }}>
          {!logged ? (
            <div style={{ maxWidth: 280, margin: "1.5rem auto", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🔒</div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.5rem", letterSpacing: 2, marginBottom: "1rem", color: T.text }}>Acceso privado</div>
              <input key="admin-pass" type="password" defaultValue="" onChange={e => { passRef.current = e.target.value; }} onKeyDown={e => e.key === "Enter" && onLogin(passRef.current)} placeholder="Contraseña" autoFocus style={{ width: "100%", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "11px 14px", color: T.text, fontSize: ".92rem", fontWeight: 700, outline: "none", marginBottom: 10, textAlign: "center", letterSpacing: 2, fontFamily: "'Nunito', sans-serif" }} />
              <button onClick={() => onLogin(passRef.current)} style={{ width: "100%", background: T.sage, color: "#fff", border: "none", borderRadius: 50, padding: "11px", fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem", letterSpacing: 2, cursor: "pointer" }}>ENTRAR</button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                {[["metrics", "📈 Métricas"], ["orders", "📦 Pedidos"], ["stock", "📊 Stock"]].map(([t, label]) => (
                  <button key={t} onClick={() => onTab(t)} style={{ background: tab === t ? T.sage : T.surface, color: tab === t ? "#fff" : T.textSoft, border: "none", borderRadius: 50, padding: "7px 15px", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: ".78rem", cursor: "pointer" }}>{label}</button>
                ))}
              </div>

              {tab === "metrics" && <MetricsPanel T={T} orders={orders} />}

              {tab === "orders" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => onTab("orders")} style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.textSoft, borderRadius: 20, padding: "4px 12px", fontWeight: 700, fontSize: ".72rem", cursor: "pointer" }}>🔄 Recargar</button>
                  </div>
                  {orders.length === 0 ? <div style={{ textAlign: "center", padding: "2.5rem", color: T.textFaint }}><div style={{ fontSize: "2rem", marginBottom: 6 }}>🛸</div><div style={{ fontWeight: 800 }}>Sin pedidos aún</div><div style={{ fontSize: ".8rem", marginTop: 2 }}>Los pedidos del catálogo y personalizados aparecen acá.</div></div> : orders.map(o => (
                    <div key={o.id} style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 11, padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1rem", letterSpacing: 1, color: T.coral }}>{o.id} <span style={{ fontSize: ".6rem", background: o.tipo === "personalizado" ? `${T.coral}22` : `${T.sage}22`, color: o.tipo === "personalizado" ? T.coral : T.sage, padding: "1px 7px", borderRadius: 20, letterSpacing: 0 }}>{o.tipo === "personalizado" ? "Custom" : "Catálogo"}</span></div>
                          <div style={{ fontWeight: 900, fontSize: ".9rem", color: T.text }}>{o.nombre}</div>
                          <div style={{ fontSize: ".75rem", color: T.textFaint }}>{o.contacto}</div>
                        </div>
                        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <select value={o.estado} onChange={e => onOrderStatus(o.id, e.target.value)} style={{ background: T.surface, border: `1px solid ${T.border}`, color: STATUS_COLORS[o.estado], borderRadius: 8, padding: "4px 8px", fontWeight: 700, fontSize: ".73rem", cursor: "pointer", outline: "none", fontFamily: "'Nunito', sans-serif" }}>
                              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            <button onClick={() => { if (window.confirm("¿Eliminar este pedido?")) onDeleteOrder(o.id); }} title="Eliminar" style={{ background: `${T.coral}1c`, border: `1px solid ${T.coral}44`, color: T.coral, borderRadius: 8, width: 26, height: 26, cursor: "pointer", fontSize: ".8rem", padding: 0 }}>🗑️</button>
                          </div>
                          <div style={{ fontSize: ".67rem", color: T.textFaint }}>{o.fecha}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 6, fontSize: ".77rem", color: T.textSoft, lineHeight: 1.5 }}>{o.detalle}</div>
                    </div>
                  ))}
                </div>
              )}

              {tab === "stock" && (
                <>
                  <input value={stockSearch} onChange={e => onStockSearch(e.target.value)} placeholder="Buscar calco..." style={{ width: "100%", background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "9px 12px", color: T.text, fontSize: ".85rem", fontWeight: 700, outline: "none", marginBottom: 12, fontFamily: "'Nunito', sans-serif" }} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 6 }}>
                    {stockFiltered.map(s => (
                      <div key={s.id} style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 9, padding: "8px 10px", display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 34, height: 34, background: `${CAT_COLORS[s.cat] || T.sage}22`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{CAT_EMOJIS[s.cat] || "🎨"}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: ".7rem", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: T.text }}>{s.name}</div>
                          <div style={{ fontSize: ".58rem", color: T.coral, fontWeight: 900 }}>#{s.id}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                            <button onClick={() => onAdjStock(s.id, -1)} style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.text, borderRadius: 4, width: 20, height: 20, cursor: "pointer", fontWeight: 900, fontSize: ".8rem" }}>−</button>
                            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: ".95rem", minWidth: 18, textAlign: "center", color: T.text }}>{stock[String(s.id)] ?? 0}</span>
                            <button onClick={() => onAdjStock(s.id, 1)} style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.text, borderRadius: 4, width: 20, height: 20, cursor: "pointer", fontWeight: 900, fontSize: ".8rem" }}>+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={onSaveStock} style={{ marginTop: 14, background: T.sage, color: "#fff", border: "none", borderRadius: 50, padding: "11px 20px", fontFamily: "'Bebas Neue', cursive", fontSize: "1.05rem", letterSpacing: 2, cursor: "pointer", width: "100%" }}>💾 GUARDAR EN SUPABASE</button>
                  {savedMsg && <div style={{ textAlign: "center", color: T.sage, fontWeight: 900, fontSize: ".82rem", marginTop: 6 }}>✓ Stock guardado</div>}
                  {savedErr && <div style={{ textAlign: "center", color: T.coral, fontWeight: 900, fontSize: ".78rem", marginTop: 6 }}>{savedErr}</div>}
                  {dbLoading && <div style={{ textAlign: "center", color: T.gold, fontWeight: 700, fontSize: ".78rem", marginTop: 6 }}>Cargando stock...</div>}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── METRICS PANEL ──
function MetricsPanel({ T, orders }) {
  function parseItems(o) {
    if (o.items_json) { try { return JSON.parse(o.items_json); } catch (e) {} }
    if (o.tipo === "catalogo" && o.detalle) {
      const matches = [...o.detalle.matchAll(/#(\d+)\s+(.+?)\s+x(\d+)(?:,|$)/g)];
      return matches.map(m => ({ id: Number(m[1]), name: m[2].trim(), qty: Number(m[3]) }));
    }
    return [];
  }
  const stickerCounts = {};
  let totalUnits = 0, catalogOrders = 0, customOrders = 0;
  orders.forEach(o => {
    if (o.tipo === "personalizado") customOrders++; else catalogOrders++;
    parseItems(o).forEach(it => {
      const key = it.id + "|" + it.name;
      if (!stickerCounts[key]) stickerCounts[key] = { id: it.id, name: it.name, cat: it.cat, qty: 0, orders: 0 };
      stickerCounts[key].qty += it.qty || 1; stickerCounts[key].orders += 1; totalUnits += it.qty || 1;
    });
  });
  const topByQty = Object.values(stickerCounts).sort((a, b) => b.qty - a.qty).slice(0, 8);
  const topByOrders = Object.values(stickerCounts).sort((a, b) => b.orders - a.orders).slice(0, 8);
  const statusCount = { recibido: 0, confirmado: 0, preparado: 0, entregado: 0, cancelado: 0 };
  orders.forEach(o => { if (statusCount[o.estado] !== undefined) statusCount[o.estado]++; });
  const SL = { recibido: "📥 Recibido", confirmado: "✅ Confirmado", preparado: "📦 Preparado", entregado: "🚀 Entregado", cancelado: "✕ Cancelado" };
  const SC = { recibido: "#94a3b8", confirmado: T.gold, preparado: "#60a5fa", entregado: T.sage, cancelado: T.coral };
  const catCounts = {};
  Object.values(stickerCounts).forEach(s => { if (s.cat) catCounts[s.cat] = (catCounts[s.cat] || 0) + s.qty; });
  const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const kpi = (label, value, color) => (
    <div style={{ background: T.cardBg, border: `1px solid ${color}33`, borderRadius: 12, padding: "12px 14px", flex: 1, minWidth: 105 }}>
      <div style={{ fontSize: ".6rem", fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", color }}>{label}</div>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.8rem", color: T.text, lineHeight: 1.1, marginTop: 2 }}>{value}</div>
    </div>
  );

  if (orders.length === 0) return <div style={{ textAlign: "center", padding: "2.5rem", color: T.textFaint }}><div style={{ fontSize: "2rem", marginBottom: 6 }}>📊</div><div style={{ fontWeight: 800 }}>Sin datos todavía</div><div style={{ fontSize: ".8rem", marginTop: 2 }}>Las métricas aparecen a medida que entran pedidos.</div></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {kpi("Pedidos totales", orders.length, T.sage)}
        {kpi("Unidades vendidas", totalUnits, T.gold)}
        {kpi("Catálogo", catalogOrders, "#60a5fa")}
        {kpi("Personalizados", customOrders, T.coral)}
      </div>

      <div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem", letterSpacing: 1, marginBottom: 8 }}>Pedidos por estado</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(statusCount).map(([k, v]) => {
            const pct = orders.length ? Math.round((v / orders.length) * 100) : 0;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 105, fontSize: ".72rem", fontWeight: 700, color: SC[k] }}>{SL[k]}</div>
                <div style={{ flex: 1, height: 8, background: T.surface, borderRadius: 6, overflow: "hidden" }}><div style={{ width: pct + "%", height: "100%", background: SC[k], borderRadius: 6 }} /></div>
                <div style={{ width: 32, textAlign: "right", fontSize: ".75rem", fontWeight: 900, color: T.text }}>{v}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem", letterSpacing: 1, color: T.gold, marginBottom: 8 }}>🏆 Calcos más vendidas</div>
        {topByQty.length === 0 ? <div style={{ fontSize: ".78rem", color: T.textFaint, fontStyle: "italic" }}>Aún sin ventas del catálogo.</div> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {topByQty.map((s, i) => (
              <div key={s.id + s.name} style={{ display: "flex", alignItems: "center", gap: 8, background: i === 0 ? `${T.gold}14` : T.cardBg, border: `1px solid ${i === 0 ? T.gold + "55" : T.border}`, borderRadius: 9, padding: "7px 10px" }}>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1rem", color: i === 0 ? T.gold : T.textSoft, width: 22 }}>{i + 1}°</div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: ".78rem", fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>#{s.id} {s.name}</div>{s.cat && <div style={{ fontSize: ".62rem", color: CAT_COLORS[s.cat] || T.sage, fontWeight: 700 }}>{s.cat}</div>}</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem", color: T.gold }}>{s.qty}<span style={{ fontSize: ".58rem", color: T.textFaint, marginLeft: 2 }}>u.</span></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem", letterSpacing: 1, color: "#60a5fa", marginBottom: 8 }}>🔥 Más pedidas (frecuencia)</div>
        {topByOrders.length === 0 ? <div style={{ fontSize: ".78rem", color: T.textFaint, fontStyle: "italic" }}>Aún sin datos.</div> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {topByOrders.map((s, i) => (
              <div key={s.id + s.name} style={{ display: "flex", alignItems: "center", gap: 8, background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 9, padding: "7px 10px" }}>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1rem", color: T.textSoft, width: 22 }}>{i + 1}°</div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: ".78rem", fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>#{s.id} {s.name}</div></div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem", color: "#60a5fa" }}>{s.orders}<span style={{ fontSize: ".58rem", color: T.textFaint, marginLeft: 2 }}>ped.</span></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {topCats.length > 0 && (
        <div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem", letterSpacing: 1, marginBottom: 8 }}>Categorías más vendidas</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {topCats.map(([cat, qty]) => {
              const max = topCats[0][1]; const pct = max ? Math.round((qty / max) * 100) : 0; const color = CAT_COLORS[cat] || T.sage;
              return (
                <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 130, fontSize: ".7rem", fontWeight: 700, color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{CAT_EMOJIS[cat]} {cat}</div>
                  <div style={{ flex: 1, height: 8, background: T.surface, borderRadius: 6, overflow: "hidden" }}><div style={{ width: pct + "%", height: "100%", background: color, borderRadius: 6 }} /></div>
                  <div style={{ width: 30, textAlign: "right", fontSize: ".75rem", fontWeight: 900, color: T.text }}>{qty}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ fontSize: ".68rem", color: T.textFaint, textAlign: "center" }}>Las métricas de calcos se calculan con pedidos del Catálogo. Los Personalizados suman al total general.</div>
    </div>
  );
}
