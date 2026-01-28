"use client"
import Navbar from "@/app/navbar";
import { useState } from "react";

const pdfLinks = [
  "https://drive.google.com/file/d/1SQynG87iHg8EqiSl_W2xEi7cSjYvL8vY/view?usp=sharing",
  "https://drive.google.com/file/d/1u_DkVgQ56rtqnpjK_C5l7gKsp8JPEEww/view?usp=sharing",
  "https://drive.google.com/file/d/1FJV86JkCjcphyGOx2h8XWfBToQJL_XQP/view?usp=sharing",
  "https://drive.google.com/file/d/1Wn5lBya9YWIXMNDjo3-HxCSGtx_L08s7/view?usp=sharing",
  "https://drive.google.com/file/d/1uu3ZNaT5CPkB9hWhBOm6qvWGow3M1ma3/preview",
  "https://drive.google.com/file/d/1wAQgTWtaPb0YMwgErERZ8Mt0PiKqbgR7/preview",
  "https://drive.google.com/file/d/1-3ZIYyTr3TkrFhndQD3Cvhb_Nt5Udjty/preview",
  "https://drive.google.com/file/d/1eCEn-LZd8RSyZmjG-X0wDNeo5S62_4D_/preview",
  "https://drive.google.com/file/d/1wCmobYndVYpI1fztqjL2MmDC2YQg-3vC/preview"
];

export default function PdfViewerPage() {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(pdfLinks[0]);

  // Function to extract the Google Drive file ID
  const getEmbedUrl = (url: string) => {
    const match = url.match(/\/d\/(.*?)\//);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
  };

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-10">
        Available Question Sets
      </h1>

      <div className="flex flex-col md:flex-row gap-16 w-full max-w-6xl justify-center">
        {/* List of PDF Links */}
        <ul className="w-full md:w-1/4 bg-white shadow-md rounded-lg p-4 space-y-4 mr-16">
          {pdfLinks.map((link, index) => (
            <li key={index}>
              <button
                onClick={() => setSelectedPdf(link)}
                className="text-blue-600 hover:underline text-lg block w-full text-left"
              >
                Question Set {index + 1}
              </button>
            </li>
          ))}
        </ul>

        {/* PDF Viewer */}
        {selectedPdf && (
          <div className="w-full md:w-3/4 h-[100vh] bg-white shadow-lg rounded-lg overflow-hidden ml-16">
            <iframe
              src={getEmbedUrl(selectedPdf)}
              className="w-full h-full"
              style={{ zoom: 1.0 }}  // Adjusts zoom for the PDF viewer
              allow="autoplay"
            ></iframe>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
