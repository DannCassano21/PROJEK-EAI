# Retail Enterprise Integration

Project ini mensimulasikan integrasi enterprise sederhana antara tiga aplikasi retail:

1. POS Service untuk mencatat transaksi penjualan.
2. Inventory Service untuk mengelola produk dan stok.
3. Accounting Service untuk mencatat jurnal transaksi.

Integrasi dilakukan melalui Integration Service dan RabbitMQ. Satu event penjualan dari POS akan memicu update stok di Inventory dan pencatatan jurnal di Accounting.

## Target Deliverable

- Source code untuk tiga aplikasi utama dan satu integration service.
- Database terpisah untuk setiap aplikasi.
- RabbitMQ sebagai message broker.
- Dockerfile untuk setiap service.
- `docker-compose.yml` untuk menjalankan seluruh sistem.
- Swagger/OpenAPI untuk dokumentasi endpoint.
- Diagram arsitektur integrasi.
- Dokumentasi skema pesan.
- Laporan singkat 4-6 halaman.
- Script demo end-to-end.

## Struktur Project

```text
retail-enterprise-integration/
├── pos-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── openapi.yaml
│   └── src/
├── inventory-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── openapi.yaml
│   └── src/
├── accounting-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── openapi.yaml
│   └── src/
├── integration-service/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── docs/
├── docker-compose.yml
└── .env.example
```

## Alur Integrasi

```text
POS Service
  -> publish event sale.created
  -> RabbitMQ
  -> Integration Service
  -> transform payload
  -> Inventory Service mengurangi stok
  -> Accounting Service membuat jurnal
```

## Enterprise Integration Patterns

Pola integrasi yang akan diterapkan:

- Message Channel
- Publish-Subscribe Channel
- Message Router
- Message Translator
- Message Endpoint / Adapter

## Cara Menjalankan

1. Salin file environment.

```bash
cp .env.example .env
```

2. Jalankan seluruh sistem.

```bash
docker compose up --build
```

3. Buka RabbitMQ Management UI.

```text
http://localhost:15672
username: guest
password: guest
```

## URL Service

| Service | URL | Swagger |
|---|---|---|
| POS Service | `http://localhost:3001` | `http://localhost:3001/api-docs` |
| Inventory Service | `http://localhost:3002` | `http://localhost:3002/api-docs` |
| Accounting Service | `http://localhost:3003` | `http://localhost:3003/api-docs` |
| Integration Service | `http://localhost:3004` | tidak perlu Swagger, hanya health check |

## Endpoint Utama

| Service | Endpoint | Fungsi |
|---|---|---|
| POS | `POST /sales` | Membuat transaksi dan publish event `sale.created` |
| POS | `GET /sales` | Melihat transaksi penjualan |
| Inventory | `GET /products` | Melihat stok produk |
| Inventory | `POST /stock/reduce` | Mengurangi stok berdasarkan transaksi |
| Inventory | `GET /stock-movements` | Melihat riwayat perubahan stok |
| Accounting | `POST /journals` | Membuat jurnal dari JSON atau XML |
| Accounting | `GET /journals` | Melihat jurnal transaksi |
| Integration | `GET /health` | Melihat status consumer RabbitMQ |

## Contoh Demo End-to-End

1. Cek stok awal produk `P001`.

```bash
curl http://localhost:3002/products/P001
```

2. Buat transaksi penjualan di POS.

```bash
curl -X POST http://localhost:3001/sales \
  -H "Content-Type: application/json" \
  -d '{
    "buyerName": "Budi",
    "paymentMethod": "cash",
    "items": [
      {
        "productId": "P001",
        "name": "Keyboard",
        "quantity": 2,
        "price": 150000
      }
    ]
  }'
```

3. Cek stok produk setelah transaksi.

```bash
curl http://localhost:3002/products/P001
```

4. Cek jurnal Accounting.

```bash
curl http://localhost:3003/journals
```

5. Cek status Integration Service.

```bash
curl http://localhost:3004/health
```

## Bukti Pemenuhan Rubrik

| Rubrik | Implementasi |
|---|---|
| Integrasi end-to-end | POS membuat transaksi, Inventory otomatis mengurangi stok, Accounting otomatis membuat jurnal |
| Enterprise Integration Patterns | Message Channel, Publish-Subscribe, Message Router, Message Translator, Message Endpoint/Adapter |
| Heterogenitas data | POS mengirim event JSON, Inventory menerima JSON, Accounting menerima XML |
| Arsitektur microservices | POS, Inventory, Accounting, dan Integration Service berjalan terpisah |
| Containerization | Semua service memiliki Dockerfile dan dijalankan melalui Docker Compose |
| Konfigurasi | Endpoint, port, queue, exchange, dan database path memakai environment variable |
| Persistensi | SQLite disimpan di Docker volume, RabbitMQ memakai volume |
| Dokumentasi | README, Swagger/OpenAPI, diagram, dan message schema |

## Dokumen Pendukung

| Dokumen | Fungsi |
|---|---|
| `docs/architecture.md` | Diagram arsitektur sistem |
| `diagrams/integration-architecture.png` | Diagram arsitektur integrasi dalam format gambar |
| `diagrams/integration-architecture.svg` | Diagram arsitektur integrasi dalam format SVG |
| `diagrams/integration-architecture.drawio` | Diagram editable untuk diagrams.net / draw.io |
| `docs/message-schema.md` | Skema event dan hasil transformasi data |
| `docs/api-test-commands.md` | Kumpulan command untuk pengujian API |
| `docs/demo-script.md` | Narasi demo video 5-10 menit |
| `docs/report.md` | Laporan singkat 4-6 halaman |
| `docs/week-1-submission.md` | Report 1 untuk minggu pertama |
| `docs/panduan-menjalankan-project.md` | Panduan lengkap menjalankan dan menguji project |
