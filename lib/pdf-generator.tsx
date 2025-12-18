import type { FIR } from "./fir"

export const generateFIRPDF = (fir: FIR, selectedBNSSections?: string[]): string => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>FIR_${fir.firNumber}.pdf</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Times New Roman', Times, serif;
          line-height: 1.4;
          background: white;
          color: #000;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          border: 3px solid #000;
          padding: 30px;
          min-height: 100vh;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #000;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .header .subtitle {
          font-size: 16px;
          font-weight: bold;
          margin: 8px 0 5px 0;
        }
        .header .description {
          font-size: 13px;
          margin: 3px 0;
        }
        .form-section {
          margin-bottom: 18px;
          page-break-inside: avoid;
        }
        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 15px;
          margin-bottom: 12px;
        }
        .form-field {
          border: 1px solid #666;
          padding: 8px;
        }
        .field-label {
          font-weight: bold;
          font-size: 11px;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        .field-value {
          font-size: 12px;
          min-height: 18px;
          word-wrap: break-word;
          line-height: 1.3;
        }
        .wide-field {
          grid-column: 1 / -1;
        }
        .section-number {
          font-weight: bold;
          font-size: 13px;
          margin-bottom: 12px;
          margin-top: 15px;
          text-decoration: underline;
        }
        .signature-section {
          margin-top: 30px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          border-top: 2px solid #000;
          padding-top: 40px;
        }
        .signature-box {
          text-align: center;
        }
        .signature-box p {
          margin-top: 50px;
          border-top: 1px solid #000;
          padding-top: 5px;
          font-size: 12px;
          font-weight: bold;
        }
        .bns-sections {
          border: 1px solid #000;
          padding: 12px;
          margin-top: 15px;
          background: #f9f9f9;
        }
        .bns-title {
          font-weight: bold;
          font-size: 12px;
          margin-bottom: 8px;
          text-decoration: underline;
        }
        .bns-item {
          margin-bottom: 8px;
          padding: 8px;
          border-left: 3px solid #2563eb;
          background: white;
          font-size: 11px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 10px;
          color: #333;
          border-top: 1px solid #666;
          padding-top: 15px;
        }
        @media print {
          body { margin: 0; padding: 0; background: white; }
          .container { border: none; box-shadow: none; }
          .page-break { page-break-after: always; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>FORM - IF1 (Integrated Form)</h1>
          <div class="subtitle">FIRST INFORMATION REPORT</div>
          <div class="description">(Under Section 154 Cr.P.C - Bharatiya Nyaya Sanhita, 2023)</div>
        </div>

        <div class="form-section">
          <div class="section-number">1. REGISTERING POLICE STATION AND FIR DETAILS</div>
          <div class="form-row">
            <div class="form-field">
              <div class="field-label">Dist.</div>
              <div class="field-value">${fir.district || "_______________"}</div>
            </div>
            <div class="form-field">
              <div class="field-label">P.S.</div>
              <div class="field-value">${fir.policeStation || "_______________"}</div>
            </div>
            <div class="form-field">
              <div class="field-label">Year</div>
              <div class="field-value">${new Date(fir.createdAt).getFullYear()}</div>
            </div>
            <div class="form-field">
              <div class="field-label">F.I.R. No.</div>
              <div class="field-value">${fir.firNumber}</div>
            </div>
            <div class="form-field">
              <div class="field-label">Date</div>
              <div class="field-value">${new Date(fir.createdAt).toLocaleDateString("en-IN")}</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-number">2. ACTS AND SECTIONS</div>
          <div class="form-row">
            <div class="form-field wide-field">
              <div class="field-label">*Acts</div>
              <div class="field-value">Bharatiya Nyaya Sanhita (BNS), 2023</div>
            </div>
            <div class="form-field wide-field">
              <div class="field-label">*Sections</div>
              <div class="field-value">${selectedBNSSections && selectedBNSSections.length > 0 ? selectedBNSSections.join(", ") : fir.bnsSections?.join(", ") || fir.bnsSection || "_______________"}</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-number">3. OCCURRENCE OF OFFENCE</div>
          <div class="form-row">
            <div class="form-field">
              <div class="field-label">*Day</div>
              <div class="field-value">${new Date(fir.incidentDateTime).toLocaleDateString("en-US", { weekday: "long" }).substring(0, 3)}</div>
            </div>
            <div class="form-field">
              <div class="field-label">*Date</div>
              <div class="field-value">${new Date(fir.incidentDateTime).toLocaleDateString("en-IN")}</div>
            </div>
            <div class="form-field">
              <div class="field-label">*Time</div>
              <div class="field-value">${new Date(fir.incidentDateTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field wide-field">
              <div class="field-label">Information received at P.S. - Date</div>
              <div class="field-value">${new Date(fir.createdAt).toLocaleDateString("en-IN")} Time: ${new Date(fir.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field wide-field">
              <div class="field-label">General Diary Reference / Entry Note</div>
              <div class="field-value">_______________</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-number">4. TYPE OF INFORMATION</div>
          <div class="form-row">
            <div class="form-field">
              <div class="field-label">*Written / Oral</div>
              <div class="field-value">${fir.informationType || "Written"}</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-number">5. PLACE OF OCCURRENCE</div>
          <div class="form-row">
            <div class="form-field">
              <div class="field-label">Direction and Distance from P.S.</div>
              <div class="field-value">${fir.directionDistance || "_______________"}</div>
            </div>
            <div class="form-field">
              <div class="field-label">Beat No.</div>
              <div class="field-value">${fir.beatNumber || "_______________"}</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field wide-field">
              <div class="field-label">*Address</div>
              <div class="field-value">${fir.incidentLocation}</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-number">6. COMPLAINANT / INFORMANT</div>
          <div class="form-row">
            <div class="form-field">
              <div class="field-label">Name</div>
              <div class="field-value">${fir.complainantName}</div>
            </div>
            <div class="form-field">
              <div class="field-label">Father's / Husband's Name</div>
              <div class="field-value">${fir.fatherHusbandName || "_______________"}</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <div class="field-label">Date / Year of Birth</div>
              <div class="field-value">${fir.dateOfBirth || "_______________"}</div>
            </div>
            <div class="form-field">
              <div class="field-label">Nationality</div>
              <div class="field-value">${fir.nationality || "Indian"}</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <div class="field-label">Phone / Mobile No.</div>
              <div class="field-value">${fir.complainantPhone}</div>
            </div>
            <div class="form-field">
              <div class="field-label">Occupation</div>
              <div class="field-value">${fir.occupation || "_______________"}</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field wide-field">
              <div class="field-label">Address</div>
              <div class="field-value">${fir.complainantAddress}</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-number">7. DETAILS OF KNOWN / SUSPECTED / UNKNOWN / ACCUSED</div>
          <div class="form-row">
            <div class="form-field wide-field">
              <div class="field-label">Name, Father's / Husband's Name, Address, Contact No. (Attach separate sheet if necessary)</div>
              <div class="field-value" style="min-height: 40px;">_______________</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-number">8. INCIDENT DETAILS</div>
          <div class="form-row">
            <div class="form-field wide-field">
              <div class="field-label">Incident Type / Category</div>
              <div class="field-value">${fir.incidentType}</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-field wide-field">
              <div class="field-label">Detailed Description of Offence</div>
              <div class="field-value" style="min-height: 80px; white-space: pre-wrap; line-height: 1.4;">${fir.description}</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-number">9. REASON FOR DELAY IN REPORTING</div>
          <div class="form-row">
            <div class="form-field wide-field">
              <div class="field-label">Reasons by Complainant / Informant</div>
              <div class="field-value" style="min-height: 40px;">${fir.reasonForDelay || "_______________"}</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-number">10. PROPERTIES STOLEN / INVOLVED</div>
          <div class="form-row">
            <div class="form-field wide-field">
              <div class="field-label">List of Properties (Attach separate sheet if necessary)</div>
              <div class="field-value" style="min-height: 60px; white-space: pre-wrap; line-height: 1.4;">${fir.propertiesInvolved || "_______________"}</div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-number">11. PRIORITY & STATUS</div>
          <div class="form-row">
            <div class="form-field">
              <div class="field-label">Priority</div>
              <div class="field-value">${fir.priority}</div>
            </div>
            <div class="form-field">
              <div class="field-label">Status</div>
              <div class="field-value">${fir.status}</div>
            </div>
          </div>
        </div>

        <div class="bns-sections">
          <div class="bns-title">APPLICABLE BNS SECTIONS & LEGAL FRAMEWORK</div>
          <div class="bns-item">
            <strong>Primary Section:</strong> ${fir.bnsSection || "To be determined"}
          </div>
          ${fir.bnsSections && fir.bnsSections.length > 0 ? `<div class="bns-item"><strong>Applicable Sections:</strong> ${fir.bnsSections.join(", ")}</div>` : ""}
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <p>Investigating Officer<br/>Signature & Date</p>
          </div>
          <div class="signature-box">
            <p>Station In-Charge<br/>Signature & Date</p>
          </div>
          <div class="signature-box">
            <p>Date: ${new Date().toLocaleDateString("en-IN")}</p>
          </div>
        </div>

        <div class="footer">
          <p>This is an electronically generated FIR under Section 154 Cr.P.C (Bharatiya Nyaya Sanhita, 2023)</p>
          <p>Generated on: ${new Date().toLocaleString("en-IN")} | Valid without manual signature</p>
          <p>FIR Reference: ${fir.firNumber} | Officer Badge: ${fir.assignedOfficer}</p>
        </div>
      </div>
    </body>
    </html>
  `

  return htmlContent
}

let selectedBNSSections: string[] = []

export const generateFIRPDFWithSections = (fir: FIR, sections: string[]): string => {
  selectedBNSSections = sections
  return generateFIRPDF(fir, sections)
}

export const downloadFIRPDF = (fir: FIR, bnsSuggestions?: string[]): Blob => {
  const htmlContent = generateFIRPDF(fir, bnsSuggestions)

  const blob = new Blob([htmlContent], { type: "text/html" })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `FIR_${fir.firNumber}_${new Date().getTime()}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Don't revoke immediately - keep blob for preview
  setTimeout(() => URL.revokeObjectURL(url), 100)

  return blob
}

export const printFIRPDF = (fir: FIR, bnsSuggestions?: string[]) => {
  const htmlContent = generateFIRPDF(fir, bnsSuggestions)

  const printWindow = window.open("", "", "width=900,height=1200")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}
