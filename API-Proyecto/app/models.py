from sqlmodel import SQLModel, Field
from datetime import date

# -----------------------
# USUARIO
# -----------------------
class Usuario(SQLModel, table=True):
    __tablename__: str = "sgi_usuarios"

    id_usuario: int = Field(default=None, primary_key=True)
    nombre_publico: str
    token_sesion: str | None = None

# -----------------------
# ALUMNO
# -----------------------
class Alumno(SQLModel, table=True):
    __tablename__: str = "sgi_alumnos"

    id_alumno: int = Field(default=None, primary_key=True)
    nif_nie: str
    nombre: str
    apellidos: str
    fecha_nacimiento: date
    id_entidad_centro: int
    id_ciclo: int
    curso: int
    telefono: str
    direccion: str | None = None
    cp: str | None = None
    localidad: str | None = None
    id_provincia: int | None = None
    observaciones: str | None = None

# -----------------------
# VACANTE
# -----------------------
class Vacante(SQLModel, table=True):
    __tablename__: str = "sgi_vacantes"

    id_vacante: int = Field(default=None, primary_key=True)
    id_entidad: int
    id_ciclo: int
    curso: int
    num_vacantes: int
    observaciones: str | None = None

# -----------------------
# VACANTE POR ALUMNO
# -----------------------
class VacanteXAlumno(SQLModel, table=True):
    __tablename__: str = "sgi_vacantes_x_alumnos"

    id_vacante_x_alumno: int = Field(default=None, primary_key=True)
    id_vacante: int
    id_alumno: int
