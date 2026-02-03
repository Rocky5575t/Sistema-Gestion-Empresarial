from sqlmodel import create_engine

# URL de conexión a MySQL
# formato:
# mysql+mysqlconnector://USUARIO:CONTRASEÑA@HOST/NOMBRE_BD
DATABASE_URL = "mysql+mysqlconnector://api_user:Api1234%21@192.168.10.113:3306/app_radfpd"

# Creamos el engine
# - engine es el objeto central que gestiona la conexión a la BD
# - echo=True muestra en consola todas las consultas SQL (muy útil para aprender)
engine = create_engine(
    DATABASE_URL,
    echo=True
)
