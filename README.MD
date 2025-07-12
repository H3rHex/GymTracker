# GymTracker: Aplicación Personal de Fitness 🏋️‍♀️

¡Bienvenido a GymTracker! Esta aplicación te ayuda a planificar y seguir tus rutinas semanales de gimnasio, gestionar tu perfil de usuario y te ofrece una experiencia de usuario fluida.

---

## Guía de Despliegue 🚀

Para poner GymTracker en marcha en tu sistema, sigue las instrucciones a continuación. La aplicación requiere **Java Development Kit (JDK) 21**.

### 1. Requisitos Previos: Instala Oracle JDK 21 ☕

GymTracker está construida con Java 21. Antes de desplegarla, necesitas tener **Oracle JDK 21 instalado en tu sistema**.

**Fuente Oficial:** [Descargar Oracle JDK 21](https://www.oracle.com/java/technologies/downloads/) (Asegúrate de seleccionar la versión adecuada para tu sistema operativo)

* **Para Windows:**
    1.  Descarga el **instalador de Oracle JDK 21 (MSI)** para Windows x64.
    2.  Ejecuta el instalador y sigue las instrucciones en pantalla.
    3.  Verifica la instalación abriendo el Símbolo del sistema y escribiendo `java -version`. Deberías ver "21.x.x".

* **Para Linux (Recomendado para Debian/Ubuntu y derivados):**
    La forma más sencilla y común de instalar el JDK en Linux es a través de tu gestor de paquetes.

    1.  **Añade el repositorio de Oracle (si no lo tienes):**
        * Primero, actualiza tus paquetes e instala `openjdk-21-jdk`:

            sudo apt update
            ```
           **OpenJDK 21** 

           `sudo apt install openjdk-21-jdk`.

### 2. Obtén la Aplicación 📥

Puedes conseguir el archivo JAR de GymTracker de dos maneras:

* **JAR:**
    1. Abre una terminal (CMD o BASH)
    2. Ejecuta dentro de el directorio de el programa:
    ```bash
    java -jar GymTracker-<version>.jar
    ```
* **Compila desde el código fuente:**
    1.  Clona el repositorio:
        ```bash
        git clone [https://github.com/h3rhex/GymTracker.git](https://github.com/h3rhex/GymTracker.git)
        cd GymTracker
        ```
    2.  Compila el proyecto usando Maven:
        ```bash
        mvn clean package
        ```
        El archivo JAR compilado se encontrará en el directorio `target/` (por ejemplo, `target/GymTracker.jar`).

---
### 3. Ejecuta la Aplicación ▶️

Una vez que tengas **Oracle JDK 21** (o un JDK 21 compatible) instalado y el archivo `GymTracker.jar` (o `GymTracker-<version>.jar`), puedes ejecutarlo directamente.

1.  Abre tu terminal o símbolo del sistema (CMD/Bash).
2.  Navega al directorio donde se encuentra tu archivo `GymTracker.jar` (usualmente `target/` si lo compilaste).
3.  Ejecuta el JAR:
    ```bash
    java -jar GymTracker.jar
    ```
    **Nota:** Si tu JAR tiene la versión en el nombre (ej. `GymTracker-1.0.0.jar`), usa ese nombre completo: `java -jar GymTracker-1.0.0.jar`.

    La aplicación debería iniciarse, y podrás acceder a su interfaz web (normalmente en `http://localhost:8080` a menos que esté configurado de otra manera).

---

### ¿Necesitas Ayuda? 🤔

Si encuentras algún problema durante el despliegue, no dudes en abrir una incidencia en el repositorio de GitHub.