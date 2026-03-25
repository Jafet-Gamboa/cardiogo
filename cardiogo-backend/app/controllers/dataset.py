import os
import io
import joblib
import warnings
warnings.filterwarnings("ignore")
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (
    recall_score,
    f1_score,
    confusion_matrix,
    roc_curve,
    roc_auc_score
)

from flask import send_file

dataset_path = "app/dataset_cardiogo.csv"
modelo_path = "app/modelo_riesgo_cardiaco.pkl"
scaler_path = "app/scaler_riesgo.pkl"

modelo = None
scaler = None
X_columns = None


def render_png(fig):
    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", bbox_inches="tight")
    buffer.seek(0)
    plt.close(fig)
    return send_file(buffer, mimetype="image/png")


def entrenar_modelo():
    global modelo, scaler, X_columns

    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip().str.upper().str.replace(" ", "_")
    df_model = df[["EDAD", "RITMO_CARDIACO", "OXIGENACION", "TEMPERATURA", "OUTPUT"]]

    X = df_model.drop("OUTPUT", axis=1)
    y = df_model["OUTPUT"]
    X_columns = list(X.columns)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    modelo_reg = LogisticRegression()
    modelo_reg.fit(X_train_scaled, y_train)
    y_pred_reg = modelo_reg.predict(X_test_scaled)

    modelo_knn = KNeighborsClassifier(n_neighbors=7)
    modelo_knn.fit(X_train_scaled, y_train)
    y_pred_knn = modelo_knn.predict(X_test_scaled)

    recall_reg = recall_score(y_test, y_pred_reg)
    recall_knn = recall_score(y_test, y_pred_knn)
    f1_reg = f1_score(y_test, y_pred_reg)
    f1_knn = f1_score(y_test, y_pred_knn)

    if recall_knn > recall_reg or (recall_knn == recall_reg and f1_knn > f1_reg):
        modelo = modelo_knn
    else:
        modelo = modelo_reg

    joblib.dump(modelo, modelo_path)
    joblib.dump({"scaler": scaler, "feature_names": X_columns}, scaler_path)

    return {
        "modelo": "KNN" if modelo == modelo_knn else "LogisticRegression",
        "recall_reg": recall_reg,
        "f1_reg": f1_reg,
        "recall_knn": recall_knn,
        "f1_knn": f1_knn,
        "total_registros": len(df)
    }


def cargar_modelo():
    global modelo, scaler, X_columns

    if os.path.exists(modelo_path):
        modelo = joblib.load(modelo_path)
    else:
        modelo = None

    if os.path.exists(scaler_path):
        data = joblib.load(scaler_path)
        scaler = data.get("scaler", None)
        X_columns = data.get("feature_names", None)
    else:
        scaler = None
        X_columns = None


cargar_modelo()


# def grafica_output_controller():
#     df = pd.read_csv(dataset_path)
#     df.columns = df.columns.str.strip().str.upper().str.replace(" ", "_")

#     fig, ax = plt.subplots(figsize=(6,4))
#     df["OUTPUT"].value_counts().plot(kind="bar", color=["green", "red"], ax=ax)
#     ax.set_title("Distribución de Estado de Riesgo")

#     return render_png(fig)

def grafica_output_controller():
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip().str.upper().str.replace(" ", "_")

    # Convertir 0 y 1 a texto
    df["OUTPUT_LABEL"] = df["OUTPUT"].map({
        0: "No Riesgo",
        1: "Riesgo"
    })

    fig, ax = plt.subplots(figsize=(6,4))

    # Graficar usando la columna con texto
    df["OUTPUT_LABEL"].value_counts().plot(
        kind="bar",
        color=["green", "red"],
        ax=ax
    )

    ax.set_title("Distribución de Estado de Riesgo")
    ax.set_xlabel("Estado")
    ax.set_ylabel("Cantidad")

    return render_png(fig)

