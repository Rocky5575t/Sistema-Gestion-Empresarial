from fastapi import Header, HTTPException
from sqlmodel import Session, select

from app.db import engine
from app.models import Usuario

# -------------------------------------------------
# FUNCIÓN DE VALIDACIÓN DE TOKEN
# -------------------------------------------------
# Esta función sustituye a:
# if ($authorization->token_valido) { ... }
#
# Se ejecuta AUTOMÁTICAMENTE antes de entrar a cualquier endpoint
def validar_token(authorization: str = Header(None)):
    # Si no viene el header Authorization
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="NO_TOKEN"
        )

    # Quitamos el prefijo "Bearer "
    token = authorization.replace("Bearer ", "")

    # Abrimos una sesión contra la BD
    with Session(engine) as session:
        # Buscamos un usuario con ese token
        usuario = session.exec(
            select(Usuario).where(Usuario.tocket_sesion == token)
        ).first()

    # Si no existe el token
    if not usuario:
        raise HTTPException(
            status_code=401,
            detail="TOKEN_INVALIDO"
        )

    # Si todo va bien, devolvemos el usuario
    # (FastAPI lo inyecta en el endpoint)
    return usuario
