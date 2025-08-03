"""
데이터 로딩 및 저장 유틸리티
"""
import pandas as pd
import pickle
from pathlib import Path
from typing import Any, Dict, Optional


def load_csv(file_path: str, **kwargs) -> pd.DataFrame:
    """CSV 파일을 로드합니다."""
    return pd.read_csv(file_path, **kwargs)


def save_csv(df: pd.DataFrame, file_path: str, **kwargs) -> None:
    """DataFrame을 CSV로 저장합니다."""
    df.to_csv(file_path, index=False, **kwargs)


def load_pickle(file_path: str) -> Any:
    """pickle 파일을 로드합니다."""
    with open(file_path, 'rb') as f:
        return pickle.load(f)


def save_pickle(obj: Any, file_path: str) -> None:
    """객체를 pickle로 저장합니다."""
    with open(file_path, 'wb') as f:
        pickle.dump(obj, f)


def load_excel(file_path: str, sheet_name: Optional[str] = None, **kwargs) -> pd.DataFrame:
    """Excel 파일을 로드합니다."""
    return pd.read_excel(file_path, sheet_name=sheet_name, **kwargs)


def get_data_info(df: pd.DataFrame) -> Dict[str, Any]:
    """데이터프레임의 기본 정보를 반환합니다."""
    return {
        'shape': df.shape,
        'columns': df.columns.tolist(),
        'dtypes': df.dtypes.to_dict(),
        'null_counts': df.isnull().sum().to_dict(),
        'memory_usage': f"{df.memory_usage(deep=True).sum() / 1024**2:.2f} MB"
    }
