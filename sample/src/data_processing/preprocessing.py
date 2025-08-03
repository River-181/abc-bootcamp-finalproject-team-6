"""
데이터 전처리 유틸리티
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from typing import Tuple, List, Optional


def handle_missing_values(df: pd.DataFrame, method: str = 'drop') -> pd.DataFrame:
    """결측값을 처리합니다."""
    if method == 'drop':
        return df.dropna()
    elif method == 'mean':
        return df.fillna(df.mean())
    elif method == 'median':
        return df.fillna(df.median())
    elif method == 'mode':
        return df.fillna(df.mode().iloc[0])
    else:
        raise ValueError("method는 'drop', 'mean', 'median', 'mode' 중 하나여야 합니다.")


def encode_categorical(df: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
    """범주형 변수를 인코딩합니다."""
    df_encoded = df.copy()
    
    for col in columns:
        if col in df.columns:
            le = LabelEncoder()
            df_encoded[col] = le.fit_transform(df[col].astype(str))
    
    return df_encoded


def scale_features(X_train: pd.DataFrame, X_test: pd.DataFrame = None) -> Tuple[np.ndarray, np.ndarray]:
    """피처를 표준화합니다."""
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    if X_test is not None:
        X_test_scaled = scaler.transform(X_test)
        return X_train_scaled, X_test_scaled
    
    return X_train_scaled, None


def remove_outliers(df: pd.DataFrame, columns: List[str], method: str = 'iqr') -> pd.DataFrame:
    """이상치를 제거합니다."""
    df_clean = df.copy()
    
    for col in columns:
        if method == 'iqr':
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower = Q1 - 1.5 * IQR
            upper = Q3 + 1.5 * IQR
            df_clean = df_clean[(df_clean[col] >= lower) & (df_clean[col] <= upper)]
        elif method == 'zscore':
            z_scores = np.abs((df[col] - df[col].mean()) / df[col].std())
            df_clean = df_clean[z_scores < 3]
    
    return df_clean
