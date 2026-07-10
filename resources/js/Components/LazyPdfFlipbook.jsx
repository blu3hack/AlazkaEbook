import React, { useEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";
import { PageFlip } from "page-flip";
import * as pdfjs from "pdfjs-dist";
import {
    Book,
    Loader2,
    Edit3,
    Eye,
    Save,
    Download,
    ChevronDown,
} from "lucide-react";
import { Tldraw, createTLStore, defaultShapeUtils, loadSnapshot } from "tldraw";
import "tldraw/tldraw.css";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs/pdf.worker.mjs`;

const PdfFlipbook = () => {
    const bookRef = useRef(null);
    const [pageFlipInstance, setPageFlipInstance] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [error, setError] = useState(null);
    const [isAnnotationMode, setIsAnnotationMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
    const [tldrawStores, setTldrawStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadedSnapshots, setLoadedSnapshots] = useState(null);
    const [isToggleOpen, setIsToggleOpen] = useState(false);
    const props = usePage().props;
    // Diambil dari route ber-otorisasi (auth + token cocok dengan sesi),
    // bukan path publik /pdf/ yang bisa diunduh siapa saja.
    const PDF_URL = `/ebook-file/${encodeURIComponent(props.file_pdf ?? "")}`;

    // Resize listener
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleAnnotationMode = () => setIsAnnotationMode((prev) => !prev);

    // Render PDF + PageFlip + buat Tldraw stores
    useEffect(() => {
        const renderPdf = async () => {
            setIsLoading(true);
            if (!bookRef.current) {
                setError("Wadah buku belum dimuat.");
                setIsLoading(false);
                return;
            }

            try {
                const loadingTask = pdfjs.getDocument(PDF_URL);
                const pdf = await loadingTask.promise;
                const numPages = pdf.numPages;

                const firstPage = await pdf.getPage(1);
                const renderScale = Math.min(
                    1,
                    window.innerWidth /
                        (firstPage.getViewport({ scale: 1 }).width *
                            (isMobile ? 1 : 2))
                );
                const viewport = firstPage.getViewport({ scale: renderScale });
                const bookHeight = viewport.height;

                setPdfDimensions({
                    width: viewport.width,
                    height: viewport.height,
                });
                firstPage.cleanup();

                const pagesContainer = bookRef.current;
                pagesContainer.innerHTML = "";
                const renderPromises = [];

                for (let i = 1; i <= numPages; i++) {
                    const pageWrapper = document.createElement("div");
                    pageWrapper.className = "page-wrapper";
                    pageWrapper.style.position = "relative";
                    pageWrapper.style.width = `${viewport.width}px`;
                    pageWrapper.style.height = `${viewport.height}px`;

                    const pdfCanvas = document.createElement("canvas");
                    pdfCanvas.className = "page";
                    pageWrapper.appendChild(pdfCanvas);
                    pagesContainer.appendChild(pageWrapper);

                    const context = pdfCanvas.getContext("2d");
                    const page = await pdf.getPage(i);
                    const pageViewport = page.getViewport({
                        scale: renderScale,
                    });
                    pdfCanvas.width = pageViewport.width;
                    pdfCanvas.height = pageViewport.height;

                    renderPromises.push(
                        page
                            .render({
                                canvasContext: context,
                                viewport: pageViewport,
                            })
                            .promise.then(() => page.cleanup())
                    );
                }

                await Promise.all(renderPromises);

                // PageFlip
                const pageFlip = new PageFlip(pagesContainer, {
                    width: viewport.width,
                    height: bookHeight,
                    showCover: true,
                    flippingTime: 800,
                    size: "fixed",
                    usePortrait: isMobile,
                    autoSize: false,
                    useMouseEvents: true,
                    useTouchEvents: true,
                });
                pageFlip.loadFromHTML(
                    pagesContainer.querySelectorAll(".page-wrapper")
                );
                pageFlip.on("flip", (e) => setCurrentPage(e.data));
                setPageFlipInstance(pageFlip);

                // Buat store per dua halaman
                const stores = [];
                for (let i = 0; i < Math.ceil(numPages / 2); i++) {
                    stores.push(
                        createTLStore({ shapeUtils: defaultShapeUtils })
                    );
                }
                setTldrawStores(stores);

                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setError(
                    "Gagal memuat PDF. Silakan periksa file atau coba lagi."
                );
                setIsLoading(false);
            }
        };

        renderPdf();

        return () => {
            if (pageFlipInstance) {
                pageFlipInstance.off("flip");
                if (bookRef.current) bookRef.current.innerHTML = "";
                setPageFlipInstance(null);
            }
        };
    }, [isMobile]);

    // Save semua annotation
    const saveBoard = async () => {
        try {
            setLoading(true);
            const allSnapshots = {};
            tldrawStores.forEach((store, idx) => {
                allSnapshots[`store-${idx}`] = store.getSnapshot();
            });
            await axios.post("/drawings", {
                data: allSnapshots,
                title: "All Pages Drawing",
            });
            alert("Annotation berhasil disimpan!");
            setIsToggleOpen(false); // Tutup toggle setelah save
        } catch (e) {
            console.error("Gagal menyimpan:", e);
        } finally {
            setLoading(false);
        }
    };

    // Load semua annotation
    const loadBoard = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/drawings");
            const allSnapshots = res.data?.data;
            if (!allSnapshots) return;
            setLoadedSnapshots(allSnapshots);
            setIsToggleOpen(false); // Tutup toggle setelah load
        } catch (e) {
            console.error("Gagal memuat annotation:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-1 relative">
            {/* Toggle Save/Load - Kiri Atas */}
            {!isLoading && !error && (
                <div className="fixed top-4 left-4 z-50">
                    <div className="relative">
                        {/* Toggle Button */}
                        <button
                            onClick={() => setIsToggleOpen(!isToggleOpen)}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg transition-all duration-300"
                            title="Save & Load Options"
                        >
                            <Save className="h-4 w-4" />
                            <span className="text-sm font-medium">Coretan</span>
                            <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${
                                    isToggleOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isToggleOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                                <button
                                    onClick={saveBoard}
                                    disabled={loading}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Save className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-gray-700">
                                        Simpan Semua Coretan{" "}
                                    </span>
                                </button>
                                <div className="border-t border-gray-100"></div>
                                <button
                                    onClick={loadBoard}
                                    disabled={loading}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Download className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm text-gray-700">
                                        Muat Coretan Terakhir
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Toggle annotation mode - Kanan Atas */}
            {!isLoading && !error && (
                <div className="fixed top-4 right-4 z-50">
                    <button
                        onClick={toggleAnnotationMode}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
                            isAnnotationMode
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : "bg-gray-500 hover:bg-gray-600 text-white"
                        }`}
                        title={
                            isAnnotationMode ? "Mode Lihat" : "Mode Annotation"
                        }
                    >
                        {isAnnotationMode ? (
                            <Edit3 className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                        <span className="text-sm font-medium">
                            {isAnnotationMode ? "Annotate" : "View"}
                        </span>
                    </button>
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="mb-1 p-4 bg-white rounded-lg shadow-md">
                        <div className="flex items-center justify-center space-x-3 text-blue-600">
                            <Loader2 className="animate-spin h-6 w-6" />
                            <Book className="h-6 w-6" />
                            <span className="text-lg font-medium">
                                Open Ebook....
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {error && <div className="text-lg text-red-600">{error}</div>}

            {/* PDF Flipbook */}
            <div className="relative">
                <div
                    ref={bookRef}
                    className="book-container shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden rounded-3xl"
                />

                {/* Tldraw Overlay per dua halaman */}
                {isAnnotationMode &&
                    tldrawStores.map((store, index) => {
                        const leftPage = index * 2 + 1;
                        const rightPage = leftPage + 1;
                        const isActive =
                            currentPage === leftPage ||
                            currentPage === rightPage;
                        if (!isActive) return null;

                        const snapshot = loadedSnapshots?.[`store-${index}`];

                        return (
                            <div
                                key={index}
                                className="absolute top-0 z-40 pointer-events-auto"
                                style={{
                                    width: isMobile
                                        ? pdfDimensions.width
                                        : pdfDimensions.width * 2,
                                    height: pdfDimensions.height,
                                    left: 0,
                                }}
                            >
                                <Tldraw
                                    store={store}
                                    onMount={() => {
                                        if (snapshot)
                                            loadSnapshot(store, snapshot);
                                    }}
                                />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default PdfFlipbook;