def grafica_histogramas_controller():
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip().str.upper().str.replace(" ", "_")

    fig, axes = plt.subplots(2, 2, figsize=(12, 6))
    cols = ["EDAD", "RITMO_CARDIACO", "OXIGENACION", "TEMPERATURA"]

    for col, ax in zip(cols, axes.flatten()):
        ax.hist(df[col], bins=20)
        ax.set_title(col)

    fig.suptitle("Histogramas de Signos Vitales")

    return render_png(fig)


def grafica_correlacion_controller():
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip().str.upper().str.replace(" ", "_")

    fig, ax = plt.subplots(figsize=(8,6))
    sns.heatmap(df.corr(), annot=True, cmap="coolwarm", ax=ax)
    ax.set_title("Matriz de Correlación")

    return render_png(fig)


def grafica_confusion_controller():
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip().str.upper().str.replace(" ", "_")

    df_model = df[["EDAD", "RITMO_CARDIACO", "OXIGENACION", "TEMPERATURA", "OUTPUT"]]
    X = df_model.drop("OUTPUT", axis=1)
    y = df_model["OUTPUT"]

    modelo = joblib.load(modelo_path)
    scaler_data = joblib.load(scaler_path)
    scaler = scaler_data["scaler"]
    feature_names = scaler_data["feature_names"]

    X = X[feature_names]
    X_scaled = scaler.transform(X)
    y_pred = modelo.predict(X_scaled)

    cm = confusion_matrix(y, y_pred)

    fig, ax = plt.subplots(figsize=(6,4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=["No Riesgo", "Riesgo"],
                yticklabels=["No Riesgo", "Riesgo"],
                ax=ax)
    ax.set_title("Matriz de Confusión")

    return render_png(fig)


def grafica_roc_controller():
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip().str.upper().str.replace(" ", "_")

    df_model = df[["EDAD", "RITMO_CARDIACO", "OXIGENACION", "TEMPERATURA", "OUTPUT"]]
    X = df_model.drop("OUTPUT", axis=1)
    y = df_model["OUTPUT"]

    modelo = joblib.load(modelo_path)
    scaler_data = joblib.load(scaler_path)
    scaler = scaler_data["scaler"]
    feature_names = scaler_data["feature_names"]

    X = X[feature_names]
    X_scaled = scaler.transform(X)

    y_proba = modelo.predict_proba(X_scaled)[:, 1]

    fpr, tpr, _ = roc_curve(y, y_proba)
    auc = roc_auc_score(y, y_proba)

    fig, ax = plt.subplots(figsize=(8,5))
    ax.plot(fpr, tpr, label=f"AUC = {auc:.4f}")
    ax.plot([0, 1], [0, 1], linestyle="--", color="red")
    ax.set_title("Curva ROC - Modelo Entrenado")
    ax.set_xlabel("FPR")
    ax.set_ylabel("TPR")
    ax.legend()
    ax.grid()

    return render_png(fig)


def predecir_controller(data):
    if modelo is None:
        raise Exception("Modelo no cargado")

    df = pd.DataFrame([data])

    if X_columns:
        df = df[X_columns]

    if scaler is not None:
        x = scaler.transform(df)
    else:
        x = df.values

    if hasattr(modelo, "predict_proba"):
        proba_array = modelo.predict_proba(x)[0]
        proba = float(proba_array[1])
    else:
        proba_array = [0, 0]
        proba = 0

    pred = int(modelo.predict(x)[0])
    confianza = float(proba_array[pred])
    umbral_confianza = 0.6

    if pred == 1 and confianza >= umbral_confianza:
        resultado = "RIESGO ALTO"
    elif pred == 1:
        resultado = "RIESGO MODERADO"
    else:
        resultado = "Riesgo bajo"

    return {
        "prediccion": pred,
        "probabilidad": f"{proba:.2%}",
        "confianza": f"{confianza:.2%}",
        "resultado": resultado
    }

