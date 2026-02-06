# main.py
from fastapi import FastAPI, Security
from sqlmodel import Session, select

from app.db import engine
from app.models import Alumno, Vacante, VacanteXAlumno
from app.auth import validar_token

from fastapi.middleware.cors import CORSMiddleware

# -------------------------------------------------
# CREACIÓN DE LA APLICACIÓN FASTAPI
# -------------------------------------------------
app = FastAPI(title="API de Alumnos y Vacantes")

# -------------------------------------------------
# CONFIGURACIÓN CORS
# -------------------------------------------------
origins = [
    "http://localhost",
    "http://localhost:3000",  # React / otro frontend
    "http://127.0.0.1:8000",
    "http://localhost:4200",  # Angular dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  # Permite Authorization
)

# -------------------------------------------------
# ENDPOINTS ALUMNOS
# -------------------------------------------------
@app.get("/alumnos")
def get_alumnos(usuario = Security(validar_token)):
    with Session(engine) as session:
        alumnos = session.exec(select(Alumno)).all()
        return {
            "ok": True,
            "data": alumnos
        }

@app.post("/alumnos")
def create_alumno(alumno: Alumno, usuario = Security(validar_token)):
    with Session(engine) as session:
        session.add(alumno)
        session.commit()
        session.refresh(alumno)
        return {"ok": True, "message": "Alumno creado correctamente", "data": alumno}

@app.put("/alumnos/{id_alumno}")
def update_alumno(id_alumno: int, datos: Alumno, usuario = Security(validar_token)):
    with Session(engine) as session:
        alumno = session.get(Alumno, id_alumno)
        if not alumno:
            return {"ok": False, "message": "Alumno no existe"}

        # Actualizar todos los campos del formulario
        alumno.nif_nie = datos.nif_nie
        alumno.nombre = datos.nombre
        alumno.apellidos = datos.apellidos
        alumno.fecha_nacimiento = datos.fecha_nacimiento
        alumno.id_entidad_centro = datos.id_entidad_centro
        alumno.id_ciclo = datos.id_ciclo
        alumno.curso = datos.curso
        alumno.telefono = datos.telefono
        alumno.direccion = datos.direccion
        alumno.cp = datos.cp
        alumno.localidad = datos.localidad
        alumno.id_provincia = datos.id_provincia
        alumno.observaciones = datos.observaciones

        session.commit()
        session.refresh(alumno)
        return {"ok": True, "message": "Alumno actualizado correctamente", "data": alumno}


@app.delete("/alumnos/{id_alumno}")
def delete_alumno(id_alumno: int, usuario = Security(validar_token)):
    with Session(engine) as session:
        alumno = session.get(Alumno, id_alumno)
        if not alumno:
            return {"error": "Alumno no existe"}
        session.delete(alumno)
        session.commit()
        return {"ok": True}

# -------------------------------------------------
# ENDPOINTS VACANTES
# -------------------------------------------------
@app.get("/vacantes")
def get_vacantes(usuario = Security(validar_token)):
    with Session(engine) as session:
        vacantes = session.exec(select(Vacante)).all()
        return {
            "ok": True,
            "data": vacantes
        }

@app.post("/vacantes")
def create_vacante(vacante: Vacante, usuario = Security(validar_token)):
    with Session(engine) as session:
        session.add(vacante)
        session.commit()
        session.refresh(vacante)
        return {
            "ok": True,
            "message": "Vacante creada correctamente",
            "data": vacante
        }

@app.put("/vacantes/{id_vacante}")
def update_vacante(id_vacante: int, datos: Vacante, usuario = Security(validar_token)):
    with Session(engine) as session:
        vacante = session.get(Vacante, id_vacante)
        if not vacante:
            return {"ok": False, "message": "Vacante no existe"}
        vacante.id_entidad = datos.id_entidad
        vacante.id_ciclo = datos.id_ciclo
        vacante.curso = datos.curso
        vacante.num_vacantes = datos.num_vacantes
        vacante.observaciones = datos.observaciones
        session.commit()
        session.refresh(vacante)
        return {"ok": True, "message": "Vacante actualizada correctamente", "data": vacante}


@app.delete("/vacantes/{id_vacante}")
def delete_vacante(id_vacante: int, usuario = Security(validar_token)):
    with Session(engine) as session:
        vacante = session.get(Vacante, id_vacante)
        if not vacante:
            return {"ok": False, "message": "Vacante no existe"}
        session.delete(vacante)
        session.commit()
        return {"ok": True, "message": "Vacante eliminada correctamente"}


# -------------------------------------------------
# ENDPOINTS VACANTES_X_ALUMNOS
# -------------------------------------------------
@app.get("/vacantes-alumnos")
def get_vacantes_alumnos(usuario = Security(validar_token)):
    with Session(engine) as session:
        datos = session.exec(select(VacanteXAlumno)).all()
        return datos

@app.post("/vacantes-alumnos")
def create_vacante_alumno(vacante_alumno: VacanteXAlumno, usuario = Security(validar_token)):
    with Session(engine) as session:
        session.add(vacante_alumno)
        session.commit()
        session.refresh(vacante_alumno)
        return vacante_alumno

@app.delete("/vacantes-alumnos/{id}")
def delete_vacante_alumno(id: int, usuario = Security(validar_token)):
    with Session(engine) as session:
        registro = session.get(VacanteXAlumno, id)
        if not registro:
            return {"error": "Registro no existe"}
        session.delete(registro)
        session.commit()
        return {"ok": True}
