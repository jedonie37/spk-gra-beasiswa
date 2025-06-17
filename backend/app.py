from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, CalonPeserta, HasilSeleksi, HistorySeleksi
from datetime import datetime
import csv
import io

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return "Backend SPK GRA Aktif. Akses /api/calon untuk tambah data."


# Tambah Calon Peserta
@app.route('/api/calon', methods=['POST'])
def tambah_calon():
    data = request.json
    try:
        calon = CalonPeserta(
            nama=data['nama'],
            k1=float(data['k1']),  # IPK
            k2=float(data['k2']),  # Pendapatan
            k3=float(data['k3']),  # Tanggungan
            k4=float(data['k4']),  # Pengeluaran
            k5=int(data['k5']),    # Status bantuan
            k6=int(data['k6']),    # Riwayat beasiswa
            k7=float(data['k7'])   # Daya listrik
        )
        db.session.add(calon)
        db.session.commit()
        return jsonify({'message': 'Data calon peserta berhasil disimpan'}), 201
    except Exception as e:
        print(f"❌ Error saat menyimpan data: {e}")
        return jsonify({'message': 'Gagal menyimpan data', 'error': str(e)}), 400


# Ambil Semua Data Calon
@app.route('/api/calon', methods=['GET'])
def get_calon():
    data = CalonPeserta.query.all()
    result = [
        {
            "id": c.id,
            "nama": c.nama,
            "k1": c.k1,
            "k2": c.k2,
            "k3": c.k3,
            "k4": c.k4,
            "k5": c.k5,
            "k6": c.k6,
            "k7": c.k7
        } for c in data
    ]
    return jsonify(result)


@app.route('/api/proses-seleksi', methods=['GET'])
def proses_seleksi():
    data = CalonPeserta.query.all()
    if not data:
        return jsonify([])

    # Ambil matriks dan identitas
    matrix = [[d.k1, d.k2, d.k3, d.k4, d.k5, d.k6, d.k7] for d in data]
    ids = [d.id for d in data]
    names = [d.nama for d in data]

    # Kriteria cost/benefit (True = cost, False = benefit)
    is_cost = [False, True, False, True, True, True, True]

    # Bobot kriteria berdasarkan RECA
    bobot = [0.2, 0.25, 0.15, 0.1, 0.1, 0.1, 0.1]  # total 1.0

    # Transpose untuk normalisasi kolom
    matrix_T = list(zip(*matrix))
    norm = []

    for j, col in enumerate(matrix_T):
        min_val = min(col)
        max_val = max(col)
        if max_val == min_val:
            norm_col = [1.0 for _ in col]
        else:
            if is_cost[j]:
                norm_col = [(max_val - x) / (max_val - min_val) for x in col]
            else:
                norm_col = [(x - min_val) / (max_val - min_val) for x in col]
        norm.append(norm_col)

    norm = list(zip(*norm))  # Transpose balik

    # Ideal solution (semua 1.0)
    ideal = [1.0] * len(bobot)
    delta = [[abs(ideal[j] - norm[i][j]) for j in range(len(bobot))] for i in range(len(norm))]

    delta_min = min(map(min, delta))
    delta_max = max(map(max, delta))
    zeta = 0.5
    grc = [[(delta_min + zeta * delta_max) / (d + zeta * delta_max) for d in row] for row in delta]

    # Hitung nilai GRA total (γi)
    nilai_gra = [sum([bobot[j] * grc[i][j] for j in range(len(bobot))]) for i in range(len(grc))]

    # Urutkan hasil
    ranking_sorted = sorted(zip(ids, names, nilai_gra), key=lambda x: x[2], reverse=True)

    # Hapus hasil lama
    HasilSeleksi.query.delete()

    # Simpan ke database hasil dan history
    for i, (cid, nama, nilai) in enumerate(ranking_sorted, 1):
        db.session.add(HasilSeleksi(
            calon_id=cid,
            nilai_gra=nilai,
            ranking=i,
            tanggal=datetime.now()
        ))

    db.session.add(HistorySeleksi(
        keterangan="Proses seleksi otomatis " + datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    db.session.commit()

    hasil_output = [{'nama': nama, 'nilai': nilai, 'ranking': i} for i, (cid, nama, nilai) in enumerate(ranking_sorted, 1)]
    return jsonify(hasil_output)


# Ambil Hasil Seleksi dari DB
@app.route("/api/proses-seleksi/hasil", methods=["GET"])
def hasil_seleksi():
    results = db.session.query(
        CalonPeserta.nama,
        HasilSeleksi.nilai_gra,
        HasilSeleksi.ranking
    ).join(HasilSeleksi, CalonPeserta.id == HasilSeleksi.calon_id)\
     .order_by(HasilSeleksi.ranking.asc()).all()

    output = [{'nama': r[0], 'nilai': r[1], 'ranking': r[2]} for r in results]
    return jsonify(output)


# Import dari CSV
@app.route('/api/calon/import', methods=['POST'])
def import_csv():
    if 'file' not in request.files:
        return jsonify({'message': 'Tidak ada file CSV dikirim'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'Nama file kosong'}), 400

    try:
        stream = io.StringIO(file.stream.read().decode("utf-8"), newline=None)
        csv_input = csv.reader(stream)
        header = next(csv_input)  # Lewati header

        count = 0
        for i, row in enumerate(csv_input, start=2):
            if len(row) != 8 or any(cell.strip() == '' for cell in row):
                print(f"⚠️  Baris ke-{i} dilewati karena data kosong atau tidak lengkap: {row}")
                continue  # skip baris tidak lengkap

            try:
                calon = CalonPeserta(
                    nama=row[0],
                    k1=float(row[1]),
                    k2=float(row[2]),
                    k3=float(row[3]),
                    k4=float(row[4]),
                    k5=int(row[5]),
                    k6=int(row[6]),
                    k7=float(row[7])
                )
                db.session.add(calon)
                count += 1
            except Exception as e:
                print(f"❌ Gagal proses baris ke-{i}: {e}")
                continue

        db.session.commit()
        return jsonify({'message': f'Import data berhasil.'}), 201

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({'message': 'Gagal import CSV', 'error': str(e)}), 500

# Hapus Data
@app.route('/api/calon/<int:id>', methods=['DELETE'])
def delete_calon(id):
    calon = CalonPeserta.query.get(id)
    if calon:
        db.session.delete(calon)
        db.session.commit()
        return jsonify({"message": "Data berhasil dihapus"}), 200
    else:
        return jsonify({"message": "Data tidak ditemukan"}), 404

@app.route('/api/history', methods=['GET'])
def get_history():
    histories = HistorySeleksi.query.order_by(HistorySeleksi.tanggal.desc()).all()
    result = [
        {
            "id": h.id,
            "tanggal": h.tanggal.strftime("%Y-%m-%d %H:%M:%S"),
            "keterangan": h.keterangan
        } for h in histories
    ]
    return jsonify(result)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
