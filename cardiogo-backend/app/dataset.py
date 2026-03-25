import os
import io
import joblib
import warnings
warnings.filterwarnings("ignore")
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from flask import Flask, request, jsonify, send_file, Blueprint

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import (recall_score, f1_score, confusion_matrix, roc_curve, roc_auc_score)

dataset_bp = Blueprint('dataset', __name__)

dataset_path = "../dataset_cardiogo.csv"
modelo_path = "../modelo_riesgo_cardiaco.pkl"
scaler_path = "../scaler_riesgo.pkl"

modelo = None
scaler = None
X_columns = None


def render_png():
    buffer = io.BytesIO()
    plt.savefig(buffer, format="png", bbox_inches="tight")
    buffer.seek(0)
    plt.close()
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
    if os.path.exists(scaler_path):
        data = joblib.load(scaler_path)
        scaler = data["scaler"]
        X_columns = data["feature_names"]


cargar_modelo()


@app.route("/entrenar", methods=["POST"])
def endpoint_entrenar():
    m = entrenar_modelo()
    return jsonify(m)


@app.route("/grafica/distribucion_output")
def grafica_output():
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip().str.upper().str.replace(" ", "_")
    df_model = df[["OUTPUT"]]
    df_model["OUTPUT"].value_counts().plot(kind="bar", color=["green", "red"])
    plt.title("Distribución de Estado de Riesgo")
    return render_png()


@app.route("/grafica/histogramas")
def grafica_histogramas():
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip().str.upper().str.replace(" ", "_")
    df_model = df[["EDAD", "RITMO_CARDIACO", "OXIGENACION", "TEMPERATURA"]]
    df_model.hist(figsize=(12, 6))
    plt.suptitle("Histogramas de Signos Vitales")
    return render_png()


@app.route("/grafica/correlacion")
def grafica_correlacion():
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip().str.upper().str.replace(" ", "_")
    df_model = df[["EDAD", "RITMO_CARDIACO", "OXIGENACION", "TEMPERATURA", "OUTPUT"]]
    plt.figure(figsize=(8, 6))
    sns.heatmap(df_model.corr(), annot=True, cmap="coolwarm")
    plt.title("Matriz de Correlación")
    return render_png()


@app.route("/grafica/matriz_confusion")
def grafica_confusion():
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip().str.upper().str.replace(" ", "_")
    df_model = df[["EDAD", "RITMO_CARDIACO", "OXIGENACION", "TEMPERATURA", "OUTPUT"]]

    X = df_model.drop("OUTPUT", axis=1)
    y = df_model["OUTPUT"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    s = StandardScaler()
    X_train_scaled = s.fit_transform(X_train)
    X_test_scaled = s.transform(X_test)

    m = LogisticRegression()
    m.fit(X_train_scaled, y_train)
    y_pred = m.predict(X_test_scaled)

    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6, 4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=["No Riesgo", "Riesgo"],
                yticklabels=["No Riesgo", "Riesgo"])
    plt.title("Matriz de Confusión")
    return render_png()


@app.route("/grafica/roc")
def grafica_roc():
    df = pd.read_csv(dataset_path)
    df.columns = df.columns.str.strip().str.upper().str.replace(" ", "_")
    df_model = df[["EDAD", "RITMO_CARDIACO", "OXIGENACION", "TEMPERATURA", "OUTPUT"]]

    X = df_model.drop("OUTPUT", axis=1)
    y = df_model["OUTPUT"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    s = StandardScaler()
    X_train_scaled = s.fit_transform(X_train)
    X_test_scaled = s.transform(X_test)

    m = LogisticRegression()
    m.fit(X_train_scaled, y_train)
    y_proba = m.predict_proba(X_test_scaled)[:, 1]

    fpr, tpr, _ = roc_curve(y_test, y_proba)
    auc = roc_auc_score(y_test, y_proba)

    plt.figure(figsize=(8, 5))
    plt.plot(fpr, tpr, label=f"AUC = {auc:.4f}")
    plt.plot([0, 1], [0, 1], linestyle="--", color="red")
    plt.title("Curva ROC")
    plt.xlabel("FPR")
    plt.ylabel("TPR")
    plt.legend()
    plt.grid()
    return render_png()


@app.route("/predecir", methods=["POST"])
def predecir():
    if modelo is None:
        return jsonify({"error": "Modelo no cargado"}), 500

    data = request.json
    df = pd.DataFrame([data])[X_columns]
    x = scaler.transform(df)
    proba = modelo.predict_proba(x)[0][1]
    pred = int(modelo.predict(x)[0])

    return jsonify({
        "prediccion": pred,
        "probabilidad_riesgo": float(proba)
    })


if __name__ == "__main__":
    app.run(debug=True)
