/**
 * Limpia temas de Firebase Cloud Messaging
 * - Desuscribe todos los tokens guardados en Firestore
 * - Elimina temas (si quedan sin suscriptores Firebase los borra)
 */

const admin = require("firebase-admin");

// Inicializa Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

// 🔥 EDITA ESTO — lista los topics que quieres eliminar
const topicsToDelete = [
  "paciente_1_alertas",
  "paciente_5_alertas",
  "paciente_paciente_1_alertas_alertas",
  "paciente_paciente_undefined_alertas_alertas"
];

// 🔥 EDITA ESTO — cómo obtienes tus tokens
// Ejemplo Firestore: colección "tokens" con campo "token"
async function getAllTokens() {
  const tokens = [];
  const snapshot = await admin.firestore().collection("tokens").get();

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.token) tokens.push(data.token);
  });

  return tokens;
}

// Desuscribir tokens de un topic
async function unsubscribeTopic(topic, tokens) {
  try {
    console.log(`\n🔄 Eliminando topic: ${topic}`);

    const result = await admin.messaging().unsubscribeFromTopic(tokens, topic);

    console.log(`✔ ${topic} limpiado:`);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(`❌ Error limpiando ${topic}:`, err.message);
  }
}

// Script principal
async function cleanAllTopics() {
  console.log("⏳ Obteniendo tokens...");

  const tokens = await getAllTokens();

  if (tokens.length === 0) {
    console.log("⚠ No hay tokens guardados. No se puede limpiar topics.");
    return;
  }

  console.log(`🔍 ${tokens.length} tokens encontrados`);
  console.log("🧹 Limpiando topics...\n");

  for (const topic of topicsToDelete) {
    await unsubscribeTopic(topic, tokens);
  }

  console.log("\n🎉 Limpieza completa. Los topics serán eliminados por Firebase automáticamente.");
}

cleanAllTopics();
