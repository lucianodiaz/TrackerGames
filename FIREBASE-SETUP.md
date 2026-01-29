# Sincronizar entre dispositivos (Firebase)

Para que el mismo contador se vea en el celular y en la PC (o en cualquier navegador) sin iniciar sesión:

1. **Crear proyecto en Firebase**
   - Entrá a [Firebase Console](https://console.firebase.google.com)
   - "Agregar proyecto" → nombre (ej. `contador-partidas`) → crear

2. **Activar Realtime Database**
   - En el proyecto: "Realtime Database" → "Crear base de datos"
   - Elegí una región y "Siguiente"
   - Empezar en **modo de prueba** (para poder leer/escribir sin login)

3. **Reglas (modo prueba)**
   - Pestaña "Reglas" en Realtime Database
   - Dejá así (cualquiera con el enlace puede leer/escribir; solo para uso personal):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
   - "Publicar"

4. **Copiar la config del proyecto**
   - En el proyecto: ícono engranaje → "Configuración del proyecto"
   - En "Tus apps" → "Agregar app" → Web (</>)
   - Nombre (ej. "Contador") → "Registrar app"
   - Copiá el objeto `firebaseConfig`

5. **Pegar la config en `app.js`**
   - Abrí `app.js`
   - Reemplazá `var FIREBASE_CONFIG = null;` por algo como:
   ```javascript
   var FIREBASE_CONFIG = {
     apiKey: "AIza...",
     authDomain: "tu-proyecto.firebaseapp.com",
     databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
     projectId: "tu-proyecto",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "123...",
     appId: "1:123..."
   };
   ```
   - Guardá el archivo.

Listo: el **mismo enlace** (con `?id=xxx`) en el celular y en la PC usa el mismo contador y se actualiza en tiempo real en ambos.
