from fastapi import FastAPI, Depends
from sqlmodel import Session, select

from app.db import engine
from app.models import Alumno, Vacante,  VacanteXAlumno
from app.auth import validar_token

# -------------------------------------------------
# CREACIÓN DE LA APLICACIÓN FASTAPI
# -------------------------------------------------
app = FastAPI(
    title="API FastAPI + SQLModel + MySQL",
    version="1.0"
)

# -------------------------------------------------
# GET → equivalente a GET en PHP
# -------------------------------------------------
@app.get("/alumnos")
def get_alumnos(usuario=Depends(validar_token)):
    # Si el token no es válido, NO entra aquí
    # FastAPI devuelve automáticamente 401

    # Abrimos sesión
    with Session(engine) as session:
        # SELECT * FROM sgi_alumnos
        alumnos = session.exec(select(Alumno)).all()

        # FastAPI convierte la lista a JSON automáticamente
        return alumnos


# -------------------------------------------------
# POST → equivalente a POST en PHP
# -------------------------------------------------
@app.post("/alumnos")
def create_alumno(alumno: Alumno, usuario=Depends(validar_token)):
    with Session(engine) as session:
        # Insertamos el alumno
        session.add(alumno)

        # Confirmamos cambios en la BD
        session.commit()

        # Refrescamos el objeto (para obtener el ID)
        session.refresh(alumno)

        return alumno


# -------------------------------------------------
# PUT → equivalente a PUT en PHP
# -------------------------------------------------
@app.put("/alumnos/{id_alumno}")
def update_alumno(
    id_alumno: int,
    datos: Alumno,
    usuario=Depends(validar_token)
):
    with Session(engine) as session:
        # Buscamos el alumno por ID
        alumno = session.get(Alumno, id_alumno)

        if not alumno:
            return {"error": "Alumno no existe"}

        # Actualizamos campos
        alumno.nombre = datos.nombre
        alumno.apellidos = datos.apellidos
        alumno.telefono = datos.telefono

        # Guardamos cambios
        session.commit()

        return alumno


# -------------------------------------------------
# DELETE → equivalente a DELETE en PHP
# -------------------------------------------------
@app.delete("/alumnos/{id_alumno}")
def delete_alumno(
    id_alumno: int,
    usuario=Depends(validar_token)
):
    with Session(engine) as session:
        alumno = session.get(Alumno, id_alumno)

        if not alumno:
            return {"error": "Alumno no existe"}

        # Eliminamos el registro
        session.delete(alumno)
        session.commit()

        return {"ok": True}
    

##get listarVacantes

@app.get("/vacantes")
def get_vacantes(usuario=Depends(validar_token)):
    with Session(engine) as session:
        vacantes = session.exec(select(Vacante)).all()
        return vacantes

## post CrearVancate
@app.post("/vacantes")
def create_vacante(vacante: Vacante, usuario=Depends(validar_token)):
    with Session(engine) as session:
        session.add(vacante)
        session.commit()
        session.refresh(vacante)
        return vacante


## Actualizar

@app.put("/vacantes/{id_vacante}")
def update_vacante(
    id_vacante: int,
    datos: Vacante,
    usuario=Depends(validar_token)
):
    with Session(engine) as session:
        vacante = session.get(Vacante, id_vacante)

        if not vacante:
            return {"error": "Vacante no existe"}

        vacante.id_entidad = datos.id_entidad
        vacante.id_ciclo = datos.id_ciclo
        vacante.curso = datos.curso
        vacante.num_vacantes = datos.num_vacantes
        vacante.observaciones = datos.observaciones

        session.commit()
        return vacante



##delete EliminarVacante

@app.delete("/vacantes/{id_vacante}")
def delete_vacante(
    id_vacante: int,
    usuario=Depends(validar_token)
):
    with Session(engine) as session:
        vacante = session.get(Vacante, id_vacante)

        if not vacante:
            return {"error": "Vacante no existe"}

        session.delete(vacante)
        session.commit()
        return {"ok": True}


## VCANATES_X_ALUMNOS

##get ListarRelaciones

@app.get("/vacantes-alumnos")
def get_vacantes_alumnos(usuario=Depends(validar_token)):
    with Session(engine) as session:
        datos = session.exec(select(VacanteXAlumno)).all()
        return datos



## AsignarAlumno a Vacante

@app.post("/vacantes-alumnos")
def create_vacante_alumno(vacante_alumno: VacanteXAlumno, usuario=Depends(validar_token)):
    with Session(engine) as session:
        session.add(vacante_alumno)
        session.commit()
        session.refresh(vacante_alumno)
        return vacante_alumno
    


## Delete EliminarAsignación

@app.delete("/vacantes-alumnos/{id}")
def delete_vacante_alumno(
    id: int,
    usuario=Depends(validar_token)
):
    with Session(engine) as session:
        registro = session.get(VacanteXAlumno, id)

        if not registro:
            return {"error": "Registro no existe"}
        
        session.delete(registro)
        session.commit()
        return {"ok": True}













