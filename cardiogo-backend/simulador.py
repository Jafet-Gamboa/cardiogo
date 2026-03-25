import psycopg2
import random
import time
from datetime import datetime

# --------------- CONFIGURACIÓN ---------------
DB_CONFIG = {
    "host": "localhost",
    "user": "postgres",
    "password": "JaJa12@@",
    "database": "cardiogo"
}

INTERVALO = 15  # segundos entre cada insert
EXCLUIR = [1]    # pacientes excluidos
# ----------------------------------------


def generar_signos(r):
    ritmo = random.randint(int(r["ritmo_min"]), int(r["ritmo_max"]))
    ox = round(random.uniform(float(r["ox_min"]), float(r["ox_max"])), 2)
    temp = round(random.uniform(float(r["temp_min"]), float(r["temp_max"])), 2)
    return ritmo, ox, temp


def main():
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()

    # Cargamos los dispositivos una sola vez
    cursor.execute("""
        SELECT d.id AS dispositivo_id, p.id AS paciente_id,
               r.ritmo_min, r.ritmo_max,
               r.oxigenacion_min, r.oxigenacion_max,
               r.temperatura_min, r.temperatura_max
        FROM dispositivos d
        JOIN pacientes p ON d.paciente_id = p.id
        JOIN rangos_paciente r ON r.paciente_id = p.id
    """)
    dispositivos = cursor.fetchall()

    if not dispositivos:
        print("No hay dispositivos registrados.")
        return

    print(f"Dispositivos encontrados: {len(dispositivos)}")
    print("Comenzando inserciones cada 15 segundos...")

    index = 0  # dispositivo actual

    while True:
        dispositivo_id, paciente_id, rmin, rmax, oxmin, oxmax, tmin, tmax = dispositivos[index]

        # saltar si el paciente está excluido
        if paciente_id in EXCLUIR:
            print(f"Paciente {paciente_id} excluido. Se brinca.")
        else:
            r = {
                "ritmo_min": rmin, "ritmo_max": rmax,
                "ox_min": oxmin, "ox_max": oxmax,
                "temp_min": tmin, "temp_max": tmax
            }

            ritmo, ox, temp = generar_signos(r)
            fecha = datetime.now()

            cursor.execute("""
                INSERT INTO signos_vitales 
                (ritmo_cardiaco, oxigenacion, temperatura, fecha_hora, dispositivo_id)
                VALUES (%s, %s, %s, %s, %s)
            """, (ritmo, ox, temp, fecha, dispositivo_id))

            conn.commit()

            print(f"[{fecha.strftime('%H:%M:%S')}] Insertado para paciente {paciente_id} | dispositivo {dispositivo_id} | "
                  f"ritmo={ritmo}, ox={ox}, temp={temp}")

        # avanzar al siguiente dispositivo
        index = (index + 1) % len(dispositivos)

        # esperar 15 segundos
        time.sleep(INTERVALO)


if __name__ == "__main__":
    main()