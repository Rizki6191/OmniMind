# Tool Catalog API

Backend sederhana untuk menyimpan dan menampilkan katalog tools beserta berbagai penggunaannya.

## CLI

Jalankan semua command dari folder project:

```bash
cd ~/projects/OmniMind/be
````

### Menjalankan Server

Tanpa argument:

```bash
go run .
```

Server berjalan di:

```text
http://localhost:14141
```

### Import Tool

Import data tool dari file YAML:

```bash
go run . import data/nmap.yaml
```

Contoh struktur YAML:

```yaml
name: Nmap
category: Network Scanning
function: Network discovery, port scanning, service detection
description: >
  Tool untuk melakukan scanning terhadap host dan jaringan.

usages:
  - name: Cek port
    command: nmap 192.168.1.10
    explanation: >
      Melakukan scanning terhadap port-port umum pada target.
```

### Melihat Semua Tool

```bash
go run . list
```

### Melihat Detail Tool

Berdasarkan nama:

```bash
go run . show nmap
```

Berdasarkan ID:

```bash
go run . show 1
```

### Menghapus Tool

Berdasarkan nama:

```bash
go run . delete nmap
```

Berdasarkan ID:

```bash
go run . delete 1
```

CLI akan meminta konfirmasi sebelum menghapus.

### Update Tool

Update tool berdasarkan nama:

```bash
go run . update nmap
```

Atau berdasarkan ID:

```bash
go run . update 1
```


## Command Summary

| Command                       | Fungsi                  |
| ----------------------------- | ----------------------- |
| `go run .`                    | Menjalankan API server  |
| `go run . import <file.yaml>` | Import tool dari YAML   |
| `go run . list`               | Menampilkan semua tool  |
| `go run . show <name\|id>`    | Menampilkan detail tool |
| `go run . delete <name\|id>`  | Menghapus tool          |
| `go run . update <name\|id>`  | Mengupdate tool         |

## API

API hanya digunakan untuk membaca data.

```text
GET /health
GET /api/tools
GET /api/tools/:id
GET /api/categories
```

## Structure
                    PostgreSQL
                         │
                catalog_versions
                         │
                         ▼
                  Go / Gin API
                         │
              ┌──────────┴──────────┐
              │                     │
     GET /api/tools/version    GET /api/tools
              │                     │
              ▼                     ▼
         version check          ETag check
              │                     │
              │              ┌──────┴──────┐
              │              │             │
           sama           unchanged      changed
              │              │             │
              │            304           200 + JSON
              │              │             │
              └──────────────┴─────────────┘
                             │
                             ▼
                          React