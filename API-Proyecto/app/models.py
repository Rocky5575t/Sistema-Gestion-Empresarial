from sqlmodel import SQLModel, Field
from datetime import date

# -------------------------------------------------
# MODELO: USUARIO
# -------------------------------------------------
# Representa la tabla sgi_usuarios
# Aquí es donde está el campo tocket_sesion
class Usuario(SQLModel, table=True):
    # Nombre REAL de la tabla en MySQL
    __tablename__: str = "sgi_usuarios"

    # Clave primaria (AUTO_INCREMENT)
    # default=None es obligatorio para claves autoincrementales
    id_usuario: int = Field(default=None, primary_key=True)

    # Nombre del usuario
    nombre: str

    # Token de sesión
    # Puede ser NULL en la base de datos
    tocket_sesion: str | None = None


# -------------------------------------------------
# MODELO: ALUMNOS
# -------------------------------------------------
class Alumno(SQLModel, table=True):
    __tablename__: str = "sgi_alumnos"

    # Clave primaria
    id_alumno: int = Field(default=None, primary_key=True)

    # Campos obligatorios
    nif_nie: str
    nombre: str
    apellidos: str
    fecha_nacimiento: date
    id_entidad_centro: int
    id_ciclo: int
    curso: int
    telefono: str

    # Campos opcionales (permiten NULL)
    direccion: str | None = None
    cp: str | None = None
    localidad: str | None = None
    id_provincia: int | None = None
    observaciones: str | None = None


# -------------------------------------------------
# MODELO: VACANTES
# -------------------------------------------------
class Vacante(SQLModel, table=True):
    __tablename__: str = "sgi_vacantes"

    # Clave primaria
    id_vacante: int = Field(default=None, primary_key=True)

    # Datos de la vacante
    id_entidad: int
    id_ciclo: int
    curso: int
    num_vacantes: int

    # Campo opcional
    observaciones: str | None = None


# -------------------------------------------------
# MODELO: VACANTES POR ALUMNO
# -------------------------------------------------
class VacanteXAlumno(SQLModel, table=True):
    __tablename__: str = "sgi_vacantes_x_alumnos"

    # Clave primaria
    id_vacante_x_alumno: int = Field(default=None, primary_key=True)

    # Claves foráneas
    id_vacante: int
    id_alumno: int
