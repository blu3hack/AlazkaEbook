import React from "react";
import { usePage } from "@inertiajs/react";

function Index() {
    // Debug: Lihat SEMUA props yang diterima
    const props = usePage().props;
    console.log("ALL props received:", props);

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Sector Pengujian</h2>
            <div className="space-y-2">
                <div>
                    <p className="ml-2">{props.name || "Tidak ada"}</p>
                    <p className="ml-2">{props.email || "Tidak ada"}</p>
                    <p className="ml-2">{props.message || "Tidak ada"}</p>
                </div>
            </div>
        </div>
    );
}

export default Index;
