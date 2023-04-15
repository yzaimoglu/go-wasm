package main

import (
	"fmt"
	"net/http"

	"github.com/NYTimes/gziphandler"
	"github.com/rs/cors"
)

func main() {
	mux := http.NewServeMux()
	mux.Handle("/", gziphandler.GzipHandler(http.FileServer(http.Dir("wasm"))))

	handler := cors.Default().Handler(mux)
	fmt.Println("Starting gzip server on port 9000")
	http.ListenAndServe(":9000", handler)
}
