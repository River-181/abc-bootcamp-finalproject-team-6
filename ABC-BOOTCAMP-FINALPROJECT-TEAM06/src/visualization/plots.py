"""
시각화 유틸리티 함수들
"""
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
from typing import List, Optional, Tuple


def setup_plot_style():
    """플롯 스타일을 설정합니다."""
    plt.style.use('seaborn-v0_8')
    sns.set_palette("husl")
    plt.rcParams['figure.figsize'] = (12, 8)
    plt.rcParams['font.size'] = 12


def plot_distribution(df: pd.DataFrame, column: str, figsize: Tuple[int, int] = (12, 6)):
    """컬럼의 분포를 시각화합니다."""
    fig, axes = plt.subplots(1, 2, figsize=figsize)
    
    # 히스토그램
    axes[0].hist(df[column].dropna(), bins=30, alpha=0.7, edgecolor='black')
    axes[0].set_title(f'{column} - 히스토그램')
    axes[0].set_xlabel(column)
    axes[0].set_ylabel('빈도')
    
    # 박스플롯
    axes[1].boxplot(df[column].dropna())
    axes[1].set_title(f'{column} - 박스플롯')
    axes[1].set_ylabel(column)
    
    plt.tight_layout()
    plt.show()


def plot_correlation_matrix(df: pd.DataFrame, figsize: Tuple[int, int] = (10, 8)):
    """상관관계 매트릭스를 시각화합니다."""
    numeric_cols = df.select_dtypes(include=['number']).columns
    corr_matrix = df[numeric_cols].corr()
    
    plt.figure(figsize=figsize)
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
    sns.heatmap(corr_matrix, mask=mask, annot=True, cmap='coolwarm', center=0,
                square=True, linewidths=0.5, cbar_kws={"shrink": 0.5})
    plt.title('상관관계 매트릭스')
    plt.tight_layout()
    plt.show()


def plot_categorical_distribution(df: pd.DataFrame, column: str, figsize: Tuple[int, int] = (10, 6)):
    """범주형 변수의 분포를 시각화합니다."""
    value_counts = df[column].value_counts()
    
    fig, axes = plt.subplots(1, 2, figsize=figsize)
    
    # 막대 그래프
    value_counts.plot(kind='bar', ax=axes[0])
    axes[0].set_title(f'{column} - 빈도')
    axes[0].set_xlabel(column)
    axes[0].set_ylabel('빈도')
    axes[0].tick_params(axis='x', rotation=45)
    
    # 파이 차트
    value_counts.plot(kind='pie', ax=axes[1], autopct='%1.1f%%')
    axes[1].set_title(f'{column} - 비율')
    axes[1].set_ylabel('')
    
    plt.tight_layout()
    plt.show()


def save_plot(filename: str, path: str = "../results/figures/"):
    """현재 플롯을 파일로 저장합니다."""
    from pathlib import Path
    Path(path).mkdir(parents=True, exist_ok=True)
    plt.savefig(f"{path}/{filename}", dpi=300, bbox_inches='tight')
    print(f"플롯이 {path}/{filename}에 저장되었습니다.")
