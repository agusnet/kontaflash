# KontaFlash 🚀
**Gestión Financiera Personal y Empresarial con Material Design 3**

![Portada de KontaFlash](./kontaflash1.jpg)

KontaFlash es una aplicación de escritorio multiplataforma diseñada para ofrecer un control total sobre tus finanzas con una interfaz moderna, limpia y altamente intuitiva basada en **Material Design 3 (Material You)**.

---

## ✨ Características Principales

### 🖥️ Interfaz de Usuario Premium
- **Material Design 3**: Uso de componentes oficiales de Google para una experiencia nativa y fluida.
- **Diseño Adaptativo**: Navegación lateral tipo Rail y tarjetas con bordes extra-redondeados (`28px`).
- **Sistema de Colores Tonal**: Paleta de colores orgánica que se adapta a la vista.

### 💰 Gestión Financiera
- **Dashboard en Tiempo Real**: Visualiza tus ingresos, egresos y balance total de un vistazo.
- **Módulo de Operaciones**: Registra movimientos con categorías, personas y cuentas vinculadas.
- **Cuentas Multidivisa/Bancos**: Administra diferentes cuentas de efectivo o bancos con cálculo automático de saldos.
- **Categorización Inteligente**: Organiza tus gastos por colores y nombres personalizados.
- **Directorio de Personas**: Gestiona Clientes, Proveedores y Contactos asociados a tus transacciones.

### 🔒 Seguridad y Persistencia
- **Base de Datos Local (SQLite)**: Tus datos nunca salen de tu computadora, garantizando privacidad total.
- **Multiplataforma**: Construido sobre Electron para funcionar en Windows, macOS y Linux.

---

## 🚀 Tecnologías Utilizadas

- **Frontend**: React.js + Vite
- **Estilos**: Vanilla CSS + Material Web Components (@material/web)
- **Desktop**: Electron
- **Base de Datos**: SQLite3
- **Iconografía**: Lucide React + Material Symbols

---

## 🛠️ Instalación y Desarrollo

Si deseas ejecutar el proyecto en modo desarrollo o compilarlo tú mismo:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/agusnet/kontaflash.git
   cd kontaflash
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run electron
   ```

4. **Compilar para Windows (.exe)**
   ```bash
   npm run dist:win
   ```

---

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.

---
*Desarrollado con ❤️ para una mejor gestión financiera.*
