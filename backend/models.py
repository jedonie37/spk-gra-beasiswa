from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class CalonPeserta(db.Model):
    __tablename__ = 'calon_peserta'
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    k1 = db.Column(db.Float, nullable=False)
    k2 = db.Column(db.Float, nullable=False)  # Pendapatan Keluarga
    k3 = db.Column(db.Float, nullable=False)  # Jumlah Tanggungan
    k4 = db.Column(db.Float, nullable=False)  # Pengeluaran Bulanan
    k5 = db.Column(db.Integer, nullable=False)  # Status Bantuan Pemerintah
    k6 = db.Column(db.Integer, nullable=False)  # Riwayat Beasiswa
    k7 = db.Column(db.Float, nullable=False)  # Daya Listrik


class HasilSeleksi(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    calon_id = db.Column(db.Integer, db.ForeignKey('calon_peserta.id'), nullable=False)
    nilai_gra = db.Column(db.Float, nullable=False)
    ranking = db.Column(db.Integer, nullable=False)
    tanggal = db.Column(db.DateTime, default=datetime.utcnow)

class HistorySeleksi(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tanggal = db.Column(db.DateTime, default=datetime.utcnow)
    keterangan = db.Column(db.String(255))
