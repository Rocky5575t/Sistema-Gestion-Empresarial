# auth.py
from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from app.db import engine
from app.models import Usuario

# -------------------------------------------------
# CONFIGURACIÓN DE SEGURIDAD
# -------------------------------------------------
# Este objeto indica a FastAPI que usaremos Authorization: Bearer <token>
security = HTTPBearer()

# -------------------------------------------------
# FUNCIÓN DE VALIDACIÓN DE TOKEN
# -------------------------------------------------
def validar_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Valida que el token enviado en el header Authorization sea correcto.

    Swagger UI reconocerá automáticamente este endpoint como protegido
    y mostrará el botón Authorize.
    """

    token = credentials.credentials  # extrae el token puro del Bearer

    # Abrimos sesión en la DB y buscamos usuario con ese token
    with Session(engine) as session:
        usuario = session.exec(
            select(Usuario).where(Usuario.token_sesion == token)
        ).first()

    # Si no existe el usuario → 401
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="TOKEN_INVALIDO"
        )

    # Si todo va bien → devolvemos el usuario
    return usuario
