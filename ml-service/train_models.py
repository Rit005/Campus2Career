import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import RandomForestClassifier

df = pd.read_csv("student_dataset.csv")

features = [
    "StudyHours",
    "Attendance",
    "AssignmentCompletion",
    "Motivation",
    "StressLevel"
]

X = df[features]

# Next Semester Prediction 
y_next = df["ExamScore"]

reg_model = LinearRegression()
reg_model.fit(X, y_next)

print("ExamScore unique values:")
print(df["ExamScore"].unique())

print("ExamScore stats:")
print(df["ExamScore"].describe())

# Placement Prediction 
df["Placed"] = pd.qcut(df["ExamScore"], q=2, labels=[0,1])
df["Placed"] = df["Placed"].astype(int)

placement_model = LogisticRegression()
placement_model.fit(X, df["Placed"])

# Risk Prediction 
df["Risk"] = (df["FinalGrade"] < 50).astype(int)

risk_model = RandomForestClassifier()
risk_model.fit(X, df["Risk"])

joblib.dump(reg_model, "next_sem_model.pkl")
joblib.dump(placement_model, "placement_model.pkl")
joblib.dump(risk_model, "risk_model.pkl")

print("Models trained successfully")