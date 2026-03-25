import pandas as pd
import numpy as np

N = 20000
rng = np.random.default_rng()

# Signos vitales realistas
edad = rng.integers(18, 95, N)

ritmo = rng.normal(82, 14, N).clip(40, 180)
oxigenacion = rng.normal(97, 1.8, N).clip(75, 100)
temperatura = rng.normal(36.7, 0.35, N).clip(35, 42)

# --- Reglas médicas claras ---
riesgo = (
    (ritmo < 55) |
    (ritmo > 110) |
    (oxigenacion < 94) |
    (temperatura > 38.0) |
    (temperatura < 35.8) |
    (edad > 75)
).astype(int)

# --- Balanceo 50 / 50 ---
df = pd.DataFrame({
    "EDAD": edad,
    "RITMO_CARDIACO": ritmo.round(2),
    "OXIGENACION": oxigenacion.round(2),
    "TEMPERATURA": temperatura.round(2),
    "OUTPUT": riesgo
})

# dividir clases
no_riesgo = df[df['OUTPUT'] == 0]
riesgo = df[df['OUTPUT'] == 1]

cant = min(len(no_riesgo), len(riesgo))

df_bal = pd.concat([
    riesgo.sample(cant, random_state=42),
    no_riesgo.sample(cant, random_state=42)
]).sample(frac=1, random_state=42)

# guardar
df_bal.to_csv("./dataset/dataset_cardiogo.csv", index=False)

df_bal['OUTPUT'].value_counts()
