from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

next_sem_model = joblib.load("next_sem_model.pkl")
placement_model = joblib.load("placement_model.pkl")
risk_model = joblib.load("risk_model.pkl")


@app.route("/predict", methods=["POST"])
def predict():
    try:

        data = request.get_json()

        print("Incoming request:", data)

        if not data:
            return jsonify({
                "success": False,
                "message": "No input data received"
            }), 400

        required_fields = [
            "StudyHours",
            "Attendance",
            "AssignmentCompletion",
            "Motivation",
            "StressLevel"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "message": f"Missing field: {field}"
                }), 400

        features = pd.DataFrame([{
            "StudyHours": float(data["StudyHours"]),
            "Attendance": float(data["Attendance"]),
            "AssignmentCompletion": float(data["AssignmentCompletion"]),
            "Motivation": float(data["Motivation"]),
            "StressLevel": float(data["StressLevel"])
        }])

        print("Features:", features)

        #  NEXT SEMESTER PREDICTION
        next_sem = next_sem_model.predict(features)[0]

        # PLACEMENT PREDICTION 
        placement_proba = placement_model.predict_proba(features)

        if placement_proba.shape[1] == 1:
            placement_prob = float(placement_proba[0][0])
        else:
            placement_prob = float(placement_proba[0][1])

        placement_label = int(placement_prob > 0.5)

        #RISK PREDICTION
        risk_proba = risk_model.predict_proba(features)

        if risk_proba.shape[1] == 1:
            risk_prob = float(risk_proba[0][0])
        else:
            risk_prob = float(risk_proba[0][1])

        risk_label = int(risk_prob > 0.5)

        result = {
            "success": True,
            "data": {
                "nextSemesterPrediction": round(float(next_sem), 2),
                "placementProbability": round(float(placement_prob), 2),
                "placementLabel": placement_label,
                "riskScore": round(float(risk_prob), 2),
                "riskLabel": risk_label
            }
        }

        print("Prediction result:", result)

        return jsonify(result)

    except Exception as e:

        print("ML ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)