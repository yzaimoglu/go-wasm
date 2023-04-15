OUT = encryption
WASM_VERSION = 0.1
FRONTEND_VERSION = 0.1

run:

install-frontend:
	cd frontend && npm install

install-gzipserver:
	cd gzipserver && go mod download

install-wasm:
	cd wasm && go mod download

install:
	make install-frontend
	make install-gzipserver
	make install-wasm

dev-frontend:
	cd frontend && npm run dev

dev-gzipserver:
	cd gzipserver && go run server.go

wasm-go:
	cd wasm && GOOS=js GOARCH=wasm go build -o ../gzipserver/wasm/$(OUT).wasm

wasm-tinygo:
	cd wasm && tinygo build -o ../gzipserver/wasm/$(OUT).wasm -target wasm wasm.go